import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { S, waLink } from '../data/site';
import { PageHeader } from '../components/FilterGallery';
import { useLanguage } from '../lib/catalog';
import { isReducedMotion } from '../lib/utils';

/**
 * Career page — alternating vertical timeline. The progress line fills as the
 * section scrolls, each dot lights up when reached, and every role expands to
 * its highlights.
 *
 * Every class that changes on a card (`rv/in/ex/act`) is derived from React
 * state. An earlier version added `in` and `act` with a raw `classList` call,
 * which React silently dropped the next time it wrote `className` — opening a
 * card re-rendered it as `"ct rv ex"`, losing `in`, so `html.js .rv` snapped
 * the card back to `opacity:0` and it vanished on click.
 */
export default function Career() {
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const tlRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  /**
   * Indices that have scrolled into view (drives both the reveal and the lit
   * dot). Seeded eagerly for reduced-motion so the timeline is never blank.
   */
  const [seen, setSeen] = useState<Set<number>>(() =>
    isReducedMotion() ? new Set(S.career.map((_, i) => i)) : new Set(),
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    const upd = () => {
      const r = tl.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * 0.6 - r.top) / r.height));
      tl.style.setProperty('--p', p.toFixed(3));

      const next = new Set<number>();
      tl.querySelectorAll<HTMLElement>('.ct').forEach((it, i) => {
        if (it.getBoundingClientRect().top < innerHeight * 0.6) next.add(i);
      });
      // Only commit on change; otherwise every scroll frame re-renders the list.
      setSeen((prev) => (prev.size === next.size && [...next].every((i) => prev.has(i)) ? prev : next));
    };
    addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();
    return () => {
      removeEventListener('scroll', upd);
      removeEventListener('resize', upd);
    };
  }, []);

  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);

  return (
    <div ref={ref}>
      <PageHeader
        crumb={t('Career', 'Karier', '经历')}
        title={t('My journey so far.', 'Perjalanan saya.', '我的职业历程.')}
        lead={t(
          'Newest first. Tap a card to read the highlights of each role.',
          'Terbaru di atas. Ketuk kartu untuk membaca pencapaian tiap peran.',
          '最新优先. 点击卡片查看每个角色的亮点.',
        )}
      >
        <p className="ph-cta rv">
          <a className="cta-ghost" href={waLink(lang)} target="_blank" rel="noopener">
            {t('Need someone like this?', 'Butuh orang seperti ini?', '需要这样的人?')}
            <span className="sr"> {t('(opens WhatsApp)', '(membuka WhatsApp)', '(打开 WhatsApp)')}</span>
          </a>
        </p>
      </PageHeader>
      <section className="sec pgsec">
        <div className="career-tl" ref={tlRef}>
          {S.career.map((c, i) => {
            const isOpen = open === i;
            return (
              <div
                className={'ct rv' + (seen.has(i) ? ' in act' : '') + (isOpen ? ' ex' : '')}
                key={c.org + i}
                style={{ ['--d' as string]: `${(i * 0.09).toFixed(2)}s` }}
              >
                <div className="ct-box">
                  {/* Corner toggle. The CSS for `.pl` already existed but no
                      element used it, so the affordance was invisible and the
                      only way to open a card was the text button below. The
                      icon is aria-hidden; the button carries the real label
                      and the expanded state. */}
                  <button
                    type="button"
                    className="pl"
                    aria-expanded={isOpen}
                    aria-controls={`ct-px-${i}`}
                    aria-label={
                      isOpen
                        ? t(`Hide highlights for ${c.role.en}`, `Sembunyikan pencapaian ${c.role.id}`, `隐藏 ${c.role[lang] || c.role.en} 的成就亮点`)
                        : t(`See highlights for ${c.role.en}`, `Lihat pencapaian ${c.role.id}`, `查看 ${c.role[lang] || c.role.en} 的成就亮点`)
                    }
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                  <div className="ct-head">
                    <img className="ct-logo" src={c.logo} alt={`${c.org} logo`} loading="lazy" width={42} height={42} />
                    <div>
                      <time>
                        {c.period[lang]}
                        {c.end === null && (
                          <span className="ct-now" title={t('Ongoing role', 'Peran yang masih berjalan', '进行中的角色')}>
                            <i aria-hidden="true" />
                            {t('Now', 'Sekarang', '现在')}
                          </span>
                        )}
                      </time>
                      <h3>{c.role[lang]}</h3>
                      <div className="org">{c.org}</div>
                      <div className="loc">{c.location[lang]}</div>
                    </div>
                  </div>
                  <p className="ds">{c.desc[lang]}</p>
                  <div className="ct-actions">
                    <button
                      type="button"
                      className="btn-o"
                      style={{ fontSize: '.8rem', minHeight: '2.3rem', padding: '0 1rem' }}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      {isOpen ? t('Hide highlights', 'Sembunyikan', '隐藏亮点') : t('See highlights', 'Lihat pencapaian', '查看亮点')}
                    </button>
                    {c.website && (
                      // A plain <a>: `website` is an absolute external URL, and
                      // React Router's <Link> intercepts every click to push an
                      // in-app history entry — for a cross-origin href that
                      // leaves a dead entry and never actually navigating.
                      <a href={c.website} target="_blank" rel="noopener" data-open>
                        {t('Visit', 'Kunjungi', '访问')} ↗
                      </a>
                    )}
                  </div>
                  <div className="px" id={`ct-px-${i}`}>
                    <div>
                      <ul>
                        {c.points.map((x) => (
                          <li key={x.en}>{x[lang]}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <a className="btn2" href={lang === 'en' ? S.resume.atsEn : S.resume.atsId} target="_blank" rel="noopener">
            {t('Download résumé (PDF)', 'Unduh CV (PDF)', '下载简历 (PDF)')} ↓
          </a>
          <a className="btn2" href={lang === 'en' ? S.resume.creativeEn : S.resume.creativeId} target="_blank" rel="noopener">
            {t('Creative résumé', 'CV kreatif', '创意简历')} ↗
          </a>
          <Link className="btn2" to="/contact">
            {t('Work with me', 'Bekerja sama', '与我合作')} →
          </Link>
        </div>
      </section>
    </div>
  );
}
