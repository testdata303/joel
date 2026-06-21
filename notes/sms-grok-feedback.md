# SMS + Contacts — Grok feedback (vs. Grasshopper users)

> Captured June 7, 2026. Source: Grok, prompted with a full description of JOEL's current
> Texting (SMS) experience and Contact cards, asked to pressure-test against common Grasshopper
> user complaints. **This reflects the build as of this date — preserve before building a new
> SMS version.**

## 1. Gap analysis vs. Grasshopper (Texting & Contacts)
Grasshopper texting is basic and often frustrating for small teams: shared visibility without
real collaboration ("everyone sees everything" when multiple users have permissions), painful
10DLC/TCR compliance/SMS registration (repeated denials, fees), unreliable delivery/search,
limited MMS/group texting (especially toll-free), no templates/scheduling/auto-replies beyond
basic missed-call texts, clunky interface, and poor team handoff. Contacts are tied to personal
phone sync or very basic.

- **Shared visibility/chaos ("everyone sees everything")** — Grasshopper warns users to limit
  texting permissions because all permitted users see all messages. JOEL *partially* addresses
  via conversation-level unread tracking and internal notes, but **misses full shared-inbox
  assignment/roles** — critical for 2–10 person teams. No statuses, @mentions, or assignee-primary
  notifications.
- **Compliance & reliability** — Addressed: clear compliance gate + "replying from" the original number.
- **Search & organization** — Strongly addressed: search (name/number/body), tabs, per-number
  filters, archived count.
- **MMS/Group texting** — Limited in Grasshopper; **missed entirely** in JOEL (not built yet).
- **Templates, auto-replies, scheduling** — Basic/absent in Grasshopper; **missed** in JOEL.
- **Unified timeline** — Strongly addressed; interleaved calls/voicemails/texts + contact-card
  history is a clear win.
- **Contacts** — Excellent coverage; drawer, multi-number/email, sticky note, activity counts/links,
  caller-ID resolution **leapfrog** Grasshopper.
- **Other pains** — per-convo unread and "You:" prefix help with notification fatigue.

> Foundation is already cleaner and more modern than Grasshopper for solos, but doesn't yet solve
> the team-scaling pains that drive switches.

## 2. Top 10 improvements (prioritized: high impact / low-medium effort first)
1. **Shared inbox assignment & collaboration** (Differentiator) — manual/auto-assignment
   (keywords, round-robin), statuses (Unassigned/In Progress/Resolved), internal @mentions/comments
   (separate from pinned note), assignee-primary notifications. Fixes "everyone sees everything."
2. **Templates / canned responses + quick replies** (Table-stakes + leapfrog) — reusable messages,
   insertable in composer, with variables (e.g. `{name}`).
3. **MMS support (images, files, rich media)** (Table-stakes) — send/receive with previews, size
   handling, compliance.
4. **Auto-replies & business-hours rules** (Differentiator) — away messages, scheduled auto-texts,
   after-hours routing. Easy AI enhancement later.
5. **Group texting** (Table-stakes) — broadcast vs. collaborative controls + visibility warnings.
6. **Read receipts & typing indicators** (Low effort, high delight) — per-user or team-level.
7. **Scheduled messages** (Leapfrog) — draft and send later (time zones).
8. **Better notification controls & Slack integration** (Differentiator) — mute threads, digest
   summaries, Slack mirroring/assign commands.
9. **Export/CRM basics** (Table-stakes) — CSV export of contacts/activity, Zapier/webhooks, or
   simple tags/segments.
10. **Delivery/read status in thread** (Low effort) — sent/delivered/failed icons.

## 3. Red flags in current build
- **Unified timeline in thread** — risks clutter for SMS-heavy users; make it optional/toggleable
  or use separate tabs.
- **"Replying from" fixed to original number** — mostly good, but multi-number teams may want overrides.
- **Contact card drawer** — ensure mobile parity, not just desktop.
- **Unread per conversation** — good, but without assignment can still feel noisy for teams.
- **Mental model** — new users may expect WhatsApp-like simplicity; two-column + unified timeline
  could feel "enterprise" if not explained.

## 4. Must-haves missing entirely
- MMS/images (critical)
- Group texting
- Assignment / shared-inbox collaboration (biggest team gap)
- Templates, auto-replies, scheduling
- Opt-out/STOP handling & compliance logging
- Read/delivery receipts
- Desktop + mobile real-time sync (confirm push reliability)
- Basic analytics (response times, volume per number)

> Mostly table-stakes to match Grasshopper; assignment/templates/AI auto-features are leapfrog
> opportunities for small Slack/WhatsApp teams.

## Overall
Solid, thoughtful foundation — better contact management and search than Grasshopper, with nice
touches like internal notes and activity digest. Prioritize **team collaboration (assignment)** and
**messaging richness (MMS/templates)** to convert frustrated Grasshopper users. Positions JOEL as
the simple, modern choice for 1–10 person teams without bloat.
