// Audit https://pinkrynostudios.com with playwright-core + system Chrome.
// Usage: OUTDIR=/path/to/screenshots node audit.mjs
import { chromium } from 'playwright-core';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://pinkrynostudios.com';
const CHROME_PATH = '/usr/bin/google-chrome';
const OUTDIR = path.resolve(process.env.OUTDIR || './screenshots');
const RESULTS_FILE = path.join(HERE, 'results.json');
const TIMEOUT_MS = 45_000;
const MAX_SHOT_HEIGHT = 6000;

const PAGES = [
  { path: '/', slug: 'home' },
  { path: '/games/', slug: 'games' },
  { path: '/games/tiny-trails-space/', slug: 'tiny-trails-space', game: true },
  { path: '/about/', slug: 'about' },
  { path: '/support/', slug: 'support' },
  { path: '/privacy/', slug: 'privacy' },
  { path: '/404-check-does-not-exist/', slug: '404' },
  { path: '/games/tiny-trails-beta/', slug: 'tiny-trails-beta', game: true },
];

const VIEWPORTS = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];

const SELECTORS = ['.card', '.frame', '.art-slot', '.chip', 'details', 'aside', '.review-note', '.spotlight', '.short-version', '.facts > div'];
const TEXT_TERMS = ['ads', 'tracking', 'privacy', 'sign up', 'nothing to sign up'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function withTimeout(promise, ms, label) {
  let timer;
  const t = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, t]).finally(() => clearTimeout(timer));
}

// Collects per-request data from CDP Network events.
function attachNetworkRecorder(cdp) {
  const byId = new Map();
  const entries = [];

  cdp.on('Network.requestWillBeSent', (e) => {
    const prev = byId.get(e.requestId);
    if (prev && e.redirectResponse) {
      // Same requestId is reused for redirect hops; close out the previous hop.
      prev.status = e.redirectResponse.status;
      prev.bytes = e.redirectResponse.encodedDataLength ?? null;
      prev.redirect = true;
      prev.finished = true;
    }
    const entry = {
      url: e.request.url,
      type: e.type || 'Other',
      bytes: null,
      status: null,
      mimeType: null,
      finished: false,
    };
    byId.set(e.requestId, entry);
    entries.push(entry);
  });
  cdp.on('Network.responseReceived', (e) => {
    const entry = byId.get(e.requestId);
    if (!entry) return;
    entry.status = e.response.status;
    entry.mimeType = e.response.mimeType;
    if (e.type) entry.type = e.type;
  });
  cdp.on('Network.loadingFinished', (e) => {
    const entry = byId.get(e.requestId);
    if (!entry) return;
    entry.bytes = e.encodedDataLength;
    entry.finished = true;
  });
  cdp.on('Network.loadingFailed', (e) => {
    const entry = byId.get(e.requestId);
    if (!entry) return;
    entry.failed = e.canceled ? 'canceled' : e.errorText;
    entry.finished = true;
  });

  return {
    snapshot() {
      const requests = entries.map(({ finished, ...rest }) => (finished ? rest : { ...rest, pending: true }));
      // Total transferred = sum of Network.loadingFinished encodedDataLength (redirect hops excluded).
      const totalBytes = entries.reduce((sum, r) => sum + (!r.redirect && r.finished && typeof r.bytes === 'number' ? r.bytes : 0), 0);
      return { requestCount: requests.length, totalBytes, requests };
    },
  };
}

