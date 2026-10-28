import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Cert, CertGroup, Project } from '../data/site';
import { CertCard, ProjectCard } from './Cards';
import { InteractiveTitle, useReveal } from '../hooks/useReveal';
import { useLanguage } from '../lib/catalog';

export function PageHeader({
  crumb,
  title,
  lead,
  children,
}: {
  crumb: string;
  title: string;
  lead: string;
  children?: React.ReactNode;
}) {
  const { lang } = useLanguage();
  return (
    <div className="ph">
      <p className="bc rv">
        <Link to="/">{lang === 'en' ? 'Home' : 'Beranda'}</Link> / {crumb}
      </p>
      <InteractiveTitle as="h1" text={title} />
      <p className="lead rv">{lead}</p>
      {children}
    </div>
  );
}

type Item = (Project | Cert) & { tags: { en: string; id: string }[]; skills?: string[] };

const nameOf = (x: Project | Cert, lang: Language) => ('title' in x ? (x.title[lang] || x.title.en) : x.name);

/**
 * Filterable gallery for projects: category chips + free-text search.
 */
export function FilterGallery<T extends Item>({ list, kind }: { list: T[]; kind: 'project' | 'cert' }) {
  const { lang } = useLanguage();
  const [q, setQ] = useState('');
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  /** Tag list in all languages, so the active filter survives a language switch. */
  const tagOptions = useMemo(() => {
    const make = (l: Language) => {
      const all = list.flatMap((x) =>
        'category' in x ? [x.category as string] : x.tags.map((tg) => tg[l] || tg.en),
      );
      return ['All', ...Array.from(new Set(all))];
    };
    return { en: make('en'), id: make('id'), zh: make('zh') };
  }, [list]);
  const tags = tagOptions[lang] || tagOptions.en;

  // Persist the chosen filter across language switches by remembering its slot.
  const [tagIdx, setTagIdx] = useState(0);
  const activeTag = tags[Math.min(tagIdx, tags.length - 1)] ?? 'All';

  const hits = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return list
      .map((x, i) => [x, i] as const)
      .filter(([x]) => {
        const tagOk =
          activeTag === 'All' ||
          ('category' in x ? x.category === activeTag : x.tags.some((tg) => tg[lang] === activeTag));
        if (!tagOk) return false;
        if (!qq) return true;
        return (
          nameOf(x, lang).toLowerCase().includes(qq) ||
          (x.skills ?? []).join(' ').toLowerCase().includes(qq) ||
          x.tags.map((tg) => tg[lang]).join(' ').toLowerCase().includes(qq)
        );
      });
  }, [list, activeTag, q, lang]);

  const scope = useReveal<HTMLDivElement>([hits.length, activeTag, q]);

  return (
    <section className="sec pgsec" ref={scope}>
      <div className="tools rv">
        <div className="flt" role="group" aria-label={t('Filter', 'Filter')}>
          {tags.map((tg, k) => (
            <button type="button" key={tg} aria-pressed={k === tagIdx} onClick={() => setTagIdx(k)}>
              {tg === 'All' ? t('All', 'Semua') : tg}
            </button>
          ))}
        </div>
        <label className="srch">
          <span className="sr">{t('Search', 'Cari')}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder={t('Search name or tech…', 'Cari nama atau teknologi…')}
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      <p className="cnt" aria-live="polite">
        {hits.length} {kind === 'project' ? t('projects', 'proyek') : t('certificates', 'sertifikat')}{' '}
        {t('shown', 'ditampilkan')}
      </p>
      {hits.length === 0 ? (
        <div className="empty">
          {t('Nothing matches that search. Try another keyword.', 'Tidak ada yang cocok. Coba kata kunci lain.')}
        </div>
      ) : (
        <div className="pg">
          {hits.map(([x, i]) => (
            <ProjectCard key={x.id} p={x as Project} i={i} extraClass="item-in in" />
          ))}
        </div>
      )}
    </section>
  );
}

/* =====================================================================
   CERTIFICATE GALLERY
   ---------------------------------------------------------------------
   31 credentials is too many to scan, so the page opens on a curated set
   ("the ones that prove something") and everything else is grouped by the
   KIND of credential, one click away. Search and the "verified only"
   toggle always operate on the whole catalogue, so nothing is hidden.
   ===================================================================== */

/** Id of the region toggled by the "show all / collapse" buttons. */
const ARCHIVE_ID = 'cert-archive-more';

const badgeIcon = (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);

function CertSection({
  id,
  title,
  desc,
  certs,
}: {
  id: string;
  title: string;
  desc?: string;
  certs: Cert[];
}) {
  if (!certs.length) return null;
  return (
    <div className="cgroup" id={`cert-${id}`}>
      <div className="cgroup-h">
        <h3>{title}</h3>
        <span>{certs.length}</span>
      </div>
      {desc && <p className="cgroup-d">{desc}</p>}
      <div className="cg">
        {certs.map((c) => (
          <CertCard key={c.id} c={c} i={certs.indexOf(c)} extraClass="item-in in" list={certs} />
        ))}
      </div>
    </div>
  );
}

