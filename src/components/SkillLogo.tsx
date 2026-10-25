import type { CSSProperties } from 'react';
import { SKILL_GLYPHS, SKILL_ICON, skillMask, type SkillIconKey } from '../data/skills';

/* =====================================================================
   SKILL LOGO — a one-colour glyph that sits next to a stack label.
   ---------------------------------------------------------------------
   The SVG path data is used as a CSS mask, so the mark is painted with
   `currentColor`: black in light mode, white in dark mode, and inverted
   again when the pill behind it flips on hover. No brand colour ever
   reaches the page, and the icon needs no extra class for theming.

   Techs without a catalogue glyph get `fallback` — a generic spark —
   rather than an invented logo.
   ===================================================================== */

const style = (key: SkillIconKey): CSSProperties => {
  const m = skillMask(key);
  return {
    WebkitMaskImage: m,
    maskImage: m,
  };
};

export function SkillLogo({ tech, size = 16 }: { tech: string; size?: number }) {
  const key = SKILL_ICON[tech];

  if (!key) {
    // Deliberately shape-less: a dashed rounded square reads as "no mark on
    // file", never as a brand. The old sparkle was a dead ringer for the
    // Gemini glyph, so the two were indistinguishable side by side.
    return (
      <svg
        className="sk-lg sk-gen"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" strokeDasharray="3 2.6" />
      </svg>
    );
  }

  // Some marks are wireframes too dense to resolve at chip size; drawing them
  // at 14px produces noise that reads as a rendering bug. Honour the glyph's
  // own floor rather than shrinking it into an unreadable blob.
  const px = Math.max(size, SKILL_GLYPHS[key].min ?? 0);

  return (
    <i
      className="sk-lg"
      style={{ ...style(key), width: px, height: px }}
      title={SKILL_GLYPHS[key].t}
      aria-hidden="true"
    />
  );
}
