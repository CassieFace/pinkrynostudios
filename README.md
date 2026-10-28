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

The script writes the pages, `assets/css/themes.css`, and `sitemap.xml`. It overwrites the generated HTML, so edit `games.json`, `site.json`, or the script, then run it again. Do not hand-edit the generated pages. It refuses to write a page that contains "TODO".

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
| `mascot.icon` | Header, footer, and the studio line (128×128) |
| `mascot.head` | Support page title, plus 2× screens where the icon is shown large |
| `mascot.favicon`, `mascot.appleTouch` | Small icons |
| `mascot.social` | Share image for pages without their own (`png` is used) |

The hero files come from the approved wave loop, `assets/mascot/rosie-wave.webp`, which stays in the repo unchanged. To re-export them, run:

```bash
python3 scripts/export-rosie.py
```

It needs Python 3 with Pillow and numpy. The script header explains each step and the encoder settings. The script checks that the sizes in `site.json` match the files.

## Add a new game

Adding a game is one entry in [`games.json`](games.json), plus its images. You do not redesign the pages.

1. Copy the Tiny Trails: Space object in `games.json`.
2. Set a new `id` (lowercase letters, numbers, and hyphens). `page` must be `/games/<id>/`. `short_title` is the name on the home hero button ("Play Tiny Trails").
3. Set `status` to `live`, `coming-soon`, or `hidden`.
   - `live` and `coming-soon` get a page, a row on the games index, and a sitemap entry.
   - `hidden` is left out of the site and the sitemap.
4. Write the copy for parents: `tagline`, `summary`, `description` (the meta description), `ages` (like `3–6`), `free_content`, `unlock`, `trial`, and `web_note`. `price` is the one-time unlock price, like `$0.99`, or `null`.
5. `highlights` are the "How it plays" lines. Each one has `text` and an `icon`: `trace`, `planet`, `explorer`, `replay`, `gift`, `key`, or `target`.
6. Leave `stores.ios` and `stores.android` as `null` until the real listing exists. Use a plain `https://` URL with no tracking parameters. Until then the page says "Coming soon to iPhone, iPad and Android."
7. Set `play_url` to the browser build on this site, or `null` if there is none. **It is the single setting for every Play in browser button.** Tiny Trails: Space uses `/games/space-maze/`, the build the live site has always used. When the sticker-style rebuild's web build is ready, flip `play_url` to its folder and re-run the script. `play_size_note` (for example `about 24 MB, best on Wi-Fi`) shows under the button on the game page.
8. Point `art` at image files under `assets/games/<id>/`, with alt text in `art_alt`. Every picture is optional. If a file does not exist, that picture is simply left out, with no placeholder:
   - `hero`: cut-out key art beside the title on the home page and the game page.
   - `card`: the games index picture. The index falls back to `hero`, and shows no picture if neither exists.
   - `screens`: real in-game captures. The screenshot strip appears only when at least one exists.
   - `og`: the share image for the game page (PNG or JPEG, 1200×630). Without it, the site share image is used.
9. Pick an `accent` color (`#RRGGBB`). It is the thin underline under the game's title.
10. Run `node scripts/render-site.mjs`, then commit `games.json`, the new images, and the generated files (`games/<id>/index.html`, the home page, the games index, `assets/css/themes.css`, and `sitemap.xml`).

`/games/tiny-trails-beta/` is staging. It is not linked, it is omitted from `sitemap.xml`, and `robots.txt` disallows it. Do not add it to `games.json`.

## Privacy

The site does not use analytics, cookies, or third-party fonts. Baloo 2 and Nunito are self-hosted in `assets/fonts/` under the SIL Open Font License. Links that leave the site (app stores and email) go through a parental gate in `assets/js/site.js`. The menu works without JavaScript.
