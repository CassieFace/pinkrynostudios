# PinkRyno Studios

Static website for [pinkrynostudios.com](https://pinkrynostudios.com). GitHub Pages serves the files in this repository. There is no build step on Pages and no change to Pages settings. The pages are generated locally and committed.

The old browser build at `games/space-maze/` (about 52 MB) was removed on October 28, 2026, with Cassie's approval. Its URL, `/games/space-maze/`, now returns the 404 page. No generated page links any browser build (see [Add a new game](#add-a-new-game), step 7). The `Disallow: /games/space-maze/` rule is gone from `robots.txt`, so crawlers fetch the URL, see the 404, and drop it. `robots.txt` keeps only `Disallow: /games/tiny-trails-beta/` and the `Sitemap` line. `scripts/render-site.mjs` still treats `space-maze` as a reserved path and refuses to write under `games/space-maze/`, so a new game cannot reuse the old URL by accident. Do not edit `games/tiny-trails-beta/` or `CNAME` from the website work.

## Build the pages

```bash
node scripts/render-site.mjs              # normal build
node scripts/render-site.mjs --release    # store-launch build
```

- **Normal build** (no flag, or `--preview`, which means the same thing): renders every page. Anything that needs a studio field that is still `null` in `site.json` is left out cleanly. Today that is the legal name and mailing address on the privacy page.
- **`--release`**: use this for the build that goes with the App Store and Google Play launch. It refuses to run, exits with an error that lists the missing fields, and writes nothing until `studio.legalName`, `studio.address`, and `studio.supportEmail` are all set.
- **`--lastmod=YYYY-MM-DD`**: the date written to `sitemap.xml`. It defaults to the day you run the script.
- **`--site=FILE`** and **`--games=FILE`**: read the data from another copy of `site.json` or `games.json`, for example a copy in a temp folder with some art set to `null`, to preview a page without that art. The pages are still written into this repo, so run the plain build again afterwards.

The script writes the pages, `assets/css/themes.css`, and `sitemap.xml`. It overwrites the generated HTML, so edit `games.json`, `site.json`, or the script, then run it again. Do not hand-edit the generated pages. After a build it prints a warning that lists the [art slots](#art-slots-swapping-art) that are empty.

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

Commit the data files, any new images, and the regenerated files together.

## Studio details and the privacy line

`site.json` holds the studio details:

```json
"studio": { "legalName": null, "address": null, "supportEmail": "support@pinkrynostudios.com" }
```

- `supportEmail` is the only place the support address lives. It appears in the footer, once on the support page, in the privacy policy's Contact section, and in the Organization structured data. Every email link goes through the parental gate. If it is `null`, those spots are left out.
- `legalName` and `address` appear in the privacy policy under "Who we are" when set. Fill them in before the store launch, then run `--release`.

`privacyLine` is the one sentence about privacy in the site's marketing copy. It sits in the footer next to the "Privacy policy" link. Keep privacy and no-ads claims out of `games.json`. The script stops with an error if it finds them there. The full policy is `/privacy/`.

## Art slots: swapping art

Every picture on the site comes from one of two art maps, and nothing else in the site build names an image file:

- **`site.json` → `art`**: site-wide art (Rosie, her small head, her 404 picture, favicons, the logo, the default share image, the home hero art, the About scene, stars, and icons).
- **`games.json` → each game's `art`**: that game's hero art, games index card, icon, share image, and screenshots.

`scripts/render-site.mjs` reads only these maps, and `site.css` loads only fonts. Swapping art never means editing code or CSS. `site.json` `mascot` holds only Rosie's text: `name` (used in most sentences), `fullName` (the About introduction), `pronouns`, and `species`.

**Approved art.** The Tiny Trails key art with Astro (TT-HERO) is the home hero and the Tiny Trails page hero: `assets/games/tiny-trails-space/astro-hero.webp` (2400×1350) and `astro-hero-1200.webp` (1200×675), copied as delivered. The share cards are in `assets/og/`: `og-tiny-trails.jpg` (OG-TINY-TRAILS, final), re-encoded from the delivered 1200×630 PNG as baseline JPEG quality 87 (116 KB, down from 197 KB, and visually identical), and `og-home.jpg` (OG-HOME, with the Rosie AB Rosie waving beside Astro), re-encoded from the delivered 1200×630 PNG (214 KB) as progressive JPEG quality 85 with 4:2:0 chroma (113,050 bytes; no quality from 85 to 92 reached 100 KB, and this one keeps the wordmark and outlines crisp).

**Rosie art.** Every Rosie file is the final approved **Rosie AB set**, copied as delivered from the art handoff folder (`art-for-site/rosie/`): the wave and its stills (`assets/mascot/rosie-wave-386*.webp`, `rosie-wave-260*.webp`), the full-body Rosie on About (`rosie-full-512.webp`, `rosie-full-1024.webp`), the puzzled 404 pose (`rosie-puzzled-512.webp`, `rosie-puzzled-1024.webp`), the head set in `assets/mascot/head/` (the small heads, the PNG favicons, the apple-touch icon, and the logo), and `/favicon.ico` at the site root. The original Rosie files that are also on `main` were removed from the `site-redesign` branch as unused. They remain on `main` until the branch is merged. The icons and stars are the current art and will be redone in the new sticker style.

### Swap a picture

1. Export the new files at the sizes in the tables below and drop them in `assets/` (for example `assets/mascot/` for Rosie, `assets/icons/`, `assets/twinkle/`, `assets/og/`, or `assets/games/<id>/` for a game). Use new file names. Leave the old files where they are until the new ones are live.
2. Point the slot's entry at the new files: `site.json` `art` for site-wide art, or the game's `art` in `games.json`. Update `alt` when the picture changes.
3. Run `node scripts/render-site.mjs`. The build checks every file and lists the slots that are still empty.
4. Look at the pages, then commit the new files, the JSON, and the regenerated pages together.

Rules the build enforces:

- **`null` (or a missing key) means the slot is empty.** Its element or section is left out completely, with no placeholder, no empty box, and no gap. The build lists every empty slot in a warning.
- **A slot that is set must point to a real file**, in every mode, or the build stops and writes nothing. Paths start with `/`, like `/assets/mascot/rosie-new.webp`.
- `width` and `height` are optional. When they are set, they must match the file, and the error message shows the real size. `src2x` must be twice the size of `src`.
- `alt` is required wherever the picture means something (Rosie, game hero, screenshots, share images, About scene). Heads, icons, stars, cards, game icons, and the home hero art are decorative.
- `srcSmall` on a hero (`site.json` `art.hero` or a game's `art.hero`) must be a smaller copy of `src` with the same shape. Phones always get `srcSmall`; wider screens choose between the two by size (a 1x desktop gets `srcSmall`, a 2x one gets `src`).
- Unknown keys stop the build, so a typo like `srcsmall` can't empty a slot without anyone noticing.
- `art.retired` lists files that stay in the repo but no entry may use. Today that is the off-model `tt-hero-astro-3` art (`assets/games/tiny-trails-space/hero.webp` and its source PNG).

### Site-wide slots (`site.json` `art`)

Display sizes are CSS pixels.

| Slot | Shows on | Display size | Deliver | Current file |
| --- | --- | --- | --- | --- |
| `rosie.animated` | Home "Meet Rosie" section, below the fold, beside the text (above it, centred, on phones). The page loads only the stills. The wave swaps in when she scrolls near the screen, and never under reduced motion or without JavaScript | 300 px tall (220 on phones), about 232 px wide (170 on phones). The stills are picked by screen density: 1x screens get `stillSmall`, 2x desktops and 2x/3x phones get `still`. The wave always matches the still on screen: `srcSmall` where the browser chose `stillSmall`, `src` where it chose `still` | Animated WebP `src` plus a still WebP `still` of exactly the same pixel size, at least 300 px tall. Optional smaller pair: `srcSmall` + `stillSmall`, also exactly the same size as each other, a smaller copy with the same shape, at least 220 px tall (the build checks both heights, so Rosie is never drawn larger than her file at 1x). Each wave and its still have the same pose framing, and the still is the wave's first frame. `width`/`height` and `widthSmall`/`heightSmall` are optional and checked. `alt`. Each wave file at most about 100 KB (the build warns above 102,400 bytes), ideally about 60 KB or less for `srcSmall`: it loads once the visitor scrolls to Rosie. The full spec is in [PLAN.md's Rosie art handoff](docs/site-redesign/PLAN.md#rosie-art-handoff) | Rosie AB: `assets/mascot/rosie-wave-386.webp` + `-386-still.webp` (386×500), `rosie-wave-260.webp` + `-260-still.webp` (260×337). The waves are 89,074 and 60,158 bytes, within budget |
| `rosie.static` | About (300 px wide, about 218 on phones). Also the home "Meet Rosie" section (300 px tall, 220 on phones) when `animated` is empty | At least 300 px wide and 300 px tall | Transparent WebP or PNG `src` at 1x, optional `src2x` at 2x, `alt` | Rosie AB: `assets/mascot/rosie-full-512.webp` (512×512), `src2x` `rosie-full-1024.webp` |
| `rosie.lost` | The 404 page, above "This page floated off" | 240 px wide (56% of the screen on phones) | Transparent WebP or PNG `src` at 1x, optional `src2x`, `alt` | Rosie AB puzzled pose: `assets/mascot/rosie-puzzled-512.webp` (512×512), `src2x` `rosie-puzzled-1024.webp`, alt "Rosie Ryno looking puzzled" |
| `rosie.head` | Header 48 px (44 on phones), footer 64 px, support title 88 px (64 on phones). Also the home "Meet Rosie" section (128 px) when `animated` and `static` are both empty | 44–128 px square | Square WebP or PNG files keyed by pixel size: `64`, `128`, `256`. Each spot loads only the files that cover 1x and 2x | Rosie AB: `assets/mascot/head/rosie-head-64.webp`, `-128.webp`, `-256.webp` |
| `faviconIco` | Browser tab icon, and browsers that ask for `/favicon.ico` on their own | 16, 32, and 48 px | ICO with at least the 16, 32, and 48 px images. Its `<link rel="icon" sizes>` lists every size in the file | Rosie AB: `/favicon.ico` at the site root |
| `favicon32`, `favicon48` | Browser tab icon | 32 and 48 px | PNG, exactly 32×32 and 48×48 | Rosie AB: `assets/mascot/head/favicon-32.png`, `favicon-48.png` |
| `appleTouch` | Home-screen icon on phones | 180 px | PNG, exactly 180×180 | Rosie AB: `assets/mascot/head/apple-touch-icon-180.png` |
| `logo` | Organization `logo` in the home page's structured data (not shown on the page) | n/a | PNG, JPEG, or WebP, at least 112×112 | Rosie AB: `assets/mascot/head/rosie-head-256.png` |
| `og.default` | Share image (`og:image`, `twitter:image`) for every page without its own | 1200×630 | PNG or JPEG, `alt` (also used for `og:image:alt` and `twitter:image:alt`). When empty, pages have no image tags | `assets/og/og-home.jpg` (OG-HOME, with the Rosie AB Rosie) |
| `hero` | The home hero band, behind the stars and text (decorative). The page's largest picture, so it loads first (`fetchpriority="high"`) | Wider than 960 px: as tall as the band (540 px, 620 px from 1200 px wide) at its own shape, right-aligned in a centred 1440 px frame. Up to 960 px: above the text, full width, 75vw tall (at most 560 px), cropped from the left | A wide WebP, PNG, or JPEG `src` (2400×1350, 16:9) plus `srcSmall`, a smaller copy of the same picture (1200×675). Put the subject on the right and keep the left half calm and dark, because the text sits there. Keep the subject between about 15% and 85% of the height, since the horizon curve covers the band's foot | `assets/games/tiny-trails-space/astro-hero.webp` + `astro-hero-1200.webp` (TT-HERO, approved) |
| `aboutScene` | Full-width picture below the About text | Up to 1120 px wide | WebP, PNG, or JPEG `src` (for example 1120×630), optional `src2x`, `alt` | Empty (ABOUT-SCENE pending) |
| `stars` | Home hero background stars and a few faint footer stars | 6–78 px, set per kind in `STAR_SIZES` | One entry per star kind: `"/sprite.svg#symbol-id"` or a plain SVG, WebP, or PNG file | `assets/twinkle/twinkle-sprite.svg` (TWINKLE-SET) |
| `icons` | Sticker icons beside the home "For grown-ups" facts (`gift`, `key`, `hand`) and the game page lines (`trace`, `planet`, `helmet`, `replay`, `gift`, `key`) | 56 px (48 on phones) | One entry per name: `"/sprite.svg#symbol-id"` or a plain SVG file (or WebP/PNG at 112 px or more) | `assets/icons/icons-sprite.svg` (ICON-SET) |

The home hero shows `hero` (Astro) and no Rosie, so she never competes with the hero art. Rosie waves in the home "Meet Rosie" section below the fold: `rosie.animated` if it is set (its still first, the wave once she scrolls into view), else `rosie.static`, else the head, else nothing, and the section is then its heading, line, and link alone, with no gap. She stays on About (`rosie.static`), Support (`rosie.head`), and 404 (`rosie.lost`). An empty `hero` leaves a text-only navy band with the same text layout and stars. An empty `rosie.lost` leaves the 404 page text only. An empty `rosie.head` removes the small heads from the header, footer, and support title, and the text closes up. Every page links the favicons in this order: `/favicon.ico` (`sizes="16x16 32x32 48x48"`), the 32 and 48 px PNGs, then the 180 px apple-touch icon. Keep `/favicon.ico` at the site root even if `faviconIco` is emptied, because browsers ask for that path on their own.

On the home page, Rosie's `<img>` holds only her stills (`src`, plus a `srcset` of `stillSmall` and `still`), with her width and height. That is the whole picture without JavaScript and under reduced motion. The wave files sit only in `data-wave-srcset`, which mirrors the still `srcset` 1:1: the same widths in the same order, each wave in its own still's place, under the same `sizes`. `loading="lazy"` alone could not keep them out of the first load, because Chrome starts lazy images within about 1250 px of the screen, and the Meet Rosie section is that close. Instead, a small inline script (`ROSIE_WAVE_SCRIPT` in `scripts/render-site.mjs`) waits for the page's `load` event, then watches Rosie with an `IntersectionObserver`. The first time she comes within 200 px of the screen, it stops watching and, once the still has loaded, finds the still the browser chose (`img.currentSrc`) in the still `srcset` and sets `srcset` to the wave at the same position. So the wave is always the same width as the still on screen, at every screen density, and never a smaller file. It does nothing under `prefers-reduced-motion: reduce` or without `IntersectionObserver`, never swaps if reduced motion turns on later, and puts the still back if it turns on after the swap. The script is emitted only when `rosie.animated` is set, without its indentation, because with `assets/js/site.js` it counts toward the 5 KB JS budget. The build stops if a wave and its still differ in pixel size, if `data-wave-srcset` does not mirror the still `srcset`, or if one wave or still path ends with another (the script matches `img.currentSrc` by its end). It warns, and still builds, for each wave file over 100 KB (102,400 bytes). The Rosie AB waves are 60,158 bytes (260 px) and 89,074 bytes (386 px), so the build does not warn.

A sprite entry draws the symbol with `<svg><use href="/assets/icons/icons-sprite.svg#icon-gift"/></svg>`, so a sprite is one request for the whole site. Don't inline a sprite inside a `display: none` element, because some browsers then drop the glow filters. The build checks that the symbol exists in the sprite.

The star layout is `HERO_STARS` and `FOOTER_STARS` in `scripts/render-site.mjs`. Each star gets a class (`.s1`, `.s2`, ... and `.f1`, ...), and `site.css` positions it. The CSP forbids `style` attributes, so positions can't go in the HTML. Hero stars stay clear of the hero text and the hero art at every width, over their whole drift. On wide screens they sit above the headline, in the gap between the text and the art, in the left margin, and under the buttons. Up to 960 px the art sits above the text, and the stars sit beside the headline and buttons. Stars drift out and back over 60–120 s and stop under reduced motion. An empty star kind drops those stars and leaves the rest in place. If a new `hero` puts its subject somewhere else, check the star positions again.

The Rosie files come from the art handoff folder, `art-for-site/rosie/`. Its README documents the wave markup, the srcset pairs (the 260 pair for 1x screens, the 386 pair for 2x), and the reduced-motion still. The script that re-exported the temporary wave was removed when the final wave arrived.

### Game slots (`games.json` `art`)

Each entry is `null` or an object like `{ "src": "/assets/games/<id>/hero.webp", "alt": "..." }`. `screenshots` is a list of those objects.

| Slot | Shows on | Display size | Deliver |
| --- | --- | --- | --- |
| `hero` | The game page's hero band, like the home hero: the art on the right (above the title up to 960 px) and the breadcrumb, title, and tagline on its calm left side. It is the page's largest picture, so it loads first. Also the games index row, cropped to 4:3 around its right side, when there is no `card`, and the home game section when it is a different picture from `site.json` `art.hero` | Same as the site `hero` | Same shape and rules as the site `hero`: WebP, PNG, or JPEG `src` (2400×1350) plus `srcSmall` (the same picture, 1200 wide), `alt` |
| `card` | Games index row picture | Half the row, up to 536 px wide | WebP, PNG, or JPEG, 1280×800 (16:10). Decorative |
| `icon` | Above the game title in the home game section, on the game page, and in the games index row | 72 px | Square WebP or PNG, `src` 72×72 and `src2x` 144×144. Decorative |
| `og` | Share image for the game page, and for the games index while it lists only this game | 1200×630 | PNG or JPEG, `alt`. Without it, the page uses `og.default` |
| `screenshots` | "A look inside" strip on the game page. It appears only when the list has at least one picture | 400 px wide each | WebP, PNG, or JPEG, 1200×750 (16:10), `alt` each |

Tiny Trails: Space has `hero` (TT-HERO, Astro design #2, the same files as the site `hero`) and `og` (`assets/og/og-tiny-trails.jpg`, OG-TINY-TRAILS). `card`, `icon`, and `screenshots` are empty: TT-CARD and the sticker build's screenshots are pending.

## Add a new game

Adding a game is one entry in [`games.json`](games.json), plus its images. You do not redesign the pages.

1. Copy the Tiny Trails: Space object in `games.json`.
2. Set a new `id` (lowercase letters, numbers, and hyphens). `page` must be `/games/<id>/`. `short_title` is the name on the home hero button ("Play Tiny Trails", shown only while the game has a linked browser build: `play_enabled` is `true` and `play_url` is set).
3. Set `status` to `live`, `coming-soon`, or `hidden`.
   - `live` and `coming-soon` get a page, a row on the games index, and a sitemap entry.
   - `hidden` is left out of the site and the sitemap.
4. Write the copy for parents: `tagline`, `summary`, `description` (the meta description), `ages` (like `3–6`), `free_content`, `unlock`, `trial`, and `web_note`. `price` is the one-time unlock price, like `$0.99`, or `null`.
5. `highlights` are the "How it plays" lines. Each one has `text` and an `icon`: `trace`, `planet`, `helmet`, `replay`, `gift`, `key`, or `hand` (the names in `site.json` `art.icons`). An icon whose entry is empty is left out and the text stays.
6. Leave `stores.ios` and `stores.android` as `null` until the real listing exists. Use a plain `https://` URL with no tracking parameters. The store buttons stay off the page until then. A live game with no store link and no browser build shows a peach "Coming soon" tag and the line "Coming soon to phones and tablets."
7. **Browser build.** The site links no browser build today. Tiny Trails: Space has `play_enabled: false` and no `play_url` or `play_label`, so no page shows a play button, a size note, or other browser-play wording. The old build in `games/space-maze/` was removed on October 28, 2026, with Cassie's approval, and its URL now returns the 404 page. A new game build gets its own `games.json` entry and `play_url` later, when it is ready.
   - `play_url` is the browser build's page on this site, such as `/games/<folder>/`. It must exist, and it cannot point to `/games/tiny-trails-beta/`. Leave it out (or `null`) when there is no browser build. **It is the single setting for every play button.**
   - `play_enabled` must be `true`, `false`, or left out (which counts as `false`); the build stops on anything else. The play button renders only when `play_enabled` is `true` and `play_url` is set. A game with no `play_url`, or with `play_enabled: false`, renders no play button and no size note, and the build runs normally. `play_enabled: true` without a `play_url` stops the build with an error.
   - `play_label` is the button text. It is optional and defaults to "Play in browser".
   - `play_size_note` (for example `about 24 MB, best on Wi-Fi`) shows under the play button on the game page and in the support page's "Playing in the browser" answer. `web_note` shows under "What's free" on the game page and in the support page's unlock answer. Both show only while the play button does.
   - While there is no play button, everything else that talks about playing in the browser is left out too: the home hero button reads "See Tiny Trails: Space" instead of "Play Tiny Trails", the game page's "Questions?" line skips "Playing in the browser", and the support page's "Playing in the browser" question and the `Web Browser` platform in the structured data are hidden.
8. Fill in the game's `art` map (`hero`, `card`, `icon`, `og`, `screenshots`) with files under `assets/games/<id>/`. Each entry carries its own `alt`, like `"hero": { "src": "/assets/games/<id>/hero.webp", "alt": "..." }`. Every picture is optional: leave the entry `null` (or `screenshots` empty) and that picture is left out, with no placeholder. A path that is set must point to a real file, or the build stops. The slots, sizes, and formats are in [Game slots](#game-slots-gamesjson-art). `assets/games/tiny-trails-space/hero.webp` and its source `tt-hero-astro-3.png` are off-model and listed in `site.json` `art.retired`, so the build refuses them.
9. Pick an `accent` color (`#RRGGBB`). It is the thin underline under the game's title.
10. Run `node scripts/render-site.mjs`, then commit `games.json`, the new images, and the generated files (`games/<id>/index.html`, the home page, the games index, `assets/css/themes.css`, and `sitemap.xml`).

`/games/tiny-trails-beta/` is staging. It is not linked, it is omitted from `sitemap.xml`, and `robots.txt` disallows it. Do not add it to `games.json`.

## Privacy

The site does not use analytics, cookies, or third-party fonts. Baloo 2 and Nunito are self-hosted in `assets/fonts/` under the SIL Open Font License. Links that leave the site (email, and store links once they exist) go through a parental gate in `assets/js/site.js`. The menu works without JavaScript. The only other script is the home page's inline Rosie wave swap, allowed by its hash in the CSP.

The privacy policy covers this website only. No game is playable on the site today; every game is coming soon to phones and tablets, and the policy must be updated before any game launches as an app. The explanation of device storage (a game that runs in the browser saves progress on the device, in the browser's storage, and nothing is sent anywhere) appears once, in the policy's "Cookies and device storage" section. The support page's "Deleting data" answer gives only the steps and links to the policy. The no-ads and no-tracking statement appears once in the policy body, in "Ads, tracking, and SDKs", plus the footer's `privacyLine`. When you change the policy text in `scripts/render-site.mjs`, update `POLICY_EFFECTIVE` at the top of the script so the date on the page changes too.
