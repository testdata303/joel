# KNOWLEDGE_GRAPH.md - the Numberline knowledge graph (editorial source of truth)

The permanent editorial foundation for numberline's website. NOT a CMS - an editorial contract.
**Every future page starts here.** Read this file before creating ANY new content.

> **If a new page does not strengthen a pillar, answer a new canonical question, or improve an existing page, it should not be created.**

## How to use this file (for every future session)
1. Find the question the new page answers. If a page below already owns it → link to that page, do not write a new one.
2. Confirm the parent pillar. No parent here = the page shouldn't be written (or update this map deliberately first).
3. Take the page's metadata (Status · Intent · Type), its definition context, and its required links from its pillar entry.
4. Write the page with: pillar link in the opening paragraph (descriptive anchor) + "Related" block per the pillar's Related list.
5. Update this file in the same commit: flip status, add the page to its pillar's children, add it to its hub index.

## Rules
1. **One question = one canonical URL.** Never re-answer an owned question.
2. **Every page has exactly one parent pillar.** Cross-pillar topics get one owner; others link.
3. **Link up, link down.** Children link to their pillar canonical on first mention; pillar pages list all children in an "In this topic" section.
4. **Definitions are canonical.** Use the pillar's definition sentence verbatim wherever the term is introduced.
5. **Content types ≠ topics.** Folders say what template a page uses; pillars say what it means. A pillar's children span folders.
6. URLs are canonical (extensionless). Current files carry `.html` until Netlify pretty-URLs are enabled.
7. Copy rules from CLAUDE.md apply everywhere: mobile-first destinations, third-party AI answering (never Numberline's own), no pre-launch claims, no comparison content until launch.

## Metadata legend
Every page line reads: `URL - Status · Primary Intent · Content Type`
- **Status:** Existing · Phase 1 (beta roadmap) · Phase 2 (launch window) · Future · Reserved · Held
- **Primary Intent:** Definition · Commercial Investigation · Industry Research · Problem Solving · Feature Evaluation · Setup Guide · Template/Script
- **Content Type:** Core · Hub · Industry · Startup · Feature · Use Case · Learn · Resource · Comparison

## Content types (folders)
Every page maps to exactly one reader verb: BUY (Core, root) · IDENTIFY (For) · VERIFY (Features) · RESOLVE (Use Cases) · UNDERSTAND (Learn) · COPY (Templates, a content type under /learn/) · EVALUATE (Compare, reserved) · CONNECT (Integrations, reserved). A page that maps to no verb, or to two, should not exist.
- `/for/` - audience pages (industries + stages). Footer label: **"Industries"** (stage pages - startups, LLCs, solo founders - live in the same folder and column).
- `/features/` - capability pages; connections (Slack, WhatsApp, webhooks) live here.
- `/use-cases/` - situation pages: direct answer → Numberline setup → features used → CTA. Owns life MOMENTS too ("hired my first employee", "opened a second location") when they resolve to a setup change; moments that resolve to a stage identity belong to `/for/`. There is no separate Scenarios family.
- `/learn/` - explainers, guides, scripts & templates. Templates (COPY intent: voicemail scripts, greetings, SMS templates) are their own content type with their own blueprint (PAGE_BLUEPRINTS §6) but keep `/learn/` URLs; a top-level folder is not warranted.
- `/compare/` - Reserved · post-launch only. Two forms, one family: Versus and Alternatives (blueprint in PAGE_BLUEPRINTS §7). "Best X for Y" listicles are permanently rejected; that intent is a Learn buying guide or a `/for/` page. `/integrations/` - Reserved · opens when connections beyond Slack/webhooks ship (blueprint §8). `/help/` - Reserved · product-usage docs, post-launch.

## Brand entity definition (use verbatim, everywhere)
> Numberline is a business number and phone system in one for startups, small businesses, and modern teams. Get a local or toll-free business number, forward calls, manage shared texts and voicemails, call back from your business number, add greetings and extensions, and connect Slack, WhatsApp, webhooks, or third-party AI answering services when you need them.

## Core & hub pages (not pillar children)
- `/` - Existing · Commercial Investigation · Core
- `/how-it-works` - Existing · Commercial Investigation · Core
- `/features` - Existing · Feature Evaluation · Hub - the canonical Features page and hub from day one: it indexes every feature page as they ship, same URL forever
- `/pricing` - Existing · Commercial Investigation · Core (owns "what does Numberline cost"; generic cost questions belong to Business Phone Systems pillar)
- `/about` - Existing · Industry Research · Core
- `/early-access`, `/signin`, `/signup` - Existing · - · Core
- `/for/` index - Phase 1 · Industry Research · Hub
- `/use-cases/` index - Phase 1 · Problem Solving · Hub
- `/learn/` index - Phase 1 · Definition · Hub (sections: Guides · Business numbers · Scripts & templates)

---

# PILLAR: Business Phone Number
- Canonical: `/learn/business-phone-number` - Existing · Definition · Learn - REFERENCE implementation for the type
- Definition: "A business phone number is a separate local or toll-free number that represents your business, so customer calls and texts reach you without giving out your personal number."
- Children:
  - `/learn/local-business-phone-number` - Existing · Definition · Learn
  - `/learn/toll-free-business-number` - Existing · Definition · Learn
  - `/learn/second-business-number` - Phase 1 · Commercial Investigation · Learn
  - `/learn/how-to-get-a-business-phone-number` - Phase 2 · Setup Guide · Learn
  - `/learn/keep-your-existing-business-number` (porting) - Phase 2 · Setup Guide · Learn
  - `/learn/business-sms-number` - Future · Definition · Learn
  - Business vs personal number → OWNED by Privacy pillar; link, don't duplicate
- Related: features/business-caller-id · for/startups · for/new-businesses · use-cases/keep-your-personal-number-private

# PILLAR: Business Phone Systems
(renamed from "The Phone System Itself" - the customer-natural knowledge area)
- Canonical: `/learn/small-business-phone-system` - Existing · Definition · Learn
- Definition: "A small business phone system is everything around the number: forwarding, greetings, extensions, voicemail, and texting, with no hardware and no per-user pricing."
- Children:
  - `/learn/virtual-phone-system` - Existing · Definition · Learn
  - `/learn/do-i-need-a-business-phone-system` - Phase 2 · Commercial Investigation · Learn
  - `/learn/business-phone-system-cost` - Phase 2 · Commercial Investigation · Learn (generic cost question; Numberline's price stays on /pricing)
  - `/learn/phone-system-vs-answering-service` - Future · Commercial Investigation · Learn
  - `/features/mobile-app` - Phase 1 · Feature Evaluation · Feature (moves from learn/mobile-app with 301)
- Related: /features hub · /how-it-works · /pricing · every pillar canonical

# PILLAR: Call Forwarding & Routing
- Canonical: `/features/call-forwarding` - Existing · Feature Evaluation · Feature - REFERENCE implementation for the type
- Definition: "Call forwarding sends calls to your business number to the right person's mobile: one phone, several ringing at once, or different destinations by schedule."
- Children:
  - `/use-cases/forward-business-calls-to-your-cell` - Phase 1 · Problem Solving · Use Case
  - `/use-cases/ring-multiple-cell-phones` - Existing · Problem Solving · Use Case - REFERENCE implementation for the type
  - `/use-cases/after-hours-call-routing` - Phase 1 · Problem Solving · Use Case
  - `/learn/call-forwarding-guide` - Phase 1 · Setup Guide · Learn
  - `/use-cases/forward-calls-overseas` - Future · Problem Solving · Use Case
  - `/learn/scheduled-and-holiday-routing` - Future · Setup Guide · Learn
- Related: features/extensions · Answering Coverage pillar · every industry routing strip

# PILLAR: Business Texting
- Canonical: `/features/business-texting` - Phase 1 · Feature Evaluation · Feature
- Definition: "Business texting lets you send and receive SMS from your business number, with every conversation in a shared inbox your whole team can see."
- Children:
  - `/learn/business-texting-templates` - Phase 1 · Template/Script · Resource
  - `/use-cases/text-from-your-business-number` - Future · Problem Solving · Use Case
  - `/learn/customer-text-messaging` - Future · Definition · Learn
  - Shared inbox → OWNED by Modern Teams pillar; link, don't duplicate
- Related: features/voicemail (same inbox) · for/real-estate · for/contractors · features/slack-notifications

# PILLAR: Voicemail
- Canonical: `/features/voicemail` - Phase 1 · Feature Evaluation · Feature (includes transcripts)
- Definition: "Business voicemail captures missed calls as recordings and transcripts your team can read, share, and follow up on, calling back from the business number."
- Children:
  - `/learn/voicemail-greeting-scripts` - Phase 1 · Template/Script · Resource (what callers hear before leaving a message; main-greeting examples belong to Greetings pillar)
  - `/use-cases/shared-voicemail` - Future · Problem Solving · Use Case
  - `/learn/after-hours-voicemail` - Future · Setup Guide · Learn
- Related: features/business-texting · Greetings pillar · use-cases/after-hours-call-routing

# PILLAR: Greetings, Extensions & Menus
- Canonical: `/features/extensions` - Phase 1 · Feature Evaluation · Feature (greetings + extensions together until content justifies a split)
- Definition: "Greetings and extensions answer every call with a recorded welcome and let callers dial the right person or team directly."
- Children:
  - `/learn/phone-menu-examples` (phone tree) - Phase 1 · Template/Script · Resource
  - `/learn/business-greeting-examples` - Future · Template/Script · Resource (main greetings + holiday greetings; voicemail scripts stay with Voicemail)
  - `/learn/business-phone-etiquette` - Future · Learn · Learn
- Related: features/call-forwarding · features/voicemail · for/law-firms · for/medspas

# PILLAR: Answering Coverage (who answers when you can't)
- Canonical: `/learn/answering-coverage` - Phase 2 · Commercial Investigation · Learn (working title: "Who answers your business phone when you can't"). Until it ships, `/learn/bring-your-own-ai` carries the pillar's up-links.
- Positioning guard: Numberline ROUTES calls to providers; it never answers. Third-party framing always.
- Children:
  - `/learn/bring-your-own-ai` - Existing · Setup Guide · Learn
  - `/use-cases/overseas-assistants` - Phase 1 · Problem Solving · Use Case
  - `/use-cases/remote-receptionist` - Future · Problem Solving · Use Case
  - `/learn/answering-service-routing` - Future · Setup Guide · Learn
- Related: features/call-forwarding · use-cases/after-hours-call-routing · industry routing strips

# PILLAR: Starting a Business
- Canonical: `/for/startups` - Existing · Commercial Investigation · Startup - REFERENCE implementation for the type
- Definition: "A new business needs a business number before it needs a phone system: one line for your website, filings, and customers, forwarded to your own mobile."
- Children:
  - `/for/new-businesses` - Existing · Commercial Investigation · Startup
  - `/for/llcs` - Phase 1 · Commercial Investigation · Startup
  - `/for/solo-founders` - Phase 1 · Commercial Investigation · Startup
  - `/learn/business-phone-before-hiring` - Future · Commercial Investigation · Learn
  - `/for/one-person-businesses` - Future · Commercial Investigation · Startup
- Related: learn/business-phone-number · learn/how-to-get-a-business-phone-number · use-cases/keep-your-personal-number-private

# PILLAR: Privacy & the Personal Number
- Canonical: `/learn/personal-cell-vs-business-phone-system` - Existing · Commercial Investigation · Learn
- Definition: "Keeping your personal number private means customers only ever see and dial your business number, while calls still reach your mobile, and callbacks come from the business line."
- Children:
  - `/use-cases/keep-your-personal-number-private` - Phase 1 · Problem Solving · Use Case
  - `/features/business-caller-id` - Phase 1 · Feature Evaluation · Feature
  - `/use-cases/business-phone-while-traveling` - Phase 1 · Problem Solving · Use Case
  - `/learn/work-life-separation` - Future · Learn · Learn
- Related: learn/business-phone-number · for/solo-founders · Modern Teams pillar

# PILLAR: Modern Teams (how modern businesses communicate)
- Canonical: `/learn/shared-team-phone` - Phase 2 · Definition · Learn (working title: "The shared team phone: one number your whole team answers")
- Definition: "A modern team shares one business number: everyone answers, texts, and calls back from it on their own mobiles, with unlimited users instead of per-seat pricing."
- Owns Numberline's biggest differentiator (unlimited users). One owner per overlap: shared inbox → here; overseas assistants → Answering Coverage; caller ID + traveling → Privacy.
- Children:
  - `/learn/shared-inbox` - Phase 2 · Definition · Learn (Business Texting links here)
  - `/learn/unlimited-users-vs-per-seat-pricing` - Phase 2 · Commercial Investigation · Learn
  - `/features/slack-notifications` - Phase 1 · Feature Evaluation · Feature (moves from learn/ with 301)
  - `/features/whatsapp` - Future · Feature Evaluation · Feature
  - `/features/webhooks` - Future · Feature Evaluation · Feature
  - `/use-cases/shared-team-phone-for-contractors` - Future · Problem Solving · Use Case
  - `/use-cases/remote-teams` - Future · Problem Solving · Use Case
  - `/learn/team-texting` - Future · Definition · Learn
  - `/learn/phone-permissions-and-roles` - Future · Feature Evaluation · Learn (post-launch, when product ships it)
- Related: features/business-texting · use-cases/overseas-assistants · /pricing

# PILLAR FAMILY: Industries
Each industry is a future mini-pillar; vertical children (e.g. plumber voicemail scripts) live in /learn/ or /use-cases/ but parent to their industry.
- `/for/plumbers` (REFERENCE implementation for the type), `/for/real-estate`, `/for/contractors`, `/for/consultants`, `/for/interior-design`, `/for/medspas`, `/for/law-firms` - Existing · Industry Research · Industry
- `/for/new-businesses` - Existing (also child of Starting a Business)
- `/for/electricians`, `/for/hvac`, `/for/cleaning-services`, `/for/dentists`, `/for/accountants` - Phase 1 · Industry Research · Industry
- Standard links per industry page: 2–3 features + 2 use cases common in the vertical + 1 learn guide + relevant number type

## Held / reserved
- `/learn/google-voice-alternative` - Held · Commercial Investigation · Comparison - de-linked from footers + noindex applied; moves to `/compare/` post-launch
- `/compare/*` - Reserved · Commercial Investigation · Comparison - post-launch only, no pre-writing
- `/help/*` - Reserved · Setup Guide · - - product-usage docs, post-launch

## Verification (checked at lock, July 2026)
- Every planned page above has exactly one parent pillar; the three cross-pillar overlaps (shared inbox, overseas assistants, caller ID/traveling) have a named single owner.
- No two pages answer the same question; the four question-boundary notes (business vs personal number, cost vs /pricing, voicemail scripts vs greeting examples, traveling vs working-from-anywhere) mark where duplication was possible and is forbidden.
- Every page carries Status · Intent · Type; every pillar carries canonical URL + definition + Related list.
- Known gaps, deliberate: Answering Coverage's canonical ships Phase 2 (bring-your-own-ai carries up-links until then); WhatsApp/webhooks pages are promised in the brand paragraph but Future (footer links can point at /features hub section first); `/help/` opens only when the product launches.
