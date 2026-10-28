# Art requests — PinkRyno Studios site

For the Art Director. The website rewrite does **not** invent final illustrations in code. Where a picture is missing, the page leaves it out, with no placeholder. Drop the finished file at the path below, point its slot at it in the art map (`site.json` `art`, or the game's `art` in `games.json`), then run `node scripts/render-site.mjs`. The slots, sizes, and formats are in the README's [Art slots](../README.md#art-slots-swapping-art) section. The picture appears. No page redesign.

Do not draw these as pixel art, and do not trace or restyle another studio's characters, mazes, or UI. This is our cosmic sticker look: smooth flat shapes, one deep plum outline, one soft shadow down and to the right, cosmic candy colors.

## Mascot: Rosie Ryno

The studio mascot is **Rosie Ryno** (Rosie for short, she/her), a baby pink rhino. `site.json` holds her `name` and `fullName` under `mascot`, and every image path under `art`. The site uses the final approved **Rosie AB set** from the art handoff folder (`art-for-site/rosie/`): the wave and its stills (`assets/mascot/rosie-wave-386.webp`, `rosie-wave-386-still.webp`, `rosie-wave-260.webp`, `rosie-wave-260-still.webp`), the full-body Rosie on About (`rosie-full-512.webp`, `rosie-full-1024.webp`), the puzzled pose on the 404 page (`rosie-puzzled-512.webp`, `rosie-puzzled-1024.webp`), the head set in `assets/mascot/head/` (header, footer, support title, the PNG favicons, the apple-touch icon, and the logo), and `/favicon.ico`. The original Rosie art and the older rhinoceros files (`pinkrynostudios-mascot.png`, `pinkrynostudios-head.png`, and the WebP copies) were removed from the `site-redesign` branch as unused. They remain on `main` until the branch is merged. Do not draw more of that older character.

A new pose is only an `art` map change in `site.json`, then `node scripts/render-site.mjs`.

Rosie waves in the home "Meet Rosie" section, below the fold. The page loads only her still (the wave's first frame), and the wave swaps in when she scrolls near the screen, never under `prefers-reduced-motion`. Each loop is 3.6 s: two gentle waves of her raised paw and one short blink, with her body still. The sizes, budgets, and markup are in [PLAN.md's Rosie art handoff](site-redesign/PLAN.md#rosie-art-handoff) and the README's [Art slots](../README.md#art-slots-swapping-art) section.

No Rosie file the site uses has stars, sparkles, or text baked in, and nothing on the site sits behind or around her: no box, card, border, or background panel. The only stars are the TWINKLE-SET SVG stars in the home hero band's background (plus a few faint ones in the footer), which are not tied to Rosie, keep clear of her, and stop moving under reduced motion.

## How to prompt

1. Generate **prompt 0** first and pick the best image as the style anchor.
2. Add `--sref <anchor url> --sw 300` to every prompt after that.
3. Keep words out of the pictures. The website sets the titles.
4. Plain cream background (`#F7F2FF` family) is easier to cut out than a busy scene. Transparent is welcome when the tool can do it cleanly.
5. Export the sizes below as WebP (quality around 80). PNG is fine as the working file; the site paths are `.webp`.

Shared ending, already included in each prompt where it matters:

> consistent medium-weight deep plum (#2B1E4A) outlines on every shape, flat two-tone cel shading, one soft violet drop shadow offset down and to the right, cosmic candy palette of lavender, peach, mint, butter yellow, and sky teal, navy-violet only in a space background, rounded friendly shapes, kawaii faces with blush, clean and uncluttered, children's art for ages 3–6

Negative prompt used throughout: `--no text, letters, watermark, logo, photorealism, pixel art, gradients on characters, scary, sharp teeth, black outlines`

## Slot list

| Slot | File to deliver | Where it shows | Size |
| --- | --- | --- | --- |
| TT-HERO | A new file, for example `assets/games/tiny-trails-space/hero-astro2.webp`, set as `art.hero` in `games.json` | Home game section and the Tiny Trails: Space page, cut out with no frame. **Needed: Astro design #2.** The old `hero.webp` (`tt-hero-astro-3`) is off-model and retired from the site. | about 800×700, cut out |
| TT-CARD | `assets/games/tiny-trails-space/card.webp` | Games index row (Astro design #2) | 1280×800 (16:10) |
| TT-SCENE-PLAY | `assets/games/tiny-trails-space/scene-play.webp` | Game page, first scene | 1200×900 (4:3) |
| TT-SCENE-WORLDS | `assets/games/tiny-trails-space/scene-worlds.webp` | Game page, second scene | 1200×900 (4:3) |
| TT-SCENE-DONE | `assets/games/tiny-trails-space/scene-done.webp` | Game page, third scene | 1200×900 (4:3) |
| ABOUT-SCENE | `assets/images/about-scene.webp`, set as `art.aboutScene` in `site.json` | About page | 1600×900 (16:9) |

Optional, not slotted on the page yet. Say if you want them wired in:

| Slot | Suggested file | Notes |
| --- | --- | --- |
| OG-SHARE | `assets/og/og-home.jpg` (OG-HOME) | Delivered and slotted as `art.og.default` in `site.json`: the 1200×630 share image for Home, About, Support, Privacy, and the 404 page (the games index and the Tiny Trails: Space page use OG-TINY-TRAILS from `games.json`). A future illustrated card can replace `art.og.default`. The older `assets/mascot/rosie-social.webp` was removed from the `site-redesign` branch as unused. |
| MASCOT-LOST | `assets/mascot/rosie-puzzled-512.webp` | Delivered with the Rosie AB set and slotted in `art.rosie.lost` (the 1024 file is its 2x). |
| TT-TRAILER | `assets/games/tiny-trails-space/trailer.webp` | A short silent trailer still or looping WebP. Prefer a real capture from the game once the cosmic sticker build exists. |

## Prompts (Midjourney v7)

### 0. Style anchor (also the TT-HERO key art)

`flat vector cartoon sticker illustration of a cute chibi kid astronaut with a round glass helmet and pink curly hair floating beside a glowing raised peach stardust path on a soft lavender moon, a chubby smiling butter-yellow star with rounded points waiting ahead, a small mint planet and a sky-teal moon in a deep navy-violet sky, consistent medium-weight deep plum outlines on every shape, flat two-tone cel shading, one soft violet drop shadow offset down and to the right, cosmic candy palette of lavender peach mint butter-yellow and sky teal, rounded friendly shapes, kawaii faces with blush, clean and uncluttered, children's game art for ages 3-6 --ar 16:9 --v 7 --style raw --stylize 150 --no text, letters, watermark, photorealism, pixel art, gradients on characters, scary, sharp teeth, black outlines`

Cassie picked this anchor: Midjourney job `8e26e821-8670-4c90-b69c-a6674459051a`, index 3 (bottom-left), file `tt-hero-astro-3`. Astro #2 was the image prompt, with the cosmic-sticker style reference. The original PNG is `assets/games/tiny-trails-space/source/tt-hero-astro-3.png` (1456×816). The flat lavender field was removed, and `hero.webp` is that cut-out at 713×656. **Cycle 2: this image is retired from the site.** It is off-model: the explorer is not Astro design #2. All Tiny Trails art on the site must show Astro design #2 (Midjourney job `76179866-926d-4694-803d-68e713e4b88b`, as defined in `docs/art/ART-BIBLE.md` of the tiny-trails-framework repo, branch `rebuild`). The files stay in the repo, but `games.json` no longer points at them. See the art list in [site-redesign/PLAN.md](site-redesign/PLAN.md).

### 1. TT-CARD

`flat vector cartoon sticker illustration, a cute top-down glimpse of a rounded glowing stardust path on a lavender moon, a tiny chibi astronaut near a start ring and a smiling butter-yellow star at the end of the path, the path slightly raised with one soft violet drop shadow, thick consistent deep plum outline, cosmic candy palette, lots of calm empty moon around the path, children's game art for ages 3-6 --ar 8:5 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, perspective horizon, scary`

### 2. TT-SCENE-PLAY

`flat vector cartoon sticker, a chibi astronaut in a peach and white suit with a round glass helmet tracing along a raised glowing moon path, soft sparkles locked to the path behind them, lavender moon ground with a few round craters, deep plum outlines, flat two-tone shading, one soft drop shadow down-right, kawaii blush, plain calm background, children's game art --ar 4:3 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, scary`

### 3. TT-SCENE-WORLDS

`flat vector cartoon sticker of three cute planets in a row for a preschool game: a butter-yellow sun with a gentle smile and soft coral glow, a mint world with tiny round flowers, a sky-teal moon with smooth craters, same size, consistent deep plum outlines, flat two-tone shading, one soft drop shadow, kawaii, plain cream background, children's game art --ar 4:3 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, scary, sharp teeth`

### 4. TT-SCENE-DONE

`flat vector cartoon sticker of a chibi astronaut hugging a chubby five-point star with rounded tips, the star butter-yellow with a peach shadow side and a kawaii smile, both with deep plum outlines and blush, a few soft peach and lavender dots around them, flat two-tone shading, one soft drop shadow, plain cream background, children's game art --ar 4:3 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, sharp points, scary`

### 5. ABOUT-SCENE

`flat vector cartoon sticker illustration of Rosie Ryno, a cute baby pink rhinoceros, big head, small round body, tiny horn, closed smiling eyes, rosy cheeks, chubby baby proportions, no clothes, sitting beside a small smiling lavender planet and a little chibi astronaut, kawaii, consistent deep plum outlines, flat two-tone cel shading, one soft violet drop shadow down-right, cosmic candy palette, plain cream background, children's studio art for ages 3-6 --ar 16:9 --v 7 --style raw --stylize 150 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, scary, sharp teeth, clothing on the rhino`

### 6. Optional OG-SHARE

`flat vector cartoon sticker of Rosie Ryno, a cute baby pink rhinoceros waving, big head, tiny horn, closed smiling eyes, rosy cheeks, chubby baby proportions, a small butter-yellow star and a mint planet nearby, deep navy-violet space with soft lavender and teal nebula shapes, lots of empty calm space on the right, deep plum outlines, flat shading, one soft drop shadow, no words anywhere --ar 16:9 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art`

Crop to 1200×630 if this is used as the share image.

### 7. MASCOT-LOST (delivered as the Rosie AB puzzled pose, kept for reference)

`flat vector cartoon sticker of Rosie Ryno, a cute baby pink rhinoceros, big head, tiny horn, rosy cheeks, chubby baby proportions, looking gently puzzled with a small open smile, one hoof raised, a tiny butter-yellow star beside them, deep plum outline, flat two-tone shading, one soft drop shadow, plain cream background, children's mascot art --ar 1:1 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, scary, tears`

### 8. Rosie Ryno turnaround (the files site.json will point at)

`character sheet of Rosie Ryno, a cute baby pink rhinoceros, big head, small round body, tiny horn, closed smiling eyes, rosy cheeks, chubby baby proportions, no clothes, front view and a waving pose and a head-only portrait, consistent deep plum outline, flat two-tone cel shading, kawaii, plain cream background, children's mascot --ar 3:2 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, scary, sharp teeth, clothing`

## After the files land

1. Put the WebP files at the paths in the table and set each slot in the art map, with its alt text.
2. From the repo root, run `node scripts/render-site.mjs`.
3. Check the home page, the games index, and the Tiny Trails: Space page. Each new picture should appear with the alt text from its art entry.
