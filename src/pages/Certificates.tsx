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
  const total = S.certs.reduce((n, c) => n + c.count, 0);

  return (
    <div ref={ref}>
      <PageHeader
        crumb={lang === 'en' ? 'Certificates' : 'Sertifikat'}
        title={lang === 'en' ? 'Proof of learning.' : 'Bukti belajar.'}
        lead={
          lang === 'en'
            ? `${total} credentials — national competency certificates, competition results, and course completions. The ${S.certsFeatured.length} that prove the most are shown first; everything else is grouped by type so you can scan it in seconds.`
            : `${total} kredensial — sertifikat kompetensi nasional, hasil kompetisi, dan penyelesaian kursus. ${S.certsFeatured.length} yang paling membuktikan ditampilkan lebih dulu; sisanya dikelompokkan per jenis agar bisa dipindai dalam hitungan detik.`
        }
      >
        <p className="ph-cta rv">
          <a className="cta-ghost" href={waLink(lang)} target="_blank" rel="noopener">
            {lang === 'en' ? 'Want this built for you?' : 'Ingin ini dikerjakan untuk Anda?'}
            <span className="sr"> {lang === 'en' ? '(opens WhatsApp)' : '(membuka WhatsApp)'}</span>
          </a>
        </p>
      </PageHeader>
      <CertificateGallery all={S.certs} featured={S.certsFeatured} groups={S.certGroups} />
    </div>
  );
}
