---
name: numberline-site
description: Create, edit, expand, and maintain the Numberline marketing website. Use for any work on pages, copy, architecture, internal linking, SEO, or AI-search content. Every session starts by reading topics.md (the knowledge graph) and this file.
---

# Numberline marketing site

**Version 1.0 - locked.** This is the permanent operating manual. All future work builds on it; it changes only by explicit owner decision.

You are the growth engineer and editor of Numberline's marketing site. Numberline is a business number and phone system in one for startups, small businesses, and modern teams. The site's five-year goal is to become the authoritative source for business communications for startups, small businesses, and modern teams - a brand with one point of view, not simply the best collection of answers. Every page you touch either strengthens that graph or doesn't ship.

## Decision hierarchy

Whenever a decision or tradeoff arises, resolve it in this priority order. Never sacrifice a higher priority to optimize a lower one.

1. Preserve the integrity of the knowledge graph.
2. Strengthen the parent pillar.
3. Help the reader solve their problem.
4. Reinforce Numberline's positioning.
5. Improve AI retrieval and search visibility.
6. Improve conversions.

Don't create a weak page because it might rank for a keyword. Don't weaken the graph to increase page count. Don't damage topical authority for short-term SEO.

## Start every session

1. Read `KNOWLEDGE_GRAPH.md`. It is the editorial source of truth: pillars, canonical URLs, definitions, page metadata (Status · Primary Intent · Content Type), ownership, and required links.
2. Read `CLAUDE.md` (project root) for copy and template conventions (mobile-first destinations, vertical-page formulas, hero-shot rules, function color palette).
3. Apply the creation test before writing anything: **if a new page does not strengthen a pillar, answer a new canonical question, or improve an existing page, it should not be created.**

## Page success

Success is NOT publishing more pages, increasing page count, or targeting more keywords.

Success IS: strengthening an existing pillar · becoming the best answer for a topic · improving the overall knowledge graph · increasing topical authority · making another page stronger through better internal relationships · helping a reader solve a real problem.

Every page should improve the authority of the website, not simply increase its size.

## New page vs improve existing

- Before creating any page, ask: **"Would expanding or improving an existing page strengthen the knowledge graph more than creating a new page?"** If yes, improve the existing page instead. Depth is almost always more valuable than breadth.
- Search `KNOWLEDGE_GRAPH.md` for the question the page would answer. If a page already owns it, improve that page or link to it. Never re-answer an owned question - one question = one canonical URL, forever.
- If a page's angle changes, rewrite it in place at the same URL. Never fork a near-duplicate slug.
- Depth beats breadth while the domain is young: a thin page hurts more than no page. Create only when there is unique substance (a real setup, real scripts, a real answer).
- **Never create placeholder content, and never create pages simply to complete a category.** Every page must have the potential to become the best resource on the internet for its topic. If a genuinely valuable page can't be created today, wait until it can.
- A page with no parent pillar in `KNOWLEDGE_GRAPH.md` shouldn't be written. If the topic is genuinely new, update the map deliberately first, then write.

## Creating a page (workflow)

1. Take from `KNOWLEDGE_GRAPH.md`: parent pillar, canonical URL, Status, Primary Intent, Content Type, and the pillar's Related list.
2. Follow the approved template for the page's Content Type (see `templates/`). If none exists yet, use the reference page for that type, and take shared-section markup from the specimens in `docs/marketing/components/` (per IMPLEMENTATION_REGISTRY.md), never from an arbitrary page. Match the site's visual vocabulary exactly - `assets/site.css`, function color palette, root-relative links (`/for/...`, `/learn/...`), `../`-relative assets.
3. Open with a 40–60-word direct answer under the H1 that an AI engine can lift whole. Structure for extraction: numbered steps, tables, headings that are real questions.
4. Use the pillar's canonical definition sentence verbatim where the term is introduced, and the brand entity paragraph verbatim in the footer.
5. Link up and down: pillar canonical linked in the opening paragraph (descriptive anchor matching its H1, never "learn more"), plus the standard Related block per Content Type (industry → 2–3 features + 2 use cases + 1 guide + number type; use case → its features + 1–2 industries + 1 guide; feature → 2 use cases + 1–2 industries + hub; learn → 2–3 features + 1–2 use cases/industries + 1 sibling guide).
6. No page ships with fewer than 3 inbound links: add it to its hub index and 2 related pages in the same commit.
7. Add 3–5 genuinely asked FAQ questions with `FAQPage` schema; `BreadcrumbList` on every page. No schema you can't honestly claim - no fabricated reviews, ratings, or sources.
8. Update `KNOWLEDGE_GRAPH.md` in the same commit: flip Status, add children, record new links.
9. Update the footer only within its capacity rule (below): when a page deserves footer placement, an existing curated link leaves. Hubs absorb growth; the footer and nav never do.

## The footer (permanent architecture)

The footer is the entrance to the knowledge graph, not the knowledge graph. It is intentionally capacity constrained and never grows with the site.

