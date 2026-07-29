# IMPLEMENTATION_REGISTRY.md - the operational layer

DESIGN_SYSTEM.md says what each primitive means. This file says where each primitive LIVES: its one canonical implementation, who consumes it, and its current state. The constitution is law; this is the land registry.
> **RESTRUCTURE 2026-07-29 (owner decision): the permanent site is 7 files (index, how-it-works, pricing, about, early-access, signin, signup); Features merged into how-it-works; /for/ and /numbers/ pages converted to campaign templates in docs/marketing/templates/campaigns/. Where a row below names a retired page as canonical owner or consumer, the SPECIMEN is now the sole markup canon and the campaign template copy is the reference render. Campaign pages (/go/*) register as consumers via tools/site-pages.json when created. See MARKETING.md.**
 Rule: **every reusable section has exactly one canonical implementation, and improving it must improve every page that uses it.**

## Why not REFERENCE_COMPONENTS.md / COMPONENT_LIBRARY.md
A "library" implies packaged code we don't have yet; "reference" implies look-but-don't-inherit, which is the disease we're curing. A registry is the honest artifact for a no-build site: a map from primitive to canonical source, with a migration state. When a build step arrives, the registry becomes the packing list.

## The three layers
1. **Spec** - DESIGN_SYSTEM.md \u00a73: what the primitive teaches, when to use it. Never duplicated here.
2. **Style authority** - `assets/canon.css`. Already exists and already works: it loads LAST on every page, so its rules win over each page's inline styles. Any style improvement made there is inherited site-wide today, with zero build tooling. This is the system's most important existing asset; grow it.
3. **Markup authority** - `docs/marketing/components/` (LIVE, 14 specimens): one `.html` specimen per primitive, extracted verbatim from its owner page. Until a build step exists, contributors copy markup FROM the specimen, never from an arbitrary page. The specimen and the owner page must match; when they disagree, fix both the same week (Governance \u00a79).

## Registry

Form legend: **partial** (identical everywhere; should become an include the moment a build step exists) \u00b7 **component** (one markup pattern, varying content) \u00b7 **template** (per-family page composition) \u00b7 **content model** (data, not markup).

Feature pages (Wave 2A, 2026-07-28): features/business-texting, features/voicemail, features/extensions built from the shared Feature/Learn shell + canonical primitives (shot-lg, event sequence, pillset, cards3, tix, FAQ, closer); their capability anchors are registered in tools/features.json. The FEATURE catalog truth lives in **`tools/features.json`** (IA_PLAN §0 rule 3): every surface renders capabilities from it, the /features #catalog band is its canonical render, and the verifier enforces name/href/surface agreement.

Consumer lists reference the checked-in page manifest **`tools/site-pages.json`** (standard / held_noindexed / utility / internal_artifacts / generated_or_stale, plus per-page nav/footer variant, family, indexability, reference status). Sweeps run over the manifest via **`node tools/site-system.mjs`** (`verify` \u00b7 `apply nav|footer|shared-shell [--write]` \u00b7 `report`; dry-run is the default, aborts on ambiguous boundaries or undeclared variants), never over a remembered page list; the manifest updates in the same commit as any page added, held, or retired.

Operating rule (tooling, binding): **"Shared-shell changes are not complete when the specimen changes. They are complete only after the propagation command updates every registered consumer and the full verification suite passes."**

| Primitive | Canonical owner | Consumers | Target form | State |
|---|---|---|---|---|
| Nav | specimen + `index.html` | every page in tools/site-pages.json (standard + held + utility, 33 files) | partial | CONVERGED 2026-07-28: one markup, root-relative links, no per-page active states. Sanctioned variant: `early-access.html` CTA targets `#join` (same anatomy, registered). First include when a build step exists |
| Footer | specimen + `index.html` | standard + held pages in tools/site-pages.json (31 files) | partial + content model (columns/links are data; capacity rule in NUMBERLINE.md) | CONVERGED 2026-07-28 to the specimen: verbatim entity paragraph, 6 columns, root-relative links. SANCTIONED VARIANT: utility footer (copyright `.foot-base` line only, no entity paragraph; specimen `docs/marketing/components/footer-utility.html`) for `signin.html` + `signup.html` ONLY; no other page may use it without a registry update |
| Hero shell (gradient, grid, answer, acts) | `use-cases/ring-multiple-cell-phones.html` | 5 reference pages | template per family | Phase 4 (2026-07-28): shared hero-story block (.hero-route stamp anatomy + .hstory/.srow rows) LIFTED to canon.css from 5 identical learn-page copies; stamped-card clearance law enforced by tools/site-system.mjs. Remaining per-family hero composition stays page-local by design (template, not component) |
| Sample Setup, tree form | specimen `components/sample-setup-tree.html` + `use-cases/ring-multiple-cell-phones.html` | `for/startups.html`, `features/call-forwarding.html` | component | RESOLVED: one row class `.ring` (+ `.st` or `.dest` chip); styles in canon.css |
| Sample Setup, Call Flow form | specimen `components/sample-setup-call-flow.html` + `for/plumbers.html` (`.shot`+`.route`, "Sample setup" tag) | all 8 industry pages + learn/shared-team-phone, learn/answering-coverage (.shot-lg variant, 2026-07-28) | component | After-hours = standard fn-ai row; .shot-ah strip RETIRED 2026-07-28 (CSS removed from canon + pages). One visual language for ALL setup cards on a page: the hero shot and the full-width `.shot.shot-lg` variant ("Where each call goes", destination pills via `.route .dest`, size/dest styles in canon.css) are the SAME component. The old `.flow` dialect is retired. Live-badge dialect REMOVED from all 6 older industry pages 2026-07-28 (real-estate, consultants, contractors, interior-design, medspas, law-firms); one anatomy site-wide, "Sample setup" label only, no badge |
| Event Sequence `.seq` | `use-cases/ring-multiple-cell-phones.html` | call-forwarding, startups | component | RESOLVED: `.seq` styles live only in canon.css; Phase 4 audit confirmed zero local copies remain |
| How-it-works steps `.glance-tiles` | specimen `components/how-it-works-steps.html` + `how-it-works.html` hero | how-it-works.html (in-page anchors), compare/google-voice.html, slack.html, whatsapp.html + comparison campaign template (/how-it-works.html#... links) | component | REGISTERED + CSS lifted to canon.css 2026-07-29: one card everywhere (4 numbered function tiles + 3 dashed "+" tiles); tile copy canonical; campaign pages add only a page-specific .steps-note below |
| Function List `.hsteps` | `index.html` hero | industry pages (`.hsteps.grid`), learn pages (hero-route) | component, 3 sanctioned contexts | stable; CSS in site.css |
| Setup Variations | specimen + rings page (`.vars`) | call-forwarding (`.vars.two`) | component | RESOLVED: one class; styles in canon.css |
| Made Of rows | specimen + rings page (`.uses`) | call-forwarding (`.uses`) | component | RESOLVED: one class; styles in canon.css |
| Now vs Later `.nvl` | `for/startups.html` | startups only (by design) | component | canonical, single consumer |
| Setup Picker `.pick` | specimen `components/decision-table.html` + `features/call-forwarding.html` | feature pages with a genuine choice between setups | component | REPLACED the Decision Picker July 2026 after challenging it against the site law "show the business running, not the software being configured": routing-mode cards (ring one phone / everyone / in order) became SCENARIO cards a visitor recognizes - `.pick-q` Step 1 "Who answers your calls?" + Owner only / Owner + assistant / The whole team, then Step 2 "Should it change after hours?" + full-width `.pk-mod` After hours card. Ring methods survive embodied, not named (one phone; in order via numbered badges; everyone at once). Tiles carry `.pn` name labels (Owner, Assistant, Sarah); `.pk-arrow` Business hours → After hours transition, after-hours label `.gl.alt`. Tag is "Best when"; never routing-mode names, system words, or "first responder"; no emoji. Same grid architecture and tile vocabulary as before; scheduling is a modifier, never a fourth equal card. Styles in canon.css |
| Comparison Table `.cmp` | specimen (DATA SOURCE) + `index.html` | LIVE: index.html + how-it-works.html; campaign templates (templates/campaigns/vertical-*) carry inherited tables | component + content model | ONE SOURCE OF TRUTH, audited + re-verified 2026-07-28: comparison claims are product data, not page copy - updated in the canonical source, verified against official sources, inherited everywhere. Polarity law: alternatives red ✕ `.gap` only (qualified, durable; no absolutes), Numberline rows green ✓ `.has` only, 4-6 chips selected per page from the approved pool. Heading is "What to know". Renames: "Per-user phone systems" (was Per-seat), "Twilio APIs" (was Twilio); "Generic calling app" REMOVED (unverifiable). Verification metadata (last_verified, sources, approved/rejected claims) lives as internal comments in the specimen. Pages choose WHICH rows to show, never rewrite them. Sanctioned dialects (same factual law): google-voice-alternative 3-column, using-third-party-ai-services 2-row choice contrast. Homepage `.compare-table`/`.cmp-r` prose dialect RETIRED 2026-07-28: index.html now consumes the canonical `.cmp` rows |
| FAQ accordion | specimen + rings page | every page with a visible FAQ (see tools/site-pages.json) | component | `.fq-text` fork REMOVED from all 17 consumers 2026-07-28; one anatomy (question text in `<summary>` + icon + `.ans`). CSS lift to canon.css still pending |
| Closer card | specimen + rings page | standard pages (tools/site-pages.json) | component | LAW (July 2026): ONE primary CTA ("Get early access" + guillemet) + `.closer-mini`/`.closer-micro` line; NO secondary button in closers (heroes keep the two-button acts row). Normalized site-wide July 2026. Phase 4 (2026-07-28): defeated local duplicates removed from index/how-it-works/features/pricing/about; `.closer-micro` lifted to canon.css (was 5 identical copies); page-local `.closer{}` section wrapper (padding/bg) stays local by design |
| Section header `.sec-head` | rings page | every page | component | kicker pills REMOVED site-wide 2026-07-28 (`sec-kicker`/`jx-kicker`/`kicker` label rows); every heading stands alone; dead kicker CSS cleans up with the inline-CSS migration |
| Topic Index `.tix` | specimen + `learn/index.html` | /learn/, /for/, /use-cases/, /numbers/ hubs; features.html "Go deeper" | component + content model | LIVE July 2026, revised: plain-text two-column list (title + one-line promise), no boxes, no type tags; styles in canon.css |
| Script Card `.script-card` | RETIRED 2026-07-28 (owner decision: no scripts landing page; greetings guidance lives on features/extensions#greeting) | none | retired | specimen deleted; .script-card CSS removal rides the next canon cleanup |
| Number Card `.numcard` | specimen + `numbers/index.html` | /numbers/ family | component | LIVE July 2026: specimen number + type/place chips + note; styles in canon.css |
| Number Picker `.resv` | specimen + `numbers/boston.html` | /numbers/ family heroes (city + type pages) | component | LIVE July 2026. Purpose: the storefront moment - inventory to choose, where Sample Setup shows the system working; the two are the Numbers family's hero pair. Anatomy: .resv-top title + mono tag > .rrow (display-font number + area-code chip + Reserve) > .resv-more browse link > .resv-foot honesty note. Variants: chip set per page (city codes, Toll-free, type). Pre-launch every action routes to /early-access.html; post-launch the rows become live inventory without markup changes. Distinct from Number Card `.numcard` (static specimen display on hubs); do not merge them |
| Feature Catalog `.fcatalog` | RETIRED 2026-07-28 (owner: features page reverted to its pre-catalog composition; tools/features.json remains the capability truth for copy and future surfaces) | none | retired | specimen deleted; .fcatalog/.fcat-flat CSS removal rides the next canon cleanup |
| Trust Strip `.strip` | specimen + `index.html` | EVERY non-utility page, directly below the hero (owner decision 2026-07-28) | component | Press row added 2026-07-28 (.strip-press: "From the team featured in" + Forbes/Inc./CNBC/NYT wordmarks, a TEAM claim per pre-launch law) above the four icon + phrase items; the ownerless homepage .trust press strip was RETIRED into this component; all styles in canon.css |
| Hero CTA block (eyebrow/acts/bullets) | specimen + `learn/business-phone-number.html` | every landing hero with CTAs | component | LIVE July 2026: CTA order + guillemet LAW per CLAUDE.md; checkmark bullets below acts; styles in canon.css |
| Buttons, chips, stamps, colors | `assets/site.css` + `canon.css` | everything | style authority | already centralized |
| Trigger-action cards `.trigger-action` | `index.html` (homepage-only composition, NOT registered for reuse) | index.html only | page-specific composition | Renamed from `.flow` 2026-07-28 (naming collision with the retired setup-card dialect, not a fork; trigger → action cards: "Missed a call?" → Slack). Scenario tags on for/startups renamed `.sk` → `.scenario-tag` same day (functional labels kept, not kicker pills). Promote either only via the admission rule |

Repository hazard RESOLVED: `dist/` no longer exists. Rule going forward: never create a manually-copied duplicate tree of the source pages; if a build output directory is ever introduced, it is generated only, never hand-edited.

## Roadmap

- **Phase 1 - DONE (July 2026).** `docs/marketing/components/` holds 15 specimens: nav, footer, hero-shell, sample-setup-tree, sample-setup-call-flow, event-sequence, function-list, setup-variations, made-of-rows, now-vs-later, decision-table, comparison-table, faq, closer, section-header. Topic Index and Script Card wait for their first reference implementation.
- **Phase 2 - DONE for primitives (July 2026).** canon.css now carries a CANONICAL PRIMITIVES layer: sec-head, shot anatomy (both forms), tree connectors + .ring row, seq, vars, uses, faq, closer, step pill. Reference pages keep only page-specific rules. Deferred: generic hero-shell classes (.hero collides with the homepage hero; rename needed at Phase 4) and older non-reference pages, which still carry their own copies that canon now overrides.
- **Phase 3 - forks resolved on reference pages (July 2026):** .day1/.fw are gone, .ring is the one tree row; .setups/.setup/.sk renamed to .vars.two/.var/.vk; .with/.withrow renamed to .uses/.use. Deferred deliberately: the 7 older industry pages (Live-badge dialect, kicker pills, .fq-text FAQ wrapper) converge on next touch per page; canon.css already overrides their shared styles.
- **Phase 4 - templates.** With markup canonical and styles central, each family's page becomes: template (from PAGE_BLUEPRINTS) + content. New pages are assembled, not written. Nav and footer become build-time includes if a static build (e.g. Eleventy) is adopted; until then they remain scripted-sweep partials.
- **Phase 5 - CMS readiness.** The content model already exists implicitly: KNOWLEDGE_GRAPH metadata (pillar, status, intent, type) + per-page setup data (greeting text, menu options, destinations, FAQ pairs, related links). Formalizing those fields turns every primitive into structured content; the registry's "target form" column is the migration map.

Specimen paths: every primitive above with an owner has a specimen at `docs/marketing/components/<name>.html`.

## No orphan visual patterns

Not every HTML element needs to become a registered component. Over-componentization creates bureaucracy without improving consistency.

Every repeated, branded, or structurally meaningful visual pattern must have one canonical implementation.

A page-specific element may remain local only when it:

- serves a genuinely unique content need
- uses existing tokens and primitives
- does not introduce a new visual language
- does not need to update across multiple pages

A local pattern must be promoted into this registry when:

- it appears on a second page
- contributors are likely to copy it
- it develops variants, data inputs, or behavior
- inconsistency would create visible drift
- it becomes recognizable as part of Numberline's design language

Signature or complex patterns enter the registry on first use.

The rule is not "everything is a component." The rule is: **nothing reusable or recognizable is allowed to remain ownerless.**

## Governance: admission, retirement, required fields

**Component admission.** A pattern becomes a registered component when: it solves the same problem in multiple places; future pages are expected to reuse it; multiple implementations would create drift; it improves consistency, comprehension, or maintenance; and it has a clear canonical owner.

**Component retirement.** If two components teach or solve the same thing, one should be removed or absorbed. The implementation system should grow more slowly than the website. Adding a new component requires a higher bar than adding a new page.

**Required registry fields.** Every registered pattern must identify: specification (the DESIGN_SYSTEM or CLAUDE.md section) · canonical owner page · canonical specimen path · style authority (site.css / canon.css / inline-by-design) · registered consumers (exact list, not an estimate) · sanctioned variants · current state · migration path.

Operating rule (verbatim, binding): **"Before improving any shared section on one page, check IMPLEMENTATION_REGISTRY.md. Make the change in the canonical implementation, then update every registered consumer in the same session."**
