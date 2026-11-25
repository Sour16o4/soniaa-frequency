'use client';
import { useEffect } from 'react';
import { start } from '@/lib/radio';
import { BANDS, STATIONS, LINKEDIN } from '@/lib/stations';

export default function Page() {
  useEffect(() => { start(); }, []);

  return (
    <main className="room">
      <header className="top wrap">
        <span className="brand"><img src="/icon.svg" alt="" width="26" height="26" />Soniaa S.<span className="b-sub"> · Broadcast</span></span>
        <span className="hint">most marketing is noise. <em>tune in.</em></span>
        <span className="live">On air</span>
      </header>

      <h1 className="wrap headline" aria-label="Find the clear signal"><span className="w1">find the</span> <span className="clear">clear</span> <span className="w2">signal.</span></h1>

      <section className="wrap" id="radio" data-sec="radio" aria-label="Radio">
        <div className="radio">
          <ol className="story" aria-label="Story, in four chapters">
            {BANDS.map((b, i) => (
              <li key={b.id}>
                <button type="button" className="chap" data-band={b.id} aria-current={i === 0 ? 'step' : undefined}>
                  <span className="c-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="c-t"><b>{b.story}</b><span>{b.label} · {b.name}</span></span>
                  <span className="c-p" data-prog={b.id}>0/{STATIONS.filter(s => s.band === b.id).length}</span>
                  <span className="c-bar" aria-hidden="true"><i data-bar={b.id} /></span>
                </button>
              </li>
            ))}
          </ol>
          <div className="speaker" aria-hidden="true">
            <div className="grille" />
            <div className="cone" id="cone"><i /><i /><i /></div>
            <div className="badge">S·S</div>
          </div>

          <div className="face">
            <div className="lcd" id="lcd">
              <canvas id="snow" aria-hidden="true" />
              <div className="lcd-top"><span id="lcdBand">FM STEREO</span><span id="lcdSig" aria-hidden="true">SIGNAL ▯▯▯▯▯</span></div>
              <div className="lcd-freq"><span id="lcdFreq">104.1</span><small id="lcdUnit">MHz</small></div>
              <div className="lcd-name" id="lcdName">POWERING ON…</div>
            </div>
            <canvas className="scope" id="scope" aria-hidden="true" />
            <article className="transcript" id="transcript" aria-live="polite">
              <p className="t-hint">Turn the dial. Somewhere in the static is a clear voice.</p>
            </article>
          </div>

          <div className="controls">
            <div className="knob-wrap">
              <div className="knob" id="knob" aria-hidden="true"><div className="knob-cap" id="knobCap"><i /></div></div>
              <span className="knob-label">Tuning</span>
            </div>
            <div className="seek">
              <button type="button" id="prev" aria-label="Previous station in the story">◀ Prev</button>
              <button type="button" id="next" aria-label="Next station in the story">Next ▶</button>
              <button type="button" id="sound" aria-pressed="false">Radio sound ▶</button>
              <button type="button" id="voice" className="invite" aria-pressed="false">Play voice ▶</button>
              <button type="button" id="auto" aria-pressed="false">Auto play ▶</button>
              <button type="button" id="music" aria-pressed="false"><span className="eq" aria-hidden="true"><i /><i /><i /><i /></span><span className="m-lbl">Background music ▶</span></button>
              <p className="now-playing" id="nowPlaying" hidden>Now playing · Quiet Outpost</p>
            </div>
          </div>

          <div className="dial" id="dial" tabIndex={0} role="slider" aria-label="Tuning dial" aria-valuemin={0} aria-valuemax={1000} aria-valuenow={0}>
            <div className="dial-scale" id="scale" />
            <div className="needle" id="needle" />
            <div className="dial-glass" aria-hidden="true" />
          </div>
          <div className="found"><span id="found">0 / {STATIONS.length} stations found</span><span>Press Next ▶ to follow the story, or tune freely with the dial and knob</span></div>
        </div>
      </section>

      <section className="wrap guide" id="guide" data-sec="guide" aria-labelledby="guide-h">
        <div className="guide-card">
          <div className="guide-head">
            <h2 id="guide-h">Station guide</h2>
            <span>The story in order · tap any station to tune</span>
          </div>
          <div className="guide-cols">
            {BANDS.map((b, ci) => (
              <div key={b.id}>
                <h3><span>{String(ci + 1).padStart(2, '0')}</span> {b.story} · {b.label}</h3>
                <ol>
                  {STATIONS.filter(s => s.band === b.id).sort((x, y) => x.f - y.f).map((s, si) => (
                    <li key={s.id}>
                      <button type="button" data-tune={s.id}>
                        <span className="g-i">{si + 1}</span>
                        <span className="g-f">{b.year ? Math.floor(s.f) : s.f.toFixed(b.digits)}</span>
                        <span className="g-n">{s.name}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap onair" id="broadcast" data-sec="broadcast" aria-labelledby="air-h">
        <div className="onair-card">
          <div>
            <span className="tag"><i /> Open frequency 107.9</span>
            <h2 id="air-h">Broadcast to Soniaa.</h2>
            <p>One clear signal beats twelve loud ones. Send yours.</p>
            <form id="form" noValidate>
              <label htmlFor="f-name">Your name<input id="f-name" name="name" autoComplete="name" maxLength={80} required /></label>
              <label htmlFor="f-contact">Email or LinkedIn (optional)<input id="f-contact" name="contact" maxLength={120} /></label>
              <label htmlFor="f-body">Your signal<textarea id="f-body" name="body" maxLength={1200} rows={4} required placeholder="What would you like to talk to Soniaa about?" /></label>
              <input className="hp" id="f-website" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <p className="err" id="err" role="alert" />
              <button className="tx" id="send" type="submit">Transmit</button>
            </form>
            <p className="li">Or reach her directly: <a href={LINKEDIN} target="_blank" rel="noopener" data-out="linkedin">linkedin.com/in/soniaspecialist ↗</a></p>
          </div>
          <div className="meter-panel">
            <span className="tag">Live from this page</span>
            <div className="stats">
              <div><b id="p-vis">–</b><span>visits</span></div>
              <div><b id="p-tuned">–</b><span>stations tuned</span></div>
              <div><b id="p-msg">–</b><span>signals received</span></div>
            </div>
            <div className="top-st"><span className="tag">Most tuned</span><ol id="p-top"><li>Waiting for listeners…</li></ol></div>
            <p className="fine">Anonymous counts only. No cookies, no names unless you transmit.</p>
          </div>
        </div>
      </section>

      <footer className="wrap foot">Every station is taken from Soniaa S.’s LinkedIn profile. <span id="api-note" /></footer>

      <nav className="tabbar" aria-label="Sections">
        <a href="#radio" data-tab="radio"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="8" width="18" height="12" rx="2" /><circle cx="15.5" cy="14" r="3" /><path d="M7 12h3M7 16h3M6 8l10-5" /></svg>Radio</a>
        <a href="#guide" data-tab="guide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></svg>Guide</a>
        <a href="#broadcast" data-tab="broadcast"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z" /><path d="M11.5 13.5L20 4" /></svg>Transmit</a>
      </nav>
    </main>
  );
}
