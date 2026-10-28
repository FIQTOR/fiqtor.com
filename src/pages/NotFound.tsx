import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { S, waLink } from '../data/site';
import { useLanguage } from '../lib/catalog';
import { Logo } from '../components/Logo';
import { InteractiveTitle } from '../hooks/useReveal';

/**
 * 404 — a designed dead end, not a dead end.
 *
 * Instead of apologising into the void it: shows the URL that failed, offers
 * the five real destinations, a short search over projects/certificates, the
 * four most recent project cards, and the fastest way to reach a human
 * (WhatsApp). `<Seo />` marks every unknown path `noindex,nofollow`.
 */
const LINKS: Array<{ to: string; en: string; id: string; note: { en: string; id: string } }> = [
  { to: '/', en: 'Home', id: 'Beranda', note: { en: 'The full story', id: 'Cerita lengkap' } },
  { to: '/projects', en: 'Projects', id: 'Proyek', note: { en: `${S.projects.length} shipped builds`, id: `${S.projects.length} karya rilis` } },
  { to: '/certificates', en: 'Certificates', id: 'Sertifikat', note: { en: `${S.certs.length} credentials`, id: `${S.certs.length} kredensial` } },
  { to: '/career', en: 'Career', id: 'Karier', note: { en: 'Timeline & roles', id: 'Linimasa & peran' } },
  { to: '/contact', en: 'Contact', id: 'Kontak', note: { en: 'Replies within 24h', id: 'Dibalas < 24 jam' } },
  { to: '/linktree', en: 'Linktree', id: 'Linktree', note: { en: 'Every profile', id: 'Semua profil' } },
];

export default function NotFound() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  const needle = q.trim().toLowerCase();
  const projectHits = needle
    ? S.projects.filter((p) => (p.title.en + ' ' + p.title.id + ' ' + p.tags.map((x) => x.en).join(' ')).toLowerCase().includes(needle)).slice(0, 4)
    : S.featuredProjects.slice(0, 4);
  const certHits = needle
    ? S.certs.filter((c) => (c.name + ' ' + c.issuer.en + ' ' + c.tags.map((x) => x.en).join(' ')).toLowerCase().includes(needle)).slice(0, 3)
    : [];

  return (
    <div className="nf">
      <section className="nf-hero">
        <div className="nf-mark" aria-hidden="true">
          <Logo size={120} />
        </div>
        <p className="nf-code">
          <span>404</span>
          {t('Page not found', 'Halaman tidak ditemukan')}
        </p>
        <InteractiveTitle
          as="h1"
          text={t('This path leads nowhere.', 'Jalur ini tidak ada.')}
          className="nf-title"
        />
        <p className="nf-lead">
          {t(
            'The link is broken, or the page moved. Nothing is lost — pick a destination below, or search the archive.',
            'Tautannya rusak, atau halamannya sudah pindah. Tidak ada yang hilang — pilih tujuan di bawah, atau cari di arsip.',
          )}
        </p>
        {pathname !== '/' && (
          <p className="nf-url">
            <span>{t('Requested URL', 'URL yang diminta')}</span>
            <code>{pathname}</code>
          </p>
        )}

        <div className="nf-actions">
          <Link className="cta" to="/">
            {t('Back to home', 'Kembali ke beranda')}
          </Link>
          <a className="btn2" href={waLink(lang)} target="_blank" rel="noopener">
            {t('Report it on WhatsApp', 'Laporkan via WhatsApp')}
          </a>
        </div>

        <label className="nf-search">
          <span className="sr">{t('Search projects and certificates', 'Cari proyek dan sertifikat')}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('Search projects, tech, or certificates…', 'Cari proyek, teknologi, atau sertifikat…')}
            autoComplete="off"
          />
        </label>
      </section>

      <section className="nf-grid" aria-label={t('Main pages', 'Halaman utama')}>
        {LINKS.map((l, i) => (
          <Link key={l.to} to={l.to} className="nf-card" style={{ ['--i' as string]: i }}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <b>{(l as Record<string, any>)[lang] || l.en}</b>
            <small>{(l.note as Record<string, string>)[lang] || l.note.en}</small>
          </Link>
        ))}
      </section>

      <section className="nf-more">
        <h2 className="nf-h">
          {needle
            ? t(`Matches for “${q.trim()}”`, `Hasil untuk “${q.trim()}”`)
            : t('Popular work', 'Karya populer')}
        </h2>
        {projectHits.length === 0 && certHits.length === 0 && (
          <p className="nf-empty">
            {t('Nothing matches that search. Try a tech name, a project, or a certificate.', 'Tidak ada yang cocok. Coba nama teknologi, proyek, atau sertifikat.')}
          </p>
        )}
        {projectHits.length > 0 && (
          <ul className="nf-list">
            {projectHits.map((p) => (
              <li key={p.id}>
                <Link to={`/projects#${p.id}`}>
                  <span>{p.category}</span>
                  <b>{p.title[lang]}</b>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {certHits.length > 0 && (
          <ul className="nf-list">
            {certHits.map((c) => (
              <li key={c.id}>
                <Link to={`/certificates#${c.id}`}>
                  <span>{c.issuer[lang]}</span>
                  <b>{c.name}</b>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="nf-foot">
          {t('Still stuck?', 'Masih buntu?')}{' '}
          <a href={`mailto:${S.email}`}>{S.email}</a> · <a href={waLink(lang)}>WhatsApp +{S.wa}</a>
        </p>
      </section>
    </div>
  );
}