// Runs inside the page. Must be self-contained.
function collectPageData({ selectors, textTerms, isMobile }) {
  const clean = (s, max = 120) => {
    const t = (s || '').replace(/\s+/g, ' ').trim();
    return t.length > max ? `${t.slice(0, max - 1)}…` : t;
  };
  const docEl = document.documentElement;
  const body = document.body;
  const docWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
  const docHeight = Math.max(docEl.scrollHeight, body ? body.scrollHeight : 0);

  const isVisible = (el) => {
    if (typeof el.checkVisibility === 'function' &&
        !el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) return false;
    const r = el.getBoundingClientRect();
    // <2px boxes are treated as visually hidden (sr-only patterns).
    if (r.width < 2 || r.height < 2) return false;
    const left = r.left + scrollX;
    const top = r.top + scrollY;
    if (left + r.width <= 0 || top + r.height <= 0 || left >= docWidth) return false;
    return true;
  };

  // Color parsing: fast path for rgb()/rgba(), canvas fallback for other color spaces.
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const colorCache = new Map();
  const parseColor = (str) => {
    if (colorCache.has(str)) return colorCache.get(str);
    let c = null;
    const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(str);
    if (m) {
      let a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      c = { r: +m[1], g: +m[2], b: +m[3], a };
    } else if (str === 'transparent') {
      c = { r: 0, g: 0, b: 0, a: 0 };
    } else {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = str;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      c = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    }
    colorCache.set(str, c);
    return c;
  };
  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const toCss = (c) => `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`;
  const luminance = (c) => {
    const ch = (v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
  };
  const contrastRatio = (a, b) => {
    const l1 = luminance(a);
    const l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const sameColor = (a, b) =>
    Math.round(a.r) === Math.round(b.r) && Math.round(a.g) === Math.round(b.g) &&
    Math.round(a.b) === Math.round(b.b) && Math.abs(a.a - b.a) < 0.01;

  const describe = (el) => {
    let d = el.tagName.toLowerCase();
    if (el.id) d += `#${el.id}`;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : [];
    if (cls.length) d += `.${cls.join('.')}`;
    return d;
  };

  // Effective background: composite semi-transparent layers up to the nearest opaque ancestor (white canvas fallback).
  const bgCache = new Map();
  const effectiveBackground = (el) => {
    if (bgCache.has(el)) return bgCache.get(el);
    const layers = [];
    let hasImage = false;
    let node = el;
    let opaque = false;
    while (node && node.nodeType === 1) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') hasImage = true;
      const c = parseColor(cs.backgroundColor);
      if (c.a > 0) layers.push(c);
      if (c.a >= 1) { opaque = true; break; }
      node = node.parentElement;
    }
    let result = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) result = layers[i].a >= 1 ? { ...layers[i] } : blend(layers[i], result);
    const out = { color: result, hasImage, opaque };
    bgCache.set(el, out);
    return out;
  };

  // --- Images
  const images = Array.from(document.images).map((img) => {
    const r = img.getBoundingClientRect();
    return {
      src: img.src || img.getAttribute('src') || null,
      currentSrc: img.currentSrc || null,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: Math.round(r.width * 10) / 10,
      renderedHeight: Math.round(r.height * 10) / 10,
      alt: img.getAttribute('alt'),
      loading: img.getAttribute('loading'),
      visible: isVisible(img),
    };
  });

  // --- Headings
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((h) => {
    const visible = isVisible(h);
    return { tag: h.tagName.toLowerCase(), text: clean(visible ? h.innerText : h.textContent, 200), visible };
  });

  // --- Meta
  const metaContent = (sel) => {
    const el = document.querySelector(sel);
    return el ? el.getAttribute('content') : null;
  };
  const og = {};
  const twitter = {};
  for (const m of document.querySelectorAll('meta[property], meta[name]')) {
    const key = (m.getAttribute('property') || m.getAttribute('name') || '').trim();
    const val = m.getAttribute('content');
    if (/^og:/i.test(key)) og[key] = val;
    else if (/^twitter:/i.test(key)) twitter[key] = val;
  }
  const canonicalEl = document.querySelector('link[rel~="canonical"]');
  const meta = {
    title: document.title || null,
    description: metaContent('meta[name="description" i]'),
    canonical: canonicalEl ? canonicalEl.getAttribute('href') : null,
    lang: docEl.getAttribute('lang'),
    og,
    twitter,
  };

  // --- Selector counts
  const selectorCounts = {};
  for (const sel of selectors) selectorCounts[sel] = document.querySelectorAll(sel).length;

  // --- Boxes
  const bodyCs = body ? getComputedStyle(body) : null;
  let bodyBg = bodyCs ? parseColor(bodyCs.backgroundColor) : { r: 0, g: 0, b: 0, a: 0 };
  if (bodyBg.a === 0) {
    const htmlBg = parseColor(getComputedStyle(docEl).backgroundColor);
    bodyBg = htmlBg.a > 0 ? htmlBg : { r: 255, g: 255, b: 255, a: 1 };
  }
  const radiusProps = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'];
  const sides = ['Top', 'Right', 'Bottom', 'Left'];
  let boxCount = 0;
  const boxDescriptors = new Map();
  const allEls = body ? Array.from(body.querySelectorAll('*')) : [];
  const visibleCache = new Map();
  const vis = (el) => {
    if (!visibleCache.has(el)) visibleCache.set(el, isVisible(el));
    return visibleCache.get(el);
  };
  for (const el of allEls) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    if (!radiusProps.some((p) => parseFloat(cs[p]) > 0)) continue;
    const hasBorder = sides.some((s) => {
      const style = cs[`border${s}Style`];
      return parseFloat(cs[`border${s}Width`]) > 0 && style !== 'none' && style !== 'hidden' && parseColor(cs[`border${s}Color`]).a > 0;
    });
    const bg = parseColor(cs.backgroundColor);
    const hasBg = bg.a > 0 && !sameColor(bg, bodyBg);
    if (!hasBorder && !hasBg) continue;
    boxCount++;
    const d = describe(el).replace(/#[^.]+/, '');
    boxDescriptors.set(d, (boxDescriptors.get(d) || 0) + 1);
  }
  const boxes = {
    count: boxCount,
    bodyBackground: toCss(bodyBg),
    top: Array.from(boxDescriptors.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([selector, count]) => ({ selector, count })),
  };

  // --- Tap targets (mobile only)
  let smallTapTargets = null;
  if (isMobile) {
    smallTapTargets = [];
    for (const el of document.querySelectorAll('a, button, summary, label, input')) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width >= 44 && r.height >= 44) continue;
      const imgAlt = el.querySelector('img[alt]') ? el.querySelector('img[alt]').getAttribute('alt') : '';
      const text = clean(el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.value || imgAlt || '', 60);
      smallTapTargets.push({
        tag: el.tagName.toLowerCase(),
        text: text || null,
        width: Math.round(r.width * 10) / 10,
        height: Math.round(r.height * 10) / 10,
        display: getComputedStyle(el).display,
        href: el.tagName === 'A' ? el.getAttribute('href') : undefined,
      });
    }
  }

  // --- Text term counts (body innerText)
  const bodyText = body ? body.innerText : '';
  const lower = bodyText.toLowerCase();
  const textCounts = {};
  for (const term of textTerms) {
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    textCounts[term] = {
      substring: lower.split(term).length - 1,
      wholeWord: (bodyText.match(new RegExp(`\\b${esc}\\b`, 'gi')) || []).length,
    };
  }

  // --- TODO in visible text
  const todoItems = [];
  if (body) {
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (!n.textContent.includes('TODO')) continue;
      const parent = n.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(parent.tagName) || !vis(parent)) continue;
      todoItems.push({ element: describe(parent), text: clean(n.textContent, 120) });
    }
  }

  // --- Contrast
  const contrastFailures = [];
  let contrastChecked = 0;
  let contrastSkippedTransparentText = 0;
  let contrastOverBackgroundImage = 0;
  for (const el of allEls) {
    if (el instanceof SVGElement || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    const direct = Array.from(el.childNodes).filter((c) => c.nodeType === 3 && c.textContent.trim()).map((c) => c.textContent).join(' ');
    if (!direct.trim() || !vis(el)) continue;
    const cs = getComputedStyle(el);
    const fgRaw = parseColor(cs.color);
    if (fgRaw.a === 0) { contrastSkippedTransparentText++; continue; }
    contrastChecked++;
    const bg = effectiveBackground(el);
    if (bg.hasImage) contrastOverBackgroundImage++;
    const fg = fgRaw.a < 1 ? blend(fgRaw, bg.color) : fgRaw;
    const ratio = contrastRatio(fg, bg.color);
    const fontSize = parseFloat(cs.fontSize);
    const fontWeight = parseInt(cs.fontWeight, 10) || (cs.fontWeight === 'bold' ? 700 : 400);
    const large = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
    const threshold = large ? 3 : 4.5;
    if (ratio < threshold) {
      contrastFailures.push({
        element: describe(el),
        text: clean(direct, 80),
        color: toCss(fg),
        background: toCss(bg.color),
        ratio: Math.round(ratio * 100) / 100,
        threshold,
        fontSize,
        fontWeight,
        backgroundImageInvolved: bg.hasImage,
      });
    }
  }

  return {
    documentHeight: docHeight,
    documentWidth: docWidth,
    images,
    headings,
    meta,
    selectorCounts,
    boxes,
    smallTapTargets,
    textCounts,
    todo: { count: todoItems.length, items: todoItems },
    contrast: {
      checked: contrastChecked,
      checkedOverBackgroundImage: contrastOverBackgroundImage,
      skippedTransparentText: contrastSkippedTransparentText,
      failureCount: contrastFailures.length,
      failures: contrastFailures,
    },
  };
}

