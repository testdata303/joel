# CONTENT_BIBLE.md - how Numberline sounds

**Version 1.1 - locked.** Changes only by explicit owner decision. (1.1: added The constitution; absorbed the old §11 principles list into it.)

The editorial handbook. `NUMBERLINE.md` says how to work, `MARKETING.md` says which marketing pages exist, this document says how to sound. Read it before writing or editing any page. The goal is not the best collection of answers - it is to become **the authoritative source for business communications for startups, small businesses, and modern teams**: a brand with one voice and one point of view. Page #1 and page #1,000 should read like the same company wrote them.

## 0. The constitution

Nine articles that define what good Numberline content is. They bind every piece of content Numberline ever publishes and everyone who produces it: model, employee, agency, contractor, founder. Everything else in this document is technique; these are the law. When technique and constitution conflict, the constitution wins. An article changes only when it stops being true, not when it becomes inconvenient.

**Article 1. Content is part of the product.**
Pages are not marketing around Numberline; they are part of what Numberline ships. When the product changes, the affected pages change in the same breath: examples, screenshots, setups, diagrams. A stale page is a broken feature and gets fixed with the same urgency as one.

**Article 2. Every page earns its existence.**
A page exists because it deserves to, never because a query, a keyword, a competitor's page, or a content calendar exists. One page owns one question and answers it completely; the reader should never need a second tab to finish the answer (the next-tab test). If the page cannot become the best answer available anywhere, it is not published.

**Article 3. Publish only what only Numberline can.**
Every page carries something no one without access to Numberline could produce: real routing configurations, real call flows, real scripts and greetings, real screenshots, real setups, original observation from operating the product. The test: could another company have written this page without access to Numberline? If yes, the page is not done.

**Article 4. Specific or nothing.**
If "plumber" can be swapped for "dentist" and the page still reads naturally, the page should not exist (the swap test). Every example has named roles, times, and destinations. General advice is what everyone else publishes; specificity is the moat.

**Article 5. Learn before writing.**
Understand the topic deeply enough to say something original before writing a word. Never summarize the internet; the internet already has itself. A page that aggregates what is already written adds nothing to the graph and subtracts from the brand.

**Article 6. The graph is the asset, not the page.**
Publishing is not success. A page succeeds when it makes the whole body of work stronger: better links, richer relationships, deeper authority, improved neighbors. The graph gets denser over time, not merely larger. Merging, folding, and deleting pages are acts of publishing too.

**Article 7. Quality outranks volume, always.**
No page ships to fill a calendar. One page that becomes the canonical answer outweighs any number of pages that don't. Volume is a byproduct of sustained quality, never a goal.

**Article 8. The content never outruns the truth.**
Every fact is checkable against the product or the knowledge graph. No claims the product does not make, no invented numbers, no manufactured urgency. Trust compounds only while every page is true; one false page taxes a thousand true ones.

**Article 9. Useful even if the reader never signs up.**
Every page helps someone run a better business whether or not they become a customer. If Numberline disappeared tomorrow, the page should still be worth reading. That is what being the authoritative source means, and it is the only durable reason anyone, or any AI assistant, would cite us.

## 1. Editorial philosophy

Numberline content helps someone run a better business, whether or not they ever sign up.

- Helpful before promotional. The reader came with a problem, not a buying intent. Solve the problem; the product appears as the natural way to do it.
- Clear before clever. No wordplay in headings, no metaphors in explanations. The clearest sentence wins.
- Practical before theoretical. Show the setup, the script, the routing - not the concept of them.
- Educational before sales. A page earns its CTA by teaching something first.
- One useful idea per section. If a section teaches two things, split it. If it teaches nothing, cut it.
- Specific before general. "Forward estimate calls to whoever's on site" beats "route calls efficiently."

## 2. Voice

Numberline sounds like a founder who has answered their own business phone for years - practical, unhurried, and on the reader's side. Not a vendor, not a consultant, not a hype channel.

