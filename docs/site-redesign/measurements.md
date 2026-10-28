# pinkrynostudios.com audit summary

- Generated: 2026-10-28T02:21:28.066Z
- Site: https://pinkrynostudios.com
- Browser: Chrome 156.0.8078.47 (headless, /usr/bin/google-chrome), playwright-core 1.64.1
- Screenshots: `/workspace/pinkryno/pinkrynostudios/docs/site-redesign/screenshots`
- Viewports: desktop 1440x900 @1x, mobile 390x844 @2x

How to read the numbers:

- Each page/viewport run uses a fresh browser context, so transfer sizes are cold-cache.
- "Transferred" is the sum of CDP `Network.loadingFinished` `encodedDataLength` up to the moment the page data is captured (load + 800 ms, or + 2500 ms for game pages). Requests still in flight at that point are counted as "pending" and add 0 bytes.
- "Boxes" are visible elements with `border-radius > 0` that also have a visible border or a background color different from the body background.
- Contrast uses computed `color` against the nearest non-transparent ancestor `background-color` (semi-transparent layers composited). Text drawn over CSS background images or gradients is measured against the background color only.
- Small tap targets (a, button, summary, label, input under 44x44 CSS px) are checked on mobile only. Inline text links are included and marked with display `inline`.

## Overview

| Page | Viewport | HTTP | Doc height | Screenshot | Requests | Transferred | Images | Boxes | Contrast fails | Small tap targets | TODO | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | desktop | 200 | 2130px | home-desktop.jpg | 11 | 1.59 MB | 4 | 7 | 0 / 32 | n/a | 0 |  |
| / | mobile | 200 | 2391px | home-mobile.jpg | 11 | 1.59 MB | 4 | 8 | 0 / 30 | 3 | 0 |  |
| /games/ | desktop | 200 | 1194px | games-desktop.jpg | 9 | 99.2 KB | 2 | 7 | 0 / 22 | n/a | 0 |  |
| /games/ | mobile | 200 | 1125px | games-mobile.jpg | 9 | 99.2 KB | 2 | 7 | 0 / 20 | 0 | 0 |  |
| /games/tiny-trails-space/ | desktop | 200 | 2098px | tiny-trails-space-desktop.jpg | 10 | 242.2 KB | 3 | 13 | 0 / 44 | n/a | 0 |  |
| /games/tiny-trails-space/ | mobile | 200 | 3267px | tiny-trails-space-mobile.jpg | 10 | 242.2 KB | 3 | 13 | 0 / 42 | 3 | 0 |  |
| /about/ | desktop | 200 | 2141px | about-desktop.jpg | 10 | 171.8 KB | 3 | 5 | 0 / 31 | n/a | 0 |  |
| /about/ | mobile | 200 | 2289px | about-mobile.jpg | 10 | 171.8 KB | 3 | 5 | 0 / 29 | 2 | 0 |  |
| /support/ | desktop | 200 | 1472px | support-desktop.jpg | 10 | 172.1 KB | 3 | 3 | 0 / 26 | n/a | 1 |  |
| /support/ | mobile | 200 | 2022px | support-mobile.jpg | 10 | 172.1 KB | 3 | 3 | 0 / 24 | 1 | 1 |  |
| /privacy/ | desktop | 200 | 3961px | privacy-desktop.jpg | 9 | 100.7 KB | 2 | 2 | 0 / 69 | n/a | 2 |  |
| /privacy/ | mobile | 200 | 4962px | privacy-mobile.jpg | 9 | 100.7 KB | 2 | 3 | 0 / 67 | 18 | 2 |  |
| /404-check-does-not-exist/ | desktop | 404 | 1231px | 404-desktop.jpg | 10 | 171.2 KB | 3 | 2 | 0 / 17 | n/a | 0 |  |
| /404-check-does-not-exist/ | mobile | 404 | 1143px | 404-mobile.jpg | 10 | 171.2 KB | 3 | 3 | 0 / 15 | 0 | 0 |  |
| /games/space-maze/ | desktop | 200 | 900px | space-maze-desktop.jpg | 7 | 24.07 MB | 0 | 0 | 0 / 1 | n/a | 0 |  |
| /games/space-maze/ | mobile | 200 | 844px | space-maze-mobile.jpg | 7 | 24.07 MB | 0 | 0 | 0 / 1 | 0 | 0 |  |
| /games/tiny-trails-beta/ | desktop | 200 | 900px | tiny-trails-beta-desktop.jpg | 8 | 17.39 MB | 0 | 0 | 0 / 1 | n/a | 0 |  |
| /games/tiny-trails-beta/ | mobile | 200 | 844px | tiny-trails-beta-mobile.jpg | 8 | 17.39 MB | 0 | 0 | 0 / 1 | 0 | 0 |  |

## Findings across pages

