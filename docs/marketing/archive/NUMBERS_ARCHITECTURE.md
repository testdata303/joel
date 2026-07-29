# NUMBERS_ARCHITECTURE.md - the permanent architecture for the Numbers family

Status: ADOPTED, amended July 2026: /numbers/local merged into the hub; the hub is the geo mini-pillar and city pages parent to it. Vanity unblocked and live. This document designs the system; no pages exist yet. It amends two locked documents (NUMBERLINE.md intent architecture, KNOWLEDGE_GRAPH.md) and therefore ships only by explicit owner approval. On approval: apply the knowledge-graph amendment in §10, then build in the order in §11.

## 1. The verdict in five lines

- Numbers is a NEW content family with its own folder (`/numbers/`), its own reader verb (GET), and its own templates. It is not Learn, not Feature, not Use Case.
- One flat folder holds two page kinds: number-type pages and city pages. Area codes are SECTIONS of their city page, never default pages (the constitutional test in §7 gates rare exceptions like 212). URLs stay two levels deep forever.
- The Business Phone Number pillar keeps ownership of MEANING (what these things are). `/numbers/` owns ACQUISITION (get one). One question, one URL: understanding stays in `/learn/`, getting lives in `/numbers/`.
- City pages own geo intent whole: "Boston number" and "617 number" are one commercial intent in different words, so the city page owns both, with each code as a question-headed section. Dedicated code pages exist only by the three-part test in §7.
- Two planned Learn slugs (second number, porting) are reassigned into `/numbers/` before they are ever built, so no duplicate intent is ever created.

## 2. The reader verb: GET

The intent architecture (PAGE_BLUEPRINTS, "the 20,000-page answer") currently has eight verbs. The Numbers reader maps to none of them:

- Not UNDERSTAND: they are past "what is a toll-free number". A Learn page would bury the yes.
- Not VERIFY: a number is not a capability of the product; it is the product's inventory.
- Not RESOLVE: there is no situation to untangle. "I want a 617 number" is a purchase order, not a problem.
- Not BUY (Core): Core pages sell the whole product. This reader is shopping for one specific thing and will judge the page by whether that thing exists.

**GET (Numbers, `/numbers/`): the reader arrives wanting a specific business number and leaves knowing which number they need and how to get it through Numberline.** The ninth family. A proposed page still fails if it maps to no verb or two; GET pages that drift into explaining (what IS a local number?) are Learn pages wearing the wrong folder.

The page's job, in the side-by-side vocabulary: **availability**. Reader arrives with: a number in mind. Signature element: the number itself, shown live in a Sample Setup. Product presence: the subject. Funnel: bottom, highest commercial intent on the site.

## 3. User intent map

Every example query, resolved:

| Query | Page | Why |
|---|---|---|
| "I want a Boston business phone number" | `/numbers/boston` | City page. Geo vocabulary, city-level facts (its area codes, local presence). |
| "I want a 617 number" | `/numbers/boston`, section | Same commercial intent as "Boston number" in phone-literate words: a number that signals Boston. The city page owns a question-headed section per code ("Can I still get a 617 number?") with coverage, overlays, and availability. `/numbers/617` stays reserved as a 301 to that section. Dedicated code pages only by the §7 test. |
| "I need a toll-free number" | `/numbers/toll-free` | Number-type page. |
| "I want an 800 number" | `/numbers/toll-free`, section | NOT its own page. 800/833/844/888 are prefixes of one product; separate pages would re-answer one question five times. The toll-free page owns prefix questions in a section + FAQ. Revisit only if the 800-prestige question outgrows the section. |
| "I need a vanity phone number" | `/numbers/vanity` | Number-type page. HELD until the product truly supports vanity search; never promise inventory the product can't show. |
| "I want a second business number" | `/numbers/second-business-number` | Number-type page (GET intent). Reassigned from the planned `/learn/second-business-number` (Phase 1, unbuilt) - see §10. |
| "I want to keep my existing number" | `/numbers/keep-your-number` | The bring-your-own entry in the same catalog: "new number or yours" is the family's first fork. Reassigned from the planned `/learn/keep-your-existing-business-number` (Phase 2, unbuilt). The vendor-neutral how-to remains Learn territory (`/learn/how-to-get-a-business-phone-number` stays put). |

Rule of thumb encoded here: **a new query is a new page only when it carries different facts, not just different words.** "617 number" vs "Boston number" carry different facts (two pages). "800 number" vs "toll-free number" carry the same facts (one page).

## 4. URL architecture