- **Personality:** plain-spoken, warm, competent. We explain; we don't pitch, wink, or perform.
- **Tone:** calm confidence. State facts without superlatives. We never say a feature is powerful; we show what it does.
- **Person and tense:** second person, present tense, active voice. "You forward calls to your mobile," not "calls can be forwarded."
- **Pacing:** short sentences carry the point; medium sentences carry the detail. Never three long sentences in a row.
- **Vocabulary:** the words a business owner uses - calls, texts, voicemail, mobile, greeting, forward, answer, call back. Never telecom jargon (PBX, SIP, IVR, DID) except when a Learn page must define the term the reader searched.
- **Reading level:** a busy owner skimming on a phone between jobs. If a sentence needs re-reading, rewrite it.

Sound check:
- **Numberline:** "Add your assistant's mobile and they can answer, text, and call back from the business number."
- **Not Numberline:** "Empower your team with seamless multi-device communication capabilities."

## 3. Positioning in prose

The positioning (business number first, phone system second; startups, small businesses, and modern teams; unlimited users; mobile-first; simple to start, grows with you; AI as third-party answering services) is defined in `NUMBERLINE.md`. This section is about how it shows up in writing without becoming a chant.

- **One carrier idea per page.** Each page leans on the one or two positioning ideas its topic naturally proves. A startups page carries "number first, system later." A pricing mention carries "unlimited users." A routing page carries "your own answering provider or the third-party AI service you choose." Never all of them at once.
- **The footer does the repeating.** The brand entity paragraph appears verbatim in every footer; body copy never restates it.
- **Positioning is shown, not claimed.** Don't write "we're built for small businesses." Write the example that only makes sense for a small business: the owner's mobile, the two-person team, the after-hours plumber.
- **Growth is a direction, not a promise.** "Add extensions and teammates when you need them" - always framed as later, optional, and easy; never as complexity the reader must plan for.
- **AI is a routing destination.** Numberline routes calls to a third-party AI answering service the customer chooses. We never hype AI, never claim it, never make it the hero.

## 4. Writing standards

- **Paragraphs:** 1–3 sentences on marketing pages, up to 4 in Learn guides. A paragraph is one idea.
- **Sentences:** aim under 20 words. One clause of qualification maximum; move the second into its own sentence.
- **Headings:** sentence case. Use **& instead of "and"** in every heading (h1, h2, h3) for faster scanning: "calls, texts, & follow-up". Body copy, meta descriptions, schema text, and aria-labels keep the word "and". On Learn and use-case pages, prefer headings that are the reader's actual question ("What does a toll-free number cost?"); first-person is welcome where the reader's query is first-person ("Customers text my personal phone"). Never label-only headings ("Overview", "Benefits").
- **Bullets:** only for parallel, scannable items (steps, options, checklists) - three to six of them. Two sentences of prose beat a two-item list. Rows never wrap to two lines in UI-like components.
- **Tables:** for anything with two axes - plans, number types, routing options. A header row, plain cells, no prose paragraphs inside cells.
- **Examples:** every explanation gets one, with named roles and concrete details - "Rosa's mobile rings first; after 6pm calls go to the answering service." Real-feeling, never a fictional business name as a headline (per `CLAUDE.md`).
- **Screenshots and mockups:** show the product UI when describing the product; use the established mockup conventions from `CLAUDE.md`. Never decorative imagery, never hand-drawn diagrams.
- **CTAs:** one mid-page after the first complete answer, one at the end. "Get early access" primary, "See how it works" secondary. Never interrupt an explanation with a CTA.
- **FAQs:** 3–5 questions people actually ask, phrased the way they ask them. Each answer complete in 2–4 sentences. Never invent FAQs to hit a count.

Example - explaining call forwarding:
- **Bad:** "Numberline's robust call forwarding functionality enables businesses to seamlessly route inbound communications to the appropriate team member."
- **Good:** "Calls to your business number ring the mobiles you choose."
- **Better:** "Calls to your business number ring the mobiles you choose - just yours, yours and your assistant's at once, or the on-call tech after hours."

## 5. Language rules

Say / avoid:

