# SYSTEM REVIEW - implementation vs constitution (2026-07-28)

> **Class-name hygiene pass (2026-07-28, pre-Phase-3):** homepage `.flow`/`.flow-grid` renamed to `.trigger-action`/`.trigger-grid` (a naming collision with the retired setup-card dialect, not a component fork; §8 finding resolved). for/startups `.sk` scenario tags renamed to `.scenario-tag` (functional labels preserved, appearance unchanged). Zero ambiguous `.flow`/`.sk` classes remain in active pages; canonical Call Flow untouched. The "Who this is for" grids on learn/business-phone-number, small-business-phone-system, personal-cell-vs-business-phone-system, slack-notifications, google-voice-alternative remain an APPROVED DEFERRED CONTENT DEBT per DESIGN_SYSTEM §10 (fold into copy or FAQ on next touch; requires a content decision, not a sweep).

> **Phase 3 record (2026-07-28):** `tools/site-system.mjs` (Node, zero deps) added: `verify` (shell conformance, deprecated markup, retired comparison wording, style order, canonical/schema/sitemap, internal links, held-page links, comparison data model, registry fields; non-zero exit on failure), `apply nav|footer|shared-shell` (dry-run default, `--write` to apply, aborts on ambiguous boundaries/undeclared variants, idempotency self-check), `report`. Manifest upgraded to per-page metadata (category, family, nav/footer variant, indexability, reference). Utility-footer specimen created (`components/footer-utility.html`). Verification suite executed against the current site: 33 pages, 0 failures; nav + footer dry-runs report 0 changes (Phase 2 convergence holds); comparison model verified (67 rows across 14 tables match the data source, polarity clean). Verifier allowlist: `.trigger-action` (homepage composition), `.scenario-tag` (startups labels), `.whofor` (deferred content debt on 5 Learn pages) are NOT flagged. Not tool-managed by design: heroes, page content, comparison rewrites, CSS migration (Phase 4).

> **Phase 4 record (2026-07-28, CSS authority lift):** canon.css gained the shared hero-story block (.hero-route + stamp + .hstory/.srow, was 5 identical learn copies), .shot-stamp + .shot last-child radius (was 7 industry copies), and .closer-micro (was 5 identical core copies). Removed from pages: defeated same-selector duplicates (closer card/h2/p/btn on index + how-it-works; .shot anatomy rules on all 7 industry pages, where canon already won the cascade) and dead selectors (.kicker/.jx-kicker/.sec-kicker rules, .shot-top .badge ×7, retired .modes/.mode-row block on call-forwarding, homepage .compare-table/.cmp-r removed earlier). Verifier stamp-clearance check now reads overhangs from canon.css + page overrides. Left page-local by design: per-family hero composition (template, not component), .closer{} section wrappers, .shot .route sub-rules pending the route-dialect convergence.

> **Status (2026-07-28): Phases 1, 2, 3, and 4 of §13 are COMPLETE.** Phase 1: canonicals aligned to the graph, flat slugs 301'd, schema added, sitemap.xml created, footer entity paragraph made verbatim, homepage style order fixed, vanity de-linked. Phase 2: `.fq-text` fork removed (17 pages), kicker pills removed site-wide, Live badges removed (6 industry pages), nav and footer converged onto the specimens (utility footer registered for signin/signup, early-access #join nav variant registered), page manifest created at `tools/site-pages.json`, registry consumer lists made exact. Owner decisions recorded: `.html` URLs stay directly reachable until pretty URLs land with an internal-link sweep; robots.txt stays blocked until beta. Remaining phases: 3 (sweep tooling script), 4 (inline-CSS lift), 5 (pre-100-pages items incl. mobile accordion footer decision, export/ cleanup).


Principal design-systems review of the Numberline marketing site (33 live pages) against README, NUMBERLINE, CONTENT_BIBLE, KNOWLEDGE_GRAPH, PAGE_BLUEPRINTS, DESIGN_SYSTEM, NUMBERS_ARCHITECTURE, HOW_TO_EDIT, IMPLEMENTATION_REGISTRY, CLAUDE.md, site.css, canon.css. Scope: does the implementation operationally enforce the documented system? No pages were redesigned or patched during this review.

## 1. Executive verdict

**Can Numberline improve one canonical implementation and trust the site to inherit it without drift? Partially, and only for styles and one data model.**