```
/numbers/                      hub - the catalog front door
  /numbers/ (hub)               type   (mini-pillar for all geo pages)
  /numbers/toll-free           type
  /numbers/vanity              type   (held for product support)
  /numbers/second-business-number  type
  /numbers/keep-your-number    type   (porting)
  /numbers/boston              city   (owns its area codes as sections: 617, 857)
  /numbers/new-york            city
  /numbers/miami               city
```

**One flat folder, two page kinds.** Kind is carried by the template and the knowledge graph, never by the URL. This preserves the locked rule (two levels max, sub-categorization on hub pages, never in URLs), reads naturally ("numberline.com/numbers/boston" is how a human would say it), and gives AI retrieval maximally entity-dense slugs.

**Slug law (permanent):**
- Type slugs are a reserved list, curated forever: `local`, `toll-free`, `vanity`, `second-business-number`, `keep-your-number`, plus future types by owner decision. No city or code may ever take a reserved slug.
- City slugs: full lowercase-hyphenated city name (`new-york`, `los-angeles`, `san-francisco`). Nicknames and abbreviations (`nyc`, `la`, `sf`) are 301 redirects, never canonicals.
- Area-code slugs: the three digits (`617`) are RESERVED, permanently, as 301 redirects to the owning city page's code section. Numeric slugs can never collide with names; that non-collision is why flat works. A code that passes the §7 test takes over its reserved slug as a real page.
- International (future): country pages take the country name (`/numbers/canada`, `/numbers/uk`); foreign cities join the same flat folder (`/numbers/london`, `/numbers/toronto`). Country names join the reserved list the day international ships. If a real name collision ever occurs (a US city named like a country), the smaller entity takes a qualified slug; the collision is resolved in this file first.

**Rejected alternatives:**
- `/numbers/city/boston`, `/numbers/area-code/617`: three levels; violates the locked URL rule; adds folder taxonomy that the hub page should do.
- `/local-numbers/`, `/toll-free-numbers/` as separate folders: fragments one family into many, breaks the single hub, and makes the footer column impossible.
- Geo pages under `/learn/`: wrong verb; a Boston page that must stay "90% true without Numberline" cannot sell a Boston number.

## 5. Ownership model (no duplicate intent, ever)

**Pillars own meaning; folders own templates.** That existing law resolves the whole family:

- The **Business Phone Number pillar** remains the meaning owner. Its definition sentence and its local/toll-free sections (merged into the canonical, July 2026; business-sms-number Rejected in the no-Google audit) stay exactly where they are. Numbers pages use the pillar's definitions verbatim and link up to `/learn/business-phone-number` in their opening.
- **Type pages parent to the Business Phone Number pillar.** They are its commercial children.
- **`/numbers/ (hub)` is the mini-pillar for ALL geo pages.** Every city and area-code page parents to it (a city number IS a local number). `/numbers/toll-free` has no geo children by definition.
- **Area codes belong to their city page** as sections; their reserved numeric slugs redirect there. A code page exists only via the §7 test and then parents to its city page.

**The boundary test (add to the confusable pairs):** *Numbers vs Learn: getting a thing vs understanding a topic. Test: does the reader already know they want it? → Numbers. Would the page still be useful to someone who chooses a competitor? → Learn.*

Concrete guards:
- `/learn/local-business-phone-number` keeps "what is a local number, do I want one". `/numbers/ (hub)` answers "get a local number". Each links the other; neither re-answers the other's question.
- Same split for toll-free.
- The two reassigned slugs (§3) are reassigned BEFORE being built, so no 301s and no duplication ever exist.
- Availability, area-code facts, and city coverage belong to `/numbers/` alone. No Learn page ever grows an area-code list.

## 6. City pages

**Yes, they exist.** Unique question: **"Can I get a [city] business phone number, and which numbers count as [city]?"** A Learn page can't answer it (it is Numberline-specific and commercial) and `/numbers/ (hub)` can't answer it for 300 cities without becoming a directory.

How a city page differs from `/numbers/ (hub)`: the type page owns the concept (why local presence, how local numbers work in Numberline); the city page owns one market's FACTS: which area codes signal that city, what the overlay situation is, what a caller from there expects to see.

**Every city page contains (the template contract, §8):**
1. H1 "[City] business phone number" + the 40-60 word liftable yes.
2. The city's area codes, as an at-a-glance reassurance list (NOT a decision tree: the visitor already chose the city). Each code: a two-word label ("Classic Boston", "Modern Boston") + one or two explanation sentences covering what it signals and availability. Goal: "any of these works; now I understand the differences" in under 30 seconds. These sections OWN the code intent; reserved numeric slugs 301 here.
3. A localized Sample Setup card: a number in the city's classic code forwarded to mobiles. The ONE setup visual.
4. Local vs toll-free for this market: one row, linking the Learn pair.
5. "Already have a [city] number?" porting row → `/numbers/keep-your-number`.
6. FAQ: the geo questions ("Can I get a 617 number if I'm not in Boston?", "Does it work outside [city]?").
7. Standard CTAs.

