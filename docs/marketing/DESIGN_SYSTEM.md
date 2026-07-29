# DESIGN_SYSTEM.md - how Numberline demonstrates

The visual counterpart to CONTENT_BIBLE.md. That document defines how Numberline sounds; this one defines how Numberline demonstrates. It is not a CSS guide (implementation lives in `assets/site.css`, `assets/canon.css`, and the reference pages). It is the philosophy behind the visuals, written so page #6 through page #600 feel like chapters of the same book.

The living implementation:
Industry `for/plumbers.html` · Use case `use-cases/ring-multiple-cell-phones.html` · Feature `features/call-forwarding.html` · Learn `learn/business-phone-number.html` · Startup `for/startups.html`

## 1. Visual philosophy

**Competitors explain. Numberline demonstrates.**

**Every diagram, component, and animation must remove words.** If a teaching visual cannot replace explanation, it is decoration, and decoration does not ship. Everything else on the page (type, spacing, color) exists only to make those demonstrations legible.

Every page is a working diorama of a real business's phone, not an advertisement about one. The reader should understand the setup by looking before they understand it by reading; copy annotates the visuals, never the reverse. Three tests for any new section:

- **The skim test:** scrolled fast with copy ignored, does the page still teach the setup?
- **The IKEA test:** could this section work with 80% less text and one clearer picture?
- **The usefulness test:** if Numberline didn't exist, would this section still teach something true about business phones? If not, it is marketing residue: redesign it into a demonstration or cut it.

The three-second impression on any page must be "someone is showing me exactly how my business would run", never "another SaaS landing page".

**The first rule: every page begins with a business, not Numberline.** A caller, a plumber, a founder, a two-person team with a phone that won't stop: the business exists on screen before the product does, and the product enters only as the way that business gets organized. The check: if the reader meets Numberline's name, logo, or UI first, the page is backwards.

When beauty and clarity compete, clarity wins, and beautiful teaching follows. In practice the contest is rare: most "beauty vs clarity" debates are really decoration vs teaching, and decoration already lost (§4).

## 2. The page as a story

Every page unfolds as a walkthrough, not a stack of sections. The spine:

1. **Question** (H1) with the direct answer beside a **Sample Setup** card: the answer, shown.
2. **What happens when someone calls?** Cause and effect, one event at a time.
3. **Here's how you set it up.** The few decisions the reader would actually make.
4. **Variations.** The same setup adjusted to how different businesses work.
5. **What it's made of / related setups.** Doors deeper into the graph.
6. **FAQ**, then one calm CTA.

The spine flexes by content type; it is never abandoned. Walkthrough pages (industry, use case, feature, startup) use it whole. Learn pillars may swap step 2 for explanation bands but keep question-headings and one primitive per band. Hub and index pages are a stack of Topic Index primitives under one question. Utility pages (pricing, about, early access) keep the hero anatomy and band rhythm even without a walkthrough. A page type this spine cannot express is a proposal to amend this document (§9), not a license to freelance.

Headings are the next question the reader is already thinking ("What happens when someone calls?", "Where each call goes."). Never generic labels: no "Features", "Benefits", "The Setup", no kicker pills. Every heading moves the story forward; a heading that could sit on any SaaS site is wrong.

## 3. Component library (the primitives)

Only components that teach better than a paragraph earn a place. Call them by these names in files, briefs, and reviews; shared vocabulary is what keeps fifty contributors building one system. Version 1 canon, with when to use each:

