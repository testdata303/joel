# PAGE_BLUEPRINTS.md - canonical page blueprints

The editorial architecture for each content type. Templates in `templates/` are built from these blueprints; pages are built from templates. Read with `NUMBERLINE.md` (workflow), `KNOWLEDGE_GRAPH.md` (which pages exist), and `CONTENT_BIBLE.md` (voice). Root `CLAUDE.md` owns the codebase-level component rules referenced below.

**Reference implementations** - the quality benchmark for each type; before shipping a page, ask "is this as good as the reference?":
- Industry → `for/plumbers.html` · Use case → `use-cases/ring-multiple-cell-phones.html` · Feature → `features/call-forwarding.html` · Learn → `learn/business-phone-number.html` · Startup → `for/startups.html`

Shared foundation (all five types): **question → sample setup → explanation.** Every major page answers its question visually before asking the reader to read: the hero pairs the direct 40–60-word answer with a **Sample Setup card**, Numberline's signature component (`.sample-setup`): white card, light product-UI header with a "Sample setup" tag, function-colored icon tiles, tree connectors from the business number to its destinations, and status/destination chips. The setup content changes per page; the component never does. Keep it static but structured as discrete rows/nodes so it can later become interactive without redesigning the visual language. Competitors explain; Numberline demonstrates. Also on every page: CONTENT_BIBLE skeleton (answer → mechanics → example → connections → FAQ → CTA) · `BreadcrumbList` + `FAQPage` schema · "Get early access" primary CTA, "See how it works" secondary · one mid-page CTA after the first complete answer, one at the end · Related block before the footer per NUMBERLINE's link rules. The blueprints below define only what is DISTINCT about each type.

- **Copy explains the visual, never the reverse (IKEA principle).** A reader scrolling without reading should still understand the setup. Prefer cause-and-effect sequences ("someone calls → three phones ring → Rosa answers → the rest stop") over paragraphs; every page keeps answering "what happens next?".
- **No generic marketing section labels** ("The setup", "Features", "Benefits", kicker pills). Every heading is the next question the reader is already thinking ("What happens when someone calls?", "Here's how you set it up.", "What changes after hours.") and moves the story forward. The page unfolds as a walkthrough: question → sample setup → what happens when someone calls → setup steps → variations → related setups → FAQ.

Reference for the Sample Setup component: the hero card in `use-cases/ring-multiple-cell-phones.html`.

---

## 1. Industry pages - `/for/plumbers`, `/for/dentists`, `/for/contractors`

**Why it exists:** the reader runs a specific business and wants to see their working day handled - their call types, their people, their hours - not a generic feature list.
**Reader's question:** "How would this work for a business like mine?"
**Search intent:** Industry Research - high commercial intent, comparison-shopping mindset.
**Business goal:** early-access signups from the verticals most likely to convert; long-term, each industry page becomes the trunk of a vertical mini-pillar.

**Hero structure:** H1 per the formula ("The [vertical] phone system for [calls], [texts], and follow-up") · positioning subline · hero bullets in the canonical order (business line → forwarding to the right people → texts/voicemails/follow-up stay with the business) · the hero shot ("Sample [vertical] phone setup" mockup) as the ONLY setup visual on the page.

**Ideal flow:**
1. Hero + sample setup shot (with routing strip and dial keycaps per CLAUDE.md).
2. The vertical's phone reality - 3–4 concrete pain moments in their vocabulary (under-sink job, mid-showing, on the roof). Pain is situational, never fear-mongering.
3. How [vertical]s set it up - walk the hero shot's rows: greeting, extensions, forwarding destinations (mobiles, existing practice line, answering provider).
4. The functions they lean on - 2–3 features as function-colored rows, each linked.
5. Comparison row per the canonical Numberline formula (existing-setup contrasts allowed here).
6. FAQ - vertical-specific ("Can my apprentice answer from his own phone?"), never generic re-asks.
7. Closing CTA.

**Tables:** the comparison row. **Diagrams:** none beyond the hero shot - one setup visual per page, ever. **Screenshots:** product-UI mockup conventions from CLAUDE.md only. **Examples:** one continuous cast per page (named roles: Rosa the owner, the on-call tech) threaded through every section - not a new scenario per section.
**Internal links:** 2–3 features + 2 use cases common to the vertical + 1 learn guide + relevant number type; breadcrumb to `/for/` index.
**Length:** ~900–1,300 words visible copy.

