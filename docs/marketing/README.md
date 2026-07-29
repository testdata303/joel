# Numberline marketing site - documentation

Numberline is a product company. The permanent website is intentionally small and stays that way: Home, How it works &amp; features, Pricing, About, Early access, Sign in. Everything else is a disposable campaign page under `/go/` (owner decision, 2026-07-29). The large-SEO-site era (knowledge graph, pillars, Learn/Use-cases/Numbers/Industries families) is retired; its documents live in `archive/`.

## Documents

- **NUMBERLINE.md** - the operating manual: the permanent-site roster (locked), positioning guardrails, quality standards, publishing checklist.
- **MARKETING.md** - the campaign system: what a campaign page is, URLs, navigation and indexing rules, templates, the generation recipe.
- **CONTENT_BIBLE.md** - voice, tone, editorial standards, say/avoid glossary, language bans.
- **DESIGN_SYSTEM.md** - visual philosophy: page rhythm, component primitives, diagram rules, spacing, hierarchy.
- **HOW_TO_EDIT.md** - the operational playbook: "I want to change X, where do I edit?"
- **IMPLEMENTATION_REGISTRY.md** - one canonical implementation per reusable section, its consumers, and `tools/site-system.mjs` (verify / apply / report) over the page manifest `tools/site-pages.json`.
- **components/** - canonical markup specimens. Copy shared-section markup from here, never from an arbitrary page.
- **templates/campaigns/** - reference templates for campaign pages (verticals, geo, number type, comparison), converted from the retired permanent pages.
- **archive/** - retired graph-era documents (KNOWLEDGE_GRAPH, IA_PLAN, PAGE_BLUEPRINTS, NUMBERS_ARCHITECTURE, reviews, NUMBERLINE v1). History, not law.

Capability truth: `tools/features.json`. Comparison-claim truth: `components/comparison-table.html`. Copy conventions tied to the codebase: root `CLAUDE.md`.

## Workflow

- Editing the product pages: `HOW_TO_EDIT.md`, then `CONTENT_BIBLE.md` / `DESIGN_SYSTEM.md` as needed.
- Building a campaign page: `MARKETING.md`, start to finish.
- Adding anything to the permanent site: don't. It requires an explicit owner decision in `NUMBERLINE.md`.
