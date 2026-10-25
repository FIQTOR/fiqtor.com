import type { Cert, Project } from '../data/site';
import { S } from '../data/site';
import { pad, formatPublished } from '../lib/utils';
import { ICONS } from '../lib/utils.tsx';
import { useCatalog, useLanguage } from '../lib/catalog';

export function Chip({ text }: { text: string }) {
  return <span className="chip">{text}</span>;
}

export function ProjectCard({
  p,
  i,
  big,
  extraClass = '',
}: {
  p: Project;
  i: number;
  big?: boolean;
  extraClass?: string;
}) {
  const { openFromCard } = useCatalog();
  const { lang } = useLanguage();

  // The href is a real route: if the modal code is slow or broken the link
  // still lands on /projects#slug, which the catalog deep-link handler opens.
  return (
    <a
      className={`card pc rv${big ? ' pc-big' : ''} ${extraClass}`}
      href={`/projects#${p.id}`}
      data-open="project"
      data-cur={lang === 'en' ? 'View' : 'Lihat'}
      onClick={(e) => {
        e.preventDefault();
        openFromCard('project', i, p.id);
      }}
    >
      <div className="pc-img">
        <img loading="lazy" decoding="async" src={p.thumb} alt={`${p.title[lang]} — screenshot`} width={1600} height={900} />
        <span className="pc-n">
          {pad(i + 1)} · {p.category}
        </span>
      </div>
      <div className="pc-b">
        <span className="meta">{p.role[lang]}</span>
        <h3>{p.title[lang]}</h3>
        <p>{firstSentence(p.desc[lang])}</p>
        <div className="chips">
          {p.tags.slice(0, 4).map((t) => (
            <Chip key={t.en} text={t[lang]} />
          ))}
        </div>
      </div>
      <span className="go" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS.arrow }} />
    </a>
  );
}

export function CertCard({
  c,
  i,
  extraClass = '',
  list,
}: {
  c: Cert;
  i: number;
  extraClass?: string;
  /** The list being rendered; the modal steps through this, not the raw array. */
  list?: Cert[];
}) {
  const { openFromCard } = useCatalog();
  const { lang } = useLanguage();

  // Same rationale as ProjectCard: a routable href, not a bare "#id" hash.
  return (
    <a
      className={`cert rv ${extraClass}`}
      href={`/certificates#${c.id}`}
      data-open="cert"
      data-cur={lang === 'en' ? 'View' : 'Lihat'}
      onClick={(e) => {
        e.preventDefault();
        openFromCard('cert', i, c.id, list ?? S.certs);
      }}
    >
      <div className="ci">
        <span className="ci-kind">{c.kind[lang]}</span>
        {/* A bare "×6" was unreadable: it now states what the number counts
            (courses inside this bundle) and is exposed to assistive tech. */}
        {c.count > 1 && (
          <span
            className="ci-count"
            title={
              lang === 'en'
                ? `${c.count} certificates bundled in this entry`
                : `${c.count} sertifikat digabung dalam entri ini`
            }
          >
            {c.count} {lang === 'en' ? 'certs' : 'sertifikat'}
            <span className="sr">
              {lang === 'en' ? ' bundled in this entry' : ' digabung dalam entri ini'}
            </span>
          </span>
        )}
        <img loading="lazy" decoding="async" src={c.img} alt={`Certificate — ${c.name} (${c.issuer.en})`} width={1200} height={900} />
      </div>
      <div className="cb">
        <span className="iss">
          {c.issuer[lang]}
          {c.verified && (
            <span className="vf" title={lang === 'en' ? 'Verifiable with the issuer' : 'Dapat diverifikasi ke penerbit'}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.5 12.5l5 5 10-11" />
              </svg>
              {lang === 'en' ? 'Verified' : 'Terverifikasi'}
            </span>
          )}
        </span>
        <h4>{c.name}</h4>
        <div className="chips">
          {c.tags.slice(0, 2).map((t) => (
            <Chip key={t.en} text={t[lang]} />
          ))}
        </div>
        <span className="yr">
          <span>{formatPublished(c.date, lang)}</span>
          {/* The arrow promises "this opens something"; a bundle with no
              verification link has nothing to open, so it is not shown. */}
          {c.url && <span aria-hidden="true">↗</span>}
        </span>
      </div>
    </a>
  );
}

/** Cards show only the first sentence of the (long) project description. */
function firstSentence(text: string): string {
  const m = text.match(/^(.+?[.!?])(\s|$)/);
  const out = m ? m[1] : text;
  return out.length > 190 ? out.slice(0, 187).trimEnd() + '…' : out;
}
