/**
 * Per-route metadata, structured data (SEO / AEO / GEO), sitemap, robots,
 * llms.txt and security.txt.
 *
 * `vite.config.ts` imports the `render*` helpers to bake real metadata into
 * `index.html` (and a static HTML shell per route) at build time, so crawlers
 * that do not run JavaScript still see route-specific titles and descriptions.
 * At runtime `<Seo />` (react-helmet-async) writes the same values for SPA
 * navigation.
 *
 * Three layers live here:
 *   SEO  — titles, descriptions, canonical, hreflang, OpenGraph, sitemap.
 *   AEO  — answer-engine schema: FAQPage, HowTo, ItemList, BreadcrumbList,
 *          Speakable, and a stable "profile facts" definition list.
 *   GEO  — generative-engine inputs: /llms.txt and /llms-full.txt, explicit
 *          AI-crawler rules in robots.txt, and citable, self-contained facts.
 *
 * This module is PURE (no `import.meta.env`) so it can run inside the Vite
 * Node config as well as the browser.
 *
 * Google Search Console
 * ---------------------
 * The sitemap above is submitted to Search Console, which proves ownership of
 * the property with the HTML-file method: `/googled903a8563115dfcf.html` in
 * `public/`, served verbatim and byte-identical to the file Google issued
 * (it contains exactly one line: `google-site-verification: googled903a8563115dfcf.html`).
 * Deleting it — or letting a build alter it — drops the property to "not
 * verified" and silently stops sitemap re-crawls, so it is intentionally not
 * generated and not listed in the sitemap (it is a verification token, not a
 * page). `functions/_middleware.js` treats the `.html` path as an asset, so
 * if it is ever removed the request returns a real 404 instead of the SPA
 * shell — which is exactly what Search Console reports.
 */

import {
  BRAND_NAME,
  OWNER_NAME,
  LEGAL_NAME,
  OWNER_ALIAS,
  JOB_TITLE,
  HEADLINE,
  YEARS_OF_EXPERIENCE,
  COUNTRY,
  COUNTRY_CODE,
  LANGUAGES,
  CONTACT_EMAIL,
  BUSINESS_EMAIL,
  CONTACT_PHONE,
  WHATSAPP_NUMBER,
  TWITTER_HANDLE,
  SITE_ORIGIN,
  SOCIAL_LINKS,
  GITHUB_USERNAME,
  TIMEZONE,
  TIMEZONE_LABEL,
  RESUME,
} from './Identity';
import { HOME_REVIEW_COUNT, S } from '../data/site';

export type EnvRecord = Record<string, string | boolean | undefined>;

