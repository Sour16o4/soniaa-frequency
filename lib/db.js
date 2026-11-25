// Server-only store: node:sqlite (built into Node >= 22.13), no extra dependency.
import { DatabaseSync } from 'node:sqlite';

const g = globalThis; // survive Next dev hot reloads
// Opened lazily: `next build` imports routes in parallel workers and must not touch the file.
function db() {
  if (g.__db) return g.__db;
  const d = new DatabaseSync(process.env.DB_PATH || 'data.db', { timeout: 3000 });
  d.exec('pragma journal_mode = wal');
  d.exec(`
  create table if not exists events  (id integer primary key, sid text, type text, value text, ts integer default (unixepoch()));
  create table if not exists messages(id integer primary key, sid text, name text, contact text, body text, ts integer default (unixepoch()));
  `);
  return (g.__db = d);
}

export const TYPES = new Set(['visit', 'section', 'tune', 'band', 'auto', 'outbound']);
export const SECTIONS = ['radio', 'guide', 'broadcast'];
export const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export const addEvent = (sid, type, value) => db().prepare('insert into events(sid,type,value) values (?,?,?)').run(sid, type, value);
export const addMessage = (sid, name, contact, body) => db().prepare('insert into messages(sid,name,contact,body) values (?,?,?,?)').run(sid, name, contact, body);
export const allMessages = () => db().prepare('select * from messages order by id desc').all();

export function pulse() {
  const one = (sql, ...a) => db().prepare(sql).get(...a).c;
  return {
    visitors: one(`select count(distinct sid) c from events where type='visit'`),
    tuned: one(`select count(*) c from (select distinct sid, value from events where type='tune')`),
    reached: Object.fromEntries(SECTIONS.map(s => [s, one(`select count(distinct sid) c from events where type='section' and value=?`, s)])),
    top: db().prepare(`select value, count(distinct sid) c from events where type='tune' group by value order by c desc limit 3`).all(),
    messages: one('select count(*) c from messages'),
  };
}

// ponytail: in-memory per-IP limiter, resets on restart; use a shared store if this ever runs multi-instance
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