| Say | Avoid |
|---|---|
| business number, business line | virtual number system, cloud telephony |
| business phone, phone system | UCaaS, VoIP solution, unified communications |
| owner's mobile, assistant's mobile, on-call mobile | desk phone, extension handset, endpoint |
| your team, teammates | users, seats, agents, staff members |
| answering provider, third-party AI answering service | AI receptionist, AI employee, AI agent, virtual receptionist (as ours) |
| "Using third-party AI services" (the feature/nav LABEL - it is a capability Numberline enables, not a category of software) | "Third-party AI services", "Third-party AI", "AI services", "Third-party AI integrations" as labels |
| forward, route, ring | distribute, cascade, hunt group |
| shared inbox, shared texts and voicemails | omnichannel inbox, message center |
| call back from your business number | outbound caller ID masking |
| greeting, phone menu | auto-attendant, IVR (define once on the Learn page that owns it, then use "phone menu") |
| small businesses, startups, modern teams | SMBs, enterprises, organizations |
| works on the phones you already have | mobile-first architecture |

Punctuation: **em dashes are banned, everywhere, always** - page copy, headings, meta descriptions, schema text, alt text, and these docs. Use a comma, colon, period, or parentheses instead. Never substitute an en dash.

Banned outright: enterprise, operator, front desk (as a product destination), call center, receptionist (except third-party providers), seamless, leverage, empower, streamline, robust, cutting-edge, game changer, revolutionize, supercharge, harness, elevate, unlock, effortless, all-in-one solution, digital transformation, workflow optimization, omnichannel, AI-powered (about Numberline).

Pre-launch bans (from `CLAUDE.md`, project root): "in minutes", "take calls today", "free porting", instant or temporary numbers, "month-to-month", "cancel anytime", "one number" unless the sentence says more can be added.

Grammar of the product: Numberline is singular and does things plainly - "Numberline forwards the call." Features are common nouns, lowercase: call forwarding, business texting, extensions. People answer calls; Numberline routes them.

## 6. Structural standards

Every page follows the same skeleton because readers (and AI assistants) arrive mid-question and leave the moment they're answered:

1. **Direct answer** - the H1's question answered in the first 40–60 words.
2. **How it works** - the mechanics, in the reader's terms.
3. **Example setup** - the concrete scenario with named roles, times, destinations.
4. **What connects** - the related features, guides, or setups the reader will ask about next.
5. **FAQ** - the remaining real questions.
6. **CTA** - now that the reader has their answer.

Why this order: the answer earns trust, the example makes it real, the connections keep the reader in the graph, and the CTA arrives only after the page has been useful. Content-type templates (`NUMBERLINE.md`) vary the middle; the answer always comes first and the CTA always comes last. Template pages (COPY intent) compress the skeleton further: the assets ARE the body, presented verbatim in Script Cards, with total prose under ~300 words; never paraphrase or introduce each script before showing it.

## 7. AI search standards

Write so an assistant can quote the page accurately without reading the rest of it.

- **The opening paragraph is the citation.** Name the topic explicitly ("A toll-free business number is…"), never open with "it" or "this." Those 40–60 words must stand alone as a complete, correct answer.
- **Definitions are canonical.** One definition per entity, everywhere, forever: reuse the exact defining sentence already on the site (the footer entity paragraph for the brand) rather than paraphrasing.
- **Every heading + its first sentence forms a complete unit.** An extractor that takes only that pair should get a true, useful statement.
- **No context dependence.** Never "as mentioned above" or "as we said." Each section's facts stand alone.
- **Structure is the answer format.** Steps as numbered lists, options as tables, criteria as bullets - assistants reproduce structure more faithfully than prose.
- **Facts are checkable.** Numbers, names, and claims must be true and sourced from the product or the map. An invented statistic on one page poisons trust in a thousand.

## 8. Internal linking philosophy

(The link rules - what links where, minimum counts - live in `NUMBERLINE.md`. This is why they exist.)