- **Sample Setup card** (`.sample-setup` / `.shot`): the flagship. White card, light product-UI header + "Sample setup" tag, business number node on top, gray tree connectors down to function-colored destination rows, status or destination chips. Use in EVERY hero. The setup content changes per page; the card's anatomy never does. Never two setup mockups on one page.
- **Event Sequence** (`.seq`): vertical cause-and-effect timeline of nodes joined by down arrows: someone calls → phones ring → Rosa answers → the rest stop. Use whenever the question is about BEHAVIOR over time ("what happens when/if..."). One sequence per page, 4 to 6 nodes, one bold line + one quiet sub-line per node.
- **Call Flow card** (`.flow`): greeting quote + dial-key rows (keycaps with a tiny "press"/"dial" label) + destination chips + a footer of edge cases (after hours, nobody answers, texts). Use when the subject is a MENU: where each call type goes. The industry-page workhorse.
- **Function List** (`.hsteps`): the six functions with their permanent colors (number blue, extensions yellow, forwarding purple, voicemail green, texting cyan, AI/integrations pink). Use to show the SCOPE of the system, at most once per page. The colors are law everywhere a function appears: icons, chips, tree destinations, diagram nodes.
- **Setup Variations** (`.vars` / `.setups`): 2 to 4 cards, each a one-paragraph variant with a small scenario tag. Use to answer "what if we work differently?" without a new page, linking out when a variation has its own owner.
- **Made-of rows** (`.uses` / `.with`): linked rows naming the features a setup composes. This is the knowledge graph made visible; every setup page ends its story with these doors.
- **Decision Table** (`.modes`, `.cmp`): options down the side, "what happens" and "good when" across. Use ONLY when the reader genuinely chooses between rows; never as a feature checklist against competitors' checkboxes.
- **Now vs Later** (`.nvl`): two columns, "day one" (green, complete) vs "when it happens" (neutral, optional). The startup-page signature; use anywhere sequencing is the answer.
- **Before / After** (`.ba`): the one permitted contrast block: chaos on one phone vs organized on a business line. Use sparingly (industry pages), pain stays situational, never fearmongering.
- **FAQ accordion**: 3 to 6 real questions, each answer complete alone. The long tail's home.
- **Topic Index** (pillar and hub pages): a categorized list of a topic's children as linked rows: title + one-line promise, grouped by sub-category, no thumbnails, no teaser cards. This is how pillar pages grow "In this topic" sections and how hub indexes absorb hundreds of pages without new navigation. Design it once into the first hub page and it becomes canon.
- **Script Card** (Template pages): a bordered block containing only a copyable asset (a voicemail script, an SMS template), a one-line "use when" caption, and a copy affordance. The asset appears verbatim in the card and is never paraphrased in surrounding prose. Governance justification (§9): it deletes the paragraph that would otherwise describe the script, no existing primitive presents an asset for copying rather than reading, and it enters canon by being built into the first Template reference page.
- **Closer card**: one calm full-width CTA card at the end. One mid-page CTA maximum before it.

Adding a primitive to this list requires proving an existing one can't teach the same thing, and building it into a reference page first (full process in §9).

## 4. Foundations: type, color, icons

The smallest set of material facts every contributor must know; everything else lives in `assets/site.css`.