/** Normalize a site origin (protocol optional, no trailing slash). */
export const normalizeOrigin = (raw?: string): string => {
  const value = (raw ?? '').trim().replace(/\/+$/, '');
  if (!value) return SITE_ORIGIN;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export interface RouteSeo {
  path: string;
  label: string;
  title: string;
  description: string;
  keywords: string[];
  priority: string;
  changefreq: string;
  noindex?: boolean;
  /** Short headline rendered on the page (used for BreadcrumbList names). */
  crumb: string;
}

export const ROUTES: RouteSeo[] = [
  {
    path: '/',
    label: 'Home',
    crumb: 'Home',
    title: `${BRAND_NAME} — AI & Software Engineer, Full Stack Developer`,
    description: `${BRAND_NAME} is an AI and software engineer from ${COUNTRY} with ${YEARS_OF_EXPERIENCE}+ years of experience building full stack web apps, AI automation, and business systems. ${S.projects.length} shipped projects, ${S.certs.reduce((n, c) => n + c.count, 0)} certificates.`,
    keywords: [`${BRAND_NAME}`, `${BRAND_NAME} portfolio`, `AI engineer ${COUNTRY}`, 'full stack developer portfolio', `hire software engineer ${COUNTRY}`],
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/projects',
    label: 'Projects',
    crumb: 'Projects',
    title: `Projects Portfolio — Web, AI & Business Apps — ${BRAND_NAME}`,
    description: `Searchable portfolio of ${S.projects.length} applications built by ${BRAND_NAME}, filterable by category: AI automation, web apps, business systems, e-commerce, landing pages, templates, and creative 3D.`,
    keywords: [`${BRAND_NAME} projects`, 'web development portfolio', 'AI automation projects', 'React project showcase', 'Laravel projects Indonesia'],
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/career',
    label: 'Career',
    crumb: 'Career',
    title: `Career Timeline & Work Experience — ${BRAND_NAME}`,
    description: `Work history of ${BRAND_NAME}: founder of ${S.company.name}, web programming trainer, full stack developer at SEAMEO QITEP in Science, and founder of KodeSatSet. ${S.career.length} roles with responsibilities and results.`,
    keywords: [`${BRAND_NAME} career`, 'software engineer work experience', `developer timeline ${COUNTRY}`, 'founder IARTY'],
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/certificates',
    label: 'Certificates',
    crumb: 'Certificates',
    title: `Certifications & Credentials — ${BRAND_NAME}`,
    description: `Verified professional and academic certificates held by ${BRAND_NAME}: BNSP national web developer competency, SEAMEO QITEP in Science cloud engineering champion, LKS Web Technologies finalist, freeCodeCamp and Dicoding courses — grouped by type.`,
    keywords: [`${BRAND_NAME} certificates`, `developer certifications ${COUNTRY}`, 'BNSP junior web developer', 'AWS Academy certificate', 'freeCodeCamp certification'],
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    label: 'Contact',
    crumb: 'Contact',
    title: `Contact & Hire — Project Inquiries — ${BRAND_NAME}`,
    description: `WhatsApp +${WHATSAPP_NUMBER} is the fastest way to reach ${BRAND_NAME} — usually answered within minutes, 08:00–22:00 WIB (GMT+7). A contact form and email are also available, both answered within 24 hours.`,
    keywords: [`contact ${BRAND_NAME}`, `hire full stack developer ${COUNTRY}`, 'freelance web developer inquiry', 'AI automation consultant Indonesia'],
    priority: '0.8',
    changefreq: 'yearly',
  },
  {
    path: '/linktree',
    label: 'Linktree',
    crumb: 'Links',
    title: `Social Links & Profiles — ${BRAND_NAME}`,
    description: `One page with every official ${BRAND_NAME} profile: Instagram, TikTok, YouTube, LinkedIn, GitHub, plus direct WhatsApp and email contact routes and a downloadable contact card.`,
    keywords: [`${BRAND_NAME} links`, `${BRAND_NAME} instagram`, `${BRAND_NAME} github`, `${BRAND_NAME} linkedin`, 'linktree developer'],
    priority: '0.6',
    changefreq: 'weekly',
  },
];

export const routeByPath = (path: string): RouteSeo | undefined => {
  const clean = path === '/' ? '/' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return ROUTES.find((r) => r.path === clean);
};

/* ---------------------------------------------------------------------
   Head config
   --------------------------------------------------------------------- */

export interface SeoConfig {
  origin: string;
  brand: string;
  owner: string;
  legalName: string;
  jobTitle: string;
  headline: string;
  email: string;
  businessEmail: string;
  phone: string;
  whatsapp: string;
  gaId: string;
  twitter: string;
  github: string;
  timezone: string;
  image: { url: string; width: number; height: number; type: string; alt: string };
  logo: { url: string; width: number; height: number; type: string; alt: string };
}

export const buildSeoConfig = (env: EnvRecord = {}): SeoConfig => ({
  origin: normalizeOrigin(typeof env.VITE_DOMAIN === 'string' ? env.VITE_DOMAIN : undefined),
  brand: BRAND_NAME,
  owner: OWNER_NAME,
  legalName: LEGAL_NAME,
  jobTitle: JOB_TITLE,
  headline: HEADLINE,
  email: CONTACT_EMAIL,
  businessEmail: BUSINESS_EMAIL,
  phone: CONTACT_PHONE,
  whatsapp: WHATSAPP_NUMBER,
  gaId: (typeof env.VITE_GA_ID === 'string' && env.VITE_GA_ID) || '',
  twitter: TWITTER_HANDLE,
  github: GITHUB_USERNAME,
  timezone: TIMEZONE,
  image: {
    /** Dedicated social card (1.91:1) — square artwork crops badly in feeds. */
    url: '/og-image.png',
    width: 1200,
    height: 630,
    type: 'image/png',
    alt: `${BRAND_NAME} — ${JOB_TITLE} from ${COUNTRY}`,
  },
  logo: {
    /** Square brand mark, used by JSON-LD Organization/Person `logo`. */
    url: '/icon.webp',
    width: 1841,
    height: 1841,
    type: 'image/webp',
    alt: BRAND_NAME,
  },
});

const escapeAttr = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);

