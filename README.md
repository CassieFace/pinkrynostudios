# PinkRyno Studios

Static website for [pinkrynostudios.com](https://pinkrynostudios.com). GitHub Pages serves the files in this repository. There is no build step on Pages and no change to Pages settings. The pages are generated locally and committed.

The old browser build at `games/space-maze/` (about 52 MB) was removed on October 28, 2026, with Cassie's approval. Its URL, `/games/space-maze/`, now returns the 404 page. No generated page links any browser build (see [Add a new game](#add-a-new-game), step 7). The `Disallow: /games/space-maze/` rule is gone from `robots.txt`, so crawlers fetch the URL, see the 404, and drop it. `robots.txt` keeps only `Disallow: /games/tiny-trails-beta/` and the `Sitemap` line. `scripts/render-site.mjs` still treats `space-maze` as a reserved path and refuses to write under `games/space-maze/`, so a new game cannot reuse the old URL by accident. Do not edit `games/tiny-trails-beta/` or `CNAME` from the website work.

## Brand: Meadow Path (Oct 28 2026)

The site uses the approved PinkRyno brand, Direction A "Meadow Path" (approved by Cassie on October 28, 2026). The brand files are in the brand handoff folder (`brand/final/`: `brand-guide.md`, `tokens/README.md`).

- **Studio frame vs game hero.** Every page has the same studio frame: the studio logo (`site.json` `art.headerLogo`, see [Swapping the studio logo](#swapping-the-studio-logo)) as the home link beside the nav, the trust strip "No ads · No tracking · No accounts" on one Sky Wash pill, and the sage hill footer with the logo's small variant and the tagline. Studio pages (home, games, about, support, privacy, 404) are Oat Cream, Deep Moss text, Berry links, and Moss Button buttons, with no navy, stars, planets, or Space art. Home and 404 open on the Morning Meadow: a CSS wash and inline SVG hills, with no bitmap. A game brings its own world inside its page hero only: `games.json` `world` names a `.world-<name>` rule in `site.css` (Tiny Trails: Space has `"world": "space"`, a navy night sky with the Space art, its title lockup, and a Butter button). Below the hero the page is the studio look again. Studio pages show a game by its series wordmark (`art.wordmark`).
- **One trail.** The site has exactly one trail, the sand trail in the home hero (Cassie's art direction, October 29, 2026): a 26 px sand band (`--color-trail-sand`, `#EDE4C8`) with a dashed Oat Cream centre line, drawn as inline SVG (`TRAIL` in `scripts/render-site.mjs`). It comes in off the hero's left edge, winds through the hills below the text, passes just behind Rosie's feet (she stands on the meadow in front of it), and runs on off the hero's right edge, so it reads as a path that keeps going. Its drawing follows the content column that places Rosie, and it runs past both ends of the column, so it reaches both hero edges at every width; the hero cuts it off there. A wide drawing serves the side-by-side hero and a narrow one the stacked hero (960 px and narrower). No other page draws a trail or path, and nothing is drawn under Rosie anywhere: the 404 meadow, About, Support, the games pages, and the home "Meet Rosie" section have none. The sticker logo (`art.headerLogo.desktop`, the desktop header) and the `og-studio.jpg` share card (made from the sticker horizontal lockup) show Rosie on her own small sage path. That is the approved logo art, separate from the page decoration. The small flat logo (`art.headerLogo.small`, the phone header and the footer) shows Rosie's head in a Sky Wash disc. The brand tokens keep the small-trail values (`--trail-band-color-small` and the rest) because `site.css` copies `assets/brand/tokens.css` verbatim; no rule uses them.
- **Fonts.** Fredoka 600 (headlines) and Nunito 400, 700, and 800 (body, links, and the UI weight for buttons, nav, and pills), self-hosted in `assets/fonts/` with `font-display: swap`. `fredoka-latin-600.woff2` and `nunito-latin-800.woff2` are latin subsets made with fontTools (see `assets/fonts/NOTICE.txt`). Each page preloads only Fredoka 600 and Nunito 400. Baloo 2 is not a site font: it lives only in the Tiny Trails title art.
- **Icons and manifest.** `/favicon.ico` (16, 32, 48 px; the 16 px frame is the Deep Moss "P" tile), `/favicon-32.png`, `/apple-touch-icon-180.png`, and `/site.webmanifest` with `/icon-192.png`, `/icon-512.png`, and `/icon-maskable-512.png`, all at the site root and copied from the brand kit. `theme-color` is `#FFF9EE`. `favicon.svg` is left out on purpose (106 KB, and 1x tabs keep the crisp "P" tile).
- **Tokens.** `assets/brand/tokens.css` is an unmodified copy of the brand's `tokens/tokens.css` (Final R3: each property declared once, with no self-referencing aliases). `assets/css/site.css` starts with a verbatim copy of its rules, so each page loads one stylesheet, and the build stops if the copy drifts. In `tokens.json`, the supporting colours (`surface`, `text-muted`, `button-shadow`, and the rest) are `color.support.*`; `color.semantic.surface`, `color.semantic.text-muted`, and `color.semantic.button-shadow` are gone. Nothing in this repo reads `tokens.json`.

## Build the pages

```bash
node scripts/render-site.mjs              # normal build
node scripts/render-site.mjs --release    # store-launch build
```

- **Normal build** (no flag, or `--preview`, which means the same thing): renders every page. Anything that needs a studio field that is still `null` in `site.json` is left out cleanly. Today that is the legal name and mailing address on the privacy page.
- **`--release`**: use this for the build that goes with the App Store and Google Play launch. It refuses to run, exits with an error that lists the missing fields, and writes nothing until `studio.legalName`, `studio.address`, and `studio.supportEmail` are all set.
- **`--lastmod=YYYY-MM-DD`**: the date written to `sitemap.xml`. It defaults to the day you run the script.
- **`--site=FILE`** and **`--games=FILE`**: read the data from another copy of `site.json` or `games.json`, for example a copy in a temp folder with some art set to `null`, to preview a page without that art. The pages are still written into this repo, so run the plain build again afterwards.

The script writes the pages and `sitemap.xml`. It overwrites the generated HTML, so edit `games.json`, `site.json`, or the script, then run it again. Do not hand-edit the generated pages. After a build it prints a warning that lists the [art slots](#art-slots-swapping-art) that are empty.

Before it writes anything, the script checks its own output. If any check fails, it stops with a list of problems and writes nothing:

- Every entry in the art maps (`site.json` `art` and each game's `art` in `games.json`), and a game's `play_url` when it has one, is either `null` or points to a file that exists. This check runs in every mode, `--release` included.
- `assets/css/site.css` loads only fonts. Pictures come from the art maps and render as markup.
- Every link, image, stylesheet, and share-image URL in the generated pages points to a local file, and uses an absolute path such as `/assets/...`. GitHub Pages serves `404.html` at any missing URL, at any depth, so a relative path would break there.
- Links that leave the site (email and app stores) carry `data-parent-gate`, so nothing loads from another site.
- Every `<use href="/assets/.../sprite.svg#id">` points to a `<symbol>` that exists in that sprite.
- No page has a `style` attribute or `<style>` block. The CSP (`style-src 'self'`) would block them, so styling goes in `assets/css/site.css`.
- No page's CSP allows `'unsafe-inline'`. The one inline script (Rosie's wave swap on the home page) runs because the script adds its `sha256` hash to `script-src`, computed from the text it writes. The build checks the hash against the final page, so it always matches.
- Rosie's animated wave files appear only in `data-wave-srcset`, never in a `src`, `srcset`, `<source>`, or preload, so they are never part of the first load. `data-wave-srcset` must mirror her still `srcset` 1:1 (the same widths in the same order), so the swap never lowers her resolution.
- No page contains TODO text, placeholders, or internal notes (for example "art director", "slot", "marked", or a "Pictures" section).
- Every page has exactly one trust strip, and no other copy on the page repeats the no-ads, no-tracking, or no-accounts claim (the privacy policy body is the policy, so it is exempt).
- Studio pages never show a game's world art: its `hero`, its `title` lockup, or its share card.
- `site.webmanifest` lists real PNG icons of the sizes it states, and its colours match the pages' `theme-color`.
- `assets/css/site.css` contains the rules of `assets/brand/tokens.css` verbatim, and no token refers to itself.

Commit the data files, any new images, and the regenerated files together.

## Studio details and the privacy line

`site.json` holds the studio details:

```json
"studio": { "legalName": null, "address": null, "supportEmail": "support@pinkrynostudios.com" }
```

- `supportEmail` is the only place the support address lives. It appears in the footer, once on the support page, in the privacy policy's Contact section, and in the Organization structured data. Every email link goes through the parental gate. If it is `null`, those spots are left out.
- `legalName` and `address` appear in the privacy policy under "Who we are" when set. Fill them in before the store launch, then run `--release`.

`privacyLine` ("No ads · No tracking · No accounts") is the trust strip, the one line about privacy in each page's copy. Home and 404 show it under the hero buttons, a game page right under its hero, and the other pages at the top of the page. The footer links to the policy as "Privacy". Keep privacy and no-ads claims out of `games.json`. The script stops with an error if it finds them there. The full policy is `/privacy/`.

## Art slots: swapping art

Every picture on the site comes from one of two art maps, and nothing else in the site build names an image file:

- **`site.json` → `art`**: site-wide art (Rosie, her small head, her 404 picture, the studio logo, favicons, the logo, the default share image, the About scene, and icons).
- **`games.json` → each game's `art`**: that game's hero art, title lockup, series wordmark, games index card, icon, share image, and screenshots.

`scripts/render-site.mjs` reads only these maps, and `site.css` loads only fonts. Swapping art never means editing code or CSS. `site.json` `mascot` holds only Rosie's text: `name` (used in most sentences), `fullName` (the About introduction), `pronouns`, and `species`.

**Approved art.** The Tiny Trails key art with Astro (TT-HERO) is the Tiny Trails page hero (studio pages never show it): `assets/games/tiny-trails-space/astro-hero.webp` (2400×1350) and `astro-hero-1200.webp` (1200×675), copied as delivered. The share cards are in `assets/og/`: `og-tiny-trails.jpg` (OG-TINY-TRAILS, final), re-encoded from the delivered 1200×630 PNG as baseline JPEG quality 87 (116 KB, down from 197 KB, and visually identical), and `og-studio.jpg`, the studio card for every studio page: the brand's sticker lockup `pinkryno-sticker-horizontal-on-cream-1200w.png` (1200×552, Final R4) composited centred over a 1200×630 Oat Cream canvas, padding only, progressive JPEG quality 85 (50 KB). OG-HOME (`og-home.jpg`, Astro among the planets) was removed with the Meadow Path rebrand. The Tiny Trails title lockup and wordmark are the brand kit's outlined SVGs, copied as delivered (`tiny-trails-space-lockup.svg`, `tiny-trails-wordmark.svg`). The lockup is the brand kit's Final R1 version (813×342): Cassie rejected the dashed trail line under "Space", so the lockup ends at the subtitle, which sits close under the wordmark.

**Rosie art.** Every Rosie file is the final approved **Rosie AB set**, copied as delivered from the art handoff folder (`art-for-site/rosie/`): the wave and its stills (`assets/mascot/rosie-wave-386*.webp`, `rosie-wave-260*.webp`), the full-body Rosie on About (`rosie-full-512.webp`, `rosie-full-1024.webp`), the puzzled 404 pose (`rosie-puzzled-512.webp`, `rosie-puzzled-1024.webp`), and the head set in `assets/mascot/head/` (the small heads and the logo). The favicons and app icons are the brand kit's (see [Brand](#brand-meadow-path-oct-28-2026)). The original Rosie files that are also on `main` were removed from the `site-redesign` branch as unused. They remain on `main` until the branch is merged. The sticker icons are the game's art, so only game pages show them.

### Swap a picture

1. Export the new files at the sizes in the tables below and drop them in `assets/` (for example `assets/mascot/` for Rosie, `assets/icons/`, `assets/og/`, or `assets/games/<id>/` for a game). Use new file names. Leave the old files where they are until the new ones are live.
2. Point the slot's entry at the new files: `site.json` `art` for site-wide art, or the game's `art` in `games.json`. Update `alt` when the picture changes.
3. Run `node scripts/render-site.mjs`. The build checks every file and lists the slots that are still empty.
4. Look at the pages, then commit the new files, the JSON, and the regenerated pages together.

Rules the build enforces:

- **`null` (or a missing key) means the slot is empty.** Its element or section is left out completely, with no placeholder, no empty box, and no gap. The build lists every empty slot in a warning.
- **A slot that is set must point to a real file**, in every mode, or the build stops and writes nothing. Paths start with `/`, like `/assets/mascot/rosie-new.webp`.
- `width` and `height` are optional. When they are set, they must match the file, and the error message shows the real size. `src2x` must be twice the size of `src`.
- `alt` is required wherever the picture means something (Rosie, game hero, screenshots, share images, About scene). Heads, icons, cards, game icons, title lockups, and wordmarks are decorative (the text beside them names the game).
- `srcSmall` on a game's `art.hero` must be a smaller copy of `src` with the same shape. Phones always get `srcSmall`; wider screens choose between the two by size (a 1x desktop gets `srcSmall`, a 2x one gets `src`).
- Unknown keys stop the build, so a typo like `srcsmall` can't empty a slot without anyone noticing.
- `art.retired` lists files that stay in the repo but no entry may use. Today that is the off-model `tt-hero-astro-3` art (`assets/games/tiny-trails-space/hero.webp` and its source PNG).

### Swapping the studio logo

The studio logo (the PinkRyno Studios lockup with Rosie) lives in one entry, `site.json` `art.headerLogo`, with one variant per size:

- **`desktop`**: the header (the home link on every page) on screens wider than 760 px. Today it is the sticker header lockup (Rosie on her small sage path beside the pink "PinkRyno" and cream "Studios"), drawn 80 px tall.
- **`small`**: the phone header, 760 px wide and narrower. Today it is the flat small header lockup (Rosie's head in a Sky Wash disc beside the flat wordmark), drawn 48 px tall. The brand uses the flat logo below 56 px.
- **`footer`** (optional): the footer (the studio name, beside the tagline). When it is left out, the footer uses `small`, as it does today.

760 px is the site's phone breakpoint: `PHONE_MAX_WIDTH` in `scripts/render-site.mjs` and `@media (max-width: 760px)` in `assets/css/site.css`. The header logo is a `<picture>`: its `<source media="(max-width: 760px)">` lists the `small` files and its `<img>` the `desktop` files, so a phone downloads only the small PNG and a desktop only the desktop PNG. Each variant is drawn at its own `displayHeight`. The pages set only the height and take the width from the file's shape, so a wider or narrower lockup needs no code or CSS change. The site has no hero logo slot (the home hero shows Rosie and the headline, and a game hero shows the game's title lockup). Rosie's own art (home, About, Support, 404) is separate and stays.

1. **Export a 1x and a 2x file for each variant**, PNG or WebP with a transparent background, trimmed close to the art (transparent padding makes the visible logo smaller). Use the brand kit's PNG exports, never its logo SVGs: the outlined SVGs embed base64 rasters (`pinkryno-sticker-header.svg` is 684 KB) and would break the 250 KB home first-load budget, so the build refuses SVG here.
   - `desktop`: 1x at least its `displayHeight` tall (80 px today: `pinkryno-sticker-header-80h.png`, 207×80), and 2x at exactly twice that (`pinkryno-sticker-header-160h.png`, 415×160). It must read on Oat Cream `#FFF9EE`.
   - `small`: 1x at least its `displayHeight` tall (48 px today: `pinkryno-flat-header-small-48h.png`, 152×48), and 2x at exactly twice that (`pinkryno-flat-header-small-96h.png`, 304×96). It must read on Oat Cream (phone header) and on sage `#A8C8A0` (footer).
   - `footer`, only when the footer should differ from `small`: the same rules, and it must read on sage.
   - Exactly twice means the 2x height is exactly twice the 1x height, and the 2x width is twice the 1x width within 1 px (the same shape rounded, like 415 for 207).
2. **Put the files in `assets/brand/`** under new names (the brand kit's names are fine). Leave the old files until the new logo is live, then delete the ones nothing references.
3. **Edit `site.json` `art.headerLogo`**:

   ```json
   "headerLogo": {
     "desktop": {
       "src": "/assets/brand/pinkryno-sticker-header-80h.png",
       "src2x": "/assets/brand/pinkryno-sticker-header-160h.png",
       "width": 207,
       "height": 80,
       "alt": "PinkRyno Studios",
       "displayHeight": 80
     },
     "small": {
       "src": "/assets/brand/pinkryno-flat-header-small-48h.png",
       "src2x": "/assets/brand/pinkryno-flat-header-small-96h.png",
       "width": 152,
       "height": 48,
       "alt": "PinkRyno Studios",
       "displayHeight": 48
     }
   }
   ```

   Each variant needs every key:
   - `src`, `src2x`: the 1x and 2x files.
   - `width`, `height`: the 1x file's real pixel size.
   - `alt`: keep "PinkRyno Studios" (the logo is the home link and the footer's studio name). `small.alt` must match `desktop.alt`, because the header's `<picture>` has one `alt`.
   - `displayHeight`: the CSS height the variant is drawn at. `desktop` and `footer` use the `.logo-h-<N>` rules in `assets/css/site.css` (40, 44, … 96). `small` uses the `.logo-small-h-<N>` rules (40, 44, … 64) in the phone header, and a `.logo-h-<N>` rule when it is also the footer. A new height is one more line in `site.css`. The header keeps 12 px above and below the logo, so it is 104 px tall for an 80 px logo and grows with a taller one.

   To give the footer its own file and height, add `"footer": { ... }` with the same keys. Set `art.headerLogo` to `null` to show the studio name as text in the header and the footer.
4. **Re-make the share image.** `assets/og/og-studio.jpg` (`art.og.default`, the link preview for every studio page) is made from the brand kit's sticker horizontal lockup on cream, `logo/pinkryno-sticker-horizontal-on-cream-1200w.png` (1200×552). Composite it, centred and at its own size (padding only, no scaling), over a 1200×630 Oat Cream `#FFF9EE` canvas, and save a progressive JPEG at quality 85, under 120 KB (today 50 KB). Composite rather than paste: the PNG's left and right edge pixels are partly transparent. Re-make it whenever the logo changes, and update `art.og.default.alt` to describe the new logo. Apps cache link previews by URL, so a new file name (for example `og-studio-2.jpg`, with `art.og.default.src` pointed at it) refreshes them sooner than overwriting the file.
5. **Run `node scripts/render-site.mjs`.** It stops and writes nothing if `desktop` or `small` is missing (or `headerLogo` still has the old one-file shape), a file is missing or is an SVG (PNG or WebP only), `width` or `height` is not the 1x file's size, `src2x` is missing or not exactly 2x, a 1x file is shorter than its `displayHeight`, a `displayHeight` has no `.logo-h-<N>` or `.logo-small-h-<N>` rule, `small.alt` differs from `desktop.alt`, or `site.css` has no `@media (max-width: 760px)` rule. On success it prints each variant's files and drawn size, like `desktop header (wider than 760px): drawn 207x80` and `phone header (760px and narrower): drawn 152x48`. It warns when a variant is so wide that it draws smaller (over 360 px wide, or too wide to sit full size beside the Menu button on a 320 px phone).
6. **Check** at 1280, 761, 760, 390, and 320 px wide (home, a game page, and 404): above 760 px the header shows the desktop logo at its `displayHeight`, and at 760 px and below the small logo at its own; each is sharp, keeps its shape, and is centred with the nav links (desktop) or the Menu button (phone); the menu still opens; the Network panel shows only one of the two header files; the footer logo reads on sage beside the tagline (desktop) or above it (phone); and nothing scrolls sideways. After deploying, check a page's link preview for the new share image.

The favicons, app icons, and `art.logo` (Rosie's head, the Organization logo in search results) are separate files and do not change with the lockup.

### Site-wide slots (`site.json` `art`)

Display sizes are CSS pixels.

| Slot | Shows on | Display size | Deliver | Current file |
| --- | --- | --- | --- | --- |
| `rosie.animated` | Home "Meet Rosie" section, below the fold, beside the text (above it, centred, on phones). Its stills also stand on the home hero meadow (330 px tall, 240 up to 960 px wide, 180 on phones), the same files, so they load once. The page loads only the stills. The wave swaps in when she scrolls near the screen, and never under reduced motion or without JavaScript | 300 px tall (220 on phones), about 232 px wide (170 on phones). The stills are picked by screen density: 1x screens get `stillSmall`, 2x desktops and 2x/3x phones get `still`. The wave always matches the still on screen: `srcSmall` where the browser chose `stillSmall`, `src` where it chose `still` | Animated WebP `src` plus a still WebP `still` of exactly the same pixel size, at least 300 px tall. Optional smaller pair: `srcSmall` + `stillSmall`, also exactly the same size as each other, a smaller copy with the same shape, at least 220 px tall (the build checks both heights, so Rosie is never drawn larger than her file at 1x). Each wave and its still have the same pose framing, and the still is the wave's first frame. `width`/`height` and `widthSmall`/`heightSmall` are optional and checked. `alt`. Each wave file at most about 100 KB (the build warns above 102,400 bytes), ideally about 60 KB or less for `srcSmall`: it loads once the visitor scrolls to Rosie. The full spec is in [PLAN.md's Rosie art handoff](docs/site-redesign/PLAN.md#rosie-art-handoff) | Rosie AB: `assets/mascot/rosie-wave-386.webp` + `-386-still.webp` (386×500), `rosie-wave-260.webp` + `-260-still.webp` (260×337). The waves are 89,074 and 60,158 bytes, within budget |
| `rosie.static` | About (300 px wide, about 218 on phones). Also the home "Meet Rosie" section (300 px tall, 220 on phones) when `animated` is empty | At least 300 px wide and 300 px tall | Transparent WebP or PNG `src` at 1x, optional `src2x` at 2x, `alt` | Rosie AB: `assets/mascot/rosie-full-512.webp` (512×512), `src2x` `rosie-full-1024.webp` |
| `rosie.lost` | The 404 page, standing on the meadow beside "This page wandered off" | 330 px tall (240 up to 960 px wide, 180 on phones) | Transparent WebP or PNG `src` at 1x, optional `src2x`, `alt` | Rosie AB puzzled pose: `assets/mascot/rosie-puzzled-512.webp` (512×512), `src2x` `rosie-puzzled-1024.webp`, alt "Rosie Ryno looking puzzled" |
| `rosie.head` | Support title 88 px (64 on phones). Also the home "Meet Rosie" section (128 px) when `animated` and `static` are both empty | 44–128 px square | Square WebP or PNG files keyed by pixel size: `64`, `128`, `256`. Each spot loads only the files that cover 1x and 2x | Rosie AB: `assets/mascot/head/rosie-head-64.webp`, `-128.webp`, `-256.webp` |
| `headerLogo` | The studio logo on every page: the header (the home link) and the footer (the studio name, beside the tagline). `desktop` is the header wider than 760 px; `small` is the phone header (760 px and narrower) and the footer; optional `footer` replaces `small` in the footer | Each variant its own `displayHeight` tall: `desktop` 80 px, `small` 48 px. The width follows each file's shape, at most 360 px | Per variant (`desktop`, `small`, optional `footer`): PNG or WebP `src` at least `displayHeight` px tall, `src2x` at exactly 2x, `width` and `height` (the 1x file's size), `alt`, and `displayHeight`, all required. Never the logo SVGs. See [Swapping the studio logo](#swapping-the-studio-logo) | `desktop`: `assets/brand/pinkryno-sticker-header-80h.png` (207×80), `src2x` `pinkryno-sticker-header-160h.png` (415×160). `small` (also the footer): `pinkryno-flat-header-small-48h.png` (152×48), `src2x` `pinkryno-flat-header-small-96h.png` (304×96) |
| `faviconIco` | Browser tab icon, and browsers that ask for `/favicon.ico` on their own | 16, 32, and 48 px | ICO with at least the 16, 32, and 48 px images. Its `<link rel="icon" sizes>` lists every size in the file | Brand kit: `/favicon.ico` at the site root |
| `favicon32` | Browser tab icon | 32 px | PNG, exactly 32×32 | Brand kit: `/favicon-32.png` |
| `appleTouch` | Home-screen icon on phones | 180 px | PNG, exactly 180×180 | Brand kit: `/apple-touch-icon-180.png` |
| `logo` | Organization `logo` in the home page's structured data (not shown on the page) | n/a | PNG, JPEG, or WebP, at least 112×112 | Rosie AB: `assets/mascot/head/rosie-head-256.png` |
| `og.default` | Share image (`og:image`, `twitter:image`) for every page without its own | 1200×630 | PNG or JPEG, `alt` (also used for `og:image:alt` and `twitter:image:alt`). When empty, pages have no image tags | `assets/og/og-studio.jpg` (the sticker horizontal lockup on Oat Cream, a separate export: re-make it when the logo changes) |
| `aboutScene` | Full-width picture below the About text | Up to 1120 px wide | WebP, PNG, or JPEG `src` (for example 1120×630), optional `src2x`, `alt` | Empty (ABOUT-SCENE pending) |
| `icons` | Sticker icons beside the game page lines (`trace`, `planet`, `helmet`, `replay`, `gift`, `key`). Studio pages use none | 56 px (48 on phones) | One entry per name: `"/sprite.svg#symbol-id"` or a plain SVG file (or WebP/PNG at 112 px or more) | `assets/icons/icons-sprite.svg` (ICON-SET) |

The home hero shows Rosie standing on the meadow (the stills of `rosie.animated`, else `rosie.static`, else no Rosie). Rosie waves in the home "Meet Rosie" section below the fold, the page's one waving Rosie: `rosie.animated` if it is set (its still first, the wave once she scrolls into view), else `rosie.static`, else the head, else nothing, and the section is then its heading, line, and link alone, with no gap. She stays on About (`rosie.static`), Support (`rosie.head`), and 404 (`rosie.lost`), and she is part of the studio logo in the header and footer (`headerLogo`: her full figure on a small sage path in the desktop sticker logo, her head in a Sky Wash disc in the small logo; that is logo art). Nothing the pages draw around her has a box, border, background, shadow, or star, and no page draws a path under her. The meadow, the home hero's trail (which passes behind her feet), and the footer hill are sibling layers, never her parents. An empty `rosie.lost` leaves the 404 meadow text only. An empty `rosie.head` removes the small head from the support title, and the text closes up. An empty `headerLogo` shows the studio name as text in the header and the footer. Every page links the icons in this order: `/favicon.ico` (`sizes="16x16 32x32 48x48"`), `/favicon-32.png`, the apple-touch icon, then `/site.webmanifest`. Keep `/favicon.ico` at the site root even if `faviconIco` is emptied, because browsers ask for that path on their own.

On the home page, Rosie's `<img>` holds only her stills (`src`, plus a `srcset` of `stillSmall` and `still`), with her width and height. That is the whole picture without JavaScript and under reduced motion. The wave files sit only in `data-wave-srcset`, which mirrors the still `srcset` 1:1: the same widths in the same order, each wave in its own still's place, under the same `sizes`. `loading="lazy"` alone could not keep them out of the first load, because Chrome starts lazy images within about 1250 px of the screen, and the Meet Rosie section is that close. Instead, a small inline script (`ROSIE_WAVE_SCRIPT` in `scripts/render-site.mjs`) waits for the page's `load` event, then watches Rosie with an `IntersectionObserver`. The first time she comes within 200 px of the screen, it stops watching and, once the still has loaded, finds the still the browser chose (`img.currentSrc`) in the still `srcset` and sets `srcset` to the wave at the same position. So the wave is always the same width as the still on screen, at every screen density, and never a smaller file. It does nothing under `prefers-reduced-motion: reduce` or without `IntersectionObserver`, never swaps if reduced motion turns on later, and puts the still back if it turns on after the swap. The script is emitted only when `rosie.animated` is set, without its indentation, because with `assets/js/site.js` it counts toward the 5 KB JS budget. The build stops if a wave and its still differ in pixel size, if `data-wave-srcset` does not mirror the still `srcset`, or if one wave or still path ends with another (the script matches `img.currentSrc` by its end). It warns, and still builds, for each wave file over 100 KB (102,400 bytes). The Rosie AB waves are 60,158 bytes (260 px) and 89,074 bytes (386 px), so the build does not warn.

A sprite entry draws the symbol with `<svg><use href="/assets/icons/icons-sprite.svg#icon-gift"/></svg>`, so a sprite is one request for the whole site. Don't inline a sprite inside a `display: none` element, because some browsers then drop its filters. The build checks that the symbol exists in the sprite.

The Rosie files come from the art handoff folder, `art-for-site/rosie/`. Its README documents the wave markup, the srcset pairs (the 260 pair for 1x screens, the 386 pair for 2x), and the reduced-motion still. The script that re-exported the temporary wave was removed when the final wave arrived.

### Game slots (`games.json` `art`)

Each entry is `null` or an object like `{ "src": "/assets/games/<id>/hero.webp", "alt": "..." }`. `screenshots` is a list of those objects.

| Slot | Shows on | Display size | Deliver |
| --- | --- | --- | --- |
| `hero` | The game page's hero, inside the game's `world`: the art on the right (above the title up to 960 px) and the breadcrumb, title, tagline, and button on its calm left side. It is the page's largest picture, so it loads first. Only the game page shows it | Wider than 960 px: as tall as the band (540 px, 620 px from 1200 px wide) at its own shape, right-aligned in a centred 1440 px frame. Up to 960 px: above the text, full width, 75vw tall (at most 560 px) | WebP, PNG, or JPEG `src` (2400×1350, 16:9) plus `srcSmall` (the same picture, 1200 wide), `alt`. Put the subject on the right and keep the left half calm and dark |
| `title` | The game page hero's visual title (the `<h1>` text stays for screen readers) | 460 px wide (300 on phones) | The game's title lockup, outlined SVG (or WebP/PNG) with pixel `width` and `height`. Decorative |
| `wordmark` | The game on studio pages: the home "Our games" section and the games index row | Up to 440 px wide (320 on phones) | The series wordmark, outlined SVG (or WebP/PNG). No game-world art. Decorative |
| `card` | Studio pages, only when there is no `wordmark` | Half the row, up to 536 px wide | WebP, PNG, or JPEG, 1280×800 (16:10). Decorative |
| `icon` | Above the game title on the game page, in the home "Our games" section, and in the games index row | 72 px | Square WebP or PNG, `src` 72×72 and `src2x` 144×144. Decorative |
| `og` | Share image for the game page (studio pages, the games index included, use `og.default`) | 1200×630 | PNG or JPEG, `alt`. Without it, the page uses `og.default` |
| `screenshots` | "A look inside" strip on the game page. It appears only when the list has at least one picture | 400 px wide each | WebP, PNG, or JPEG, 1200×750 (16:10), `alt` each |

Tiny Trails: Space has `hero` (TT-HERO, Astro design #2), `title` (`tiny-trails-space-lockup.svg`), `wordmark` (`tiny-trails-wordmark.svg`), and `og` (`assets/og/og-tiny-trails.jpg`, OG-TINY-TRAILS). `card`, `icon`, and `screenshots` are empty: TT-CARD and the sticker build's screenshots are pending.

## Add a new game

Adding a game is one entry in [`games.json`](games.json), plus its images. You do not redesign the pages.

1. Copy the Tiny Trails: Space object in `games.json`.
2. Set a new `id` (lowercase letters, numbers, and hyphens). `page` must be `/games/<id>/`. `short_title` is the game's short name ("Tiny Trails").
3. Set `status` to `live`, `coming-soon`, or `hidden`.
   - `live` and `coming-soon` get a page, a row on the games index, and a sitemap entry.
   - `hidden` is left out of the site and the sitemap.
4. Write the copy for parents: `tagline`, `summary`, `studio_summary` (the calm line on studio pages, with no game-world words; it falls back to `summary`), `description` (the meta description), `ages` (like `3–6`), `free_content`, `unlock`, `trial`, and `web_note`. `price` is the one-time unlock price, like `$0.99`, or `null`.
5. `highlights` are the "How it plays" lines. Each one has `text` and an `icon`: `trace`, `planet`, `helmet`, `replay`, `gift`, or `key` (the names in `site.json` `art.icons`). An icon whose entry is empty is left out and the text stays.
6. Leave `stores.ios` and `stores.android` as `null` until the real listing exists. Use a plain `https://` URL with no tracking parameters. The store buttons stay off the page until then. A live game with no store link and no browser build shows a Butter "Coming soon" tag and the line "Coming soon to phones and tablets."
7. **Browser build.** The site links no browser build today. Tiny Trails: Space has `play_enabled: false` and no `play_url` or `play_label`, so no page shows a play button, a size note, or other browser-play wording. The old build in `games/space-maze/` was removed on October 28, 2026, with Cassie's approval, and its URL now returns the 404 page. A new game build gets its own `games.json` entry and `play_url` later, when it is ready.
   - `play_url` is the browser build's page on this site, such as `/games/<folder>/`. It must exist, and it cannot point to `/games/tiny-trails-beta/`. Leave it out (or `null`) when there is no browser build. **It is the single setting for every play button.**
   - `play_enabled` must be `true`, `false`, or left out (which counts as `false`); the build stops on anything else. The play button renders only when `play_enabled` is `true` and `play_url` is set. A game with no `play_url`, or with `play_enabled: false`, renders no play button and no size note, and the build runs normally. `play_enabled: true` without a `play_url` stops the build with an error.
   - `play_label` is the button text. It is optional and defaults to "Play in browser".
   - `play_size_note` (for example `about 24 MB, best on Wi-Fi`) shows under the play button on the game page and in the support page's "Playing in the browser" answer. `web_note` shows under "What's free" on the game page and in the support page's unlock answer. Both show only while the play button does.
   - While there is no play button, everything else that talks about playing in the browser is left out too: the game page's "Questions?" line skips "Playing in the browser", and the support page's "Playing in the browser" question and the `Web Browser` platform in the structured data are hidden.
8. Fill in the game's `art` map (`hero`, `title`, `wordmark`, `card`, `icon`, `og`, `screenshots`) with files under `assets/games/<id>/`. Each entry carries its own `alt`, like `"hero": { "src": "/assets/games/<id>/hero.webp", "alt": "..." }`. Every picture is optional: leave the entry `null` (or `screenshots` empty) and that picture is left out, with no placeholder. A path that is set must point to a real file, or the build stops. The slots, sizes, and formats are in [Game slots](#game-slots-gamesjson-art). `assets/games/tiny-trails-space/hero.webp` and its source `tt-hero-astro-3.png` are off-model and listed in `site.json` `art.retired`, so the build refuses them.
9. Set `world` to give the game page hero its own look, and add the matching `.world-<name>` rule to `assets/css/site.css` (the build checks it exists). Leave it `null` for the studio look. The old `accent` field is gone, and the build stops if it is set.
10. Run `node scripts/render-site.mjs`, then commit `games.json`, the new images, and the generated files (`games/<id>/index.html`, the home page, the games index, and `sitemap.xml`).

`/games/tiny-trails-beta/` is staging. It is not linked, it is omitted from `sitemap.xml`, and `robots.txt` disallows it. Do not add it to `games.json`.

## Privacy

The site does not use analytics, cookies, or third-party fonts. Fredoka and Nunito are self-hosted in `assets/fonts/` under the SIL Open Font License. Links that leave the site (email, and store links once they exist) go through a parental gate in `assets/js/site.js`. The menu works without JavaScript. The only other script is the home page's inline Rosie wave swap, allowed by its hash in the CSP.

The privacy policy covers this website only. No game is playable on the site today; every game is coming soon to phones and tablets, and the policy must be updated before any game launches as an app. The explanation of device storage (a game that runs in the browser saves progress on the device, in the browser's storage, and nothing is sent anywhere) appears once, in the policy's "Cookies and device storage" section. The support page's "Deleting data" answer gives only the steps and links to the policy. The no-ads and no-tracking statement appears once in the policy body, in "Ads, tracking, and SDKs", plus the trust strip (`privacyLine`), which every page shows once. When you change the policy text in `scripts/render-site.mjs`, update `POLICY_EFFECTIVE` at the top of the script so the date on the page changes too.
