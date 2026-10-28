import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HOME_REVIEW_COUNT, S, waLink } from '../../data/site';
import { isFinePointer, isReducedMotion } from '../../lib/utils';
import { CountUp, InteractiveTitle, useReveal } from '../../hooks/useReveal';
import { CertCard, ProjectCard } from '../Cards';
import { useLanguage } from '../../lib/catalog';
import { useCurrency, SUPPORTED_CURRENCIES } from '../../lib/currency';
import { LiveStats } from './LiveStats';
import { SkillLogo } from '../SkillLogo';
import { FaqList } from '../FaqList';
import { ProcessSteps } from '../ProcessSteps';

/* ---------- Marquee: speed follows scroll ---------- */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    const mq = ref.current;
    if (!mq || isReducedMotion()) return;
    let mx = 0;
    let dir = -1;
    let vel = 0;
    let lastY = scrollY;
    let raf = 0;
    // Read inside the loop; toggled by an IntersectionObserver. Declared here
    // so the first frame can never hit the temporal dead zone.
    let paused = false;
    const onScroll = () => {
      const d = scrollY - lastY;
      lastY = scrollY;
      vel = Math.max(-40, Math.min(40, d));
      if (d) dir = d > 0 ? -1 : 1;
    };
    addEventListener('scroll', onScroll, { passive: true });
    const loop = () => {
      raf = requestAnimationFrame(loop);
      // A permanently-running rAF that writes `transform` every frame keeps
      // the main thread and the compositor awake for the whole session, even
      // once the strip is thousands of pixels above the viewport. Parking the
      // loop while it is off-screen costs nothing visually and is the single
      // biggest scroll-smoothness win on a phone.
      if (paused) return;
      vel *= 0.92;
      mx += dir * (0.7 + Math.abs(vel) * 0.35);
      const w = mq.scrollWidth / 2;
      if (mx <= -w) mx += w;
      if (mx > 0) mx -= w;
      mq.style.transform = `translate3d(${mx}px,0,0)`;
    };
    const io = new IntersectionObserver(
      ([en]) => {
        paused = !en.isIntersecting;
        // Resync so a resumed loop does not jump by the distance scrolled.
        lastY = scrollY;
      },
      { rootMargin: '120px' },
    );
    io.observe(mq);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="strip" aria-label={lang === 'en' ? 'Tech stack' : 'Teknologi'}>
      <div className="mq" ref={ref}>
        {S.stack.map((t) => (
          <span key={t}>
            <SkillLogo tech={t} />
            {t}
          </span>
        ))}
        {S.stack.map((t) => (
          <span key={'b' + t} aria-hidden="true">
            <SkillLogo tech={t} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Section wrapper ---------- */
function Section({
  id,
  kick,
  title,
  children,
}: {
  id: string;
  kick: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sec" id={id}>
      <div className="kick rv">{kick}</div>
      <InteractiveTitle text={title} className="sec-title" />
      {children}
    </section>
  );
}

/* ---------- Pricing table ----------
   A scannable table beats four long cards: the visitor compares figures in
   one glance instead of hunting for a price line in each block. The full
   descriptions moved to /contact, where they sit right above the form. */
function Pricing() {
  const { lang } = useLanguage();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);

  return (
    <Section
      id="services"
      kick={t('Services & pricing', 'Layanan & harga', '服务与报价')}
      title={t('What we can build together.', 'Apa yang bisa kita bangun.', '我们能共同打造的数字化成果。')}
    >
      <div className="prt-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <label htmlFor="currency-select" style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>
          {t('Currency / Country:', 'Mata Uang / Negara:', '货币 / 地区结算:')}
        </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as any)}
          style={{
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid var(--line)',
            background: 'var(--bg-sub, rgba(255,255,255,0.06))',
            color: 'var(--fg)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code} style={{ background: '#121214', color: '#fff' }}>
              {c.code} ({c.symbol}) — {c.country}
            </option>
          ))}
        </select>
      </div>

      <div className="prt-wrap rv">
        <table className="prt">
          <caption className="sr">
            {t('Services and starting prices', 'Layanan dan harga awal', '服务与起步报价')}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t('Service', 'Layanan', '服务项目')}</th>
              <th scope="col">{t('Best for', 'Cocok untuk', '适用场景')}</th>
              <th scope="col">{t('Starting from', 'Mulai dari', '起步价')}</th>
              <th scope="col">
                <span className="sr">{t('Action', 'Tindakan', '操作')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {S.services.map((s) => {
              const displayPrice = s.amountIDR ? formatPrice(s.amountIDR, s.periodSuffix) : (s.from[lang] || s.from.en);
              return (
                <tr key={s.slug} id={`pricing-${s.slug}`}>
                  <th scope="row" data-label={t('Service', 'Layanan', '服务项目')}>
                    <span className="prt-name">{s.title[lang] || s.title.en}</span>
                    <span className="prt-meta">{s.meta[lang] || s.meta.en}</span>
                  </th>
                  <td data-label={t('Best for', 'Cocok untuk', '适用场景')} className="prt-fit">
                    {s.fitsFor[lang] || s.fitsFor.en}
                  </td>
                  <td data-label={t('Starting from', 'Mulai dari', '起步价')} className="prt-price">
                    {displayPrice}
                  </td>
                  <td className="prt-cta">
                    <a className="sv-cta" href={waLink(lang, s.title[lang] || s.title.en)} target="_blank" rel="noopener">
                      {t('Discuss', 'Konsultasi', '咨询')} →
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="prt-note">{S.budgetNote[lang] || S.budgetNote.en}</p>
      </div>
    </Section>
  );
}

/* ---------- Testimonials (real client quotes) ---------- */
function Testimonials() {
  const { lang } = useLanguage();
  const t = (en: string, id: string) => (lang === 'en' ? en : id);
  // All quotes are rendered; only the first HOME_REVIEW_COUNT are visible
  // before the rail is scrolled — the same number JSON-LD declares as
  // `reviewCount`, so every rated item really is on the page.
  const items = S.testimonials;
  const reveal = useReveal<HTMLDivElement>([items.length, lang]);

  return (
    <div ref={reveal}>
      <Section
        id="testimonials"
        kick={t('Testimonials', 'Testimoni')}
        title={t('What clients say.', 'Kata klien.')}
      >
        <p className="lead-sub rv">
          {t(
            `Real quotes from ${items.length} business owners whose sites and systems are live today — swipe for more.`,
            `Kutipan asli dari ${items.length} pemilik usaha yang situs dan sistemnya sudah berjalan hari ini — geser untuk yang lain.`,
          )}
        </p>
        {/* `ts-rated` marks the quotes declared in JSON-LD `reviewCount`: the
            ones visible without scrolling. The rest sit further along the rail. */}
        <div className="tsm-wrap">
          <div className="tsm tsm-rail" tabIndex={0} role="region" aria-label={t('Client testimonials', 'Testimoni klien')}>
            {items.map((x, i) => (
              <figure className={i < HOME_REVIEW_COUNT ? 'ts rv ts-rated' : 'ts rv'} key={x.name}>
                <div className="ts-h">
                  <img
                    src={x.img}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>
                    <b>{x.name}</b>
                    <span>{x.role[lang]}</span>
                  </figcaption>
                </div>
                <blockquote>{x.quote[lang]}</blockquote>
                <div className="ts-stars" aria-label={t('Rated 5 out of 5', 'Dinilai 5 dari 5')}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <svg key={k} viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.05 2.93a1 1 0 0 1 1.9 0l1.07 3.29a1 1 0 0 0 .95.69h3.46a1 1 0 0 1 .59 1.81l-2.8 2.03a1 1 0 0 0-.37 1.12l1.07 3.29a1 1 0 0 1-1.54 1.12l-2.8-2.03a1 1 0 0 0-1.17 0l-2.8 2.03a1 1 0 0 1-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12L2.98 8.72a1 1 0 0 1 .58-1.81h3.46a1 1 0 0 0 .95-.69z" />
                    </svg>
                  ))}
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ---------- Skill cloud: flees the cursor, click = ripple ---------- */
function Cloud() {
  const ref = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);
  const { lang } = useLanguage();

  useEffect(() => {
    const cloud = ref.current;
    if (!cloud || !isFinePointer() || isReducedMotion()) return;
    const btns = Array.from(cloud.querySelectorAll<HTMLElement>('button'));
    const onMove = (e: PointerEvent) => {
      btns.forEach((b) => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy);
        const R = 130;
        if (d < R && d > 0) {
          const f = (1 - d / R) * 26;
          b.style.setProperty('--tx', ((-dx / d) * f).toFixed(1) + 'px');
          b.style.setProperty('--ty', ((-dy / d) * f).toFixed(1) + 'px');
        } else {
          b.style.setProperty('--tx', '0px');
          b.style.setProperty('--ty', '0px');
        }
      });
    };
    const onLeave = () =>
      btns.forEach((b) => {
        b.style.setProperty('--tx', '0px');
        b.style.setProperty('--ty', '0px');
      });
    cloud.addEventListener('pointermove', onMove);
    cloud.addEventListener('pointerleave', onLeave);
    return () => {
      cloud.removeEventListener('pointermove', onMove);
      cloud.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const onClick = (e: React.MouseEvent) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const id = ++idRef.current;
    setRipples((list) => [...list, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((list) => list.filter((x) => x.id !== id)), 800);
    b.classList.add('pop');
    setTimeout(() => b.classList.remove('pop'), 500);
  };

  return (
    <div className="cloud rv" id="cloud" aria-label={lang === 'en' ? 'Tech stack' : 'Teknologi'} ref={ref} onClick={onClick}>
      <p className="cloud-hint">{lang === 'en' ? 'Hover a skill' : 'Dekatkan kursor ke skill'}</p>
      {S.stack.map((t) => (
        <button type="button" key={t}>
          <SkillLogo tech={t} />
          {t}
        </button>
      ))}
      {ripples.map((r) => (
        <i className="rp" key={r.id} style={{ left: r.x, top: r.y }} />
      ))}
    </div>
  );
}

/* ---------- GitHub contribution heatmap (real data) ---------- */
interface Day {
  date: string;
  count: number;
  level: number;
}

/** Deterministic placeholder so the grid has a shape while data loads. */
const skeletonDays = (): Day[] => {
  const out: Day[] = [];
  const now = new Date();
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 370; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 864e5);
    const w = d.getUTCDay();
    const r = rnd();
    const c = w === 0 || w === 6 ? (r > 0.7 ? Math.floor(r * 3) : 0) : r > 0.5 ? Math.floor(r * 6) : 0;
    out.push({ date: d.toISOString().slice(0, 10), count: c, level: c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 7 ? 3 : 4 });
  }
  return out;
};

type GhContribution = { date: string; count: number; level: number };
type GhResponse = {
  contributions?: Array<{ date: string; count: number; level: number }>;
  total?: Record<string, number>;
};

const toDays = (res: GhResponse): Day[] => {
  const list = res.contributions ?? [];
  return list.map((c) => {
    const count = Number((c as GhContribution & { count?: number }).count ?? 0);
    const level = Number((c as GhContribution & { level?: number; intensity?: number }).level ?? 0);
    return { date: c.date, count, level };
  });
};

function Heatmap() {
  const { lang } = useLanguage();
  const [state, setState] = useState<{ days: Day[]; live: boolean; loading: boolean }>({
    days: skeletonDays(),
    live: false,
    loading: true,
  });
  const hmRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ text: string; x: number; y: number } | null>(null);
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  useEffect(() => {
    let cancelled = false;
    // Public contributions API — no token needed, CORS enabled.
    fetch(`https://github-contributions-api.jogruber.de/v1/${S.github}?y=last`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('request failed'))))
      .then((d: GhResponse) => {
        if (cancelled) return;
        const days = toDays(d);
        if (!days.length) throw new Error('empty payload');
        setState({ days, live: true, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, live: false, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const days = state.days;
    let tot = 0;
    let best = 0;
    let run = 0;
    days.forEach((d) => {
      tot += d.count;
      run = d.count ? run + 1 : 0;
      best = Math.max(best, run);
    });
    return { tot, best };
  }, [state.days]);

  useEffect(() => {
    const hm = hmRef.current;
    if (!hm) return;
    const cells = Array.from(hm.querySelectorAll<HTMLElement>('i[data-tip]'));
    const onMove = (e: PointerEvent) => {
      const c = (e.target as HTMLElement).closest<HTMLElement>('i[data-tip]');
      if (!c) return;
      const k = cells.indexOf(c);
      cells.forEach((x) => x.classList.remove('h0', 'h1', 'h2'));
      c.classList.add('h0');
      [k - 1, k + 1, k - 7, k + 7].forEach((j) => cells[j]?.classList.add('h1'));
      [k - 2, k + 2, k - 14, k + 14, k - 8, k - 6, k + 6, k + 8].forEach((j) => cells[j]?.classList.add('h2'));
      const r = c.getBoundingClientRect();
      setHover({ text: c.dataset.tip ?? '', x: r.left + r.width / 2, y: r.top });
    };
    const onLeave = () => {
      cells.forEach((x) => x.classList.remove('h0', 'h1', 'h2'));
      setHover(null);
    };
    hm.addEventListener('pointermove', onMove);
    hm.addEventListener('pointerleave', onLeave);
    return () => {
      hm.removeEventListener('pointermove', onMove);
      hm.removeEventListener('pointerleave', onLeave);
    };
    // Re-bind after data loads: the handler caches the cell list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.days]);

  const first = state.days[0];
  const off = first ? new Date(first.date + 'T00:00:00Z').getUTCDay() : 0;
  const dayLabel = (d: Day) => {
    const n = d.count;
    return lang === 'en'
      ? `${n} contribution${n === 1 ? '' : 's'} · ${d.date}`
      : `${n} kontribusi · ${d.date}`;
  };

  return (
    <Section id="github" kick={t('Activity', 'Aktivitas')} title={t('Shipping code, every week.', 'Ngoding tiap minggu, terlihat.')}>
      <div className="ghh rv">
        <div>
          <b>
            {state.loading ? <span className="lv-skel" style={{ display: 'inline-block', width: '4rem', height: '1em' }} /> : <CountUp value={stats.tot} />}
          </b>
          <small>{t('contributions in the last year', 'kontribusi setahun terakhir')}</small>
        </div>
        <div>
          <b>
            {state.loading ? <span className="lv-skel" style={{ display: 'inline-block', width: '3rem', height: '1em' }} /> : <CountUp value={stats.best} />}
          </b>
          <small>{t('longest daily streak', 'streak harian terpanjang')}</small>
        </div>
      </div>
      <div className="hmw rv" style={{ opacity: state.live || state.loading ? undefined : 0.55 }}>
        <div className="hm" ref={hmRef} aria-hidden="true">
          {Array.from({ length: off }, (_, i) => (
            <i key={'o' + i} style={{ visibility: 'hidden' }} />
          ))}
          {state.days.map((d, k) => (
            <i key={k} data-l={d.level} data-tip={dayLabel(d)} />
          ))}
        </div>
      </div>
      <p className="gh-note">
        {state.loading ? (
          t('Loading contributions…', 'Memuat kontribusi…')
        ) : state.live ? (
          <>
            {t('Live data from', 'Data langsung dari')}{' '}
            <a href={S.social.github} target="_blank" rel="noopener">
              github.com/{S.github}
            </a>
            .
          </>
        ) : (
          t(
            'GitHub is unreachable right now — showing a placeholder grid. Open the profile for live activity.',
            'GitHub tidak dapat dijangkau saat ini — menampilkan grid contoh. Buka profil untuk aktivitas langsung.',
          )
        )}
      </p>
      {hover && (
        <div className="tip on" style={{ transform: `translate(${hover.x}px,${hover.y}px) translate(-50%,-140%)` }}>
          {hover.text}
        </div>
      )}
    </Section>
  );
}

/* ---------- Client proof: the numbers a buyer cares about ---------- */
/**
 * The "Live" section used to open with developer telemetry (commits, WakaTime,
 * crypto). Those prove technical health, not business fit, so the panel a
 * prospective client reads first now answers their questions instead: how many
 * people have been served, how fast a reply arrives, and how long the work has
 * been running. The live telemetry still follows underneath.
 */
function ClientProof() {
  const { lang } = useLanguage();
  const t = (en: string, id: string) => (lang === 'en' ? en : id);
  const facts = [
    { v: S.clients, suffix: '+', k: t('Clients served', 'Klien dilayani') },
    { v: S.projects.length, suffix: '', k: t('Projects shipped', 'Proyek dirilis') },
    { v: 24, prefix: '<', suffix: 'h', k: t('Typical reply time', 'Waktu balas') },
    { v: S.years, suffix: '+', k: t('Years building', 'Tahun berkarya') },
  ];

  return (
    <div className="proof rv" aria-label={t('What you can expect', 'Yang bisa Anda harapkan')}>
      {facts.map((f) => (
        <div className="pf" key={f.k}>
          <b>
            {f.prefix ?? ''}
            <CountUp value={f.v} />
            {f.suffix}
          </b>
          <small>{f.k}</small>
        </div>
      ))}
    </div>
  );
}

/* ---------- Key facts (AEO / GEO) ---------- */
/**
 * A compact, machine-readable summary of the entity ("who / what / where /
 * how much / how to start"). Answer engines and LLM crawlers quote short,
 * factual, self-contained sentences far more reliably than marketing prose,
 * so this block states the facts plainly once, and the same facts are mirrored
 * in the JSON-LD (`Seo.ts`) and in `/llms.txt`.
 */
export function KeyFacts() {
  const { lang } = useLanguage();
  const totalCerts = S.certs.reduce((n, c) => n + c.count, 0);
  const facts = [
    {
      k: { en: 'Who', id: 'Siapa' },
      v: { en: `${S.name} — AI & software engineer, founder of ${S.company.name}.`, id: `${S.name} — AI & software engineer, pendiri ${S.company.name}.` },
    },
    {
      k: { en: 'Based in', id: 'Berbasis di' },
      v: { en: 'Indonesia · GMT+7 (WIB)', id: 'Indonesia · GMT+7 (WIB)' },
    },
    {
      k: { en: 'Experience', id: 'Pengalaman' },
      v: { en: `${S.years}+ years · ${S.projects.length} shipped projects`, id: `${S.years}+ tahun · ${S.projects.length} proyek dirilis` },
    },
    {
      k: { en: 'Builds', id: 'Membangun' },
      v: {
        en: 'Web apps, AI integration & automation, business systems, e-commerce, landing pages',
        id: 'Aplikasi web, integrasi & otomasi AI, sistem bisnis, e-commerce, landing page',
      },
    },
    {
      k: { en: 'Certified in', id: 'Sertifikasi' },
      v: {
        en: `BNSP national web developer competency, ${totalCerts} credentials in total`,
        id: `Kompetensi nasional BNSP web developer, total ${totalCerts} kredensial`,
      },
    },
    {
      k: { en: 'Languages', id: 'Bahasa' },
      v: { en: 'English, Bahasa Indonesia', id: 'Inggris, Bahasa Indonesia' },
    },
    {
      k: { en: 'Contact', id: 'Kontak' },
      v: { en: `${S.email} · WhatsApp · replies within 24 hours`, id: `${S.email} · WhatsApp · dibalas dalam 24 jam` },
    },
  ];
  return (
    <div className="kfacts rv" aria-label={lang === 'en' ? 'Key facts' : 'Fakta singkat'}>
      <h3>{lang === 'en' ? 'Key facts' : 'Fakta singkat'}</h3>
      <dl>
        {facts.map((f) => (
          <div key={f.k.en}>
            <dt>{f.k[lang]}</dt>
            <dd>{f.v[lang]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

import { useIsMobile } from '../../hooks/useMediaQuery';

/* ---------- Home page sections ---------- */

/** How many project cards the homepage shows. Phones get fewer: the cards are
    full-width there, so each one costs a screenful plus its thumbnail. */
const HOME_PROJECTS_DESKTOP = 5;
const HOME_PROJECTS_MOBILE = 3;

export function HomeSections() {
  const rootRef = useReveal();
  const { lang } = useLanguage();
  const isMobile = useIsMobile();
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  // Sliced from the front of `featuredProjects`. Note that the best-first
  // ordering in `site.ts` currently has no effect (see the comment on
  // BEST_ORDER), so this is the authoring order in `projects.ts` — not a
  // curated ranking. The rest stay one click away via "All N projects", and
  // every counter elsewhere still reports the true total.
  const shownProjects = S.featuredProjects.slice(0, isMobile ? HOME_PROJECTS_MOBILE : HOME_PROJECTS_DESKTOP);

  return (
    <div ref={rootRef}>
      <Marquee />

      <Section
        id="projects"
        kick={t('Projects', 'Proyek')}
        title={t('Built and shipped, not just designed.', 'Dibangun dan dirilis, bukan sekadar dirancang.')}
      >
        <div className="pg">
          {shownProjects.map((p, i) => {
            // `i` must be the index inside the FULL project list so the modal
            // opens the right item (prev/next steps through all projects).
            const fullIndex = S.projects.findIndex((x) => x.id === p.id);
            return <ProjectCard key={p.id} p={p} i={fullIndex} big={i === 0} />;
          })}
        </div>
        <p className="rv" style={{ marginTop: '1.5rem' }}>
          <Link className="btn2" to="/projects">
            {t(`All ${S.projects.length} projects`, `Semua ${S.projects.length} proyek`)} →
          </Link>
        </p>
      </Section>

      {/* Order follows the order a prospect's questions are actually answered:
          "can they build it?" (work) → "did it work for others?" (quotes) →
          "what does it cost?" (table) → "how do I start?" (process + FAQ) →
          "who is this person?" → live proof → credentials → CTA. */}
      <Testimonials />

      <Pricing />

      <Section
        id="how"
        kick={t('How it works', 'Cara kerjanya')}
        title={t('From first message to live.', 'Dari chat pertama sampai online.')}
      >
        <ProcessSteps />
        <div className="home-faq">
          <h3 className="rv">{t('Common questions.', 'Pertanyaan umum.')}</h3>
          <FaqList limit={4} compact />
          <p className="rv">
            <Link className="btn2" to="/contact">
              {t('All questions & the contact form', 'Semua pertanyaan & form kontak')} →
            </Link>
          </p>
        </div>
      </Section>


      <Section id="about" kick={t('About', 'Tentang')} title={t('An engineer who also runs the business.', 'Engineer yang juga menjalankan bisnis.')}>
        <div className="ab">
          <div>
            <p className="big rv">
              {t('I go by ', 'Nama panggilan saya ')}
              <b>{S.name}</b>
              {t(
                ' — previously known as ',
                ' — sebelumnya dikenal sebagai ',
              )}
              <b>{S.legalName}</b>
              {t(
                '. I’m an ',
                '. Saya seorang ',
              )}
              <b>{t('AI & software engineer', 'AI & software engineer')}</b>
              {t(
                ' with a background in computer engineering. I build web apps, AI automation, and business systems — and I use them to run ',
                ' berlatar computer engineering. Saya membangun aplikasi web, otomasi AI, dan sistem bisnis — dan saya memakainya untuk menjalankan ',
              )}
              <b>{S.company.name}</b>
              {t(
                ', so the solutions are proven in the field rather than in theory.',
                ', jadi solusinya teruji di lapangan, bukan teori.',
              )}
            </p>
            <p className="about-aka rv">
              {t(
                'On every platform the name is simply FIQTOR; Taufiiqul Hakim is the name that appears on certificates and official documents.',
                'Di semua platform namanya cukup FIQTOR; Taufiiqul Hakim adalah nama yang tercantum pada sertifikat dan dokumen resmi.',
              )}
            </p>
            <Link className="btn2 rv" to="/career" style={{ display: 'inline-block', marginTop: '1.4rem' }}>
              {t('See the career timeline', 'Lihat perjalanan karier')} →
            </Link>
            <div className="nums">
              <div className="num rv">
                <b>
                  <CountUp value={S.projects.length} />
                </b>
                <small>{t('Projects', 'Proyek')}</small>
              </div>
              <div className="num rv">
                <b>
                  <CountUp value={S.years} />+
                </b>
                <small>{t('Years', 'Tahun')}</small>
              </div>
              <div className="num rv">
                <b>
                  <CountUp value={S.certs.reduce((n, c) => n + c.count, 0)} />
                </b>
                <small>{t('Certificates', 'Sertifikat')}</small>
              </div>
            </div>
          </div>
          <div className="roles">
            <div className="role rv">
              <h4>{t('AI & Software Engineer', 'AI & Software Engineer')}</h4>
              <p>
                {t(
                  'Web apps, AI integrations, and business platforms. From idea to deploy, one person can take it end to end.',
                  'Aplikasi web, integrasi AI, dan platform bisnis. Dari ide sampai deploy, satu orang bisa menuntaskannya.',
                )}
              </p>
            </div>
            <div className="role rv">
              <h4>
                {t('Founder, ', 'Pendiri, ')}
                {S.company.name}
              </h4>
              <p>
                {t(
                  'IARTY: websites, apps, AI, education, and a marketplace. Built and run in-house.',
                  'IARTY: website, aplikasi, AI, edukasi, dan marketplace. Dibangun dan dikelola sendiri.',
                )}
              </p>
            </div>
          </div>
        </div>
        <KeyFacts />
        <Cloud />
      </Section>

      <Section id="live" kick={t('Live', 'Live')} title={t('Real numbers, updated live.', 'Angka nyata, diperbarui langsung.')}>
        <ClientProof />
        <LiveStats />
      </Section>

      <Section id="certs" kick={t('Certificates', 'Sertifikat')} title={t('Validated skills.', 'Skill yang tervalidasi.')}>
        <div className="cg">
          {S.featuredCerts.map((c) => (
            <CertCard key={c.id} c={c} i={S.certs.findIndex((x) => x.id === c.id)} />
          ))}
        </div>
        <p className="rv" style={{ marginTop: '1.5rem' }}>
          <Link className="btn2" to="/certificates">
            {t(
              `All ${S.certs.reduce((n, c) => n + c.count, 0)} certificates`,
              `Semua ${S.certs.reduce((n, c) => n + c.count, 0)} sertifikat`,
            )}{' '}
            →
          </Link>
        </p>
      </Section>

      <Heatmap />

      <section className="cta-s" id="contact">
        <div className="big">
          <InteractiveTitle text={t('Got a project?', 'Punya proyek?')} as="span" />
          <InteractiveTitle text={t('Let’s build it.', 'Kita bangun.')} as="span" className="o" />
        </div>
        <div className="cta-row rv">
          {/* One primary action. Four buttons of equal weight forced the
              visitor to choose between channels that the Contact page has
              already ranked (WhatsApp fastest) — the alternatives are now
              quiet text links. */}
          <a className="cta" href={waLink(lang)} target="_blank" rel="noopener">
            {t('Chat on WhatsApp', 'Chat WhatsApp')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <span className="sr"> {t('(new tab)', '(tab baru)')}</span>
          </a>
          <span className="cta-alt">
            <a href={`mailto:${S.email}`} data-no-transition>
              {t('Email', 'Email')}
            </a>
            <Link to="/contact">{t('Contact form', 'Form kontak')}</Link>
            <Link to="/linktree">Linktree</Link>
          </span>
        </div>
      </section>
    </div>
  );
}