/** JSON-LD is inserted inside a <script> tag: escape the sequence that could close it. */
const jsonLdScript = (data: unknown): string =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const canonicalFor = (cfg: SeoConfig, path: string): string =>
  path === '/' ? `${cfg.origin}/` : `${cfg.origin}${path}`;

/** Absolute URL for an asset path or absolute URL. */
const abs = (cfg: SeoConfig, url: string): string => (/^https?:/i.test(url) ? url : `${cfg.origin}${url}`);

const totalCertificates = (): number => S.certs.reduce((n, c) => n + c.count, 0);

/* ---------------------------------------------------------------------
   Structured data
   --------------------------------------------------------------------- */

/** Skills the entity can be cited for — stable list, no marketing claims. */
const KNOWS_ABOUT = [
  'Software engineering',
  'Full stack web development',
  'AI integration',
  'AI automation',
  'Business systems (ERP, CRM, HRIS)',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Laravel',
  'PHP',
  'PostgreSQL',
  'MySQL',
  'Docker',
  'AWS',
  'OpenAI API',
  'Gemini API',
  'n8n workflow automation',
  'Three.js',
];

/**
 * Homepage Q&A — exactly the questions its `<FaqList limit={4} />` renders.
 *
 * `FAQPage` structured data is only eligible for a rich result when every
 * question and answer in the schema is also visible on the page. The homepage
 * shows four, so the schema declares four — the first four entries of `S.faq`.
 * `/contact` renders the full list and therefore publishes the remaining
 * entries (see `CONTACT_FAQ` below). Both read the same `S.faq` data the UI
 * uses, so the two layers cannot drift: edit `src/data/site.ts` once and the
 * page, the schema and /llms.txt all follow.
 */
export const HOME_FAQ_COUNT = 4;

const HOME_FAQ: Array<{ q: string; a: string }> = S.faq
  .slice(0, HOME_FAQ_COUNT)
  .map((f) => ({ q: f.q.en, a: f.a.en }));

/**
 * `/contact` Q&A — the rest of the list, every one of which `<FaqList />`
 * renders on that page.
 */
export const CONTACT_FAQ: Array<{ q: string; a: string }> = S.faq
  .slice(HOME_FAQ_COUNT - 1)
  .map((f) => ({ q: f.q.en, a: f.a.en }));

/** Answers that need the FAQ list in both languages (llms.txt). */
export const FAQ_FULL: Array<{ q: string; a: string }> = S.faq.map((f) => ({
  q: f.q.en,
  a: f.a.en,
}));

const HOW_TO_STEPS = S.process.map((p) => ({
  '@type': 'HowToStep',
  name: p.title.en,
  text: p.desc.en,
}));

