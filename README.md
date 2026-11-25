# Frequency

A one-page radio for Soniaa S., Fractional CMO. Tune through four chapters of her story; every station comes from her LinkedIn profile.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

Production build: `npm run build && npm start`. To build while `npm run dev` is running, use a separate folder: `NEXT_DIST_DIR=.next-prod npm run build`.

## Deploy (Render)

1. Push this folder to GitHub.
2. On Render: **New + → Blueprint**, pick the repo. `render.yaml` sets everything up, including a random `ADMIN_KEY`.
3. Messages from visitors: `https://<your-app>.onrender.com/api/admin?key=<ADMIN_KEY>`.

The free plan's disk resets on redeploy, so stored counts and messages start fresh after each deploy.

## Where things live

| Path | What |
|---|---|
| `lib/stations.js` | All 39 stations and the voice scripts (`STORY`) |
| `lib/radio.js` | Tuning, sound, voice, auto play, music, engagement |
| `app/api/*` | Events, messages, live counts, admin inbox (SQLite) |
| `public/voice/` | Voice clips. Regenerate after editing `STORY`: `node scripts/voice.mjs` |
| `public/music/` | Background loop (8 min cut of "Quiet Outpost") |
