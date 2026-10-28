// Turn results.json into a readable markdown report (summary.md).
// Usage: node summarize.mjs [results.json] [summary.md]
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IN = path.resolve(process.argv[2] || path.join(HERE, 'results.json'));
const OUT = path.resolve(process.argv[3] || path.join(HERE, 'summary.md'));

const data = JSON.parse(await readFile(IN, 'utf8'));
const results = data.results;
const pages = [...new Map(results.map((r) => [r.path, { path: r.path, slug: r.slug }])).values()];
const get = (p, vp) => results.find((r) => r.path === p && r.viewport === vp);
const ok = (r) => r && !r.error;

const cell = (v) => String(v ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const table = (head, rows) =>
  [`| ${head.map(cell).join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`)].join('\n');
const fmtBytes = (n) => {
  if (n == null) return '—';
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
};
const shortUrl = (u) => {
  if (!u) return '—';
  try {
    const url = new URL(u);
    if (url.protocol === 'blob:' || url.protocol === 'data:') return `${url.protocol} URL`;
    return url.origin === data.baseUrl ? url.pathname + url.search : u;
  } catch {
    return u;
  }
};
const yesNo = (v) => (v ? 'yes' : 'no');

const lines = [];
const out = (...l) => lines.push(...l);

out(
  '# pinkrynostudios.com audit summary',
  '',
  `- Generated: ${data.generatedAt}`,
  `- Site: ${data.baseUrl}`,
  `- Browser: Chrome ${data.browser.version} (headless, ${data.browser.executablePath}), playwright-core ${data.browser.playwrightCore}`,
  `- Screenshots: \`${data.outdir}\``,
  `- Viewports: ${data.viewports.map((v) => `${v.name} ${v.viewport.width}x${v.viewport.height} @${v.deviceScaleFactor}x`).join(', ')}`,
  '',
  'How to read the numbers:',
  '',
  '- Each page/viewport run uses a fresh browser context, so transfer sizes are cold-cache.',
  '- "Transferred" is the sum of CDP `Network.loadingFinished` `encodedDataLength` up to the moment the page data is captured (load + 800 ms, or + 2500 ms for game pages). Requests still in flight at that point are counted as "pending" and add 0 bytes.',
  '- "Boxes" are visible elements with `border-radius > 0` that also have a visible border or a background color different from the body background.',
  '- Contrast uses computed `color` against the nearest non-transparent ancestor `background-color` (semi-transparent layers composited). Text drawn over CSS background images or gradients is measured against the background color only.',
  '- Small tap targets (a, button, summary, label, input under 44x44 CSS px) are checked on mobile only. Inline text links are included and marked with display `inline`.',
  '',
);

// ---------- Overview
out('## Overview', '');
out(
  table(
    ['Page', 'Viewport', 'HTTP', 'Doc height', 'Screenshot', 'Requests', 'Transferred', 'Images', 'Boxes', 'Contrast fails', 'Small tap targets', 'TODO', 'Error'],
    results.map((r) => {
      const pending = r.network ? r.network.requests.filter((q) => q.pending).length : 0;
      return [
        r.path,
        r.viewport,
        r.status,
        r.documentHeight != null ? `${r.documentHeight}px` : null,
        r.screenshot ? `${path.basename(r.screenshot.file)}${r.screenshot.clipped ? ' (clipped to 6000)' : ''}` : null,
        r.network ? `${r.network.requestCount}${pending ? ` (${pending} pending)` : ''}` : null,
        r.network ? fmtBytes(r.network.totalBytes) : null,
        r.images ? r.images.length : null,
        r.boxes ? r.boxes.count : null,
        r.contrast ? `${r.contrast.failureCount} / ${r.contrast.checked}` : null,
        r.viewport === 'mobile' && r.smallTapTargets ? r.smallTapTargets.length : r.viewport === 'mobile' ? null : 'n/a',
        r.todo ? r.todo.count : null,
        r.error || '',
      ];
    }),
  ),
  '',
);

// ---------- Cross-page findings
out('## Findings across pages', '');
const findings = [];
const errors = results.filter((r) => r.error);
if (errors.length) findings.push(`**${errors.length} run(s) failed:** ${errors.map((r) => `${r.path} [${r.viewport}]: ${r.error}`).join('; ')}`);

const todoPages = results.filter((r) => ok(r) && r.viewport === 'desktop' && r.todo.count > 0);
if (todoPages.length) {
  findings.push(
    `**Visible "TODO" text on ${todoPages.length} page(s):** ${todoPages
      .map((r) => `${r.path} (${r.todo.items.map((i) => `"${i.text}"`).join(', ')})`)
      .join('; ')}`,
  );
} else findings.push('No visible "TODO" text found.');

