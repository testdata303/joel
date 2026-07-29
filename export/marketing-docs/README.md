# Numberline marketing site - documentation

The permanent handbook for how the Numberline marketing website is built, maintained, and expanded. It is the source of truth for website architecture, knowledge organization, editorial standards, positioning, writing style, and long-term content strategy - written to keep the site consistent as hundreds or thousands of pages are added over many years, and to work for any contributor: Claude, another AI tool, or a person editing by hand.

## Document responsibilities

Each document owns one thing. If guidance seems to belong in two places, it belongs in the one listed here.

### NUMBERLINE.md - how work gets done
Workflow and operating principles: the decision hierarchy, the page-creation process, new-vs-improve rules, publishing checklist, positioning guardrails, architecture (locked), and long-term graph maintenance.

### KNOWLEDGE_GRAPH.md - what the website knows
The canonical topic map: parent pillars, canonical URLs and definitions, page ownership and metadata (Status · Intent · Type), internal relationships, and the content plan. Every page starts and ends here - check it before writing, update it in the same commit as any page change.

### CONTENT_BIBLE.md - how Numberline sounds
Voice, tone, editorial philosophy, writing and structural standards, the say/avoid glossary and language bans, AI-search writing standards, and brand consistency.

### DESIGN_SYSTEM.md - how Numberline demonstrates
The visual philosophy: page rhythm, the component primitives (Sample Setup, Event Sequence, Call Flow...), diagram and screenshot rules, spacing and hierarchy, interaction and animation philosophy, and the experience north star. The visual counterpart to CONTENT_BIBLE.md.

### PAGE_BLUEPRINTS.md - how each page type is designed
The canonical editorial blueprint per content type: intent, hierarchy, sections, visuals, FAQ/CTA/link strategy, mistakes, and success criteria. Also defines the intent architecture: eight reader verbs (buy, identify, verify, resolve, understand, copy, evaluate, connect), each owned by exactly one family; every future page maps to exactly one. Templates are built from these.

### templates/ - how each page type is structured
Reusable templates for industry, feature, learn, startup, and use-case pages. Empty until the first templates are approved; until then, the highest-quality existing page of a type is the reference implementation.

Copy conventions tied to the codebase (component formulas, mockup rules, colors) live in the project root `CLAUDE.md`.

## Recommended workflow

1. Read `NUMBERLINE.md` - how to work.
2. Read `KNOWLEDGE_GRAPH.md` - what exists, what's planned, who owns the question.
3. Read `CONTENT_BIBLE.md` - how to sound.
4. Read `DESIGN_SYSTEM.md` - how to demonstrate.
5. Decide: improve an existing page or create a new one (`NUMBERLINE.md`, "New page vs improve existing").
6. Use the approved template for the page's Content Type from `templates/` (built from `PAGE_BLUEPRINTS.md`).
7. Update `KNOWLEDGE_GRAPH.md` in the same commit if new knowledge is introduced.
8. Verify against the "Before publishing" checklist in `NUMBERLINE.md` before considering the page complete.

## Status

`NUMBERLINE.md` and `CONTENT_BIBLE.md` are locked at v1.0 - they change only by explicit owner decision. `KNOWLEDGE_GRAPH.md` is living - it changes with every page shipped. `templates/` grows as page types are approved.
