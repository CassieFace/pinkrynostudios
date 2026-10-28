# pinkrynostudios.com redesign plan (cycle 1)

Status: proposal for the Studio Director. Nothing here is live. Work happens on the `site-redesign` branch, and nothing goes to `main` without Director approval of a preview. Read with [AUDIT.md](AUDIT.md). The Director's answers to the open questions are in [Cycle 2 decisions](#cycle-2-decisions). Where they differ from the cycle 1 text below, the decisions win.

## Cycle 2 decisions

Recorded October 27, 2026. The first cycle 2 pass on this branch implements all of them.

1. **Price and what's free.** The one-time unlock is **$0.99**. Free Play is free, and the Sun, Earth, and Moon worlds are free. There is **one shared 3-use trial** of locked content. The web (browser) build contains **the free content only**. These live in `games.json` (`price`, `free_content`, `unlock`, `trial`, `web_note`) and feed the home facts, the game page's "What's free / What the $0.99 unlock adds" columns, the support FAQ, and the `VideoGame` structured data.
2. **Play URL.** `games.json` `play_url` stays `/games/space-maze/`, which is what the live site uses today. It is the single setting for every Play in browser button. Flip it to the sticker-style rebuild's web build when that is ready. `play_size_note` ("about 24 MB, best on Wi-Fi") shows under the button on the game page.
3. **Rosie stays as she is.** Her current art and her existing wave, squint, and hop animation stay. Nobody redraws or restyles her. The wave loop is re-exported crisp and lighter by `scripts/export-rosie.py` (never shown larger than its native size at 1×: 386 px wide on desktop, a 260 px file on phones). The original `rosie-wave.webp` stays in the repo untouched. ROSIE-WAVE and ROSIE-WAVE-LOOP are dropped from the art list. **Superseded October 28, 2026:** the owner wants a new Rosie (static and animated) and all site art redone in a new sticker style. The wave re-export and the head export are temporary until the new Rosie arrives. See [Art slots](#art-slots).
4. **No stars on Rosie.** `SPARK`, `.spark`, and `floaty` are gone. Rosie's own files (`rosie-full.webp` and the `rosie-wave` loop) have no baked-in stars, so only those SVG stars needed removing. The only stars are a slow background star field on the home hero band, plus a few faint ones in the footer. Since the first approved art landed, these are the TWINKLE-SET SVG stars (see [First approved art](#first-approved-art-integrated)), drifting 60–120 s each way and static under reduced motion. Nothing sits behind or around Rosie.
5. **Owner details.** `site.json` has `studio.legalName`, `studio.address`, and `studio.supportEmail`. The support email, support@pinkrynostudios.com, is live and appears in the footer, once on the support page, and in the privacy policy's Contact section, always through the parental gate. The legal name and address stay `null` until the owner has them, before the January store launch. The normal build leaves them out cleanly (the privacy page says the studio is an independent game studio in Florida, USA). `node scripts/render-site.mjs --release` refuses to build until all three are set.
6. **No placeholders.** The TODO banners and art slots are gone. Missing art means the section is left out.
7. **Tiny Trails hero art.** `tt-hero-astro-3` (`assets/games/tiny-trails-space/hero.webp` and its source PNG) is off-model, not Astro design #2, and is retired from the site. The files stay in the repo but nothing links them. Until Astro design #2 art arrives, the home game section and the game page hero are text-led, and the `VideoGame` image falls back to the site share image. **Superseded October 28, 2026:** the Astro design #2 key art (TT-HERO) and the share cards arrived and are integrated. See [Second approved art](#second-approved-art-integrated).

## First approved art (integrated)

Recorded October 28, 2026. The Art Director's first approved set is on the site. The source files are in the art handoff folder (`art-for-site/`), and only the files the pages use were copied into the repo.

| ID | Status | In the repo | Used on |
| --- | --- | --- | --- |
| ROSIE-HEAD | **Delivered and integrated** | `assets/mascot/head/`: `rosie-head-64.webp` and `rosie-head-128.webp` (as delivered, WebP quality 90), `rosie-head-256.webp` (encoded from the delivered 256 PNG with the same settings), and `rosie-head-256.png` (Organization `logo` in the JSON-LD). The 512 export is not used because it is an upscale. | Header (48 px), footer and home studio line (64 px), support title (88 px, 64 px on phones). Each `srcset` offers only the files that cover 1x and 2x. |
| Favicon and apple-touch (ROSIE-HEAD) | **Delivered and integrated** | `assets/mascot/head/favicon-32.png`, `favicon-48.png` (`<link rel="icon" sizes>`), `apple-touch-icon-180.png` (opaque, on `#FBF8FF`) | Every page |
| TWINKLE-SET | **Delivered and integrated** | `assets/twinkle/twinkle-sprite.svg` | Home hero band (13–16 stars depending on width, 2 large glow stars on wide screens only, none near Rosie) and a few faint footer stars. Stars use external `<use>`, so the sprite is one request and the glow filters still render. Positions are classes in `site.css`, because the CSP forbids `style` attributes. |
| ICON-SET | **Delivered and integrated** | `assets/icons/icons-sprite.svg` | Home "For grown-ups" (gift, key, hand) and the game page "How it plays" (trace, planet, helmet, replay) and free/unlock columns (gift, key), at 56 px (48 px on phones), beside the text with no box or tint. They replace the line icons drawn in code, which are removed. |
| MASCOT-LOST | **Pending the new Rosie** (it was dropped, then the owner asked for a 404 pose with the new Rosie) | `art.rosie.lost`, a slot of its own, filled for now with `rosie-full.webp` | 404 |
| TT-HERO (Astro design #2) | **Delivered and integrated** October 28. See [Second approved art](#second-approved-art-integrated) | `assets/games/tiny-trails-space/astro-hero.webp`, `astro-hero-1200.webp` | Home hero band, Tiny Trails page hero band, games index row |
| OG-HOME, OG-TINY-TRAILS | **Delivered and integrated** October 28 (OG-HOME is provisional) | `assets/og/og-home.jpg`, `og-tiny-trails.jpg` | Share images |

Since October 28, every Rosie file is temporary, pending the new Rosie: the ROSIE-HEAD export (with the favicons, apple-touch icon, and logo made from it), the wave re-export, and `rosie-full.webp` (About and the 404 slot). See [Art slots](#art-slots).

Known issue in existing art, left unchanged: the approved wave loop `rosie-wave.webp` has a tiny butter-yellow speck (about 3–5 px) just right of Rosie's raised paw in frames 6, 8, and 14. It carries into `rosie-wave-386.webp` and `rosie-wave-260.webp`. It looks like a leftover of the removed baked-in stars. Fixing it means editing those frames, which needs the Director's approval.

## Second approved art (integrated)

Recorded October 28, 2026. The Art Director approved the Tiny Trails key art with Astro design #2 and the two share cards.

| ID | Status | In the repo | Used on |
| --- | --- | --- | --- |
| TT-HERO (Astro design #2) | **Delivered and integrated** | `assets/games/tiny-trails-space/astro-hero.webp` (2400×1350, 106 KB) and `astro-hero-1200.webp` (1200×675, 50 KB), copied as delivered. The delivered art is a full navy scene with Astro waving on the right and an empty left half for text, so it fills a hero band; it is not a cut-out. It sits in `site.json` `art.hero` and in the Tiny Trails `art.hero` in `games.json`. | Home hero band, the Tiny Trails page's new hero band, and the games index row (cropped to 4:3 around Astro). The home game section leaves it out, because the hero band right above already shows it. |
| OG-TINY-TRAILS | **Delivered (final) and integrated** | `assets/og/og-tiny-trails.jpg`, re-encoded from the delivered 1200×630 PNG as baseline JPEG quality 87: 116 KB, down from 197 KB, and visually identical at 2× zoom | `og:image` and `twitter:image` (with width, height, and alt) on the Tiny Trails page, and on the games index while it lists only this game |
| OG-HOME | **Delivered (provisional) and integrated** | `assets/og/og-home.jpg`, same encoding, 116 KB | Default share image for every other page (`art.og.default`). It replaces `rosie-social.png` |

What changed on the pages:

- **Home hero.** The Astro art is the band's picture (an `<img>` in a `<picture>`). Wider than 960 px, the text sits on the art's empty left side, and the art is as tall as the band (540 px, then 620 px from 1200 px wide), right-aligned in a centred 1440 px frame, fading in from the band colour so there is no seam. Up to 960 px, the art sits above the text, cropped around Astro, and fades into the navy behind the text. Phones always get the 1200 px file. Wider screens get it at 1x too, because the art is drawn at most about 1100 px wide; only 2x screens get the 2400 px file. It is the page's LCP image (`fetchpriority="high"`, with width and height).
- **Hero text contrast**, measured on screenshots with the text hidden, worst pixel under any text line at 390, 820, 961, 1024, 1440, and 1920 px: headline 14.9:1 or more, lede 12.5:1 or more, "For grown-ups" link 13.0:1 or more; on the Tiny Trails band, the title 14.9:1, tagline 12.8:1, and breadcrumb 12.8:1 or more. No text sits over the drawn part of the art, so no extra scrim is needed. The button is white on berry, 6.4:1.
- **Stars.** The TWINKLE-SET stars stay in the home band, moved so that over their whole drift they touch neither the text nor Astro nor any drawn part of the art. This was checked at 19 widths from 360 to 2560 px, with and without hero art.
- **Rosie** no longer competes with Astro. She left the home hero for the home studio section below the fold. The page loads only her still frame; a small inline script swaps in the wave loop when she scrolls near the screen, never under reduced motion (see [Performance budget](#performance-budget)). She stays on About (`rosie.static`), Support (the head), and 404, which now has its own slot, `rosie.lost`.
- **Tiny Trails page.** A hero band like the home page's: breadcrumb, title, and tagline on the art's calm side, then the summary, price line, and store line on the soft band below.

The current Rosie is a temporary slot fill. The new Rosie, her wave animation, the favicons made from her, and her 404 pose are still to come.

## Art slots

Recorded October 28, 2026. The owner wants a new Rosie (static and animated) and all site art redone in a new sticker style, so every picture on the site is now a swappable slot. All image paths live in one art map: `site.json` `art` for site-wide art, and each game's `art` in `games.json`. `render-site.mjs` and `site.css` name no image files.

To swap art: drop the new files in `assets/…`, point the slot's entry at them, and run `node scripts/render-site.mjs`. An empty slot (`null`) is left out cleanly, with no placeholder, box, or gap, and the build prints a warning that lists the empty slots. A slot that points at a missing file stops the build in every mode. The home hero shows `hero` (the Astro art) and no Rosie. Rosie waves in the home "Meet Rosie" section below the fold: `rosie.animated` if it is set (its still on first load, the wave once she scrolls into view, never under reduced motion), else `rosie.static`, else the head, else the section is text only. An empty `hero` leaves a text-only navy band with the same text layout and stars. The full table, rules, and formats are in the [README's Art slots section](../../README.md#art-slots-swapping-art).

| Slot | Display size | Format | Current file |
| --- | --- | --- | --- |
| `rosie.animated` | Home "Meet Rosie" section: 300 px tall (220 on phones). Stills on first load, by screen density; after scrolling, the wave by density on desktops and the small wave on phones | Animated WebP plus a same-size still WebP; optional smaller pair. Keep both animated files light | **Temporary, pending the new Rosie:** `rosie-wave-386.webp` / `-386-still.webp`, `rosie-wave-260.webp` / `-260-still.webp` |
| `rosie.static` | About 300 px wide; Meet Rosie fallback | Transparent WebP or PNG, 1x plus optional 2x | **Temporary:** `rosie-full.webp` (370×500) |
| `rosie.lost` | 404, 240 px wide | Transparent WebP or PNG, 1x plus optional 2x | **Temporary, pending the new Rosie's 404 pose:** `rosie-full.webp` |
| `rosie.head` | 44–88 px | Square WebP or PNG at 64, 128, 256 | **Temporary, pending the new Rosie:** `assets/mascot/head/rosie-head-*.webp` |
| `favicon32`, `favicon48`, `appleTouch`, `logo` | 32, 48, and 180 px; logo at least 112 px | PNG (logo PNG, JPEG, or WebP) | **Temporary:** made from the head export |
| `og.default` | 1200×630 | PNG or JPEG | `assets/og/og-home.jpg` (OG-HOME, provisional) |
| `hero` | Home hero band: as tall as the band (540/620 px) past 960 px wide; above the text, at most 560 px tall, up to 960 px | WebP, PNG, or JPEG `src` (2400×1350) plus `srcSmall`, the same picture 1200 wide. Subject on the right, calm left half | `assets/games/tiny-trails-space/astro-hero.webp` + `astro-hero-1200.webp` (TT-HERO) |
| `aboutScene` | Up to 1120 px wide | WebP, PNG, or JPEG, 1x plus optional 2x | Empty |
| `stars`, `icons` | Stars 6–78 px; icons 56 px (48 on phones) | An SVG sprite symbol or an SVG, WebP, or PNG file per entry | TWINKLE-SET and ICON-SET sprites |
| Game `hero`, `card`, `icon`, `og`, `screenshots` | Hero band like the site `hero`, 536 px, 72 px, 1200×630, 400 px wide | See the README | Tiny Trails: Space has `hero` (TT-HERO) and `og` (`og-tiny-trails.jpg`); `card`, `icon`, and `screenshots` are empty |

## Rosie art handoff

Recorded October 28, 2026. Rosie is the mascot for everything, and a new Rosie set is on its way. Every Rosie picture is a slot in `site.json` `art`, so the new set drops in without code changes: `render-site.mjs` and `site.css` name no Rosie files. Every current file is the **temporary, original Rosie**.

| Slot in `site.json` | Part | Required size and format | Where it appears | Current file (temporary, original Rosie) |
| --- | --- | --- | --- | --- |
| `art.rosie.animated.still` | Still | WebP, exactly the size of `src`: 386×500 (at least 300 px tall) | Home "Meet Rosie" on first paint, on 2x desktops and phones. The whole picture under reduced motion or without JavaScript | `assets/mascot/rosie-wave-386-still.webp` (386×500, 15 KB) |
| `art.rosie.animated.stillSmall` | Still | WebP, exactly the size of `srcSmall`: 260×337 (at least 220 px tall), the same shape as `still` | Home "Meet Rosie" on first paint, on 1x desktops | `assets/mascot/rosie-wave-260-still.webp` (260×337, 10 KB) |
| `art.rosie.static` | Still | Transparent WebP or PNG, at least 300×300 (386×500 fits); optional `src2x` at exactly twice the size | About (300 px wide, about 218 on phones). Home "Meet Rosie" when `animated` is empty | `assets/mascot/rosie-full.webp` (370×500, 72 KB) |
| `art.rosie.animated.src` | Wave | Animated WebP, 386×500, the same size as `still` | Home "Meet Rosie" after she scrolls near the screen, on 2x desktops | `assets/mascot/rosie-wave-386.webp` (386×500, 430 KB) |
| `art.rosie.animated.srcSmall` | Wave | Animated WebP, 260×337, the same size as `stillSmall` and the same shape as `src`. **Target under ~150 KB** | Home "Meet Rosie" after she scrolls near the screen, on 1x desktops and on every phone (up to 760 px wide) | `assets/mascot/rosie-wave-260.webp` (260×337, 272 KB, over the target) |
| `art.rosie.head` `64`, `128`, `256` | Head | Square transparent WebP or PNG, exactly 64×64, 128×128, and 256×256 | Header 48 px (44 on phones), footer 64 px, Support title 88 px (64 on phones). Home "Meet Rosie" at 128 px when `animated` and `static` are both empty | `assets/mascot/head/rosie-head-64.webp`, `rosie-head-128.webp`, `rosie-head-256.webp` |
| `art.logo` | Head | PNG (JPEG or WebP also work), at least 112×112; 256×256 PNG suggested | Organization logo in the home page's structured data (search results). Not shown on the page | `assets/mascot/head/rosie-head-256.png` |
| `art.favicon32`, `art.favicon48` | Favicons | PNG, exactly 32×32 and 48×48 | Browser tab, every page | `assets/mascot/head/favicon-32.png`, `favicon-48.png` |
| `art.appleTouch` | Favicons | PNG, exactly 180×180, opaque (on `#FBF8FF`) | Phone home-screen icon, every page | `assets/mascot/head/apple-touch-icon-180.png` |
| `art.rosie.lost` | 404 | Transparent WebP or PNG, at least 240 px wide; optional `src2x` at exactly twice the size | The 404 page, above "This page floated off", 240 px wide (56% of the screen on phones) | `assets/mascot/rosie-full.webp`, the same file as `rosie.static`, until the new 404 pose arrives |

The still and wave share `art.rosie.animated.alt`. `rosie.static` and `rosie.lost` have their own `alt`. The heads, favicons, and logo are decorative. No Rosie file may have stars, sparkles, or text baked in.

To swap in the new Rosie:

1. Export the files at the sizes above. Each still is a frame of its wave at exactly the same size, and the small pair is a scaled copy of the large pair with the same shape.
2. Drop them in `assets/mascot/` under new names (for example `assets/mascot/rosie-v2/` and `assets/mascot/rosie-v2/head/`). Leave the old files in place until the new ones are live.
3. Edit `site.json` `art`: point each slot above at its new file, update the `alt` text, and update or remove `width`/`height` (when set, they must match the file). A slot whose new art is not ready keeps its current file, or is set to `null` and left out cleanly (the Meet Rosie section then falls back to the next picture, or shows its text alone).
4. Run `node scripts/render-site.mjs`. It stops and writes nothing if a file is missing, has the wrong format or size, a still does not match its wave, the small pair is not a same-shape smaller copy, or Rosie would be drawn larger than her file at 1x (`src` under 300 px tall or `srcSmall` under 220). It lists any empty slots.
5. Check Home (desktop and phone, scrolled to Rosie, and with reduced motion), About, Support, the 404 page, and the browser tab icon, then commit the files, `site.json`, and the regenerated pages together.

The wave must stay light. Phones and 1x desktops download `srcSmall`, so it should come in under about 150 KB; keep `src` as light as the loop allows. The wave never loads on first paint: the page loads only the still, the wave files sit only in data attributes, and the home page's one inline script (allowed by a CSP hash that the build computes) swaps the wave in after the page has loaded, when Rosie comes within 200 px of the screen, and never under reduced motion. The build stops if a wave file appears anywhere that would load it up front.

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
/                         Home: hero (Astro art + background stars), the game, parent facts, Meet Rosie
/games/tiny-trails-space/ Game page: hero art, how it plays, screenshots, free vs unlock, play/store
/games/                   Kept as a URL (for future themes). Reworked as a gallery; with 1 game it can
                          redirect visually to the game (light list, no placeholder card)
/about/                   The studio: who, why, how we make games (short), Rosie intro
/support/                 Help for grown-ups: email (gated) + FAQ
/privacy/                 Policy (legal page, plain), no TODO banner once owner details are filled
/404.html                 Rosie (her own slot; the puzzled pose comes with the new Rosie), two links
/games/space-maze/        UNCHANGED (live browser build)
/games/tiny-trails-beta/  UNCHANGED (unlisted staging)
```

**Navigation:** keep `Games · About · Support` (text links, no pill highlight; the current page gets an underline). On mobile, use a plain "Menu" text button with no outline that opens a full-width sheet. **Footer:** Rosie head, the tagline, the links Games · About · Support · Privacy, the one privacy line, "Made with care in Florida", and ©.

**Play in browser:** keep linking to `/games/space-maze/`, but first show an interstitial on the game page, a short inline note under the button: "Plays right in your browser · about 24 MB, best on Wi-Fi". We can't add a back link inside the export because that folder is off limits. If the Director wants one later, it's a separate task in the game build.

## Page-by-page outline

### Home `/`

1. **Hero (deep-space band).** A full-bleed navy-violet (`#241B45`) band with a slow-floating background star field (CSS-only, 2–3 layers of tiny dots and four-point twinkles drifting at 60–120 s per cycle, paused under `prefers-reduced-motion`). A soft planet horizon curve at the bottom transitions into the light page.
   - Left: H1 **"Calm little adventures for ages 3–6."** One line: "Trace a glowing path, meet a friendly star, and play at your child's pace." One primary button, **Play Tiny Trails** (to the game page), and one text link, **For grown-ups ↓** (anchors to the facts).
   - Right: **Rosie, waving**, on the band with no frame, sparkles, or blob. Her only motion is her own animated wave file, with no added CSS motion. Her shadow is a flat plum ellipse in sticker style, not an airbrush.
   - Mobile: Rosie goes *above* the H1 at about 220 px tall, so the H1 and button stay in the first screen.
   - *Superseded October 28, 2026:* the band's picture is the Astro hero art (TT-HERO), with the text on its calm left side, and on phones and tablets the art sits above the text. Rosie moved to the studio line. See [Second approved art](#second-approved-art-integrated).
2. **The game.** No card. The Tiny Trails key art is cut out and sits on the page (once Astro design #2 art arrives). Next to it are the title, tagline, a peach "Coming soon" tag leading "Ages 3–6 · Free to start · $0.99 one-time unlock", a "More about Tiny Trails" link, and "Coming soon to phones and tablets." The Play in browser button shows only while `play_enabled` is `true` (it is `false` today). The "Coming soon" tag is the only tag; age and price stay plain text.
3. **For grown-ups.** Three short facts in a row with small sticker icons (outlined, no tinted circles): *Free to start* (Sun, Earth, Moon worlds and two explorers), *One payment, no subscription* (unlock all 10 worlds), *Made for small hands* (big targets, no reading needed, no timers). No privacy line here.
4. **Studio line.** Rosie waving (her still on first load, the wave loop once she scrolls into view, the still only under reduced motion or without JavaScript; the small head when there is no Rosie art) with "PinkRyno Studios is a tiny studio in Florida making calm games for little kids." and a link to About.
   - *Superseded October 28, 2026:* this is now a "Meet Rosie" section: the heading "Meet Rosie", the line "Rosie Ryno is our baby pink rhino. She waves hello in every PinkRyno game.", and the "Meet the studio" link to About. Rosie stands on the page beside the text (above it, centred, on phones), 300 px tall (220 on phones), with no box, panel, or stars. Her still and wave behave as before, except that phones always get the small wave. See [Rosie art handoff](#rosie-art-handoff).
5. Footer.

Target: 4 sections, 0 cards, 1 primary button above the fold, ≤ 250 KB.

### Tiny Trails: Space `/games/tiny-trails-space/`

1. Breadcrumb ("Games / Tiny Trails: Space") in small text.
2. Hero: cut-out key art plus the H1, tagline, age line, the **Play in browser** button with its size note, and the store line. Store badges render here once `stores.ios` / `stores.android` are set. *Since October 28:* the delivered key art is a full scene, so the page opens on a hero band like the home page's (breadcrumb, H1, and tagline on the art's calm side), and the summary, age line, buttons, and store line follow on the soft band below. With no hero art, the page keeps the text-led layout.
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

- Rosie from her own slot, `art.rosie.lost` (for now the existing full art; the new Rosie's 404 pose goes there), "This page floated off", and two text links. No stars around her.

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
- **Rosie's motion:** *Decided in cycle 2:* keep the existing wave loop, re-exported by `scripts/export-rosie.py`, with a still frame for reduced motion.
- **Photography and screens:** real game captures only. Don't use mockups that misrepresent the game. If the live browser build stays pixel art while the store build is sticker art, show the store build's screens and label the browser version honestly. *Director decision needed:* which build is "Tiny Trails: Space" for the site?

## Art needed from the Art Director

**Every piece of art requested below must match the outlined cosmic sticker style:** deep plum `#2B1E4A` outlines on every shape, flat two-tone cel shading, one soft violet drop shadow down and to the right, and the cosmic candy palette (lavender, peach, mint, butter yellow, sky teal, with navy-violet only for space). The style anchor and prompts are in [`docs/art-requests.md`](../art-requests.md). Deliver **transparent PNG masters at 2× the listed size** and I'll export WebP/AVIF. Nothing should have stars, sparkles, or text baked into a Rosie asset.

Rosie's hero is not on this list. The Director decided her current art and wave animation stay, re-exported crisp (see [Cycle 2 decisions](#cycle-2-decisions)), so ROSIE-WAVE and ROSIE-WAVE-LOOP were removed.

The Tiny Trails explorer on the site must be **Astro design #2**: Midjourney job `76179866-926d-4694-803d-68e713e4b88b`, as defined in `docs/art/ART-BIBLE.md` of the tiny-trails-framework repo, branch `rebuild`. The earlier key art `tt-hero-astro-3` is off-model and has been retired from the site, so every TT row below is a new Astro design #2 request.

| ID | Status | What | Deliver (master) | Site export | Used on |
| --- | --- | --- | --- | --- | --- |
| ROSIE-SIT | Not delivered | Rosie sitting, hugging a small lavender planet | PNG transparent, 1000×1000 | WebP 480/960, ≤ 50 KB | About |
| ROSIE-HEAD | **Delivered, integrated** (with favicon 32/48 and apple-touch 180) | Head-only portrait, sticker style, front-facing, smiling | PNG transparent, 512×512 | WebP 64/128, favicon 32/48 PNG, apple-touch 180 PNG, SVG if possible | Header, footer, favicon |
| ROSIE-HELP | Not delivered (the support title uses ROSIE-HEAD for now) | Rosie head and shoulders, small friendly "hi" gesture | PNG transparent, 600×600 | WebP 160/320 | Support H1 |
| MASCOT-LOST | **Pending the new Rosie** (404 pose). The 404 page has its own slot, `art.rosie.lost`, filled for now with Rosie's existing art | Puzzled Rosie, one hoof raised, no stars | PNG transparent, 1000×1000 | WebP 400/800 | 404 |
| TWINKLE-SET | **Delivered, integrated** | 3 four-point twinkles and 3 tiny dot stars, plum outline, butter, peach and lavender fills, as separate shapes | **SVG** (single path each, no gradients) | inline SVG ≤ 1 KB total | Background star field only |
| PLANET-HORIZON | Not delivered (the code-drawn horizon stays) | Soft curved planet edge (lavender with mint craters) for the hero bottom | **SVG**, 1440×120 viewBox | inline SVG ≤ 2 KB | Hero → page transition |
| ICON-SET | **Delivered, integrated** (replaces the code-drawn icons) | 7 small sticker icons: trace finger, planet, explorer helmet, replay arrow, gift (free), key (unlock), small hand | **SVG**, 64×64 viewBox, plum outline | inline SVG | Home facts, game page |
| TT-HERO | **Delivered, integrated** October 28 as a full scene (2400×1350 and 1200×675 WebP), not a cut-out. See [Second approved art](#second-approved-art-integrated) | Tiny Trails: Space key art with **Astro design #2** on a small planet beside the smiling star, cut out with no background panel. Replaces the retired `tt-hero-astro-3` | PNG transparent, 1600×1400 | WebP 800×700 / 400×350, ≤ 80 KB | Home game section, game page hero (`art.hero`) |
| TT-CARD | Pending (Astro design #2) | Games index card with **Astro design #2** on the glowing moon path | PNG 2560×1600 | WebP 1280×800 / 640×400 | Games index (`art.card`) |
| TT-SCREENS ×3 | Pending (needs the sticker build's capture pass) | **Real captures from the sticker build** showing **Astro design #2** (trace, world select, star at the end), not illustrations | PNG 2400×1500 (16:10) or device-native | WebP 1200×750 / 600×375, ≤ 80 KB each | Game page strip (`art.screenshots`) |
| ABOUT-SCENE | Pending | Already listed: Rosie with a small planet and an astronaut, cut out (no background panel) | PNG transparent, 3200×1800 | WebP 1600×900 / 800×450 | About |
| OG-HOME | **Delivered (provisional), integrated** October 28 as `og-home.jpg` (116 KB). It shows Astro and the wordmark | Share card: Rosie waving on deep space with the wordmark "PinkRyno Studios" and room for no other text | PNG 1200×630 | **PNG or JPEG** ≤ 200 KB | OG for site pages |
| OG-TINY-TRAILS | **Delivered (final), integrated** October 28 as `og-tiny-trails.jpg` (116 KB) | Share card: the **Astro design #2** TT key art plus the title "Tiny Trails: Space" | PNG 1200×630 | PNG or JPEG ≤ 200 KB | OG for the game page (`art.og`) |
| WORDMARK (optional) | Not delivered | "PinkRyno Studios" lettering in Baloo-like hand style, plum outline | **SVG** | inline SVG ≤ 4 KB | Header and footer |
| STORE-BADGES | Not delivered (needs the store listings) | Official Apple / Google badges (from their brand kits, unmodified) | SVG | SVG | Game page when live |

Cycle 2 status: ROSIE-HEAD (with the favicons and apple-touch icon), ICON-SET, and TWINKLE-SET are delivered and integrated (see [First approved art](#first-approved-art-integrated)). TT-HERO, OG-TINY-TRAILS, and OG-HOME (provisional) are delivered and integrated (see [Second approved art](#second-approved-art-integrated)). Pending: the new Rosie (static, wave animation, favicons, and the 404 pose, which replace every current Rosie file), TT-CARD, and ABOUT-SCENE. The TT screenshots need the sticker build's capture pass.

## Performance budget

| Metric | Budget | Cycle 1 (live site, home) | Cycle 2 with the first approved art | Cycle 2 with TT-HERO and OG (October 28) |
| --- | --- | --- | --- | --- |
| Home page, cold transfer | **≤ 250 KB** | 1.59 MB | ~501 KB desktop, ~350 KB mobile (Rosie's wave loop is 440 / 278 KB of it); ~87 KB with reduced motion | First load, no scrolling: 175 KB desktop 1x, 244 KB desktop 2x, 188 KB phone 2x/3x, the same with reduced motion. That includes Rosie's still (10 KB at 1x, 15 KB at 2x and on phones). Her temporary wave loads only after scrolling to her (+272 KB at 1x and, since the Meet Rosie change, on phones; +430 KB on 2x desktops), never under reduced motion. Before this swap the first load was 438 / 502 / 445 KB: Chrome started the wave despite `loading="lazy"`, because the studio section is within its ~1250 px lazy-load distance |
| Any content page | ≤ 200 KB | 99–242 KB | 67–146 KB | Tiny Trails 164 KB (1x) / 171 KB (phone) / 228 KB (desktop 2x); games index 151 / 158 / 214 KB; About, Support, Privacy, 404 unchanged |
| Requests per page | ≤ 12 | 9–11 | 10–12 (home 12) | 10–13 (home 13, Tiny Trails 12) |
| Largest image | ≤ 80 KB (hero ≤ 60 KB @2×) | 1.35 MB | 440 KB (the wave loop). `rosie-full.webp` on About and 404 is 72 KB. The new art files are 33 KB or less. | First load: the hero art, 50 KB at 1x and on phones, 106 KB at 2x. After scrolling to Rosie on home: her temporary wave, 272 KB (1x desktops and phones) or 430 KB (2x desktops) |
| CSS | ≤ 20 KB raw, single file, ≤ 6 KB gzip | 19.4 KB + themes | 22.1 KB raw, 5.9 KB gzip, + themes | 26.2 KB raw, 7.0 KB gzip (23.3 / 6.3 KB before), + themes |
| JS | ≤ 5 KB, no framework, gate + menu only | 4.4 KB | unchanged | `site.js` unchanged, plus a 723-byte inline script on home only (Rosie's wave swap, allowed by its CSP hash; 605 bytes before phones got their own small wave): 5,097 bytes, just under 5 KB |
| Fonts | ≤ 3 woff2, ≤ 55 KB total, `font-display: swap`, only display font preloaded | 51 KB | unchanged | unchanged |
| LCP (Lighthouse mobile) | ≤ 1.5 s | 1.2 s | not re-measured | not re-measured. The LCP element is the hero art on Home and Tiny Trails (`fetchpriority="high"`) |
| CLS | 0 | 0 | not re-measured | not re-measured; every picture has width and height |
| Lighthouse | 100 / 100 / 100 / 100 | 100 / 100 / 96 / 100 | not re-measured | not re-measured |

Techniques: `<picture>` with `srcset` at 1×/2× (AVIF then WebP, then a PNG fallback), explicit `width`/`height`, `fetchpriority="high"` only on the hero, and `loading="lazy"` below the fold. The star field and the sticker icons are SVG sprites referenced with external `<use>`, one request each, cached across pages. The separators are inline SVG. Remove the unused files from the repo: root `pinkrynostudios-mascot.png` and `pinkrynostudios-head.png`, `assets/images/bubbles-*`, and the old rhino. They're not linked, so this is only repo hygiene, not page weight.

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
- OG images in PNG/JPEG: OG-HOME for site pages (provisional), and OG-TINY-TRAILS (from `games.json` `art.og`) for the game page and for the games index while it lists one game. Each page sets `og:image` with its width, height, type, and alt, plus `twitter:image` and `twitter:image:alt`, as absolute `https://pinkrynostudios.com/` URLs.
- JSON-LD: Organization (existing), plus `VideoGame` on game pages.
- `sitemap.xml` lastmod comes from the render date (or git), not a constant. Robots and the beta exclusion stay unchanged.

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
9. Don't touch `games/space-maze/`, `games/tiny-trails-beta/`, or `CNAME`. Keep `RESERVED` as is.

## Rollout

1. **Cycle 2:** build on `site-redesign` with the current art (Rosie's existing wave loop, re-exported), then share a branch preview (run `npx serve` locally and send screenshots, or the Director's preferred preview method) for approval.
2. Swap in the Art Director's assets as they land, re-run the generator, and re-run `tools/audit.mjs` against the preview to check the budget and the boxes count.
3. The Director approves and the owner merges. I won't merge or push to `main`.

## Decisions needed from the Director or owner

Items 1–4 were answered in cycle 2 (see [Cycle 2 decisions](#cycle-2-decisions)). What is still open:

1. **Legal name and mailing address** for the Privacy page, from the owner, before the January store launch. The support email is confirmed and live.
2. **When to flip `play_url`** to the sticker-style rebuild's web build.
3. Whether to keep `/games/` in the nav while there's only one game. It stays for now.