const notFound = get('/404-check-does-not-exist/', 'desktop');
if (ok(notFound)) findings.push(`Missing-page check returned HTTP ${notFound.status} with title "${notFound.meta.title}".`);

// Heaviest requests across the site (dedupe by URL, desktop runs).
const heaviest = new Map();
for (const r of results.filter((x) => ok(x) && x.viewport === 'desktop')) {
  for (const q of r.network.requests) {
    if (typeof q.bytes !== 'number' || q.redirect) continue;
    const prev = heaviest.get(q.url);
    if (!prev || prev.bytes < q.bytes) heaviest.set(q.url, { ...q, page: r.path });
  }
}
const heavy = [...heaviest.values()].sort((a, b) => b.bytes - a.bytes).slice(0, 10);

const pendingRuns = results.filter((r) => ok(r) && r.network.requests.some((q) => q.pending));
if (pendingRuns.length) {
  findings.push(
    `**Requests still downloading when data was captured:** ${pendingRuns
      .map((r) => `${r.path} [${r.viewport}]: ${r.network.requests.filter((q) => q.pending).map((q) => shortUrl(q.url)).join(', ')}`)
      .join('; ')}. Their bytes are not in the totals, so desktop and mobile totals can differ for the same page.`,
  );
}

// Images: missing alt, oversized, unloaded.
const imgIssues = { missingAlt: new Set(), oversized: new Map(), notLoaded: new Set() };
for (const r of results.filter(ok)) {
  const dpr = r.viewport === 'mobile' ? 2 : 1;
  for (const img of r.images) {
    const key = `${r.path} → ${shortUrl(img.currentSrc || img.src)}`;
    if (img.alt === null) imgIssues.missingAlt.add(key);
    if (img.visible && img.naturalWidth === 0) imgIssues.notLoaded.add(`${key} [${r.viewport}]`);
    if (img.visible && img.renderedWidth > 0 && img.naturalWidth > 0) {
      const ratio = img.naturalWidth / (img.renderedWidth * dpr);
      const prev = imgIssues.oversized.get(key);
      if (!prev || prev.ratio > ratio) {
        imgIssues.oversized.set(key, { ratio, text: `${img.naturalWidth}x${img.naturalHeight} shown at ${img.renderedWidth}x${img.renderedHeight} [${r.viewport}]` });
      }
    }
  }
}
// Keep the smallest ratio per image across viewports; report only images oversized everywhere.
for (const [k, v] of imgIssues.oversized) if (v.ratio <= 2) imgIssues.oversized.delete(k);
findings.push(
  imgIssues.missingAlt.size
    ? `**Images without an alt attribute:** ${[...imgIssues.missingAlt].join('; ')}`
    : 'Every `<img>` has an alt attribute (empty alt counts as decorative).',
);
if (imgIssues.notLoaded.size) findings.push(`**Visible images with naturalWidth 0 (not loaded at capture time):** ${[...imgIssues.notLoaded].join('; ')}`);
if (imgIssues.oversized.size) {
  findings.push(
    `**Images more than 2x larger than needed** (natural width > 2 × rendered width × DPR): ${[...imgIssues.oversized]
      .map(([k, v]) => `${k} (${v.text})`)
      .join('; ')}`,
  );
}

// Meta checks.
const metaIssues = [];
const titles = new Map();
for (const p of pages) {
  const r = get(p.path, 'desktop');
  if (!ok(r)) continue;
  const m = r.meta;
  const miss = [];
  if (!m.title) miss.push('title');
  if (!m.description) miss.push('meta description');
  if (!m.canonical) miss.push('canonical');
  if (!m.lang) miss.push('html lang');
  if (!m.og['og:title']) miss.push('og:title');
  if (!m.og['og:image']) miss.push('og:image');
  if (!m.twitter['twitter:card']) miss.push('twitter:card');
  if (miss.length) metaIssues.push(`${p.path}: missing ${miss.join(', ')}`);
  if (m.title) titles.set(m.title, [...(titles.get(m.title) || []), p.path]);
}
findings.push(metaIssues.length ? `**Metadata gaps:** ${metaIssues.join('; ')}` : 'Every page has title, description, canonical, lang, og:title, og:image, and twitter:card.');
const dupTitles = [...titles].filter(([, ps]) => ps.length > 1);
if (dupTitles.length) findings.push(`**Duplicate titles:** ${dupTitles.map(([t, ps]) => `"${t}" on ${ps.join(', ')}`).join('; ')}`);

