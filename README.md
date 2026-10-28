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

The script writes the pages, `assets/css/themes.css`, and `sitemap.xml`. It overwrites the generated HTML, so edit `games.json`, `site.json`, or the script, then run it again. Do not hand-edit the generated pages.

Before it writes anything, the script checks its own output. If any check fails, it stops with a list of problems and writes nothing:

- Every site path in `site.json` and `games.json` (images, `play_url`) is either `null` or points to a file that exists.
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

## Rosie, the mascot

The mascot name and pictures live in `site.json` only. `name` is the short name used in most sentences. `fullName` is used on the About introduction and in image alt text. The approved original is `assets/mascot/source/rosie-ryno-original.png`.

| Field | Used for |
| --- | --- |
| `mascot.hero.large` | Home hero on wider screens: `anim` (animated wave) and `still` (for reduced motion), 386×500 |
| `mascot.hero.small` | Home hero on phones: `anim` and `still`, 260×337 |
| `mascot.full` | About and 404 |
| `mascot.head.webp` | Every small Rosie head: header (48 px), footer and home studio line (64 px), support title (88 px, 64 px on phones). A map of pixel size to file (`64`, `128`, `256`). Each page offers only the files that cover 1× and 2× at that spot. |
| `mascot.head.png` | The Organization `logo` in the home page's structured data (256×256) |
| `mascot.favicon` | Browser tab icons, one `<link rel="icon" sizes>` per entry (`32`, `48`) |
| `mascot.appleTouch` | Home-screen icon (`180`, opaque) |
| `mascot.social` | Share image for pages without their own (`png` is used) |

The `head`, `favicon`, and `appleTouch` entries map a pixel size to a file, for example `"64": "/assets/mascot/head/rosie-head-64.webp"`. The build checks that each file exists and really is that size. These files are the Art Director's approved ROSIE-HEAD export, kept as delivered in `assets/mascot/head/`. The 256 WebP was encoded from the delivered 256 PNG at the same settings (quality 90, alpha 100). Don't use the 512 export: it's an upscale and looks soft.

The hero files come from the approved wave loop, `assets/mascot/rosie-wave.webp`, which stays in the repo unchanged. To re-export them, run:

```bash
python3 scripts/export-rosie.py
```

It needs Python 3 with Pillow and numpy. The script header explains each step and the encoder settings. It writes only the four wave files. The build (`render-site.mjs`) checks that the sizes in `site.json` match the files.

## Icons and stars

Both come from the Art Director's approved sprites, used as delivered:

- **`assets/icons/icons-sprite.svg`** (ICON-SET): the sticker icons beside the home "For grown-ups" facts and the game page's "How it plays" and free/unlock lines. They show at 56 px (48 px on phones) with no box or tint behind them, and they're decorative (`aria-hidden`), because the text next to them carries the meaning.
- **`assets/twinkle/twinkle-sprite.svg`** (TWINKLE-SET): the background stars on the home hero band and a few faint ones in the footer.

Pages point at a symbol with `<svg><use href="/assets/icons/icons-sprite.svg#icon-gift"/></svg>`, so each sprite is one request for the whole site. Don't inline a sprite inside a `display: none` element, because some browsers then drop the glow filters.

The star list is `HERO_STARS` and `FOOTER_STARS` in `scripts/render-site.mjs`. Each star gets a class (`.s1`, `.s2`, ... and `.f1`, ...), and `site.css` positions it, with separate rules for phones. The CSP forbids `style` attributes, so positions can't go in the HTML. Hero stars must stay clear of Rosie's column at every width. On phones she stands at the top centre, so phone stars sit around the copy below her. Stars drift out and back over 60–120 s and stop under reduced motion.

## Add a new game

Adding a game is one entry in [`games.json`](games.json), plus its images. You do not redesign the pages.

1. Copy the Tiny Trails: Space object in `games.json`.
2. Set a new `id` (lowercase letters, numbers, and hyphens). `page` must be `/games/<id>/`. `short_title` is the name on the home hero button ("Play Tiny Trails").
3. Set `status` to `live`, `coming-soon`, or `hidden`.
   - `live` and `coming-soon` get a page, a row on the games index, and a sitemap entry.
   - `hidden` is left out of the site and the sitemap.
4. Write the copy for parents: `tagline`, `summary`, `description` (the meta description), `ages` (like `3–6`), `free_content`, `unlock`, `trial`, and `web_note`. `price` is the one-time unlock price, like `$0.99`, or `null`.
5. `highlights` are the "How it plays" lines. Each one has `text` and an `icon`: `trace`, `planet`, `helmet`, `replay`, `gift`, `key`, or `hand` (the symbols in `assets/icons/icons-sprite.svg`).
6. Leave `stores.ios` and `stores.android` as `null` until the real listing exists. Use a plain `https://` URL with no tracking parameters. Until then the page says "Coming soon to iPhone, iPad and Android."
7. Set `play_url` to the browser build on this site, or `null` if there is none. **It is the single setting for every Play in browser button.** Tiny Trails: Space uses `/games/space-maze/`, the build the live site has always used. When the sticker-style rebuild's web build is ready, flip `play_url` to its folder and re-run the script. `play_size_note` (for example `about 24 MB, best on Wi-Fi`) shows under the button on the game page.
8. Point `art` at image files under `assets/games/<id>/`, with alt text in `art_alt`. Every picture is optional: set the field to `null` (or leave `screens` empty) and that picture is left out, with no placeholder. A path that is set must point to a real file, or the build stops. `assets/games/tiny-trails-space/hero.webp` and its source `tt-hero-astro-3.png` are off-model and retired, and the build refuses them:
   - `hero`: cut-out key art beside the title on the home page and the game page.
   - `card`: the games index picture. The index falls back to `hero`, and shows no picture if neither exists.
   - `screens`: real in-game captures. The screenshot strip appears only when at least one exists.
   - `og`: the share image for the game page (PNG or JPEG, 1200×630). Without it, the site share image is used.
9. Pick an `accent` color (`#RRGGBB`). It is the thin underline under the game's title.
10. Run `node scripts/render-site.mjs`, then commit `games.json`, the new images, and the generated files (`games/<id>/index.html`, the home page, the games index, `assets/css/themes.css`, and `sitemap.xml`).

`/games/tiny-trails-beta/` is staging. It is not linked, it is omitted from `sitemap.xml`, and `robots.txt` disallows it. Do not add it to `games.json`.

## Privacy

The site does not use analytics, cookies, or third-party fonts. Baloo 2 and Nunito are self-hosted in `assets/fonts/` under the SIL Open Font License. Links that leave the site (app stores and email) go through a parental gate in `assets/js/site.js`. The menu works without JavaScript.

The games save progress on the device (browser storage for the web builds, app storage on phones and tablets). The privacy policy says so in "Cookies and device storage". When you change the policy text in `scripts/render-site.mjs`, update `POLICY_EFFECTIVE` at the top of the script so the date on the page changes too.
