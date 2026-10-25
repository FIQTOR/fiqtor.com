import { useState } from 'react';
import { Link } from 'react-router-dom';
import { S, waLink } from '../data/site';
import { useLocalClock } from '../hooks/useReveal';
import { useLanguage } from '../lib/catalog';
import { Brand } from './Logo';

export function Footer() {
  const clock = useLocalClock(S.tz, S.tzLabel);
  const [year] = useState(() => new Date().getFullYear());
  const { lang } = useLanguage();
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  return (
    <footer className="ft">
      <div>
        <Link className="brand" to="/">
          <Brand size={28} mark />
        </Link>
        <p>{t(`${S.role} and founder of ${S.company.name}. Web, apps, AI.`, `${S.role} dan pendiri ${S.company.name}. Web, aplikasi, AI.`)}</p>
        {/* The résumés were already published as PDFs but had no link anywhere
            on the site — anyone who wanted one had to guess the URL. */}
        <div className="ft-dl">
          <span>{t('Résumé', 'CV')}</span>
          <a href={lang === 'en' ? S.resume.atsEn : S.resume.atsId} download>
            {t('Download (PDF)', 'Unduh (PDF)')}
          </a>
        </div>
      </div>
      <nav aria-label={t('Footer menu', 'Menu footer')}>
        <h2>{t('Menu', 'Menu')}</h2>
        <Link to="/">{t('Home', 'Beranda')}</Link>
        <Link to="/projects">{t('Projects', 'Proyek')}</Link>
        <Link to="/career">{t('Career', 'Karier')}</Link>
        <Link to="/certificates">{t('Certificates', 'Sertifikat')}</Link>
        <Link to="/contact">{t('Contact', 'Kontak')}</Link>
        <Link to="/linktree">Linktree</Link>
      </nav>
      <nav aria-label={t('Social media', 'Media sosial')}>
        <h2>{t('Social', 'Sosial')}</h2>
        <a href={waLink(lang)} target="_blank" rel="noopener">
          WhatsApp<span className="sr"> {t('(new tab)', '(tab baru)')}</span>
        </a>
        <a href={S.social.github} target="_blank" rel="noopener">
          GitHub<span className="sr"> {t('(new tab)', '(tab baru)')}</span>
        </a>
        <a href={S.social.instagram} target="_blank" rel="noopener">
          Instagram<span className="sr"> {t('(new tab)', '(tab baru)')}</span>
        </a>
        <a href={S.social.tiktok} target="_blank" rel="noopener">
          TikTok<span className="sr"> {t('(new tab)', '(tab baru)')}</span>
        </a>
        <a href={S.social.linkedin} target="_blank" rel="noopener">
          LinkedIn<span className="sr"> {t('(new tab)', '(tab baru)')}</span>
        </a>
      </nav>
      <div className="copy">
        <span>
          © {year} {S.name}. {t('All rights reserved.', 'Hak cipta dilindungi.')}
        </span>
        <span className="clk">
          <i />
          <span>{clock}</span>
        </span>
        <a
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {t('Back to top ↑', 'Kembali ke atas ↑')}
        </a>
      </div>
    </footer>
  );
}