// Heading structure.
const headingIssues = [];
for (const p of pages) {
  const r = get(p.path, 'desktop');
  if (!ok(r)) continue;
  const h1s = r.headings.filter((h) => h.tag === 'h1').length;
  if (h1s !== 1) headingIssues.push(`${p.path}: ${h1s} h1`);
  let prev = 0;
  for (const h of r.headings) {
    const lvl = Number(h.tag[1]);
    if (prev && lvl > prev + 1) {
      headingIssues.push(`${p.path}: ${'h' + prev} → ${h.tag} ("${h.text}")`);
      break;
    }
    prev = lvl;
  }
}
findings.push(headingIssues.length ? `**Heading structure:** ${headingIssues.join('; ')}` : 'Every page has exactly one h1 and no skipped heading levels.');

// Mobile overflow.
const overflow = results.filter((r) => ok(r) && r.viewport === 'mobile' && r.documentWidth > 390);
findings.push(overflow.length ? `**Horizontal overflow on mobile:** ${overflow.map((r) => `${r.path} (${r.documentWidth}px wide)`).join('; ')}` : 'No horizontal overflow at 390px.');

// Contrast + tap target totals.
const totalContrast = results.filter(ok).reduce((s, r) => s + r.contrast.failureCount, 0);
const totalChecked = results.filter(ok).reduce((s, r) => s + r.contrast.checked, 0);
const overImage = results.filter(ok).reduce((s, r) => s + (r.contrast.checkedOverBackgroundImage || 0), 0);
findings.push(
  `**Contrast:** ${totalContrast} failing text element(s) out of ${totalChecked} checked across all runs. ${overImage} of the checked elements sit over a CSS background image or gradient; check those visually in the screenshots.`,
);
const mobileTap = results.filter((r) => ok(r) && r.viewport === 'mobile');
const tapTotal = mobileTap.reduce((s, r) => s + r.smallTapTargets.length, 0);
const tapNonInline = mobileTap.reduce((s, r) => s + r.smallTapTargets.filter((t) => t.display !== 'inline').length, 0);
findings.push(`**Tap targets under 44x44 on mobile:** ${tapTotal} total, ${tapNonInline} of them non-inline (buttons, block links, controls). Inline text links are usually exempt under WCAG 2.5.8.`);

out(...findings.map((f) => `- ${f}`), '');

if (heavy.length) {
  out('### Heaviest requests (desktop runs, largest first)', '');
  out(table(['Resource', 'Type', 'Size', 'First seen on'], heavy.map((q) => [shortUrl(q.url), q.type, fmtBytes(q.bytes), q.page])), '');
}