async function auditPage(browser, pageDef, vp) {
  const url = new URL(pageDef.path, BASE_URL).href;
  const result = { path: pageDef.path, slug: pageDef.slug, viewport: vp.name, url, startedAt: new Date().toISOString() };
  const t0 = Date.now();
  // Fresh context per page+viewport so every measurement starts with a cold HTTP cache.
  const context = await browser.newContext({
    viewport: vp.viewport,
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
  });
  let recorder = null;
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(TIMEOUT_MS);
    page.setDefaultNavigationTimeout(TIMEOUT_MS);
    const cdp = await context.newCDPSession(page);
    recorder = attachNetworkRecorder(cdp);
    await cdp.send('Network.enable');

    const work = async () => {
      const response = await page.goto(url, { waitUntil: 'load', timeout: TIMEOUT_MS });
      result.status = response ? response.status() : null;
      result.finalUrl = page.url();
      result.loadMs = Date.now() - t0;
      await sleep(pageDef.game ? 2500 : 800);

      Object.assign(result, await page.evaluate(collectPageData, { selectors: SELECTORS, textTerms: TEXT_TERMS, isMobile: vp.isMobile }));
      result.network = recorder.snapshot();

      const file = path.join(OUTDIR, `${pageDef.slug}-${vp.name}.png`);
      const clipped = result.documentHeight > MAX_SHOT_HEIGHT;
      const shotOpts = { path: file, type: 'png', fullPage: true, timeout: TIMEOUT_MS };
      if (clipped) {
        shotOpts.clip = { x: 0, y: 0, width: Math.max(result.documentWidth, vp.viewport.width), height: MAX_SHOT_HEIGHT };
      }
      await page.screenshot(shotOpts);
      result.screenshot = { file, clipped, capturedHeightCss: clipped ? MAX_SHOT_HEIGHT : result.documentHeight };
    };
    // Hard cap so a hung evaluate/screenshot cannot stall the run (goto and screenshot also have their own 45s timeouts).
    await withTimeout(work(), TIMEOUT_MS * 2 + 5000, `${pageDef.path} [${vp.name}]`);
  } catch (err) {
    result.error = String(err && err.message ? err.message : err).split('\n')[0];
    if (recorder && !result.network) result.network = recorder.snapshot();
  } finally {
    result.durationMs = Date.now() - t0;
    await context.close().catch(() => {});
  }
  return result;
}