- **Visible "TODO" text on 2 page(s):** /support/ ("TODO for the owner:"); /privacy/ ("TODO for the owner:", "PinkRyno Studios is an independent game studio in Florida, USA. TODO for the owner: replace this sentence with the lega…")
- Missing-page check returned HTTP 404 with title "Page not found · PinkRyno Studios".
- Every `<img>` has an alt attribute (empty alt counts as decorative).
- **Metadata gaps:** /games/space-maze/: missing meta description, canonical, og:title, og:image, twitter:card; /games/tiny-trails-beta/: missing meta description, canonical, og:title, og:image, twitter:card
- **Heading structure:** /games/space-maze/: 0 h1; /games/tiny-trails-beta/: 0 h1
- No horizontal overflow at 390px.
- **Contrast:** 0 failing text element(s) out of 472 checked across all runs. 242 of the checked elements sit over a CSS background image or gradient; check those visually in the screenshots.
- **Tap targets under 44x44 on mobile:** 27 total, 0 of them non-inline (buttons, block links, controls). Inline text links are usually exempt under WCAG 2.5.8.

### Heaviest requests (desktop runs, largest first)

| Resource | Type | Size | First seen on |
| --- | --- | --- | --- |
| /games/space-maze/index.pck | Fetch | 14.83 MB | /games/space-maze/ |
| /games/tiny-trails-beta/index.wasm | Fetch | 9.78 MB | /games/tiny-trails-beta/ |
| /games/space-maze/index.wasm | Fetch | 9.14 MB | /games/space-maze/ |
| /games/tiny-trails-beta/earth-grounds.pck | Fetch | 4.59 MB | /games/tiny-trails-beta/ |
| /games/tiny-trails-beta/index.pck | Fetch | 2.89 MB | /games/tiny-trails-beta/ |
| /assets/mascot/rosie-wave.webp | Image | 1.35 MB | / |
| /assets/games/tiny-trails-space/hero.webp | Image | 142.3 KB | /games/tiny-trails-space/ |
| /games/space-maze/index.js | Script | 77.7 KB | /games/space-maze/ |
| /assets/mascot/rosie-full.webp | Image | 72.1 KB | /404-check-does-not-exist/ |
| /games/tiny-trails-beta/index.js | Script | 68.0 KB | /games/tiny-trails-beta/ |

## Page details

### / (`home`)

- HTTP status: 200
- Title: PinkRyno Studios · calm games for ages 3–6
- Description: PinkRyno Studios makes calm games for kids ages 3 to 6. Trace a glowing path and play at a little kid's pace.
- Canonical: https://pinkrynostudios.com/ · lang: en
- Open Graph: `og:site_name`=PinkRyno Studios, `og:type`=website, `og:locale`=en_US, `og:title`=PinkRyno Studios · calm games for ages 3–6, `og:description`=PinkRyno Studios makes calm games for kids ages 3 to 6. Trace a glowing path and play at a little kid's pace., `og:url`=/, `og:image`=/assets/mascot/rosie-social.webp, `og:image:alt`=Rosie Ryno the pink rhino, PinkRyno Studios mascot, `og:image:width`=1200, `og:image:height`=630
- Twitter: `twitter:card`=summary_large_image, `twitter:title`=PinkRyno Studios · calm games for ages 3–6, `twitter:description`=PinkRyno Studios makes calm games for kids ages 3 to 6. Trace a glowing path and play at a little kid's pace., `twitter:image`=/assets/mascot/rosie-social.webp
- Document height: desktop 2130px, mobile 2391px
- Network: desktop 11 requests / 1.59 MB, mobile 11 requests / 1.59 MB
- Screenshots: `home-desktop.jpg`, `home-mobile.jpg`

**Heading outline**

- h1: Calm games for little kids.
  - h2: Now playing
    - h3: Tiny Trails: Space
  - h2: A grown-up can continue _(hidden)_

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 1 | 1 |
| `.frame` | 0 | 0 |
| `.art-slot` | 0 | 0 |
| `.chip` | 2 | 2 |
| `details` | 0 | 0 |
| `aside` | 0 | 0 |
| `.review-note` | 0 | 0 |
| `.spotlight` | 1 | 1 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 0 | 0 |
| boxes | 7 | 8 |

Box elements (desktop): `a.btn.btn-play` ×2, `a.btn` ×2, `p.eyebrow` ×1, `span.chip.chip-lavender` ×1, `span.chip.chip-mint` ×1

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 1 / 1 | 1 / 1 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 2 / 2 | 2 / 2 |
| "sign up" | 1 / 1 | 1 / 1 |
| "nothing to sign up" | 1 / 1 | 1 / 1 |

**Images**

