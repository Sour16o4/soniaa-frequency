// Imperative layer for the radio: tuning physics, static, scope, audio, engagement.
// ponytail: one-shot init guarded against React StrictMode double-mount; the page never unmounts.
import { BANDS, STATIONS, STORY } from './stations';

export function start() {
  if (window.__radio) return; window.__radio = true;
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* ---------- engagement ---------- */
  let sid; try { sid = sessionStorage.getItem('sid') || crypto.randomUUID(); sessionStorage.setItem('sid', sid); } catch { sid = crypto.randomUUID(); }
  const track = (type, value = '') => fetch('/api/event', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sid, type, value }), keepalive: true }).catch(() => {});
  track('visit', document.referrer ? new URL(document.referrer).hostname : '');
  const seenSec = new Set();
  const io = new IntersectionObserver(es => es.forEach(e => { const s = e.target.dataset.sec; if (e.isIntersecting && !seenSec.has(s)) { seenSec.add(s); track('section', s); } }), { threshold: .3 });
  document.querySelectorAll('[data-sec]').forEach(s => io.observe(s));
  // mobile tab bar: light the tab whose section crosses the middle of the screen
  const tabs = document.querySelectorAll('.tabbar a');
  const mid = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; tabs.forEach(t => t.dataset.tab === e.target.dataset.sec ? t.setAttribute('aria-current', 'location') : t.removeAttribute('aria-current')); }), { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-sec]').forEach(s => mid.observe(s));
  document.querySelectorAll('[data-out]').forEach(a => a.addEventListener('click', () => track('outbound', a.dataset.out)));

  /* ---------- model ---------- */
  const bands = BANDS.map(b => {
    const st = STATIONS.filter(s => s.band === b.id).sort((a, c) => a.f - c.f);
    st.forEach((s, i) => { s.p = (i + .5) / st.length; });
    return { ...b, st, w: .26 / st.length, v: 0 };
  });
  const byId = Object.fromEntries(STATIONS.map(s => [s.id, s]));
  let bi = 0, v = 0, target = 0, dragging = false, locked = null, sig = 0, booting = true;
  let found = new Set(); try { found = new Set(JSON.parse(localStorage.getItem('found') || '[]')); } catch {}

  ['pointerdown', 'keydown', 'wheel'].forEach(ev => addEventListener(ev, () => { booting = false; }, { capture: true, passive: true }));
  const B = () => bands[bi];
  const fmt = f => B().year ? String(Math.floor(f)) : f.toFixed(B().digits);
  function freqAt(x) {
    const b = B(), k = [[0, b.min], ...b.st.map(s => [s.p, s.f]), [1, b.max]];
    for (let i = 1; i < k.length; i++) if (x <= k[i][0]) { const [x0, y0] = k[i - 1], [x1, y1] = k[i]; return y0 + (y1 - y0) * ((x - x0) / (x1 - x0 || 1)); }
    return b.max;
  }
  function nearest(x) { let best = null, bs = 0; for (const s of B().st) { const q = Math.exp(-(((x - s.p) / B().w) ** 2)); if (q > bs) { bs = q; best = s; } } return [best, bs]; }

  /* ---------- dial scale ---------- */
  const scale = $('#scale');
  function drawScale() {
    scale.replaceChildren();
    for (let i = 0; i <= 60; i++) { const t = el('i', i % 5 ? 'tick' : 'tick big'); t.style.left = (i / 60 * 100) + '%'; scale.append(t); }
    B().st.forEach((s, i) => {
      const m = el('button', 'mark' + (i % 2 ? ' low' : '') + (s.p < .08 ? ' first' : s.p > .92 ? ' last' : '')); m.type = 'button'; m.style.left = (s.p * 100) + '%'; m.tabIndex = -1;
      const b = el('b'); b.append(el('em', null, String(i + 1)), el('small', null, ` · ${fmt(s.f)}`)); m.append(b, el('span', null, s.name)); m.dataset.id = s.id;
      m.onclick = () => seekTo(s); scale.append(m);
    });
    document.querySelectorAll('.chap').forEach(b => { const on = b.dataset.band === B().id; on ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'); });
    $('#lcdBand').textContent = `CH ${bi + 1}/${bands.length} · ${B().label} · ${B().name.toUpperCase()}`; $('#lcdUnit').textContent = B().unit;
    progress();
  }
  // per-chapter progress on the story strip
  function progress() {
    bands.forEach(b => {
      const n = b.st.filter(s => found.has(s.id)).length;
      const p = document.querySelector(`[data-prog="${b.id}"]`), bar = document.querySelector(`[data-bar="${b.id}"]`);
      if (p) p.textContent = `${n}/${b.st.length}`; if (bar) bar.style.width = (n / b.st.length * 100) + '%';
    });
  }

  /* ---------- transcript ---------- */
  const tr = $('#transcript');
  function showStation(s) {
    tr.replaceChildren(); tr.classList.remove('lost');
    const lines = [];
    const idx = B().st.indexOf(s), n = B().st.length;
    const head = el('div', 't-head'); head.append(el('span', 't-f', `Chapter ${bi + 1} · ${B().story} · Station ${idx + 1} of ${n}`), el('span', 't-n', `${B().label} ${fmt(s.f)} ${B().unit}`.trim())); lines.push(head);
    if (s.greet) lines.push(el('div', 't-greet', s.greet));
    if (s.quote) lines.push(el('blockquote', 't-quote', '“' + s.quote.replace(/^…/, '…') + '”'));
    if (s.title) lines.push(el('h3', 't-title', s.title));
    (s.meta || []).forEach(m => lines.push(el('div', 't-meta', m)));
    if (s.stats) { const g = el('div', 't-stats'); s.stats.forEach(([n, l]) => { const d = el('div'); d.append(el('b', null, n), el('span', null, l)); g.append(d); }); lines.push(g); }
    (s.body || []).forEach(b => lines.push(el('p', 't-body', b)));
    if (STORY[s.id]) { const d = el('details', 't-story'); d.append(el('summary', null, 'On air · read the story'), el('small', null, 'AI voice (Microsoft Neerja) reading her profile in first person.'), el('p', null, STORY[s.id])); lines.push(d); }
    if (idx === n - 1) {
      const cue = el('div', 't-next');
      if (bi < bands.length - 1) cue.textContent = `End of chapter ${bi + 1}. Next ▶ starts chapter ${bi + 2}: ${bands[bi + 1].story}.`;
      else { cue.textContent = 'That’s the whole story. '; const a = el('a', null, 'Broadcast to Soniaa ↓'); a.href = '#broadcast'; cue.append(a); }
      lines.push(cue);
    }
    lines.forEach((l, i) => { l.classList.add('line'); l.style.animationDelay = (reduce ? 0 : i * 110) + 'ms'; tr.append(l); });
  }

  /* ---------- seeking ---------- */
  function seekTo(s) {
    const nb = bands.findIndex(b => b.id === s.band);
    if (nb !== bi) switchBand(nb);
    target = s.p; if (reduce) v = target;
  }
  function switchBand(n) {
    B().v = v; bi = n; v = B().v; target = v; locked = null; drawScale(); track('band', B().id);
  }
  function step(dir) {
    const st = B().st;
    let i = dir > 0 ? st.findIndex(s => s.p > v + .002) : [...st].reverse().findIndex(s => s.p < v - .002);
    if (dir < 0 && i >= 0) i = st.length - 1 - i;
    if (i < 0) {
      const nb = bi + dir;
      if (nb >= bands.length) { $('#broadcast').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; }
      if (nb < 0) return;
      switchBand(nb); const s2 = dir > 0 ? B().st[0] : B().st.at(-1); v = dir > 0 ? 0 : 1; target = s2.p; return;
    }
    target = st[i].p;
  }
  function snap() { const [s, q] = nearest(v); if (s && q > .15) target = s.p; }

  /* ---------- input: dial, knob, wheel, keys ---------- */
  const dial = $('#dial'), knob = $('#knob');
  const setFromX = x => { const r = dial.getBoundingClientRect(); v = target = Math.max(0, Math.min(1, (x - r.left - 18) / (r.width - 36))); };
  dial.addEventListener('pointerdown', e => { if (e.target.closest('.mark')) return; dragging = true; dial.setPointerCapture(e.pointerId); setFromX(e.clientX); });
  dial.addEventListener('pointermove', e => { if (dragging) setFromX(e.clientX); });
  const end = () => { if (dragging) { dragging = false; snap(); } };
  dial.addEventListener('pointerup', end); dial.addEventListener('pointercancel', end);
  let ka = null;
  const ang = e => { const r = knob.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2); };
  knob.addEventListener('pointerdown', e => { ka = ang(e); dragging = true; knob.setPointerCapture(e.pointerId); });
  knob.addEventListener('pointermove', e => { if (ka == null) return; let a = ang(e), d = a - ka; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; ka = a; v = target = Math.max(0, Math.min(1, v + d / (Math.PI * 6))); });
  const kend = () => { if (ka != null) { ka = null; dragging = false; snap(); } };
  knob.addEventListener('pointerup', kend); knob.addEventListener('pointercancel', kend);
  let wt;
  [dial, knob].forEach(n => n.addEventListener('wheel', e => { e.preventDefault(); v = target = Math.max(0, Math.min(1, v + (e.deltaY || e.deltaX) * .0005)); clearTimeout(wt); wt = setTimeout(snap, 220); }, { passive: false }));
  dial.addEventListener('keydown', e => {
    const k = e.key, big = e.shiftKey ? 5 : 1;
    if (k === 'ArrowRight' || k === 'ArrowUp') { v = target = Math.min(1, v + .004 * big); clearTimeout(wt); wt = setTimeout(snap, 400); }
    else if (k === 'ArrowLeft' || k === 'ArrowDown') { v = target = Math.max(0, v - .004 * big); clearTimeout(wt); wt = setTimeout(snap, 400); }
    else if (k === 'PageUp') step(1); else if (k === 'PageDown') step(-1);
    else if (k === 'Home') target = B().st[0].p; else if (k === 'End') target = B().st.at(-1).p;
    else return;
    e.preventDefault();
  });
  $('#prev').onclick = () => step(-1); $('#next').onclick = () => step(1);
  document.querySelectorAll('.chap').forEach(b => b.onclick = () => { const n = bands.findIndex(x => x.id === b.dataset.band); if (n !== bi) { switchBand(n); v = 0; target = B().st[0].p; } });
  document.querySelectorAll('[data-tune]').forEach(b => b.onclick = () => { seekTo(byId[b.dataset.tune]); $('#radio').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); });

  /* ---------- radio sound: real tuning noise that follows the needle (Web Audio, generated live) ---------- */
  // Static hisses only while the dial moves, a heterodyne whistle slides down as a station gets close, a click on lock.
  // Browsers block sound until the visitor clicks, so it starts off; a click on Voice, Radio sound or Auto turns it on.
  let ac, tunesOn = false, tunesTouched = false, rx = null, act = 0;
  const LOCK_MS = 350;                                     // the voice starts just after the lock click
  const getAC = () => { try { ac ??= new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch {} return ac; };
  function buildRx() {
    const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = .7;
    const n = ac.createGain(); n.gain.value = 0;
    const osc = ac.createOscillator(); osc.type = 'sine';
    const w = ac.createGain(); w.gain.value = 0;
    src.connect(bp).connect(n).connect(ac.destination); osc.connect(w).connect(ac.destination);
    src.start(); osc.start();
    rx = { bp, n, osc, w };
  }
  // called every frame: q = signal strength, dist = distance to the nearest station on the dial
  function rxUpdate(q, moving, dist, dt) {
    act += ((moving ? 1 : 0) - act) * Math.min(1, dt * (moving ? 14 : 5));   // fades out ~0.3s after the needle stops
    if (!rx) return;
    const t = ac.currentTime, on = tunesOn ? 1 : 0;
    rx.n.gain.setTargetAtTime((1 - q) * .09 * act * on, t, .03);
    rx.bp.frequency.setTargetAtTime(700 + v * 2600, t, .05);
    const whistle = q > .15 && q < .95 ? Math.sin((q - .15) / .8 * Math.PI) * .02 : 0;
    rx.w.gain.setTargetAtTime(whistle * act * on, t, .03);
    rx.osc.frequency.setTargetAtTime(180 + dist * 7000, t, .02);
  }
  function lockClick() {
    if (!tunesOn || !getAC() || ac.state !== 'running') return false;
    const t = ac.currentTime + .01;
    const b = ac.createBuffer(1, ac.sampleRate * .03, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
    const src = ac.createBufferSource(), hp = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = b; hp.type = 'highpass'; hp.frequency.value = 1800; g.gain.value = .25;
    src.connect(hp).connect(g).connect(ac.destination); src.start(t);
    const o = ac.createOscillator(), e = ac.createGain(); o.frequency.value = 110;          // the detent's low thump
    e.gain.setValueAtTime(.12, t); e.gain.exponentialRampToValueAtTime(.0001, t + .07);
    o.connect(e).connect(ac.destination); o.start(t); o.stop(t + .08);
    return true;
  }
  const sb = $('#sound');
  function setTunes(on) {
    tunesOn = on; if (on && getAC() && !rx) buildRx();
    sb.textContent = on ? 'Radio sound on ❚❚' : 'Radio sound ▶'; sb.setAttribute('aria-pressed', on);
  }
  sb.onclick = () => { tunesTouched = true; setTunes(!tunesOn); if (tunesOn) lockClick(); };

  /* ---------- voice: Soniaa's story for the tuned station, pre-recorded from STORY (scripts/voice.mjs) ---------- */
  const clip = new Audio(); clip.preload = 'none'; let voiceOn = false, voiceT;
  const hush = () => { clearTimeout(voiceT); clip.pause(); };
  const vb = $('#voice');
  function setVoice(on) {
    voiceOn = on; vb.classList.remove('invite');
    vb.textContent = on ? 'Voice on ❚❚' : 'Play voice ▶'; vb.setAttribute('aria-pressed', on);
    if (on && !tunesTouched) setTunes(true);             // radio sound comes with the voice unless the visitor muted it
    if (on && !musicOn) setMusic(true);                  // Play voice always brings the background music with it
    if (on && locked) speak(byId[locked]); else hush();
  }
  function speak(s, delay = 0) {
    hush(); if (!voiceOn || !STORY[s.id]) return;
    voiceT = setTimeout(() => {
      if (locked !== s.id) return;
      clip.src = `/voice/${s.id}.mp3`;
      clip.play().catch(e => { if (e.name === 'NotAllowedError') { setVoice(false); vb.classList.add('invite'); } }); // still blocked: say so, don't fake "on"
    }, delay);
  }
  vb.onclick = () => { setVoice(!voiceOn); if (auto && locked) autoQueue(byId[locked]); };

  /* ---------- background music: an ambient loop that ducks under the voice ---------- */
  const music = new Audio('/music/quiet-outpost.mp3'); music.loop = true; music.preload = 'none';
  let musicOn = false, mGain = null;
  const BED = 1, DUCK = .75;                              // music level alone / while Soniaa speaks (stays audible under her)
  const mb = $('#music');
  const speaking = () => !clip.paused && !clip.ended;
  function duck() { if (mGain && musicOn) mGain.gain.setTargetAtTime(speaking() ? DUCK : BED, ac.currentTime, .35); }
  function setMusic(on) {
    musicOn = on; mb.querySelector('.m-lbl').textContent = on ? 'Music on ❚❚' : 'Background music ▶'; mb.setAttribute('aria-pressed', on);
    $('#nowPlaying').hidden = !on;
    if (!on) { if (mGain) mGain.gain.setTargetAtTime(0, ac.currentTime, .25); setTimeout(() => { if (!musicOn) music.pause(); }, 1000); return; }
    if (getAC() && !mGain) { mGain = ac.createGain(); mGain.gain.value = 0; ac.createMediaElementSource(music).connect(mGain).connect(ac.destination); }
    music.play().then(duck).catch(e => { if (e.name === 'NotAllowedError') setMusic(false); });
  }
  mb.onclick = () => setMusic(!musicOn);
  ['play', 'playing', 'pause', 'ended'].forEach(ev => clip.addEventListener(ev, duck));

  /* ---------- auto play: walk the whole story, station by station ---------- */
  // With voice: wait for the clip to end. Without: wait a reading time based on how much text is on screen.
  let auto = false, autoT;
  const ab = $('#auto');
  const readMs = s => Math.min(12000, Math.max(4000, 2500 + [s.quote, s.title, ...(s.meta || []), ...(s.body || [])].join(' ').length * 45));
  function autoQueue(s, extra = 0) {
    clearTimeout(autoT); if (!auto) return;
    autoT = setTimeout(() => {
      if (!auto || locked !== s.id) return;
      if (!clip.paused && !clip.ended) clip.addEventListener('ended', () => { if (auto && locked === s.id) autoT = setTimeout(advance, 1200); }, { once: true });
      else autoT = setTimeout(advance, readMs(s));
    }, 900 + extra); // give the lock click and the clip a moment to start
  }
  function advance() {
    if (bi === bands.length - 1 && locked === B().st.at(-1).id) setAuto(false); // story finished: hand over to the broadcast form
    step(1);
  }
  function setAuto(on) {
    auto = on; clearTimeout(autoT);
    ab.setAttribute('aria-pressed', on); ab.textContent = on ? 'Auto play on ❚❚' : 'Auto play ▶';
    if (on) {
      booting = false; track('auto', '');
      // Auto play switches everything on: voice, radio sound and background music
      if (!tunesOn) setTunes(true);
      if (!musicOn) setMusic(true);
      if (!voiceOn) setVoice(true); else if (locked && clip.paused) speak(byId[locked]); // start reading the current station now
      locked ? autoQueue(byId[locked]) : step(1);
    }
  }
  // The Auto play button is a master switch: on starts everything, off pauses everything.
  // (Auto play stopping by itself, at the story's end or when the visitor grabs the dial, leaves the sound alone.)
  ab.onclick = () => {
    if (!auto) return setAuto(true);
    setAuto(false); setVoice(false); setTunes(false); setMusic(false);
  };
  // taking the dial or knob by hand stops auto play
  [dial, knob].forEach(n => ['pointerdown', 'wheel'].forEach(ev => n.addEventListener(ev, () => { if (auto) setAuto(false); }, { passive: true })));

  /* ---------- canvases ---------- */
  const snow = $('#snow'), sx = snow.getContext('2d'); snow.width = 160; snow.height = 64;
  const img = sx.createImageData(160, 64);
  const scope = $('#scope'), cx = scope.getContext('2d');
  const sizeScope = () => { const r = scope.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); scope.width = r.width * d; scope.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0); };
  sizeScope(); addEventListener('resize', sizeScope);

  /* ---------- render loop ---------- */
  const needle = $('#needle'), cap = $('#knobCap'), cone = $('#cone'), lcdName = $('#lcdName'), lcdFreq = $('#lcdFreq'), lcdSig = $('#lcdSig');
  const GLYPHS = '▓▒░#%&*+=?/\\<>~-_:;'; let t = 0, last = performance.now(), nameShown = '';
  function scramble(text, q) { let o = ''; for (const ch of text) o += ch === ' ' || Math.random() < q ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]; return o; }
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
    if (!dragging) v += (target - v) * (reduce ? 1 : Math.min(1, dt * 6));
    const [s, q] = nearest(v); sig = q;
    rxUpdate(q, dragging || Math.abs(target - v) > .0015, s ? Math.abs(v - s.p) : 1, dt);
    needle.style.left = `calc(18px + (100% - 36px) * ${v.toFixed(4)})`;
    cap.style.transform = `rotate(${v * 1080 + bi * 90}deg)`;
    dial.setAttribute('aria-valuenow', Math.round(v * 1000));
    lcdFreq.textContent = q > .92 && s ? fmt(s.f) : fmt(freqAt(v));
    const bars = Math.round(q * 5); lcdSig.textContent = 'SIGNAL ' + '▮'.repeat(bars) + '▯'.repeat(5 - bars);
    // name: scrambled until clear
    const label = s ? s.name.toUpperCase() : 'STATIC';
    if (q > .92) { if (nameShown !== label) { lcdName.textContent = label; nameShown = label; } }
    else { nameShown = ''; lcdName.textContent = q > .2 ? scramble(label, q * q) : '· · ·  STATIC  · · ·'; }
    dial.setAttribute('aria-valuetext', q > .92 && s ? `${fmt(s.f)} ${B().unit}, ${s.name}` : `${fmt(freqAt(v))} ${B().unit}, static`);
    // lock / unlock
    if (q > .92 && s && locked !== s.id) {
      locked = s.id; showStation(s); if (!booting) { const d = lockClick() ? LOCK_MS : 0; speak(s, d); autoQueue(s, d); } $('#lcd').classList.add('lock');
      if (booting && s.id === 'id') booting = false;
      if (!booting && !found.has(s.id) && (dragging || Math.abs(target - s.p) < .01)) { found.add(s.id); try { localStorage.setItem('found', JSON.stringify([...found])); } catch {} track('tune', s.id); }
      $('#found').textContent = `${found.size} / ${STATIONS.length} stations found` + (found.size === STATIONS.length ? ' · full signal' : '');
      document.querySelectorAll(`[data-tune="${s.id}"]`).forEach(b => b.classList.add('got')); progress();
    } else if (q < .6 && locked) { locked = null; hush(); tr.classList.add('lost'); $('#lcd').classList.remove('lock'); }
    // static
    const noise = 1 - q;
    snow.style.opacity = (noise * .7).toFixed(2);
    if (noise > .03) { const d = img.data; for (let i = 0; i < d.length; i += 4) { const g = Math.random() * 255; d[i] = g; d[i + 1] = g * .7; d[i + 2] = 0; d[i + 3] = 255; } sx.putImageData(img, 0, 0); }
    // scope
    const W = scope.clientWidth, H = scope.clientHeight; cx.clearRect(0, 0, W, H);
    cx.strokeStyle = 'rgba(255,176,0,.18)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(0, H / 2); cx.lineTo(W, H / 2); cx.stroke();
    cx.strokeStyle = '#ffb000'; cx.lineWidth = 2; cx.shadowColor = '#ffb000'; cx.shadowBlur = 8 * q; cx.beginPath();
    for (let x = 0; x <= W; x += 3) { const y = H / 2 + (H * .38) * ((Math.random() * 2 - 1) * noise * .8 + q * (Math.sin(x * .045 + t * 6) * .55 + Math.sin(x * .093 - t * 3.1) * .25)); x ? cx.lineTo(x, y) : cx.moveTo(x, y); }
    cx.stroke(); cx.shadowBlur = 0;
    // speaker breathes with the signal
    cone.style.setProperty('--amp', (q * (1 + Math.sin(t * 9) * .5 + Math.sin(t * 13.7) * .3)).toFixed(3));
    requestAnimationFrame(frame);
  }

  /* ---------- power on: sweep the dial and land on the station ID ---------- */
  drawScale();
  $('#found').textContent = `${found.size} / ${STATIONS.length} stations found`;
  found.forEach(id => document.querySelectorAll(`[data-tune="${id}"]`).forEach(b => b.classList.add('got')));
  v = 1; target = 1;
  setTimeout(() => { target = byId.id.p; }, reduce ? 0 : 500);
  requestAnimationFrame(frame);

  /* ---------- broadcast form ---------- */
  $('#form').addEventListener('submit', async ev => {
    ev.preventDefault();
    const f = ev.target, err = $('#err'), btn = $('#send');
    const data = { sid, name: f.name.value, contact: f.contact.value, body: f.body.value, website: f.website.value };
    if (!data.name.trim() || data.body.trim().length < 10) { err.textContent = 'Add your name and at least a sentence.'; return; }
    err.textContent = ''; btn.disabled = true; btn.textContent = 'Transmitting…';
    try {
      const r = await fetch('/api/message', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'The signal did not go through. Try again in a moment.');
      f.reset(); btn.textContent = 'Received loud and clear'; if (j.pulse) renderPulse(j.pulse);
    } catch (e) { err.textContent = e.message; btn.disabled = false; btn.textContent = 'Transmit'; }
  });

  /* ---------- live pulse ---------- */
  function renderPulse(p) {
    $('#p-vis').textContent = p.visitors; $('#p-tuned').textContent = p.tuned; $('#p-msg').textContent = p.messages;
    const ol = $('#p-top'); ol.replaceChildren();
    (p.top.length ? p.top : [{ value: '', c: 0 }]).forEach(x => { const li = el('li'); if (x.value && byId[x.value]) { const b = el('button', null, byId[x.value].name); b.type = 'button'; b.onclick = () => { seekTo(byId[x.value]); $('#radio').scrollIntoView({ behavior: 'smooth', block: 'center' }); }; li.append(b, el('span', null, `${x.c}`)); } else li.textContent = 'Waiting for listeners…'; ol.append(li); });
  }
  const loadPulse = () => fetch('/api/pulse').then(r => r.ok ? r.json() : Promise.reject()).then(renderPulse).catch(() => { $('#api-note').textContent = 'Live counts are unavailable right now.'; });
  loadPulse(); setInterval(() => { if (!document.hidden) loadPulse(); }, 15000);
}
