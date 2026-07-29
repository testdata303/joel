# HOW_TO_EDIT.md - where do I make the change?

The operational playbook. Optimize for one thing: never edit the wrong place first. When in doubt, edit the highest level that can correctly express the change.

The permanent site is 7 files: `index.html`, `how-it-works.html`, `pricing.html`, `about.html`, `early-access.html`, `signin.html`, `signup.html`. Everything else marketing lives under `/go/` (campaigns) or `docs/marketing/templates/campaigns/` (templates).

## I want to improve copy

**Edit the page HTML directly.** Read `CONTENT_BIBLE.md` §5 (language rules) first. Avoid em dashes (banned), pre-launch banned claims, and rewriting the footer entity paragraph (fixed text, used verbatim site-wide; changing it means changing it everywhere, owner decision only).

## I want to improve a reusable section

(Sample Setup, Hero, FAQ, Footer, Nav, Comparison Table, Closer, Function List, Trust Strip...)

1. Open `IMPLEMENTATION_REGISTRY.md`: it names the canonical owner, the specimen, and every consumer.
2. Make the change in the canonical place: styling in `assets/canon.css`; markup in the `docs/marketing/components/` specimen AND the owner page.
3. Sweep every registered consumer in the same session (`node tools/site-system.mjs apply` for nav/footer/shell; a scripted find-and-replace for the rest).
4. Never fix a shared section on just one page.

## I want to improve spacing, colors, typography, or shared styling

**Edit `assets/canon.css`** (loads last, wins the cascade, propagates site-wide). Page-level `<style>` only for rules genuinely unique to one page. Foundations (fonts, neutrals, function colors) live in `assets/site.css` per `DESIGN_SYSTEM.md` §4.

## I want to add a page

- **A marketing page for a keyword, audience, city, or competitor:** that is a campaign page. Follow `MARKETING.md` end to end. It never touches nav, footer, or the permanent pages.
- **A permanent page:** stop. That requires an owner decision recorded in `NUMBERLINE.md`.

## I want to change comparison claims

The comparison table is product data, not page copy. Update `docs/marketing/components/comparison-table.html` (with verification), then sweep the consumers listed in `tools/site-pages.json`. Pages choose which rows appear; they never rewrite a row.

## I found duplicated HTML

1. Registered primitive? `IMPLEMENTATION_REGISTRY.md` names the canon; converge the duplicate on it.
2. Unregistered but on 2+ pages? Add a registry row, pick the best implementation as owner, extract a specimen, converge the others.
3. Sweep mechanics: one scripted pass over the affected files, then verify each page renders.

## Decision tree

- **What a component means / when to use it** → `DESIGN_SYSTEM.md`
- **A reusable section's markup** → `IMPLEMENTATION_REGISTRY.md` → specimen + owner + sweep
- **Shared styling** → `assets/canon.css`
- **Voice, words, tone** → `CONTENT_BIBLE.md`, then edit the page
- **Page-specific content or layout** → edit the page
- **A new marketing page** → `MARKETING.md`
- **The permanent site's structure** → owner decision only (`NUMBERLINE.md`)
