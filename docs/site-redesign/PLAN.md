# pinkrynostudios.com redesign plan (cycle 1)

Status: proposal for the Studio Director. Nothing here is live. Work happens on the `site-redesign` branch, and nothing goes to `main` without Director approval of a preview. Read with [AUDIT.md](AUDIT.md). The Director's answers to the open questions are in [Cycle 2 decisions](#cycle-2-decisions). Where they differ from the cycle 1 text below, the decisions win.

## Brand: Meadow Path (Oct 28 2026)

Cassie approved the PinkRyno brand, Direction A "Meadow Path", on October 28, 2026, and the site now uses it. It supersedes the cosmic look in [Visual direction](#visual-direction) (the plum and navy palette, Baloo 2 headings, the berry sticker button, the planet-horizon separators, and the background stars). The details are in the README's [Brand](../../README.md#brand-meadow-path-oct-28-2026) section.

- **Studio frame vs game hero.** Every page shares the studio frame: the approved header lockup and the nav, the trust strip "No ads · No tracking · No accounts" on one Sky Wash pill (the page's one privacy line; the old footer privacy line is gone), and the sage hill footer with Rosie's head. Studio pages (home, games, about, support, privacy, 404) are Oat Cream with Deep Moss text, Berry links, and Moss Button buttons, and show no navy, stars, planets, or Space art. Home and 404 open on the Morning Meadow (CSS wash, inline SVG hills, the sand trail from Rosie's feet toward the buttons). A game brings its own world inside its page hero only (`games.json` `world`): Tiny Trails: Space has a navy night sky with the Space art, its title lockup, and a Butter button, and the rest of its page is the studio look. Studio pages show the game by the Tiny Trails wordmark. Rosie stands on the home meadow as a still, and the one waving Rosie is the lazy wave in "Meet Rosie".
- **Fonts.** Fredoka 600 for headlines; Nunito 400, 700, and 800 (800 is the UI weight). Fredoka 600 and Nunito 800 are new latin subsets made with fontTools. Pages preload Fredoka 600 and Nunito 400 only. Baloo 2 is no longer a site font and its file is removed.
- **Icons and manifest.** The brand kit's `/favicon.ico`, `/favicon-32.png`, `/apple-touch-icon-180.png`, and `/site.webmanifest` (with the 192, 512, and maskable 512 icons) at the site root, `theme-color` `#FFF9EE`, and no `favicon.svg`. The old head favicons are removed.
- **Tokens.** `assets/brand/tokens.css` is the brand file minus its three self-referencing aliases (`--color-surface`, `--color-text-muted`, `--color-button-shadow`), which made those variables invalid. `site.css` starts with a verbatim copy, so pages load one stylesheet (`themes.css` and the `accent` colour are gone).
- **Measured** (local build, cache off, uncompressed): home first load is 10 requests and 172.6 KiB on a 390×844 phone at 2x (about 128.5 KiB with gzip on the text files), 11 requests and 146.5 KiB on a 1440×900 desktop at 1x, and 178.7 KiB at 2x. Home loads three fonts (Fredoka 600, Nunito 400 and 800, 45.9 KB); the Tiny Trails and privacy pages also load Nunito 700 for inline links. `site.css` is 33.0 KB raw and 8.5 KB gzip (4.1 KB of it is the copied tokens), over the old 20 KB / 6 KB CSS target, which the previous stylesheet (26.2 KB raw) also exceeded.

## Cycle 2 decisions

Recorded October 27, 2026. The first cycle 2 pass on this branch implements all of them.

1. **Price and what's free.** The one-time unlock is **$0.99**. Free Play is free, and the Sun, Earth, and Moon worlds are free. There is **one shared 3-use trial** of locked content. The web (browser) build contains **the free content only**. These live in `games.json` (`price`, `free_content`, `unlock`, `trial`, `web_note`) and feed the home facts, the game page's "What's free / What the $0.99 unlock adds" columns, the support FAQ, and the `VideoGame` structured data.
2. **Play URL.** `games.json` `play_url` stays `/games/space-maze/`, which is what the live site uses today. It is the single setting for every Play in browser button. Flip it to the sticker-style rebuild's web build when that is ready. `play_size_note` ("about 24 MB, best on Wi-Fi") shows under the button on the game page. **Superseded October 28, 2026 (QA finding SR-01):** the site links no browser build. The Tiny Trails: Space entry has `play_enabled: false` and no `play_url` or `play_label`, so no page shows a play button, size note, or other browser-play wording. `games/space-maze/` (about 52 MB) was removed on October 28, 2026, with Cassie's approval, and its URL now returns the 404 page. A new game build gets its own `games.json` entry and `play_url` later. `play_enabled: true` without a `play_url` stops the build.
3. **Rosie stays as she is.** Her current art and her existing wave, squint, and hop animation stay. Nobody redraws or restyles her. The wave loop is re-exported crisp and lighter (never shown larger than its native size at 1×: 386 px wide on desktop, a 260 px file on phones). The original wave loop stays in the repo untouched. ROSIE-WAVE and ROSIE-WAVE-LOOP are dropped from the art list. **Superseded October 28, 2026:** the owner wants a new Rosie (static and animated) and all site art redone in a new sticker style. See [Art slots](#art-slots). **Done October 28, 2026:** the final approved Rosie AB set replaces the wave re-export, the head export, and every other temporary Rosie file, and the re-export script (`scripts/export-rosie.py`) is removed. See [Rosie art handoff](#rosie-art-handoff).
4. **No stars on Rosie.** `SPARK`, `.spark`, and `floaty` are gone. Rosie's own files (`rosie-full.webp` and the `rosie-wave` loop) have no baked-in stars, so only those SVG stars needed removing. The final Rosie AB files have none either. The only stars are a slow background star field on the home hero band, plus a few faint ones in the footer. Since the first approved art landed, these are the TWINKLE-SET SVG stars (see [First approved art](#first-approved-art-integrated)), drifting 60–120 s each way and static under reduced motion. Nothing sits behind or around Rosie.
5. **Owner details.** `site.json` has `studio.legalName`, `studio.address`, and `studio.supportEmail`. The support email, support@pinkrynostudios.com, is live and appears in the footer, once on the support page, and in the privacy policy's Contact section, always through the parental gate. The legal name and address stay `null` until the owner has them, before the January store launch. The normal build leaves them out cleanly (the privacy page says the studio is an independent game studio in Florida, USA). `node scripts/render-site.mjs --release` refuses to build until all three are set.
6. **No placeholders.** The TODO banners and art slots are gone. Missing art means the section is left out.
7. **Tiny Trails hero art.** `tt-hero-astro-3` (`assets/games/tiny-trails-space/hero.webp` and its source PNG) is off-model, not Astro design #2, and is retired from the site. The files stay in the repo but nothing links them. Until Astro design #2 art arrives, the home game section and the game page hero are text-led, and the `VideoGame` image falls back to the site share image. **Superseded October 28, 2026:** the Astro design #2 key art (TT-HERO) and the share cards arrived and are integrated. See [Second approved art](#second-approved-art-integrated).

## First approved art (integrated)

Recorded October 28, 2026. The Art Director's first approved set is on the site. The source files are in the art handoff folder (`art-for-site/`), and only the files the pages use were copied into the repo.

| ID | Status | In the repo | Used on |
| --- | --- | --- | --- |
| ROSIE-HEAD | **Delivered and integrated. Replaced October 28 by the final Rosie AB head set** under the same names (see [Rosie art handoff](#rosie-art-handoff)) | `assets/mascot/head/`: `rosie-head-64.webp`, `rosie-head-128.webp`, `rosie-head-256.webp`, and `rosie-head-256.png` (Organization `logo` in the JSON-LD) | Header (48 px), footer (64 px), support title (88 px, 64 px on phones). Each `srcset` offers only the files that cover 1x and 2x. |
| Favicon and apple-touch (ROSIE-HEAD) | **Delivered and integrated. Replaced October 28 by the final Rosie AB icons**, plus `/favicon.ico` | `/favicon.ico` (16, 32, and 48 px), `assets/mascot/head/favicon-32.png`, `favicon-48.png` (`<link rel="icon" sizes>`), `apple-touch-icon-180.png` | Every page |
| TWINKLE-SET | **Delivered and integrated** | `assets/twinkle/twinkle-sprite.svg` | Home hero band (13–16 stars depending on width, 2 large glow stars on wide screens only, none near Rosie) and a few faint footer stars. Stars use external `<use>`, so the sprite is one request and the glow filters still render. Positions are classes in `site.css`, because the CSP forbids `style` attributes. |
| ICON-SET | **Delivered and integrated** | `assets/icons/icons-sprite.svg` | Home "For grown-ups" (gift, key, hand) and the game page "How it plays" (trace, planet, helmet, replay) and free/unlock columns (gift, key), at 56 px (48 px on phones), beside the text with no box or tint. They replace the line icons drawn in code, which are removed. |
| MASCOT-LOST | **Delivered and integrated** October 28 with the final Rosie AB set (it was dropped, then the owner asked for a 404 pose with the new Rosie) | `art.rosie.lost`, a slot of its own: `assets/mascot/rosie-puzzled-512.webp`, with `rosie-puzzled-1024.webp` for 2x | 404 |
| TT-HERO (Astro design #2) | **Delivered and integrated** October 28. See [Second approved art](#second-approved-art-integrated) | `assets/games/tiny-trails-space/astro-hero.webp`, `astro-hero-1200.webp` | Home hero band, Tiny Trails page hero band, games index row |
| OG-HOME, OG-TINY-TRAILS | **Delivered and integrated** October 28. OG-HOME was re-delivered with the Rosie AB Rosie | `assets/og/og-home.jpg`, `og-tiny-trails.jpg` | Share images |

On October 28 the final approved Rosie AB set replaced every temporary Rosie file: the ROSIE-HEAD export (with the favicons, apple-touch icon, and logo made from it), the wave re-export, and the old full-body Rosie on About and the 404 page. See [Rosie art handoff](#rosie-art-handoff).

Resolved October 28: the original wave loop had a tiny butter-yellow speck just right of Rosie's raised paw in frames 6, 8, and 14, and the temporary wave re-exports carried it. Those re-exports are replaced by the final Rosie AB wave, which is a new export from new art. In every one of its 28 frames, at both sizes, Rosie is one connected shape with no detached speck and no star.

## Second approved art (integrated)

Recorded October 28, 2026. The Art Director approved the Tiny Trails key art with Astro design #2 and the two share cards.

| ID | Status | In the repo | Used on |
| --- | --- | --- | --- |
| TT-HERO (Astro design #2) | **Delivered and integrated** | `assets/games/tiny-trails-space/astro-hero.webp` (2400×1350, 106 KB) and `astro-hero-1200.webp` (1200×675, 50 KB), copied as delivered. The delivered art is a full navy scene with Astro waving on the right and an empty left half for text, so it fills a hero band; it is not a cut-out. It sits in `site.json` `art.hero` and in the Tiny Trails `art.hero` in `games.json`. | Home hero band, the Tiny Trails page's new hero band, and the games index row (cropped to 4:3 around Astro). The home game section leaves it out, because the hero band right above already shows it. |
| OG-TINY-TRAILS | **Delivered (final) and integrated** | `assets/og/og-tiny-trails.jpg`, re-encoded from the delivered 1200×630 PNG as baseline JPEG quality 87: 116 KB, down from 197 KB, and visually identical at 2× zoom | `og:image` and `twitter:image` (with width, height, and alt) on the Tiny Trails page, and on the games index while it lists only this game |
| OG-HOME | **Delivered and integrated.** Re-delivered October 28 with the Rosie AB Rosie waving beside Astro and the wordmark | `assets/og/og-home.jpg`, re-encoded from the delivered 1200×630 PNG (214 KB) as progressive JPEG quality 85 with 4:2:0 chroma: 113,050 bytes (110 KB). No setting from quality 85 to 92 reached 100 KB (4:4:4 starts at 140 KB), and quality 85 4:2:0 keeps the wordmark and outlines crisp at 6× zoom | Default share image for every other page (`art.og.default`). It replaces `rosie-social.png` |

What changed on the pages:

- **Home hero.** The Astro art is the band's picture (an `<img>` in a `<picture>`). Wider than 960 px, the text sits on the art's empty left side, and the art is as tall as the band (540 px, then 620 px from 1200 px wide), right-aligned in a centred 1440 px frame, fading in from the band colour so there is no seam. Up to 960 px, the art sits above the text, cropped around Astro, and fades into the navy behind the text. Phones always get the 1200 px file. Wider screens get it at 1x too, because the art is drawn at most about 1100 px wide; only 2x screens get the 2400 px file. It is the page's LCP image (`fetchpriority="high"`, with width and height).
- **Hero text contrast**, measured on screenshots with the text hidden, worst pixel under any text line at 390, 820, 961, 1024, 1440, and 1920 px: headline 14.9:1 or more, lede 12.5:1 or more, "For grown-ups" link 13.0:1 or more; on the Tiny Trails band, the title 14.9:1, tagline 12.8:1, and breadcrumb 12.8:1 or more. No text sits over the drawn part of the art, so no extra scrim is needed. The button is white on berry, 6.4:1.
- **Stars.** The TWINKLE-SET stars stay in the home band, moved so that over their whole drift they touch neither the text nor Astro nor any drawn part of the art. This was checked at 19 widths from 360 to 2560 px, with and without hero art.
- **Rosie** no longer competes with Astro. She left the home hero for the home studio section below the fold. The page loads only her still frame; a small inline script swaps in the wave loop when she scrolls near the screen, never under reduced motion (see [Performance budget](#performance-budget)). She stays on About (`rosie.static`), Support (the head), and 404, which now has its own slot, `rosie.lost`.
- **Tiny Trails page.** A hero band like the home page's: breadcrumb, title, and tagline on the art's calm side, then the summary, price line, and store line on the soft band below.

Since October 28, Rosie is the final approved Rosie AB set: her wave animation, the static Rosie on About, her head, the favicons, and her puzzled 404 pose. See [Rosie art handoff](#rosie-art-handoff).

## Art slots

Recorded October 28, 2026. The owner wants a new Rosie (static and animated) and all site art redone in a new sticker style, so every picture on the site is now a swappable slot. All image paths live in one art map: `site.json` `art` for site-wide art, and each game's `art` in `games.json`. `render-site.mjs` and `site.css` name no image files.

To swap art: drop the new files in `assets/…`, point the slot's entry at them, and run `node scripts/render-site.mjs`. An empty slot (`null`) is left out cleanly, with no placeholder, box, or gap, and the build prints a warning that lists the empty slots. A slot that points at a missing file stops the build in every mode. The home hero shows `hero` (the Astro art) and no Rosie. Rosie waves in the home "Meet Rosie" section below the fold: `rosie.animated` if it is set (its still on first load, the wave once she scrolls into view, never under reduced motion), else `rosie.static`, else the head, else the section is text only. An empty `hero` leaves a text-only navy band with the same text layout and stars. The full table, rules, and formats are in the [README's Art slots section](../../README.md#art-slots-swapping-art).

| Slot | Display size | Format | Current file |
| --- | --- | --- | --- |
| `rosie.animated` | Home "Meet Rosie" section: 300 px tall (220 on phones). Stills on first load, by screen density; after scrolling, the wave at the same width as the still on screen | Animated WebP plus a still WebP of exactly the same size; optional smaller pair. Each wave at most about 100 KB (see [Rosie art handoff](#rosie-art-handoff)) | Rosie AB: `rosie-wave-386.webp` / `-386-still.webp`, `rosie-wave-260.webp` / `-260-still.webp` (waves 89 KB and 60 KB) |
| `rosie.static` | About 300 px wide; Meet Rosie fallback | Transparent WebP or PNG, 1x plus optional 2x | Rosie AB: `rosie-full-512.webp` (512×512), `rosie-full-1024.webp` for 2x |
| `rosie.lost` | 404, 240 px wide | Transparent WebP or PNG, 1x plus optional 2x | Rosie AB puzzled pose: `rosie-puzzled-512.webp` (512×512), `rosie-puzzled-1024.webp` for 2x |
| `rosie.head` | 44–88 px | Square WebP or PNG at 64, 128, 256 | Rosie AB: `assets/mascot/head/rosie-head-64.webp`, `-128.webp`, `-256.webp` |
| `faviconIco` | Browser tab (16, 32, and 48 px) | ICO with at least the 16, 32, and 48 px images | Rosie AB: `/favicon.ico` at the site root |
| `favicon32`, `favicon48`, `appleTouch`, `logo` | 32, 48, and 180 px; logo at least 112 px | PNG (logo PNG, JPEG, or WebP) | Rosie AB: `assets/mascot/head/favicon-32.png`, `favicon-48.png`, `apple-touch-icon-180.png`, and `rosie-head-256.png` (logo) |
| `og.default` | 1200×630 | PNG or JPEG | `assets/og/og-home.jpg` (OG-HOME, with the Rosie AB Rosie) |
| `hero` | Home hero band: as tall as the band (540/620 px) past 960 px wide; above the text, at most 560 px tall, up to 960 px | WebP, PNG, or JPEG `src` (2400×1350) plus `srcSmall`, the same picture 1200 wide. Subject on the right, calm left half | `assets/games/tiny-trails-space/astro-hero.webp` + `astro-hero-1200.webp` (TT-HERO) |
| `aboutScene` | Up to 1120 px wide | WebP, PNG, or JPEG, 1x plus optional 2x | Empty |
| `stars`, `icons` | Stars 6–78 px; icons 56 px (48 on phones) | An SVG sprite symbol or an SVG, WebP, or PNG file per entry | TWINKLE-SET and ICON-SET sprites |
| Game `hero`, `card`, `icon`, `og`, `screenshots` | Hero band like the site `hero`, 536 px, 72 px, 1200×630, 400 px wide | See the README | Tiny Trails: Space has `hero` (TT-HERO) and `og` (`og-tiny-trails.jpg`); `card`, `icon`, and `screenshots` are empty |

## Rosie art handoff

Recorded October 28, 2026. Rosie is the mascot for everything. **The final approved Rosie AB set is integrated.** Its source is the art handoff folder (`art-for-site/rosie/`, whose README documents the wave markup), and only the files the pages use were copied into the repo, byte for byte. Every Rosie picture is a slot in `site.json` `art`, so the next Rosie change also drops in without code changes: `render-site.mjs` and `site.css` name no Rosie files. The original Rosie files that are also on `main` were removed from the `site-redesign` branch as unused. They remain on `main` until the branch is merged.

| Slot in `site.json` | Part | Required size and format | Where it appears | File (final Rosie AB set) |
| --- | --- | --- | --- | --- |
| `art.rosie.animated.src` | Wave | Animated WebP that loops forever, transparent background, exactly **386×500**, identical to `still`. **At most about 100 KB** (102,400 bytes) | Home "Meet Rosie" after she scrolls near the screen, wherever the browser chose `still`: 2x desktops and 2x/3x phones | `assets/mascot/rosie-wave-386.webp` (386×500, 28 frames, 3.6 s loop, 89,074 bytes) |
| `art.rosie.animated.still` | Still | Still WebP, transparent background, exactly **386×500**, identical to `src`. The wave's first frame, in the same pose framing | Home "Meet Rosie" on first paint, on 2x desktops and 2x/3x phones. The whole picture under reduced motion or without JavaScript | `assets/mascot/rosie-wave-386-still.webp` (386×500, 22,712 bytes; decodes to exactly frame 0 of the wave) |
| `art.rosie.animated.srcSmall` | Wave | Animated WebP that loops forever, transparent background, exactly **260×337**, identical to `stillSmall`: the same framing as `src`. **At most about 100 KB, ideally about 60 KB or less** | Home "Meet Rosie" after she scrolls near the screen, wherever the browser chose `stillSmall`: 1x screens | `assets/mascot/rosie-wave-260.webp` (260×337, 28 frames, 3.6 s loop, 60,158 bytes) |
| `art.rosie.animated.stillSmall` | Still | Still WebP, transparent background, exactly **260×337**, identical to `srcSmall`. The small wave's first frame, in the same pose framing | Home "Meet Rosie" on first paint, on 1x screens | `assets/mascot/rosie-wave-260-still.webp` (260×337, 14,720 bytes; decodes to exactly frame 0 of the wave) |
| `art.rosie.static` | Still | Transparent WebP or PNG, at least 300×300; optional `src2x` at exactly twice the size | About (300 px wide, about 218 on phones). Home "Meet Rosie" when `animated` is empty | `assets/mascot/rosie-full-512.webp` (512×512, 23,714 bytes), `src2x` `rosie-full-1024.webp` (1024×1024, 52,112 bytes) |
| `art.rosie.head` `64`, `128`, `256` | Head | Square transparent WebP or PNG, exactly 64×64, 128×128, and 256×256 | Header 48 px (44 on phones), footer 64 px, Support title 88 px (64 on phones). Home "Meet Rosie" at 128 px when `animated` and `static` are both empty | `assets/mascot/head/rosie-head-64.webp`, `rosie-head-128.webp`, `rosie-head-256.webp` (3,008, 6,016, and 12,270 bytes). No spot needs the 512 export |
| `art.logo` | Head | PNG (JPEG or WebP also work), at least 112×112; 256×256 PNG suggested | Organization logo in the home page's structured data (search results). Not shown on the page | `assets/mascot/head/rosie-head-256.png` (256×256, 24,989 bytes) |
| `art.faviconIco` | Favicons | ICO with at least the 16, 32, and 48 px images. Its `<link sizes>` lists every size in the file | Browser tab, every page, and browsers that ask for `/favicon.ico` on their own | `/favicon.ico` at the site root (16, 32, and 48 px, 9,592 bytes) |
| `art.favicon32`, `art.favicon48` | Favicons | PNG, exactly 32×32 and 48×48 | Browser tab, every page | `assets/mascot/head/favicon-32.png`, `favicon-48.png` |
| `art.appleTouch` | Favicons | PNG, exactly 180×180 | Phone home-screen icon, every page | `assets/mascot/head/apple-touch-icon-180.png` (Rosie's head on full-bleed cream `#FFF2C8`, fully opaque RGB with square corners; iOS applies its own rounded mask) |
| `art.rosie.lost` | 404 | Transparent WebP or PNG, at least 240 px wide; optional `src2x` at exactly twice the size | The 404 page, above "This page floated off", 240 px wide (56% of the screen on phones), with no box and no stars | `assets/mascot/rosie-puzzled-512.webp` (512×512, 22,934 bytes), `src2x` `rosie-puzzled-1024.webp` (1024×1024, 50,980 bytes). Alt: "Rosie Ryno looking puzzled" |

The site uses the set's `rosie-full` files only for About's `rosie.static`, and does not use `rosie-social` (the share image is OG-HOME).

**The wave deliverable.** Four files, under the names that `site.json` `art.rosie.animated` points at, so the wave needed no `site.json` change:

| File | Size | Format | Bytes | Budget |
| --- | --- | --- | ---: | --- |
| `assets/mascot/rosie-wave-386.webp` | 386×500 | Animated WebP, transparent background, loops forever, 28 frames | 89,074 | At most about 100 KB |
| `assets/mascot/rosie-wave-386-still.webp` | 386×500, identical to the wave | Still WebP, transparent background, the wave's frame 0 | 22,712 | Part of the first load on 2x screens |
| `assets/mascot/rosie-wave-260.webp` | 260×337 | Animated WebP, transparent background, loops forever, 28 frames | 60,158 | At most about 100 KB, ideally about 60 KB or less |
| `assets/mascot/rosie-wave-260-still.webp` | 260×337, identical to the wave | Still WebP, transparent background, the wave's frame 0 | 14,720 | Part of the first load on 1x screens |

Each loop is 3.6 s: two gentle waves of her raised paw, a rest, and one short blink. Her body holds still, and no frame has stars or sparkles. Each wave and its still share one canvas, with Rosie at the same position and scale, and each still is its wave's frame 0, so the swap from still to wave is seamless. The page shows the wave in the still's place, at the same display size and from the same `srcset` width the browser chose for the still, so the swap never lowers her resolution. The 260 pair has the same framing as the 386 pair.

The still and wave share `art.rosie.animated.alt`. `rosie.static` and `rosie.lost` have their own `alt`. The heads, favicons, and logo are decorative. No Rosie file may have stars, sparkles, or text baked in.

To swap Rosie art later:

1. Export the files at the sizes above. Each still is a frame of its wave at exactly the same size, and the small pair is a smaller copy of the large pair with the same shape.
2. Drop them in `assets/mascot/` under new names (for example `assets/mascot/rosie-v2/` and `assets/mascot/rosie-v2/head/`). Leave the old files in place until the new ones are live.
3. Edit `site.json` `art`: point each slot above at its new file, update the `alt` text, and update or remove `width`/`height` (when set, they must match the file). A slot whose new art is not ready keeps its current file, or is set to `null` and left out cleanly (the Meet Rosie section then falls back to the next picture, or shows its text alone).
4. Run `node scripts/render-site.mjs`. It stops and writes nothing if a file is missing, has the wrong format or size, `faviconIco` lacks a 16, 32, or 48 px image, a still does not have exactly the pixel size of its wave (`still` and `src`, `stillSmall` and `srcSmall`), the small pair is not a same-shape smaller copy, one wave or still path ends with another, or Rosie would be drawn larger than her file at 1x (`src` under 300 px tall or `srcSmall` under 220). It lists any empty slots, and warns (and still builds) for each wave file over 100 KB (102,400 bytes), with its name and size.
5. Check Home (desktop and phone, scrolled to Rosie, and with reduced motion), About, Support, the 404 page, and the browser tab icon, then commit the files, `site.json`, and the regenerated pages together.

The wave must stay light: at most about 100 KB per file, ideally about 60 KB or less for `srcSmall`. The final waves are 89,074 and 60,158 bytes, so the build no longer warns. 1x screens download `srcSmall`, and 2x desktops and 2x/3x phones download `src`, the same width as the still each one showed first. The wave never loads on first paint: the page loads only the still, the wave files sit only in data attributes, and the home page's one inline script (allowed by a CSP hash that the build computes) swaps the wave in after the page has loaded, when Rosie comes within 200 px of the screen, and never under reduced motion. It reads the still the browser chose (`img.currentSrc`) and sets the wave from the same `srcset` position, so the swap can never pick a smaller file. The build stops if a wave file appears anywhere that would load it up front, or if `data-wave-srcset` does not mirror the still `srcset` 1:1 (the same widths, in the same order, under the one `sizes`).

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
- `/games/tiny-trails-beta/` keeps working exactly as it is (we don't edit that folder). The beta stays unlisted, out of the sitemap, and disallowed in robots.txt. The old browser build at `games/space-maze/` (about 52 MB) was removed on October 28, 2026, with Cassie's approval. No generated page links any browser build (the Tiny Trails: Space entry in `games.json` has no `play_url` or `play_label`). Its URL, `/games/space-maze/`, now returns the 404 page, and the `Disallow: /games/space-maze/` rule is gone from robots.txt, so crawlers see the 404 and drop the URL. robots.txt keeps only `Disallow: /games/tiny-trails-beta/` and the `Sitemap` line.

## Site structure

```
/                         Home: hero (Astro art + background stars), the game, parent facts, Meet Rosie
/games/tiny-trails-space/ Game page: hero art, how it plays, screenshots, free vs unlock, play/store
/games/                   Kept as a URL (for future themes). Reworked as a gallery; with 1 game it can
                          redirect visually to the game (light list, no placeholder card)
/about/                   The studio: who, why, how we make games (short), Rosie intro
/support/                 Help for grown-ups: email (gated) + FAQ
/privacy/                 Policy (legal page, plain), no TODO banner once owner details are filled
/404.html                 Rosie's puzzled pose (her own slot), two links
/games/space-maze/        REMOVED Oct 28, 2026 (old browser build). Returns the 404 page
/games/tiny-trails-beta/  UNCHANGED (unlisted staging)
```

**Navigation:** keep `Games · About · Support` (text links, no pill highlight; the current page gets an underline). On mobile, use a plain "Menu" text button with no outline that opens a full-width sheet. **Footer:** Rosie head, the tagline, the links Games · About · Support · Privacy, the one privacy line, "Made with care in Florida", and ©.

**Play in browser:** keep linking to `/games/space-maze/`, but first show an interstitial on the game page, a short inline note under the button: "Plays right in your browser · about 24 MB, best on Wi-Fi". We can't add a back link inside the export because that folder is off limits. If the Director wants one later, it's a separate task in the game build. *Superseded October 28, 2026:* the site links no browser build (see [Cycle 2 decisions](#cycle-2-decisions), item 2), and `games/space-maze/` was removed on October 28, 2026, with Cassie's approval, so its URL returns the 404 page (see [Non-negotiables](#non-negotiables-owner-preferences)).

## Page-by-page outline

### Home `/`

1. **Hero (deep-space band).** A full-bleed navy-violet (`#241B45`) band with a slow-floating background star field (CSS-only, 2–3 layers of tiny dots and four-point twinkles drifting at 60–120 s per cycle, paused under `prefers-reduced-motion`). A soft planet horizon curve at the bottom transitions into the light page.
   - Left: H1 **"Calm little adventures for ages 3–6."** One line: "Trace a glowing path, meet a friendly star, and play at your child's pace." One primary button, **Play Tiny Trails** (to the game page), and one text link, **For grown-ups ↓** (anchors to the facts).
   - Right: **Rosie, waving**, on the band with no frame, sparkles, or blob. Her only motion is her own animated wave file, with no added CSS motion. Her shadow is a flat plum ellipse in sticker style, not an airbrush.
   - Mobile: Rosie goes *above* the H1 at about 220 px tall, so the H1 and button stay in the first screen.
   - *Superseded October 28, 2026:* the band's picture is the Astro hero art (TT-HERO), with the text on its calm left side, and on phones and tablets the art sits above the text. Rosie moved to the studio line. See [Second approved art](#second-approved-art-integrated).
2. **The game.** No card. The Tiny Trails key art is cut out and sits on the page (once Astro design #2 art arrives). Next to it are the title, tagline, a peach "Coming soon" tag leading "Ages 3–6 · Free to start · $0.99 one-time unlock", a "More about Tiny Trails" link, and "Coming soon to phones and tablets." The Play in browser button shows only while `play_enabled` is `true` and `play_url` is set (today no browser build is linked, so it never shows). The "Coming soon" tag is the only tag; age and price stay plain text.
3. **For grown-ups.** Three short facts in a row with small sticker icons (outlined, no tinted circles): *Free to start* (Sun, Earth, Moon worlds and two explorers), *One payment, no subscription* (unlock all 10 worlds), *Made for small hands* (big targets, no reading needed, no timers). No privacy line here.
4. **Studio line.** Rosie waving (her still on first load, the wave loop once she scrolls into view, the still only under reduced motion or without JavaScript; the small head when there is no Rosie art) with "PinkRyno Studios is a tiny studio in Florida making calm games for little kids." and a link to About.
   - *Superseded October 28, 2026:* this is now a "Meet Rosie" section: the heading "Meet Rosie", the line "Rosie Ryno is our baby pink rhino. She is the friendly face of PinkRyno Studios.", and the "Meet the studio" link to About. Rosie stands on the page beside the text (above it, centred, on phones), 300 px tall (220 on phones), with no box, panel, or stars. Her still and wave behave as before, and the wave always has the same width as the still the browser chose, on phones too. See [Rosie art handoff](#rosie-art-handoff).
5. Footer.

Target: 4 sections, 0 cards, 1 primary button above the fold, ≤ 250 KB.

### Tiny Trails: Space `/games/tiny-trails-space/`

1. Breadcrumb ("Games / Tiny Trails: Space") in small text.
2. Hero: cut-out key art plus the H1, tagline, age line, the **Play in browser** button with its size note (only while a browser build is linked; none is today), and the store line. Store badges render here once `stores.ios` / `stores.android` are set. *Since October 28:* the delivered key art is a full scene, so the page opens on a hero band like the home page's (breadcrumb, H1, and tagline on the art's calm side), and the summary, age line, buttons, and store line follow on the soft band below. With no hero art, the page keeps the text-led layout.
3. **Screenshots strip.** Three real in-game captures (16:10 or device-shaped) in a horizontal row that scrolls on mobile. These are the *only* framed images on the site, with a rounded corner and a plum outline like the sticker art. Until real captures exist, the section **is omitted** rather than showing placeholders.
4. **How it plays.** Four short lines with small sticker icons (trace, worlds, explorers, replay).
5. **What's free / what the unlock adds.** Two columns, plain text, with the price once known ("$X.XX once").
6. **Questions?** A link to Support.
7. JSON-LD `VideoGame` / `SoftwareApplication` (name, ages 3–6, platform: Web, iOS and Android when live, offers: free plus an in-app purchase), and a per-game OG image.

### Games `/games/`

- With one game: H1 "Games", a short line, then a single wide row with the TT card art (once delivered), title, tagline, the peach "Coming soon" tag with the age and price line, "Coming soon to phones and tablets.", and a link. No placeholder frame. When there are 2+ games, it becomes an open grid of cut-out card art (still no boxed cards). The game's `accent` color is used as a thin underline under the title, not as a card stripe.

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

- Rosie's puzzled pose from her own slot, `art.rosie.lost` (`rosie-puzzled-512.webp`, with the 1024 file for 2x), "This page floated off", and two text links. No box and no stars around her.

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
  - One status tag: a peach "Coming soon" pill (`.status-soon`) leads the age line while a live game has no browser build or store link to offer. Age and price are plain text separated by middots. The store line reads "Coming soon to phones and tablets."
  - Section separators are a single soft planet-horizon curve (SVG, about 1 KB), used at most twice per page.
- **Background stars:** the TWINKLE-SET SVG stars (four-point twinkles and dots, large glow stars rare), drifting out and back over 60–120 s with staggered delays. The drift is their only motion. They live on the hero band's background layer, at fixed positions relative to the band, never over the hero text or the hero art (checked over their whole drift), and under `prefers-reduced-motion` they're static. A few faint ones sit in the empty lower right of the navy footer.
- **Rosie's motion:** *Decided in cycle 2:* keep the existing wave loop, re-exported, with a still frame for reduced motion. *Since October 28, 2026:* the final Rosie AB wave (two gentle paw waves and one blink per 3.6 s loop, her body still), with its frame 0 as the still for first paint and reduced motion. See [Rosie art handoff](#rosie-art-handoff).
- **Photography and screens:** real game captures only. Don't use mockups that misrepresent the game. If the live browser build stays pixel art while the store build is sticker art, show the store build's screens and label the browser version honestly. *Director decision needed:* which build is "Tiny Trails: Space" for the site?

## Art needed from the Art Director

**Every piece of art requested below must match the outlined cosmic sticker style:** deep plum `#2B1E4A` outlines on every shape, flat two-tone cel shading, one soft violet drop shadow down and to the right, and the cosmic candy palette (lavender, peach, mint, butter yellow, sky teal, with navy-violet only for space). The style anchor and prompts are in [`docs/art-requests.md`](../art-requests.md). Deliver **transparent PNG masters at 2× the listed size** and I'll export WebP/AVIF. Nothing should have stars, sparkles, or text baked into a Rosie asset.

Rosie's hero is not on this list. The Director decided her current art and wave animation stay, re-exported crisp (see [Cycle 2 decisions](#cycle-2-decisions)), so ROSIE-WAVE and ROSIE-WAVE-LOOP were removed. Since October 28 the final Rosie AB set replaces that art (see [Rosie art handoff](#rosie-art-handoff)).

The Tiny Trails explorer on the site must be **Astro design #2**: Midjourney job `76179866-926d-4694-803d-68e713e4b88b`, as defined in `docs/art/ART-BIBLE.md` of the tiny-trails-framework repo, branch `rebuild`. The earlier key art `tt-hero-astro-3` is off-model and has been retired from the site, so every TT row below is a new Astro design #2 request.

| ID | Status | What | Deliver (master) | Site export | Used on |
| --- | --- | --- | --- | --- | --- |
| ROSIE-SIT | Not delivered | Rosie sitting, hugging a small lavender planet | PNG transparent, 1000×1000 | WebP 480/960, ≤ 50 KB | About |
| ROSIE-HEAD | **Delivered, integrated** (with favicon 32/48 and apple-touch 180). Replaced October 28 by the final Rosie AB head set, plus `/favicon.ico` (16/32/48) | Head-only portrait, sticker style, front-facing, smiling | PNG transparent, 512×512 | WebP 64/128, favicon 32/48 PNG, apple-touch 180 PNG, SVG if possible | Header, footer, favicon |
| ROSIE-HELP | Not delivered (the support title uses ROSIE-HEAD for now) | Rosie head and shoulders, small friendly "hi" gesture | PNG transparent, 600×600 | WebP 160/320 | Support H1 |
| MASCOT-LOST | **Delivered, integrated** October 28 with the final Rosie AB set: the puzzled pose, `rosie-puzzled-512.webp` with `rosie-puzzled-1024.webp` for 2x, in `art.rosie.lost` | Puzzled Rosie, one hoof raised, no stars | PNG transparent, 1000×1000 | WebP 400/800 | 404 |
| TWINKLE-SET | **Delivered, integrated** | 3 four-point twinkles and 3 tiny dot stars, plum outline, butter, peach and lavender fills, as separate shapes | **SVG** (single path each, no gradients) | inline SVG ≤ 1 KB total | Background star field only |
| PLANET-HORIZON | Not delivered (the code-drawn horizon stays) | Soft curved planet edge (lavender with mint craters) for the hero bottom | **SVG**, 1440×120 viewBox | inline SVG ≤ 2 KB | Hero → page transition |
| ICON-SET | **Delivered, integrated** (replaces the code-drawn icons) | 7 small sticker icons: trace finger, planet, explorer helmet, replay arrow, gift (free), key (unlock), small hand | **SVG**, 64×64 viewBox, plum outline | inline SVG | Home facts, game page |
| TT-HERO | **Delivered, integrated** October 28 as a full scene (2400×1350 and 1200×675 WebP), not a cut-out. See [Second approved art](#second-approved-art-integrated) | Tiny Trails: Space key art with **Astro design #2** on a small planet beside the smiling star, cut out with no background panel. Replaces the retired `tt-hero-astro-3` | PNG transparent, 1600×1400 | WebP 800×700 / 400×350, ≤ 80 KB | Home game section, game page hero (`art.hero`) |
| TT-CARD | Pending (Astro design #2) | Games index card with **Astro design #2** on the glowing moon path | PNG 2560×1600 | WebP 1280×800 / 640×400 | Games index (`art.card`) |
| TT-SCREENS ×3 | Pending (needs the sticker build's capture pass) | **Real captures from the sticker build** showing **Astro design #2** (trace, world select, star at the end), not illustrations | PNG 2400×1500 (16:10) or device-native | WebP 1200×750 / 600×375, ≤ 80 KB each | Game page strip (`art.screenshots`) |
| ABOUT-SCENE | Pending | Already listed: Rosie with a small planet and an astronaut, cut out (no background panel) | PNG transparent, 3200×1800 | WebP 1600×900 / 800×450 | About |
| OG-HOME | **Delivered, integrated** October 28 as `og-home.jpg`. Re-delivered with the Rosie AB Rosie waving beside Astro and the wordmark: progressive JPEG quality 85, 113,050 bytes | Share card: Rosie waving on deep space with the wordmark "PinkRyno Studios" and room for no other text | PNG 1200×630 | **PNG or JPEG** ≤ 200 KB | OG for site pages |
| OG-TINY-TRAILS | **Delivered (final), integrated** October 28 as `og-tiny-trails.jpg` (116 KB) | Share card: the **Astro design #2** TT key art plus the title "Tiny Trails: Space" | PNG 1200×630 | PNG or JPEG ≤ 200 KB | OG for the game page (`art.og`) |
| WORDMARK (optional) | Not delivered | "PinkRyno Studios" lettering in Baloo-like hand style, plum outline | **SVG** | inline SVG ≤ 4 KB | Header and footer |
| STORE-BADGES | Not delivered (needs the store listings) | Official Apple / Google badges (from their brand kits, unmodified) | SVG | SVG | Game page when live |

Cycle 2 status: ROSIE-HEAD (with the favicons and apple-touch icon), ICON-SET, and TWINKLE-SET are delivered and integrated (see [First approved art](#first-approved-art-integrated)). TT-HERO, OG-TINY-TRAILS, and OG-HOME are delivered and integrated (see [Second approved art](#second-approved-art-integrated)). The final Rosie AB set (wave, static, head, favicons, and the 404 pose) is integrated and replaces every earlier Rosie file (see [Rosie art handoff](#rosie-art-handoff)). Pending: TT-CARD and ABOUT-SCENE. The TT screenshots need the sticker build's capture pass.

## Performance budget

| Metric | Budget | Cycle 1 (live site, home) | Cycle 2 with the first approved art | Cycle 2 with TT-HERO and OG (October 28) |
| --- | --- | --- | --- | --- |
| Home page, cold transfer | **≤ 250 KB** | 1.59 MB | ~501 KB desktop, ~350 KB mobile (Rosie's wave loop is 440 / 278 KB of it); ~87 KB with reduced motion | First load, no scrolling: 175 KB desktop 1x, 244 KB desktop 2x, 188 KB phone 2x/3x, the same with reduced motion. That includes Rosie's still (10 KB at 1x, 15 KB at 2x and on phones). Her temporary wave loads only after scrolling to her (+272 KB on 1x screens; +430 KB on 2x desktops and on 2x/3x phones, which now get the wave at the width of their 386 px still), never under reduced motion. Before this swap the first load was 438 / 502 / 445 KB: Chrome started the wave despite `loading="lazy"`, because the studio section is within its ~1250 px lazy-load distance |
| Any content page | ≤ 200 KB | 99–242 KB | 67–146 KB | Tiny Trails 164 KB (1x) / 171 KB (phone) / 228 KB (desktop 2x); games index 151 / 158 / 214 KB; About, Support, Privacy, 404 unchanged |
| Requests per page | ≤ 12 | 9–11 | 10–12 (home 12) | 10–13 (home 13, Tiny Trails 12) |
| Largest image | ≤ 80 KB (hero ≤ 60 KB @2×) | 1.35 MB | 440 KB (the wave loop). `rosie-full.webp` on About and 404 is 72 KB. The new art files are 33 KB or less. | First load: the hero art, 50 KB at 1x and on phones, 106 KB at 2x. After scrolling to Rosie on home: her temporary wave, 272 KB (1x screens) or 430 KB (2x desktops and 2x/3x phones) |
| CSS | ≤ 20 KB raw, single file, ≤ 6 KB gzip | 19.4 KB + themes | 22.1 KB raw, 5.9 KB gzip, + themes | 26.2 KB raw, 7.0 KB gzip (23.3 / 6.3 KB before), + themes |
| JS | ≤ 5 KB, no framework, gate + menu only | 4.4 KB | unchanged | `site.js` unchanged, plus a 740-byte inline script on home only (Rosie's wave swap, allowed by its CSP hash; it picks the wave that matches the still on screen, and the build writes it without indentation): 5,114 bytes, just under 5 KB (5,120 bytes) |
| Fonts | ≤ 3 woff2, ≤ 55 KB total, `font-display: swap`, only display font preloaded | 51 KB | unchanged | unchanged |
| LCP (Lighthouse mobile) | ≤ 1.5 s | 1.2 s | not re-measured | not re-measured. The LCP element is the hero art on Home and Tiny Trails (`fetchpriority="high"`) |
| CLS | 0 | 0 | not re-measured | not re-measured; every picture has width and height |
| Lighthouse | 100 / 100 / 100 / 100 | 100 / 100 / 96 / 100 | not re-measured | not re-measured |

With the final Rosie AB set (October 28; file sizes only, page totals not re-measured): on the home first load, Rosie's still is 14,720 bytes at 1x and 22,712 bytes on 2x desktops and 2x/3x phones (the temporary stills were 10 and 15 KB), and the header and footer heads are 3,008 bytes at 1x and 6,016 bytes at 2x (were 4 and 11 KB). After scrolling to her, the wave is 60,158 bytes on 1x screens and 89,074 bytes on 2x desktops and 2x/3x phones (were 272 and 430 KB), so Rosie's wave is no longer the largest image on the page (the hero art is: 50 KB at 1x and on phones, 106 KB at 2x). About loads `rosie-full-512.webp` (23,714 bytes) at 1x or `rosie-full-1024.webp` (52,112 bytes) at 2x, in place of the 72 KB old full Rosie. The 404 loads `rosie-puzzled-512.webp` (22,934 bytes) or `rosie-puzzled-1024.webp` (50,980 bytes). The inline wave script is unchanged (740 bytes).

Techniques: `<picture>` with `srcset` at 1×/2× (AVIF then WebP, then a PNG fallback), explicit `width`/`height`, `fetchpriority="high"` only on the hero, and `loading="lazy"` below the fold. The star field and the sticker icons are SVG sprites referenced with external `<use>`, one request each, cached across pages. The separators are inline SVG. **Done on `site-redesign`** (QA finding SR-R2): the unused files are removed from the repo: root `pinkrynostudios-mascot.png` and `pinkrynostudios-head.png`, `assets/images/bubbles-*` and `assets/images/favicon.png`, and the old rhino and original Rosie files in `assets/mascot/` (including `assets/mascot/source/`). Nothing linked them, so this was repo hygiene only and page weight is unchanged. They remain on `main` until the branch is merged.

## Accessibility goals

- **WCAG 2.2 AA** across all generated pages.
- Text sits on solid fills only (no gradient washes behind body copy), with 4.5:1 for body and 3:1 for large text and UI. White on berry is 6.4:1, `#FBF8FF` on navy is about 15:1, and plum on page is about 14:1.
- One `h1` per page and no skipped levels. Move the gate dialog's heading out of the static outline (render the `h2` only when it's opened, or use `aria-labelledby` on a non-heading).
- No placeholder art announced to assistive tech. Missing art means the section is omitted.
- Tap targets are ≥ 44×44 for all buttons and nav, and inline links have generous line-height. Focus rings stay visible (`3px` plum plus offset).
- Motion: the background stars stop under `prefers-reduced-motion: reduce`, and Rosie's animated wave is never loaded (she keeps her still, and goes back to it if the setting turns on after the wave started). Rosie has no CSS motion of her own. No motion is faster than 4 s per cycle, and nothing flashes.
- Alt text: Rosie gets a short, page-specific alt ("Rosie Ryno waving hello"). Decorative heads, twinkles, and icons use `alt=""` or `aria-hidden`.
- Keyboard: the menu works without JS (the existing checkbox pattern) and the gate traps focus while open.
- Verify with Lighthouse, axe (run locally, not shipped), and a VoiceOver pass on iOS Safari.

## SEO and sharing

- Per-page titles and descriptions, written for parents ("Tiny Trails: Space, a calm tracing game for ages 3–6").
- OG images in PNG/JPEG: OG-HOME (with the Rosie AB Rosie) for site pages, and OG-TINY-TRAILS (from `games.json` `art.og`) for the game page and for the games index while it lists one game. Each page sets `og:image` with its width, height, type, and alt, plus `twitter:image` and `twitter:image:alt`, as absolute `https://pinkrynostudios.com/` URLs.
- JSON-LD: Organization (existing), plus `VideoGame` on game pages.
- `sitemap.xml` lastmod comes from the render date (or git), not a constant. The beta exclusion stays unchanged: `robots.txt` keeps `Disallow: /games/tiny-trails-beta/`. The `Disallow: /games/space-maze/` rule was removed along with the build on October 28, 2026, so crawlers see the 404 and drop the URL. `robots.txt` now has only the beta rule and the `Sitemap` line.

## Fit with the static generator

Keep the current model: **`games.json` + `site.json` → `node scripts/render-site.mjs` → committed HTML.** No new dependencies and no build step on Pages.

Changes to `render-site.mjs` (cycle 2, on this branch):

1. **Remove `SPARK`** and its use in `mascotStage()`. Add a `starField()` partial used only in the hero band.
2. **Remove `reviewNote()`** output. Owner details move to `site.json` (`studio.legalName`, `studio.address`, `studio.supportEmail`), and the privacy page renders them. *Cycle 2:* the normal build leaves out what is missing, and `--release` refuses to build until all three are set, so the store-launch build can't ship without them.
3. **`media()` omits missing art** instead of rendering an art slot (behind a `--preview-slots` flag for local art reviews only).
4. A **`site.json` `art` map** holds every site-wide picture (Rosie static, animated, and head, favicons, logo, share image, hero, stars, icons), and each game's `art` in `games.json` holds its pictures. This replaces the planned `mascot.poses`. See [Art slots](#art-slots).
5. **`games.json` additions:** `price` (string or null), `size_note` (for example "about 24 MB"), `art.og`, `art.screenshots` with real captures (renamed from `art.screens`), and `platforms`. Drop `art_slots` from page output.
6. A single privacy line in the footer from `site.json` `privacyLine`. Strip privacy phrases from `description` / `facts`.
7. Card markup becomes "open" rows (`.game-row`) instead of `.card`/`.chip`, and `themes.css` keeps generating the accent as a title underline.
8. CSS rewrite: one `site.css` (about 15 KB) with tokens, layout, hero band, star field, buttons, prose, and FAQ rows. Remove the chip, frame, art-slot, spark, review-note, and short-version styles.
9. Don't touch `games/tiny-trails-beta/` or `CNAME`. `games/space-maze/` was removed on October 28, 2026, with Cassie's approval, and its URL returns the 404 page. Keep `RESERVED` as is, so `space-maze` stays a reserved path the build never writes.

## Rollout

1. **Cycle 2:** build on `site-redesign` with the current art (Rosie's existing wave loop, re-exported), then share a branch preview (run `npx serve` locally and send screenshots, or the Director's preferred preview method) for approval.
2. Swap in the Art Director's assets as they land, re-run the generator, and re-run `tools/audit.mjs` against the preview to check the budget and the boxes count.
3. The Director approves and the owner merges. I won't merge or push to `main`.

## Decisions needed from the Director or owner

Items 1–4 were answered in cycle 2 (see [Cycle 2 decisions](#cycle-2-decisions)). What is still open:

1. **Legal name and mailing address** for the Privacy page, from the owner, before the January store launch. The support email is confirmed and live.
2. **When a browser build is linked again.** No browser build is linked today. A new game build gets its own `games.json` entry and `play_url` when it is ready.
3. Whether to keep `/games/` in the nav while there's only one game. It stays for now.
