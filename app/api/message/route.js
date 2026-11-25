import { addMessage, clip, limited, pulse, readJson } from '@/lib/db';
export const runtime = 'nodejs';

export async function POST(req) {
  if (limited(req, 10)) return Response.json({ error: 'Too many messages. Try again in a minute.' }, { status: 429 });
  try {
    const b = await readJson(req);
    if (b.website) return Response.json({ ok: true }); // honeypot: bots fill hidden fields
    const name = clip(b.name, 80), contact = clip(b.contact, 120), body = clip(b.body, 1200);
    if (!name || body.length < 10) return Response.json({ error: 'Add your name and at least a sentence about the problem.' }, { status: 400 });
    await addMessage(clip(b.sid, 64), name, contact, body);
    return Response.json({ ok: true, pulse: await pulse() });
  } catch { return Response.json({ error: 'Bad request.' }, { status: 400 }); }
}