- YES for shared styling: every page loads site.css + canon.css, and canon loads after inline styles on 32 of 33 pages. A canon.css edit genuinely propagates site-wide today. This is the system's strongest operational asset.
- YES for comparison claims: the July 2026 audit made `.cmp` a real data model (specimen = data source, verified claims, pages select rows). It is the proof that edit-once works in this repository.
- NO for shared markup: nav, footer, FAQ, heroes, and closers are hand-copied. The registry documents this honestly, but the copies have already diverged at 33 pages: 5 footer variants, 2 nav link dialects, a 15-page FAQ fork, a 6-page Sample Setup badge fork, and two competing canonical-URL schemes. Nothing mechanical prevents the next page from forking further.
- The documentation layer is genuinely excellent and internally consistent; the gap is enforcement mechanics (a sweep script, a page manifest, link/canonical lint), not more doctrine.

Shortest path to yes: (1) one canonical-URL + schema sweep, (2) one FAQ/badge/kicker convergence sweep, (3) a checked-in sweep script + page manifest so nav/footer edits are one command, (4) the registry hygiene added in this review (admission/retirement/no-orphan rules, required fields).

## 2. Critical issues before beta

1. **Two live URL schemes with contradictory canonicals.** Older pages carry `<link rel="canonical">` pointing at legacy flat slugs (`/phone-system-for-consultants`, `/small-business-phone-system`, `/mobile-app`, `/slack-notifications`, `/personal-cell-vs-business-phone-system`), served as 200 rewrites in `_redirects`, while the knowledge graph and newer pages canonicalize to `/for/...`, `/learn/...`. Every affected page is reachable at 2+ URLs and its canonical disagrees with the graph. Fix: sweep canonicals to graph URLs; flip flat-slug rewrites to 301s. Affected: consultants, contractors, interior-design, law-firms, medspas (absolute-URL form, also inconsistent), real-estate, small-business-phone-system, personal-cell-vs, slack-notifications, mobile-app, google-voice-alternative (held, lower priority).
2. **Missing canonical + schema on core pages.** index, how-it-works, features, pricing, about have no canonical tag and no BreadcrumbList/FAQPage schema. NUMBERLINE.md requires BreadcrumbList on every page. Older industry/learn pages also lack schema (only the 10 newer/reference pages carry it).
3. **Held page linked from a live body.** `features.html` links `/numbers/vanity.html` (held + noindexed). The graph sanctions only the /numbers/ hub linking held pages.
4. **Homepage style authority inversion.** index.html carries `<style>` blocks in `<body>` after the canon.css link, so homepage inline rules can silently defeat canon. Unique to index; every other page loads canon last.
5. **No sitemap.xml.** Fine while robots.txt disallows all, but the segmented-per-hub sitemap NUMBERLINE.md specifies must exist at beta.

## 3. Important issues before 100 pages