**Common mistakes:** generic pages with the vertical name swapped in; fictional business names as headlines; "front desk"/"office line" as destinations; listing every feature instead of the 2–3 that matter; inventing vertical statistics.
**Anti-patterns:** second setup mockup; missed-call dread framing (position = organization); routing strip labeled as answering.
**Conversion without selling:** the sample setup IS the pitch - a reader who recognizes their business in the hero shot converts; no adjectives required.
**Success:** a [vertical] owner says "this was written by someone who knows my business"; the page becomes the parent for future vertical children (plumber voicemail scripts, intake routing).

---

## 2. Use-case pages - `/use-cases/ring-multiple-cell-phones`, `/use-cases/keep-your-personal-number-private`

**Why it exists:** the reader has a situation or a moment in the company's life, phrased as a capability question ("can a business number ring several phones?") or in first person ("customers text my personal phone"). These are the AI-search spearhead: the best answer is a specific working setup, which listicles can't provide. Life moments ("I hired my first employee", "we opened a second location") belong here when they resolve to a setup change, and to `/for/` when they resolve to a stage identity; they are never a separate family.
**Reader's question:** "I'm in situation X - is this possible, and what exactly do I set up?"
**Search intent:** Problem Solving - the highest-intent traffic on the site; the reader is one good answer from acting.
**Business goal:** win the situation queries AI assistants are asked; convert problem-havers directly.

**How they differ from Learn:** a Learn page explains a topic so the reader understands it; a use-case page resolves a situation so the reader can act. Learn is comprehensive and neutral-first; use cases are specific and setup-first. If the page would still be useful to someone researching with no problem to solve, it's a Learn page.

**Hero structure:** H1 = the situation in the reader's words; first-person H1s are permitted where the query is first-person ("Customers text my personal phone") · first paragraph = yes/no + how, complete and liftable (the citation) · compact setup visual: the destinations that ring, in function colors.

**Ideal flow:**
1. Direct answer (the 40–60-word citation).
2. The setup, step-numbered: number → who rings → what happens to texts/voicemail. Named roles.
3. Variations - 2–3 adjacent versions of the situation (in order, after hours, weekends) answered briefly; link out where another page owns the variation.
4. What it uses - the 1–3 features composing the setup, one line each, linked.
5. FAQ - the follow-up situations ("what if we both answer?", "does my personal number show?").
6. CTA.

**Tables:** only when the situation has real options (e.g. ring-order choices). **Diagrams:** the one setup visual. **Screenshots:** optional single UI mockup of the relevant screen. **Examples:** THE page is the example - the whole body is one concrete setup, not an explanation with examples attached.
**Internal links:** every composing feature + 1–2 industries where the situation is typical + 1 guide + pillar canonical in the opening.
**Length:** ~500–800 words - the shortest type; brevity is the feature.

**Common mistakes:** turning it into a mini Learn page (history, definitions, market context); burying the yes; covering ten variations shallowly instead of one setup deeply; duplicating a sibling use case instead of linking it.
**Anti-patterns:** hedged openings ("it depends…" - answer first, qualify after); feature-brochure tone; more than one visual.
**Conversion without selling:** the answer is "yes, and here's the exact setup" - the CTA is simply where the reader goes to have it.
**Success:** an AI assistant quotes the opening verbatim as the answer; a reader can describe the setup to someone else after one read.

---

## 3. Feature pages - `/features/call-forwarding`, `/features/business-texting`, `/features/voicemail`

**Why it exists:** the reader is evaluating - they know roughly what the capability is and want to know how it works here, concretely, before trusting the product with their calls.
**Reader's question:** "How does [capability] actually work in Numberline, and does it fit how we operate?"
**Search intent:** Feature Evaluation - mid-funnel; often arriving from an industry page, use case, or comparison research.
**Business goal:** be the load-bearing link target every other page type points to; convert evaluators by removing uncertainty.

