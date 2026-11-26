# Frequency

A one-page radio for Soniaa S., Fractional CMO. Tune through four chapters of her story; every station comes from her LinkedIn profile.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

Production build: `npm run build && npm start`. To build while `npm run dev` is running, use a separate folder: `NEXT_DIST_DIR=.next-prod npm run build`.

## Deploy (Vercel)

1. On Vercel: **Add New → Project**, import the GitHub repo. Next.js is detected; keep the defaults and deploy.
2. **Storage → Create / Connect Database → Upstash for Redis** (free), connect it to this project. It adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. **Settings → Environment Variables**: add `ADMIN_KEY` (any long random string).
4. **Deployments → Redeploy** so the new variables take effect.
5. Messages from visitors: `https://<your-app>.vercel.app/api/admin?key=<ADMIN_KEY>`.

Storage: Redis when those variables are set (Vercel), SQLite otherwise (local). Without Redis on Vercel the site still works, but counts and messages reset.

## Where things live

| Path | What |
|---|---|
| `lib/stations.js` | All 39 stations and the voice scripts (`STORY`) |
| `lib/radio.js` | Tuning, sound, voice, auto play, music, engagement |
| `app/api/*`, `lib/db.js` | Events, messages, live counts, admin inbox (Redis on Vercel, SQLite locally) |
| `public/voice/` | Voice clips. Regenerate after editing `STORY`: `node scripts/voice.mjs` |
| `public/music/` | Background loop (8 min cut of "Quiet Outpost") |