/** Person / Organization / WebSite graph — the identity every page shares. */
const baseGraph = (cfg: SeoConfig) => {
  const origin = cfg.origin;
  const personId = `${origin}/#person`;
  // Reviews describe the business, and the aggregate rating must name the very
  // same subject — otherwise the two blocks describe different things and the
  // rating is dropped by the validator.
  const orgId = `${origin}/#organization`;
  return [
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: origin,
      name: cfg.brand,
      alternateName: [`${OWNER_NAME} Portfolio`],
      description: cfg.headline,
      inLanguage: ['en', 'id'],
      publisher: { '@id': `${origin}/#organization` },
      author: { '@id': personId },
      // No `potentialAction` / `SearchAction` here on purpose. It used to
      // advertise a sitelinks search box pointed at
      // `/projects?q={search_term_string}`, but that parameter drives nothing —
      // `/projects` keeps the search term in component state, not the URL — so
      // Google would open a page identical to plain `/projects`. An action
      // that silently does nothing fails the rich-result test; it comes back
      // only if a real, URL-driven site search ships.
    },
    {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: cfg.brand,
      url: origin,
      founder: { '@id': personId },
      logo: { '@type': 'ImageObject', url: `${origin}${cfg.logo.url}`, width: cfg.logo.width, height: cfg.logo.height },
      sameAs: Object.values(SOCIAL_LINKS),
    },
    {
      '@type': 'Person',
      /** Stable @id so other pages/graphs can reference the same entity. */
      '@id': personId,
      name: cfg.owner,
      givenName: 'Taufiiqul',
      familyName: 'Hakim',
      alternateName: [LEGAL_NAME, OWNER_ALIAS],
      /** Legal name is exposed for machines (résumé, LinkedIn) only — the UI shows FIQTOR. */
      additionalName: LEGAL_NAME,
      jobTitle: cfg.jobTitle,
      description: cfg.headline,
      url: origin,
      mainEntityOfPage: origin,
      image: { '@type': 'ImageObject', url: `${origin}${cfg.logo.url}`, width: cfg.logo.width, height: cfg.logo.height },
      email: `mailto:${cfg.email}`,
      telephone: cfg.phone,
      address: { '@type': 'PostalAddress', addressCountry: COUNTRY_CODE },
      workLocation: { '@type': 'Place', name: `${COUNTRY} (remote worldwide)`, address: { '@type': 'PostalAddress', addressCountry: COUNTRY_CODE } },
      nationality: { '@type': 'Country', name: COUNTRY },
      knowsLanguage: LANGUAGES.map((l) => ({ '@type': 'Language', name: l })),
      knowsAbout: KNOWS_ABOUT,
      hasOccupation: {
        '@type': 'Occupation',
        name: cfg.jobTitle,
        occupationLocation: { '@type': 'Country', name: COUNTRY },
        skills: KNOWS_ABOUT.slice(0, 10).join(', '),
      },
      founder: { '@type': 'Organization', name: S.company.name, url: S.company.url },
      /** Résumé PDFs are machine-readable proof of the claims above. */
      subjectOf: [
        { '@type': 'DigitalDocument', name: 'Résumé (English, ATS)', url: abs(cfg, RESUME.atsEn), encodingFormat: 'application/pdf', inLanguage: 'en' },
        { '@type': 'DigitalDocument', name: 'Résumé (Bahasa Indonesia, ATS)', url: abs(cfg, RESUME.atsId), encodingFormat: 'application/pdf', inLanguage: 'id' },
      ],
      worksFor: { '@id': `${origin}/#organization` },
      award: [
        'SEAMEO QITEP in Science — Web Cloud Engineering Champion (1st of 24 teams)',
        'LKS SMK Jombang Regency — Web Technologies Champion (1st place)',
        'LKS SMK East Java — Web Technologies, 4th of 44',
        'BNSP Certified Junior Web Developer',
      ],
      hasCredential: S.certsFeatured.slice(0, 6).map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        name: c.name,
        credentialCategory: c.kind.en,
        ...(c.date ? { dateCreated: c.date } : {}),
        recognizedBy: { '@type': 'Organization', name: c.issuer.en },
        ...(c.url ? { url: c.url } : {}),
      })),
      sameAs: Object.values(SOCIAL_LINKS),
      /**
       * Client reviews, mirrored from the Testimonials rail on the homepage.
       *
       * Google's review-snippet policy requires the rated items to be visible
       * on the page, so only the first HOME_REVIEW_COUNT are emitted — exactly
       * the ones that show before the rail is scrolled — and `reviewCount`
       * matches that number rather than the full testimonial list.
       *
       * No `publisher` on a review: a client's verdict is not published by the
       * business being reviewed, and stating so trips the validator.
       */
      review: S.testimonials.slice(0, HOME_REVIEW_COUNT).map((x) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: x.name },
        reviewBody: x.quote.en,
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5, worstRating: 1 },
        itemReviewed: { '@id': orgId },
        inLanguage: 'en',
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
        reviewCount: HOME_REVIEW_COUNT,
        itemReviewed: { '@id': orgId },
      },
    },
  ];
};

