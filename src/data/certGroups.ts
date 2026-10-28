import type { CertGroup } from './site';

/**
 * Certificate taxonomy — the fix for "the certificate page is too long".
 *
 * 31 credentials are far more than a visitor can scan, so the page shows
 * (1) the *flagship* set by default, (2) everything grouped by KIND of
 * credential, and (3) repeated quiz completions from the same issuer merged
 * into one entry. Every certificate keeps its own detail view.
 *
 * Order of `groups` is the display order; `ids` map to the slug of the raw
 * certificate title (see `certs[].id` in site.ts).
 */

/** Credentials shown first, in this order, before "show all" is pressed. */
export const FEATURED_CERTS = [
  'bnsp-national-professional-certification-certified-junior-we',
  'seameo-qitep-in-science-seaqis-web-cloud-engineering-champio',
  'lks-smk-jombang-regency-xxxii-web-technologies-champion-1st-',
  'lks-smk-east-java-xxxii-web-technologies-4th-place-rank-4-of',
  'freecodecamp-responsive-web-design-certification',
  'freecodecamp-front-end-development-libraries-certification',
  'dicoding-x-idcamp-ai-fundamentals',
  'google-developer-groups-on-campus-its-study-jam-web-developm',
  'gema-foundation-storytelling-agenda-toeic-test-score-640',
];

/**
 * Issuers whose per-topic quizzes are collapsed into a single card, because a
 * visitor reading "W3Docs — HTML5" / "CSS3" / "JS" / "PHP" / "TS" / "React"
 * learns nothing beyond "the fundamentals are covered".
 */
export const MERGED_CERT_GROUPS: Array<{
  id: string;
  name: string;
  ids: string[];
}> = [
  {
    id: 'merged-w3docs',
    name: 'W3Docs — 6 fundamental quizzes (score 100/100 each)',
    ids: [
      'w3docs-html5-basic-score-100',
      'w3docs-css3-basic-score-100',
      'w3docs-javascript-basic-score-100',
      'w3docs-php-basic-score-100',
      'w3docs-typescript-basic-score-100',
      'w3docs-react-basic-score-100',
    ],
  },
];

export const CERT_GROUPS: CertGroup[] = [
  {
    id: 'competition',
    label: { en: 'Competitions', id: 'Kompetisi', zh: '竞赛奖项' },
    desc: {
      en: 'Ranked results in provincial and national competitions — the strongest single signal of hands-on skill, because they are judged against other people.',
      id: 'Hasil peringkat di kompetisi provinsi dan nasional — sinyal keterampilan paling kuat, karena dinilai bersaing dengan orang lain.',
      zh: '省市级与国家级赛事的获奖战绩 — 实战技术水平最强有力的客观证明，均在严格评审与激烈竞争中取得。',
    },
    ids: [
      'seameo-qitep-in-science-seaqis-web-cloud-engineering-champio',
      'lks-smk-east-java-xxxii-web-technologies-4th-place-rank-4-of',
      'lks-smk-jombang-regency-xxxii-web-technologies-champion-1st-',
      'airofest-by-airnology-2-0-universitas-airlangga-national-cod',
      'hmjti-polije-national-web-programming-competition-native',
    ],
  },
  {
    id: 'national',
    label: { en: 'National certification & internship', id: 'Sertifikasi nasional & magang', zh: '国家资质认证与行业实习' },
    desc: {
      en: 'Formally assessed credentials: the BNSP national competency certificate (assessed by an independent certification body) and a distinction-graded industrial internship.',
      id: 'Kredensial yang dinilai formal: sertifikat kompetensi nasional BNSP (diuji lembaga sertifikasi independen) dan magang industri dengan predikat pujian.',
      zh: '国家官方认证能力资质：印度尼西亚国家专业认证委员会 (BNSP) 权威测评证书，以及以优异成绩（Distinction）毕业的企业工程实习认证。',
    },
    ids: [
      'bnsp-national-professional-certification-certified-junior-we',
      'seameo-qitep-in-science-internship-praktik-kerja-lapangan-di',
    ],
  },
  {
    id: 'course',
    label: { en: 'Course completions', id: 'Penyelesaian kursus', zh: '专业进修与课程结业' },
    desc: {
      en: 'Structured courses with graded final projects, from freeCodeCamp, Dicoding, and Dilesin.',
      id: 'Kursus terstruktur dengan proyek akhir yang dinilai, dari freeCodeCamp, Dicoding, dan Dilesin.',
      zh: '包含严格期末项目考核的系统化课程认证，涵盖 freeCodeCamp、Dicoding 与 Dilesin 等权威技术平台。',
    },
    ids: [
      'freecodecamp-responsive-web-design-certification',
      'freecodecamp-front-end-development-libraries-certification',
      'dicoding-x-idcamp-ai-fundamentals',
      'dicoding-x-idcamp-front-end-web-development-for-beginners',
      'dicoding-x-dbs-foundation-javascript-programming-basics',
      'dicoding-x-dbs-foundation-web-programming-basics',
      'dicoding-x-dbs-foundation-financial-literacy-101',
      'dilesin-id-c-programming-fundamentals-2-certified',
      'merged-w3docs',
    ],
  },
  {
    id: 'event',
    label: { en: 'Events & webinars', id: 'Event & webinar', zh: '技术会议与研讨会' },
    desc: {
      en: 'Attendance and participation records. Useful context, but not proof of a skill on their own.',
      id: 'Bukti kehadiran dan partisipasi. Konteks yang berguna, tetapi bukan bukti keterampilan dengan sendirinya.',
      zh: '技术峰会、学术讲座与前沿专题研讨会参与证明，拓宽技术视野与跨领域工程认知。',
    },
    ids: [
      'google-developer-groups-on-campus-its-study-jam-web-developm',
      'politeknik-elektronika-negeri-surabaya-pens-webinar-sql-quer',
      'hmif-upn-veteran-east-java-sonic-2025-sound-of-informatics-p',
      'future-entrepreneur-summit-surabaya-2025-public-speaking-tra',
      'future-entrepreneur-summit-surabaya-2025-future-national-com',
      'future-entrepreneur-summit-surabaya-2025-international-youth',
      'future-entrepreneur-summit-surabaya-2025-improvement-softski',
      'future-entrepreneur-summit-surabaya-2025-participation-certi',
    ],
  },
  {
    id: 'language',
    label: { en: 'Language & soft skills', id: 'Bahasa & soft skill', zh: '语言能力与综合素养' },
    desc: {
      en: 'English proficiency (TOEIC 640) and public-speaking training.',
      id: 'Kemampuan bahasa Inggris (TOEIC 640) dan pelatihan public speaking.',
      zh: '国际通用商务英语水平（TOEIC 640 分）与公众演讲、跨文化技术协作能力认证。',
    },
    ids: ['gema-foundation-storytelling-agenda-toeic-test-score-640'],
  },
];
