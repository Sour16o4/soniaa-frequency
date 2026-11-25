import { allMessages, pulse } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Soniaa's inbox: /api/admin?key=<ADMIN_KEY>. Disabled entirely when ADMIN_KEY is unset.
export function GET(req) {
  const key = new URL(req.url).searchParams.get('key');
  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ pulse: pulse(), messages: allMessages() });
}
