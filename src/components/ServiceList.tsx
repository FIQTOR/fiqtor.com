import { S, waLink } from '../data/site';
import { useLanguage } from '../lib/catalog';

/**
 * The long, benefit-focused description of each service.
 *
 * The homepage used to carry these inside the service cards. It now shows a
 * scannable price table instead, so the prose lives here — on /contact, right
 * above the form, where a visitor has already decided they are interested and
 * reads for reassurance rather than for comparison.
 *
 * Each row links to the form (`#contact-form`) so the description is never a dead
 * end.
 */
export function ServiceList({ anchor }: { anchor?: string }) {
  const { lang } = useLanguage();
  const t = (en: string, idn: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : idn);

  return (
    <div className="svcv rv" id={anchor}>
      {S.services.map((s) => (
        <section className="svc" key={s.slug} aria-labelledby={`svc-${s.slug}`}>
          <h3 id={`svc-${s.slug}`}>{s.title[lang] || s.title.en}</h3>
          <p className="svc-desc">{s.desc[lang] || s.desc.en}</p>
          <p className="svc-meta">{s.meta[lang] || s.meta.en}</p>
          <div className="svc-cta-r">
            <b>{s.from[lang] || s.from.en}</b>
            <a href={waLink(lang, s.title[lang] || s.title.en)} target="_blank" rel="noopener">
              {t('Consult this service', 'Konsultasi layanan ini', '咨询此项服务')} →
            </a>
          </div>
        </section>
      ))}
    </div>
  );
}
