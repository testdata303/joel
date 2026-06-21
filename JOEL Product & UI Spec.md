# JOEL — Product & UI Specification
### Screen-by-screen, feature-by-feature reference for design work

> **What this document is.** A complete description of the JOEL web app as it is currently built — its product thesis, design system, navigation, and every screen and feature. Use it as the source of truth when designing new screens, the marketing site, or any surface that needs to feel like JOEL. When you add something new, make it consistent with what's described here.

---

## 1. Product thesis

**JOEL is a phone system for the modern small business.** One business number sits in front; behind it, the owner assembles whatever capability they want — themselves, their team, AI, contractors, devices, and the tools they already use (Slack, WhatsApp).

The core mental model is **functions, not employees**. Customers don't care who picks up — they want to reach Sales, Support, Scheduling, or Billing. JOEL organizes around those *functions* (called **Extensions**) and lets each one be fulfilled by any mix of people, devices, or software.

Everything the product does ladders up to one promise: **never miss a customer.** Calls, texts, voicemails, and now WhatsApp all converge into JOEL, get routed intelligently, and notify the right person on the channel they actually watch.

**Who uses it.** The business owner/founder (the "Owner" role) sets it up; Admins and Users get scoped access. The reference tenant throughout the app is **"Smilebar"**, a small dental/cleaning business, owner **Bob Stevens** (bob@smilebar.co).

---

## 2. Design system

The app's look is **clean, confident, and restrained** — closer to a well-made fintech dashboard than a telecom tool. White cards on a light-grey canvas, generous spacing, one strong accent color, real type hierarchy, almost no decoration.

### Color
| Token | Hex | Use |
|---|---|---|
| `--blue` | `#2540ee` | Primary brand / actions / active nav / SMS |
| `--blue-soft` | `#eef1ff` | Active states, tints, selection |
| `--ink` | `#0f1115` | Primary text, the JOEL wordmark/logo, dark chips |
| `--body` | `#4a4f59` | Body text |
| `--muted` | `#767c87` | Secondary/label text |
| `--line` / `--line-soft` | `#e7e8ec` / `#f1f2f4` | Borders, dividers |
| `--bg` / `--bg-alt` | `#fff` / `#f7f8fa` | Card surface / app canvas |
| `--ai` | `#6b2fe8` | AI / automation accent (purple) — used for AI greetings, smart features |
| `--green` | `#1bb56a` | Success, "active" status, SMS-approved |
| **`--wa` / `--wa-deep`** | `#1aa356` / `#0e7a3d` | **WhatsApp** — its own green, distinct from the generic success green |
| `--gold` / amber | `#f5a623` | Pending / in-review / warning |
| `--red` | (red-soft pairs) | Destructive, failed, blocked |

**Channel color language (important):** **SMS = blue, WhatsApp = green.** This pairing is used everywhere the two coexist (inbox rows, chips, message bubbles) so the channel is readable at a glance.

### Type
- **Plus Jakarta Sans** for everything (UI, body). Weights 400–800.
- **Archivo Black** only for the **JOEL** wordmark and the round avatar "J" mark (with a subtle `-webkit-text-stroke`).
- Headings are tight: large screen titles ~1.7rem, `font-weight:800`, `letter-spacing:-.03em`.
- Labels/eyebrows: ~0.72rem, weight 800, uppercase, `letter-spacing:.06em`, muted.
- Base body 15px, `line-height:1.5`.

### Shape, depth, motion
- **Radii:** cards 16px, rows/controls 10–14px, pills/badges 20px (fully round).
- **Shadows are whisper-soft:** `--shadow-card: 0 1px 2px rgba(15,17,21,.04)`. Popovers get `--shadow-pop` (big, soft). Never heavy or glossy.
- **Transitions** are short (0.12–0.18s) on hover/state. No decorative looping animation. A small `pop` keyframe for menus/popovers.

