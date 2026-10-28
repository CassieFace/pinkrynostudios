# PinkRyno Studios

Static website for [pinkrynostudios.com](https://pinkrynostudios.com). GitHub Pages serves the files in this repository. There is no build step on Pages and no change to Pages settings. The pages are generated locally and committed.

The live browser game stays at `games/space-maze/`. Do not edit that folder, `games/tiny-trails-beta/`, or `CNAME` from the website work.

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

- Every entry in the art maps (`site.json` `art` and each game's `art` in `games.json`), and `play_url`, is either `null` or points to a file that exists. This check runs in every mode, `--release` included.
- `assets/css/site.css` loads only fonts. Pictures come from the art maps and render as markup.
- Every link, image, stylesheet, and share-image URL in the generated pages points to a local file, and uses an absolute path such as `/assets/...`. GitHub Pages serves `404.html` at any missing URL, at any depth, so a relative path would break there.
- Links that leave the site (email and app stores) carry `data-parent-gate`, so nothing loads from another site.
- Every `<use href="/assets/.../sprite.svg#id">` points to a `<symbol>` that exists in that sprite.
- No page has a `style` attribute or `<style>` block. The CSP (`style-src 'self'`) would block them, so styling goes in `assets/css/site.css`.
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

- **`site.json` → `art`**: site-wide art (Rosie, her small head, favicons, the logo, the default share image, the hero backdrop, the About scene, stars, and icons).
- **`games.json` → each game's `art`**: that game's hero art, games index card, icon, share image, and screenshots.

`scripts/render-site.mjs` reads only these maps, and `site.css` loads only fonts. Swapping art never means editing code or CSS. `site.json` `mascot` holds only Rosie's text: `name` (used in most sentences), `fullName` (the About introduction), `pronouns`, and `species`.

**Temporary art.** The owner wants a new Rosie (static and animated) and all site art redone in a new sticker style. Until then, the current Rosie wave re-export (`rosie-wave-386/260*.webp`) and the head export in `assets/mascot/head/` (the small heads, favicons, apple-touch icon, and logo) are **temporary placeholders pending the new Rosie**. The static Rosie (`rosie-full.webp`), the share image (`rosie-social.png`), the icons, and the stars are the current art and will be redone in the new style too.

### Swap a picture

1. Export the new files at the sizes in the tables below and drop them in `assets/` (for example `assets/mascot/` for Rosie, `assets/icons/`, `assets/twinkle/`, `assets/og/`, or `assets/games/<id>/` for a game). Use new file names. Leave the old files where they are until the new ones are live.
2. Point the slot's entry at the new files: `site.json` `art` for site-wide art, or the game's `art` in `games.json`. Update `alt` when the picture changes.
3. Run `node scripts/render-site.mjs`. The build checks every file and lists the slots that are still empty.
4. Look at the pages, then commit the new files, the JSON, and the regenerated pages together.

Rules the build enforces:

- **`null` (or a missing key) means the slot is empty.** Its element or section is left out completely, with no placeholder, no empty box, and no gap. The build lists every empty slot in a warning.
- **A slot that is set must point to a real file**, in every mode, or the build stops and writes nothing. Paths start with `/`, like `/assets/mascot/rosie-new.webp`.
- `width` and `height` are optional. When they are set, they must match the file, and the error message shows the real size. `src2x` must be twice the size of `src`.
- `alt` is required wherever the picture means something (Rosie, game hero, screenshots, share images, About scene). Heads, icons, stars, cards, game icons, and the hero backdrop are decorative.
- Unknown keys stop the build, so a typo like `srcsmall` can't empty a slot without anyone noticing.
- `art.retired` lists files that stay in the repo but no entry may use. Today that is the off-model `tt-hero-astro-3` art (`assets/games/tiny-trails-space/hero.webp` and its source PNG).

### Site-wide slots (`site.json` `art`)

Display sizes are CSS pixels.

| Slot | Shows on | Display size | Deliver | Current file |
| --- | --- | --- | --- | --- |
| `rosie.animated` | Home hero, beside the headline (above it on phones) | Up to 386×500 on desktop (`min(386px, 32vw)` wide); 240 px tall on phones (185×240 today) | Animated WebP `src` plus a same-size still WebP `still` for reduced motion. Optional phone pair: `srcSmall` + `stillSmall`. `width`/`height` and `widthSmall`/`heightSmall` are optional and checked. `alt` | **Temporary:** `assets/mascot/rosie-wave-386.webp` + `-386-still.webp` (386×500), `rosie-wave-260.webp` + `-260-still.webp` (260×337) |
| `rosie.static` | About (300 px wide, about 218 on phones) and 404 (240 px wide). Also the home hero when `animated` is empty | Up to 386×500 | Transparent WebP or PNG `src` at 1x, optional `src2x` at 2x, `alt` | `assets/mascot/rosie-full.webp` (370×500), old Rosie art |
| `rosie.head` | Header 48 px (44 on phones), footer and home studio line 64 px, support title 88 px (64 on phones) | 44–88 px square | Square WebP or PNG files keyed by pixel size: `64`, `128`, `256`. Each spot loads only the files that cover 1x and 2x | **Temporary:** `assets/mascot/head/rosie-head-64.webp`, `-128.webp`, `-256.webp` |
| `favicon32`, `favicon48` | Browser tab icon | 32 and 48 px | PNG, exactly 32×32 and 48×48 | **Temporary:** `assets/mascot/head/favicon-32.png`, `favicon-48.png` |
| `appleTouch` | Home-screen icon on phones | 180 px | PNG, exactly 180×180, opaque | **Temporary:** `assets/mascot/head/apple-touch-icon-180.png` |
| `logo` | Organization `logo` in the home page's structured data (not shown on the page) | n/a | PNG, JPEG, or WebP, at least 112×112 | **Temporary:** `assets/mascot/head/rosie-head-256.png` |
| `og.default` | Share image for every page without its own | 1200×630 | PNG or JPEG, `alt`. When empty, pages have no `og:image` tags | `assets/mascot/rosie-social.png` (OG-HOME pending) |
| `hero` | Backdrop behind the home hero band, under the stars, Rosie, and text (decorative) | Cropped to cover the band: 540 px tall on desktop at any width, about 390×675 on phones | WebP, PNG, or JPEG `src` (about 2880×1080), optional `srcSmall` crop for phones (about 780×1350). Keep the area behind the headline calm | Empty |
| `aboutScene` | Full-width picture below the About text | Up to 1120 px wide | WebP, PNG, or JPEG `src` (for example 1120×630), optional `src2x`, `alt` | Empty (ABOUT-SCENE pending) |
| `stars` | Home hero background stars and a few faint footer stars | 6–78 px, set per kind in `STAR_SIZES` | One entry per star kind: `"/sprite.svg#symbol-id"` or a plain SVG, WebP, or PNG file | `assets/twinkle/twinkle-sprite.svg` (TWINKLE-SET) |
| `icons` | Sticker icons beside the home "For grown-ups" facts (`gift`, `key`, `hand`) and the game page lines (`trace`, `planet`, `helmet`, `replay`, `gift`, `key`) | 56 px (48 on phones) | One entry per name: `"/sprite.svg#symbol-id"` or a plain SVG file (or WebP/PNG at 112 px or more) | `assets/icons/icons-sprite.svg` (ICON-SET) |

Rosie in the home hero: if `rosie.animated` is set, the page uses it, with `still` under `prefers-reduced-motion`. If it is empty, the page uses `rosie.static`. If both are empty, the hero has no Rosie and the text spans the band. An empty `rosie.head` removes the small heads from the header, footer, studio line, and support title, and the text closes up. Keep at least one favicon set: with no `<link rel="icon">`, browsers ask for `/favicon.ico`, which does not exist.

A sprite entry draws the symbol with `<svg><use href="/assets/icons/icons-sprite.svg#icon-gift"/></svg>`, so a sprite is one request for the whole site. Don't inline a sprite inside a `display: none` element, because some browsers then drop the glow filters. The build checks that the symbol exists in the sprite.

The star layout is `HERO_STARS` and `FOOTER_STARS` in `scripts/render-site.mjs`. Each star gets a class (`.s1`, `.s2`, ... and `.f1`, ...), and `site.css` positions it, with separate rules for phones and for a hero without Rosie. The CSP forbids `style` attributes, so positions can't go in the HTML. Hero stars stay clear of Rosie's column at every width. On phones she stands at the top centre, so phone stars sit around the copy below her. Stars drift out and back over 60–120 s and stop under reduced motion. An empty star kind drops those stars and leaves the rest in place.

`scripts/export-rosie.py` made the temporary wave files from the original loop, `assets/mascot/rosie-wave.webp` (it needs Python 3 with Pillow and numpy, and the script header explains each step). Retire it when the new Rosie arrives: the new files are exported at the sizes above and set in `art.rosie`.

### Game slots (`games.json` `art`)

Each entry is `null` or an object like `{ "src": "/assets/games/<id>/hero.webp", "alt": "..." }`. `screenshots` is a list of those objects.

| Slot | Shows on | Display size | Deliver |
| --- | --- | --- | --- |
| `hero` | Beside the title in the home game section and on the game page. Also the games index row when there is no `card` | Up to 460 px wide | Cut-out WebP or PNG, about 800×700, optional `src2x`, `alt` |
| `card` | Games index row picture | Half the row, up to 536 px wide | WebP, PNG, or JPEG, 1280×800 (16:10). Decorative |
| `icon` | Above the game title in the home game section, on the game page, and in the games index row | 72 px | Square WebP or PNG, `src` 72×72 and `src2x` 144×144. Decorative |
| `og` | Share image for the game page | 1200×630 | PNG or JPEG, `alt`. Without it, the page uses `og.default` |
| `screenshots` | "A look inside" strip on the game page. It appears only when the list has at least one picture | 400 px wide each | WebP, PNG, or JPEG, 1200×750 (16:10), `alt` each |

Tiny Trails: Space has every game slot empty today. TT-HERO (Astro design #2), TT-CARD, OG-TINY-TRAILS, and the sticker build's screenshots are pending.

## Add a new game

Adding a game is one entry in [`games.json`](games.json), plus its images. You do not redesign the pages.

1. Copy the Tiny Trails: Space object in `games.json`.
2. Set a new `id` (lowercase letters, numbers, and hyphens). `page` must be `/games/<id>/`. `short_title` is the name on the home hero button ("Play Tiny Trails", shown while `play_enabled` is `true`).
3. Set `status` to `live`, `coming-soon`, or `hidden`.
   - `live` and `coming-soon` get a page, a row on the games index, and a sitemap entry.
   - `hidden` is left out of the site and the sitemap.
4. Write the copy for parents: `tagline`, `summary`, `description` (the meta description), `ages` (like `3–6`), `free_content`, `unlock`, `trial`, and `web_note`. `price` is the one-time unlock price, like `$0.99`, or `null`.
5. `highlights` are the "How it plays" lines. Each one has `text` and an `icon`: `trace`, `planet`, `helmet`, `replay`, `gift`, `key`, or `hand` (the names in `site.json` `art.icons`). An icon whose entry is empty is left out and the text stays.
6. Leave `stores.ios` and `stores.android` as `null` until the real listing exists. Use a plain `https://` URL with no tracking parameters. The store buttons stay off the page until then. A live game with no store link and no browser build shows a peach "Coming soon" tag and the line "Coming soon to phones and tablets."
7. Set `play_url` to the browser build on this site, or `null` if there is none. **It is the single setting for every Play in browser button.** It must be a page on this site, such as `/games/space-maze/`. Tiny Trails: Space uses `/games/space-maze/`, the build the live site has always used. When the sticker-style rebuild's web build is ready, flip `play_url` to its folder and re-run the script. `play_size_note` (for example `about 24 MB, best on Wi-Fi`) shows under the button on the game page.
   - The Play in browser button renders only when `play_enabled` is `true` and `play_url` is set. With `false` (or missing), the button is hidden everywhere and `play_url` is kept so it can be switched back on. To turn it on, set `play_enabled` to `true` and re-run `node scripts/render-site.mjs`.
   - `play_enabled` must be `true`, `false`, or left out (which counts as `false`); the build stops on anything else. While it is off, everything that talks about playing in the browser is left out too: the home hero button reads "See Tiny Trails: Space" instead of "Play Tiny Trails", and the size note, `web_note`, the support page's "Playing in the browser" question, and the `Web Browser` platform in the structured data are all hidden. Tiny Trails: Space has `play_enabled: false` today.
8. Fill in the game's `art` map (`hero`, `card`, `icon`, `og`, `screenshots`) with files under `assets/games/<id>/`. Each entry carries its own `alt`, like `"hero": { "src": "/assets/games/<id>/hero.webp", "alt": "..." }`. Every picture is optional: leave the entry `null` (or `screenshots` empty) and that picture is left out, with no placeholder. A path that is set must point to a real file, or the build stops. The slots, sizes, and formats are in [Game slots](#game-slots-gamesjson-art). `assets/games/tiny-trails-space/hero.webp` and its source `tt-hero-astro-3.png` are off-model and listed in `site.json` `art.retired`, so the build refuses them.
9. Pick an `accent` color (`#RRGGBB`). It is the thin underline under the game's title.
10. Run `node scripts/render-site.mjs`, then commit `games.json`, the new images, and the generated files (`games/<id>/index.html`, the home page, the games index, `assets/css/themes.css`, and `sitemap.xml`).

`/games/tiny-trails-beta/` is staging. It is not linked, it is omitted from `sitemap.xml`, and `robots.txt` disallows it. Do not add it to `games.json`.

## Privacy

The site does not use analytics, cookies, or third-party fonts. Baloo 2 and Nunito are self-hosted in `assets/fonts/` under the SIL Open Font License. Links that leave the site (email, and store links once they exist) go through a parental gate in `assets/js/site.js`. The menu works without JavaScript.

The browser game saves progress (stars and settings) on the device, in the browser's storage, and nothing is sent anywhere. The privacy policy says so once, in "Cookies and device storage". It covers this website and the games played in the browser here, and must be updated before any game launches as an app. When you change the policy text in `scripts/render-site.mjs`, update `POLICY_EFFECTIVE` at the top of the script so the date on the page changes too.
