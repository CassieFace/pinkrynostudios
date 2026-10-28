#!/usr/bin/env python3
"""Convert site-redesign screenshots from PNG to optimized JPEG.

- Desktop PNGs keep their size; *-mobile.png (captured at 2x) are halved with
  LANCZOS so they are 390 CSS px wide at 1x.
- Output: RGB JPEG, quality 80, progressive, optimize=True, next to the source.
- Also writes 700px-wide previews (quality 70) to /tmp/prev/.
- Source PNGs are deleted only after every JPEG has been written and verified.
"""

import sys
from pathlib import Path

from PIL import Image

SRC_DIR = Path("/workspace/pinkryno/pinkrynostudios/docs/site-redesign/screenshots")
PREVIEW_DIR = Path("/tmp/prev")
MOBILE_SCALE = 0.5
PREVIEW_WIDTH = 700
JPEG_OPTS = {"quality": 80, "progressive": True, "optimize": True}
PREVIEW_OPTS = {"quality": 70, "progressive": True, "optimize": True}


def to_rgb(im):
    """Return an RGB copy, flattening any transparency onto white."""
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.getchannel("A"))
        return bg
    return im.convert("RGB")


def scaled(im, factor):
    w, h = im.size
    size = (max(1, round(w * factor)), max(1, round(h * factor)))
    return im if size == im.size else im.resize(size, Image.LANCZOS)


def verify_jpeg(path, expected_size):
    """Raise if the file is not a fully decodable RGB JPEG of the expected size."""
    with Image.open(path) as im:
        im.verify()
    with Image.open(path) as im:
        im.load()
        if im.format != "JPEG":
            raise ValueError(f"{path.name}: format is {im.format}, expected JPEG")
        if im.mode != "RGB":
            raise ValueError(f"{path.name}: mode is {im.mode}, expected RGB")
        if im.size != expected_size:
            raise ValueError(f"{path.name}: size {im.size}, expected {expected_size}")


def main():
    pngs = sorted(SRC_DIR.glob("*.png"))
    if not pngs:
        print(f"No PNG files found in {SRC_DIR}")
        return 0

    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    outputs = []  # (png, jpg, size, preview, preview_size)

    # 1. Write JPEGs and previews.
    for png in pngs:
        with Image.open(png) as src:
            rgb = to_rgb(src)
            icc = src.info.get("icc_profile")
        extra = {"icc_profile": icc} if icc else {}

        is_mobile = png.stem.endswith("-mobile")
        out = scaled(rgb, MOBILE_SCALE) if is_mobile else rgb
        jpg = png.with_suffix(".jpg")
        out.save(jpg, "JPEG", **JPEG_OPTS, **extra)

        # Previews come from the full-resolution source so mobile shots
        # (390px at 1x) are never upscaled to 700px.
        preview = scaled(rgb, PREVIEW_WIDTH / rgb.width)
        prev_path = PREVIEW_DIR / jpg.name
        preview.save(prev_path, "JPEG", **PREVIEW_OPTS, **extra)

        outputs.append((png, jpg, out.size, prev_path, preview.size))

    # 2. Verify every output before touching any source file.
    failures = []
    for png, jpg, size, prev_path, prev_size in outputs:
        for path, expected in ((jpg, size), (prev_path, prev_size)):
            try:
                verify_jpeg(path, expected)
            except Exception as exc:  # noqa: BLE001 - report every failure
                failures.append(f"{path}: {exc}")
    if failures:
        print("Verification failed; no PNGs were deleted:", file=sys.stderr)
        for f in failures:
            print(f"  {f}", file=sys.stderr)
        return 1

    # 3. All JPEGs verified: delete the source PNGs.
    for png, *_ in outputs:
        png.unlink()

    # 4. Report.
    rows = [(jpg.name, f"{w}x{h}", jpg.stat().st_size / 1024)
            for _, jpg, (w, h), _, _ in outputs]
    total_kb = sum(r[2] for r in rows)
    name_w = max(len("File"), *(len(r[0]) for r in rows))
    dim_w = max(len("Dimensions"), *(len(r[1]) for r in rows))
    size_w = max(len("Size (KB)"), len(f"{total_kb:,.1f}"))

    header = f"{'File':<{name_w}}  {'Dimensions':>{dim_w}}  {'Size (KB)':>{size_w}}"
    print(header)
    print("-" * len(header))
    for name, dims, kb in rows:
        print(f"{name:<{name_w}}  {dims:>{dim_w}}  {kb:>{size_w},.1f}")
    print("-" * len(header))
    print(f"{f'Total ({len(rows)} files)':<{name_w}}  {'':>{dim_w}}  {total_kb:>{size_w},.1f}"
          f"  ({total_kb / 1024:.2f} MB)")

    prev_kb = sum(p.stat().st_size for _, _, _, p, _ in outputs) / 1024
    print(f"\nDeleted {len(outputs)} source PNGs. "
          f"Wrote {len(outputs)} previews to {PREVIEW_DIR} ({prev_kb:,.1f} KB total).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
