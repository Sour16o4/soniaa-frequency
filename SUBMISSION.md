# Frequency — Developer Challenge

**Live link:** [ADD DEPLOYED URL]

## What was your idea and why did you choose it?
Soniaa's profile keeps returning to one theme: cut through complication, bring clarity. "I don't believe in complicating things." "I bring structure without chaos."

So the page is a radio. Between stations is static, the noise most marketing makes. Turn the dial and a clear voice comes through: each station is something from her profile. Nothing is invented; every station and every line the voice speaks comes from her LinkedIn profile.

It does not look like a portfolio or read like a résumé. Her career is there, but you discover it by tuning the AM band, which runs from 2002 to 2025, so turning the dial is literally moving through her years.

The radio tells her story in four numbered chapters. Press Next ▶ (or Auto play) and it plays them in order; or tune freely.

1. **Who she is** (FM · Philosophy): her headline, summary and skills
2. **Her journey** (AM · Archive): every role and degree, in date order
3. **Recognition** (LW · Honours): awards and certifications
4. **Her reach** (SW · World): her five languages and her base, then an invitation to broadcast to her

How it sounds: each station has a short spoken story, a real radio tuning sound (static, a whistle as the station nears, a click on lock) plays between stations, and an ambient background track dips under the voice.

## Which technologies, tools and AI platforms did you use, and why?
- **Next.js (App Router, plain JavaScript)**: one project for the page and the API.
- **Canvas + Web Audio**: the static, the oscilloscope, the tuning sound and the music ducking. No animation or audio library; the effects are small enough to write directly.
- **Node's built-in SQLite**: stores anonymous engagement events and messages with zero extra dependencies.
- **edge-tts (Microsoft neural voice, en-IN)**: the 39 station voice clips. The voice is computer-generated, reading her profile in first person; the page says so.
- **Claude Code (Anthropic)**: as a pair: reading the profile PDF, exploring five concepts as mockups, writing and testing the code in a real browser.

## How did you guide AI to achieve your desired outcome?
I gave it the brief and the profile, then pushed back hard. The first versions were too close to a normal portfolio, so I rejected them and asked for concepts that don't list a career at all. I picked Frequency from five mockups and set one firm rule: only details from the CV, nothing added about Soniaa. Then I directed it step by step: a small one-line heading, numbered chapters so the story has a clear order, an Auto play button, a tuning sound that feels like a real radio rather than music, and background music that stays audible under the voice.

## What did you experiment with?
- Text that "tunes in": the station name scrambles and resolves as the signal strengthens.
- A live oscilloscope that turns from noise into a clean wave as you lock on.
- A dial that is also a timeline (the AM band).
- A tuning sound generated live from the needle's position: static while moving, a heterodyne whistle that slides down as a station gets close.
- Background music that ducks under the voice automatically.
- Engagement shown back to the visitor: visits, stations tuned, most-tuned stations.

## What worked and what didn't?
**Worked:** the radio metaphor fits her message exactly, and tuning invites exploration: numbered chapters, a "stations found" counter and the station guide give visitors a reason to keep going.

**Didn't:**
- My first concepts (a particle hero with a timeline, a billboard drive, a lead-scoring console) still felt like a CV in disguise.
- A musical jingle between stations felt like too much to listen to; a real tuning sound that only plays while the needle moves worked better.
- Browsers block sound until the visitor clicks, so the voice could not start on its own. The button now says what it does ("Play voice ▶") instead of showing a misleading "on".
- The dial's automatic sweep was counting stations as "found" as it passed them; now only stations a visitor actually lands on count.

## What would you do differently with more time?
- Record the stories in Soniaa's own voice instead of a computer voice.
- A small dashboard for her to read messages and see which stations people tune to most.
- A persistent database in production (the demo store resets when the server redeploys).
