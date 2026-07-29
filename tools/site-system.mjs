#!/usr/bin/env node
/* site-system: propagation + verification tool for the Numberline marketing site.
   Zero dependencies. Node 16+. Usage:
     node tools/site-system.mjs verify            run the full verification suite (exit 1 on failure)
     node tools/site-system.mjs apply nav         dry-run nav propagation (shows what would change)
     node tools/site-system.mjs apply footer      dry-run footer propagation
     node tools/site-system.mjs apply shared-shell   nav + footer
     node tools/site-system.mjs apply nav --write actually write (dry-run is the default)
     node tools/site-system.mjs report            manifest + variant + check summary
   Scope: ONLY the pages in tools/site-pages.json. Never touches export/, screenshots/,
   uploads/, app/, docs/ page content, or internal artifacts.
   Boundary: each active page contains exactly one <nav>...</nav> and at most one
   <footer>...</footer>; the tool aborts if a boundary is missing or ambiguous.
   Rollback: git. The tool never writes backup copies. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = f => fs.existsSync(path.join(ROOT, f));
const write = (f, s) => fs.writeFileSync(path.join(ROOT, f), s);
const MAN = JSON.parse(read('tools/site-pages.json'));
const PAGES = Object.entries(MAN.pages); // [path, meta]
const norm = s => s.replace(/\s+/g, ' ').trim();
const block = (html, tag) => {
  const re = new RegExp('<' + tag + '[\\s>][\\s\\S]*?<\\/' + tag + '>', 'g');
  return html.match(re) || [];
};
const specimen = key => {
  const file = MAN.specimens[key];
  const m = read(file).match(key.startsWith('footer') ? /<footer[\s\S]*<\/footer>/ : /<nav[\s\S]*<\/nav>/);
  if (!m) throw new Error('specimen ' + file + ' has no component block');
  return m[0];
};
const navFor = meta => {
  let nv = specimen('nav');
  if (meta.nav === 'early-access-join') nv = nv
    .replace('href="/early-access.html" class="nav-cta nav-cta-m"', 'href="#join" class="nav-cta nav-cta-m"')
    .replace('href="/early-access.html" class="nav-cta"', 'href="#join" class="nav-cta"');
  else if (meta.nav !== 'standard') throw new Error('unknown nav variant: ' + meta.nav);
  return nv;
};
const footFor = meta => {
  if (meta.footer === 'standard') return specimen('footer');
  if (meta.footer === 'utility') return specimen('footer-utility');
  throw new Error('unknown footer variant: ' + meta.footer);
};

/* ---------- propagation ---------- */
function apply(parts, writeMode) {
  const plan = []; const aborts = [];
  for (const [p, meta] of PAGES) {
    let html; try { html = read(p); } catch (e) { aborts.push(p + ': unreadable'); continue; }
    let next = html; const changes = [];
    for (const part of parts) {
      const tag = part === 'nav' ? 'nav' : 'footer';
      const found = block(next, tag);
      if (found.length !== 1) { aborts.push(p + ': expected exactly one <' + tag + '>, found ' + found.length); continue; }
      const expected = part === 'nav' ? navFor(meta) : footFor(meta);
      if (norm(found[0]) !== norm(expected)) { next = next.replace(found[0], expected); changes.push(part); }
    }
    if (changes.length) plan.push({ page: p, changes });
    if (writeMode && changes.length && !aborts.length) write(p, next);
  }
  if (aborts.length) { console.error('ABORTED (nothing written):\n' + aborts.join('\n')); process.exit(2); }
  if (!plan.length) console.log((writeMode ? 'apply' : 'dry-run') + ': 0 changes; all ' + PAGES.length + ' consumers already match their registered variant');
  else {
    console.log((writeMode ? 'APPLIED' : 'DRY-RUN (pass --write to apply)') + ':');
    for (const c of plan) console.log('  ' + c.page + ': would replace ' + c.changes.join(', '));
  }
  return plan.length;
}