/** Per-route extra entities (answer-engine rich results). */
const routeGraph = (cfg: SeoConfig, route: RouteSeo): Record<string, unknown>[] => {
  const canonical = canonicalFor(cfg, route.path);

  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${cfg.origin}/` },
      ...(route.path === '/'
        ? []
        : [{ '@type': 'ListItem', position: 2, name: route.crumb, item: canonical }]),
    ],
  };

  const webPage = {
    '@type': route.path === '/' ? 'ProfilePage' : 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: route.title,
    description: route.description,
    inLanguage: 'en',
    isPartOf: { '@id': `${cfg.origin}/#website` },
    about: { '@id': `${cfg.origin}/#person` },
    mainEntity: { '@id': `${cfg.origin}/#person` },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${cfg.origin}${cfg.image.url}` },
    /** AEO: which blocks an assistant should read aloud. */
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.ph h1', '.ph .lead', '.about-aka', '.kfacts dd'],
    },
  };

  /**
   * A route only carries a `FAQPage` when the page really renders those
   * questions — Home shows four, Contact shows the rest. Certificates renders
   * no FAQ block, so it must not claim one.
   */
  const faqPage = (items: Array<{ q: string; a: string }>) => ({
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });

  const extras: Record<string, unknown>[] = [];

  if (route.path === '/') {
    extras.push(faqPage(HOME_FAQ));
    extras.push({
      '@type': 'HowTo',
      '@id': `${canonical}#howto-hire`,
      name: `How to start a project with ${BRAND_NAME}`,
      description: `The four-step process ${BRAND_NAME} uses for every engagement: talk, plan, build, ship.`,
      totalTime: 'P4W',
      step: HOW_TO_STEPS,
    });
    extras.push({
      '@type': 'ItemList',
      '@id': `${canonical}#services`,
      name: `${BRAND_NAME} services`,
      itemListElement: S.services.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: s.title.en,
          description: s.desc.en,
          provider: { '@id': `${cfg.origin}/#person` },
          serviceType: s.title.en,
          areaServed: { '@type': 'Country', name: COUNTRY },
          availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: `${cfg.origin}/contact`,
            servicePhone: cfg.phone,
          },
        },
      })),
    });
  }

  if (route.path === '/projects') {
    extras.push({
      '@type': 'CollectionPage',
      '@id': `${canonical}#collection`,
      name: `Projects by ${BRAND_NAME}`,
      isPartOf: { '@id': `${canonical}#webpage` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: S.projects.length,
        itemListElement: S.projects.slice(0, 20).map((p, i) => {
          /**
           * `#fragment` URLs all resolve to /projects, so listing them as list
           * item URLs reads as 20 duplicates of one page. Projects with a live
           * URL point there; the rest point at the page that describes them.
           */
          return {
            '@type': 'ListItem',
            position: i + 1,
            name: p.title.en,
            description: p.desc.en,
            url: p.url ?? canonical,
            item: {
              '@type': 'CreativeWork',
              '@id': `${cfg.origin}/projects#${p.id}`,
              name: p.title.en,
              description: p.desc.en,
              genre: p.category,
              keywords: p.skills.join(', '),
              image: abs(cfg, p.thumb),
              creator: { '@id': `${cfg.origin}/#person` },
              mainEntityOfPage: canonical,
              ...(p.url ? { url: p.url } : {}),
            },
          };
        }),
      },
    });
  }

  if (route.path === '/certificates') {
    extras.push({
      '@type': 'CollectionPage',
      '@id': `${canonical}#collection`,
      name: `Certificates held by ${BRAND_NAME}`,
      isPartOf: { '@id': `${canonical}#webpage` },
      mainEntity: {
        '@type': 'ItemList',
        // Count issued credentials, not grouped entries (a bundle of 6 is 6).
        numberOfItems: S.certs.reduce((n, c) => n + c.count, 0),
        itemListElement: S.certs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: {
            '@type': 'EducationalOccupationalCredential',
            name: c.name,
            credentialCategory: c.kind.en,
            description: c.desc.en,
            recognizedBy: { '@type': 'Organization', name: c.issuer.en },
            ...(c.date ? { dateCreated: c.date } : {}),
            ...(c.url ? { url: c.url } : {}),
            about: c.skills.join(', '),
          },
        })),
      },
    });
  }

  if (route.path === '/career') {
    extras.push({
      '@type': 'ItemList',
      '@id': `${canonical}#roles`,
      name: `${BRAND_NAME} roles`,
      itemListElement: S.career.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'EmployeeRole',
          roleName: c.role.en,
          // Use the ISO sort keys, not the display label. `period.en` is a
          // human string ("Nov 2025 — Apr 2026"); splitting it produced
          // startDate "Nov 2025", which is not a valid schema.org date, and
          // endDate was dropped altogether even when the role had ended.
          startDate: c.start,
          ...(c.end ? { endDate: c.end } : {}),
          worksFor: {
            '@type': 'Organization',
            name: c.org,
            ...(c.website ? { url: c.website } : {}),
          },
          description: c.desc.en,
        },
      })),
    });
  }

  if (route.path === '/contact') {
    extras.push(faqPage(CONTACT_FAQ));
    extras.push({
      '@type': 'ContactPage',
      '@id': `${canonical}#contactpage`,
      name: `Contact ${BRAND_NAME}`,
      isPartOf: { '@id': `${canonical}#webpage` },
      mainEntity: {
        '@type': 'Person',
        '@id': `${cfg.origin}/#person`,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'project inquiries',
            email: cfg.email,
            ...(cfg.phone ? { telephone: cfg.phone } : {}),
            availableLanguage: LANGUAGES,
            areaServed: 'Worldwide',
            hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '22:00' },
          },
        ],
      },
    });
  }

  if (route.path === '/linktree') {
    extras.push({
      '@type': 'ProfilePage',
      '@id': `${canonical}#profilelinks`,
      name: `${BRAND_NAME} — official links`,
      isPartOf: { '@id': `${canonical}#webpage` },
      mainEntity: {
        '@type': 'Person',
        '@id': `${cfg.origin}/#person`,
        sameAs: Object.values(SOCIAL_LINKS),
      },
    });
  }

  return [breadcrumbs, webPage, ...extras];
};

