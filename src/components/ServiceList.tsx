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
  const t = (en: string, idn: string) => (lang === 'en' ? en : idn);

  return (
    <div className="svcv rv" id={anchor}>
      {S.services.map((s) => (
        <section className="svc" key={s.slug} aria-labelledby={`svc-${s.slug}`}>
          <h3 id={`svc-${s.slug}`}>{s.title[lang]}</h3>
          <p className="svc-desc">{s.desc[lang]}</p>
          <p className="svc-meta">{s.meta[lang]}</p>
          <div className="svc-foot">
            <b>{s.from[lang]}</b>
            <a href="#contact-form">{t('Describe your project', 'Ceritakan proyek Anda')} ↓</a>
            <a href={waLink(lang, s.title[lang])} target="_blank" rel="noopener">
              {t('Ask on WhatsApp', 'Tanya via WhatsApp')}
              <span className="sr"> {t('(opens in a new tab)', '(tab baru)')}</span>
            </a>
          </div>
        </section>
      ))}
    </div>
  );
}
