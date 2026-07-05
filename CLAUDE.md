# JOEL app — project notes

HTML entry: `Extension Detail.html`. React + Babel app loaded from `app/*.jsx`, styles in `assets/*.css`.

## Greeting / AI-voice requirement (per product owner)
- The **AI voice** used for greetings is taken from **Quick Setup** (the business-name pronunciation step).
- The **phonetic spelling** captured in Quick Setup pre-populates the greeting **text** on the Greetings screen (GreetingRow "System default" / "AI voice").
- When a greeting is **saved**, it is rendered **once to an audio file** — the system does NOT run AI text-to-speech on every call. Treat saved greetings as static audio.
- Quick Setup main-greeting step has a **"Use default greeting instead"** toggle: it drops the business name from the greeting. Choosing it should set the main greeting to **System default** on the Greetings settings screen.

## Quick Setup flow (app/quick-setup.jsx)
Steps: intro → name (business name + main greeting combined) → forward → voicemail → hold (music) → ready (review) → texts (Finished).
- Two-number convention: an Active number (green) usable immediately + a Porting number (amber) when `numberPending`.
- "Set up manually instead" dismisses Quick Setup (warns first, then removes it from the sidebar; owner-only).

## Branded "function design" (marketing site)
The canonical way to show how AnyPhone works is the **function list** born on the homepage hero: one row per function — colored icon tile + bold name + outcome chip, rows NEVER wrap to two lines. Component (`.hsteps/.hstep`) + the function color palette (`.fn-number` blue, `.fn-ext` soft yellow, `.fn-fwd` purple, `.fn-vm` green, `.fn-sms` cyan, `.fn-ai` pink) live in `assets/site.css`. Use these exact colors anywhere a function appears (icons, chips, diagram destinations) on ANY page — e.g. anything integrations/AI-related is always pink, voicemail always green.
