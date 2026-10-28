import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DotPortrait } from '../DotPortrait';
import { isReducedMotion } from '../../lib/utils';
import { S, waLink } from '../../data/site';
import { useLanguage } from '../../lib/catalog';
import { SkillLogo } from '../SkillLogo';
import { useTypewriter } from '../../hooks/useReveal';

gsap.registerPlugin(ScrollTrigger);

/* =====================================================================
   HERO — GSAP intro + parallax.
   ---------------------------------------------------------------------
   Rules (do not change without reading):
   1. The hero must never depend on an animation to be VISIBLE. Text is
      rendered visible; GSAP only "introduces" it from a hidden state.
   2. The timeline always targets the elements that exist in the current
      DOM. Splits are rebuilt every mount and tweens are created against
      those fresh nodes, so a StrictMode remount cannot leave orphan nodes
      at opacity 0.
   3. If the tab is hidden (rAF paused) or anything fails, everything is
      revealed statically.
   ===================================================================== */

function splitChars(line: HTMLElement): HTMLElement[] {
  const txt = line.textContent ?? '';
  line.textContent = '';
  const chars: HTMLElement[] = [];
  txt.split(' ').forEach((w, wi, arr) => {
    const word = document.createElement('span');
    word.className = 'word';
    Array.from(w).forEach((c) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = c;
      word.appendChild(s);
      chars.push(s);
    });
    line.appendChild(word);
    if (wi < arr.length - 1) line.appendChild(document.createTextNode(' '));
  });
  return chars;
}

function splitWords(el: HTMLElement): HTMLElement[] {
  const txt = (el.textContent ?? '').trim();
  el.textContent = '';
  // For CJK texts without spaces, segment into individual characters or space-separated words
  const hasSpaces = /\s/.test(txt);
  const words = hasSpaces ? txt.split(/\s+/) : Array.from(txt);
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w + (hasSpaces && i < words.length - 1 ? ' ' : '');
    el.appendChild(s);
    return s;
  });
}

function introTargets(hero: HTMLElement): HTMLElement[] {
  return Array.from(
    hero.querySelectorAll<HTMLElement>('.char, .lead .w, .tag, .cta, .cta-ghost, .cta-row-hero, .eyebrow, .scroll-hint, .dot-portrait, .hero-rot, .hero-stats'),
  );
}

function revealAll(hero: HTMLElement): void {
  introTargets(hero).forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = 'none';
    el.style.visibility = 'visible';
  });
  hero.querySelectorAll<HTMLElement>('.line').forEach((l) => (l.style.overflow = 'visible'));
}

