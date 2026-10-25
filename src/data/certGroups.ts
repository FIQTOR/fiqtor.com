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
    label: { en: 'Competitions', id: 'Kompetisi' },
    desc: {
      en: 'Ranked results in provincial and national competitions — the strongest single signal of hands-on skill, because they are judged against other people.',
      id: 'Hasil peringkat di kompetisi provinsi dan nasional — sinyal keterampilan paling kuat, karena dinilai bersaing dengan orang lain.',
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
    label: { en: 'National certification & internship', id: 'Sertifikasi nasional & magang' },
    desc: {
      en: 'Formally assessed credentials: the BNSP national competency certificate (assessed by an independent certification body) and a distinction-graded industrial internship.',
      id: 'Kredensial yang dinilai formal: sertifikat kompetensi nasional BNSP (diuji lembaga sertifikasi independen) dan magang industri dengan predikat pujian.',
    },
    ids: [
      'bnsp-national-professional-certification-certified-junior-we',
      'seameo-qitep-in-science-internship-praktik-kerja-lapangan-di',
    ],
  },
  {
    id: 'course',
    label: { en: 'Course completions', id: 'Penyelesaian kursus' },
    desc: {
      en: 'Structured courses with graded final projects, from freeCodeCamp, Dicoding, and Dilesin.',
      id: 'Kursus terstruktur dengan proyek akhir yang dinilai, dari freeCodeCamp, Dicoding, dan Dilesin.',
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
    label: { en: 'Events & webinars', id: 'Event & webinar' },
    desc: {
      en: 'Attendance and participation records. Useful context, but not proof of a skill on their own.',
      id: 'Bukti kehadiran dan partisipasi. Konteks yang berguna, tetapi bukan bukti keterampilan dengan sendirinya.',
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
    label: { en: 'Language & soft skills', id: 'Bahasa & soft skill' },
    desc: {
      en: 'English proficiency (TOEIC 640) and public-speaking training.',
      id: 'Kemampuan bahasa Inggris (TOEIC 640) dan pelatihan public speaking.',
    },
    ids: ['gema-foundation-storytelling-agenda-toeic-test-score-640'],
  },
];