// ---------- Per-page detail
out('## Page details', '');
for (const p of pages) {
  const d = get(p.path, 'desktop');
  const m = get(p.path, 'mobile');
  out(`### ${p.path} (\`${p.slug}\`)`, '');
  for (const r of [d, m]) if (r && r.error) out(`> **${r.viewport} run failed:** ${r.error}`, '');
  const base = ok(d) ? d : ok(m) ? m : null;
  if (!base) continue;

  const meta = base.meta;
  out(
    `- HTTP status: ${base.status}${base.finalUrl && base.finalUrl !== base.url ? ` (final URL ${base.finalUrl})` : ''}`,
    `- Title: ${meta.title ?? '—'}`,
    `- Description: ${meta.description ?? '—'}`,
    `- Canonical: ${meta.canonical ?? '—'} · lang: ${meta.lang ?? '—'}`,
    `- Open Graph: ${Object.keys(meta.og).length ? Object.entries(meta.og).map(([k, v]) => `\`${k}\`=${shortUrl(v)}`).join(', ') : 'none'}`,
    `- Twitter: ${Object.keys(meta.twitter).length ? Object.entries(meta.twitter).map(([k, v]) => `\`${k}\`=${shortUrl(v)}`).join(', ') : 'none'}`,
    `- Document height: desktop ${ok(d) ? d.documentHeight : '—'}px, mobile ${ok(m) ? m.documentHeight : '—'}px`,
    `- Network: desktop ${ok(d) ? `${d.network.requestCount} requests / ${fmtBytes(d.network.totalBytes)}` : '—'}, mobile ${ok(m) ? `${m.network.requestCount} requests / ${fmtBytes(m.network.totalBytes)}` : '—'}`,
    `- Screenshots: ${[d, m].filter((r) => r && r.screenshot).map((r) => `\`${path.basename(r.screenshot.file)}\`${r.screenshot.clipped ? ' (clipped)' : ''}`).join(', ') || '—'}`,
    '',
  );

  // Headings
  out('**Heading outline**', '');
  if (base.headings.length) {
    out(...base.headings.map((h) => `${'  '.repeat(Number(h.tag[1]) - 1)}- ${h.tag}: ${h.text || '(empty)'}${h.visible ? '' : ' _(hidden)_'}`));
    if (ok(d) && ok(m) && JSON.stringify(d.headings.map((h) => h.text)) !== JSON.stringify(m.headings.map((h) => h.text))) {
      out('', '_Mobile heading outline differs from desktop._');
    }
  } else out('_No headings._');
  out('');

  // Element counts + text counts side by side
  const counts = Object.keys(base.selectorCounts).map((sel) => [`\`${sel}\``, ok(d) ? d.selectorCounts[sel] : '—', ok(m) ? m.selectorCounts[sel] : '—']);
  counts.push(['boxes', ok(d) ? d.boxes.count : '—', ok(m) ? m.boxes.count : '—']);
  out('**Element counts**', '', table(['Selector', 'Desktop', 'Mobile'], counts), '');
  const topBoxes = (ok(d) ? d : m).boxes.top;
  if (topBoxes.length) out(`Box elements (desktop): ${topBoxes.map((b) => `\`${b.selector}\` ×${b.count}`).join(', ')}`, '');

  out(
    '**Body text term counts** (whole word / substring, case-insensitive)',
    '',
    table(
      ['Term', 'Desktop', 'Mobile'],
      Object.keys(base.textCounts).map((t) => [
        `"${t}"`,
        ok(d) ? `${d.textCounts[t].wholeWord} / ${d.textCounts[t].substring}` : '—',
        ok(m) ? `${m.textCounts[t].wholeWord} / ${m.textCounts[t].substring}` : '—',
      ]),
    ),
    '',
  );

  // Images
  if (base.images.length) {
    const rows = base.images.map((img, i) => {
      const mi = ok(m) ? m.images[i] : null;
      return [
        shortUrl(img.currentSrc || img.src),
        `${img.naturalWidth}x${img.naturalHeight}`,
        ok(d) ? `${d.images[i]?.renderedWidth}x${d.images[i]?.renderedHeight}` : '—',
        mi ? `${mi.renderedWidth}x${mi.renderedHeight}` : '—',
        img.loading || '',
        img.alt === null ? '**missing**' : img.alt === '' ? '(empty, decorative)' : img.alt,
      ];
    });
    out('**Images**', '', table(['Image (currentSrc)', 'Natural', 'Rendered desktop', 'Rendered mobile', 'loading', 'alt'], rows), '');
  } else out('**Images:** none', '');

  // Largest requests
  const reqs = (ok(d) ? d : m).network.requests.filter((q) => typeof q.bytes === 'number' || q.pending).sort((a, b) => (b.bytes ?? 0) - (a.bytes ?? 0)).slice(0, 6);
  if (reqs.length) {
    out(
      `**Largest requests (${ok(d) ? 'desktop' : 'mobile'})**`,
      '',
      table(['Resource', 'Type', 'Status', 'Size'], reqs.map((q) => [shortUrl(q.url), q.type, q.status, q.pending ? 'pending' : fmtBytes(q.bytes)])),
      '',
    );
  }

  // Tap targets
  if (ok(m)) {
    if (m.smallTapTargets.length) {
      out(
        `**Tap targets under 44x44 (mobile): ${m.smallTapTargets.length}**`,
        '',
        table(['Text', 'Tag', 'Size (CSS px)', 'Display', 'href'], m.smallTapTargets.map((t) => [t.text ?? '(no text)', t.tag, `${t.width}x${t.height}`, t.display, t.href ?? ''])),
        '',
      );
    } else out('**Tap targets under 44x44 (mobile):** none', '');
  }

  // Contrast
  for (const r of [d, m].filter(ok)) {
    const c = r.contrast;
    if (!c.failureCount) {
      out(`**Contrast (${r.viewport}):** 0 failures of ${c.checked} text elements checked${c.checkedOverBackgroundImage ? ` (${c.checkedOverBackgroundImage} over a background image/gradient)` : ''}.`, '');
      continue;
    }
    const groups = new Map();
    for (const f of c.failures) {
      const k = `${f.color}|${f.background}|${f.threshold}`;
      const g = groups.get(k) || { ...f, n: 0, samples: [] };
      g.n++;
      if (g.samples.length < 3) g.samples.push(`"${f.text}"`);
      groups.set(k, g);
    }
    out(
      `**Contrast failures (${r.viewport}): ${c.failureCount} of ${c.checked}**`,
      '',
      table(
        ['Color', 'Background', 'Ratio', 'Needs', 'Count', 'Bg image?', 'Examples'],
        [...groups.values()].sort((a, b) => a.ratio - b.ratio).map((g) => [g.color, g.background, g.ratio, g.threshold, g.n, yesNo(g.backgroundImageInvolved), g.samples.join(', ')]),
      ),
      '',
    );
  }

  // TODO
  if (base.todo.count) out(`**Visible TODO text (${base.todo.count}):**`, '', ...base.todo.items.map((t) => `- \`${t.element}\`: ${t.text}`), '');
}

await writeFile(OUT, `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`);
console.log(`Wrote ${OUT}`);