**The no-filler law applies with full force:** a city page ships only when it can state facts specific to that city (real codes, real overlay history, real caller expectations). If the page would be another city's page with the name swapped, it does not ship. City rollout is gated by real number availability in the product, never by a keyword list.

Relationship to other families: industry pages' "relevant number type" link retargets from the Learn pages to `/numbers/` type pages when the family ships; city pages link industries only generically (no fake "Boston plumbers love us" content, ever).

## 7. Area codes: sections by default, pages by exception

**Default: NO area-code pages.** "617 number" and "Boston number" are one commercial intent in different vocabulary; splitting them would violate one question = one canonical URL and produce near-duplicate pages competing for the same answer. Everything a code-seeker needs (coverage, the overlay family, availability, what the code signals) lives in the city page's per-code sections (§6.2), and the reserved numeric slug (`/numbers/617`) 301s to that section.

**The constitutional test (binding).** A dedicated area-code page may exist ONLY when ALL THREE hold:
1. **Independent commercial identity:** people seek the code itself, beyond wanting the city (a prestige/scarcity market of its own - 212 is the archetype; most codes never qualify).
2. **Best-resource depth:** the page can carry enough unique facts (history, scarcity, secondary market, honest availability) to become the best resource on the internet for that code - not two paragraphs the city page already implies.
3. **A genuinely different question:** it answers something the city page does not ("is a 212 still obtainable and what does that mean?"), not a rewording of "get me a [city] number."

Failing any one, the code stays a section. A code that later passes takes over its reserved slug, parents to its city page (§5), and the city section shrinks to a summary + link in the same commit. Expected result over a decade: a handful of code pages at most, each unarguable.