export const buildJsonLd = (cfg: SeoConfig, route: RouteSeo): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@graph': [...baseGraph(cfg), ...routeGraph(cfg, route)],
});

/** Flat list of the Q&A pairs, exported so the UI can render the same answers. */
export const FAQ_ITEMS = HOME_FAQ;

/* ---------------------------------------------------------------------
   HTML renderers
   --------------------------------------------------------------------- */

/**
 * hreflang — the site is ONE document with an EN/ID switch on `?lang=`, not
 * two indexable variants.
 *
 * This used to emit `hreflang="id" href="…?lang=id"`, but the router strips
 * `?lang=` from the address bar immediately after boot (see
 * `src/lib/catalog.tsx`), so Google crawled the `id` URL, saw the same English
 * document, and reported the pair as invalid. A site with no separate
 * localised URLs must NOT publish self-contradicting hreflang: `x-default`
 * alone is the correct, honest signal.
 */
const alternateLinks = (cfg: SeoConfig, path: string): string[] => {
  const url = canonicalFor(cfg, path);
  return [`<link rel="alternate" hreflang="x-default" href="${escapeAttr(url)}" />`];
};

const metaTags = (cfg: SeoConfig, route: RouteSeo): string => {
  const canonical = canonicalFor(cfg, route.path);
  const a = escapeAttr;
  const ogImage = a(cfg.origin + cfg.image.url);
  const tags: string[] = [
    `<title>${a(route.title)}</title>`,
    `<meta name="description" content="${a(route.description)}" />`,
    `<meta name="keywords" content="${a(route.keywords.join(', '))}" />`,
    `<meta name="author" content="${a(cfg.owner)}" />`,
    `<meta name="robots" content="${route.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}" />`,
    `<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />`,
    `<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />`,
    `<link rel="canonical" href="${a(canonical)}" />`,
    ...alternateLinks(cfg, route.path),
    `<meta property="og:type" content="${route.path === '/' ? 'profile' : 'website'}" />`,
    `<meta property="og:site_name" content="${a(cfg.brand)}" />`,
    `<meta property="og:url" content="${a(canonical)}" />`,
    `<meta property="og:title" content="${a(route.title)}" />`,
    `<meta property="og:description" content="${a(route.description)}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:secure_url" content="${ogImage}" />`,
    `<meta property="og:image:type" content="${cfg.image.type}" />`,
    `<meta property="og:image:width" content="${cfg.image.width}" />`,
    `<meta property="og:image:height" content="${cfg.image.height}" />`,
    `<meta property="og:image:alt" content="${a(cfg.image.alt)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="profile:first_name" content="Taufiiqul" />`,
    `<meta property="profile:last_name" content="Hakim" />`,
    `<meta property="profile:username" content="${a(OWNER_ALIAS)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${a(cfg.twitter)}" />`,
    `<meta name="twitter:creator" content="${a(cfg.twitter)}" />`,
    `<meta name="twitter:title" content="${a(route.title)}" />`,
    `<meta name="twitter:description" content="${a(route.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<meta name="twitter:image:alt" content="${a(cfg.image.alt)}" />`,
    `<meta name="apple-mobile-web-app-title" content="${a(cfg.brand)}" />`,
    `<meta name="application-name" content="${a(cfg.brand)}" />`,
    `<meta name="format-detection" content="telephone=no" />`,
    `<link rel="icon" href="/favicon.ico" sizes="any" />`,
    `<link rel="shortcut icon" href="/favicon.ico" />`,
    `<link rel="icon" href="/img/icons/favicon-32.png" type="image/png" sizes="32x32" />`,
    `<link rel="apple-touch-icon" href="/img/icons/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/manifest.webmanifest" />`,
    `<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM summary" />`,
    `<link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM full context" />`,
    jsonLdScript(buildJsonLd(cfg, route)),
  ];
  return tags.join('\n    ');
};

