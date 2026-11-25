import { addEvent, clip, limited, readJson, SECTIONS, TYPES } from '@/lib/db';
export const runtime = 'nodejs';

export async function POST(req) {
  if (limited(req, 120)) return Response.json({ error: 'Slow down a little.' }, { status: 429 });
  try {
    const { sid, type, value } = await readJson(req);
    if (!TYPES.has(type) || !clip(sid, 64)) return Response.json({ error: 'Unknown event.' }, { status: 400 });
    if (type === 'section' && !SECTIONS.includes(value)) return Response.json({ error: 'Unknown section.' }, { status: 400 });
    addEvent(clip(sid, 64), type, clip(value, 80));
    return new Response(null, { status: 204 });
  } catch { return Response.json({ error: 'Bad request.' }, { status: 400 }); }
}
