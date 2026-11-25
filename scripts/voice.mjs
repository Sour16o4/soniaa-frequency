// Regenerate the station voice clips after editing STORY in lib/stations.js:  node scripts/voice.mjs
// Uses Microsoft's free neural voices through edge-tts (needs uv installed).
import { execFileSync } from 'node:child_process';
import { STORY } from '../lib/stations.js';

const VOICE = 'en-IN-NeerjaExpressiveNeural';
for (const [id, text] of Object.entries(STORY)) {
  execFileSync('uvx', ['edge-tts', '--voice', VOICE, '--rate=-5%', '--text', text, '--write-media', `public/voice/${id}.mp3`], { stdio: 'inherit' });
  console.log('✓', id);
}