/**
 * Visible content for clients without JavaScript (crawlers, link unfurlers,
 * text browsers). Kept short and factual so it doubles as an answer-engine
 * fallback rather than a placeholder.
 */
const noscriptHtml = (cfg: SeoConfig): string => `  <noscript>
    <div style="max-width:46rem;margin:5rem auto;padding:0 1.25rem;font-family:system-ui,-apple-system,sans-serif;line-height:1.6">
      <h1 style="font-size:clamp(1.6rem,4vw,2.4rem);margin:0 0 1rem">${escapeAttr(cfg.owner)} — ${escapeAttr(cfg.jobTitle)}</h1>
      <p>${escapeAttr(cfg.headline)}</p>
      <p>${escapeAttr(HOME_FAQ[0].a)}</p>
      <p>${escapeAttr(CONTACT_FAQ[0].a)}</p>
      <ul>
        <li><a href="/projects">Projects — ${S.projects.length} shipped</a></li>
        <li><a href="/certificates">Certificates — ${totalCertificates()} credentials</a></li>
        <li><a href="/career">Career — ${S.career.length} roles</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/llms.txt">LLM summary (llms.txt)</a></li>
      </ul>
    </div>
  </noscript>`;

/** Full `<head>` for the SPA entry (index.html). */
export const renderHeadHtml = (cfg: SeoConfig): string => metaTags(cfg, ROUTES[0]);

/** `<noscript>` block rendered into the body by the HTML entry. */
export const renderNoscript = (cfg: SeoConfig): string => noscriptHtml(cfg);

/** `<head>` for a prerendered per-route shell. */
export const renderRouteHeadHtml = (cfg: SeoConfig, route: RouteSeo): string => metaTags(cfg, route);