export function CertificateGallery({
  all,
  featured,
  groups,
}: {
  all: Cert[];
  featured: Cert[];
  groups: CertGroup[];
}) {
  const { lang } = useLanguage();
  const t = (en: string, id: string) => (lang === 'en' ? en : id);
  const [expanded, setExpanded] = useState(false);
  const [q, setQ] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const searching = q.trim().length > 0 || verifiedOnly;

  /** Search + verification filter operate on the WHOLE catalogue. */
  const hits = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return all.filter((c) => {
      if (verifiedOnly && !c.verified) return false;
      if (!qq) return true;
      return (
        c.name.toLowerCase().includes(qq) ||
        c.issuer.en.toLowerCase().includes(qq) ||
        c.skills.join(' ').toLowerCase().includes(qq) ||
        c.kind[lang].toLowerCase().includes(qq)
      );
    });
  }, [all, q, verifiedOnly, lang]);

  const grouped = useMemo(() => {
    const known = new Set<string>();
    const sections = groups.map((g) => {
      const list = hits.filter((c) => g.ids.includes(c.id));
      list.forEach((c) => known.add(c.id));
      return { group: g, list };
    });
    const rest = hits.filter((c) => !known.has(c.id));
    return { sections, rest };
  }, [hits, groups]);

  const scope = useReveal<HTMLDivElement>([expanded, q, verifiedOnly]);

  return (
    <section className="sec pgsec" ref={scope}>
      <div className="tools rv">
        <label className="srch">
          <span className="sr">{t('Search', 'Cari')}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder={t('Search issuer, topic, or type…', 'Cari penerbit, topik, atau jenis…')}
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="flt" role="group" aria-label={t('Filters', 'Filter')}>
          <button type="button" aria-pressed={verifiedOnly} onClick={() => setVerifiedOnly((v) => !v)}>
            {t('Verified only', 'Hanya terverifikasi')}
          </button>
        </div>
      </div>

      <p className="cnt" aria-live="polite">
        {searching ? (
          <>
            {hits.length} {t('certificates shown', 'sertifikat ditampilkan')}
          </>
        ) : (
          <>
            {featured.length} {t('flagship credentials shown', 'kredensial unggulan ditampilkan')} ·{' '}
            {t(`${all.length} in the full record`, `${all.length} di arsip lengkap`)}
          </>
        )}
      </p>

      {hits.length === 0 ? (
        <div className="empty">{t('Nothing matches that search. Try another keyword.', 'Tidak ada yang cocok. Coba kata kunci lain.')}</div>
      ) : searching ? (
        <CertSection id="results" title={t('Results', 'Hasil')} certs={hits} />
      ) : (
        <>
          <CertSection id="flagship" title={t('Flagship credentials', 'Kredensial unggulan')} certs={featured} />

          {!expanded ? (
            <div className="cmore rv">
              <p>
                {t(
                  `The remaining ${all.length - featured.length} records are grouped by type — competitions, courses, events, language tests.`,
                  `${all.length - featured.length} catatan lainnya dikelompokkan per jenis — kompetisi, kursus, event, tes bahasa.`,
                )}
              </p>
              <button type="button" className="btn2" onClick={() => setExpanded(true)} aria-expanded={false} aria-controls={ARCHIVE_ID}>
                {t(`Show all ${all.length} certificates`, `Lihat semua ${all.length} sertifikat`)} →
              </button>
              <div className="cgroup-nav" id={ARCHIVE_ID} aria-hidden="false">
                {groups.map((g) => (
                  <span key={g.id}>
                    {g.label[lang]} · {g.ids.length}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div id="cert-archive">
              <nav className="cgroup-nav" aria-label={t('Jump to category', 'Lompat ke kategori')}>
                {groups.map((g) => (
                  <a key={g.id} href={`#cert-${g.id}`}>
                    {g.label[lang]} · {g.ids.length}
                  </a>
                ))}
              </nav>
              {grouped.sections.map(({ group, list }) => (
                <CertSection
                  key={group.id}
                  id={group.id}
                  title={group.label[lang]}
                  desc={group.desc[lang]}
                  certs={list}
                />
              ))}
              {grouped.rest.length > 0 && (
                <CertSection id="other" title={t('Other', 'Lainnya')} certs={grouped.rest} />
              )}
              <div className="cmore">
                <button type="button" className="btn2" onClick={() => setExpanded(false)} aria-expanded={false} aria-controls={ARCHIVE_ID}>
                  {t('Collapse back to the highlights', 'Kembali ke ringkasan')} ↑
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <p className="cnote">
        <span className="cnote-i" aria-hidden="true">
          {badgeIcon}
        </span>
        {t(
          '“Verified” means the credential carries a public verification link, or comes from a national certification body.',
          '“Terverifikasi” berarti kredensial punya tautan verifikasi publik, atau diterbitkan lembaga sertifikasi nasional.',
        )}
      </p>
    </section>
  );
}
