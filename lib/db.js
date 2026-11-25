// Server-only store with two backends, same API (all async):
//  - Upstash Redis (REST, no SDK) when its env vars are set: the Vercel setup, shared and persistent.
//  - node:sqlite otherwise: local dev. On Vercel without Redis it falls back to /tmp, which works but resets.
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = !!(REDIS_URL && REDIS_TOKEN);

export const TYPES = new Set(['visit', 'section', 'tune', 'band', 'auto', 'outbound']);
export const SECTIONS = ['radio', 'guide', 'broadcast'];
export const clip = (v, n) => String(v ?? '').trim().slice(0, n);

/* ---------- Redis (Upstash REST pipeline) ---------- */
async function redis(cmds) {
  const r = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST', headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(cmds), cache: 'no-store',
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return (await r.json()).map(x => { if (x.error) throw new Error(x.error); return x.result; });
}
const K = 'freq:'; // key prefix, so the database can be shared with other projects

const R = {
  async addEvent(sid, type, value) {
    if (type === 'visit') return redis([['SADD', K + 'visitors', sid]]);
    if (type === 'section') return redis([['SADD', K + 'sec:' + value, sid]]);
    if (type === 'tune') {
      const [isNew] = await redis([['SADD', K + 'tunes', sid + '|' + value]]);
      if (isNew) await redis([['ZINCRBY', K + 'top', 1, value]]); // count each visitor once per station
      return;
    }
    return redis([['INCR', K + 'ev:' + type]]);
  },
  addMessage: (sid, name, contact, body) =>
    redis([['LPUSH', K + 'messages', JSON.stringify({ sid, name, contact, body, ts: Math.floor(Date.now() / 1000) })]]),
  async allMessages() {
    const [list] = await redis([['LRANGE', K + 'messages', 0, -1]]);
    return list.map(s => JSON.parse(s));
  },
  async pulse() {
    const res = await redis([
      ['SCARD', K + 'visitors'], ['SCARD', K + 'tunes'], ['LLEN', K + 'messages'],
      ['ZREVRANGE', K + 'top', 0, 2, 'WITHSCORES'],
      ...SECTIONS.map(s => ['SCARD', K + 'sec:' + s]),
    ]);
    const [visitors, tuned, messages, topFlat, ...secs] = res, top = [];
    for (let i = 0; i < topFlat.length; i += 2) top.push({ value: topFlat[i], c: Number(topFlat[i + 1]) });
    return { visitors, tuned, reached: Object.fromEntries(SECTIONS.map((s, i) => [s, secs[i]])), top, messages };
  },
};

/* ---------- SQLite (local) ---------- */
const g = globalThis; // survive Next dev hot reloads
// Opened lazily and imported dynamically: `next build` imports routes in parallel workers and must not touch the file.
async function sqlite() {
  if (g.__db) return g.__db;
  const { DatabaseSync } = await import('node:sqlite');
  const d = new DatabaseSync(process.env.DB_PATH || (process.env.VERCEL ? '/tmp/data.db' : 'data.db'), { timeout: 3000 });
  d.exec('pragma journal_mode = wal');
  d.exec(`
  create table if not exists events  (id integer primary key, sid text, type text, value text, ts integer default (unixepoch()));
  create table if not exists messages(id integer primary key, sid text, name text, contact text, body text, ts integer default (unixepoch()));
  `);
  return (g.__db = d);
}

const S = {
  addEvent: async (sid, type, value) => (await sqlite()).prepare('insert into events(sid,type,value) values (?,?,?)').run(sid, type, value),
  addMessage: async (sid, name, contact, body) => (await sqlite()).prepare('insert into messages(sid,name,contact,body) values (?,?,?,?)').run(sid, name, contact, body),
  allMessages: async () => (await sqlite()).prepare('select * from messages order by id desc').all(),
  async pulse() {
    const db = await sqlite(), one = (sql, ...a) => db.prepare(sql).get(...a).c;
    return {
      visitors: one(`select count(distinct sid) c from events where type='visit'`),
      tuned: one(`select count(*) c from (select distinct sid, value from events where type='tune')`),
      reached: Object.fromEntries(SECTIONS.map(s => [s, one(`select count(distinct sid) c from events where type='section' and value=?`, s)])),
      top: db.prepare(`select value, count(distinct sid) c from events where type='tune' group by value order by c desc limit 3`).all(),
      messages: one('select count(*) c from messages'),
    };
  },
};

export const { addEvent, addMessage, allMessages, pulse } = useRedis ? R : S;

// ponytail: in-memory per-IP limiter, per instance; good enough to stop a burst, not a determined attacker
const hits = g.__hits ??= new Map();
export function limited(req, max) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  const now = Date.now(), h = hits.get(ip + max) || { n: 0, t: now };
  if (now - h.t > 60_000) { h.n = 0; h.t = now; }
  hits.set(ip + max, h);
  return ++h.n > max;
}

export async function readJson(req) {
  const s = await req.text();
  if (s.length > 4096) throw new Error('too large');
  return JSON.parse(s || '{}');
}
