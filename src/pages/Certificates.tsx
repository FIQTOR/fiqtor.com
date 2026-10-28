import { S, waLink } from '../data/site';
import { CertificateGallery, PageHeader } from '../components/FilterGallery';
import { useReveal } from '../hooks/useReveal';
import { useLanguage } from '../lib/catalog';

/**
 * Certificate page. 31 raw credentials would make an endless grid, so the page
 * presents a curated flagship set first and groups the rest by credential kind
 * (competitions, national certification, courses, events, language). See
 * `src/data/certGroups.ts` for the taxonomy and `CertificateGallery` for the UI.
 */
export default function Certificates() {
  const ref = useReveal();
  const { lang } = useLanguage();
  const t = (en: string, id: string, zh?: string) => (lang === 'zh' ? zh || en : lang === 'en' ? en : id);
  const total = S.certs.reduce((n, c) => n + c.count, 0);

  return (
    <div ref={ref}>
      <PageHeader
        crumb={t('Certificates', 'Sertifikat', '专业证书')}
        title={t('Proof of learning.', 'Bukti belajar.', '持续学习与专业实力印证。')}
        lead={t(
          `${total} credentials — national competency certificates, competition results, and course completions. The ${S.certsFeatured.length} that prove the most are shown first; everything else is grouped by type so you can scan it in seconds.`,
          `${total} kredensial — sertifikat kompetensi nasional, hasil kompetisi, dan penyelesaian kursus. ${S.certsFeatured.length} yang paling membuktikan ditampilkan lebih dulu; sisanya dikelompokkan per jenis agar bisa dipindai dalam hitungan detik.`,
          `共计 ${total} 项官方认证 — 包含国家级职业技能认证、权威竞赛奖项及专业课程结业证书。精选最具含金量的 ${S.certsFeatured.length} 份优先展示，其余按类型分类归档。`,
        )}
      >
        <p className="ph-cta rv">
          <a className="cta-ghost" href={waLink(lang)} target="_blank" rel="noopener">
            {t('Want this built for you?', 'Ingin ini dikerjakan untuk Anda?', '想打造类似的高标准项目？')}
            <span className="sr"> {t('(opens WhatsApp)', '(membuka WhatsApp)', '(打开 WhatsApp)')}</span>
          </a>
        </p>
      </PageHeader>
      <CertificateGallery all={S.certs} featured={S.certsFeatured} groups={S.certGroups} />
    </div>
  );
}
