import { S, waLink } from '../data/site';
import { FilterGallery, PageHeader } from '../components/FilterGallery';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../lib/catalog';

export default function Projects() {
  const ref = useReveal();
  const { lang } = useLanguage();

  return (
    <div ref={ref}>
      <PageHeader
        crumb={lang === 'en' ? 'Projects' : 'Proyek'}
        title={lang === 'en' ? 'Selected work.' : 'Karya pilihan.'}
        lead={
          lang === 'en'
            ? `Web apps, AI integrations, business systems, e-commerce, and interactive 3D — ${S.projects.length} builds with screenshots and the reasoning behind them.`
            : `Aplikasi web, integrasi AI, sistem bisnis, e-commerce, dan 3D interaktif — ${S.projects.length} karya lengkap dengan cuplikan dan alasan di baliknya.`
        }
      >
        {/* Most visitors land here from search. Without this the page is a
            dead end: they read the work and leave. */}
        <p className="ph-cta rv">
          <a className="cta-ghost" href={waLink(lang)} target="_blank" rel="noopener">
            {lang === 'en' ? 'Not sure where to start? Ask.' : 'Bingung mulai dari mana? Tanya saja.'}
            <span className="sr"> {lang === 'en' ? '(opens WhatsApp)' : '(membuka WhatsApp)'}</span>
          </a>
        </p>
      </PageHeader>
      <FilterGallery list={S.projects} kind="project" />
    </div>
  );
}
