import { Link, useParams } from 'react-router-dom';
import { S, waLink } from '../data/site';
import { useLanguage } from '../lib/catalog';
import { useReveal } from '../hooks/useReveal';
import { Seo } from '../components/Seo';
import NotFound from './NotFound';

/**
 * Case-study page — `/projects/:slug`.
 *
 * Driven entirely by a project's existing entry in `S.projects`. No copy is
 * authored here: `desc` already carries several hundred words of technical
 * detail and `gallery` is populated for every project, so the page is a
 * faithful expansion of the data rather than a thin stub.
 *
 * The slug is `p.id`, which is the same value the gallery cards link to
 * (`/projects#<id>`) and the same one the sitemap lists — one identifier for
 * the project in all three places.
 *
 * Rendered inside `<Layout>`, so Navbar/Footer/providers come for free. The
 * detail modal is mounted there too, but it only opens from a `useCatalog()`
 * call, and nothing here calls one.
 */
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const ref = useReveal();
  const { lang } = useLanguage();
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  const index = S.projects.findIndex((p) => p.id === slug);
  const project = index >= 0 ? S.projects[index] : undefined;

  // An unknown slug is a real 404, not a redirect: the build only emits shells
  // for projects that exist, so anything else is a stale or mistyped URL.
  if (!project) return <NotFound />;

  const prev = index > 0 ? S.projects[index - 1] : undefined;
  const next = index < S.projects.length - 1 ? S.projects[index + 1] : undefined;
  const cover = project.gallery[0]?.src ?? project.thumb;
  // The first gallery image is the cover and is already shown above it.
  const shots = project.gallery.slice(1);

  return (
    <div ref={ref} className="pd">
      <Seo />

      <div className="ph">
        <p className="bc rv">
          <Link to="/">{t('Home', 'Beranda')}</Link> / <Link to="/projects">{t('Projects', 'Proyek')}</Link> /{' '}
          {project.category}
        </p>
        <h1>{project.title[lang]}</h1>
        <p className="lead rv">{project.desc[lang]}</p>

        <div className="pd-meta rv">
          <span className="chip">{project.category}</span>
          <span className="chip">{project.year}</span>
          <span className="chip">{project.role[lang]}</span>
        </div>

        <div className="ph-cta rv pd-actions">
          {project.url && (
            <a className="btn2" href={project.url} target="_blank" rel="noopener">
              {t('View live', 'Lihat langsung')}
              <span className="sr"> {t('(opens in a new tab)', '(membuka tab baru)')}</span>
            </a>
          )}
          <a className="cta-ghost" href={waLink(lang, project.title[lang])} target="_blank" rel="noopener">
            {t('Want something like this?', 'Ingin yang seperti ini?')}
            <span className="sr"> {t('(opens WhatsApp)', '(membuka WhatsApp)')}</span>
          </a>
        </div>
      </div>

      <section className="sec pd-body" aria-label={t('Screenshots', 'Cuplikan layar')}>
        <img
          className="pd-cover rv"
          src={cover}
          alt={`${project.title[lang]} — ${t('screenshot', 'cuplikan')}`}
          width={1600}
          height={900}
          loading="eager"
          decoding="async"
        />

        {shots.length > 0 && (
          <ul className="pd-shots">
            {shots.map((g) => (
              <li key={g.src} className="rv">
                <figure>
                  <img
                    src={g.src}
                    alt={`${project.title[lang]} — ${g.caption[lang]}`}
                    width={1600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>{g.caption[lang]}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="sec pd-stack" aria-labelledby="pd-stack-h">
        <h2 id="pd-stack-h" className="rv">
          {t('Built with', 'Dibangun dengan')}
        </h2>
        <ul className="chips rv">
          {project.skills.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>

        {project.tags.length > 0 && (
          <>
            <h2 className="rv" style={{ marginTop: '2rem' }}>
              {t('What it does', 'Yang dikerjakan')}
            </h2>
            <ul className="chips rv">
              {project.tags.map((tag, i) => (
                <li key={i} className="chip">
                  {tag[lang]}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <nav className="pd-nav" aria-label={t('More projects', 'Proyek lain')}>
        {prev ? (
          <Link to={`/projects/${prev.id}`} className="pd-nav-link">
            <small>{t('Previous', 'Sebelumnya')}</small>
            <span>{prev.title[lang]}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/projects/${next.id}`} className="pd-nav-link pd-nav-next">
            <small>{t('Next', 'Berikutnya')}</small>
            <span>{next.title[lang]}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <p className="rv" style={{ marginTop: '2rem' }}>
        <Link className="btn2" to="/projects">
          {t(`All ${S.projects.length} projects`, `Semua ${S.projects.length} proyek`)} →
        </Link>
      </p>
    </div>
  );
}
