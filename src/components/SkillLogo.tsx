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
    return (
      <svg
        className="sk-lg sk-gen"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3.5l2.2 6.3 6.3 2.2-6.3 2.2-2.2 6.3-2.2-6.3-6.3-2.2 6.3-2.2z" />
      </svg>
    );
  }

  return (
    <i
      className="sk-lg"
      style={{ ...style(key), width: size, height: size }}
      title={SKILL_GLYPHS[key].t}
      aria-hidden="true"
    />
  );
}
