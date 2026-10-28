import { S, waLink } from '../data/site';
import { FilterGallery, PageHeader } from '../components/FilterGallery';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../lib/catalog';

export default function Projects() {
  const ref = useReveal();
  const { lang } = useLanguage();
  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);

  return (
    <div ref={ref}>
      <PageHeader
        crumb={t('Projects', 'Proyek', '项目')}
        title={t('Selected work.', 'Karya pilihan.', '精选项目成果。')}
        lead={t(
          `Web apps, AI integrations, business systems, e-commerce, and interactive 3D — ${S.projects.length} builds with screenshots and the reasoning behind them.`,
          `Aplikasi web, integrasi AI, sistem bisnis, e-commerce, dan 3D interaktif — ${S.projects.length} karya lengkap dengan cuplikan dan alasan di baliknya.`,
          `Web 应用、AI 深度集成、企业系统、电商与交互式 3D — 累计 ${S.projects.length} 个完整项目，附带真实截图与技术架构解析。`,
        )}
      >
        {/* Most visitors land here from search. Without this the page is a
            dead end: they read the work and leave. */}
        <p className="ph-cta rv">
          <a className="cta-ghost" href={waLink(lang)} target="_blank" rel="noopener">
            {t('Not sure where to start? Ask.', 'Bingung mulai dari mana? Tanya saja.', '不知道从何开始？欢迎随时咨询。')}
            <span className="sr"> {t('(opens WhatsApp)', '(membuka WhatsApp)', '(打开 WhatsApp)')}</span>
          </a>
        </p>
      </PageHeader>
      <FilterGallery list={S.projects} kind="project" />
    </div>
  );
}
