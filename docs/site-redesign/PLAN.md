# pinkrynostudios.com redesign plan (cycle 1)

Status: proposal for the Studio Director. Nothing here is live. Work happens on the `site-redesign` branch, and nothing goes to `main` without Director approval of a preview. Read with [AUDIT.md](AUDIT.md).

## Goals

1. **Look store-grade.** It should feel like a finished studio site a parent would trust on day one: no TODOs, no placeholders, no copy about the site itself.
2. **One cosmic sticker world.** The same deep-plum-outlined, flat cel-shaded cosmic candy style as the game art, from the header to the footer.
3. **Fewer boxes.** Use open layouts, art cut out on the background, and type and spacing for structure. Aim for **no more than 2 framed elements per viewport**.
4. **Answer a parent's questions in 30 seconds:** What is it? Is it right for my 3–6-year-old? What's free and what does it cost? Is it safe? How do I get it?
5. **Light and fast.** Home page **≤ 250 KB** cold (down from 1.59 MB), plain static HTML/CSS, with JS only for the parental gate and menu.

## Non-negotiables (owner preferences)

- **Rosie Ryno stays** as the studio mascot and the face of the site.
- **No box around Rosie:** no frame, card, circle, blob, or tinted panel behind her. She stands directly on the page background.
- **No stars attached to Rosie or her animation.** Delete `SPARK` from `render-site.mjs` and the `.spark` / `floaty` CSS. The only stars are a **slow-floating background star field** behind the whole hero, not tied to her position.
- **No-tracking/privacy is mentioned once** in site marketing copy: a single line in the footer, "No ads. No tracking. No accounts. Privacy policy". Remove it from the Home body, About, the game page facts, and the game meta description. The Privacy page itself is the policy, and the Support FAQ links to it without repeating the pitch.
- **Clean, warm, polished, and kid-and-parent friendly.** Copy is written for the parent, and the art is for the kid.
- Plain static HTML/CSS, no third-party anything (fonts, analytics, embeds, ads), and the CSP stays strict.
- `/games/space-maze/` and `/games/tiny-trails-beta/` keep working exactly as they are (we don't edit those folders). The beta stays unlisted, out of the sitemap, and disallowed in robots.txt.

## Site structure

```
/                         Home: hero (Rosie + background stars), the game, parent facts, studio line
/games/tiny-trails-space/ Game page: hero art, how it plays, screenshots, free vs unlock, play/store
/games/                   Kept as a URL (for future themes). Reworked as a gallery; with 1 game it can
                          redirect visually to the game (light list, no placeholder card)
/about/                   The studio: who, why, how we make games (short), Rosie intro
/support/                 Help for grown-ups: email (gated) + FAQ
/privacy/                 Policy (legal page, plain), no TODO banner once owner details are filled
/404.html                 Puzzled Rosie, two links
/games/space-maze/        UNCHANGED (live browser build)
/games/tiny-trails-beta/  UNCHANGED (unlisted staging)
```

**Navigation:** keep `Games · About · Support` (text links, no pill highlight; the current page gets an underline). On mobile, use a plain "Menu" text button with no outline that opens a full-width sheet. **Footer:** Rosie head, the tagline, the links Games · About · Support · Privacy, the one privacy line, "Made with care in Florida", and ©.

**Play in browser:** keep linking to `/games/space-maze/`, but first show an interstitial on the game page, a short inline note under the button: "Plays right in your browser · about 24 MB, best on Wi-Fi". We can't add a back link inside the export because that folder is off limits. If the Director wants one later, it's a separate task in the game build.

## Page-by-page outline

### Home `/`

1. **Hero (deep-space band).** A full-bleed navy-violet (`#241B45`) band with a slow-floating background star field (CSS-only, 2–3 layers of tiny dots and four-point twinkles drifting at 60–120 s per cycle, paused under `prefers-reduced-motion`). A soft planet horizon curve at the bottom transitions into the light page.
   - Left: H1 **"Calm little adventures for ages 3–6."** One line: "Trace a glowing path, meet a friendly star, and play at your child's pace." One primary button, **Play Tiny Trails** (to the game page), and one text link, **For grown-ups ↓** (anchors to the facts).
   - Right: **Rosie, waving**, on the band with no frame, sparkles, or blob. A gentle 4–6 s bob is allowed. Her shadow is a flat plum ellipse in sticker style, not an airbrush.
   - Mobile: Rosie goes *above* the H1 at about 220 px tall, so the H1 and button stay in the first screen.
2. **The game.** No card. The Tiny Trails key art is cut out and sits on the page. Next to it are the title, tagline, "Ages 3–6 · Free to start · One-time unlock", the button, and "Coming soon to iPhone, iPad and Android." Plain text, no chips.
3. **For grown-ups.** Three short facts in a row with small sticker icons (outlined, no tinted circles): *Free to start* (Sun, Earth, Moon worlds and two explorers), *One payment, no subscription* (unlock all 10 worlds), *Made for small hands* (big targets, no reading needed, no timers). No privacy line here.
4. **Studio line.** A small Rosie head with "PinkRyno Studios is a tiny studio in Florida making calm games for little kids." and a link to About.
5. Footer.

Target: 4 sections, 0 cards, 1 primary button above the fold, ≤ 250 KB.

### Tiny Trails: Space `/games/tiny-trails-space/`

1. Breadcrumb ("Games / Tiny Trails: Space") in small text.
2. Hero: cut-out key art plus the H1, tagline, age line, the **Play in browser** button with its size note, and the store line. Store badges render here once `stores.ios` / `stores.android` are set.
3. **Screenshots strip.** Three real in-game captures (16:10 or device-shaped) in a horizontal row that scrolls on mobile. These are the *only* framed images on the site, with a rounded corner and a plum outline like the sticker art. Until real captures exist, the section **is omitted** rather than showing placeholders.
4. **How it plays.** Four short lines with small sticker icons (trace, worlds, explorers, replay).
5. **What's free / what the unlock adds.** Two columns, plain text, with the price once known ("$X.XX once").
6. **Questions?** A link to Support.
7. JSON-LD `VideoGame` / `SoftwareApplication` (name, ages 3–6, platform: Web, iOS and Android when live, offers: free plus an in-app purchase), and a per-game OG image.

### Games `/games/`

- With one game: H1 "Games", a short line, then a single wide row with the TT card art, title, tagline, and link. No chips, and no placeholder frame. When there are 2+ games, it becomes an open grid of cut-out card art (still no boxed cards). The game's `accent` color is used as a thin underline under the title, not as a card stripe.

### About `/about/`

- H1 "Hi from PinkRyno Studios" with Rosie (a sitting or hugging-a-planet pose, no stars).
- Three short paragraphs: who we are (a tiny studio in Florida, the person behind it if the owner wants that), why calm games for ages 3–6, and how we make them (short sessions, no timers, nothing to read, a one-time unlock). Remove the placeholder section and the "support is the door" line.
- The ABOUT-SCENE illustration, full-width and cut out (no frame), only once delivered. Omit it until then.

### Support `/support/`

- H1 "Help for grown-ups". One line plus the email as a single gated button ("Email support"), with the address shown once in plain text below for copying.
- FAQ: keep `details`, restyled as open rows with a thin divider and no boxes. Questions: restore purchases, deleting data, playing in the browser, something went wrong, and **the parental gate** (one line). Rosie appears as a small head beside the H1, not a full-screen portrait.
- Remove the TODO banner (see Owner inputs below).

### Privacy `/privacy/`

- Keep the policy text. It's good and specific. Remove the TODO banner and replace the placeholder sentence with the legal name and mailing address once the owner provides them. Drop the "short version" box and make it the first paragraph. The TOC becomes a simple two-column list on desktop. No mascot.
- This is the one page that talks about privacy in depth. It's linked from the single footer line and from the store listings.

### 404

- MASCOT-LOST Rosie (puzzled), "This page floated off", and two text links. No stars around her.

## Visual direction

- **Palette:** keep the tokens and use them with more contrast.
  - Ink / outline `#2B1E4A`, space `#241B45` (hero band and footer), page `#FBF8FF` (warmer and flatter than the current gradient wash).
  - Cosmic candy accents: lavender `#E4DBFF`, peach `#FFD0BE`, mint `#C8F6EA`, butter `#FFE7A3`, sky teal `#C9F6F4`. They're used for **art and small icons**, not as panel fills.
  - One action color: berry `#B5176A` for the primary button (white text, 6.4:1), and link `#4C3FB8`.
  - Remove the four-corner radial gradients from `body`.
- **Type:** Baloo 2 800 for headings (already self-hosted) and Nunito 400/700 for body. Body is 18 px on desktop and 17 px on mobile, with a 60–70 character measure. Headings are sentence case, with no eyebrow pills.
- **Shapes:** the sticker look comes from the *art* (plum outline, flat two-tone, one soft offset shadow). UI stays quiet:
  - The primary button is a solid berry pill with a 3 px plum outline and the offset sticker shadow. It's the one "sticker" UI element.
  - Secondary actions are text links with an arrow, not outlined pills.
  - No chips. Age, price, and status are plain text separated by middots.
  - Section separators are a single soft planet-horizon curve (SVG, about 1 KB), used at most twice per page.
- **Background stars:** a CSS-only star field (`radial-gradient` dots on 2–3 pseudo-element layers, `translateY` drift at 90 s and 140 s, plus 4–6 small four-point twinkle SVG sprites drifting slowly across the band). They live on the hero band's background, at fixed positions relative to the band, never inside `.mascot-stage`, and under `prefers-reduced-motion` they're static.
- **Rosie's motion:** prefer a CSS bob on a crisp still image over the 1.35 MB animated WebP. If the owner wants the wave kept, replace it with a short sprite loop (6–8 frames) at 2× resolution, or an AVIF/WebM loop of 150 KB or less, with no stars baked in (see the art list).
- **Photography and screens:** real game captures only. Don't use mockups that misrepresent the game. If the live browser build stays pixel art while the store build is sticker art, show the store build's screens and label the browser version honestly. *Director decision needed:* which build is "Tiny Trails: Space" for the site?

## Art needed from the Art Director

All art should match the style anchor in [`docs/art-requests.md`](../art-requests.md): deep plum `#2B1E4A` outlines, flat two-tone cel shading, one soft violet drop shadow down-right, and the cosmic candy palette. Deliver **transparent PNG masters at 2× the listed size** and I'll export WebP/AVIF. Nothing should have stars, sparkles, or text baked into a Rosie asset.

| ID | What | Deliver (master) | Site export | Used on |
| --- | --- | --- | --- | --- |
| ROSIE-WAVE | Rosie waving, full body, **re-drawn in the flat sticker style** (plum outline, flat cel shading), no ground shadow, no stars | PNG transparent, 1000×1300 | WebP 500×650 @1×, 1000×1300 @2×, ≤ 60 KB each | Home hero |
| ROSIE-WAVE-LOOP (optional) | 6–8-frame wave cycle of the same pose, frames on a sprite sheet, no stars | PNG sprite sheet, 8 × 1000×1300 | WebP sprite ≤ 150 KB, or AVIF/WebM ≤ 150 KB | Home hero (motion) |
| ROSIE-SIT | Rosie sitting, hugging a small lavender planet | PNG transparent, 1000×1000 | WebP 480/960, ≤ 50 KB | About |
| ROSIE-HEAD | Head-only portrait, sticker style, front-facing, smiling | PNG transparent, 512×512 | WebP 64/128, favicon 32/48 PNG, apple-touch 180 PNG, SVG if possible | Header, footer, favicon |
| ROSIE-HELP | Rosie head and shoulders, small friendly "hi" gesture | PNG transparent, 600×600 | WebP 160/320 | Support H1 |
| MASCOT-LOST | Puzzled Rosie, one hoof raised, no stars | PNG transparent, 1000×1000 | WebP 400/800 | 404 |
| TWINKLE-SET | 3 four-point twinkles and 3 tiny dot stars, plum outline, butter, peach and lavender fills, as separate shapes | **SVG** (single path each, no gradients) | inline SVG ≤ 1 KB total | Background star field only |
| PLANET-HORIZON | Soft curved planet edge (lavender with mint craters) for the hero bottom | **SVG**, 1440×120 viewBox | inline SVG ≤ 2 KB | Hero → page transition |
| ICON-SET | 7 small sticker icons: trace finger, planet, explorer helmet, replay arrow, gift (free), key (unlock), small hand | **SVG**, 64×64 viewBox, plum outline | inline SVG | Home facts, game page |
| TT-CARD | Already listed in `art-requests.md` | PNG 2560×1600 | WebP 1280×800 / 640×400 | Games index |
| TT-SCREENS ×3 | **Real captures from the sticker build** (trace, world select, star at the end), not illustrations | PNG 2400×1500 (16:10) or device-native | WebP 1200×750 / 600×375, ≤ 80 KB each | Game page strip |
| ABOUT-SCENE | Already listed: Rosie with a small planet and an astronaut, cut out (no background panel) | PNG transparent, 3200×1800 | WebP 1600×900 / 800×450 | About |
| OG-HOME | Share card: Rosie waving on deep space with the wordmark "PinkRyno Studios" and room for no other text | PNG 1200×630 | **PNG or JPEG** ≤ 200 KB | OG for site pages |
| OG-TINY-TRAILS | Share card: TT key art plus the title "Tiny Trails: Space" | PNG 1200×630 | PNG or JPEG ≤ 200 KB | OG for the game page |
| WORDMARK (optional) | "PinkRyno Studios" lettering in Baloo-like hand style, plum outline | **SVG** | inline SVG ≤ 4 KB | Header and footer |
| STORE-BADGES | Official Apple / Google badges (from their brand kits, unmodified) | SVG | SVG | Game page when live |

Priority for cycle 2: ROSIE-WAVE, ROSIE-HEAD, TWINKLE-SET, ICON-SET, MASCOT-LOST, OG-HOME. The TT screenshots depend on the build decision.

## Performance budget

| Metric | Budget | Today (home) |
| --- | --- | --- |
| Home page, cold transfer | **≤ 250 KB** | 1.59 MB |
| Any content page | ≤ 200 KB | 99–242 KB |
| Requests per page | ≤ 12 | 9–11 |
| Largest image | ≤ 80 KB (hero ≤ 60 KB @2×) | 1.35 MB |
| CSS | ≤ 20 KB raw, single file, ≤ 6 KB gzip | 19.4 KB + themes |
| JS | ≤ 5 KB, no framework, gate + menu only | 4.4 KB |
| Fonts | ≤ 3 woff2, ≤ 55 KB total, `font-display: swap`, only display font preloaded | 51 KB |
| LCP (Lighthouse mobile) | ≤ 1.5 s | 1.2 s |
| CLS | 0 | 0 |
| Lighthouse | 100 / 100 / 100 / 100 | 100 / 100 / 96 / 100 |

Techniques: `<picture>` with `srcset` at 1×/2× (AVIF then WebP, then a PNG fallback), explicit `width`/`height`, `fetchpriority="high"` only on the hero, and `loading="lazy"` below the fold. The star field is CSS, not images. Inline SVG is used for icons and separators. Remove the unused files from the repo: root `pinkrynostudios-mascot.png` and `pinkrynostudios-head.png`, `assets/images/bubbles-*`, and the old rhino. They're not linked, so this is only repo hygiene, not page weight.

## Accessibility goals

- **WCAG 2.2 AA** across all generated pages.
- Text sits on solid fills only (no gradient washes behind body copy), with 4.5:1 for body and 3:1 for large text and UI. White on berry is 6.4:1, `#FBF8FF` on navy is about 15:1, and plum on page is about 14:1.
- One `h1` per page and no skipped levels. Move the gate dialog's heading out of the static outline (render the `h2` only when it's opened, or use `aria-labelledby` on a non-heading).
- No placeholder art announced to assistive tech. Missing art means the section is omitted.
- Tap targets are ≥ 44×44 for all buttons and nav, and inline links have generous line-height. Focus rings stay visible (`3px` plum plus offset).
- Motion: the background stars and Rosie's bob stop under `prefers-reduced-motion: reduce`. No motion is faster than 4 s per cycle, and nothing flashes.
- Alt text: Rosie gets a short, page-specific alt ("Rosie Ryno waving hello"). Decorative heads, twinkles, and icons use `alt=""` or `aria-hidden`.
- Keyboard: the menu works without JS (the existing checkbox pattern) and the gate traps focus while open.
- Verify with Lighthouse, axe (run locally, not shipped), and a VoiceOver pass on iOS Safari.

