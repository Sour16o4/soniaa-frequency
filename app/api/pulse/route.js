import { pulse } from '@/lib/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = () => Response.json(pulse(), { headers: { 'cache-control': 'no-store' } });
