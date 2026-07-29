# PRESENTATION REVIEW - how the frozen IA is experienced (2026-07-28)

Status: REVIEW ONLY, nothing implemented. The IA (IA_PLAN_2026-07-28.md) is untouched: same URLs, same owners, same anchors, same registry. This document proposes how that architecture is PRESENTED. Each recommendation names its component verdict and design-system impact; implementation happens only on owner approval, as "Presentation Wave P1/P2" below.

## 1. The Features hub

**Current problem.** The hub is two stacked ideas: editorial feature rows (.frow) on top, and the registry catalog rendered as a Topic Index (.tix) band at the bottom. The tix is a text index - title + sentence + link. It is truthful and verified, but it reads like a sitemap appendix: the buyer's last impression of the product page is a list of links.

**Why it feels wrong.** .tix is a DOCUMENTATION primitive (built for hub rosters of articles). Products aren't experienced as indexes; Stripe/Linear/Notion communicate breadth with visual capability groups where every entry looks like a thing the product DOES, not a page you could read.

**Recommended pattern.** The catalog stops being a band and becomes the page's spine:
- Hero: one product promise + the branded function-list card (exists).
- **Capability Matrix** (see \u00a74) directly under the hero: whole product in one glance.
- Six group sections in the alternating band rhythm, one per registry category, each keeping its anchor (#numbers, #integrations...): a short group claim, ONE compact product visual per group (the group's signature component: a mini Sample Setup for routing, the inbox rows for texting, the Event Sequence snippet for voicemail), and a **capability-card grid** - icon tile + capability name + one-line outcome, function-colored, each card linking to its registry owner. Cards are the hstep vocabulary with a link, not a new visual language.
- Closer (exists).
The registry still renders every row (data-fid, verifier-checked); "Coming" chips unchanged; the editorial .frow content folds into the group sections instead of duplicating them.

**Component verdict.** No new component class: the capability card is a sanctioned linked variant of the Function List (registry entry updated, not a new row). The hub becomes the Feature-hub reference implementation.

**Design-system impact.** features.html restructured (same URL/anchors); function-list registry row gains the "capability card" variant; catalog verifier checks unchanged (they key on data-fid, not on .tix).

## 2. Feature-page endings

**Current problem.** Every feature page ends Related topics (.tix) -> FAQ -> closer. "Related topics" is a knowledge-base sign-off.

**Why it feels wrong.** A buyer finishing a capability page has one question: "what does this look like in my actual day?" - not "what else can I read?" Product sites answer with the workflow, not bibliography.

**Recommended pattern (owner refinement, 2026-07-28: workflows, not adjacency).** Replace the Related-topics band on FEATURE pages (Learn pages keep it - they ARE knowledge pages, and the docs-feel is correct there) with **"How a business runs on it"**: a WORKFLOW story told with the Event Sequence primitive - the capability in the middle of a real day, e.g. on the texting page: call hits the business number -> menu routes it -> the team's mobiles ring -> nobody free -> voicemail transcript -> text-back from the business number -> Slack notification. Each workflow node that is another capability links to its owner page, so adjacency comes along for free INSIDE the story instead of as a link list. Where a workflow is better shown as a configuration than a timeline, the Sample Setup card is the sanctioned alternative. Ending order: FAQ stays (buyers ask questions; AI extraction depends on it), then the workflow band, then closer - the last product impression is the business running, not links.

**Component verdict.** "How a business runs on it" becomes a canonical PATTERN built from existing primitives (Event Sequence / Sample Setup with linked nodes - linked seq-nodes are a sanctioned variant, registered, not a fork). Data-driven option: features.json gains a `workflow: [ids]` field - a SCHEMA AMENDMENT requiring owner approval under the freeze (additive, surfaces-style). Verifier rule: every workflow id exists and is live.

**Design-system impact.** One new registry field; tix remains owned by hubs/Learn; feature pages' tix consumers re-registered under the new pattern.

## 3. The footer

**Current problem.** Seven Features links + six Learn links + industries + use cases: the footer is re-arguing the whole graph. Every new flagship page restarts the which-link-leaves debate.

**Why it feels wrong.** The footer's constitutional job (NUMBERLINE.md) is "entrance to the graph," but entrances don't enumerate; hubs do. A footer that mirrors the hub decays into a second navigation system - exactly what the capacity rule was written to prevent, and the rule's 5-7 ceiling is loose enough to let it happen.

**Recommended pattern.** Agreed, with a principle attached: **the footer orients; hubs expose.** Each content column = hub link + at most FOUR flagship deep links, where flagship = the pages a first-time buyer must not miss, reviewed when a wave ships, encoded as `surfaces:["footer"]` in the registry (Features: Business texting, Call forwarding, Shared team phone, Mobile app - your list). Consequences to accept explicitly: Voicemail, Extensions, and Using third-party AI services leave the footer and are discovered via the hub matrix + catalog (the AI label law still governs its name wherever it appears). Learn trims to the same standard (pillar canonicals only). Amendment needed: NUMBERLINE.md capacity rule 5-7 -> "hub + \u22644 flagship."

**Component verdict.** No component change; a governance change (capacity rule) + registry surfaces update + one sweep.

**Design-system impact.** Footer specimen edit, ~35-page propagation, verifier presence-check keys off surfaces automatically.

## 4. The Feature Catalog - ADOPT as canonical (renamed from "Capability Matrix" per owner refinement)

**Naming law (owner, 2026-07-28):** this component is the **Feature Catalog**, never "matrix," "grid," or "comparison table" - in the registry, in class names, and in how contributors think about it. The Feature Catalog is the visual representation of everything Numberline can do: grouped capabilities, rich function-colored cards, visual scanning, product discovery. Shopify/Linear/Apple, not Salesforce - no rows-and-checkmarks anywhere in it.

**Challenge accepted, verdict: yes, and it is the missing piece.** Test against the admission rule: multiple surfaces want it (homepage below hero, features hub spine, industry pages' "everything included," future compare + sales pages) \u2713 - hand-copying it would drift within a month \u2713 - it has an obvious owner (features hub) and an obvious data source (features.json - it can ONLY be built because the registry exists) \u2713.

**What it is.** One-glance product discovery, NOT a pricing table and NOT the comparison table (.cmp argues against alternatives; the catalog presents the product alone): six function-colored group headers (Numbers, Greetings & extensions, Call routing, Voicemail, Texting & inbox, Apps & AI), each holding 3-5 capability CARDS (icon tile + short name + one-line outcome where space allows), status-aware ("Coming" chip styling for promised), zero prose paragraphs. Rendered from features.json with data-fid attributes; a `surfaces` id ("catalog") controls membership; the verifier extends its existing checks to any surface carrying it.

**Component verdict.** New canonical component: **Feature Catalog (.fcatalog)**. Specimen in docs/marketing/components/, owner features.html, registered consumers per surface. This is the rare admission the registry rules exist to allow: it REPLACES prose breadth-claims on several pages rather than adding to them. The current tix-based #catalog band is its interim render and is absorbed by it in P1.

## 5. Think like a product company - the article-DNA audit

**Current problem.** The feature/Learn shell shares one essay rhythm: What is X -> why it matters -> cards -> sample -> FAQ. On Learn pages that rhythm is correct. On feature pages it means the product appears in band 4 or 5.

**Why it feels wrong.** Software buyers evaluate by SEEING the thing work. Every strong product site leads with the running product; explanation annotates it.

**Recommended pattern** (codified as a PERMANENT Design System law per owner approval, 2026-07-28 - to be written into DESIGN_SYSTEM.md in P1): ***"On every Feature page, the product must be running within the first two content bands. Demonstrate first, explain second."*** - hero visual (already product-shaped) then the Sample Setup / Event Sequence demo immediately after the strip, with the definitional copy compressed to the hero-sub + one annotation line. Question-headings stay (AI retrieval and honesty both depend on them); their sections become captions to visuals instead of essays with illustrations. No component changes - a re-sequencing law applied page by page as pages are touched, not a big-bang rewrite.

## Recommended implementation order (on approval)

- **P1 (one session):** Feature Catalog component (.fcatalog) + registry `catalog` surface -> features hub restructure (\u00a71) -> footer trim + capacity-rule amendment (\u00a73) -> demo-first law written into DESIGN_SYSTEM.md (\u00a75).
- **P2 (one session):** `workflow` schema amendment -> "How a business runs on it" endings on the six feature pages (\u00a72) -> homepage Feature Catalog adoption.
- **P3 (as touched):** demo-first re-sequencing applied to existing feature pages (\u00a75).
Each step updates the registry docs and runs the verifier; none touches a URL, an owner, or an anchor.