### Core components (reused across every screen)
- **Card** — white, 1px border, 16px radius, soft shadow. Optional header with an icon tile, title, description, and a right-aligned action slot.
- **List view (`lv-table`)** — the canonical list: a card containing an uppercase header row + grid rows (`1fr auto 28px`: main / meta / chevron). Hover tint. Used for Extensions, etc.
- **Row (`ss-row`)** — icon tile · main (bold title + muted meta) · trailing control. The workhorse for settings and grouped lists.
- **Toggle** — pill switch. **Segmented** — 2–3 option tab control. **Choice** — radio cards. **Field** — labelled input/select with help text. **Modal** — centered dialog with icon, title, desc, body, footer buttons. **Avatar** — round initials. **Status dots/pills** — colored `g`/`a`/`r` (green/amber/red).
- **Badges/pills** — small round tags; colored variants for status (on/off/pending/fail).
- **Icons** — Lucide-style 2px line icons, custom set in `ui.jsx` (phone, message, route, forward, bell, slack, whatsapp, etc.).
- **Buttons** — `btn-primary` (blue fill), `btn-secondary` (white, bordered), `btn-danger` (red, used sparingly), plus small `sm` variants.

### Voice & copy
Plain, warm, owner-friendly. Explains the *why* in one line ("What callers hear before they're routed, and after hours"). Avoids jargon; when a technical term is unavoidable (A2P, CNAM, SIP), it's paired with a human gloss. Never salesy inside the product. Numbers and money are de-emphasized, not bolded for emphasis.

---

## 3. Layout & navigation

**App shell:** a fixed **left sidebar** (236px) + a **top bar** (search, notifications, account) + a scrolling content area that renders the active screen inside a centered `.page` column.

**Sidebar brand:** round black "J" mark + "JOEL" wordmark (Archivo Black), then a **business switcher** tile (the current tenant, "Smilebar").

The sidebar is grouped:

**(top, ungrouped)**
- **Calls & Voicemails** — call + voicemail activity
- **Texts** — the unified message inbox (SMS + WhatsApp)

**Quick Setup** *(a dotted onboarding group; appears until setup is complete / dismissed)*
- **Take Calls** (the guided wizard)
- **SMS Registration**
- **Slack** (notifications integration)
- **WhatsApp** (enable WhatsApp on the number)

**System**
- **Extensions**
- **Call Forwarding**
- **Settings**
- **Billing**

Active item = blue tint + blue text. Items can carry a count **badge** (e.g. unread texts).

---

## 4. Screens — feature by feature