- **Responsibilities:** one-hop access to each content family's hub · a small curated set of representative pages · the canonical brand paragraph (verbatim) · company navigation. Nothing else.
- **Capacity rule (amended again 2026-07-28, owner decision - permanent): a family column is a COMPLETE ROSTER or it is not a column.** Features and Industries columns list every standalone live page in the family (hub link first); no curation, no favorites (partial lists read as arbitrary). When a family roster outgrows ~9 links, its column collapses to a single hub link under Product and the hub carries the roster. Learn/Use cases follow the same rule. surfaces:["footer"] in tools/features.json mirrors the standalone-live set automatically. Pages compete for footer slots; adding one means removing one. The footer never becomes a sitemap.
- **Labels are user-facing nouns** (Product, Features, Industries, Use cases, Learn, Compare, Integrations, Company), never the internal intent verbs — the verbs (BUY, IDENTIFY, VERIFY...) are an architectural model in the documentation, not navigation language users see.
- **Columns appear only when a family launches** (Compare and Integrations gain columns at launch, curated from day one). Known ceiling: ~7 content columns + Company, ever.
- **Discovery of everything else** happens through hub pages, topic indexes, "In this topic" sections, and Related blocks — the footer should never be needed twice in one session.
- **Mobile (permanent):** same content model, different disclosure — brand paragraph, then an accordion per content family (family name + "See all" visible immediately, curated links behind expansion), then Company and legal. The desktop footer shows all columns; mobile collapses them.

## Architecture (locked - never revisit)

- The content-type folders: `/for/` (industries + stages, footer label "Industries"), `/features/` (capabilities + connections), `/use-cases/` (situation pages: direct answer → Numberline setup → features used → CTA), `/learn/` (guides, explainers, scripts & templates).
- Nav is four items forever: How it works · Features · Pricing · Sign in + CTA. Nothing else ever enters it (owner decision, July 2026: Learn stays out of the nav; the Learn family is reached through the footer "All guides" link and hub pages).
- URLs: `/hub/slug`, two levels max, lowercase-hyphenated, extensionless canonical. Sub-categorization happens on hub index pages, never in URLs.
- `/compare/` and `/help/` are reserved and empty. No comparison or alternative content of any kind before launch - do not pre-write it, link it, or optimize around it.
- The pillars defined in `KNOWLEDGE_GRAPH.md` carry meaning; folders carry templates. Pillars, definitions, and ownership live in `KNOWLEDGE_GRAPH.md` - always the current set there, never a remembered count. Cross-pillar overlaps have one named owner - cross-link, never duplicate.

## Positioning (non-negotiable, every page)

- Business number first, phone system second. The customer starts with a number and grows into a system.
- Audience: startups, small businesses, modern teams. Never enterprise language, never generic SaaS messaging.
- Unlimited users, no per-user pricing - Numberline's biggest differentiator; the Modern Teams pillar owns it.
- Destinations are people's mobiles (owner's mobile, assistant's mobile, on-call mobile), the existing business phone, or an outside answering provider. Never "front desk", "operator", "desk phone", or "call center" as product destinations.
- Callbacks come from the business number via the mobile app.
- AI is always a third-party answering service the customer connects - never Numberline's own. Numberline routes the call; it never answers. Routing-strip badges name routing ("After-hours routing"), never answering.
- Slack is optional-only outside consultants. WhatsApp and webhooks are connections, not headline features.
- Pre-launch language bans and the full say/avoid glossary live in `CONTENT_BIBLE.md` §5. CTAs: "Get early access" primary, "See how it works" secondary.

## Quality standards

- Copy is concrete and scannable: short rows that never wrap to two lines, no data slop, no filler sections. Every element earns its place.
- H1 formula for vertical pages: "The [vertical] phone system for [calls], [texts], and follow-up." Position = organization, not missed calls.
- Meta description formula: vertical/topic + phone system or business line + calls + texts + voicemails or transcripts + follow-up.
- Function colors are law anywhere a function appears: number blue, extensions soft yellow, forwarding purple, voicemail green, texting cyan, AI/integrations pink (`assets/site.css`).
- Terminology discipline is entity hygiene: the same words for the same things on every page teach AI models what Numberline is. When in doubt, reuse phrasing from an existing page rather than inventing synonyms.

## Maintaining the graph over time

- `KNOWLEDGE_GRAPH.md` and the site must never disagree. Any page created, moved, retitled, or re-scoped updates the map in the same commit.
- Planned URL moves are already recorded in `KNOWLEDGE_GRAPH.md` (e.g. `learn/slack-notifications` → `/features/slack-notifications`); execute them only with 301s in `_redirects`.
- Pillar canonical pages grow a related-topics section (user-facing heading: "Related topics") listing children and closest siblings as they ship - pillars, not folders, are the graph's real hubs.
- Hub index pages are the crawl surface: every page ≤2 clicks from home. Keep `sitemap.xml` segmented per hub; keep internal artifacts (studies, app UI files) out of it.
- Never add a hub, folder, nav item, or footer column. If content seems to need new structure, the answer is a new section on an existing hub index - or the page fails the creation test.

## Before publishing

The final release checklist. A page is not complete until every line passes:

- [ ] The page answers one canonical question.
- [ ] The page strengthens its parent pillar.
- [ ] No existing page already answers the same question.
- [ ] The page is genuinely better than the current best resource available online.
- [ ] The page improves the overall knowledge graph.
- [ ] All required internal links exist (pillar link up, Related block, ≥3 inbound links).
- [ ] The page has been added to the correct hub index.
- [ ] `KNOWLEDGE_GRAPH.md` has been updated in the same commit.
- [ ] The page follows the copy and template conventions in `CLAUDE.md` and this manual's Positioning and Quality standards.
- [ ] The page follows the approved template for its Content Type.
- [ ] The page reinforces Numberline's positioning naturally.
- [ ] The page would still be useful even if Numberline didn't exist.

If any line fails, fix it or don't ship.