1. **Nav/footer are 33 hand copies with no sweep tool.** Already: 5 footer hash variants (root relative-link variant; newer subfolder; older subfolder with a different column split; signup; early-access) and 2 nav dialects (root pages use relative `index.html` links against the root-relative law; subfolder pages comply). Smallest fix: a checked-in `tools/sweep` script + a page manifest (list of all site pages) so partial updates are one command; adopt build-time includes only when a build step arrives (registry Phase 4).
2. **Footer brand paragraph is not the graph's verbatim paragraph.** Every footer opens "Designed for startups, small businesses, and modern teams, Numberline is a business number and phone system in one. Get a local..." while KNOWLEDGE_GRAPH's brand entity definition reads "Numberline is a business number and phone system in one for startups, small businesses, and modern teams. Get a local...". The reword is consistent site-wide, so this is a docs-vs-implementation conflict, not drift; the owner must pick one text and the other artifact is amended the same day.
3. **The deferred convergence debt is bigger than documented.** Registry says "7 older industry pages" lag; actual: FAQ `.fq-text` fork on ~15 pages including the Learn REFERENCE page (learn/business-phone-number, 7 occurrences, plus 1 kicker); kicker pills on 8 pages; Live-badge Sample Setup dialect on 6 industry pages. Reference pages must be fork-free or the fork is canon.
4. **Inline CSS duplication.** 17-19KB of inline styles per older page, 34-35KB on index/features; hero shell, closer, and event-sequence CSS still pasted per page (registry knows; the hero-shell rename blocking it should be scheduled).
5. **Mobile accordion footer is documented but does not exist.** NUMBERLINE.md defines it as permanent architecture; no page implements any footer disclosure (no details/accordion CSS in site.css). Either build it once in the footer partial or amend the doc.
6. **Registry consumer lists are approximate** ("most learn pages (~17)"). Before 100 pages every row needs an exact consumer list, or sweeps will miss pages (this review's comparison sweep found consumers by grep, not by registry).

## 4. Future issues before CMS

- Formalize the implicit content model (registry Phase 5): per-family field lists exist in §11 below; comparison table already proves the pattern.
- The `export/` tree must be declared generated-only or removed (see §12); a CMS migration that ingests stale copies would resurrect retired claims (export/reference-pages still contains the pre-audit comparison prose and old footers).
- Structured data should be generated from the graph (breadcrumbs and FAQ pairs are already data).
- Analytics/attribution: no measurement layer exists; decide before scale, not during.

## 5. Page-by-page compliance table

Family: Core (C), Hub (H), Industry (I), Startup (S), Feature (F), Use case (U), Learn (L), Template (T), Number (N). REF = reference implementation. Verdicts: OK = compliant, MIN = minor drift, MAT = material drift.

| Page | Fam | Role | Verdict | Rule violated | Should use |
|---|---|---|---|---|---|
| index.html | C | ordinary | MIN | no canonical/schema; relative nav/footer links (root-relative law); body `<style>` after canon.css (authority inversion); unregistered `.flow` + `.compare-table` local patterns (the latter is a sanctioned cmp dialect; `.flow` has no owner) | canonical tag; head-only styles; register or localize `.flow` |
| how-it-works.html | C | ordinary | MIN | no canonical/schema | canonical + BreadcrumbList |
| features.html | C/H | ordinary | MAT | links held /numbers/vanity; no canonical/schema; 35KB inline CSS; one-off `.vdb` dashboard mockup and `.frow` catalog rows are ownerless (will be copied when feature pages ship) | de-link vanity; register `.frow` row pattern before Tier 1 pages copy it |
| pricing.html | C | ordinary | MIN | no canonical/schema; own nav hash | canonical + schema |
| about.html | C | ordinary | MIN | no canonical/schema | canonical + schema |
| early-access.html | C | ordinary | MIN | `.fq-text` FAQ fork; own footer variant | canonical FAQ markup |
| signin/signup.html | C | utility | OK | signup 302-gated as documented | - |
| for/index.html | H | REF (hub) | OK | - | - |
| for/plumbers.html | I | REF | OK | - | - |
| for/consultants.html | I | ordinary | MAT | legacy canonical slug; Live badge dialect; kicker pills ×6; `.fq-text` ×8; no schema; old footer variant | converge on plumbers + specimens |
| for/contractors.html | I | ordinary | MAT | same set | same |
| for/interior-design.html | I | ordinary | MAT | same set | same |
| for/law-firms.html | I | ordinary | MAT | same set | same |
| for/medspas.html | I | ordinary | MAT | same set + absolute-URL canonical | same |
| for/real-estate.html | I | ordinary | MAT | same set | same |
| for/startups.html | S | REF | OK | - | - |
| features/call-forwarding.html | F | REF | OK | - | - |
| use-cases/index.html | H | REF | OK | roster of 1 matches reality | - |
| use-cases/ring-multiple-cell-phones.html | U | REF | OK | - | - |
| learn/index.html | H | REF | OK | - | - |
| learn/business-phone-number.html | L | REF | MIN | carries the deprecated `.fq-text` wrapper ×7 and 1 kicker pill ON THE REFERENCE PAGE | fix; a reference page carrying a documented fork makes the fork canon |
| learn/small-business-phone-system.html | L | ordinary | MAT | legacy canonical; kickers ×11; `.fq-text`; no schema | converge |
| learn/personal-cell-vs-business-phone-system.html | L | ordinary | MAT | same set | converge |
| learn/do-i-need-a-business-phone-system.html | L | REF (buying guide) | MIN | `.fq-text` ×4 | fix on reference |
| learn/slack-notifications.html | L | ordinary | MAT | legacy canonical; kickers ×11; `.fq-text`; no schema; planned move to /features/ (Phase 1) | converge; execute move per roadmap |
| learn/mobile-app.html | L | ordinary | MAT | legacy canonical (/mobile-app); kickers ×10; `.fq-text`; no schema; planned move to /features/ | converge; execute move per roadmap |
| learn/using-third-party-ai-services.html | L | ordinary | MIN | kickers ×8; no schema | converge on next touch |
| learn/voicemail-greeting-scripts.html | T | REF | OK | - | - |
| learn/google-voice-alternative.html | L | held | OK (as held) | noindexed + de-linked as documented; kickers ×11 tolerable until /compare/ move | - |
| numbers/index.html | H | REF | OK | held links sanctioned here | - |
| numbers/boston.html | N | REF (city, held) | MIN | `.fq-text` ×4 | fix with FAQ sweep |
| numbers/vanity.html | N | REF (type, held) | MIN | `.fq-text` ×5 | fix with FAQ sweep |

Design-philosophy spot checks (begins with a business, one primitive per band, no dark mockups, heading quality, CTA law): reference pages pass; older industry/learn pages pass in spirit with the cosmetic forks above; no page reads as generic SaaS. No em dashes anywhere in live pages (0 occurrences).

## 6. Primitive and component registry table (target-form classification)

| Pattern | Target form | Spec | Specimen | Style authority | State |
|---|---|---|---|---|---|
| Function colors, neutrals, type | token | DESIGN_SYSTEM §4 | n/a | site.css | enforced |
| Buttons, chips, stamps | token/primitive | CLAUDE.md + DS §4 | n/a | site.css + canon | enforced |
| Nav | partial | NUMBERLINE (locked 4 items) | components/nav.html | site.css | 2 link dialects; hand copies |
| Footer | partial + content model | NUMBERLINE (capacity rule) | components/footer.html | site.css | 5 variants; brand paragraph conflicts with graph |
| Mobile accordion footer | partial behavior | NUMBERLINE (permanent) | none | none | DOCUMENTED, NOT BUILT |
| Hero shell | page-family template | DS §5 | components/hero-shell.html | inline per page | CSS not yet lifted (rename blocker) |
| Hero CTA block | component | CLAUDE.md law | components/hero-cta-block.html | canon.css | live |
| Trust strip | component | DS §10 (debt candidate) | components/trust-strip.html | canon.css | live |
| Sample Setup (tree) | component | DS §3 | sample-setup-tree.html | canon.css | resolved |
| Sample Setup (Call Flow) | component | DS §3 | sample-setup-call-flow.html | canon.css | FORK: Live-badge dialect on 6 industry pages |
| Event Sequence | component | DS §3 | event-sequence.html | inline ×3 | CSS pasted per page |
| Function List | component | DS §3 | function-list.html | site.css | stable |
| Setup Variations / Made-of | component | DS §3 | setup-variations / made-of-rows | canon.css | resolved |
| Setup Picker (.pick) | component | registry row | decision-table.html | canon.css | live (replaced Decision Picker 7/2026) |
| Comparison Table (.cmp) | structured content model | registry row | comparison-table.html (DATA) | canon.css | the model implementation |
| Now vs Later | component | DS §3 | now-vs-later.html | canon | single consumer by design |
| Before/After (.ba) | component | DS §3 | NONE | inline | in the constitution, no registry row or specimen |
| Step pills (.walk/.wstep) | component | DS §10 (steps overlap note) | NONE | canon ("step pill") | used on multiple pages, no registry row/specimen |
| FAQ | component | DS §3 | faq.html | canon.css | FORK: `.fq-text` on ~15 pages incl. 2 reference pages |
| Section header | component | DS §2 | section-header.html | canon.css | kicker pills still live on 8 pages |
| Closer | component | registry law | closer.html | inline everywhere | CSS not yet lifted |
| Topic Index / Script Card / Number Card / Number Picker | component (+content model) | registry rows | present | canon.css | live, clean |
| Homepage .flow diagram, .compare-table, features.html .frow/.vdb, pricing cards | page-specific composition | none | none | inline | acceptable as local TODAY; .frow and .compare-table are the two most likely to be copied (see §8) |

## 7. Accidental forks (owner · consumers · difference · convergence · risk)

1. **FAQ `.fq-text` wrapper** · owner: rings page + faq.html specimen · consumers forked: 6 older industry, 6 older learn, early-access, boston, vanity, AND learn/business-phone-number + do-i-need (reference pages) · markup-only difference (span wrapper in summary) · converge by one sweep (remove wrapper); zero visual risk (canon styles both) · LOW risk.
2. **Sample Setup "Live" badge dialect** · owner: for/plumbers.html call-flow form · consumers forked: consultants, contractors, interior-design, law-firms, medspas, real-estate (`<span class="badge"><i></i> Live</span>` in hero shot header) · markup + content difference; DS bans "Live" badges · converge on next touch per registry, or one sweep · LOW risk.
3. **Kicker pills** · deprecated by registry · 8 pages · markup; remove `.sec-kicker` rows · LOW risk (checked: headings stand alone).
4. **Nav link dialect** · owner: nav specimen · root pages use relative hrefs, subfolder pages root-relative · behavior identical at root, violates the root-relative law and blocks a single shared partial · converge root pages to root-relative · LOW risk.
5. **Footer variants** · owner: footer specimen · older pages carry a different column split (Features link placement); signup/early-access carry bespoke short footers (arguably sanctioned utility variants, but unregistered) · converge older pages; register the utility variant · LOW-MED risk (link capacity rule must be re-checked during sweep).
6. **Canonical-URL scheme** · owner: KNOWLEDGE_GRAPH · 11 pages canonicalize to legacy flat slugs; medspas uses absolute URL form · content-model fork · sweep canonicals + flip rewrites to 301 · MED risk (must ship with the redirect flips in the same deploy).
7. **Inline hero/closer/seq CSS copies** · owner: canon.css · every older page · style duplication (canon currently overrides shared selectors, so visual risk is low; the hazard is index.html's post-canon body styles) · lift then delete inline copies per Phase 2 plan · MED effort.

## 8. Recurring ownerless patterns

- **`.walk/.wstep` numbered setup steps**: used beyond one page, styled via canon "step pill", never registered, no specimen. Promote (registry row + specimen) or fold into Event Sequence guidance.
- **Before/After (.ba)**: constitution names it; registry and components/ do not know it. Add row + specimen at next use, or mark dormant.
- **features.html `.frow` catalog rows + `.fsubs` sublists**: the features hub will grow with Tier 1; contributors will copy these rows. Register before Tier 1 ships.
- **Homepage `.flow` / `.flow-grid`**: an unregistered third setup-diagram dialect by class name (DS forbids new setup-card dialects). Either bless it as a homepage-only composition in the registry (one line) or rename away from `.flow`.
- **Utility footers (signup, early-access)**: fine to remain local, but name them in the footer registry row as the sanctioned utility variant.

## 9. Internal-link and knowledge-graph findings

- **Graph ↔ site mismatches: none structural.** Every Existing page in the graph exists on disk and vice versa (studies, app UI, and export/ are internal artifacts, correctly outside the graph). Planned moves (mobile-app, slack-notifications → /features/) are documented and pending per roadmap.
- **Held-page linking**: boston + vanity correctly linked only from the /numbers/ hub, EXCEPT features.html body link to vanity (violation, §2.3). google-voice-alternative correctly de-linked + noindexed (its `.html` canonical `/google-voice-alternative` is part of the §2.1 sweep).
- **Hub rosters current**: for/ lists all 8; learn/ lists all 8; use-cases/ lists its 1; numbers/ lists hub + held pages. Footer respects the capacity rule (5-7 per column) on the current footer; older footer variant also within capacity.
- **Depth**: every page ≤2 clicks from home via hubs + footer. No orphans among live pages.
- **Inbound-link minimum (≥3)**: satisfied mechanically by footer + hubs; lateral Related blocks exist on reference and newer pages; older learn pages rely more on footer than graph links (acceptable now, tighten on convergence sweep).
- **Stale `.html` links**: internal links consistently use `.html` (correct until pretty URLs are enabled); the graph documents this. When pretty URLs turn on, that is a site-wide sweep to plan for.
- **Missing**: sitemap.xml (per-hub segmentation is specified but nothing exists).

## 10. Reference implementations still missing

Covered: Industry (plumbers) · Use case (rings) · Feature (call-forwarding) · Learn definition (business-phone-number) · Learn buying guide (do-i-need) · Startup (startups) · Template (voicemail-greeting-scripts) · Hubs (all four) · Number type (vanity, held) · City (boston, held).
- **Core family has no named reference.** index/how-it-works/pricing obey the system by effort, not by reference. Name one (recommend how-it-works: it is the cleanest full composition) so "no special pages" is enforceable. Do not create anything; naming is a doc edit.
- **Number type reference is a held, noindexed page.** Acceptable, but Tier 2 builders must be told the reference is vanity.html despite its held status (one line in the registry row covers it).
- Compare + Integration: reserved, blueprints exist, no reference until launch. Correct.
- Every registered component has a real owner page and specimen on disk (21 specimens verified present). One registry row was found corrupted by a paste error (Setup Picker row trailing fragment); fixed in this review.

## 11. CSS/markup authority + build/CMS readiness

Authority findings:
- Load order is uniform (site.css → page styles → canon.css) except index.html (§2.4). canon.css edits provably propagate.
- Belongs in canon next (already planned): hero shell (after the `.hero` class rename), closer, event sequence. Genuinely page-specific and fine inline: homepage flow diagram, features catalog, pricing cards, per-page tree indents.
- Shared markup has one authoritative specimen for every registered primitive; nav/footer remain sweep-once (no build step). Migration plan: (1) page manifest file listing all live pages; (2) `tools/` sweep script (find-and-replace with verification, as used for the comparison rollout); (3) at Phase 4, nav/footer/FAQ become includes.

CMS-readiness classification (what is already data):
- **Product data**: comparison claims (done), pricing figures, feature availability, function colors.
- **Routing configuration**: every Sample Setup (greeting text, menu options, destination rows, schedules); already structured as discrete rows by design.
- **Repeated rows**: FAQ pairs, Related blocks, hub rosters, footer columns, trust-strip items, Topic Index entries, script cards, number inventory.
- **Relationships**: pillar ↔ children ↔ Related (already in KNOWLEDGE_GRAPH).
- **Text/rich text**: hero H1s (computed from formulas), pain sections, walkthrough prose.
- A CMS helps only after nav/footer/FAQ are single-sourced and canonicals match the graph; otherwise it inherits the forks.

## 12. Repository hazards

- **`export/` is a stale duplicate tree** (reference-pages: pre-audit page copies with retired comparison claims and old footers; marketing-docs: stale doc copies; standalone: bundled one-file exports). It already poisons audits (greps hit it). Recommend: remove reference-pages and marketing-docs, or move export/ out of the repo; standalone bundles are regenerable artifacts. Nothing deleted in this review.
- **Internal artifacts in the public root**: Extension Detail.html, Component Gallery.html, Accent/Type Study, brand-colors.html, two Site Architecture strategy docs, app/*, a dozen app CSS files, screenshots/ (100+ working captures), uploads/. Safe while robots disallows all; before beta they need exclusion (_headers/netlify rules or relocation) and must stay out of the sitemap.
- **`dist/` hazard previously resolved**; the standing never-hand-copy rule now applies to export/.
- `_redirects` mixes 301s, 302s, and 200 rewrites; the 200 rewrites are the §2.1 duplicate-URL source.
- Two Site Architecture docs (v1 + v2) disagree with each other; both are superseded by docs/marketing. Mark or remove.

## 13. Recommended implementation phases

1. **Beta blockers (one session)**: canonical + schema sweep (graph URLs everywhere, flat rewrites → 301); de-link vanity from features.html; move index.html body styles above the canon link (or into canon); generate sitemap.xml; resolve the footer brand-paragraph wording with the owner.
2. **Convergence sweep (one session)**: remove `.fq-text` (15 pages), kicker pills (8), Live badges (6); align older footer/nav copies to the specimens; root-relative links on root pages. All markup-only, canon already styles the converged forms.
3. **Tooling (before the next 10 pages)**: page manifest + sweep script in `tools/`; exact consumer lists in every registry row.
4. **Style lift (Phase 2 completion)**: hero shell rename + lift, closer + seq CSS to canon, delete inline copies.
5. **Pre-100-pages**: register `.frow` and `.walk/.wstep` (or fold them); name the Core reference page; build or delete the mobile accordion footer; clean export/ and root artifacts.

## 14. Documentation files amended in this review

- `docs/marketing/IMPLEMENTATION_REGISTRY.md`: added "No orphan visual patterns", "Component admission", "Component retirement", "Required registry fields" (per authorized amendments A + B); repaired the corrupted Setup Picker row. Operating rule (C) was already present verbatim in the registry and README; not duplicated. Layer distinction (D) already exists (README document responsibilities + registry "three layers"); not duplicated.
- This file (`SYSTEM_REVIEW_2026-07-28.md`) added as the review record.
- No page HTML, CSS, or other documentation was changed.

## 15. Exact next implementation task

**The canonical-URL and schema sweep (§13 phase 1).** One `run_script` pass over the 11 legacy-canonical pages + 5 core pages: set `<link rel="canonical">` to the graph URL, add BreadcrumbList (and FAQPage where an FAQ exists), then flip the corresponding `_redirects` 200 rewrites to 301s in the same change. It is the highest-risk drift (search + AI retrieval see the wrong URLs), it is mechanical, it touches no design, and it makes the graph and the site agree again, which every other fix builds on.