export function Hero({ started }: { started: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const setPlay = useRef<() => void>(() => {});
  const startedRef = useRef(started);
  const { lang } = useLanguage();
  const headlineWords = S.headlineRotator[lang] || S.headlineRotator.en;
  const rotating = useTypewriter(headlineWords);

  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduce = isReducedMotion();

    // ---- 1. Split text (always from the original markup) ----
    const origin = new Map<HTMLElement, string>();
    hero.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => origin.set(el, el.innerHTML));

    const titleChars: HTMLElement[] = [];
    const titleSets: HTMLElement[][] = [];
    hero.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((h) => {
      const chars = Array.from(h.children)
        .filter((el): el is HTMLElement => el.classList.contains('line'))
        .flatMap((l) => splitChars(l));
      titleSets.push(chars);
      titleChars.push(...chars);
    });
    const wordSets = Array.from(hero.querySelectorAll<HTMLElement>('[data-split="words"]')).map((el) => splitWords(el));

    const cleanupSplit = () => {
      origin.forEach((html, el) => {
        if (el.isConnected && el.innerHTML !== html) el.innerHTML = html;
      });
    };

    // ---- 2. No-animation mode ----
    if (reduce) {
      setPlay.current = () => {};
      revealAll(hero);
      return cleanupSplit;
    }

    // ---- 3. Build the timeline against the fresh nodes ----
    const portrait = hero.querySelector<HTMLElement>('.dot-portrait');
    const left = Array.from(hero.querySelectorAll<HTMLElement>('.side')).find((el) => el.classList.contains('left'));
    const right = Array.from(hero.querySelectorAll<HTMLElement>('.side')).find((el) => el.classList.contains('right'));
    const eyebrow = left?.querySelector<HTMLElement>('.eyebrow') ?? null;
    const leftTitle = titleSets[0] ?? [];
    const rightTitle = titleSets[1] ?? [];
    const leftLead = wordSets[0] ?? [];
    const rightLead = wordSets[1] ?? [];
    const rot = left?.querySelector<HTMLElement>('.hero-rot') ?? null;
    const stats = left?.querySelector<HTMLElement>('.hero-stats') ?? null;
    const tags = Array.from(hero.querySelectorAll<HTMLElement>('.tag'));
    const cta = hero.querySelector<HTMLElement>('.cta-row-hero') ?? hero.querySelector<HTMLElement>('.cta');
    const hint = hero.querySelector<HTMLElement>('.scroll-hint');

    if (document.visibilityState !== 'visible') {
      setPlay.current = () => {};
      revealAll(hero);
      return cleanupSplit;
    }

    gsap.set(leftTitle, { yPercent: 115, rotate: 7, opacity: 0 });
    gsap.set(rightTitle, { yPercent: 115, rotate: -7, opacity: 0 });
    gsap.set([...leftLead, ...rightLead], { opacity: 0, y: 16, filter: 'blur(8px)' });
    gsap.set([eyebrow, cta, hint, rot, stats].filter(Boolean) as HTMLElement[], { opacity: 0, y: 18 });
    gsap.set(tags, { opacity: 0, scale: 0.8, y: 10 });
    if (portrait) gsap.set(portrait, { opacity: 0, scale: 1.07 });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, paused: true });
    if (portrait) tl.to(portrait, { opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' }, 0);
    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.9 }, 0.25);
    if (leftTitle.length) tl.to(leftTitle, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.15, stagger: { each: 0.028, from: 'start' } }, 0.4);
    if (leftLead.length) tl.to(leftLead, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.045, ease: 'power2.out' }, 1.1);
    if (rot) tl.to(rot, { opacity: 1, y: 0, duration: 0.8 }, 1.5);
    if (stats) tl.to(stats, { opacity: 1, y: 0, duration: 0.8 }, 1.7);
    if (rightTitle.length) tl.to(rightTitle, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.15, stagger: { each: 0.03, from: 'end' } }, 0.7);
    if (rightLead.length) tl.to(rightLead, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.04, ease: 'power2.out' }, 1.4);
    if (tags.length) tl.to(tags, { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' }, 1.8);
    if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 0.8 }, 2.0);
    if (hint) tl.to(hint, { opacity: 1, y: 0, duration: 0.8 }, 2.2);
    let ready = false;
    const isReady = () => ready;
    tl.add(() => {
      ready = true;
      hero.querySelectorAll<HTMLElement>('.line').forEach((l) => (l.style.overflow = 'visible'));
    }, 2.4);

    // ---- 4. Play only if the targets are alive and the tab is visible ----
    let played = false;
    let onVisOnce: (() => void) | null = null;
    const allAlive = () => leftTitle.every((c) => c.isConnected) && !!eyebrow?.isConnected;
    const play = () => {
      if (played) return;
      if (!hero.isConnected || !allAlive()) return;
      played = true;
      tl.delay(0.1).play();
      window.setTimeout(() => {
        if (!hero.isConnected) return;
        const first = leftTitle[0];
        if (first && first.isConnected && getComputedStyle(first).opacity === '0' && !tl.isActive()) revealAll(hero);
      }, 6000);
    };
    const requestPlay = () => {
      if (document.visibilityState === 'visible') {
        play();
        return;
      }
      const onVis = () => {
        if (document.visibilityState !== 'visible') return;
        if (onVisOnce) document.removeEventListener('visibilitychange', onVisOnce);
        play();
      };
      onVisOnce = onVis;
      document.addEventListener('visibilitychange', onVis);
    };
    setPlay.current = requestPlay;
    if (startedRef.current) requestPlay();

    // ---- 5. Cursor effect on the big letters ----
    const onMove = (e: PointerEvent) => {
      if (!isReady()) return;
      const R = 150;
      for (const c of titleChars) {
        const b = c.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const dy = e.clientY - (b.top + b.height / 2);
        const f = Math.max(0, 1 - Math.hypot(dx, dy) / R);
        gsap.to(c, { y: -f * 14, skewX: f * -10 * Math.sign(dx || 1), scale: 1 + f * 0.12, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      }
    };
    const onLeave = () =>
      gsap.to(titleChars, { y: 0, skewX: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1,.6)', overwrite: 'auto' });
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true });
      hero.addEventListener('pointerleave', onLeave);
    }

    // ---- 6. Scroll parallax ----
    // Three scrubbed tweens plus a canvas scale, recomputed on every scroll
    // frame. On a phone that competes directly with the compositor for the
    // scroll itself, which is what "lag" feels like. Reduced-motion users and
    // touch devices skip it entirely; the hero still reads fine, it just does
    // not move.
    const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 };
    const canvas = portrait?.querySelector('canvas') ?? null;
    const parallax = reduce
      ? []
      : ([
          left ? gsap.to(left, { xPercent: -14, opacity: 0, ease: 'none', scrollTrigger: st }) : null,
          right ? gsap.to(right, { xPercent: 14, opacity: 0, ease: 'none', scrollTrigger: st }) : null,
          canvas ? gsap.to(canvas, { yPercent: 6, scale: 1.06, ease: 'none', scrollTrigger: st }) : null,
          hint ? gsap.to(hint, { opacity: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '+=200', scrub: true } }) : null,
        ].filter(Boolean) as gsap.core.Tween[]);

    return () => {
      if (onVisOnce) document.removeEventListener('visibilitychange', onVisOnce);
      tl.kill();
      parallax.forEach((t) => t.scrollTrigger?.kill());
      parallax.forEach((t) => t.kill());
      if (fine) {
        window.removeEventListener('pointermove', onMove);
        hero.removeEventListener('pointerleave', onLeave);
      }
      revealAll(hero);
      cleanupSplit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    setPlay.current();
  }, [started]);

  // Last-resort safety net: never leave the hero transparent forever.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const id = window.setTimeout(() => {
      if (!hero.isConnected) return;
      const probe = hero.querySelector<HTMLElement>('.char');
      if (!probe || !probe.isConnected) return;
      if (getComputedStyle(probe).opacity === '0') revealAll(hero);
    }, 10000);
    return () => window.clearTimeout(id);
  }, []);

  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);

  return (
    <section className="hero" id="hero" key={lang} ref={heroRef}>
      <div className="side left">
        <div className="eyebrow" data-anim="fade" style={{ opacity: 0 }}>
          <i />
          {t('Available for new projects', 'Tersedia untuk proyek baru', '接受新项目合作')}
        </div>
        <h1 className="title" data-split="lines">
          <span className="line">{t('Hi, I’m', 'Halo, saya', '你好，我是')}</span>
          <span className="line">{S.name}</span>
        </h1>
        <p className="lead" data-split="words">
          {t(
            'I design and build fast, accessible products with real business value.',
            'Saya merancang dan membangun produk yang cepat, mudah diakses, dan bernilai bisnis nyata.',
            '我设计并打造快速、无障碍且具有真实商业价值的产品。',
          )}
        </p>
        <p className="hero-rot" style={{ opacity: 0 }}>
          <span>{t('I build', 'Saya membangun', '我专注于构建')}</span>
          <b>{rotating || headlineWords[0]}</b>
          <span className="caret" aria-hidden="true" />
        </p>
        <div className="hero-stats" style={{ opacity: 0 }} aria-label={t('Quick facts', 'Ringkasan', '核心数据')}>
          <div>
            <b>{S.years}+</b>
            <small>{t('Years', 'Tahun', '年经验')}</small>
          </div>
          <div>
            <b>{S.projects.length}</b>
            <small>{t('Projects', 'Proyek', '已上线项目')}</small>
          </div>
          <div>
            <b>{S.certs.reduce((n, c) => n + c.count, 0)}</b>
            {/* 30 credentials sit in 25 records (multi-course bundles are
                merged); the sub-label states both so the numbers on the hero,
                the About block and the certificate page never disagree. */}
            <small>{t('Certificates', 'Sertifikat', '专业证书')}</small>
            <em className="hs-sub">
              {t(`${S.certs.length} records`, `${S.certs.length} entri`, `${S.certs.length} 份档案`)}
            </em>
          </div>
          <div>
            <b>{S.clients}+</b>
            <small>{t('Clients', 'Klien', '合作客户')}</small>
            <em className="hs-sub">{t('satisfied', 'puas', '好评满意')}</em>
          </div>
        </div>
      </div>

      <DotPortrait started={started} />

      <div className="side right">
        <h2 className="title outline" data-split="lines">
          <span className="line">{t('From idea', 'Dari ide', '从想法')}</span>
          <span className="line">{t('to real.', 'jadi nyata.', '到现实。')}</span>
        </h2>
        <p className="lead" data-split="words">
          {t(
            'Full stack web, AI automation, and business systems — from a first sketch to production.',
            'Web full stack, otomasi AI, dan sistem bisnis — dari sketsa pertama sampai produksi.',
            '全栈 Web、AI 自动化和业务系统 — 从最初的草图到生产部署。',
          )}
        </p>
        {/* Each tag also carries the mark of the tech it stands for, so the
            four words read as concrete tools instead of buzzwords. */}
        <div className="tags" data-anim="tags">
          <span className="tag">
            <SkillLogo tech="React" size={14} />
            Web Apps
          </span>
          <span className="tag">
            <SkillLogo tech="Gemini" size={14} />
            AI
          </span>
          <span className="tag">
            <SkillLogo tech="n8n" size={14} />
            Automation
          </span>
          <span className="tag">
            <SkillLogo tech="Three.js" size={14} />
            3D
          </span>
        </div>
        <div className="cta-row-hero" data-anim="fade">
          <Link className="cta" data-no-transition to="/projects">
            {t('See the work', 'Lihat karya', '查看作品')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          {/* A visitor who already knows what they want should not have to
              scroll to the footer to start a conversation. */}
          <a className="cta-ghost" href={waLink(lang)} target="_blank" rel="noopener">
            {t('Start a project', 'Mulai proyek', '启动项目')}
            <span className="sr"> {t('(opens WhatsApp)', '(membuka WhatsApp)', '（打开 WhatsApp）')}</span>
          </a>
        </div>
      </div>

      <div className="scroll-hint" data-anim="fade">
        <span />
        {t('Scroll', 'Gulir', '滚动')}
      </div>
    </section>
  );
}
