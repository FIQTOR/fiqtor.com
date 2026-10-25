import { useEffect, useRef } from 'react';
import { isFinePointer, isReducedMotion } from '../lib/utils';

const TILT = '.card,.cert,.role,.ch,.lk,.tc2,.lv,.ct-box';
const MAG = '.cta,.btn2,.nav-cta,.btn-w,.btn-o,.lt-soc a,.lt-acts button,.brand,.md-nav button';
const INT = 'a,button,[role="button"],input,textarea,select,summary,label,.sv,.mq span';

/**
 * Custom cursor + background spotlight + card tilt + magnetic buttons.
 * Only active on precise-pointer devices without reduced-motion.
 */
export function GlobalEffects() {
  const spotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer() || isReducedMotion()) return;
    const spot = spotRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!spot || !ring || !dot) return;

    const pos = { x: innerWidth / 2, y: -400 };
    const rp = { x: pos.x, y: pos.y };
    let moved = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!moved) {
        moved = true;
        rp.x = pos.x;
        rp.y = pos.y;
        ring.classList.add('on');
        dot.classList.add('on');
      }
    };
    const onLeave = () => {
      ring.classList.remove('on');
      dot.classList.remove('on');
      moved = false;
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      spot.style.transform = `translate3d(${pos.x - 260}px,${pos.y - 260}px,0)`;
      spot.style.backgroundPosition = `${260 - pos.x}px ${260 - pos.y}px`;
      rp.x += (pos.x - rp.x) * 0.2;
      rp.y += (pos.y - rp.y) * 0.2;
      ring.style.transform = `translate3d(${rp.x}px,${rp.y}px,0)`;
      dot.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
    };
    raf = requestAnimationFrame(loop);
    addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const c = t.closest<HTMLElement>('[data-cur]');
      if (c) {
        ring.classList.add('v');
        ring.classList.remove('h');
        const span = ring.firstElementChild;
        if (span) span.textContent = c.dataset.cur ?? '';
        return;
      }
      ring.classList.remove('v');
      ring.classList.toggle('h', !!t.closest(INT));
    };
    const onDown = () => ring.classList.add('dn');
    const onUp = () => ring.classList.remove('dn');
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);

    let tcur: HTMLElement | null = null;
    let mcur: HTMLElement | null = null;
    const resetT = (el: HTMLElement) => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--px', '0px');
      el.style.setProperty('--py', '0px');
    };
    const onTilt = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const t = (e.target as HTMLElement).closest<HTMLElement>(TILT);
      if (t !== tcur) {
        if (tcur) resetT(tcur);
        tcur = t;
      }
      if (t) {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        t.style.setProperty('--mx', x * 100 + '%');
        t.style.setProperty('--my', y * 100 + '%');
        if (!t.classList.contains('tc2') && !t.classList.contains('ct-box')) {
          const k = t.classList.contains('lk') ? 4 : 6;
          t.style.setProperty('--rx', ((0.5 - y) * k).toFixed(2) + 'deg');
          t.style.setProperty('--ry', ((x - 0.5) * k).toFixed(2) + 'deg');
          t.style.setProperty('--px', ((0.5 - x) * 18).toFixed(1) + 'px');
          t.style.setProperty('--py', ((0.5 - y) * 12).toFixed(1) + 'px');
        }
      }
      const m = (e.target as HTMLElement).closest<HTMLElement>(MAG);
      if (m !== mcur) {
        if (mcur) mcur.style.transform = '';
        mcur = m;
      }
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${dx * 0.22}px,${dy * 0.3}px)`;
      }
    };
    const onLeaveDoc = () => {
      if (tcur) resetT(tcur);
      if (mcur) mcur.style.transform = '';
      tcur = mcur = null;
    };
    document.addEventListener('pointermove', onTilt, { passive: true });
    document.addEventListener('pointerleave', onLeaveDoc);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointermove', onTilt);
      document.removeEventListener('pointerleave', onLeaveDoc);
    };
  }, []);

  return (
    <>
      <div className="spot" ref={spotRef} />
      <div className="cur" ref={ringRef}>
        <span />
      </div>
      <div className="cur-d" ref={dotRef} />
    </>
  );
}
