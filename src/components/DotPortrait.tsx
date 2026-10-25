import { useEffect, useRef } from 'react';
import { PORTRAIT } from '../data/portrait';
import { isReducedMotion } from '../lib/utils';

/* =====================================================================
   DOT PORTRAIT — interactive particle portrait (canvas 2D).
   Particles spring back home, push away from the pointer, breathe, and
   burst outward on click.
   ===================================================================== */

const CFG = {
  fill: 0.94,
  hoverRadius: 0.17,
  push: 2.6,
  spring: 0.055,
  damping: 0.84,
  grow: 0.9,
  breathe: 0.07,
  introMs: 1600,
  burst: 16,
};

const ROW = 0.866;
const N = PORTRAIT.d.length;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

export function DotPortrait({ id, className, started = true }: { id?: string; className?: string; started?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef(started);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = isReducedMotion();

    const hx = new Float32Array(N);
    const hy = new Float32Array(N);
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const sz = new Float32Array(N);
    const dl = new Float32Array(N);
    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const sRaw = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      const [gx, gy, s] = PORTRAIT.d[i];
      hx[i] = gx;
      hy[i] = gy * ROW;
      sRaw[i] = s;
    }
    const GW = PORTRAIT.w;
    const GH = PORTRAIT.h * ROW;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    let hoverR = 100;
    const homeX = new Float32Array(N);
    const homeY = new Float32Array(N);
    let introDone = false;
    let t0 = performance.now();

    /* ---- palette & per-theme size mapping ---------------------------------
       Both themes paint ONE colour. What differs is the ink (white on black
       vs black on white) and how the authored 1..9 dot size is interpreted.

         dark   white dots on black: a dark pixel is a BIG dot, so `s` is used
                as authored
         light  black dots on white: using `s` directly turns hair and shirt
                into a solid black mass, so the mapping is flipped to
                `(10 - s) / 9`. That is the artwork the owner supplied.

       Dot POSITIONS are identical in both themes; only the sizes differ. */

    /** Read a custom property, ignoring CSS-wide keywords. */
    function readVar(names: string[], el: Element = document.documentElement): string {
      for (const n of names) {
        for (const target of [root!, el]) {
          const v = getComputedStyle(target).getPropertyValue(n).trim();
          if (v && v !== 'inherit' && v !== 'initial' && v !== 'unset') return v;
        }
      }
      return '';
    }

    /** Luminance of a css colour string, or null when it cannot be parsed. */
    function luminance(color: string): number | null {
      const m = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
      if (m) {
        const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
        const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      }
      const rgb = color.match(/rgba?\(([^)]+)\)/);
      if (rgb) {
        const [r, g, b] = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      }
      const named: Record<string, string> = { white: '#ffffff', black: '#000000' };
      const key = color.toLowerCase();
      return key in named ? luminance(named[key]) : null;
    }

    let invert = false;
    let lastInvert = false;

    function applySizeMapping() {
      for (let i = 0; i < N; i++) {
        sz[i] = invert ? (10 - sRaw[i]) / 9 : sRaw[i] / 9;
      }
    }

    function readPalette() {
      const declared = readVar(['--dot-color'], root!);
      // Ground truth: contrast against the canvas behind the portrait.
      const bg = readVar(['--hero-bg', '--next-bg', '--page-bg']);
      const bgLum = bg ? luminance(bg) : null;
      const base = declared || (bgLum !== null && bgLum > 0.5 ? '#0a0a0a' : '#fff');

      // --dot-invert is 1 in the light theme, 0 in dark.
      invert = readVar(['--dot-invert'], root!) === '1';
      if (invert !== lastInvert) {
        lastInvert = invert;
        applySizeMapping();
      }
      return { base };
    }

    function layout() {
      const r = root!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(W / GW, H / GH) * CFG.fill;
      ox = (W - GW * scale) / 2;
      oy = (H - GH * scale) / 2;
      hoverR = GH * scale * CFG.hoverRadius;
      for (let i = 0; i < N; i++) {
        const nx = ox + hx[i] * scale;
        const ny = oy + hy[i] * scale;
        if (introDone) {
          px[i] += nx - homeX[i];
          py[i] += ny - homeY[i];
        }
        homeX[i] = nx;
        homeY[i] = ny;
      }
    }

    function seedIntro() {
      introDone = false;
      t0 = performance.now();
      const cx = W / 2;
      const cy = H / 2;
      for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2;
        const d = (0.4 + Math.random() * 0.9) * Math.max(W, H) * 0.6;
        sx[i] = cx + Math.cos(a) * d;
        sy[i] = cy + Math.sin(a) * d;
        px[i] = sx[i];
        py[i] = sy[i];
        vx[i] = vy[i] = 0;
        const dx = homeX[i] - cx;
        const dy = homeY[i] - cy;
        dl[i] = Math.min(0.55, Math.hypot(dx, dy) / (Math.max(W, H) * 1.6)) + Math.random() * 0.18;
      }
    }

    const ptr = { x: -9999, y: -9999, active: false };
    const rings: { x: number; y: number; t: number }[] = [];
    const setPtr = (e: PointerEvent) => {
      const r = root!.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.active = true;
    };
    const onDown = (e: PointerEvent) => {
      setPtr(e);
      rings.push({ x: ptr.x, y: ptr.y, t: performance.now() });
      const R = hoverR * 2.4;
      for (let i = 0; i < N; i++) {
        const dx = px[i] - ptr.x;
        const dy = py[i] - ptr.y;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0.01) {
          const f = Math.pow(1 - d / R, 2) * CFG.burst * (0.6 + Math.random() * 0.8);
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
        }
      }
    };
    const leave = () => {
      ptr.active = false;
      ptr.x = ptr.y = -9999;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') leave();
    };

    root.addEventListener('pointermove', setPtr);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('pointercancel', leave);
    root.addEventListener('pointerup', onUp);

    let running = true;
    let last = performance.now();
    let rafId = 0;

    function frame(now: number) {
      if (!running) return;
      rafId = requestAnimationFrame(frame);
      const elapsed = Math.min(2.2, (now - last) / 16.67);
      last = now;
      const el = startedRef.current ? now - t0 : 0;
      const ip = Math.min(1, el / CFG.introMs);
      if (!introDone && ip >= 1) introDone = true;

      ctx!.clearRect(0, 0, W, H);
      const cs = getComputedStyle(root!);
      const pal = readPalette();
      ctx!.fillStyle = pal.base;
      // Per-theme geometry. Light mode wants smaller, airier dots (a solid
      // black halftone reads much heavier than a white one), so the scale
      // and the in-radius are theme tokens rather than constants.
      const dotScale = Number(cs.getPropertyValue('--dot-scale')) || 1;
      const dotFill = Number(cs.getPropertyValue('--dot-fill')) || 0.45;

      const base = scale * dotFill * dotScale;
      const R = hoverR;
      const R2 = R * R;
      const tm = now / 1000;
      const damp = Math.pow(CFG.damping, elapsed);
      const k = CFG.spring * elapsed;

      ctx!.beginPath();
      for (let i = 0; i < N; i++) {
        let local = 1;
        if (!introDone) {
          local = Math.min(1, Math.max(0, (ip - dl[i]) / (1 - dl[i] + 1e-4)));
          if (local <= 0) continue;
        }
        let ax = (homeX[i] - px[i]) * k;
        let ay = (homeY[i] - py[i]) * k;
        let boost = 0;
        if (ptr.active) {
          const dx = px[i] - ptr.x;
          const dy = py[i] - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001;
            const f = 1 - d / R;
            const push = f * f * CFG.push * elapsed;
            ax += (dx / d) * push;
            ay += (dy / d) * push;
            boost = f;
          }
        }
        vx[i] = (vx[i] + ax) * damp;
        vy[i] = (vy[i] + ay) * damp;
        px[i] += vx[i] * elapsed;
        py[i] += vy[i] * elapsed;

        const wave = reduce ? 0 : Math.sin(tm * 1.6 + hx[i] * 0.09 + hy[i] * 0.07) * CFG.breathe;
        // The original radius curve: a floor of 5% keeps the smallest dots
        // visible, the rest scales linearly from `sz` (0..1). Restored with
        // the original data so the shape matches what the hero shipped with.
        const r = base * (0.05 + 0.95 * sz[i]) * (1 + wave + boost * CFG.grow) * (introDone ? 1 : easeOut(local));
        if (r < 0.15) continue;
        ctx!.moveTo(px[i] + r, py[i]);
        ctx!.arc(px[i], py[i], r, 0, 6.2832);
      }
      ctx!.fill();

      for (let j = rings.length - 1; j >= 0; j--) {
        const g = rings[j];
        const a = (now - g.t) / 900;
        if (a >= 1) {
          rings.splice(j, 1);
          continue;
        }
        ctx!.globalAlpha = (1 - a) * 0.5;
        ctx!.strokeStyle = ctx!.fillStyle;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.arc(g.x, g.y, hoverR * 2.4 * easeOut(a), 0, 6.2832);
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }
    }

    // Seed the per-theme size mapping before the first frame paints; from then
    // on readPalette() re-applies it whenever the theme flips.
    readPalette();
    applySizeMapping();
    lastInvert = invert;

    layout();
    seedIntro();
    if (reduce) {
      for (let i = 0; i < N; i++) {
        px[i] = homeX[i];
        py[i] = homeY[i];
      }
      introDone = true;
    }
    rafId = requestAnimationFrame(frame);

    let rt = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = window.setTimeout(layout, 60);
    });
    ro.observe(root);

    // Pause painting entirely while off-screen.
    const io = new IntersectionObserver(
      ([en]) => {
        const vis = en.isIntersecting;
        if (vis && !running) {
          running = true;
          last = performance.now();
          rafId = requestAnimationFrame(frame);
        }
        running = vis;
      },
      { threshold: 0.01 },
    );
    io.observe(root);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      clearTimeout(rt);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener('pointermove', setPtr);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('pointercancel', leave);
      root.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div className={className ?? 'dot-portrait'} id={id} aria-label="Interactive dot portrait" role="img" ref={rootRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
