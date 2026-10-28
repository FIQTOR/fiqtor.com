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
const LINKS: Array<{ to: string; en: string; id: string; zh: string; note: { en: string; id: string; zh: string } }> = [
  { to: '/', en: 'Home', id: 'Beranda', zh: '首页', note: { en: 'The full story', id: 'Cerita lengkap', zh: '完整故事' } },
  { to: '/projects', en: 'Projects', id: 'Proyek', zh: '项目', note: { en: `${S.projects.length} shipped builds`, id: `${S.projects.length} karya rilis`, zh: `${S.projects.length} 个已交付` } },
  { to: '/certificates', en: 'Certificates', id: 'Sertifikat', zh: '证书', note: { en: `${S.certs.length} credentials`, id: `${S.certs.length} kredensial`, zh: `${S.certs.length} 个证书` } },
  { to: '/career', en: 'Career', id: 'Karier', zh: '经历', note: { en: 'Timeline & roles', id: 'Linimasa & peran', zh: '时间线与角色' } },
  { to: '/contact', en: 'Contact', id: 'Kontak', zh: '联系', note: { en: 'Replies within 24h', id: 'Dibalas < 24 jam', zh: '24小时内回复' } },
  { to: '/linktree', en: 'Linktree', id: 'Linktree', zh: '链接树', note: { en: 'Every profile', id: 'Semua profil', zh: '所有主页' } },
];

export default function NotFound() {
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');
  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);

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
          {t('Page not found', 'Halaman tidak ditemukan', '页面未找到')}
        </p>
        <InteractiveTitle
          as="h1"
          text={t('This path leads nowhere.', 'Jalur ini tidak ada.', '此路径无内容.')}
          className="nf-title"
        />
        <p className="nf-lead">
          {t(
            'The link is broken, or the page moved. Nothing is lost — pick a destination below, or search the archive.',
            'Tautannya rusak, atau halamannya sudah pindah. Tidak ada yang hilang — pilih tujuan di bawah, atau cari di arsip.',
            '链接已失效, 或页面已移动. 没有任何丢失 — 选择下方目的地, 或搜索档案.',
          )}
        </p>
        {pathname !== '/' && (
          <p className="nf-url">
            <span>{t('Requested URL', 'URL yang diminta', '请求的 URL')}</span>
            <code>{pathname}</code>
          </p>
        )}

        <div className="nf-actions">
          <Link className="cta" to="/">
            {t('Back to home', 'Kembali ke beranda', '返回首页')}
          </Link>
          <a className="btn2" href={waLink(lang)} target="_blank" rel="noopener">
            {t('Report it on WhatsApp', 'Laporkan via WhatsApp', '在 WhatsApp 上报告')}
          </a>
        </div>

        <label className="nf-search">
          <span className="sr">{t('Search projects and certificates', 'Cari proyek dan sertifikat', '搜索项目和证书')}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('Search projects, tech, or certificates…', 'Cari proyek, teknologi, atau sertifikat…', '搜索项目, 技术, 或证书…')}
            autoComplete="off"
          />
        </label>
      </section>

      <section className="nf-grid" aria-label={t('Main pages', 'Halaman utama', '主要页面')}>
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
            ? t(`Matches for "${q.trim()}"`, `Hasil untuk "${q.trim()}"`, `"${q.trim()}" 的匹配结果`)
            : t('Popular work', 'Karya populer', '热门作品')}
        </h2>
        {projectHits.length === 0 && certHits.length === 0 && (
          <p className="nf-empty">
            {t('Nothing matches that search. Try a tech name, a project, or a certificate.', 'Tidak ada yang cocok. Coba nama teknologi, proyek, atau sertifikat.', '无匹配结果. 请尝试技术名称, 项目, 或证书.')}
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
          {t('Still stuck?', 'Masih buntu?', '仍然卡住?')}{' '}
          <a href={`mailto:${S.email}`}>{S.email}</a> · <a href={waLink(lang)}>WhatsApp +{S.wa}</a>
        </p>
      </section>
    </div>
  );
}
