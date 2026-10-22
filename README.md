# PinkRyno Studios

Static website for [pinkrynostudios.com](https://pinkrynostudios.com). GitHub Pages serves the files in this repository. There is no site build step and no change to Pages settings.

The live browser game stays at `games/space-maze/`. Do not edit that folder, `games/tiny-trails-beta/`, or `CNAME` from the website work.

## Add a new game

Adding a game is one entry in [`games.json`](games.json), plus its images. You do not redesign the pages.

1. Copy the Tiny Trails: Space object in `games.json`.
2. Set a new `id` (lowercase letters, numbers, and hyphens). `page` must be `/games/<id>/`.
3. Set `status` to `live`, `coming-soon`, or `hidden`.
   - `live` and `coming-soon` get a page, a card, and a sitemap entry.
   - `hidden` is left out of the site and the sitemap.
4. Leave `stores.ios` and `stores.android` as `null` until the real listing exists. Use a plain `https://` URL with no tracking parameters. The buttons stay off the page until then.
5. Set `play_url` only for a page on this site, such as `/games/space-maze/`. Leave it `null` if there is no browser build yet.
6. Point `art` at image files under `assets/games/<id>/`. Until a file exists, the page shows a labeled art slot instead of a picture. Alt text lives in `art_alt`. Slot names live in `art_slots` and match [docs/art-requests.md](docs/art-requests.md).
7. Pick an `accent` color (`#RRGGBB`). It is used as a stripe on the card, not as text.
8. Run:

```bash
node scripts/render-site.mjs
```

9. Commit `games.json`, the new images, and the generated files (`games/<id>/index.html`, the home page, the games index, `assets/css/themes.css`, and `sitemap.xml`).

`scripts/render-site.mjs` overwrites the generated HTML. Edit `games.json` or the script, then run it again. Do not hand-edit the generated pages.

`/games/tiny-trails-beta/` is staging. It is not linked, it is omitted from `sitemap.xml`, and `robots.txt` disallows it. Do not add it to `games.json`.

## Privacy

The site does not use analytics, cookies, or third-party fonts. Baloo 2 and Nunito are self-hosted in `assets/fonts/` under the SIL Open Font License. Links that leave the site (app stores and email) go through a parental gate in `assets/js/site.js`.
