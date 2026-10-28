#!/usr/bin/env python3
"""Re-export Rosie's approved wave loop for the website.

Run from the repo root:  python3 scripts/export-rosie.py
Needs Python 3 with Pillow (WebP support) and numpy. No other tools.

Source file (never modified):
  assets/mascot/rosie-wave.webp   49 frames, 386x500, 84 ms each, stars already removed

Outputs (new names, overwritten on each run):
  assets/mascot/rosie-wave-386.webp        animated, native size, desktop hero
  assets/mascot/rosie-wave-386-still.webp  first frame, for prefers-reduced-motion
  assets/mascot/rosie-wave-260.webp        animated, 260x337, phone hero
  assets/mascot/rosie-wave-260-still.webp  first frame, for prefers-reduced-motion

The small Rosie heads (header, footer, support title, favicons) are not made
here. They are the Art Director's ROSIE-HEAD export in assets/mascot/head/.

Rosie's drawing, poses, timing, and loop are unchanged. Two fixes only:

1. The keyed source has a half-transparent body (her shading was keyed as
   see-through), so she turns muddy purple on the navy hero band. Everything
   inside her opaque outline is flattened onto the light page color (#FBF8FF),
   which is exactly how she looks on the light page, and made opaque. Pixels
   outside the outline keep their original alpha. The 2 px antialiased edge
   just outside the outline takes the outline's own dark plum color, so no
   light fringe from the old backdrop shows on navy. The soft ground shadow is
   left as it is.
2. The last four source frames repeat the same pose. They are folded into one
   frame with the summed duration (49 -> 45 frames, same 4116 ms loop).

Animated WebP stores every frame as its own picture, and every source frame is
a fresh render, so the file size scales with frames x pixels. That is why the
phone hero gets its own 260 px file.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
MASCOT = ROOT / "assets" / "mascot"
PAGE = np.array([0xFB, 0xF8, 0xFF], dtype=np.float32)

# Outline detection: first setting whose filled area looks like a whole Rosie wins.
MASK_TRIES = [(150, 1), (150, 2), (150, 3), (120, 3)]
MIN_AREA_RATIO = 0.96
# Width in pixels of the antialiased edge outside the outline.
EDGE_RING = 2

# Consecutive frames whose silhouettes differ by fewer pixels than this are the
# same pose (the last frames are a hold). They become one frame with the summed
# duration, so the motion and timing stay exactly the same.
SAME_POSE_PIXELS = 150

# Encoder settings, tuned by eye at display size on the navy band.
ANIM = {"quality": 30, "alpha_quality": 60, "method": 6}
STILL = {"quality": 80, "alpha_quality": 90, "method": 6}


def interior(alpha, threshold, close):
    """Pixels enclosed by Rosie's outline (alpha >= threshold), outline included."""
    mask = Image.fromarray(((alpha >= threshold) * 255).astype("uint8"), "L")
    if close:
        mask = mask.filter(ImageFilter.MaxFilter(2 * close + 1))
    padded = Image.new("L", (mask.width + 2, mask.height + 2), 0)
    padded.paste(mask, (1, 1))
    ImageDraw.floodfill(padded, (0, 0), 128)
    inside = np.array(padded)[1:-1, 1:-1] != 128
    if close:
        shrunk = Image.fromarray((inside * 255).astype("uint8"), "L").filter(ImageFilter.MinFilter(2 * close + 1))
        inside = np.array(shrunk) > 0
    return inside


def flatten(frame, expected_area=None):
    rgba = np.array(frame.convert("RGBA")).astype(np.float32)
    alpha = rgba[:, :, 3]
    inside = None
    for threshold, close in MASK_TRIES:
        inside = interior(alpha, threshold, close)
        if expected_area is None or inside.sum() >= MIN_AREA_RATIO * expected_area:
            break
    a = (alpha[inside] / 255.0)[:, None]
    rgba[inside, :3] = rgba[inside, :3] * a + PAGE * (1.0 - a)
    rgba[inside, 3] = 255.0
    # The soft edge just outside the outline still carries the old lavender
    # backdrop, which shows as a light fringe on navy. Give it the outline color.
    inside_img = Image.fromarray((inside * 255).astype("uint8"), "L")
    near = np.array(inside_img.filter(ImageFilter.MaxFilter(2 * EDGE_RING + 1))) > 0
    rim = inside & ~(np.array(inside_img.filter(ImageFilter.MinFilter(3))) > 0)
    ring = near & ~inside & (alpha > 0)
    rgba[ring, :3] = np.median(rgba[rim, :3], axis=0)
    return Image.fromarray(np.clip(rgba + 0.5, 0, 255).astype("uint8"), "RGBA"), int(inside.sum())


def resize(image, width):
    height = round(image.height * width / image.width)
    # Premultiplied alpha avoids edge fringes. BOX (area average) keeps the alpha
    # edge free of ringing, which roughly halves the alpha cost per frame.
    return image.convert("RGBa").resize((width, height), Image.BOX).convert("RGBA")


def merge_holds(frames, durations):
    """Fold frames that repeat the previous pose into it, keeping total time."""
    kept, kept_durations = [frames[0]], [durations[0]]
    previous = np.array(frames[0])[:, :, 3] == 255
    for frame, duration in zip(frames[1:], durations[1:]):
        silhouette = np.array(frame)[:, :, 3] == 255
        if int((silhouette ^ previous).sum()) < SAME_POSE_PIXELS:
            kept_durations[-1] += duration
        else:
            kept.append(frame)
            kept_durations.append(duration)
            previous = silhouette
    return kept, kept_durations


def load_frames(path):
    source = Image.open(path)
    frames, durations = [], []
    for index in range(source.n_frames):
        source.seek(index)
        frames.append(source.convert("RGBA"))
        durations.append(source.info.get("duration", 84))
    return frames, durations


def save_anim(frames, durations, path):
    frames[0].save(
        path,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        lossless=False,
        minimize_size=True,
        background=(0, 0, 0, 0),
        **ANIM,
    )


def main():
    frames, durations = load_frames(MASCOT / "rosie-wave.webp")
    areas = [int(interior(np.array(f)[:, :, 3].astype(np.float32), *MASK_TRIES[0]).sum()) for f in frames]
    expected = float(np.median(areas))
    flat = [flatten(frame, expected)[0] for frame in frames]
    flat, durations = merge_holds(flat, durations)
    print(f"{len(frames)} source frames -> {len(flat)} frames, {sum(durations)} ms loop")

    outputs = []
    for width in (386, 260):
        sized = flat if width == flat[0].width else [resize(f, width) for f in flat]
        anim_path = MASCOT / f"rosie-wave-{width}.webp"
        still_path = MASCOT / f"rosie-wave-{width}-still.webp"
        save_anim(sized, durations, anim_path)
        sized[0].save(still_path, lossless=False, **STILL)
        outputs += [anim_path, still_path]

    for path in outputs:
        with Image.open(path) as image:
            frames_out = getattr(image, "n_frames", 1)
            print(f"{path.relative_to(ROOT)}  {image.width}x{image.height}  {frames_out} frame(s)  {path.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