This keeps the graph at its smallest: assistants asked "can I still get a 617 number" find exactly one owner (the Boston page's section), never two near-duplicates.

## 8. Templates: two, from one skeleton

Both share the family skeleton (liftable answer → Sample Setup → facts → porting row → FAQ → CTA) and the existing primitives: Sample Setup card, function-colored rows, comparison table (canonical `.cmp`), FAQ accordion, closer card. **No new primitives are required to launch the family.** One candidate primitive, the **Number Card** (a specimen phone number with its type/city/code chips, shown as product UI), enters canon with the hub's first build under DESIGN_SYSTEM §9 governance, and becomes the family's signature the way the Script Card is for Templates. (A third template, Area Code, is drafted only if a code ever passes the §7 test.)

| | Number Type | City |
|---|---|---|
| Intent | "I need this kind of number" | "I want a number for this place" (incl. its codes) |
| Required | liftable yes · what it signals · Sample Setup · who picks this type (links) · porting row · FAQ | liftable yes · per-code sections (question-headed) · localized Sample Setup · local vs toll-free row · porting row · FAQ |
| Optional | comparison table (local vs toll-free lives ONLY on the two type pages) · industry links | notable-neighborhood notes when factual · scarcity notes per code |
| Links up | pillar canonical + `/numbers/` hub | `/numbers/ (hub)` |
| CTA | standard pair | standard pair |
| Length | 500-800 words | 500-800 words (codes included) |

CTA strategy, family-wide: "Get early access" primary, "See how it works" secondary, one mid-page and one closing, exactly as everywhere else. **Pre-launch bans bind hardest here:** no "pick your number now", no "in minutes", no instant or temporary numbers, no "free porting". The family sells availability of the catalog, not immediacy of delivery. Until launch, the honest promise is: this number type/city/code is what Numberline provides; get early access.

Maintenance note (CMS-readiness): city pages are the site's first true template + content-model pages. Their variable content is data (city name, code list with per-code facts, coverage sentence, sample number, FAQ pairs). Build the reference implementation so that the data is cleanly separable per IMPLEMENTATION_REGISTRY Phase 5; hundreds of geo pages must never mean hundreds of hand-maintained layouts.

## 9. Hub, footer, nav

- `/numbers/` hub: Phase-1-style hub page, the catalog front door. Sections: number types (the five type pages) · popular cities · notable area codes · "bring your own" porting block. Hubs absorb growth: new cities and codes appear here and on `/numbers/ (hub)`, never in the footer.
- Footer: Numbers earns a column WHEN the family launches, per the existing rule (columns appear only when a family launches). Label "Numbers" (user-facing noun). Hub link + 5-7 curated deep links, capacity rule unchanged.
- Nav: unchanged, five items forever. Numbers is reached through the footer column, hubs, and the graph.
- Sitemap: new per-hub segment for `/numbers/`.

## 10. KNOWLEDGE_GRAPH.md amendment (apply on approval, verbatim)

1. **Content types (folders):** add: `- /numbers/ - commercial number-catalog pages (types, cities, area codes). Footer label: "Numbers". Reader verb: GET.` And in the verbs line, add GET (Numbers, `/numbers/`) as the ninth verb.
2. **Core & hub pages:** add `- /numbers/ index - Phase 2 · Commercial Investigation · Hub`.
3. **New section, after PILLAR: Business Phone Number:**

```
# PILLAR FAMILY: Numbers (commercial catalog - GET intent)
Meaning stays with the Business Phone Number pillar; these pages own acquisition.
Boundary: getting a thing vs understanding a topic. "Still useful if they choose
a competitor?" → Learn. "Reader already knows they want it?" → Numbers.
- /numbers/ (hub) - Phase 2 · Commercial Investigation · Number Type - mini-pillar for ALL geo pages
- /numbers/toll-free - Phase 2 · Commercial Investigation · Number Type (owns 800/833/844/888 prefix questions; no per-prefix pages)
- /numbers/keep-your-number - Phase 2 · Setup Guide · Number Type (porting; replaces planned /learn/keep-your-existing-business-number)
- /numbers/second-business-number - Phase 2 · Commercial Investigation · Number Type (replaces planned /learn/second-business-number)
- /numbers/vanity - Held · Commercial Investigation · Number Type (until product supports vanity search)
- /numbers/boston - Future · Commercial Investigation · City - first City reference implementation; owns its area codes (617, 857) as sections; /numbers/617 reserved as 301
- Area-code pages: NONE by default (one intent, one URL). A code page requires the three-part test in NUMBERS_ARCHITECTURE §7 (independent commercial identity + best-resource depth + a question its city page doesn't answer) and then parents to its city page
- Further cities: gated by real availability + the no-filler law; each city parents to /numbers/ (hub)
- International (future): country pages (/numbers/canada, /numbers/uk) join this family; country names join the reserved slug list at that time
- Related: learn/business-phone-number (pillar, linked in every opening) · learn/local-business-phone-number · learn/toll-free-business-number · for/startups · industry pages' "relevant number type" links retarget here at launch
```

4. **PILLAR: Business Phone Number:** remove the two reassigned children (`/learn/second-business-number`, `/learn/keep-your-existing-business-number`) and note: "commercial number acquisition → OWNED by Numbers family; link, don't duplicate." `/learn/how-to-get-a-business-phone-number` stays (vendor-neutral how-to).
5. **Content Type legend:** add `Number Type · City · Area Code` under a Numbers group.

Companion edits on approval: PAGE_BLUEPRINTS gains §9 (Numbers family, the three templates from §8 here, plus the Numbers-vs-Learn boundary in the confusable pairs); NUMBERLINE.md footer section notes the future Numbers column; templates/ gains the three templates as they are approved.

## 11. Build order

1. **`/numbers/` hub** - establishes the family's voice, the catalog frame, and the Number Card primitive. Everything else needs it to exist for up-links.
2. **`/numbers/ (hub)`** - the geo mini-pillar; unblocks every future city/code page.
3. **`/numbers/toll-free`** - completes the first fork (local or toll-free) and absorbs the 800-number intent immediately.
4. **`/numbers/keep-your-number`** - every other Numbers page needs its porting row to point somewhere real; also the highest-trust page for switchers.
5. **`/numbers/boston`** - the geo reference implementation, area-code sections included: proving one city page (with its 617/857 sections and reserved-slug redirects) proves the whole rollout.
6. **`/numbers/second-business-number`** - type page rounding out the catalog.
7. `/numbers/vanity` when the product supports it; city rollout by availability; international when real.

## 12. Standing guardrails

- No page ships to complete the catalog. Every city and code page passes "genuinely better than the current best resource" or waits.
- Pre-launch language bans apply in full (§8). Porting pages respect the two-number convention (active green, porting amber) when showing product UI.
- One setup visual per page, function colors are law, mobile-first destinations, root-relative links: all existing conventions bind unchanged.
- This file joins the permanent doc set on approval; the Numbers family's ownership questions resolve HERE first, then in KNOWLEDGE_GRAPH.md, same-commit.