| Image (currentSrc) | Natural | Rendered desktop | Rendered mobile | loading | alt |
| --- | --- | --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | 256x256 | 52x52 | 52x52 |  | (empty, decorative) |
| /assets/mascot/rosie-wave.webp | 386x500 | 599.6x776.7 | 358x463.7 |  | Rosie Ryno the pink rhino, PinkRyno Studios mascot |
| /assets/games/tiny-trails-space/hero.webp | 713x656 | 606x557.6 | 346x318.3 | lazy | Astro, a chibi astronaut with pink curly hair, standing on a small mint planet beside a smiling butter-yellow star and a trail of sparkles |
| /assets/mascot/rosie-head.webp | 256x256 | 72x72 | 72x72 |  | (empty, decorative) |

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /assets/mascot/rosie-wave.webp | Image | 200 | 1.35 MB |
| /assets/games/tiny-trails-space/hero.webp | Image | 200 | 142.1 KB |
| /assets/mascot/rosie-head.webp | Image | 200 | 30.6 KB |
| /assets/fonts/baloo-2-latin-800.woff2 | Font | 200 | 18.4 KB |
| /assets/fonts/nunito-latin-400.woff2 | Font | 200 | 16.3 KB |
| /assets/fonts/nunito-latin-700.woff2 | Font | 200 | 16.0 KB |

**Tap targets under 44x44 (mobile): 3**

| Text | Tag | Size (CSS px) | Display | href |
| --- | --- | --- | --- | --- |
| Tiny Trails: Space | a | 173.2x37 | inline | /games/tiny-trails-space/ |
| See the games page | a | 159.9x23 | inline | /games/ |
| Privacy | a | 56.3x23 | inline | /privacy/ |

**Contrast (desktop):** 0 failures of 32 text elements checked (12 over a background image/gradient).

**Contrast (mobile):** 0 failures of 30 text elements checked (12 over a background image/gradient).

### /games/ (`games`)

- HTTP status: 200
- Title: Games · PinkRyno Studios
- Description: Games from PinkRyno Studios for ages 3 to 6, including Tiny Trails: Space.
- Canonical: https://pinkrynostudios.com/games/ · lang: en
- Open Graph: `og:site_name`=PinkRyno Studios, `og:type`=website, `og:locale`=en_US, `og:title`=Games · PinkRyno Studios, `og:description`=Games from PinkRyno Studios for ages 3 to 6, including Tiny Trails: Space., `og:url`=/games/, `og:image`=/assets/mascot/rosie-social.webp, `og:image:alt`=Rosie Ryno the pink rhino, PinkRyno Studios mascot, `og:image:width`=1200, `og:image:height`=630
- Twitter: `twitter:card`=summary_large_image, `twitter:title`=Games · PinkRyno Studios, `twitter:description`=Games from PinkRyno Studios for ages 3 to 6, including Tiny Trails: Space., `twitter:image`=/assets/mascot/rosie-social.webp
- Document height: desktop 1194px, mobile 1125px
- Network: desktop 9 requests / 99.2 KB, mobile 9 requests / 99.2 KB
- Screenshots: `games-desktop.jpg`, `games-mobile.jpg`

**Heading outline**

- h1: Games
  - h2: Tiny Trails: Space
  - h2: A grown-up can continue _(hidden)_

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 1 | 1 |
| `.frame` | 1 | 1 |
| `.art-slot` | 1 | 1 |
| `.chip` | 2 | 2 |
| `details` | 0 | 0 |
| `aside` | 0 | 0 |
| `.review-note` | 0 | 0 |
| `.spotlight` | 0 | 0 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 0 | 0 |
| boxes | 7 | 7 |

Box elements (desktop): `a` ×1, `div.frame.frame-card` ×1, `p.art-slot-card` ×1, `span.art-slot-id` ×1, `span.chip.chip-lavender` ×1, `span.chip.chip-mint` ×1, `a.btn.btn-play` ×1

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 0 / 0 | 0 / 0 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 1 / 1 | 1 / 1 |
| "sign up" | 0 / 0 | 0 / 0 |
| "nothing to sign up" | 0 / 0 | 0 / 0 |

**Images**

| Image (currentSrc) | Natural | Rendered desktop | Rendered mobile | loading | alt |
| --- | --- | --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | 256x256 | 52x52 | 52x52 |  | (empty, decorative) |
| /assets/mascot/rosie-head.webp | 256x256 | 72x72 | 72x72 |  | (empty, decorative) |

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | Image | 200 | 30.7 KB |
| /assets/fonts/baloo-2-latin-800.woff2 | Font | 200 | 18.4 KB |
| /assets/fonts/nunito-latin-400.woff2 | Font | 200 | 16.1 KB |
| /assets/fonts/nunito-latin-700.woff2 | Font | 200 | 16.0 KB |
| /assets/mascot/favicon.jpg | Other | 200 | 8.5 KB |
| /assets/css/site.css | Stylesheet | 200 | 4.8 KB |

**Tap targets under 44x44 (mobile):** none

**Contrast (desktop):** 0 failures of 22 text elements checked (5 over a background image/gradient).

**Contrast (mobile):** 0 failures of 20 text elements checked (5 over a background image/gradient).

### /games/tiny-trails-space/ (`tiny-trails-space`)