- **Type:** Plus Jakarta Sans is the voice of the site: headings at weight 600 with tight tracking (about -0.03em), UI labels and emphasis at 700 to 800, body at 400 to 500. Archivo Black exists only for the wordmark and rare display accents (the big number in a Call Flow header). Spline Sans Mono only for tiny technical captions. No other typefaces, ever; a new font on a Numberline page is a defect, not a direction.
- **Neutrals:** ink `#131316`, body `#3c4147`, muted `#838995`, hairline `#E8EAEE`, soft band `#F1F3F6`, hero wash `#F4F5FC`. Muted gray is for annotations only, never for body-length text (it fails contrast at length).
- **Color carries meaning or it doesn't appear.** Three sanctioned meanings: the six function colors (identity of a capability), status greens/grays (something happened / stopped), and CTA indigo `#5158E2` (actions only: buttons, links, nothing else). There is no decorative color: no tinted section backgrounds for variety, no gradient text, no colored headings. If a color can't answer "what does this mean?", it's gray.
- **Icons:** stroke icons only, 2px rounded caps, on rounded tiles. No filled icons, no duotone, no emoji, no icon grids as content.
- **Photography and illustration:** none in v1. People exist in the system as named nodes (Rosa's mobile), not stock photos. Revisit only by amendment.

## 5. Hierarchy, rhythm, spacing

- **The phone is the primary canvas.** These pages are read one-handed, mid-job, on a ~390px screen; every primitive must teach in a single narrow column, and the two-column desktop hero is the adaptation, never the reverse. A page is not done until it has been judged at phone width first.
- **One hero idea:** question left, Sample Setup right, gradient wash (`#F4F5FC` fading to white) behind. The card gets the deepest shadow on the page; nothing below competes with it.
- **Band rhythm:** sections alternate white and soft (`--soft`) bands with 1px hairline borders, 64 to 74px vertical padding. One centered `.sec-head` per band, then ONE primitive. Never two primitives in one band.
- **Teaching column:** sequences, flows, tables, and FAQs live in a centered 560 to 900px column; full-width grids are for card sets only.
- **Weight discipline:** ink for what things ARE (bold, short), body gray for how they behave, muted gray for annotations. Chips and tags are the only uppercase. Black backgrounds are never used for UI mockups; product headers are light (white, hairline border) so the CTA stays the strongest dark element.
- **Rows never wrap to two lines.** Shorten the label or chip, hide the sub-line at narrow widths, or stack cleanly with a media rule. A wrapped row is a defect, not a compromise.

## 6. Diagrams, illustration, screenshots

- Diagrams are built from the primitives' vocabulary: rounded nodes, function-colored icon tiles, gray tree/elbow connectors, pill chips. No freeform illustration, no mascots, no isometric art, no decorative SVG scenes.
- Every node is a real thing with a name: Rosa's mobile, the shared inbox, (415) 555-0134. Named people and concrete numbers, never "User A" or "+1 555 000 0000" without a place in the story.
- Arrows mean time or routing, never decoration. Down = what happens next; sideways elbow = where it goes.
- Screenshots of actual product UI appear only where the page is ABOUT the product screen (feature pages, mobile app). Everywhere else, the Sample Setup vocabulary IS the screenshot: it shows the outcome, not the admin panel.
- Status chips are honest: green = answered/live, gray = stopped/idle. Green means something happened, never "look at this".

## 7. Interaction and motion (now and later)

- **Now:** static pages with a single quiet reveal-on-scroll (fade + 16px rise, once, on first view). No parallax, no floating blobs, no hover theatrics. Setup cards and sequences are built as discrete node rows precisely so they can become interactive later without a redesign.
- **Accessibility is part of the brand:** teaching pages that some readers can't read are failed teaching pages. Body and label text meets WCAG AA contrast; muted gray never carries essential meaning alone (pair chips' color with words: "Answered", "Stopped"); every interactive element has a visible focus state; `prefers-reduced-motion` disables reveals and all future animation.
- **Later (do not build yet):** the Sample Setup becomes explorable: tap a destination to change it, toggle after-hours, switch the example business. Animation will mean "watch the call move through the tree", one event at a time, at conversational speed. Motion will only ever show cause and effect; anything that animates for delight alone is off-brand.

## 8. What we never do (visual)

The copy bans live in CONTENT_BIBLE §10. These are the visual equivalents, and they bind every contributor including agencies:

- Never grant "special page" exceptions. The homepage, pricing, and campaign pages obey the same system; the system survives only if the most important pages are its best examples, not its exemptions.
- Never invent a new setup-card dialect. Two sanctioned forms exist (tree, Call Flow). A third requires amendment.
- Never use function colors decoratively, and never repaint a function (voicemail is green on every page until the end of time).
- Never ship an icon-grid "features" section, a logo wall, a stat row, a testimonial carousel, or a fake dashboard screenshot.
- Never headline a card with a fictional business name; the business appears inside the setup, the label stays functional ("Sample plumbing setup").
- Never use a dark background for a product mockup; the CTA is the strongest dark element on the page.
- Never add a second mid-page CTA because a test suggested it; one mid-page, one closer, permanently.
- Never let a row wrap to two lines, on any viewport.
- Never introduce a component because it looks interesting. A component is judged by what it deletes, not what it adds; if the paragraph has to stay anyway, the component failed.