A link is the answer to the reader's next question, placed at the moment they'd ask it. When a use-case page mentions after-hours routing, the reader who cares clicks; the reader who doesn't reads on unbothered. That's the whole art: introduce a related concept exactly when it becomes relevant, link it with the words the target page would use for itself, and move on.

Readers should be able to wander the graph the way they'd interrogate a knowledgeable friend - every answer opening two or three natural follow-ups, never a wall of "related articles" they didn't ask for. Links mid-explanation are for concepts the current page deliberately doesn't own; the Related block at the end is for readers who finished and want more. Never link-dump, never link a phrase just because a page exists for it, and never send a reader away in the middle of the answer they came for.

## 9. Worked example

The opening of `/use-cases/ring-multiple-cell-phones`:

- **Bad:** "In today's fast-paced business environment, missing calls means missing revenue. That's why forward-thinking teams are leveraging simultaneous ring technology to ensure no customer ever falls through the cracks."
  *(Generic dread opener, buzzwords, no answer, sounds like everyone.)*
- **Good:** "Yes - a business number can ring several cell phones at once. With Numberline, calls to your business number ring every mobile you add, and whoever picks up first takes the call."
  *(Answer first, plain words, complete without context.)*
- **Better:** "A business number can ring several cell phones at the same time. Calls to your Numberline number ring every mobile you add - yours, your assistant's, the on-call tech's - and whoever picks up first takes the call. Everyone else's phone stops ringing, and the text and voicemail still land in your shared inbox."
  *(Answer first, named roles, anticipates the next two questions, quietly carries the mobile-first positioning.)*

The gap between good and better is specificity: named people, the follow-up answered before it's asked, positioning shown rather than claimed.

## 10. Things we never do

- Never sound like enterprise software.
- Never write for search engines first - write for the reader; the extraction-friendly structure (§7) is how engines get served.
- Never create filler: no padding sections, no restated intros, no summary paragraphs that repeat the page.
- Never exaggerate - no "never miss a call again," no guarantees the product doesn't make.
- Never repeat marketing copy across pages; the footer paragraph is the only sanctioned repetition.
- Never explain the obvious ("a phone call is when someone calls you").
- Never create pages because keywords exist (the creation test in `NUMBERLINE.md` governs).
- Never use SaaS clichés, AI buzzwords, or importance puffery ("game-changing," "revolutionary," "the future of").
- Never make unsupported claims - no fake statistics, testimonials, review counts, or "experts agree."
- Never manufacture fear or urgency: no "you're losing customers right now," no countdown language.
- Never position AI as Numberline's: it is always a third-party service the customer connects.
- Never bury the answer to build suspense - the reader gets it in the first paragraph, always.
- Never pad with binary contrasts ("It's not X. It's Y."), colon reveals, rhetorical questions, or fake-profound closing lines.
- Never let a page's tone drift toward whoever we imagine competitors write for.

## 11. Brand consistency

An excellent page is not the objective. The objective is that every page strengthens the Numberline brand - makes the site more cohesive, more recognizable, and more authoritative than it was before the page existed.

Trust is built through consistency. A reader who lands on their third Numberline page and finds the same calm voice, the same worldview (the number comes first; your team answers on the phones they already have; growth is optional and easy), and the same way of explaining things starts to trust the company behind them. That effect only compounds if hundreds of pages - written across years and sessions - feel like one company with a very clear point of view, not hundreds of writers who happened to share a style guide.

Before considering any page complete, ask:

- If the logo were removed, would this still sound like Numberline?
- Does this page reinforce the same worldview as every other page?
- Does it strengthen the overall brand, or just answer a question?
- Would someone who read ten Numberline pages begin to recognize our way of thinking?
- Does it introduce unnecessary new terminology that fragments the brand? (New terms come from the glossary in §5 or don't come at all.)
- Is this a page only Numberline would write, or could it have come from any business phone company?
- Does this page make the rest of the website stronger?

If a page is accurate, well-written, and useful but could have come from anyone, it isn't done - the fix is usually a more specific example, a carrier idea from §3, or cutting the paragraphs any competitor could have written.