### 4.1 Calls & Voicemails (`Calls`)
The activity feed for voice. A single screen with sub-tabs (All / Missed / Voicemails) and an **extension filter** (view all, or one function's activity). Each row is a call: direction (in/out/missed), caller identity (resolved from saved contacts → CNAM → number), the line it came in on, time, duration. Missed calls and voicemails are visually flagged. Voicemails expand to an **inline player** with an AI **transcript & summary**. Rows deep-link to the contact and to texting that contact. "Mark all heard" clears the unseen state. Can be filtered to a single contact (deep-linked from elsewhere).

### 4.2 Texts (the Inbox) — `inbox` / `SmsScreen`
A two-pane messaging inbox: **conversation list** (left) + **thread** (right).

- **Unified channels.** Conversations are **SMS (blue)** or **WhatsApp (green)**. WhatsApp conversations are tagged distinctly: a green left rail, a green-tinted avatar, and a green **"WhatsApp"** chip. SMS conversations use the blue equivalent. This makes the channel obvious while scanning.
- **Thread view.** Message bubbles — outbound (blue) vs inbound (grey for SMS, **green for WhatsApp**). A WhatsApp thread shows a banner: *"This is a WhatsApp conversation. Replies go back over WhatsApp and also appear in your WhatsApp app."* The reply composer indicates which channel/line you're replying from.
- **Team workflow.** Conversations can be **assigned** to a teammate, **archived**, and marked read/unread. A per-thread activity log ties together texts, calls, and voicemails with that contact.
- **Compose** new messages; pick the sending line (only SMS-approved lines can send).

### 4.3 Extensions — `extensions` (list) → extension **detail**
The heart of the "functions, not employees" model. The list (`lv-table`) shows each extension: number + name (Operator `0`, Sales `1`, Support `2`, Billing `3`, personal ext `101`…), enabled/disabled status, and a human routing summary ("Rings 4 destinations in order"). A dial-by-name **Directory** row is shown as a system/auto entry.

Opening an extension reveals a **tabbed detail** (left rail of tabs):
- **Forwarding** — the destination list. Each **destination** is a phone, a JOEL **app** user, or a **SIP** device, with: enable toggle, **call screening** ("announce"), an optional **schedule**, and a **ring duration**. Routing strategy is **in order**, **all at once**, or **single**. A **fallback** (e.g. → voicemail, or forward to another extension) and caller-ID choice round it out. Destinations are add/edit/remove/reorder.
- **Schedule** — business hours / 24-7 / custom, time zone, and **away** periods.
- **Greetings** — what callers hear for this extension (open / closed / holiday), with AI-voice generation.
- **Notifications** — see 4.4.
- **Settings (general)** — name, internal label, transfer experience (ring / music / greeting), recording, and per-extension **permissions** (which users can access it, by role).

A dirty-state save bar appears when edits are pending.

### 4.4 Notifications (per extension)
For two events — **Missed calls** and **Voicemails** — the owner chooses where alerts go. Each is a list of **channel rows** with an on/off toggle and a "Configure" affordance that opens a modal:
- **Email** — recipient list; voicemails can attach the recording.
- **Text (SMS)** — recipient phone numbers.
- **Slack** — posts into a chosen channel (e.g. `#sales-team`); voicemails can attach the recording.
- **WhatsApp** — recipient WhatsApp numbers. **A number must be verified once with a 6-digit code sent over WhatsApp before it can receive alerts** (pending → code entry → verified, mirroring the SMS verify pattern).
- **Webhook** — POSTs a JSON payload (editable template with `{{caller_number}}`, `{{summary}}`, `{{recording_url}}`, etc.).

Configure buttons only appear once a channel is toggled on.

### 4.5 Call Forwarding — `forwarding`
A business-wide view of how calls flow, with the ability to jump into any extension's forwarding. (Sibling to the per-extension Forwarding tab, but at the org level.)

### 4.6 Settings — `settings` (hub) → sub-sections
A grouped hub of cards (icon · label · one-line description). Groups and items:

- **System:** Numbers · Main Greeting · Directory · Devices · Music on hold
- **Team:** Users & roles (Owner / Admin / User) · Business profile (name, address, time zone)
- **Messaging & compliance:** SMS compliance (A2P / toll-free registration) · Blocked numbers · Data retention
- **Integrations & advanced:** Integrations (**Slack, WhatsApp**, webhooks) · Advanced number options (porting, CNAM, call-record)

Key sub-screens:
- **Numbers** — the business lines (Local, Toll-Free, Marketing-tracking). Each shows its label, type, where it routes, and an **SMS-capability badge**: **green "SMS approved"**, **amber "SMS pending"**, or none. (Label leads, badge follows.)
- **Main Greeting** — company-level greeting (and after-hours), AI-voice generated, branded by business name.
- **Integrations** — manage **Slack** and **WhatsApp** here. The **WhatsApp** block is the same enable/manage control surfaced in onboarding, so anyone who dismissed the setup step can turn it on/off and manage delivery (Inbox + WhatsApp app) later.

### 4.7 Billing — `billing`
Deliberately **minimal** — optimized so an owner can answer "what plan, what am I paying for, when am I billed, how do I change my card, how do I cancel" in under 30 seconds. **No dashboards, analytics, seats, or invoice tables-as-product.** One consolidated card holds it:
- **Header:** plan name (Growth) · Monthly/Annual pill · what's included (numbers · minutes) · renewal date · **Change plan**.
- **Roll-up rows:** Plan price → **Add-ons** (expandable: additional numbers, vanity numbers, additional minutes, SIP phones, each with a stepper + live cost) → **Taxes & regulatory fees** (collapsible, headed *"Federal, state & local government fees — collected and passed through at cost"*; itemizes USF, E911, regulatory recovery, state/local) → **Estimated monthly total** (the whole bill).
- Prices are intentionally **de-emphasized** (muted, not bold).
- Below: **Payment method** (card on file + update), **Billing history** (date · amount · Paid · download invoice), **Billing contact** (email + address), and a **Danger zone** to **cancel** (cancellation lives here, never in Settings; gated by an acknowledgment checkbox; flips to a "scheduled to cancel / resume" state).

### 4.8 Quick Setup (onboarding)
A guided, dismissible flow that lives in the sidebar until done. Steps:
1. **Take Calls** — the main wizard: confirm business name + main greeting, set forwarding, voicemail, hold music, review, and finish. Uses a two-number convention (an Active number, green, usable now + a Porting number, amber, when a port is pending). "Set up manually instead" dismisses it (owner-only, warns first).
2. **SMS Registration** — register the number for A2P/toll-free texting.
3. **Slack** — *notifications* integration. Framed around **"Never miss a customer text"**: a Slack notification the instant a customer texts, plus missed calls and voicemails, posted into channels the team already watches. Feature list leads with **New texts**, then Missed calls, then Voicemails.
4. **WhatsApp** — **"Enable WhatsApp."** Copy: *"Let customers message this business number on WhatsApp. WhatsApp conversations will appear in your Inbox."* Enabling reveals a routing diagram (**Customer → JOEL number → both the JOEL Inbox and your WhatsApp app**), delivery toggles for each destination, and a live inbox preview showing a green WhatsApp conversation beside a blue SMS one. Has a "Not now" dismiss that points to Settings → Integrations.

Each onboarding step shares a consistent shell: an eyebrow tag, a big headline, a short subhead, a connect/enable card with a colored logo tile and a benefits grid, a primary action, and a footer that advances the flow.

---

## 5. Cross-cutting patterns & rules

- **Greetings are static audio.** The AI voice (from Quick Setup's business-name pronunciation) and the captured phonetic spelling pre-populate greeting text. When a greeting is **saved, it's rendered once to an audio file** — the system does not run text-to-speech on every call.
- **Phone-number verification before notifications.** Both SMS and WhatsApp notification recipients must verify a number with a 6-digit code before they can receive alerts.
- **Two-number convention** during porting: Active (green, usable now) + Porting (amber, pending).
- **Roles:** Owner / Admin / User, with per-extension access control.
- **Status color grammar:** green = active/approved/success, amber = pending/in-review, red = failed/blocked/danger, blue = primary/SMS, green-`--wa` = WhatsApp, purple-`--ai` = AI/automation.
- **De-emphasize money.** Prices recede (muted weight); the product, plan name, and labels carry the visual weight.
- **Minimalism is a feature.** No filler content, no vanity stats, no analytics for their own sake. Every element earns its place.

---

## 6. When designing something new for JOEL

1. Start from the **functions-not-employees** model and the **never-miss-a-customer** promise.
2. Reuse the **Card / list-row / toggle / segmented / modal** vocabulary and the soft-shadow, tight-heading, light-canvas aesthetic.
3. Respect the **channel colors** (SMS blue, WhatsApp green, AI purple) and the **status grammar**.
4. Keep copy plain and explain the *why* in one line.
5. Prefer one consolidated, scannable surface over multiple stacked cards or dashboards. Bias to minimalism.