- HTTP status: 200
- Title: Tiny Trails: Space · PinkRyno Studios
- Description: Trace a glowing trail through cosmic worlds. A calm game for ages 3 to 6 with no ads and no accounts.
- Canonical: https://pinkrynostudios.com/games/tiny-trails-space/ · lang: en
- Open Graph: `og:site_name`=PinkRyno Studios, `og:type`=website, `og:locale`=en_US, `og:title`=Tiny Trails: Space · PinkRyno Studios, `og:description`=Trace a glowing trail through cosmic worlds. A calm game for ages 3 to 6 with no ads and no accounts., `og:url`=/games/tiny-trails-space/, `og:image`=/assets/mascot/rosie-social.webp, `og:image:alt`=Rosie Ryno the pink rhino, PinkRyno Studios mascot, `og:image:width`=1200, `og:image:height`=630
- Twitter: `twitter:card`=summary_large_image, `twitter:title`=Tiny Trails: Space · PinkRyno Studios, `twitter:description`=Trace a glowing trail through cosmic worlds. A calm game for ages 3 to 6 with no ads and no accounts., `twitter:image`=/assets/mascot/rosie-social.webp
- Document height: desktop 2098px, mobile 3267px
- Network: desktop 10 requests / 242.2 KB, mobile 10 requests / 242.2 KB
- Screenshots: `tiny-trails-space-desktop.jpg`, `tiny-trails-space-mobile.jpg`

**Heading outline**

- h1: Tiny Trails: Space
  - h2: For parents
  - h2: How it plays
  - h2: Pictures
  - h2: A grown-up can continue _(hidden)_

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 1 | 1 |
| `.frame` | 3 | 3 |
| `.art-slot` | 3 | 3 |
| `.chip` | 2 | 2 |
| `details` | 0 | 0 |
| `aside` | 0 | 0 |
| `.review-note` | 0 | 0 |
| `.spotlight` | 1 | 1 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 3 | 3 |
| boxes | 13 | 13 |

Box elements (desktop): `div.frame.frame-scene` ×3, `p.art-slot-card` ×3, `span.art-slot-id` ×3, `a` ×1, `span.chip.chip-lavender` ×1, `span.chip.chip-mint` ×1, `a.btn.btn-play` ×1

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 1 / 1 | 1 / 1 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 2 / 2 | 2 / 2 |
| "sign up" | 1 / 1 | 1 / 1 |
| "nothing to sign up" | 1 / 1 | 1 / 1 |

**Images**

| Image (currentSrc) | Natural | Rendered desktop | Rendered mobile | loading | alt |
| --- | --- | --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | 256x256 | 52x52 | 52x52 |  | (empty, decorative) |
| /assets/games/tiny-trails-space/hero.webp | 713x656 | 606x557.6 | 346x318.3 |  | Astro, a chibi astronaut with pink curly hair, standing on a small mint planet beside a smiling butter-yellow star and a trail of sparkles |
| /assets/mascot/rosie-head.webp | 256x256 | 72x72 | 72x72 |  | (empty, decorative) |

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /assets/games/tiny-trails-space/hero.webp | Image | 200 | 142.3 KB |
| /assets/mascot/rosie-head.webp | Image | 200 | 30.6 KB |
| /assets/fonts/baloo-2-latin-800.woff2 | Font | 200 | 18.4 KB |
| /assets/fonts/nunito-latin-400.woff2 | Font | 200 | 16.2 KB |
| /assets/fonts/nunito-latin-700.woff2 | Font | 200 | 16.0 KB |
| /assets/mascot/favicon.jpg | Other | 200 | 8.4 KB |

**Tap targets under 44x44 (mobile): 3**

| Text | Tag | Size (CSS px) | Display | href |
| --- | --- | --- | --- | --- |
| Games | a | 54.2x23 | inline | /games/ |
| Privacy policy | a | 108.6x23 | inline | /privacy/ |
| Contact support | a | 127.7x23 | inline | /support/ |

**Contrast (desktop):** 0 failures of 44 text elements checked (25 over a background image/gradient).

**Contrast (mobile):** 0 failures of 42 text elements checked (25 over a background image/gradient).

### /about/ (`about`)

- HTTP status: 200
- Title: About · PinkRyno Studios
- Description: PinkRyno Studios is an independent studio in Florida making gentle games for children ages 3 to 6.
- Canonical: https://pinkrynostudios.com/about/ · lang: en
- Open Graph: `og:site_name`=PinkRyno Studios, `og:type`=website, `og:locale`=en_US, `og:title`=About · PinkRyno Studios, `og:description`=PinkRyno Studios is an independent studio in Florida making gentle games for children ages 3 to 6., `og:url`=/about/, `og:image`=/assets/mascot/rosie-social.webp, `og:image:alt`=Rosie Ryno the pink rhino, PinkRyno Studios mascot, `og:image:width`=1200, `og:image:height`=630
- Twitter: `twitter:card`=summary_large_image, `twitter:title`=About · PinkRyno Studios, `twitter:description`=PinkRyno Studios is an independent studio in Florida making gentle games for children ages 3 to 6., `twitter:image`=/assets/mascot/rosie-social.webp
- Document height: desktop 2141px, mobile 2289px
- Network: desktop 10 requests / 171.8 KB, mobile 10 requests / 171.8 KB
- Screenshots: `about-desktop.jpg`, `about-mobile.jpg`

