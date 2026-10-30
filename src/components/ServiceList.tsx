import { S, waLink } from '../data/site';
import { useLanguage } from '../lib/catalog';
import { useCurrency, SUPPORTED_CURRENCIES, type CurrencyCode } from '../lib/currency';

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
  const { currency, setCurrency, formatPrice } = useCurrency();
  const t = (en: string, idn: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : idn);

  return (
    <div className="svcv rv" id={anchor}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <label htmlFor="svc-currency-select" style={{ fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 600 }}>
          {t('Currency / Country:', 'Mata Uang / Negara:', '货币 / 地区结算:')}
        </label>
        <select
          id="svc-currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
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

      {S.services.map((s) => {
        const displayPrice = s.amountIDR ? formatPrice(s.amountIDR, s.periodSuffix) : (s.from[lang] || s.from.en);
        return (
          <section className="svc" key={s.slug} aria-labelledby={`svc-${s.slug}`}>
            <h3 id={`svc-${s.slug}`}>{s.title[lang] || s.title.en}</h3>
            <p className="svc-desc">{s.desc[lang] || s.desc.en}</p>
            <p className="svc-meta">{s.meta[lang] || s.meta.en}</p>
            <div className="svc-cta-r">
              <b>{displayPrice}</b>
              <a href={waLink(lang, s.title[lang] || s.title.en)} target="_blank" rel="noopener">
                {t('Consult this service', 'Konsultasi layanan ini', '咨询此项服务')} →
              </a>
            </div>
          </section>
        );
      })}
    </div>
  );
}