## 9. Governance: how this document changes

A constitution that anyone can quietly edit is a suggestion. Rules:

- **This document is the single visual authority.** Agencies, contractors, and new hires receive it with CONTENT_BIBLE.md before their first page. If a brief contradicts it, the document wins until amended.
- **Amendment process:** a change to primitives, foundations, or the never-list requires (1) a written case naming the pages that prove the need, (2) the new pattern built into one reference page, (3) explicit owner sign-off, (4) the change recorded here with date and reason. One-page experiments are not amendments; they are violations with good intentions.
- **Deprecation:** retired patterns (like the learn page's paired panels) get listed in §10 debts with a "replace on next touch" instruction; nobody redesigns old pages just to chase the canon.
- **Reference pages are living law, and reference is a role, not a roster.** The permanent pages are their own references (how-it-works is the product reference); each campaign template in `templates/campaigns/` is the reference for its keyword type (see CAMPAIGNS.md). New contributors learn the system by reading this document and the reference pages together. When implementation and documentation disagree, resolve it immediately, in whichever direction is right, and record the resolution; tolerated drift is how design systems die.
- **The review question for every new page** is not "does it look good?" but "could this screen be from any other company?" If yes, it fails, however polished.

## 10. Version 1 review: verdict and known debts

Version 1, ratified July 2026 against the five reference pages named in the header. Future reviews append here; this section is the changelog, not the law.

Reviewed together, the five pages read as chapters of one book: same nav/footer shell, same hero anatomy, same walkthrough spine, same color law, same FAQ and closer. The system scales. Honest debts to pay before mass production, without redesigning what ships today:

- **Setup-card dialects.** The tree card (use case, feature, startup), the Call Flow menu card (plumbers), and the learn page's paired panels are three dialects of one component. Keep tree and Call Flow as the two sanctioned forms; retire the paired-panel form next time the learn page is touched.
- **Learn hero.** The learn page leads with the Function List instead of a Sample Setup; acceptable for pillar pages (scope over scenario), but decide per page, never by accident.
- **Trust strip.** The icon+phrase strip under heroes is the most SaaS-flavored element left. It survives v1 (it answers real anxieties: no hardware, cell stays private) but is a candidate for absorption into the Sample Setup footer.
- **"Who this is for" checklists** (learn page) fail the usefulness test as a grid of ticks; fold into copy or FAQ on next touch.
- **Steps overlap.** "Step 1/2/3" pills teach setup decisions; sequences teach behavior. Keep both, never both for the same content on one page.

## 11. The Numberline experience (north star)

If a visitor remembers one thing after five pages, it must be:

**"They didn't tell me about a phone system. They showed me my own business running on one, and I understood it without effort."**

The site should feel like flipping through the world's clearest instruction manual for running a small business's communications: you watch a call arrive, ring the right pockets, and settle into a shared inbox, and somewhere along the way you realize the manual is also the product. Every future page either deepens that feeling or doesn't ship.

## Feature-page laws (owner-approved, 2026-07-28 - permanent)
1. **"On every Feature page, the product must be running within the first two content bands."** The hero visual counts as band one; a Sample Setup, Event Sequence, or equivalent working demonstration must appear no later than band two.
2. **"A capability is demonstrated before it is described."** Visuals, workflows, sample setups, and event sequences take precedence over descriptive prose; text exists to annotate the demonstration, not replace it. These two laws are complementary: the first fixes WHERE the product appears, the second fixes the RELATIONSHIP between showing and telling everywhere on the page.
