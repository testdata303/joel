---
name: numberline-site
description: Create, edit, and maintain the Numberline website (small permanent product site + /go/ campaign pages). Read this file and README.md first; campaign work follows MARKETING.md.
---

# Numberline site - operating manual

**Version 2.0 (2026-07-29).** Replaces the v1 knowledge-graph manual (archived at `archive/NUMBERLINE_v1.md`). Numberline is a product company; the website exists to present the product and convert early access, not to become a content library.

## The permanent site (locked roster)

`/` Home · `/how-it-works` How it works &amp; features (the converting page; Features merged in 2026-07-29) · `/pricing` · `/about` · `/early-access` · `/signin` (+ `/signup` at launch).

- Nav is three items + CTA, forever: How it works &amp; Features · Pricing · Sign in + Get early access.
- Footer: entity paragraph + Product, Compare, and Company columns. Product carries the owner-approved feature pages (/slack, /whatsapp); Compare carries /compare/ pages. No Industries, Numbers, Learn, or campaign links, ever.
- Never add a permanent page, nav item, footer column, or folder without an explicit owner decision recorded here.
- Everything else is a campaign page under `/go/` (see `MARKETING.md`): disposable, unlinked from the permanent site, always pointing back into it.

## Decision hierarchy

1. Keep the permanent site small.
2. Help the visitor understand the product and convert.
3. Reinforce positioning.
4. Serve the campaign keyword (campaign pages only).

## Positioning (non-negotiable, every page)

- Business number first, phone system second. The customer starts with a number and grows into a system.
- Audience: startups, small businesses, modern teams. Never enterprise language, never generic SaaS messaging.
- Unlimited users, no per-user pricing: the biggest differentiator.
- Destinations are people's mobiles, the existing business phone, or an outside answering provider. Never "front desk", "operator", "desk phone", or "call center" as product destinations.
- Callbacks come from the business number via the mobile app.
- AI is always a third-party answering service the customer connects, never Numberline's own. Numberline routes the call; it never answers.
- Slack is optional-only outside consultants. WhatsApp and webhooks are connections, not headline features.
- Pre-launch language bans and the say/avoid glossary: `CONTENT_BIBLE.md` §5. CTAs: "Get early access" primary, "See how it works" secondary.

## Quality standards

- Copy is concrete and scannable: short rows that never wrap, no data slop, no filler sections.
- H1 formula for vertical campaigns: "The [vertical] phone system for [calls], [texts], &amp;amp; follow-up." Position = organization, not missed calls.
- Meta description formula: vertical/topic + phone system or business line + calls + texts + voicemails or transcripts + follow-up.
- Function colors are law anywhere a function appears: number blue, extensions soft yellow, forwarding purple, voicemail green, texting cyan, AI/integrations pink (`assets/site.css`).
- Terminology discipline: the same words for the same things on every page. Reuse phrasing from an existing page rather than inventing synonyms.

## Before publishing

- [ ] The page follows `CLAUDE.md` copy conventions and the Positioning and Quality standards above.
- [ ] Every claim is real: capabilities from `tools/features.json`, comparison rows from the specimen, no pre-launch banned language.
- [ ] Shared sections use the canonical specimens (`IMPLEMENTATION_REGISTRY.md`).
- [ ] Registered in `tools/site-pages.json`, `_redirects`, and `sitemap.xml`; `node tools/site-system.mjs verify` passes.
- [ ] Campaign pages: not linked from any permanent page; CTAs point back into the product pages.