**Heading outline**

- h1: About PinkRyno Studios
  - h2: What we hold to
  - h2: A scene for this page
  - h2: A grown-up can continue _(hidden)_

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 0 | 0 |
| `.frame` | 1 | 1 |
| `.art-slot` | 1 | 1 |
| `.chip` | 0 | 0 |
| `details` | 0 | 0 |
| `aside` | 0 | 0 |
| `.review-note` | 0 | 0 |
| `.spotlight` | 0 | 0 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 0 | 0 |
| boxes | 5 | 5 |

Box elements (desktop): `a` ×1, `p.eyebrow` ×1, `div.frame.frame-wide` ×1, `p.art-slot-card` ×1, `span.art-slot-id` ×1

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 1 / 1 | 1 / 1 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 2 / 2 | 2 / 2 |
| "sign up" | 1 / 1 | 1 / 1 |
| "nothing to sign up" | 1 / 1 | 1 / 1 |

**Images**

| Image (currentSrc) | Natural | Rendered desktop | Rendered mobile | loading | alt |
| --- | --- | --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | 256x256 | 52x52 | 52x52 |  | (empty, decorative) |
| /assets/mascot/rosie-full.webp | 370x500 | 320x432.4 | 340x459.5 |  | Rosie Ryno the pink rhino, PinkRyno Studios mascot |
| /assets/mascot/rosie-head.webp | 256x256 | 72x72 | 72x72 |  | (empty, decorative) |

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /assets/mascot/rosie-full.webp | Image | 200 | 72.0 KB |
| /assets/mascot/rosie-head.webp | Image | 200 | 30.7 KB |
| /assets/fonts/baloo-2-latin-800.woff2 | Font | 200 | 18.4 KB |
| /assets/fonts/nunito-latin-700.woff2 | Font | 200 | 16.2 KB |
| /assets/fonts/nunito-latin-400.woff2 | Font | 200 | 16.1 KB |
| /assets/mascot/favicon.jpg | Other | 200 | 8.4 KB |

**Tap targets under 44x44 (mobile): 2**

| Text | Tag | Size (CSS px) | Display | href |
| --- | --- | --- | --- | --- |
| Tiny Trails: Space | a | 138.4x23 | inline | /games/tiny-trails-space/ |
| support | a | 62x23 | inline | /support/ |

**Contrast (desktop):** 0 failures of 31 text elements checked (16 over a background image/gradient).

**Contrast (mobile):** 0 failures of 29 text elements checked (16 over a background image/gradient).

### /support/ (`support`)

- HTTP status: 200
- Title: Support · PinkRyno Studios
- Description: Contact PinkRyno Studios for help with restore purchases, the parental gate, and our games for ages 3 to 6.
- Canonical: https://pinkrynostudios.com/support/ · lang: en
- Open Graph: `og:site_name`=PinkRyno Studios, `og:type`=website, `og:locale`=en_US, `og:title`=Support · PinkRyno Studios, `og:description`=Contact PinkRyno Studios for help with restore purchases, the parental gate, and our games for ages 3 to 6., `og:url`=/support/, `og:image`=/assets/mascot/rosie-social.webp, `og:image:alt`=Rosie Ryno the pink rhino, PinkRyno Studios mascot, `og:image:width`=1200, `og:image:height`=630
- Twitter: `twitter:card`=summary_large_image, `twitter:title`=Support · PinkRyno Studios, `twitter:description`=Contact PinkRyno Studios for help with restore purchases, the parental gate, and our games for ages 3 to 6., `twitter:image`=/assets/mascot/rosie-social.webp
- Document height: desktop 1472px, mobile 2022px
- Network: desktop 10 requests / 172.1 KB, mobile 10 requests / 172.1 KB
- Screenshots: `support-desktop.jpg`, `support-mobile.jpg`

**Heading outline**

- h1: Rosie is here to help
  - h2: Common questions
  - h2: A grown-up can continue _(hidden)_

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 0 | 0 |
| `.frame` | 0 | 0 |
| `.art-slot` | 0 | 0 |
| `.chip` | 0 | 0 |
| `details` | 5 | 5 |
| `aside` | 1 | 1 |
| `.review-note` | 1 | 1 |
| `.spotlight` | 0 | 0 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 0 | 0 |
| boxes | 3 | 3 |

Box elements (desktop): `a` ×1, `aside.review-note` ×1, `p.eyebrow` ×1

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 0 / 0 | 0 / 0 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 2 / 2 | 2 / 2 |
| "sign up" | 0 / 0 | 0 / 0 |
| "nothing to sign up" | 0 / 0 | 0 / 0 |