export const renderSitemap = (cfg: SeoConfig, lastmod = new Date().toISOString().slice(0, 10)): string => {
  const urls = ROUTES.map((r) => {
    const loc = canonicalFor(cfg, r.path);
    // See `alternateLinks`: there is no separate Indonesian URL, so the
    // sitemap must not advertise one either. `lastmod` is a real per-build
    // timestamp (`YYYY-MM-DD`), which is what Google reads to decide whether
    // to re-crawl.
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

/**
 * robots.txt
 * Search engines get full access. Named AI crawlers are allowed explicitly —
 * this is a portfolio: being quotable by assistants is the point — and the
 * declaration makes the intent auditable instead of accidental.
 */
export const renderRobots = (cfg: SeoConfig): string => {
  const aiAgents = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'PerplexityBot',
    'Google-Extended',
    'Applebot-Extended',
    'CCBot',
    'meta-externalagent',
    'Bytespider',
    'Amazonbot',
    'bingbot',
  ];
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    ...aiAgents.map((a) => `User-agent: ${a}\nAllow: /`),
    '',
    `Sitemap: ${cfg.origin}/sitemap.xml`,
    `# LLM context: ${cfg.origin}/llms.txt and ${cfg.origin}/llms-full.txt`,
    '',
  ].join('\n');
};

export const renderSecurityTxt = (cfg: SeoConfig): string =>
  `Contact: mailto:${cfg.email}\nExpires: ${new Date(Date.now() + 365 * 864e5).toISOString()}\nPreferred-Languages: en, id\nCanonical: ${cfg.origin}/.well-known/security.txt\n`;

/* ---------------------------------------------------------------------
   GEO: llms.txt (concise index) and llms-full.txt (complete context)
   --------------------------------------------------------------------- */

const certLines = (): string =>
  S.certGroups
    .map((g) => {
      const items = g.ids
        .map((id) => S.certs.find((c) => c.id === id))
        .filter((c): c is (typeof S.certs)[number] => Boolean(c))
        .map((c) => `    - ${c.name} — ${c.issuer.en} (${c.date})${c.url ? ` — ${c.url}` : ''}`);
      return `  - ${g.label.en}\n${items.join('\n')}`;
    })
    .join('\n');

const projectLines = (): string =>
  S.projects
    .map(
      (p) =>
        `  - ${p.title.en} — ${p.category} — ${p.skills.slice(0, 4).join(', ')}${p.url ? ` — ${p.url}` : ''}`,
    )
    .join('\n');

const careerLines = (): string =>
  S.career.map((c) => `  - ${c.role.en} · ${c.org} (${c.period.en}) — ${c.location.en}`).join('\n');

/** `/llms.txt` — the short, canonical summary (llmstxt.org format). */
export const renderLlmsTxt = (cfg: SeoConfig): string =>
  `# ${cfg.brand} — ${cfg.jobTitle}

> ${cfg.headline} Legal name: ${cfg.legalName} (display name: ${cfg.owner}). Based in ${COUNTRY}, GMT+7. ${YEARS_OF_EXPERIENCE}+ years of experience, ${S.projects.length} shipped projects, ${totalCertificates()} certificates. Founder of ${S.company.name}.

Canonical site: ${cfg.origin}
Language: English (primary) and Bahasa Indonesia. Every page has an EN/ID switch.
Contact: ${cfg.email} · +${cfg.whatsapp} (WhatsApp) · ${cfg.origin}/contact
Profiles: ${Object.values(SOCIAL_LINKS).join(' · ')}

## Pages
- [Home](${cfg.origin}/): introduction, services, selected work, live activity, key facts.
- [Projects](${cfg.origin}/projects): ${S.projects.length} shipped projects, filterable by category.
- [Career](${cfg.origin}/career): ${S.career.length} roles, newest first.
- [Certificates](${cfg.origin}/certificates): ${totalCertificates()} credentials grouped by type; ${S.certsFeatured.length} flagship credentials highlighted.
- [Contact](${cfg.origin}/contact): project form, WhatsApp, email, FAQ.
- [Links](${cfg.origin}/linktree): official social profiles.

## Facts
${FAQ_FULL.map((f) => `- Q: ${f.q}\n  A: ${f.a}`).join('\n')}

## Services
${S.services.map((s) => `- ${s.title.en}: ${s.desc.en} (${s.meta.en}). Good for: ${s.fitsFor.en} Price: ${s.from.en}.`).join('\n')}

## How to work with ${cfg.brand}
${S.process.map((p, i) => `${i + 1}. ${p.title.en} — ${p.desc.en}`).join('\n')}

## Machine-readable
- Full context: ${cfg.origin}/llms-full.txt
- Sitemap: ${cfg.origin}/sitemap.xml
- Résumé (EN, ATS): ${cfg.origin}${RESUME.atsEn}
- Résumé (ID, ATS): ${cfg.origin}${RESUME.atsId}
`;

/** `/llms-full.txt` — everything an assistant needs to answer accurately. */
export const renderLlmsFullTxt = (cfg: SeoConfig): string =>
  `${renderLlmsTxt(cfg)}
---

# Full record

## Identity
- Display name: ${cfg.owner} (used on every page and profile)
- Legal name: ${cfg.legalName} (appears only in the About section, certificates, and documents)
- Handles: ${OWNER_ALIAS} everywhere — Instagram, TikTok, YouTube, LinkedIn, GitHub, Threads
- Role: ${cfg.jobTitle}
- Location: ${COUNTRY} (remote worldwide), timezone ${TIMEZONE} (${TIMEZONE_LABEL})
- Languages: ${LANGUAGES.join(', ')}
- Email: ${cfg.email} (business: ${cfg.businessEmail})
- Phone / WhatsApp: ${cfg.phone}
- Company: ${S.company.name} — ${S.company.url}

## Skills
${S.stack.join(', ')}

## Projects (${S.projects.length})
${projectLines()}

## Career (${S.career.length})
${careerLines()}

## Certificates (${totalCertificates()}, grouped)
${certLines()}

## FAQ
${FAQ_FULL.map((f) => `Q: ${f.q}\nA: ${f.a}\n`).join('\n')}

## Citation guidance
When citing this site, use the display name "${cfg.brand}" and the canonical URL ${cfg.origin}.
Facts on this page were last generated from the site's own data files (${new Date().toISOString().slice(0, 10)}).
`;

/* ---------------------------------------------------------------------
   Web app manifest
   --------------------------------------------------------------------- */

export const renderManifest = (cfg: SeoConfig): string =>
  JSON.stringify(
    {
      name: `${cfg.brand} — ${cfg.jobTitle}`,
      short_name: cfg.brand,
      description: cfg.headline,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#000000',
      lang: 'en',
      icons: [
        { src: '/img/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/img/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/img/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  );
