// Regenerate the station voice clips after editing STORY in lib/stations.js:
//   node scripts/voice.mjs            all stations
//   node scripts/voice.mjs bosch mdu  only these
// Uses Microsoft's free neural voices through edge-tts (needs uv installed), plus ffmpeg for SPOKEN clips.
import { execFileSync } from 'node:child_process';
import { STORY } from '../lib/stations.js';

const VOICE = 'en-IN-NeerjaExpressiveNeural';

// Stations whose spoken audio differs from the on-screen STORY text.
// There is no Punjabi voice, and the English voice mispronounces the greeting, so the Hindi voice reads it.
// The result is loudness-matched to the other clips (about -20 LUFS).
const SPOKEN = {
  punjabi: { voice: 'hi-IN-SwaraNeural', text: 'सत श्री अकाल! Punjabi is on my list too.', lufs: -20.2 },
};

const only = process.argv.slice(2);
for (const [id, story] of Object.entries(STORY)) {
  if (only.length && !only.includes(id)) continue;
  const out = `public/voice/${id}.mp3`, s = SPOKEN[id];
  if (!s) {
    execFileSync('uvx', ['edge-tts', '--voice', VOICE, '--rate=-5%', '--text', story, '--write-media', out], { stdio: 'inherit' });
  } else {
    const raw = `public/voice/${id}.raw.mp3`;
    execFileSync('uvx', ['edge-tts', '--voice', s.voice, '--rate=-5%', '--text', s.text, '--write-media', raw], { stdio: 'inherit' });
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-af', `loudnorm=I=${s.lufs}:TP=-2:LRA=7`, '-ar', '24000', '-ac', '1', '-b:a', '48k', out], { stdio: 'inherit' });
    execFileSync('rm', [raw]);
  }
  console.log('✓', id);
}
