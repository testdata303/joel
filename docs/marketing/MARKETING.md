# MARKETING.md - the marketing campaign system

Numberline is a product company. The permanent website is intentionally small: Home (`/`), How it works &amp; features (`/how-it-works`), Pricing, About, Early access, Sign in. Everything else is a campaign page.

## What a campaign page is

An independent marketing asset targeting one keyword or audience (examples: "Google Voice Alternative", "Boston Business Phone Number", "Plumber Phone System"). It can be created, edited, redirected, or deleted at any time. It never changes the permanent website architecture. It exists to convert its visitor and hand them into the product pages.

## Page families (owner decision 2026-07-29)

- **/go/** holds ONLY true disposable campaign pages (keyword-of-the-week, geo, promo). Nothing durable lives there.
- **/compare/** holds durable comparison pages, one per competitor (e.g. `/compare/google-voice`). They follow the comparison template and appear in the footer Compare column (owner decision 2026-07-29), never in the nav.
- **Root feature pages** (e.g. `/slack`, `/whatsapp`) are owner-approved, durable marketing pages for a single capability. Each one is an explicit owner decision; they appear in the footer Product column (owner decision 2026-07-29), never in the nav.

## URL conventions

- All campaign pages live under `/go/`: one flat, lowercase-hyphenated slug per keyword, e.g. `/go/google-voice-alternative-boston`.
- No subfolders, no taxonomy. The slug is the keyword, nothing more.
- Retiring a campaign: 301 its slug to `/how-it-works` (or its successor campaign) in `_redirects`, remove the file, remove it from the manifest and sitemap.

## Navigation rules

- Campaign pages NEVER appear in the nav, the footer, or on any permanent page.
- Campaign pages carry the standard nav and standard footer so visitors can leave into the product.
- Campaign pages do not need to link each other.

## Indexing

- Indexable, self-canonical (`/go/slug`, extensionless), listed in `sitemap.xml`.
- Registered in `tools/site-pages.json` with `"category": "campaign"`; run `node tools/site-system.mjs verify` after adding one.
- robots.txt stays blocked until beta; nothing changes that here.

## Canonical sources (never invent, always reuse)

- **Capabilities:** `tools/features.json`. If it is not there, the product does not do it.
- **Comparison claims:** `docs/marketing/components/comparison-table.html` (verified data; pages select rows, never rewrite them; polarity law applies).
- **Voice and language bans:** `CONTENT_BIBLE.md`, plus root `CLAUDE.md` copy conventions (H1 formula, hero bullets, CTA law, after-hours rules, pre-launch bans).
- **Components:** specimens in `docs/marketing/components/`, styles in `assets/site.css` + `assets/canon.css`. Never copy markup from an arbitrary page.

## Templates

Reference templates in `docs/marketing/templates/campaigns/`, matched by keyword type:

- **Vertical / industry** ("plumber phone system"): `vertical-plumbers.html` (best reference) or the closest sibling vertical.
- **Competitor alternative** ("Google Voice alternative"): `../comparison-alternative-page.html`.
- **Geo / city** ("Boston business phone number"): `city-boston.html`.
- **Number type** ("vanity number"): `number-type-vanity.html`.
- Hybrid keywords ("Google Voice alternative Boston") start from the dominant intent (comparison) and borrow sections (the geo hero, local area codes) from the other.

## Generating a campaign page (the recipe)

1. Pick the template by keyword type above.
2. Adapt the hero, pains, and sample setup to the keyword; keep every component's anatomy intact.
3. Reuse verified product content: features from `features.json`, comparison rows from the specimen, existing copy over new copy.
4. Point every CTA back into the permanent site: "Get early access" primary, "See how it works" secondary (order and guillemet law in `CLAUDE.md`).
5. Register: file at `/go/slug.html`, `_redirects` 200 rewrite for the extensionless URL, `sitemap.xml` entry, manifest entry, then `node tools/site-system.mjs verify`.

Never: invent capabilities, add nav or footer links, create folders, or touch the permanent pages to support a campaign.