## SEO and sharing

- Per-page titles and descriptions, written for parents ("Tiny Trails: Space, a calm tracing game for ages 3–6").
- OG images in PNG/JPEG: OG-HOME for site pages, and OG-TINY-TRAILS (from `games.json` `art.og`) for the game page.
- JSON-LD: Organization (existing), plus `VideoGame` on game pages.
- `sitemap.xml` lastmod comes from the render date (or git), not a constant. Robots and the beta exclusion stay unchanged.

## Fit with the static generator

Keep the current model: **`games.json` + `site.json` → `node scripts/render-site.mjs` → committed HTML.** No new dependencies and no build step on Pages.

Changes to `render-site.mjs` (cycle 2, on this branch):

1. **Remove `SPARK`** and its use in `mascotStage()`. Add a `starField()` partial used only in the hero band.
2. **Remove `reviewNote()`** output. Owner details move to `site.json` (`studio.legalName`, `studio.address`, `studio.supportEmail`), and the privacy page renders them. If they're missing, the script **fails** (`must()`), so the TODO can't ship.
3. **`media()` omits missing art** instead of rendering an art slot (behind a `--preview-slots` flag for local art reviews only).
4. A new **`site.json` `mascot.poses`** map (wave, sit, help, lost, head) with 1×/2× sources, so each page picks a pose.
5. **`games.json` additions:** `price` (string or null), `size_note` (for example "about 24 MB"), `art.og`, `art.screens` with real captures, and `platforms`. Drop `art_slots` from page output.
6. A single privacy line in the footer from `site.json` `privacyLine`. Strip privacy phrases from `description` / `facts`.
7. Card markup becomes "open" rows (`.game-row`) instead of `.card`/`.chip`, and `themes.css` keeps generating the accent as a title underline.
8. CSS rewrite: one `site.css` (about 15 KB) with tokens, layout, hero band, star field, buttons, prose, and FAQ rows. Remove the chip, frame, art-slot, spark, review-note, and short-version styles.
9. Don't touch `games/space-maze/`, `games/tiny-trails-beta/`, or `CNAME`. Keep `RESERVED` as is.

## Rollout

1. **Cycle 2:** build on `site-redesign` with the current art (the hero falls back to the existing still Rosie until ROSIE-WAVE lands), then share a branch preview (run `npx serve` locally and send screenshots, or the Director's preferred preview method) for approval.
2. Swap in the Art Director's assets as they land, re-run the generator, and re-run `tools/audit.mjs` against the preview to check the budget and the boxes count.
3. The Director approves and the owner merges. I won't merge or push to `main`.

## Decisions needed from the Director or owner

1. **Legal name and mailing address** for the Privacy page, and confirmation of `support@pinkrynostudios.com`. Both are required before launch, since the generator will refuse to render without them.
2. **Price** of the one-time unlock (or keep it "one-time unlock" without a figure).
3. **Which build is "Tiny Trails: Space"** on the site: the pixel-art `/games/space-maze/` or the sticker-style build now in beta. This affects screenshots and the Play button target. Any change to which folder is served is a separate, Director-approved step.
4. **Rosie's motion:** a still image plus a gentle CSS bob (lightest), or a redrawn short wave loop (≤ 150 KB).
5. Whether to keep `/games/` in the nav while there's only one game.