async function main() {
  await mkdir(OUTDIR, { recursive: true });
  const pwVersion = JSON.parse(await readFile(path.join(HERE, 'node_modules/playwright-core/package.json'), 'utf8')).version;
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    // Godot web exports need WebGL2; there is no GPU here, so allow the SwiftShader software renderer.
    args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
  });
  const results = [];
  try {
    for (const pageDef of PAGES) {
      for (const vp of VIEWPORTS) {
        const r = await auditPage(browser, pageDef, vp);
        results.push(r);
        const summary = r.error
          ? `ERROR ${r.error}`
          : `status=${r.status} reqs=${r.network.requestCount} bytes=${r.network.totalBytes} height=${r.documentHeight}${r.screenshot.clipped ? ' (clipped)' : ''}`;
        console.log(`${pageDef.path.padEnd(28)} ${vp.name.padEnd(8)} ${String(r.durationMs).padStart(6)}ms  ${summary}`);
      }
    }
  } finally {
    const out = {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      browser: { executablePath: CHROME_PATH, version: browser.version(), playwrightCore: pwVersion },
      outdir: OUTDIR,
      viewports: VIEWPORTS,
      selectors: SELECTORS,
      textTerms: TEXT_TERMS,
      results,
    };
    await writeFile(RESULTS_FILE, `${JSON.stringify(out, null, 2)}\n`);
    await browser.close().catch(() => {});
  }
  const failed = results.filter((r) => r.error).length;
  console.log(`\nWrote ${RESULTS_FILE} (${results.length} page/viewport runs, ${failed} errors). Screenshots in ${OUTDIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