**Images**

| Image (currentSrc) | Natural | Rendered desktop | Rendered mobile | loading | alt |
| --- | --- | --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | 256x256 | 52x52 | 52x52 |  | (empty, decorative) |
| /assets/mascot/rosie-full.webp | 370x500 | 320x432.4 | 340x459.5 |  | Rosie Ryno the pink rhino, PinkRyno Studios mascot, here to help parents with support questions |
| /assets/mascot/rosie-head.webp | 256x256 | 72x72 | 72x72 |  | (empty, decorative) |

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /assets/mascot/rosie-full.webp | Image | 200 | 72.0 KB |
| /assets/mascot/rosie-head.webp | Image | 200 | 30.7 KB |
| /assets/fonts/baloo-2-latin-800.woff2 | Font | 200 | 18.4 KB |
| /assets/fonts/nunito-latin-400.woff2 | Font | 200 | 16.2 KB |
| /assets/fonts/nunito-latin-700.woff2 | Font | 200 | 16.1 KB |
| /assets/mascot/favicon.jpg | Other | 200 | 8.4 KB |

**Tap targets under 44x44 (mobile): 1**

| Text | Tag | Size (CSS px) | Display | href |
| --- | --- | --- | --- | --- |
| support@pinkrynostudios.com (leaves this website, a grown-u… | a | 241.2x23 | inline | mailto:support@pinkrynostudios.com |

**Contrast (desktop):** 0 failures of 26 text elements checked (10 over a background image/gradient).

**Contrast (mobile):** 0 failures of 24 text elements checked (10 over a background image/gradient).

**Visible TODO text (1):**

- `strong`: TODO for the owner:

### /privacy/ (`privacy`)

- HTTP status: 200
- Title: Privacy Policy · PinkRyno Studios
- Description: Privacy policy for PinkRyno Studios games and website. We do not collect personal data, show ads, or use tracking.
- Canonical: https://pinkrynostudios.com/privacy/ · lang: en
- Open Graph: `og:site_name`=PinkRyno Studios, `og:type`=website, `og:locale`=en_US, `og:title`=Privacy Policy · PinkRyno Studios, `og:description`=Privacy policy for PinkRyno Studios games and website. We do not collect personal data, show ads, or use tracking., `og:url`=/privacy/, `og:image`=/assets/mascot/rosie-social.webp, `og:image:alt`=Rosie Ryno the pink rhino, PinkRyno Studios mascot, `og:image:width`=1200, `og:image:height`=630
- Twitter: `twitter:card`=summary_large_image, `twitter:title`=Privacy Policy · PinkRyno Studios, `twitter:description`=Privacy policy for PinkRyno Studios games and website. We do not collect personal data, show ads, or use tracking., `twitter:image`=/assets/mascot/rosie-social.webp
- Document height: desktop 3961px, mobile 4962px
- Network: desktop 9 requests / 100.7 KB, mobile 9 requests / 100.7 KB
- Screenshots: `privacy-desktop.jpg`, `privacy-mobile.jpg`

**Heading outline**

- h1: Privacy policy
  - h2: The short version
  - h2: On this page
  - h2: Who we are
  - h2: What this policy covers
  - h2: Information we collect
  - h2: Ads, tracking, and SDKs
  - h2: Purchases
  - h2: Cookies and device storage
  - h2: Children
  - h2: Email you send us
  - h2: How to delete information
  - h2: Hosting
  - h2: Changes
  - h2: Contact
  - h2: A grown-up can continue _(hidden)_

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 0 | 0 |
| `.frame` | 0 | 0 |
| `.art-slot` | 0 | 0 |
| `.chip` | 0 | 0 |
| `details` | 0 | 0 |
| `aside` | 1 | 1 |
| `.review-note` | 1 | 1 |
| `.spotlight` | 0 | 0 |
| `.short-version` | 1 | 1 |
| `.facts > div` | 0 | 0 |
| boxes | 2 | 3 |

Box elements (desktop): `aside.review-note` ×1, `div.short-version` ×1

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 5 / 5 | 5 / 5 |
| "tracking" | 3 / 3 | 3 / 3 |
| "privacy" | 8 / 8 | 8 / 8 |
| "sign up" | 0 / 0 | 0 / 0 |
| "nothing to sign up" | 0 / 0 | 0 / 0 |

**Images**

| Image (currentSrc) | Natural | Rendered desktop | Rendered mobile | loading | alt |
| --- | --- | --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | 256x256 | 52x52 | 52x52 |  | (empty, decorative) |
| /assets/mascot/rosie-head.webp | 256x256 | 72x72 | 72x72 |  | (empty, decorative) |

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | Image | 200 | 30.7 KB |
| /assets/fonts/baloo-2-latin-800.woff2 | Font | 200 | 18.4 KB |
| /assets/fonts/nunito-latin-400.woff2 | Font | 200 | 16.1 KB |
| /assets/fonts/nunito-latin-700.woff2 | Font | 200 | 16.0 KB |
| /assets/mascot/favicon.jpg | Other | 200 | 8.5 KB |
| /assets/css/site.css | Stylesheet | 200 | 4.8 KB |

**Tap targets under 44x44 (mobile): 18**

| Text | Tag | Size (CSS px) | Display | href |
| --- | --- | --- | --- | --- |
| Who we are | a | 97.3x23 | inline | #who |
| What this policy covers | a | 185.9x23 | inline | #covers |
| Information we collect | a | 177.2x23 | inline | #collect |
| Ads, tracking, and SDKs | a | 189.9x23 | inline | #ads |
| Purchases | a | 80.4x23 | inline | #purchases |
| Cookies and device storage | a | 214.2x23 | inline | #cookies |
| Children | a | 67.1x23 | inline | #children |
| Email you send us | a | 142.1x23 | inline | #email |
| How to delete information | a | 208.6x23 | inline | #delete |
| Hosting | a | 62.5x23 | inline | #hosting |
| Changes | a | 68.5x23 | inline | #changes |
| Contact | a | 61.1x23 | inline | #contact |
| support@pinkrynostudios.com (leaves this website, a grown-u… | a | 241.2x23 | inline | mailto:support@pinkrynostudios.com |
| support page | a | 105.6x23 | inline | /support/ |
| support@pinkrynostudios.com (leaves this website, a grown-u… | a | 241.2x23 | inline | mailto:support@pinkrynostudios.com |
| support@pinkrynostudios.com (leaves this website, a grown-u… | a | 241.2x23 | inline | mailto:support@pinkrynostudios.com |
| support@pinkrynostudios.com (leaves this website, a grown-u… | a | 241.2x23 | inline | mailto:support@pinkrynostudios.com |
| support page | a | 105.6x23 | inline | /support/ |

**Contrast (desktop):** 0 failures of 69 text elements checked (51 over a background image/gradient).

**Contrast (mobile):** 0 failures of 67 text elements checked (51 over a background image/gradient).

**Visible TODO text (2):**

- `strong`: TODO for the owner:
- `p`: PinkRyno Studios is an independent game studio in Florida, USA. TODO for the owner: replace this sentence with the lega…

### /404-check-does-not-exist/ (`404`)

- HTTP status: 404
- Title: Page not found · PinkRyno Studios
- Description: That page is not on the PinkRyno Studios site. Head home or see the games.
- Canonical: https://pinkrynostudios.com/404.html · lang: en
- Open Graph: `og:site_name`=PinkRyno Studios, `og:type`=website, `og:locale`=en_US, `og:title`=Page not found · PinkRyno Studios, `og:description`=That page is not on the PinkRyno Studios site. Head home or see the games., `og:url`=/404.html, `og:image`=/assets/mascot/rosie-social.webp, `og:image:alt`=Rosie Ryno the pink rhino, PinkRyno Studios mascot, `og:image:width`=1200, `og:image:height`=630
- Twitter: `twitter:card`=summary_large_image, `twitter:title`=Page not found · PinkRyno Studios, `twitter:description`=That page is not on the PinkRyno Studios site. Head home or see the games., `twitter:image`=/assets/mascot/rosie-social.webp
- Document height: desktop 1231px, mobile 1143px
- Network: desktop 10 requests / 171.2 KB, mobile 10 requests / 171.2 KB
- Screenshots: `404-desktop.jpg`, `404-mobile.jpg`

**Heading outline**

- h1: This page floated off
  - h2: A grown-up can continue _(hidden)_

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 0 | 0 |
| `.frame` | 0 | 0 |
| `.art-slot` | 0 | 0 |
| `.chip` | 0 | 0 |
| `details` | 0 | 0 |
| `aside` | 0 | 0 |
| `.review-note` | 0 | 0 |
| `.spotlight` | 0 | 0 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 0 | 0 |
| boxes | 2 | 3 |

Box elements (desktop): `a.btn.btn-primary` ×1, `a.btn` ×1

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 0 / 0 | 0 / 0 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 1 / 1 | 1 / 1 |
| "sign up" | 0 / 0 | 0 / 0 |
| "nothing to sign up" | 0 / 0 | 0 / 0 |

**Images**

| Image (currentSrc) | Natural | Rendered desktop | Rendered mobile | loading | alt |
| --- | --- | --- | --- | --- | --- |
| /assets/mascot/rosie-head.webp | 256x256 | 52x52 | 52x52 |  | (empty, decorative) |
| /assets/mascot/rosie-full.webp | 370x500 | 420x567.6 | 358x483.8 |  | Rosie Ryno the pink rhino, PinkRyno Studios mascot, looking ready to walk you back to the games |
| /assets/mascot/rosie-head.webp | 256x256 | 72x72 | 72x72 |  | (empty, decorative) |

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /assets/mascot/rosie-full.webp | Image | 200 | 72.1 KB |
| /assets/mascot/rosie-head.webp | Image | 200 | 30.7 KB |
| /assets/fonts/baloo-2-latin-800.woff2 | Font | 200 | 18.4 KB |
| /assets/fonts/nunito-latin-400.woff2 | Font | 200 | 16.1 KB |
| /assets/fonts/nunito-latin-700.woff2 | Font | 200 | 16.1 KB |
| /assets/mascot/favicon.jpg | Other | 200 | 8.4 KB |

**Tap targets under 44x44 (mobile):** none

**Contrast (desktop):** 0 failures of 17 text elements checked (2 over a background image/gradient).

**Contrast (mobile):** 0 failures of 15 text elements checked (2 over a background image/gradient).

### /games/space-maze/ (`space-maze`)

- HTTP status: 200
- Title: space-maze-prototype-001
- Description: —
- Canonical: — · lang: en
- Open Graph: none
- Twitter: none
- Document height: desktop 900px, mobile 844px
- Network: desktop 7 requests / 24.07 MB, mobile 7 requests / 24.07 MB
- Screenshots: `space-maze-desktop.jpg`, `space-maze-mobile.jpg`

**Heading outline**

_No headings._

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 0 | 0 |
| `.frame` | 0 | 0 |
| `.art-slot` | 0 | 0 |
| `.chip` | 0 | 0 |
| `details` | 0 | 0 |
| `aside` | 0 | 0 |
| `.review-note` | 0 | 0 |
| `.spotlight` | 0 | 0 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 0 | 0 |
| boxes | 0 | 0 |

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 0 / 0 | 0 / 0 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 0 / 0 | 0 / 0 |
| "sign up" | 0 / 0 | 0 / 0 |
| "nothing to sign up" | 0 / 0 | 0 / 0 |

**Images:** none

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /games/space-maze/index.pck | Fetch | 200 | 14.83 MB |
| /games/space-maze/index.wasm | Fetch | 200 | 9.14 MB |
| /games/space-maze/index.js | Script | 200 | 77.7 KB |
| /games/space-maze/index.jpg | Image | 200 | 21.1 KB |
| /games/space-maze/index.icon.jpg | Other | 200 | 12.0 KB |
| /games/space-maze/ | Document | 200 | 2.5 KB |

**Tap targets under 44x44 (mobile):** none

**Contrast (desktop):** 0 failures of 1 text elements checked.

**Contrast (mobile):** 0 failures of 1 text elements checked.

### /games/tiny-trails-beta/ (`tiny-trails-beta`)

- HTTP status: 200
- Title: Tiny Trails
- Description: —
- Canonical: — · lang: en
- Open Graph: none
- Twitter: none
- Document height: desktop 900px, mobile 844px
- Network: desktop 8 requests / 17.39 MB, mobile 8 requests / 17.39 MB
- Screenshots: `tiny-trails-beta-desktop.jpg`, `tiny-trails-beta-mobile.jpg`

**Heading outline**

_No headings._

**Element counts**

| Selector | Desktop | Mobile |
| --- | --- | --- |
| `.card` | 0 | 0 |
| `.frame` | 0 | 0 |
| `.art-slot` | 0 | 0 |
| `.chip` | 0 | 0 |
| `details` | 0 | 0 |
| `aside` | 0 | 0 |
| `.review-note` | 0 | 0 |
| `.spotlight` | 0 | 0 |
| `.short-version` | 0 | 0 |
| `.facts > div` | 0 | 0 |
| boxes | 0 | 0 |

**Body text term counts** (whole word / substring, case-insensitive)

| Term | Desktop | Mobile |
| --- | --- | --- |
| "ads" | 0 / 0 | 0 / 0 |
| "tracking" | 0 / 0 | 0 / 0 |
| "privacy" | 0 / 0 | 0 / 0 |
| "sign up" | 0 / 0 | 0 / 0 |
| "nothing to sign up" | 0 / 0 | 0 / 0 |

**Images:** none

**Largest requests (desktop)**

| Resource | Type | Status | Size |
| --- | --- | --- | --- |
| /games/tiny-trails-beta/index.wasm | Fetch | 200 | 9.78 MB |
| /games/tiny-trails-beta/earth-grounds.pck | Fetch | 200 | 4.59 MB |
| /games/tiny-trails-beta/index.pck | Fetch | 200 | 2.89 MB |
| /games/tiny-trails-beta/index.js | Script | 200 | 68.0 KB |
| /games/tiny-trails-beta/index.icon.jpg | Other | 200 | 50.4 KB |
| /games/tiny-trails-beta/index.jpg | Image | 200 | 21.1 KB |

**Tap targets under 44x44 (mobile):** none

**Contrast (desktop):** 0 failures of 1 text elements checked.

**Contrast (mobile):** 0 failures of 1 text elements checked.

