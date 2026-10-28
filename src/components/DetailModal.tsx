import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { S, type Cert, type Project } from '../data/site';
import { useCatalog, useLanguage } from '../lib/catalog';
import { Chip } from './Cards';
import { pad, formatPublished } from '../lib/utils';
import { ICONS } from '../lib/utils.tsx';
import { hasCaseStudy } from '../config/Seo';

/* =====================================================================
   Detail modal (project / certificate) + image lightbox.
   ===================================================================== */

type Gallery = [string, string][];

type Cur = { type: string; i: number };

/** Must match the exit transition in `.md-p` / `.md-bg`. */
const EXIT_MS = 260;
/** First frame at the "closed" pose, then flip to open so the transition has
    both endpoints to interpolate between. */
const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

export function DetailModal() {
  const { cur: selected, close, step, list } = useCatalog();
  const { lang } = useLanguage();
  // `shown` = keep the dialog in the DOM (`visibility`). `open` = the animatable
  // pose. They are separate because an element that mounts already in its final
  // pose cannot transition into it — it needs one frame at the start pose first.
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [sw, setSw] = useState(false);
  const [lb, setLb] = useState<{ list: Gallery; i: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCur = useRef<{ type: string; i: number } | null>(null);
  /** True while a modal is already on screen — a step then only swaps content. */
  const prevShown = useRef(false);

  /** The item to render. Held after `cur` goes null so the panel still has
      content to animate out with; clearing `cur` first would blank it. */
  const [render, setRender] = useState<Cur | null>(selected);
  const exitTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    clearTimeout(exitTimer.current);

    if (selected) {
      const swap = prevCur.current !== null && selected.type === prevCur.current.type;
      prevCur.current = { type: selected.type, i: selected.i };
      setSw(swap);
      setRender(selected);
      setShown(true);

      // Keep the same item mounted across a step, so only the content swaps
      // and the panel itself does not re-enter with an entrance animation.
      if (prevShown.current) {
        setOpen(true);
      } else {
        setOpen(false);
        nextFrame(() => setOpen(true));
      }
      prevShown.current = true;

      // The cover sits outside the scroll container, so resetting the scroll
      // position means resetting `.md-scroll`, not the panel itself.
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      const r1 = requestAnimationFrame(() => requestAnimationFrame(() => setSw(false)));
      const t = setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 60);
      return () => {
        clearTimeout(t);
        cancelAnimationFrame(r1);
      };
    }

    // Closed: play the exit, then unmount. `render` deliberately survives until
    // the transition is over, otherwise the panel would be emptied before it
    // had anything to animate out.
    const wasOpen = prevShown.current;
    prevCur.current = null;
    prevShown.current = false;
    setLb(null);
    setOpen(false);
    if (wasOpen) {
      exitTimer.current = window.setTimeout(() => {
        setShown(false);
        setRender(null);
      }, EXIT_MS);
    } else {
      setShown(false);
      setRender(null);
    }
  }, [selected]);

  useEffect(() => () => clearTimeout(exitTimer.current), []);

  // Nothing has ever been selected → render nothing at all. This used to return
  // an empty `position:fixed; inset:0` dialog shell, which is pointless DOM on
  // every page and was the source of the phantom space reported under the footer.
  if (!render) return null;

  // Downstream JSX keeps using `cur`, but it now means "the item on screen" —
  // which outlives the context value by one exit transition.
  const cur = render;

  const isProject = cur.type === 'project';
  // The modal steps through the list the card came from (filtered on the
  // certificate page), so "next" never jumps to an item that is off-screen.
  const items = list.length ? list : isProject ? S.projects : S.certs;
  const current = items[cur.i];
  const project = current && 'title' in current ? current : null;
  const cert = current && 'name' in current ? current : null;
  const total = items.length;
  const p = project as Project;
  const c = cert as Cert;
  const curVer = cur.i * 2 + (isProject ? 0 : 1);
  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);

  return (
    <>
      <div
        className={'md' + (shown ? ' show' : '') + (open ? ' open' : '') + (open ? '' : ' out')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mdT"
      >
        <div className="md-bg" onClick={close} />
        <div className={'md-p' + (sw ? ' sw' : '')} tabIndex={-1} ref={panelRef}>
          <button className="md-x" type="button" onClick={close} aria-label={t('Close details', 'Tutup detail', '关闭详情')}>
            ×
          </button>
          <div className="md-scroll" ref={scrollRef}>
          {/* The cover is the first child of the scroll container (not a
              sibling), so it scrolls away with the copy instead of staying
              pinned over the panel. */}
          {project && (
            <div className="md-cov">
              <img src={p.thumb} alt={`${p.title[lang] || p.title.en} — cover`} width={1600} height={900} decoding="async" />
              <div className="md-ct">
                <div className="md-n">
                  {t('Project', 'Proyek', '项目')} {pad(cur.i + 1)} / {pad(total)} · {p.category}
                </div>
                <h2 id="mdT">{p.title[lang] || p.title.en}</h2>
              </div>
            </div>
          )}
          <div key={curVer}>
            {project && (
              <>
                <div className="md-c">
                  <div className="md-row">
                    <div className="chips">
                      {p.tags.map((tag) => (
                        <Chip key={tag.en} text={tag[lang] || tag.en} />
                      ))}
                    </div>
                    <div className="md-meta">
                      <div>
                        <small>{t('Category', 'Kategori', '类别')}</small>
                        <b>{p.category}</b>
                      </div>
                      <div>
                        <small>{t('Type', 'Jenis', '类型')}</small>
                        <b>{p.featured ? t('Flagship', 'Unggulan', '旗舰') : t('Shipped', 'Rilis', '已发布')}</b>
                      </div>
                      <div>
                        <small>{t('Stack', 'Teknologi', '技术栈')}</small>
                        <b>{p.skills.slice(0, 2).join(', ')}</b>
                      </div>
                    </div>
                  </div>
                  <p className="md-lead">{firstSentence(p.desc[lang] || p.desc.en)}</p>
                  <p className="md-txt">{p.desc[lang] || p.desc.en}</p>
                  <div>
                    <h3 className="md-h">{t('Built with', 'Dibangun dengan', '构建技术')}</h3>
                    <div className="sk">
                      {p.skills.map((s, k) => (
                        <span key={s} style={{ ['--i' as string]: k }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {p.gallery.length > 0 && (
                    <div>
                      <h3 className="md-h">{t('Screenshots', 'Cuplikan layar', '屏幕截图')}</h3>
                      <div className={'gal' + (p.gallery.length === 2 ? ' two' : '')}>
                        {p.gallery.map((g, k) => (
                          <button
                            type="button"
                            key={g.src + k}
                            onClick={() => setLb({ list: p.gallery.map((x) => [x.src, x.caption[lang]] as [string, string]), i: k })}
                            aria-label={`${t('Enlarge', 'Perbesar', '放大')}: ${g.caption[lang]}`}
                          >
                            <img loading="lazy" src={g.src} alt={g.caption[lang]} />
                            <span className="cap">{g.caption[lang]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="md-foot">
                    {/*
                      The modal is a dead end for projects that have a full
                      case-study page: without this link a visitor reads the
                      summary and stops. `close()` runs first so the dialog is
                      not still mounted on top of the page it navigates to.
                     */}
                    {hasCaseStudy(p.id) && (
                      <Link className="cta" to={`/projects/${p.id}`} onClick={() => close()}>
                        {t('Read the full case study', 'Baca studi kasus lengkap', '阅读完整案例研究')} <span dangerouslySetInnerHTML={{ __html: ICONS.open }} />
                      </Link>
                    )}
                    {p.url ? (
                      <a className="cta" href={p.url} target="_blank" rel="noopener">
                        {t('Open live project', 'Buka proyek', '打开线上项目')} <span dangerouslySetInnerHTML={{ __html: ICONS.open }} />
                        <span className="sr"> {t('(new tab)', '(tab baru)', '（新标签）')}</span>
                      </a>
                    ) : (
                      <span className="soon">{t('No public link yet', 'Tautan publik belum tersedia', '暂无公开链接')}</span>
                    )}
                    <div className="md-nav">
                      <button type="button" onClick={() => step(-1)}>
                        ← {t('Previous', 'Sebelumnya', '上一个')}
                      </button>
                      <button type="button" onClick={() => step(1)}>
                        {t('Next', 'Berikutnya', '下一个')} →
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {cert && (
              <>
                <div className="cert-view">
                  <button
                    type="button"
                    onClick={() => setLb({ list: [[c.img, c.name]], i: 0 })}
                    aria-label={t('Enlarge certificate image', 'Perbesar gambar sertifikat', '放大证书图片')}
                  >
                    <img src={c.img} alt={`Certificate: ${c.name}`} loading="lazy" decoding="async" />
                  </button>
                </div>
                <div className="md-c">
                  <div>
                    <div className="md-n">
                      {t('Certificate', 'Sertifikat', '证书')} {pad(cur.i + 1)} / {pad(total)} · {formatPublished(c.date, lang)}
                    </div>
                    <h2
                      id="mdT"
                      style={{
                        fontSize: 'clamp(1.7rem,4vw,3rem)',
                        letterSpacing: '-.04em',
                        lineHeight: 1.05,
                        marginTop: '.5rem',
                      }}
                    >
                      {c.name}
                    </h2>
                    <div className="md-sub">
                      <span>
                        {t('Issued by', 'Diterbitkan oleh', '颁发机构')} <b>{c.issuer[lang]}</b>
                      </span>
                      <span>
                        {t('Issued', 'Tanggal', '颁发日期')} <b>{formatPublished(c.date, lang)}</b>
                      </span>
                      <span>
                        {t('Type', 'Jenis', '类型')} <b>{c.kind[lang] || c.kind.en}</b>
                      </span>
                      {c.verified && (
                        <span className="md-vf">
                          <b>{t('Verifiable', 'Dapat diverifikasi', '可验证')}</b>
                        </span>
                      )}
                      {c.count > 1 && (
                        <span className="md-bundle">
                          <b>
                            {c.count} {t('certificates in this bundle', 'sertifikat dalam bundel ini', '个证书在此合集中')}
                          </b>
                          <span>
                            {t(
                              'One record, issued separately — the list is under "Included certificates".',
                              'Satu entri yang diterbitkan terpisah — daftarnya ada di "Sertifikat yang termasuk".',
                              '单条记录，分别颁发 — 列表位于"包含的证书"中。',
                            )}
                          </span>
                        </span>
                      )}
                      {c.academic && <span>· {t('Academic credential', 'Kredensial akademik', '学术证书')}</span>}
                    </div>
                  </div>
                  <div className="md-row">
                    <div className="chips">
                      {c.tags.map((tag) => (
                        <Chip key={tag.en} text={tag[lang] || tag.en} />
                      ))}
                    </div>
                  </div>
                  <p className="md-txt">{c.desc[lang] || c.desc.en}</p>
                  {c.details && c.details.length > 0 && (
                    <div>
                      <h3 className="md-h">{t('Included certificates', 'Sertifikat yang termasuk', '包含的证书')}</h3>
                      <ul className="cdet">
                        {c.details.map((d) => (
                          <li key={d.label}>
                            <span>{d.label}</span>
                            <time>{formatPublished(d.date, lang)}</time>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {c.secondary && (
                    <div>
                      <h3 className="md-h">{c.secondary.label[lang] || c.secondary.label.en}</h3>
                      <div className="gal two">
                        <button
                          type="button"
                          onClick={() => setLb({ list: [[c.secondary!.src, c.secondary!.label[lang] || c.secondary!.label.en]], i: 0 })}
                          aria-label={t('Enlarge result sheet', 'Perbesar lembar hasil', '放大成绩单')}
                        >
                          <img loading="lazy" src={c.secondary.src} alt={c.secondary.label[lang] || c.secondary.label.en} />
                          <span className="cap">{c.secondary.label[lang] || c.secondary.label.en}</span>
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="md-h">{t('Skills verified', 'Skill yang divalidasi', '验证掌握技能')}</h3>
                    <div className="sk">
                      {c.skills.map((s, k) => (
                        <span key={s + k} style={{ ['--i' as string]: k }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="md-foot">
                    {c.url ? (
                      <a className="cta" href={c.url} target="_blank" rel="noopener">
                        {t('Verify credential', 'Verifikasi sertifikat', '验证证书真伪')}{' '}
                        <span dangerouslySetInnerHTML={{ __html: ICONS.open }} />
                        <span className="sr"> {t('(new tab)', '(tab baru)', '(新标签打开)')}</span>
                      </a>
                    ) : (
                      <span className="soon">{t('Verification link not available', 'Tautan verifikasi belum tersedia', '暂无在线验证链接')}</span>
                    )}
                    <div className="md-nav">
                      <button type="button" onClick={() => step(-1)}>
                        ← {t('Previous', 'Sebelumnya', '上一项')}
                      </button>
                      <button type="button" onClick={() => step(1)}>
                        {t('Next', 'Berikutnya', '下一项')} →
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
      {lb && <Lightbox list={lb.list} i={lb.i} setI={(i) => setLb({ ...lb, i })} onClose={() => setLb(null)} />}
    </>
  );
}

function Lightbox({
  list,
  i,
  setI,
  onClose,
}: {
  list: Gallery;
  i: number;
  setI: (i: number) => void;
  onClose: () => void;
}) {
  const [out, setOut] = useState(false);
  // Same reason as the modal: mounting straight into `.open` gives the browser
  // nothing to transition from, so the lightbox would cut in. Start closed, flip
  // one frame later.
  const [entered, setEntered] = useState(false);
  const sx0 = useRef<number | null>(null);
  const wrap = (k: number) => (k + list.length) % list.length;
  const it = list[wrap(i)];
  const { lang } = useLanguage();
  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);

  // Tracked so closing the lightbox mid-transition cannot call setState on an
  // unmounted component (React logs a warning and the timer still runs).
  const goTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    // Unmount is immediate for the lightbox (it covers the modal and has no
    // scroll position to preserve), so no exit timer is needed here.
    return () => window.clearTimeout(goTimer.current);
  }, []);

  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(r);
  }, []);
  const goTo = (k: number) => {
    setOut(true);
    window.clearTimeout(goTimer.current);
    goTimer.current = window.setTimeout(() => {
      setI(wrap(k));
      setOut(false);
    }, 180);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(i + 1);
      if (e.key === 'ArrowLeft') goTo(i - 1);
    };
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <div
      className={'lb' + (entered ? ' open' : '')}
      role="dialog"
      aria-modal="true"
      aria-label={t('Image preview', 'Pratinjau gambar', '图片预览')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="lb-s"
        onPointerDown={(e) => {
          sx0.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (sx0.current === null) return;
          const d = e.clientX - sx0.current;
          sx0.current = null;
          if (Math.abs(d) > 50) goTo(i + (d < 0 ? 1 : -1));
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <button className="lx" type="button" aria-label={t('Close image', 'Tutup gambar', '关闭图片')} onClick={onClose}>
          ×
        </button>
        {list.length > 1 && (
          <>
            <button className="lp" type="button" aria-label={t('Previous image', 'Gambar sebelumnya', '上一张图片')} onClick={() => goTo(i - 1)}>
              ‹
            </button>
            <button className="ln" type="button" aria-label={t('Next image', 'Gambar berikutnya', '下一张图片')} onClick={() => goTo(i + 1)}>
              ›
            </button>
          </>
        )}
        <img className={out ? 'out' : ''} src={it[0]} alt={it[1]} />
      </div>
      <div className="lb-i">
        <span>
          <b>{it[1]}</b>
        </span>
        <div className="lb-dots">{list.map((_, j) => <i key={j} className={j === wrap(i) ? 'on' : ''} />)}</div>
        <span>
          {wrap(i) + 1} / {list.length}
        </span>
      </div>
    </div>
  );
}

/** Cards/modals show the first sentence of a long description up front. */
function firstSentence(text: string): string {
  const m = text.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : text;
}