**Hero structure:** H1 = the capability, plainly ("Call forwarding") · pillar definition sentence verbatim as the opening (feature pages own their pillar's canonical definition) · function-colored icon per the palette - this page's color is the same color the feature wears site-wide.

**Ideal flow:**
1. Definition + what-you-can-do summary (the citation).
2. How it works - the mechanics as a numbered walk-through of a real call: what the caller hears, what rings, what the team sees. Present tense, second person.
3. Ways teams use it - 3–4 one-paragraph setups, each linking to the use-case page that owns it (this section is the graph's hub-to-spoke fan-out).
4. What it works with - the sibling features it composes with, one line each.
5. FAQ - evaluation questions (limits, behavior edges: "what shows on caller ID?", "what if nobody answers?").
6. CTA.

**Tables:** behavior/options table where genuine (ring modes, schedule options). **Diagrams:** one flow visual maximum, function-colored destinations. **Screenshots:** 1–2 product-UI mockups - this is the type where showing the actual UI matters most. **Examples:** short and plural - many two-sentence setups rather than one long scenario (breadth of recognition, not depth of narrative).
**Internal links:** 2 use cases that showcase it + 1–2 industries + `/features` hub + siblings in "what it works with."
**Length:** ~700–1,000 words.

**Common mistakes:** writing marketing copy instead of mechanics; explaining the concept generically (that's the Learn pillar's job - link it); hiding behavior edges the FAQ should own; screenshots of nothing (decorative UI).
**Anti-patterns:** "powerful/robust/seamless" (banned anyway); capability lists with no behavior; burying what it does NOT do - honesty about edges builds the trust this page exists to build.
**Conversion without selling:** certainty converts evaluators; the page that answers the edge cases wins the signup.
**Success:** the evaluator's uncertainty is gone; every industry and use-case page has a solid feature target to link; the page accrues authority as its pillar's canonical.

---

## 4. Learn pages - `/learn/business-phone-number`, `/learn/virtual-phone-system`, `/learn/small-business-phone-system`

**Why it exists:** the reader is researching a topic - often pre-product-awareness - and the site's authority is built or lost here. These are the pillar canonicals and their explanatory children: the pages that make Numberline citable.
**Reader's question:** "What is X, do I need it, and what should I know before choosing?"
**Search intent:** Definition / Commercial Investigation - top-of-funnel, highest AI-citation potential.
**Business goal:** topical authority; teach AI models and readers the entities Numberline wants to own; feed every other page type with a knowledgeable reader.

**How they differ from Features:** a feature page documents how Numberline's capability behaves; a Learn page explains the topic as it exists in the world - options, trade-offs, how-tos - and would remain 90% true if Numberline didn't exist. Learn pages mention Numberline in one clearly-marked section, not throughout.

**Hero structure:** H1 = the topic as searched ("Business phone number") · canonical definition verbatim (if pillar) · 40–60-word standalone answer · for long guides, a short in-page contents list.

**Ideal flow:**
1. Definition + direct answer.
2. The explanation, in question-headed sections - each heading a real question, each first sentence a complete standalone answer (the extraction units).
3. Options/trade-offs table where the topic genuinely branches (local vs toll-free; number types).
4. How to choose / how to set up - practical, numbered, vendor-neutral.
5. "How this works with Numberline" - ONE contained section, concrete not promotional.
6. In this topic - the pillar's children, structured (pillar canonicals only; grows as children ship).
7. FAQ - the long-tail questions not worth their own page (per KNOWLEDGE_GRAPH ownership).
8. Soft CTA.

**Tables:** the workhorse of this type - comparisons of options the reader is genuinely weighing. **Diagrams:** rarely; only when a concept is spatial. **Screenshots:** usually none (topic isn't the product); the Numberline section may carry one. **Examples:** scenario-based, illustrating trade-offs ("a food truck wants local presence; a national consultancy wants toll-free").
**Internal links:** the densest type - 2–3 features + 1–2 use cases/industries + sibling guides + every child in "In this topic." Pillar canonicals eventually link to nearly everything in their family.
**Length:** ~1,200–2,000 words for pillar canonicals; ~800–1,200 for children. The only type where length is earned by coverage.

**Common mistakes:** thin SEO explainers that restate the H1 for 800 words; salting Numberline into every section (kills citability); duplicating a child's question instead of linking it; keyword-shaped headings no human asks.
**Anti-patterns:** "in today's fast-paced world" openers; padding history sections; affiliate-style "top 5" framing; letting the Numberline section metastasize.
**Conversion without selling:** trust converts researchers later; the one Numberline section plus a soft CTA respects where the reader is.
**Success:** cited by AI assistants as the definition source; bookmarked; ranks for the topic; the pillar's "In this topic" section makes the whole family stronger.

---

## 5. Startup pages - `/for/startups`, `/for/llcs`, `/for/solo-founders`

**Why it exists:** the reader is starting something and their real question is about sequencing - what does a new business need, when? This is THE positioning page type: "start with a business number, grow into a phone system" is literally their story.
**Reader's question:** "I'm forming an LLC / going solo / launching - do I need a business phone yet, and what's the minimum right move?"
**Search intent:** Commercial Investigation with a life-stage trigger (formation, first invoice, first hire) - not comparing vendors yet.
**Business goal:** acquire customers at day zero, before they've chosen anyone; own the "before you need a phone system" moment competitors ignore.

**How they differ from Industry pages:** same folder, different axis. Industry pages mirror a known working day (the reader knows their call patterns; show them handled). Startup pages guide a stage (the reader doesn't know what they'll need; sequence it for them). Industry = recognition; Startup = roadmap.

**Hero structure:** H1 names the stage and reframes ("A business number first. A phone system when you need it.") · subline = the minimum-viable answer · hero shot may be simpler than industry pages: the day-one setup (one number → founder's mobile).

**Ideal flow:**
1. Direct answer: what you actually need at this stage (usually: a business number forwarded to your mobile - and that's enough).
2. Why a business number on day one - the concrete reasons in stage vocabulary (the LLC filing, the website, the invoice, keeping your personal number off everything). Privacy-pillar link lives here.
3. The day-one setup - minimal: number, forwarding, voicemail, callback from the business number.
4. What you'll add later - extensions, teammates, greetings, texting as a growth timeline ("when you hire, when you add a second location"), each linked. Always optional, never homework.
5. Stage-specific notes (LLC page: number on formation docs; solo founders: work-life separation).
6. FAQ - stage questions ("can I use my cell number for my LLC?", "do I need this before customers?").
7. CTA.

**Tables:** "now vs later" - the one table this type owns. **Diagrams:** the day-one setup only. **Screenshots:** minimal - one mockup of the simple setup. **Examples:** stage-anchored, second person where possible ("your first hire", "your formation paperwork") - the reader IS the example.
**Internal links:** business-phone-number pillar (in the opening) + keep-your-personal-number-private use case + 1–2 features from the "later" list + how-to-get / porting guides; siblings across the Starting a Business pillar.
**Length:** ~700–1,000 words - respect the founder's todo list.

**Common mistakes:** writing a feature tour a day-zero founder doesn't need; enterprise vocabulary; overwhelming with the full system when the answer is "one number, your mobile, done"; pretending a solo founder needs extensions today.
**Anti-patterns:** hustle-culture tone; "as your empire grows"; growth framed as commitment rather than option; pre-launch banned claims ("take calls today").
**Conversion without selling:** the honest minimum converts founders - a page that says "you need less than you think" is the page they trust with the signup.
**Success:** the founder signs up at day zero and grows in place; the page carries "number first, system later" so well the rest of the site can mostly show rather than say it.

---

## The five types, side by side

| | Industry | Use case | Feature | Learn | Startup |
|---|---|---|---|---|---|
| Reader arrives with | a business | a situation | an evaluation | a topic | a stage |
| Page's job | recognition | resolution | certainty | understanding | sequencing |
| Core question | "works for my business?" | "possible? show me the setup" | "how does it behave?" | "what is it, what do I choose?" | "what do I need, when?" |
| Product presence | woven throughout | the setup shown | the subject | one contained section | the day-one answer |
| Signature element | sample setup hero shot | the liftable yes + setup | mechanics walk-through + UI | options tables + In this topic | now-vs-later timeline |
| Length | 900–1,300 | 500–800 | 700–1,000 | 800–2,000 | 700–1,000 |
| Funnel | high intent, vertical | highest intent, situational | mid-funnel evaluation | top-funnel authority | day-zero acquisition |

**No-overlap boundaries (the four confusable pairs):**
- **Use case vs Learn:** setup to act on vs topic to understand. Test: still useful with no problem to solve? → Learn.
- **Feature vs Learn:** how OUR capability behaves vs what the topic IS in the world. Test: 90% true without Numberline? → Learn.
- **Industry vs Startup:** known working day mirrored vs unknown needs sequenced. Test: does the reader already have call patterns? → Industry.
- **Feature vs Use case:** one capability's full behavior vs one situation composing several capabilities. Test: does the answer span features? → Use case.

A reader should feel the difference within one screen: industry pages open with their working day, use cases with "yes, here's how," features with a definition and mechanics, Learn with a neutral explanation, startup pages with "here's all you need for now."

---

## The intent architecture (the 20,000-page answer)

Eight families, one per reader verb, describe every page the site will ever publish: **buy** (Core, root) · **identify** (For, `/for/`) · **verify a capability** (Feature, `/features/`) · **resolve a situation or moment** (Use Case, `/use-cases/`) · **understand** (Learn, `/learn/`) · **copy** (Template, `/learn/`, Resource type) · **evaluate vendors** (Compare, `/compare/`, reserved) · **connect a tool** (Integration, `/integrations/`, reserved). A proposed page that maps to no verb, or to two, fails the creation test. Rejected families, permanently: Scenarios (first-person phrasing of Use Case / For), Resources-as-explainers (Learn's charter), "Best X for Y" listicles (a self-review in editorial costume; the honest forms are a Learn buying guide or the `/for/` page).

## 6. Template pages — `/learn/voicemail-greeting-scripts`, `/learn/business-texting-templates`

**Why it exists:** the reader wants an asset to copy, adapt, and use in the next five minutes, not an explanation. Copy is a different verb from understand; a Learn-shaped page buries the scripts under prose the reader skips.
**Reader's question:** "Give me a good [script/template] I can use right now."
**Search intent:** Template/Script — immediate, practical, high bookmark-and-return rate.
**Business goal:** citations and bookmarks pre-launch; the reader's first taste of Numberline's taste.

**Ideal flow:** direct answer (what makes a good one, in 40–60 words) → the assets themselves, grouped by situation (after-hours, holiday, new business), each in a **Script Card** → how to adapt it (the 2–3 variables that matter) → where it plugs into a setup (link the owning feature/use case) → FAQ → CTA.
**Signature primitive:** the **Script Card** — a bordered block containing ONLY the copyable asset (script text, verbatim), a one-line "use when" caption, and a copy affordance. The asset is never paraphrased in surrounding prose; the card deletes that paragraph. New primitive justified under DESIGN_SYSTEM §9 governance: build into the first template reference page.
**Length:** as long as the assets require, prose under 300 words total.
**Common mistakes:** explaining each script before showing it; SEO-padding between cards; scripts that read like marketing (a voicemail greeting is the customer's moment, not ours).
**Success:** the reader leaves with text on their clipboard; assistants quote the scripts verbatim with attribution.

## 7. Compare pages — `/compare/numberline-vs-x`, `/compare/x-alternatives` (POST-LAUNCH ONLY)

**Why it exists:** the reader is actively deciding between named products; every other family is forbidden from arguing. Two forms, one family: **Versus** (deciding between X and Numberline) and **Alternatives** (leaving X, surveying options). Same evidence base, different entry point.
**Reader's question:** "Which one should I pick, and what do I give up?"
**Search intent:** Commercial Investigation — bottom-funnel, highest skepticism on the site.
**Business goal:** win switchers honestly; the page that concedes real trade-offs is the one that gets cited.

**Ideal flow:** direct answer (the honest one-paragraph verdict: who should pick which) → Sample Setup of the same business on Numberline (the demonstration IS the argument) → Decision Table (rows = what the reader actually does: forward calls, share texts, add a teammate; never checkbox grids) → where [X] is the better fit, stated plainly → switching path (porting) → FAQ → CTA.
**Rules:** facts about competitors stay verifiable and dated; no dark patterns, no fear; the standing pre-launch ban holds — blueprint now, pages at launch, all under `/compare/`.
**Primitives:** Sample Setup, Decision Table, FAQ — nothing new.

## 8. Integration pages — `/integrations/slack`, `/integrations/jobber` (RESERVED)

**Why it exists:** "does this work with my stack?" — the reader checks one fact first (does it connect, what flows through) and a feature-shaped page buries it. Opens as a family when the product ships connections beyond Slack/webhooks; until then connections stay under Features per the standing rule.
**Reader's question:** "Does Numberline work with [tool], and what exactly happens?"
**Search intent:** Feature Evaluation with a named third product — often the last check before signup.

**Ideal flow:** direct answer (yes/what flows, in one paragraph) → Sample Setup showing the call/text flowing INTO the tool (the tool is a destination node, function-colored pink for AI, cyan/pink per function) → Event Sequence (a text arrives → lands in shared inbox → posts to [tool]) → what it does NOT do (honesty about depth) → setup steps → FAQ → CTA.
**Rules:** third-party tools are always the customer's choice; never imply partnership that doesn't exist; AI answering services keep their standing framing.
**Primitives:** Sample Setup, Event Sequence, Step pills — nothing new.