/* ---------- verification ---------- */
function verify() {
  const errs = []; const warn = [];
  const active = PAGES.map(([p]) => p);
  const heldSet = new Set(active.filter(p => MAN.pages[p].category === 'held_noindexed'));
  const redirects = read('_redirects').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => l.split(/\s+/));
  const rw200 = new Set(redirects.filter(r => r[2] === '200').map(r => r[0]));
  const r301from = new Map(redirects.filter(r => r[2] === '301' || r[2] === '302').map(r => [r[0], r[1]]));
  // redirect chains
  for (const [from, to] of r301from) if (r301from.has(to)) errs.push('_redirects: chain ' + from + ' -> ' + to + ' -> ' + r301from.get(to));
  const canonicalOf = p => p === 'index.html' ? '/' : p.endsWith('/index.html') ? '/' + p.slice(0, -10) : '/' + p.replace(/\.html$/, '');
  const legacyFlat = ['/phone-system-for-', '/small-business-phone-system', '/mobile-app', '/slack-notifications', '/personal-cell-vs-business-phone-system', '/google-voice-alternative'];
  const retired = ['fq-text', 'sec-kicker">', 'jx-kicker">', '"kicker">', 'badge"><i></i> Live', 'No integrations', 'They hold your number', 'Hard to switch providers', 'Designed before Slack', 'built before Slack', 'Per-seat phone systems', 'Generic calling app', 'Pick this when', 'first responder', 'Lives on Google'];
  // comparison canonical data
  const spec = read('docs/marketing/components/comparison-table.html');
  const rowRe = /<div class="cmp-row( best)?"><div class="opt">([^<]+)<span class="verdict">([^<]*)<\/span><\/div><div class="gaps">([\s\S]*?)<\/div><\/div>/g;
  const canonRows = {}; const pools = {}; let m;
  while ((m = rowRe.exec(spec))) {
    const chips = [...m[4].matchAll(/<span class="(gap|has)">([^<]*)<\/span>/g)].map(x => [x[1], x[2]]);
    (m[1] ? pools : canonRows)[m[2]] = { verdict: m[3], chips };
  }
  for (const need of ['last_verified', 'official_sources', 'approved_claims', 'rejected_claims', 'applicable_contexts'])
    if (!spec.includes(need)) errs.push('comparison specimen: missing verification metadata field ' + need);
  const cmpConsumers = MAN.comparison_consumers || [];
  for (const [p, meta] of PAGES) {
    const h = read(p);
    // shell
    const navs = block(h, 'nav'); const foots = block(h, 'footer');
    if (navs.length !== 1) errs.push(p + ': ' + navs.length + ' <nav> blocks');
    else if (norm(navs[0]) !== norm(navFor(meta))) errs.push(p + ': nav differs from registered "' + meta.nav + '" variant');
    if (foots.length !== 1) errs.push(p + ': ' + foots.length + ' <footer> blocks');
    else if (norm(foots[0]) !== norm(footFor(meta))) errs.push(p + ': footer differs from registered "' + meta.footer + '" variant');
    // deprecated markup + retired wording
    for (const bad of retired) if (h.includes(bad)) errs.push(p + ': retired pattern "' + bad + '"');
    // held links (sanctioned: numbers hub, and held pages among themselves)
    if (!heldSet.has(p) && p !== 'numbers/index.html')
      for (const held of heldSet) if (h.includes('href="/' + held + '"') || h.includes('href="/' + held.replace(/\.html$/, '') + '"')) errs.push(p + ': links held page ' + held);
    // style authority
    const si = h.indexOf('site.css'); const ci = h.indexOf('canon.css');
    if (si < 0) errs.push(p + ': site.css missing'); if (ci < 0) errs.push(p + ': canon.css missing');
    const linkCount = n => (h.match(new RegExp('<link[^>]*href="[^"]*' + n + '\\.css[^"]*"', 'g')) || []).length;
    if (linkCount('site') > 1 || linkCount('canon') > 1) errs.push(p + ': shared stylesheet linked more than once');
    // stamp clearance: a hero stamp hanging -Npx above its card needs hero padding-top >= N+8,
    // or a short headline lets the stamp slide under the fixed nav (regression 2026-07-28).
    // Overhang values now live in canon.css (Phase 4 lift); page-local overrides still count.
    if (/class="[^"]*(hero-route-stamp|shot-stamp)/.test(h)) {
      const canonCss = read('assets/canon.css');
      const overFor = cls => Math.max(0, ...[...(h + canonCss).matchAll(new RegExp('\\.' + cls + '\\{[^}]*top:-(\\d+)px', 'g'))].map(x => +x[1]));
      const used = ['hero-route-stamp', 'shot-stamp'].filter(c => new RegExp('class="[^"]*' + c).test(h));
      const need = Math.max(...used.map(overFor)) + 8;
      const padM = h.match(/\.(?:hero|jx-hero)\{[^}]*padding:(\d+)px/);
      if (padM && +padM[1] < need) errs.push(p + ': hero padding-top ' + padM[1] + 'px cannot clear its stamp (need >= ' + need + 'px)');
    }
    if (si > -1 && ci > -1 && ci < si) errs.push(p + ': canon.css loads before site.css');
    const lastStyle = h.lastIndexOf('<style');
    if (ci > -1 && lastStyle > ci && !h.slice(lastStyle, lastStyle + 60).includes('__om-edit-overrides')) errs.push(p + ': <style> after canon.css');
    // canonical + schema
    const canon = (h.match(/rel="canonical" href="([^"]*)"/g) || []);
    if (meta.indexable || meta.category !== 'utility' && p !== 'signup.html') {
      if (canon.length !== 1 && p !== 'signup.html') errs.push(p + ': expected exactly one canonical tag, found ' + canon.length);
      const val = (canon[0] || '').match(/href="([^"]*)"/)?.[1];
      if (val && val !== (meta.canonical || canonicalOf(p))) errs.push(p + ': canonical ' + val + ' != ' + (meta.canonical || canonicalOf(p)));
      if (val && legacyFlat.some(l => val === l || (l.endsWith('-') && val.startsWith(l)))) errs.push(p + ': canonical points at legacy flat URL');
      if (val && r301from.has(val)) errs.push(p + ': canonical points at a redirecting URL');
    }
    for (const ld of h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []) {
      try { JSON.parse(ld.replace(/<script[^>]*>/, '').replace(/<\/script>/, '')); }
      catch (e) { errs.push(p + ': JSON-LD parse error: ' + e.message); }
    }
    if (h.includes('"FAQPage"') && !h.includes('class="faq-q"')) errs.push(p + ': FAQPage without visible FAQ');
    if (meta.category === 'held_noindexed' && !h.includes('content="noindex')) errs.push(p + ': held page lost noindex');
    // internal links
    for (const l of h.match(/href="\/[^"]*"/g) || []) {
      let u = l.slice(6, -1).split('#')[0].split('?')[0]; if (!u) continue;
      if (u.startsWith('/export/') || /^\/(app|screenshots|uploads)\//.test(u)) { errs.push(p + ': links internal artifact ' + u); continue; }
      const f = u.endsWith('/') ? u.slice(1) + 'index.html' : u.slice(1);
      if (exists(f)) continue;
      if (rw200.has(u) || r301from.has(u)) continue;
      if (exists(f + '.html')) { warn.push(p + ': extensionless link ' + u + ' relies on a rewrite that is missing'); continue; }
      errs.push(p + ': dead internal link ' + u);
    }
    // comparison model
    if (cmpConsumers.includes(p)) {
      const rows = [...h.matchAll(/<div class="cmp-row( best)?"><div class="opt">([^<]+)<span class="verdict">([^<]*)<\/span><\/div><div class="gaps">([\s\S]*?)<\/div><\/div>/g)];
      for (const r of rows) {
        const chips = [...r[4].matchAll(/<span class="(gap|has)">([^<]*)<\/span>/g)].map(x => [x[1], x[2]]);
        if (!r[1]) { // alternative row
          const c = canonRows[r[2]];
          if (!c) { errs.push(p + ': unregistered comparison row "' + r[2] + '"'); continue; }
          if (c.verdict !== r[3]) errs.push(p + ': "' + r[2] + '" verdict rewritten');
          if (chips.some(x => x[0] === 'has')) errs.push(p + ': green chip inside alternative row "' + r[2] + '"');
          if (JSON.stringify(chips.map(x => x[1])) !== JSON.stringify(c.chips.map(x => x[1]))) errs.push(p + ': "' + r[2] + '" chips differ from canonical data source');
        } else {
          const pool = pools[r[2]];
          if (!pool) { errs.push(p + ': unregistered winning row "' + r[2] + '"'); continue; }
          if (chips.some(x => x[0] === 'gap')) errs.push(p + ': red chip inside Numberline row');
          const approved = new Set(pool.chips.map(x => x[1]));
          for (const [, t] of chips) if (!approved.has(t)) errs.push(p + ': Numberline chip not in approved pool: "' + t + '"');
          if (chips.length < 4 || chips.length > 6) errs.push(p + ': Numberline row has ' + chips.length + ' chips (law: 4-6)');
        }
      }
    }
  }
  // sitemap
  const sm = read('sitemap.xml');
  const locs = new Set([...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].map(x => x[1]));
  const expect = new Set(PAGES.filter(([, m2]) => m2.indexable).map(([p, m2]) => MAN.origin + (m2.canonical || canonicalOf(p))));
  for (const u of locs) if (!expect.has(u)) errs.push('sitemap: unexpected URL ' + u);
  for (const u of expect) if (!locs.has(u)) errs.push('sitemap: missing ' + u);
  // registry integrity
  const reg = read('docs/marketing/IMPLEMENTATION_REGISTRY.md');
  for (const line of reg.split('\n')) {
    if (!line.startsWith('| ') || line.startsWith('| Primitive') || line.startsWith('|--')) continue;
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length !== 5) { errs.push('registry: malformed row: ' + line.slice(0, 60)); continue; }
    const [prim, owner, consumers, form, state] = cells;
    for (const [i, name] of [[1, 'owner'], [2, 'consumers'], [3, 'target form'], [4, 'state']])
      if (!cells[i]) errs.push('registry: "' + prim + '" missing ' + name);
  }
  for (const f of fs.readdirSync(path.join(ROOT, 'docs/marketing/components')))
    if (f.endsWith('.html') && !reg.includes(f) && !reg.toLowerCase().includes(f.replace('.html', '').replace(/-/g, ' '))) warn.push('registry: specimen ' + f + ' not clearly referenced');
  // feature registry: the canonical capability truth (IA_PLAN §0 rule 3, §9d)
  const REG = JSON.parse(read('tools/features.json'));
  const regById = Object.fromEntries(REG.features.map(f => [f.id, f]));
  const regHref = f => f.owner_page + (f.anchor ? '#' + f.anchor : '');
  const hubHtml = read('features.html');
  const catalogRendered = hubHtml.includes('data-fid=');
  const rendered = [...hubHtml.matchAll(/<(?:a|div) class="fcat-card[^"]*" data-fid="([^"]+)"(?: href="([^"]+)")?><b>([^<]+)/g)].map(m => ({ id: m[1], href: m[2] || null, name: m[3].trim() }));
  const seen = {};
  if (catalogRendered)
  for (const r of rendered) {
    seen[r.id] = (seen[r.id] || 0) + 1;
    const f = regById[r.id];
    if (!f) { errs.push('features.html catalog: unregistered capability "' + r.id + '"'); continue; }
    if (f.status === 'planned') errs.push('features.html catalog: planned capability rendered: ' + r.id);
    if (!f.surfaces.includes('features_hub')) errs.push('features.html catalog: ' + r.id + ' not approved for features_hub surface');
    const shouldLink = f.owner_page.startsWith('/features/') && f.status === 'live';
    if (shouldLink && r.href !== regHref(f)) errs.push('features.html catalog: ' + r.id + ' href ' + r.href + ' != registry ' + regHref(f));
    if (!shouldLink && r.href) errs.push('features.html catalog: ' + r.id + ' links a non-feature owner (' + r.href + ') - static card required');
    if (r.name !== f.name) errs.push('features.html catalog: ' + r.id + ' name "' + r.name + '" != registry "' + f.name + '"');
  }
  for (const [id, n] of Object.entries(seen)) if (n > 1) errs.push('features.html catalog: ' + id + ' rendered ' + n + ' times (must be exactly once)');
  for (const f of REG.features) {
    if (catalogRendered && f.status !== 'planned' && f.surfaces.includes('features_hub') && !seen[f.id]) errs.push('features.html catalog: registry capability missing from render: ' + f.id);
    // owner + anchor resolution
    const ownerFile = f.owner_page.replace(/^\//, '').replace(/\/$/, '/index.html');
    let ownerHtml; try { ownerHtml = read(ownerFile); } catch (e) { errs.push('features.json: ' + f.id + ' owner_page not found: ' + f.owner_page); continue; }
    if (f.anchor && !ownerHtml.includes('id="' + f.anchor + '"')) errs.push('features.json: ' + f.id + ' anchor #' + f.anchor + ' missing on ' + f.owner_page);
    if (f.status === 'planned') { const re = new RegExp('data-fid="' + f.id + '"'); if (re.test(hubHtml)) errs.push('planned capability rendered: ' + f.id); }
  }
  // footer feature links ⊆ registry footer surface
  const footSpec = read('docs/marketing/components/footer.html');
  const footFeat = footSpec.match(/<h5>Features<\/h5>([\s\S]*?)<\/div>/);
  if (footFeat) {
    const approved = new Set(REG.features.filter(f => f.surfaces.includes('footer')).map(f => f.owner_page));
    const present = new Set([...footFeat[1].matchAll(/href="([^"]+)"/g)].map(l => l[1]));
    for (const u of present) {
      if (u === '/features.html') continue;
      if (!approved.has(u)) errs.push('footer Features column links ' + u + ' which is not footer-approved in features.json');
    }
    // footer-approved standalone features must be PRESENT somewhere in the footer (any column - e.g. Mobile app lives under Product per the frozen IA), not just permitted (regression 2026-07-28)
    for (const f of REG.features) if (f.standalone && f.status === 'live' && f.surfaces.includes('footer') && !footSpec.includes('href="' + f.owner_page + '"')) errs.push('footer missing footer-approved feature: ' + f.id + ' (' + f.owner_page + ')');
  }
  // report
  for (const w of warn) console.log('WARN  ' + w);
  if (errs.length) { for (const e of errs) console.error('FAIL  ' + e); console.error('\n' + errs.length + ' failure(s).'); process.exit(1); }
  console.log('verify: PASS (' + PAGES.length + ' active pages, ' + warn.length + ' warning(s))');
}

function report() {
  const cats = {}; for (const [, m2] of PAGES) cats[m2.category] = (cats[m2.category] || 0) + 1;
  console.log('pages: ' + JSON.stringify(cats));
  console.log('nav variants: standard + early-access-join | footer variants: standard + utility');
  console.log('sweep-managed partials: nav, footer, footer-utility');
  console.log('NOT tool-managed (deliberate): hero shells, comparison tables (data-verified only), page content, local compositions (.trigger-action, .scenario-tag), deferred .whofor debt');
}

const [cmd, part, flag] = process.argv.slice(2);
if (cmd === 'verify' || !cmd) verify();
else if (cmd === 'report') report();
else if (cmd === 'apply') {
  const parts = part === 'shared-shell' ? ['nav', 'footer'] : part === 'nav' || part === 'footer' ? [part] : null;
  if (!parts) { console.error('apply nav | footer | shared-shell [--write]'); process.exit(2); }
  const changed = apply(parts, flag === '--write');
  if (flag === '--write' && changed) { console.log('re-checking idempotency...'); if (apply(parts, false)) { console.error('NOT IDEMPOTENT'); process.exit(1); } }
} else { console.error('commands: verify | apply <nav|footer|shared-shell> [--write] | report'); process.exit(2); }
