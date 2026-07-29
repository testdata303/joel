# KNOWLEDGE_GRAPH.md - the Numberline knowledge graph (editorial source of truth)

The permanent editorial foundation for numberline's website. NOT a CMS - an editorial contract.
**Every future page starts here.** This file decides WHETHER a page should exist and which pillar owns it; `PAGE_BLUEPRINTS.md` decides HOW an approved page is built. Read this file before creating ANY new content.

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
5. **Pillars own meaning; templates own presentation.** A pillar defines WHAT a page means and who owns its question; a content type (template) defines only HOW the page is presented. One pillar's children can use many templates (a feature page, three use cases, a script page), and a template never confers ownership.
6. URLs are canonical (extensionless). Current files carry `.html` until Netlify pretty-URLs are enabled.
7. Copy rules from CLAUDE.md apply everywhere: mobile-first destinations, third-party AI answering (never Numberline's own), no pre-launch claims, no comparison content until launch.

## Metadata legend
Every page line reads: `URL - Status · Primary Intent · Content Type`
- **Status:** Existing · Phase 1 (beta roadmap) · Phase 2 (launch window) · Future · Reserved · Held · Rejected
- **Rejected** (no-Google audit, July 2026): the page existed only in search-engine thinking. The audit test, applied to every planned page: would this URL still be needed if nobody ever arrived from a search results page? Legitimate reasons to exist: solves a real decision/problem, catalogs the product, or is the canonical reference. Rejected entries stay listed (with their owner) so the question is never re-opened; their content, where real, lives as a SECTION of the named owner.
- **Primary Intent:** Definition · Commercial Investigation · Industry Research · Problem Solving · Feature Evaluation · Setup Guide · Template/Script
- **Content Type:** Core · Hub · Industry · Startup · Feature · Use Case · Learn · Template · Comparison · Number Type · City · Integration (reserved). Template = COPY-intent pages (scripts, greetings, SMS templates) living under `/learn/` URLs.

## Content types (folders)
Every page maps to exactly one reader verb: BUY (Core, root) · IDENTIFY (For) · VERIFY (Features) · RESOLVE (Use Cases) · UNDERSTAND (Learn) · COPY (Templates, a content type under /learn/) · GET (Numbers, /numbers/) · EVALUATE (Compare, reserved) · CONNECT (Integrations, reserved). A page that maps to no verb, or to two, should not exist. The verbs are internal architecture only: user-facing navigation (nav, footer, hub labels) always uses nouns (Industries, Use cases, Learn...), never the verbs.
- `/for/` - audience pages (industries + stages). Footer label: **"Industries"** (stage pages live in the same folder and column; /for/startups is the only stage page after the no-Google audit).
- `/features/` - capability pages; connections (Slack, WhatsApp, webhooks) live here.
- `/use-cases/` - situation pages: direct answer → Numberline setup → features used → CTA. Owns life MOMENTS too ("hired my first employee", "opened a second location") when they resolve to a setup change; moments that resolve to a stage identity belong to `/for/`. There is no separate Scenarios family.
- `/learn/` - explainers, guides, scripts & templates. Templates (COPY intent: voicemail scripts, greetings, SMS templates) are their own content type with their own blueprint (PAGE_BLUEPRINTS §6) but keep `/learn/` URLs; a top-level folder is not warranted.
- `/numbers/` - commercial number-catalog pages (types, cities). Reader verb: GET. Footer label: **"Numbers"**. Architecture, slug law, and the area-code rule live in NUMBERS_ARCHITECTURE.md; area codes are SECTIONS of their city page (numeric slugs 301 there) unless a code passes the three-part test in that file's §7.
- `/compare/` - Reserved · post-launch only. Two forms, one family: Versus and Alternatives (blueprint in PAGE_BLUEPRINTS §7). "Best X for Y" listicles are permanently rejected; that intent is a Learn buying guide or a `/for/` page. `/integrations/` - Reserved · opens when connections beyond Slack/webhooks ship (blueprint §8). `/help/` - Reserved · product-usage docs, post-launch.

## Brand entity definition (use verbatim, everywhere)
> Numberline is a business number and phone system in one for startups, small businesses, and modern teams. Get a local or toll-free business number, forward calls, manage shared texts and voicemails, call back from your business number, add greetings and extensions, and connect Slack, WhatsApp, webhooks, or third-party AI answering services when you need them.

## AMENDMENT (owner, 2026-07-28): /learn/ and /use-cases/ deleted
All /learn/* pages (guides, the google-voice-alternative comparison) and /use-cases/* pages were deleted by owner directive: better topics will be chosen before these families return. Style templates are archived in docs/marketing/templates/ (learn article, learn hub, use-case page, use-case hub, comparison page); the Topic Index and Sample Setup specimens survive in components/. Redirects: number-topic URLs 301 to /numbers/, everything else to /features (one hop). Footer: Use cases + Learn columns removed; Industries moved up beside Product/Company. Learn/Use Case entries in the pillars below are historical until new topics are approved; creating any new /learn/ or /use-cases/ page requires an owner-approved amendment here first.

## AMENDMENT (owner, 2026-07-28): /features/ detail pages removed
All /features/<slug> pages were deleted; every former feature URL 301s to /features. The features hub is the single features surface (Feature Catalog, static descriptive cards). Pillar entries below that name a /features/<slug> canonical are historical; their capability facts are owned by /features.html + tools/features.json. Any future feature page requires an owner-approved amendment to IA_PLAN §11.

## Core & hub pages (not pillar children)
- `/` - Existing · Commercial Investigation · Core
- `/how-it-works` - Existing · Commercial Investigation · Core
- `/features` - Existing · Feature Evaluation · Hub - the canonical Features page and hub from day one: it indexes every feature page as they ship, same URL forever
- `/pricing` - Existing · Commercial Investigation · Core (owns "what does Numberline cost"; generic cost questions belong to Business Phone Systems pillar)
- `/about` - Existing · Industry Research · Core
- `/early-access`, `/signin`, `/signup` - Existing · - · Core
- `/for/` index - Existing · Industry Research · Hub - REFERENCE implementation (Topic Index)
- `/use-cases/` index, `/learn/` index - DELETED 2026-07-28 (see amendment); Topic Index primitive specimen survives in components/topic-index.html
- `/numbers/` index - Existing · Commercial Investigation · Hub - REFERENCE implementation; owns the Number Card primitive

---

# PILLAR: Business Phone Number
- Canonical: `/learn/business-phone-number` - Existing · Definition · Learn - REFERENCE implementation for the type
- Definition: "A business phone number is a separate local or toll-free number that represents your business, so customer calls and texts reach you without giving out your personal number."
- Children:
  - Local vs toll-free -> OWNED by the canonical as sections (consolidation, July 2026: local-business-phone-number and toll-free-business-number MERGED here with 301s; one choice is one page, not three)
  - `/learn/how-to-get-a-business-phone-number` - Rejected (no-Google audit) - without a search page, "how to get" IS the /numbers/ hub plus signup; the flow is the guide
  - `/learn/business-sms-number` - Rejected (no-Google audit) - keyword skin of features/business-texting
  - Business vs personal number → OWNED by Privacy pillar; link, don't duplicate
  - Commercial number acquisition (second number, porting, get-a-number pages) → OWNED by the Numbers family below; link, don't duplicate
- Related: features/business-caller-id · for/startups · use-cases/keep-your-personal-number-private

# PILLAR FAMILY: Numbers (commercial catalog - GET intent)
Meaning stays with the Business Phone Number pillar; these pages own acquisition. Boundary: getting a thing vs understanding a topic. "Still useful if they choose a competitor?" → Learn. "Reader already knows they want it?" → Numbers. Full architecture: NUMBERS_ARCHITECTURE.md.
- Local numbers -> OWNED by the /numbers/ hub (consolidation, July 2026: /numbers/local MERGED into the hub with 301). City pages parent to the hub
- `/numbers/boston` - Existing · Held at beta lock (de-linked from footers + noindex applied, July 2026; stays live as THE city template, still linked from the /numbers/ hub; no further cities until the hub picker can expose real per-city inventory) · Commercial Investigation · City - owns its area codes (617, 857) as sections; /numbers/617 and /numbers/857 301 here
- `/numbers/toll-free` - Phase 1 (beta) · Commercial Investigation · Number Type (owns 800/833/844/888 prefix questions; no per-prefix pages)
- `/numbers/keep-your-number` - Phase 1 (beta - highest-intent commercial page in the family) · Setup Guide · Number Type (porting; replaces the formerly planned /learn/keep-your-existing-business-number)
- `/numbers/second-business-number` - Phase 1 (beta) · Commercial Investigation · Number Type (replaces the formerly planned /learn/second-business-number)
- `/numbers/vanity` - Existing · Held at beta lock (de-linked from footers + noindex applied, July 2026; relisted when vanity search genuinely ships - never promise inventory the product can't show; the /numbers/ hub still links it) · Commercial Investigation · Number Type - REFERENCE implementation for the type
- Area-code pages: NONE by default (one intent, one URL); a code page requires the three-part test in NUMBERS_ARCHITECTURE §7 and parents to its city page
- Further cities: Held (no-Google audit) - city pages exist because "[city] phone number" is a query; without search, availability browsing belongs in the hub's number picker. Boston stays as the single storefront reference; a new city page requires evidence the picker can't do the job
- Related: learn/business-phone-number (pillar, linked in every opening) · for/startups

# PILLAR: Business Phone Systems
(renamed from "The Phone System Itself" - the customer-natural knowledge area)
- Canonical: `/learn/small-business-phone-system` - Existing · Definition · Learn
- Definition: "A small business phone system is everything around the number: forwarding, greetings, extensions, voicemail, and texting, with no hardware and no per-user pricing."
- Children:
  - Virtual phone system -> MERGED into the canonical (301, July 2026): same question, different keyword
  - `/learn/do-i-need-a-business-phone-system` - Existing · Commercial Investigation · Learn - REFERENCE implementation for the Buying Guide form; owns the cost discussion as a section (business-phone-system-cost Rejected in the no-Google audit: "cost" was query capture; honest answer = /pricing + this guide)
  - `/learn/phone-system-vs-answering-service` - Rejected (no-Google audit) - the question is real but owned by the Answering Coverage canonical as a section
  - `/features/mobile-app` - Phase 1 · Feature Evaluation · Feature (MOVED 2026-07-28, 301 in place)
- Related: /features hub · /how-it-works · /pricing · every pillar canonical

# PILLAR: Call Forwarding & Routing
- Canonical: `/features/call-forwarding` - Existing · Feature Evaluation · Feature - REFERENCE implementation for the type
- Definition: "Call forwarding sends calls to your business number to the right person's mobile: one phone, everyone at once, or in order, and the path can change by schedule."
- Children:
  - `/use-cases/forward-business-calls-to-your-cell` - Phase 1 · Problem Solving · Use Case
  - `/use-cases/ring-multiple-cell-phones` - Existing · Problem Solving · Use Case - REFERENCE implementation for the type
  - `/use-cases/after-hours-call-routing` - Phase 1 · Problem Solving · Use Case
  - Setup guide (five steps: destinations, ring pattern, schedule, fallback, test) -> MERGED into the canonical as its "Set it up" section (no-Google audit, July 2026: /learn/call-forwarding-guide folded into features/call-forwarding with 301; the Educational Guide form is retired until /help/ opens)
  - `/use-cases/forward-calls-overseas` - Future · Problem Solving · Use Case
  - `/learn/scheduled-and-holiday-routing` - Rejected as marketing content (no-Google audit) - product documentation; lives in /help/ post-launch
- Related: features/extensions · Answering Coverage pillar · every industry routing strip

# PILLAR: Business Texting
- Canonical: `/features/business-texting` - Existing (Wave 2A, 2026-07-28) · Feature Evaluation · Feature
- Definition: "Business texting lets you send and receive SMS from your business number, with every conversation in a shared inbox your whole team can see."
- Children:
  - `/learn/business-texting-templates` - Phase 1 · Template/Script · Template
  - `/use-cases/text-from-your-business-number` - Rejected (no-Google audit) - restatement of the feature page
  - `/learn/customer-text-messaging` - Rejected (no-Google audit) - keyword skin of features/business-texting
  - `/learn/team-texting` (was under Modern Teams) - Rejected (no-Google audit) - keyword skin of features/business-texting
  - Shared inbox → OWNED by Modern Teams pillar; link, don't duplicate
- Related: features/voicemail (same inbox) · for/real-estate · for/contractors · features/slack-notifications

# PILLAR: Voicemail
- Canonical: `/features/voicemail` - Existing (Wave 2A, 2026-07-28) · Feature Evaluation · Feature (includes transcripts; anchors: #transcripts #delivery #alerts)
- Definition: "Business voicemail captures missed calls as recordings and transcripts your team can read, share, and follow up on, calling back from the business number."
- Children:
  - /learn/voicemail-greeting-scripts - REMOVED 2026-07-28 (owner decision at IA amendment: no scripts landing page; 301 -> /features/extensions; greetings guidance is a SECTION of the extensions canonical). The Template content type has NO reference implementation; Tier 4 template pages (phone-menu-examples, business-texting-templates) require owner re-approval before build.
  - `/use-cases/shared-voicemail` - Rejected (no-Google audit) - restatement of the feature page; shared inbox behavior belongs to features/voicemail + Modern Teams
  - `/learn/after-hours-voicemail` - Rejected (no-Google audit) - a section of use-cases/after-hours-call-routing, not a page
- Related: features/business-texting · Greetings pillar · use-cases/after-hours-call-routing

# PILLAR: Greetings, Extensions & Menus
- Canonical: `/features/extensions` - Existing (Wave 2A, 2026-07-28; title "Phone menus, greetings & extensions") · Feature Evaluation · Feature (greetings + extensions together until content justifies a split; anchors: #greeting #menus #extensions #holiday-greetings)
- Definition: "Greetings and extensions answer every call with a recorded welcome and let callers dial the right person or team directly."
- Children:
  - `/learn/phone-menu-examples` (phone tree) - Phase 1 · Template/Script · Template
  - `/learn/business-greeting-examples` - Rejected as a separate page (no-Google audit) - main + holiday greetings become a SECTION of learn/voicemail-greeting-scripts, making it the single scripts library (rename its H1 to cover greetings when added; COPY intent has one destination)
  - `/learn/business-phone-etiquette` - Rejected (no-Google audit) - content-marketing blog post wearing a Learn URL
- Related: features/call-forwarding · features/voicemail · for/law-firms · for/medspas

# PILLAR: Answering Coverage (who answers when you can't)
- Canonical: `/learn/answering-coverage` - Existing (built 2026-07-28 from the Learn reference implementation; every industry routing strip points at this pillar) · Commercial Investigation · Learn (H1: "Who answers your business phone when you can't"). Until it ships, `/learn/using-third-party-ai-services` carries the pillar's up-links.
- Positioning guard: Numberline ROUTES calls to providers; it never answers. Third-party framing always.
- Children:
  - `/features/using-third-party-ai-services` - Existing · Feature Evaluation · Feature (MOVED from /learn/ 2026-07-28 per IA_PLAN freeze, 301 in place; earlier renamed from /learn/bring-your-own-ai: the feature label is "Using third-party AI services", a capability, not a software category)
  - `/use-cases/overseas-assistants` - Phase 2 (deferred at beta lock) · Problem Solving · Use Case - owns the remote-receptionist question too (remote-receptionist Rejected in the no-Google audit: same solution, one page)
  - `/learn/answering-service-routing` - Rejected (no-Google audit) - a section of the answering-coverage canonical (as is phone-system-vs-answering-service)
- Related: features/call-forwarding · use-cases/after-hours-call-routing · industry routing strips

# PILLAR: Starting a Business
- Canonical: `/for/startups` - Existing · Commercial Investigation · Startup - REFERENCE implementation for the type
- Definition: "A new business needs a business number before it needs a phone system: one line for your website, filings, and customers, forwarded to your own mobile."
- Children:
  - New businesses -> MERGED into /for/startups (301, July 2026): one stage, one page
  - `/for/llcs`, `/for/solo-founders`, `/for/one-person-businesses` - Rejected (no-Google audit) - three names for the same buyer; /for/startups owns the stage. LLC filing and solo-operation angles become sections there if needed
  - `/learn/business-phone-before-hiring` - Rejected (no-Google audit) - content-marketing blog post; the moment resolves to /for/startups
- Related: learn/business-phone-number · /numbers/ hub · use-cases/keep-your-personal-number-private

# PILLAR: Privacy & the Personal Number
- Canonical: `/learn/personal-cell-vs-business-phone-system` - Existing · Commercial Investigation · Learn
- Definition: "Keeping your personal number private means customers only ever see and dial your business number, while calls still reach your mobile, and callbacks come from the business line."
- Children:
  - `/use-cases/keep-your-personal-number-private` - Phase 1 · Problem Solving · Use Case
  - `/features/business-caller-id` - Phase 1 · Feature Evaluation · Feature
  - `/use-cases/business-phone-while-traveling` - Phase 2 (deferred at beta lock) · Problem Solving · Use Case
  - `/learn/work-life-separation` - Rejected (no-Google audit) - content-marketing blog post; the real question is owned by the pillar canonical
- Related: learn/business-phone-number · for/startups · Modern Teams pillar

# PILLAR: Modern Teams (how modern businesses communicate)
- Canonical: `/features/shared-team-phone` - Existing (built 2026-07-28; RELOCATED to /features/ same day per IA_PLAN freeze, 301 in place) · Definition · Learn (H1: "The shared team phone: one number your whole team answers")
- Definition: "A modern team shares one business number: everyone answers, texts, and calls back from it on their own mobiles, with unlimited users instead of per-seat pricing."
- Owns Numberline's biggest differentiator (unlimited users). One owner per overlap: shared inbox → here; overseas assistants → Answering Coverage; caller ID + traveling → Privacy.
- Children:
  - Shared inbox -> OWNED by the canonical as a section (shared-inbox page Rejected in the no-Google audit; Business Texting links to the section)
  - Unlimited users vs per-seat pricing -> OWNED by the canonical as a section (page Rejected in the no-Google audit; the pricing argument also appears on /pricing)
  - `/features/slack-notifications` - Existing · Feature Evaluation · Feature (MOVED 2026-07-28, 301 in place)
  - `/features/whatsapp` - Future · Feature Evaluation · Feature
  - `/features/webhooks` - Future · Feature Evaluation · Feature
  - `/use-cases/shared-team-phone-for-contractors` - Rejected (no-Google audit) - industry × pillar cross product; industry pages LINK use cases, never clone them (this is now a standing rule)
  - `/use-cases/remote-teams` - Future · Problem Solving · Use Case
  - `/learn/phone-permissions-and-roles` - Future · Feature Evaluation · Learn (post-launch, when product ships it)
- Related: features/business-texting · use-cases/overseas-assistants · /pricing

# PILLAR FAMILY: Industries
Each industry is a future mini-pillar; vertical children (e.g. plumber voicemail scripts) live in /learn/ or /use-cases/ but parent to their industry.
- `/for/plumbers` (REFERENCE implementation for the type), `/for/real-estate`, `/for/contractors`, `/for/consultants`, `/for/interior-design`, `/for/medspas`, `/for/law-firms` - Existing · Industry Research · Industry
- New businesses -> merged into /for/startups (301, July 2026)
- `/for/electricians`, `/for/hvac`, `/for/cleaning-services`, `/for/dentists`, `/for/accountants` - Held (no-Google audit) - vertical coverage for its own sake is keyword thinking; each page is gated on actual customer demand in that vertical, not on completing the set
- Standard links per industry page: 2–3 features + 2 use cases common in the vertical + 1 learn guide + relevant number type
- Standing rule (no-Google audit): industries LINK to use cases and learn pages; they never get vertical clones of them

## Held / reserved
- `/learn/google-voice-alternative` - DELETED 2026-07-28 (was Held); page archived as docs/marketing/templates/comparison-alternative-page.html; the /compare/ family remains Reserved post-launch
- `/compare/*` - Reserved · Commercial Investigation · Comparison - post-launch only, no pre-writing. No-Google audit: Versus pages survive (buyers genuinely evaluate); "X alternative" framing is search-query language and is dropped. Build only for competitors prospects actually name
- `/help/*` - Reserved · Setup Guide · - - product-usage docs, post-launch

## Beta roadmap (locked, July 2026)
The official build sequence to beta launch: the smallest set of pages that makes Numberline the authoritative product and knowledge source. 16 new pages in five tiers, built in this order. Statuses above are flipped to match; changes only by owner decision.

**Tier 1 - Feature catalog** (the graph's spine; canonical product documentation):
1. `/features/voicemail` - transcripts, AI summaries, voicemail to email: the strongest differentiator, currently pageless
2. `/features/business-texting` - Business Texting pillar canonical; the shared-inbox story
3. `/features/extensions` - Greetings & Extensions pillar canonical
4. `/features/business-caller-id` - closes the Privacy pillar loop
5. `/features/mobile-app` - move from /learn/ with 301
6. `/features/slack-notifications` - move from /learn/ with 301

**Tier 2 - Numbers (GET):**
7. `/numbers/keep-your-number` - porting gets its landing page; highest commercial intent
8. `/numbers/second-business-number` - the other entry fork ("new number or yours")
9. `/numbers/toll-free` - completes the type catalog
Not in the tier: local numbers (MERGED into the hub, permanent, never a page again); vanity + boston (Held: de-linked + noindexed, relisted when inventory ships); further cities (none until the picker can show real per-city availability). Footer note: the Numbers footer column is folded into Product ("Numbers" \u2192 hub) until Tier 2 ships, then returns with the three type pages.

**Tier 3 - Headless pillar canonicals** (pulled forward from Phase 2; a graph where children ship before their canonical is upside down):
10. `/features/shared-team-phone` - owns the unlimited-users differentiator every page gestures at (relocated 2026-07-28)
11. `/learn/answering-coverage` - owns "who answers when you can't"; the routing worldview's home

**Tier 4 - Templates (COPY; the most citable pages):**
12. `/learn/phone-menu-examples` - pairs with extensions
13. `/learn/business-texting-templates` - pairs with business texting

**Tier 5 - Use cases** (last: they link down into everything above):
14. `/use-cases/forward-business-calls-to-your-cell` - the day-one question
15. `/use-cases/after-hours-call-routing` - the junction page: forwarding + answering coverage + every industry strip
16. `/use-cases/keep-your-personal-number-private` - the Privacy pillar's resolution

Deferred to Phase 2 at beta lock: business-phone-while-traveling, overseas-assistants. Validated rejections (re-tested at beta lock, upheld): business-phone-number-cost (a section of do-i-need + /pricing), one-person-businesses (startups owns the buyer), how-to-get-a-business-phone-number (the /numbers/ hub + signup IS the answer). `do-i-need-a-business-phone-system` exists; strengthen, don't rebuild.

## No-Google audit (July 2026)
Every planned page was re-tested assuming search engines send zero traffic. Result: all ~24 Existing pages survive (commerce core, feature catalog, numbers storefront, scripts library, pillar canonicals, use cases, 7 industries). Roughly 15 planned pages were Rejected as keyword thinking; their real content lives as sections of named owners (see inline entries). Two standing rules came out of it: industries link, never clone; new cities and verticals are gated on demand, not coverage.

## Verification (checked at lock, July 2026)
- Every planned page above has exactly one parent pillar; the three cross-pillar overlaps (shared inbox, overseas assistants, caller ID/traveling) have a named single owner.
- No two pages answer the same question; the four question-boundary notes (business vs personal number, cost vs /pricing, voicemail scripts vs greeting examples, traveling vs working-from-anywhere) mark where duplication was possible and is forbidden.
- Every page carries Status · Intent · Type; every pillar carries canonical URL + definition + Related list.
- Known gaps, deliberate: Answering Coverage's canonical ships in beta (using-third-party-ai-services carries up-links until then); WhatsApp/webhooks pages are promised in the brand paragraph but Future (footer links can point at /features hub section first); `/help/` opens only when the product launches.
