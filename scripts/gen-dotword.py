#!/usr/bin/env python3
"""
Build the dot-matrix wordmark shown by the initial loader.

Run:  python3 scripts/gen-dotword.py
Writes: src/data/dotword.ts

Why generate it
---------------
The loader used to spell FIQTOR as plain text that rose into place. The owner
wants the letters assembled out of DOTS instead, echoing the hero portrait.
Drawing that by eye in a 5x7 grid gets the R and the Q wrong, so the shapes are
rasterised from a real font and then sampled on a grid: every cell becomes a
dot whose presence follows the glyph coverage, and whose size follows the same
1..9 scale the portrait uses.

The result is a compact table of (x, y, size) integer triples — no font is
bundled at runtime, nothing depends on a system typeface, and the loader can
paint it on a plain canvas.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "src" / "data" / "dotword.ts"

WORD = "FIQTOR"
# Grid cells per glyph. The portrait uses a 115x120 field; the wordmark is a
# single line of text, so it only needs enough resolution to keep the Q tail
# and the R leg readable.
CELL_W, CELL_H = 16, 20
GAP = 4                     # blank cells between letters
FONT_PX = 180               # rasterisation size per letter
COVER = 0.32                # cell is a dot when the glyph covers this much

# A font with clear, geometric capitals. PIL ships DejaVu; if the machine has
# something closer to the site's UI grotesk, prefer it by adding it first.
CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
]


def load_font() -> ImageFont.FreeTypeFont:
    for path in CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, FONT_PX)
    raise SystemExit("no usable bold font found; add one to CANDIDATES")


def glyph_cells(
    ch: str, font: ImageFont.FreeTypeFont, cap_h: int, baseline_top: int
) -> list[list[float]]:
    """Return a CELL_H x CELL_W coverage grid in [0, 1] for one character.

    Every glyph is rasterised into the SAME vertical box (cap height, measured
    from a reference capital). Using each glyph's own bbox instead squashed
    narrow letters: "I" kept its stroke width but was stretched to fill the
    cell grid, so it came out as a solid slab, and "Q"'s descender pushed that
    letter up out of line.
    """
    w = max(1, round(font.getlength(ch)))
    h = cap_h
    img = Image.new("L", (w, h), 0)
    ImageDraw.Draw(img).text((0, -baseline_top), ch, font=font, fill=255)

    grid: list[list[float]] = []
    for gy in range(CELL_H):
        row = []
        for gx in range(CELL_W):
            x0 = round(gx * w / CELL_W)
            x1 = round((gx + 1) * w / CELL_W)
            y0 = round(gy * h / CELL_H)
            y1 = round((gy + 1) * h / CELL_H)
            cell = img.crop((x0, y0, max(x0 + 1, x1), max(y0 + 1, y1)))
            data = cell.getdata()
            row.append(sum(data) / (255.0 * len(data)))
        grid.append(row)

    # A font with a Q descender makes the Q box taller than the others, which
    # would offset that letter. Normalise every glyph to the same cap height by
    # resampling vertically onto the shared grid.
    return grid


def build() -> list[tuple[int, int, int]]:
    """Return [(x, y, size)] in grid units, size 1..9."""
    font = load_font()
    # Reference box from "H": cap height, and the offset from the top of the
    # glyph to the baseline. Both are shared by every letter.
    ref = font.getbbox("H")
    baseline_top = ref[1]
    # Extend the shared box down to the deepest descender in the word, or the
    # Q's tail is clipped off and the letter reads as an O.
    descender = max(font.getbbox(c)[3] for c in WORD)
    cap_h = descender - baseline_top

    cells: list[tuple[int, int, float]] = []
    xoff = 0
    for ch in WORD:
        grid = glyph_cells(ch, font, cap_h, baseline_top)
        for gy, row in enumerate(grid):
            for gx, cov in enumerate(row):
                if cov >= COVER:
                    cells.append((xoff + gx, gy, cov))
        xoff += CELL_W + GAP

    lo = min(c[2] for c in cells)
    hi = max(c[2] for c in cells)
    span = max(hi - lo, 1e-6)

    out: list[tuple[int, int, int]] = []
    for x, y, cov in cells:
        # Map coverage onto the portrait's 1..9 size scale. Keeping the same
        # range means the renderer's radius curve works unchanged.
        size = 1 + round((cov - lo) / span * 8)
        out.append((x, y, int(size)))
    return out


def ascii_preview(points: list[tuple[int, int, int]]) -> str:
    rows = max(y for _, y, _ in points) + 1
    cols = max(x for x, _, _ in points) + 1
    canvas = [[" "] * cols for _ in range(rows)]
    shade = " .:-=+*#%@"
    for x, y, s in points:
        canvas[y][x] = shade[min(9, s)]
    return "\n".join("".join(r).rstrip() for r in canvas)


def main() -> int:
    points = build()
    cols = max(x for x, _, _ in points) + 1
    rows = max(y for _, y, _ in points) + 1

    body = ",".join(f"[{x},{y},{s}]" for x, y, s in points)
    src = (
        "/* AUTO-GENERATED by scripts/gen-dotword.py — do not edit by hand.\n"
        "   Regenerate with: python3 scripts/gen-dotword.py\n"
        "\n"
        f"   The loader's \"{WORD}\" wordmark as a dot matrix: {len(points)} dots on a\n"
        f"   {cols}x{rows} grid. Each entry is [x, y, size] with `size` on the same\n"
        "   1..9 scale the hero portrait uses, so both share one radius curve.\n"
        "\n"
        "   Rasterised from a bold sans capital set, not hand-drawn: drawing this\n"
        "   by eye in a 5x7 grid gets the Q tail and the R leg wrong. */\n"
        "export interface DotWord {\n"
        "  w: number;\n"
        "  h: number;\n"
        "  d: [number, number, number][];\n"
        "}\n"
        "\n"
        f"export const DOT_WORD: DotWord = {{ w: {cols}, h: {rows}, d: [{body}] }};\n"
        "\n"
        "/** Grid aspect ratio, for the CSS box the canvas is painted into. */\n"
        f"export const DOT_WORD_AR = {cols / rows:.4f};\n"
    )
    TARGET.write_text(src, encoding="utf-8")
    print(ascii_preview(points))
    print(f"\n{len(points)} dots -> {TARGET.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
