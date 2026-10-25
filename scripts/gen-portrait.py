#!/usr/bin/env python3
"""
Generate the dot-portrait point cloud from the portrait photo.

Why this exists
---------------
`src/data/portrait.ts` used to be a frozen hand-made point cloud: 6.586
points at a single spacing, where the dot SIZE was only very loosely
related to the photo (the correlation with actual darkness was -0.63, i.e.
inverted). The result was a featureless silhouette — no eyes, nose or
cheek shading — and a portrait that looked like an ink blot in light mode.

This script samples the photo on a regular grid and encodes two channels:

  * DENSITY  — a cell is filled only where the subject is. Eyes, nostrils
               and the gap under the chin fall out naturally as holes, so
               the face reads as a face even at tiny sizes.
  * TONE     — the size of the dot follows local darkness. Light areas get
               small dots (sparse, airy), shadow gets big dots (solid), so
               the portrait gains a light-to-dark gradient instead of one
               uniform fill.

Usage
-----
    python3 scripts/gen-portrait.py            # write src/data/portrait-photo.ts
    python3 scripts/gen-portrait.py --preview  # only print an ASCII map

This is an ALTERNATIVE to the hand-tuned cloud currently shipped in
`src/data/portrait.ts`. It writes to `src/data/portrait-photo.ts` and is never
imported by the app: the owner compared the two and kept the original, so the
generator must not be able to overwrite it by accident.

The output type is identical (`PortraitData`), so swapping the import is the
only change needed if this version is ever preferred. Re-running is safe: the
result is deterministic.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "icon.webp"
# IMPORTANT: the shipped portrait is the ORIGINAL hand-tuned cloud, restored
# because it is the version the owner prefers. This script generates an
# ALTERNATIVE, photo-derived cloud — it writes to its own file so it can never
# silently replace the live portrait again. To adopt it, copy it over
# `portrait.ts` deliberately.
TARGET = ROOT / "src" / "data" / "portrait-photo.ts"

# Grid: 115 x 120 cells keeps the original coordinates (so every existing
# tune in the renderer — hover radius, spring, burst — still means the same
# thing) while giving each cell room for a distinct dot size.
GRID_W = 115
GRID_H = 120

# A cell becomes a dot when the subject occupies at least this share of it.
SUBJECT_CUTOFF = 0.42

# Everything darker than this is part of the silhouette. The backdrop sits at
# ~164-190, so this deliberately stays just under it (see load_mask_and_tone).
BD_CUTOFF = 150

# Each dot's size is a RADIUS MULTIPLIER (1.0 = fills its grid cell), not a
# pixel size. The band stays narrow on purpose: light areas must keep visible
# gaps and dark areas must not merge into a solid slab.
SIZE_MIN, SIZE_MAX = 0.55, 1.35


def otsu_threshold(values: np.ndarray) -> int:
    """Bimodal split for the luminance histogram (background vs subject)."""
    hist, _ = np.histogram(values, bins=256, range=(0, 256))
    total = hist.sum()
    if total == 0:
        return 128
    weights = hist / total
    levels = np.arange(256)
    best_var, best_t = -1.0, 128
    w0 = np.cumsum(weights)
    w1 = 1.0 - w0
    m0 = np.cumsum(levels * weights)
    m_all = m0[-1]
    for t in range(1, 255):
        if w0[t] < 1e-6 or w1[t] < 1e-6:
            continue
        mu0 = m0[t] / w0[t]
        mu1 = (m_all - m0[t]) / w1[t]
        var = w0[t] * w1[t] * (mu0 - mu1) ** 2
        if var > best_var:
            best_var, best_t = var, t
    return best_t


def load_mask_and_tone(path: Path) -> tuple[np.ndarray, np.ndarray]:
    """Return (subject mask, darkness) as float arrays in [0, 1].

    This is a backlit studio portrait, so the luminance histogram has three
    bands, not two:

        ~20-36   hair and shirt (near black)
        ~90-150  the face and the skin tones
        ~164-190 the backdrop (the brightest thing in the frame)

    Otsu splits at ~104, which drops the whole face — the portrait came out
    as an outline of hair with an empty head. The cut is therefore placed
    just BELOW the backdrop band (BD_CUTOFF), so the silhouette is "anything
    darker than the wall". Whatever still reaches the frame from the top,
    left or right is the wall itself and is flood-filled away; the subject
    never touches those three edges, but the backdrop does.
    """
    img = Image.open(path).convert("L")
    a = np.asarray(img, dtype=np.float64)

    lo, hi = np.percentile(a, 1), np.percentile(a, 99)
    tone = np.clip((a - lo) / max(hi - lo, 1e-6), 0.0, 1.0)
    darkness = 1.0 - tone

    candidate = a < BD_CUTOFF
    subject = candidate & ~reachable_from_frame(candidate)
    return subject, darkness


def reachable_from_frame(mask: np.ndarray) -> np.ndarray:
    """Regions of `mask` connected to the top, left or right frame edge.

    The bottom edge is not seeded: the shoulders are cropped there, so the
    subject legitimately runs off it.
    """
    h, w = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    stack: list[tuple[int, int]] = []

    def seed(y: int, x: int) -> None:
        if mask[y, x] and not seen[y, x]:
            seen[y, x] = True
            stack.append((y, x))

    for x in range(w):
        seed(0, x)
    for y in range(h):
        seed(y, 0)
        seed(y, w - 1)

    while stack:
        y, x = stack.pop()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                stack.append((ny, nx))
    return seen


def subject_components(mask: np.ndarray, scale: int = 8) -> np.ndarray:
    """Keep the connected components that make up the person.

    On this photo the head and the body are two separate dark blobs at a
    coarse scale (they touch only on a few pixels, and a strict threshold
    breaks that bridge). Taking the two biggest non-background components
    keeps the whole person — head AND shoulders — instead of just the head
    or just the torso.

    The backdrop is never a candidate: it is bright, so it is simply not in
    the mask to begin with.
    """
    h, w = mask.shape
    gh, gw = h // scale, w // scale
    small = mask[: gh * scale, : gw * scale]
    small = small.reshape(gh, scale, gw, scale).mean(axis=(1, 3)) > 0.55

    seen = np.zeros_like(small, dtype=bool)
    comps: list[list[tuple[int, int]]] = []
    for sy in range(gh):
        for sx in range(gw):
            if not small[sy, sx] or seen[sy, sx]:
                continue
            stack = [(sy, sx)]
            seen[sy, sx] = True
            region: list[tuple[int, int]] = []
            while stack:
                y, x = stack.pop()
                region.append((y, x))
                for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= ny < gh and 0 <= nx < gw and small[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        stack.append((ny, nx))
            comps.append(region)

    if not comps:
        return mask
    comps.sort(key=len, reverse=True)
    # Keep only components that are a meaningful part of the person. On this
    # photo the two big ones are the shoulders (bottom) and the head (top);
    # the rest are specks of shadow, a few hundred pixels at most. Anything
    # under 2% of the biggest blob is noise.
    floor = max(1, int(len(comps[0]) * 0.02))
    keep = [c for c in comps if len(c) >= floor]

    out = np.zeros_like(mask, dtype=bool)
    for region in keep:
        for y, x in region:
            out[y * scale : (y + 1) * scale, x * scale : (x + 1) * scale] = True
    return out & mask


def sample(subject: np.ndarray, darkness: np.ndarray) -> np.ndarray:
    """Average-pool the photo into the grid and emit (x, y, size) rows."""
    h, w = subject.shape
    cw, ch = w / GRID_W, h / GRID_H

    # Integral-image free approach: average pooling via reshape after we pad
    # to an exact multiple of the cell size.
    ph, pw = GRID_H * int(np.ceil(ch)), GRID_W * int(np.ceil(cw))
    pad_s = np.zeros((ph, pw), dtype=np.float64)
    pad_d = np.zeros((ph, pw), dtype=np.float64)
    pad_s[:h, :w] = subject
    pad_d[:h, :w] = darkness

    def pool(a: np.ndarray) -> np.ndarray:
        cy, cx = ph // GRID_H, pw // GRID_W
        return a.reshape(GRID_H, cy, GRID_W, cx).mean(axis=(1, 3))

    cover = pool(pad_s)
    tone = pool(pad_d)

    inside = cover >= SUBJECT_CUTOFF
    if not inside.any():
        return np.zeros((0, 3), dtype=np.float64)

    # Normalise the tone range to what is actually present INSIDE the
    # subject. This portrait is a low-key silhouette, so absolute cut-offs
    # would put every dot at the maximum size and lose all modelling. Using
    # the subject's own 5th..95th percentile keeps real light-to-dark
    # separation (the cheekbone against the jaw, the shirt against the neck).
    t_lo, t_hi = np.percentile(tone[inside], [5, 95])
    span = max(t_hi - t_lo, 1e-6)

    # A thin strip of the backdrop gradient can survive as a one-cell-wide
    # spur hanging off the shoulder. At grid resolution that reads as a stray
    # line, so cells with fewer than two filled neighbours are dropped. Real
    # features (eyes, the gap under the chin) are holes, not spurs, and they
    # sit inside a thick region, so they are unaffected.
    def filled(y: int, x: int) -> int:
        n = 0
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy == 0 and dx == 0:
                    continue
                yy, xx = y + dy, x + dx
                if 0 <= yy < GRID_H and 0 <= xx < GRID_W and inside[yy, xx]:
                    n += 1
        return n

    for _ in range(2):
        thin = [
            (gy, gx)
            for gy in range(GRID_H)
            for gx in range(GRID_W)
            if inside[gy, gx] and filled(gy, gx) < 2
        ]
        for gy, gx in thin:
            inside[gy, gx] = False

    rows: list[list[float]] = []
    for gy in range(GRID_H):
        for gx in range(GRID_W):
            if not inside[gy, gx]:
                continue
            t = float(np.clip((tone[gy, gx] - t_lo) / span, 0.0, 1.0))
            t = t ** 0.85
            # `size` is a RADIUS MULTIPLIER, not a pixel size: 1.0 means "the
            # dot that fills its cell". Staying inside 0.55..1.35 keeps light
            # areas airy (visible gaps) and dark areas from merging into a
            # solid slab — which is what made the portrait read as an ink
            # blot in light mode.
            size = SIZE_MIN + t * (SIZE_MAX - SIZE_MIN)
            rows.append([gx + 0.5, gy + 0.5, round(size, 3)])
    return np.asarray(rows, dtype=np.float64)


def ascii_preview(points: np.ndarray) -> str:
    """Render the cloud as characters so the face can be checked headless."""
    canvas = [[" "] * GRID_W for _ in range(GRID_H)]
    for x, y, s in points:
        canvas[int(y)][int(x)] = " .:-=+*#%@"[min(9, int(s))]
    return "\n".join("".join(row).rstrip() for row in canvas)


def write_ts(points: np.ndarray) -> None:
    # The grid dimensions are the SAMPLING grid, not the bounding box of the
    # surviving points. Using the bbox made `w/h` drift (0.93 instead of
    # 0.956) as soon as the top row or a side column was filtered out, and
    # the CSS aspect-ratio then stretched the portrait.
    w = float(GRID_W)
    h = float(GRID_H)

    body = ",".join(f"[{x:g},{y:g},{s:g}]" for x, y, s in points)
    src = (
        "/* AUTO-GENERATED by scripts/gen-portrait.py — do not edit by hand.\n"
        "   Regenerate with: python3 scripts/gen-portrait.py\n"
        "   Source photo: public/icon.webp\n"
        "\n"
        "   `d` is [x, y, size] in grid units. `size` is 1..9 and follows the\n"
        "   local darkness of the photo, so the renderer turns it into a\n"
        "   light-to-dark gradient. Presence of a point (not its size) encodes\n"
        "   the silhouette, which is why the eyes and the gap under the chin\n"
        "   are holes rather than painted shapes. */\n"
        "export interface PortraitData { w: number; h: number; d: [number, number, number][] }\n"
        "\n"
        f'export const PORTRAIT: PortraitData = {{"w":{w:g},"h":{h:g},"d":[{body}]}};\n'
    )
    TARGET.write_text(src, encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--preview", action="store_true", help="print an ASCII preview only")
    args = ap.parse_args()

    if not SOURCE.exists():
        print(f"source image not found: {SOURCE}", file=sys.stderr)
        return 1

    subject, darkness = load_mask_and_tone(SOURCE)
    subject = subject_components(subject)
    points = sample(subject, darkness)

    if args.preview:
        print(ascii_preview(points))
        print(f"\n{len(points)} points")
        return 0

    write_ts(points)
    print(f"wrote {TARGET.relative_to(ROOT)} — {len(points)} points")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
