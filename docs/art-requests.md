# Art requests — PinkRyno Studios site

For the Art Director. The website rewrite does **not** invent final illustrations in code. Where a picture is missing, the page shows a labeled slot (a candy-colored frame with the slot id on a sticker). Drop the finished file at the path below, then run `node scripts/render-site.mjs`. The slot becomes the image. No page redesign.

Do not draw these as pixel art, and do not trace or restyle another studio's characters, mazes, or UI. This is our cosmic sticker look: smooth flat shapes, one deep plum outline, one soft shadow down and to the right, cosmic candy colors.

## Mascot: Rosie Ryno

The studio mascot is **Rosie Ryno** (Rosie for short, she/her), a baby pink rhino. `site.json` holds `name`, `fullName`, and the image paths. The approved original is `assets/mascot/source/rosie-ryno-original.png`. The site uses the cut-outs beside it: `rosie-full` (hero), `rosie-head` (header and footer), `favicon.png`, `apple-touch-icon.png`, and `rosie-social` (share image). The older rhinoceros files (`pinkrynostudios-mascot.png`, `pinkrynostudios-head.png`, and the WebP copies) stay in the repo and are not linked. Do not draw more of that older character.

A new pose is still only a `site.json` path change, then `node scripts/render-site.mjs`.

The home hero is one `<picture>`. `mascot.hero.webp` plays when the visitor allows motion. `mascot.hero.stillWebp` is the still for `prefers-reduced-motion`. `mascot.hero.png` is the same still for browsers without WebP.

Those three files are the approved wave loop. The source movie is `assets/mascot/source/rosie-wave-loop.mp4` (4 seconds, 720×720, 24 fps). It was generated from the approved Midjourney Rosie image, `assets/mascot/source/rosie-ryno-original.png`. In the loop she waves, happy-squints, hops, and comes back to the start pose. The flat lavender field was removed, so the WebP has a real transparent background. The site version keeps every other frame (12 fps, 49 frames, 84 ms each, 386×500, looping). The page does not play the movie's audio. `rosie-wave.png` and `rosie-wave-still.webp` are the first frame.

The keyed frames had a blurry green smudge beside both ears: a larger one just to the viewer's right of her head, level with the top of her eyes, and a smaller one on the viewer's left. They were half-transparent keying leftovers, and they sat on every frame. Those pixels are now transparent in all 49 frames of `rosie-wave.webp`, and in the still WebP and PNG. The crisp star by her horn, her outline, the contact shadow, the timing, and the loop were left as they were. The source movie was not edited.

The older full-body cut-out, `rosie-full`, is still the picture on About, Support, and the 404. The eye and body cut layers in `assets/mascot/source/` (`rosie-body-no-eyes.png`, `rosie-eyes.png`) are not used. Do not build a CSS blink or a separate arm on top of them.

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
| TT-HERO | `assets/games/tiny-trails-space/hero.webp` | Home Now playing and the Tiny Trails: Space page, with no frame. This file is in place. | 713×656 (keyed crop of the chosen art) |
| TT-CARD | `assets/games/tiny-trails-space/card.webp` | Home and games index card | 1280×800 (16:10) |
| TT-SCENE-PLAY | `assets/games/tiny-trails-space/scene-play.webp` | Game page, first scene | 1200×900 (4:3) |
| TT-SCENE-WORLDS | `assets/games/tiny-trails-space/scene-worlds.webp` | Game page, second scene | 1200×900 (4:3) |
| TT-SCENE-DONE | `assets/games/tiny-trails-space/scene-done.webp` | Game page, third scene | 1200×900 (4:3) |
| ABOUT-SCENE | `assets/images/about-scene.webp` | About page | 1600×900 (16:9) |

Optional, not slotted on the page yet. Say if you want them wired in:

| Slot | Suggested file | Notes |
| --- | --- | --- |
| OG-SHARE | `assets/mascot/rosie-social.webp` | Social share image, 1200×630. This file is already the mascot on the site mist color. A future illustrated card can replace `mascot.social` in `site.json`. |
| MASCOT-LOST | `assets/images/mascot-lost.webp` | Optional puzzled Rosie for the 404 page. Until this exists, that page uses the main mascot picture. |
| TT-TRAILER | `assets/games/tiny-trails-space/trailer.webp` | A short silent trailer still or looping WebP. Prefer a real capture from the game once the cosmic sticker build exists. |

## Prompts (Midjourney v7)

### 0. Style anchor (also the TT-HERO key art)

`flat vector cartoon sticker illustration of a cute chibi kid astronaut with a round glass helmet and pink curly hair floating beside a glowing raised peach stardust path on a soft lavender moon, a chubby smiling butter-yellow star with rounded points waiting ahead, a small mint planet and a sky-teal moon in a deep navy-violet sky, consistent medium-weight deep plum outlines on every shape, flat two-tone cel shading, one soft violet drop shadow offset down and to the right, cosmic candy palette of lavender peach mint butter-yellow and sky teal, rounded friendly shapes, kawaii faces with blush, clean and uncluttered, children's game art for ages 3-6 --ar 16:9 --v 7 --style raw --stylize 150 --no text, letters, watermark, photorealism, pixel art, gradients on characters, scary, sharp teeth, black outlines`

Cassie picked this anchor: Midjourney job `8e26e821-8670-4c90-b69c-a6674459051a`, index 3 (bottom-left), file `tt-hero-astro-3`. Astro #2 was the image prompt, with the cosmic-sticker style reference. The original PNG is `assets/games/tiny-trails-space/source/tt-hero-astro-3.png` (1456×816). The flat lavender field was removed, and `hero.webp` is that cut-out at 713×656. It sits on the page with no frame, card, or border, on the home Now playing spot and at the top of the Tiny Trails: Space page. The alt text is in `games.json` under `art_alt.hero`.

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

### 7. Optional MASCOT-LOST

`flat vector cartoon sticker of Rosie Ryno, a cute baby pink rhinoceros, big head, tiny horn, rosy cheeks, chubby baby proportions, looking gently puzzled with a small open smile, one hoof raised, a tiny butter-yellow star beside them, deep plum outline, flat two-tone shading, one soft drop shadow, plain cream background, children's mascot art --ar 1:1 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, scary, tears`

### 8. Rosie Ryno turnaround (the files site.json will point at)

`character sheet of Rosie Ryno, a cute baby pink rhinoceros, big head, small round body, tiny horn, closed smiling eyes, rosy cheeks, chubby baby proportions, no clothes, front view and a waving pose and a head-only portrait, consistent deep plum outline, flat two-tone cel shading, kawaii, plain cream background, children's mascot --ar 3:2 --v 7 --style raw --stylize 100 --sref <anchor url> --sw 300 --no text, letters, watermark, photorealism, pixel art, scary, sharp teeth, clothing`

## After the files land

1. Put the WebP files at the paths in the table. Keep the file names.
2. From the repo root, run `node scripts/render-site.mjs`.
3. Check the games index, the Tiny Trails: Space page, and About. The slot stickers for those files should be gone, and each image should have its alt text from `games.json` (or the about-scene alt in the render script).
