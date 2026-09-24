import { SocialLink } from "@/data/social";
import {
  BRAND_NAME,
  OWNER_NAME,
  OWNER_ALIAS,
  JOB_TITLE,
  HEADLINE,
  YEARS_OF_EXPERIENCE,
  COUNTRY,
  COUNTRY_CODE,
  LANGUAGES,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  TWITTER_HANDLE,
  PORTRAIT_IMAGE,
  SITE_ORIGIN,
} from "@/config/Identity";

/**
 * Canonical origin of the site. `VITE_DOMAIN` (if set) overrides the
 * code-based `SITE_ORIGIN`; it may omit the protocol, so it is normalised here
 * to guarantee absolute canonical / OpenGraph / JSON-LD URLs.
 */
const normalizeOrigin = (raw?: string): string => {
  const value = (raw || "").trim().replace(/\/+$/, "");
  if (!value) return "https://example.com";
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
};

export const SITE_URL = normalizeOrigin(
  (import.meta.env.VITE_DOMAIN as string | undefined) || SITE_ORIGIN
);

/** Last content revision, also used as `lastmod` reference for the sitemap. */
export const SITE_LAST_MODIFIED = "2026-09-04";

/** Build an absolute URL from a route path. */
export const absoluteUrl = (path = "/"): string => {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  return `${SITE_URL}${clean}`;
};

/** Shared social preview image (square master asset). */
export const SITE_IMAGE = {
  url: "/icon.webp",
  width: 1841,
  height: 1841,
  type: "image/webp",
  alt: `${BRAND_NAME} - ${JOB_TITLE} from ${COUNTRY}`,
};

/** Primary entity facts, reused by metadata and structured data. */
export const ENTITY = {
  name: OWNER_NAME,
  alternateName: OWNER_ALIAS,
  jobTitle: JOB_TITLE,
  headline: HEADLINE,
  yearsOfExperience: YEARS_OF_EXPERIENCE,
  email: CONTACT_EMAIL,
  phone: CONTACT_PHONE,
  country: COUNTRY,
  countryCode: COUNTRY_CODE,
  languages: LANGUAGES,
} as const;

/** Routes exposed to crawlers, used for `SiteNavigationElement` and sitelinks. */
export const SITE_NAVIGATION: Array<{ name: string; path: string }> = [
  { name: "Home", path: "/" },
  { name: "Career", path: "/career" },
  { name: "Projects", path: "/projects" },
  { name: "Certification", path: "/certification" },
  { name: "Linktree", path: "/linktree" },
  { name: "Kanban", path: "/kanban" },
  { name: "Contact", path: "/talk" },
];

export type PageKey =
  | "home"
  | "career"
  | "projects"
  | "certification"
  | "linktree"
  | "talk"
  | "kanban"
  | "notFound";

export type PageSchemaType =
  | "WebPage"
  | "ProfilePage"
  | "CollectionPage"
  | "ContactPage"
  | "AboutPage";

export interface PageMeta {
  /** Route path. */
  path: string;
  /** Final, unique `<title>` (brand already included). */
  title: string;
  /** Short label used for breadcrumbs and navigation. */
  label: string;
  /** Unique meta description. Never reuse across routes. */
  description: string;
  /** Route-specific keywords appended to the global set. */
  keywords: string[];
  /** Schema.org page type emitted in the JSON-LD graph. */
  schemaType: PageSchemaType;
  /** Concise entity answer for generative/answer engines (GEO/AEO). */
  answer: string;
  /** Optional question/answer pairs mirrored from on-page content. */
  faq?: Array<{ question: string; answer: string }>;
  noindex?: boolean;
}

/**
 * Per-route metadata registry. Distinct titles and descriptions here are what
 * prevent Google from collapsing routes into a single generic sitelink.
 */
export const PageMetadata: Record<PageKey, PageMeta> = {
  home: {
    path: "/",
    title: `${BRAND_NAME} - AI & Software Engineer, Full Stack Developer`,
    label: "Home",
    description:
      `${BRAND_NAME} is an AI and software engineer from ${COUNTRY} with ${YEARS_OF_EXPERIENCE} years of experience building full stack web apps, AI automation, and business systems.`,
    keywords: [
      `${BRAND_NAME} portfolio`,
      `AI engineer ${COUNTRY}`,
      "full stack developer portfolio",
      `hire software engineer ${COUNTRY}`,
    ],
    schemaType: "ProfilePage",
    answer:
      `${ENTITY.name}, known online as ${ENTITY.alternateName}, is ${ENTITY.jobTitle.toLowerCase().startsWith("a") || ENTITY.jobTitle.toLowerCase().startsWith("e") || ENTITY.jobTitle.toLowerCase().startsWith("i") || ENTITY.jobTitle.toLowerCase().startsWith("o") || ENTITY.jobTitle.toLowerCase().startsWith("u") ? "an" : "a"} ${ENTITY.jobTitle} based in ${ENTITY.country}.`,
    faq: [
      {
        question: `Who is ${BRAND_NAME}?`,
        answer:
          `${ENTITY.alternateName} is the alias of ${ENTITY.name}, a ${ENTITY.jobTitle} based in ${ENTITY.country}.`,
      },
      {
        question: `What technologies does ${BRAND_NAME} work with?`,
        answer:
          "React, Next.js, TypeScript, JavaScript, Node.js, Express, Laravel, PostgreSQL, MySQL, Tailwind CSS, and AI integrations such as OpenAI and Google Gemini.",
      },
    ],
  },
  career: {
    path: "/career",
    title: `Career Timeline & Work Experience - ${BRAND_NAME}`,
    label: "Career",
    description:
      `Year-by-year work history of ${BRAND_NAME}: engineering roles, company projects, technical responsibilities, and leadership milestones in tech.`,
    keywords: [
      `${BRAND_NAME} career`,
      "software engineer work experience",
      `developer timeline ${COUNTRY}`,
    ],
    schemaType: "AboutPage",
    answer:
      `This page lists the professional work history of ${BRAND_NAME} in chronological order, covering each role, the company, the period worked, and the engineering responsibilities and technologies involved.`,
  },
  projects: {
    path: "/projects",
    title: `Projects Portfolio - Web, AI & Business Apps - ${BRAND_NAME}`,
    label: "Projects",
    description:
      `Searchable portfolio of applications built by ${BRAND_NAME}, filterable by category: AI automation, web apps, business systems, e-commerce, landing pages, and templates.`,
    keywords: [
      `${BRAND_NAME} projects`,
      "web development portfolio",
      "AI automation projects",
      "React project showcase",
    ],
    schemaType: "CollectionPage",
    answer:
      `A filterable catalogue of software built by ${BRAND_NAME}, grouped into seven categories: AI & Automation, Web App, Business System, E-Commerce, Landing Page, Template, and Creative. Each entry lists the tech stack, a description, and a live preview link where available.`,
  },
  certification: {
    path: "/certification",
    title: `Certifications & Credentials - ${BRAND_NAME}`,
    label: "Certification",
    description:
      `Verified professional and academic certificates held by ${BRAND_NAME}, including cloud, web technology competitions, and software engineering credentials with issue dates.`,
    keywords: [
      `${BRAND_NAME} certificates`,
      `developer certifications ${COUNTRY}`,
      "AWS Academy certificate",
    ],
    schemaType: "CollectionPage",
    answer:
      `A verified list of professional and academic certifications earned by ${BRAND_NAME}, each with the issuing organisation, issue date, and a link to the original credential.`,
  },
  linktree: {
    path: "/linktree",
    title: `Social Links & Profiles - ${BRAND_NAME}`,
    label: "Linktree",
    description:
      `One page with every official ${BRAND_NAME} profile: Instagram, TikTok, YouTube, LinkedIn, GitHub, plus direct WhatsApp and email contact routes.`,
    keywords: [
      `${BRAND_NAME} links`,
      `${BRAND_NAME} instagram`,
      `${BRAND_NAME} github`,
      `${BRAND_NAME} linkedin`,
    ],
    schemaType: "ProfilePage",
    answer:
      `The official link hub for ${BRAND_NAME}, listing every verified profile: Instagram @${OWNER_ALIAS}, TikTok @${OWNER_ALIAS}, YouTube @${OWNER_ALIAS}, LinkedIn /in/${OWNER_ALIAS}, and GitHub /${OWNER_ALIAS}.`,
  },
  talk: {
    path: "/talk",
    title: `Contact & Hire - Project Inquiries - ${BRAND_NAME}`,
    label: "Contact",
    description:
      `Send a project brief to ${BRAND_NAME} by form, WhatsApp, or email. Replies within 24 hours, GMT+7 (WIB), in English or Bahasa ${COUNTRY}.`,
    keywords: [
      `contact ${BRAND_NAME}`,
      `hire full stack developer ${COUNTRY}`,
      "freelance web developer inquiry",
    ],
    schemaType: "ContactPage",
    answer:
      `Contact page for ${BRAND_NAME}. Inquiries can be sent through the on-page form, WhatsApp, or email. Typical reply time is within 24 hours, the working timezone is GMT+7 (WIB), and communication is available in English and Bahasa ${COUNTRY}.`,
    faq: [
      {
        question: `How fast does ${BRAND_NAME} reply to inquiries?`,
        answer: "Within 24 hours.",
      },
      {
        question: `What timezone does ${BRAND_NAME} work in?`,
        answer: "GMT+7 (Western Indonesian Time, WIB).",
      },
      {
        question: `What languages can I use to contact ${BRAND_NAME}?`,
        answer: "English and Bahasa Indonesia.",
      },
      {
        question: `What is the fastest way to reach ${BRAND_NAME}?`,
        answer:
          "WhatsApp is the fastest channel; email is better for detailed project briefs.",
      },
    ],
  },
  kanban: {
    path: "/kanban",
    title: `Kanban Board Management System - ${BRAND_NAME}`,
    label: "Kanban",
    description:
      `An interactive Kanban board for managing tasks across a five-stage workflow — Backlog, To Do, In Progress, On Hold, and Done — with drag and drop, priority badges, and progressive outreach counters.`,
    keywords: [
      `${BRAND_NAME} kanban`,
      "kanban board",
      "task management system",
      "drag and drop board",
    ],
    schemaType: "WebPage",
    answer:
      `A Kanban board with five workflow columns (Backlog, To Do, In Progress, On Hold / Waiting, and Done). Tasks carry a priority badge, an optional progress counter such as 10/46, and a due date. Cards can be dragged between columns, and the whole board can be exported to or imported from a JSON file. Data is persisted locally in the browser.`,
  },
  notFound: {
    path: "/404",
    title: `Page Not Found - ${BRAND_NAME}`,
    label: "Not Found",
    description:
      `This URL does not exist on ${new URL(SITE_URL).hostname}. Return to the homepage or report the broken link.`,
    keywords: [],
    schemaType: "WebPage",
    answer: `The requested page does not exist on ${new URL(SITE_URL).hostname}.`,
    noindex: true,
  },
};

/** Resolve the page registry entry for a router pathname. */
export const getPageMetaByPath = (pathname: string): PageMeta | undefined => {
  const clean =
    pathname === "/" ? "/" : `/${pathname.replace(/^\/+/, "").replace(/\/+$/, "")}`;
  return Object.values(PageMetadata).find((meta) => meta.path === clean);
};

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Person entity: the anchor node every other schema references. */
export const personSchema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: ENTITY.name,
  alternateName: ENTITY.alternateName,
  jobTitle: ENTITY.jobTitle,
  description: ENTITY.headline,
  url: SITE_URL,
  mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
  image: {
    "@type": "ImageObject",
    url: absoluteUrl(SITE_IMAGE.url),
    width: SITE_IMAGE.width,
    height: SITE_IMAGE.height,
  },
  email: `mailto:${ENTITY.email}`,
  telephone: ENTITY.phone,
  address: {
    "@type": "PostalAddress",
    addressCountry: ENTITY.countryCode,
    addressRegion: ENTITY.country,
  },
  nationality: { "@type": "Country", name: ENTITY.country },
  knowsLanguage: ENTITY.languages,
  knowsAbout: [
    "Software Engineering",
    "Full Stack Web Development",
    "AI Integration",
    "AI Automation",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Laravel",
    "PostgreSQL",
    "MySQL",
    "Tailwind CSS",
    "UI/UX Design",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: ENTITY.jobTitle,
    occupationLocation: { "@type": "Country", name: ENTITY.country },
    skills:
      "React, Next.js, TypeScript, Node.js, Express, Laravel, PostgreSQL, AI integration",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Project inquiries",
    telephone: ENTITY.phone,
    email: ENTITY.email,
    availableLanguage: ENTITY.languages,
    areaServed: "Worldwide",
  },
  sameAs: Object.values(SocialLink),
};

/** Publisher entity used for OpenGraph/article-style attribution. */
export const organizationSchema = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: ENTITY.alternateName,
  url: SITE_URL,
  founder: { "@id": PERSON_ID },
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl(SITE_IMAGE.url),
    width: SITE_IMAGE.width,
    height: SITE_IMAGE.height,
  },
};

/**
 * WebSite entity with a real `SearchAction`. The projects page reads the
 * `q` query parameter, so this action resolves to a working search result.
 */
export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: ENTITY.alternateName,
  alternateName: `${ENTITY.name} Portfolio`,
  description: PageMetadata.home.description,
  inLanguage: ["en", "id"],
  publisher: { "@id": ORGANIZATION_ID },
  author: { "@id": PERSON_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/** Explicit navigation hints so Google can build clean sitelinks. */
export const siteNavigationSchema = SITE_NAVIGATION.map((item, position) => ({
  "@type": "SiteNavigationElement",
  "@id": `${SITE_URL}/#nav-${position + 1}`,
  position: position + 1,
  name: item.name,
  description: getPageMetaByPath(item.path)?.description,
  url: absoluteUrl(item.path),
  isPartOf: { "@id": WEBSITE_ID },
}));

/** Build the per-page node of the JSON-LD graph. */
export const buildPageSchema = (meta: PageMeta, canonicalUrl: string) => {
  const pageId = `${canonicalUrl}#webpage`;

  const page: Record<string, unknown> = {
    "@type": meta.schemaType,
    "@id": pageId,
    url: canonicalUrl,
    name: meta.title,
    description: meta.description,
    abstract: meta.answer,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    dateModified: SITE_LAST_MODIFIED,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(SITE_IMAGE.url),
    },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  if (meta.schemaType === "ProfilePage") page.mainEntity = { "@id": PERSON_ID };

  const breadcrumbItems = [{ name: "Home", path: "/" }];
  if (meta.path !== "/") breadcrumbItems.push({ name: meta.label, path: meta.path });

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  const nodes: Array<Record<string, unknown>> = [page, breadcrumb];

  if (meta.faq?.length) {
    nodes.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      isPartOf: { "@id": pageId },
      mainEntity: meta.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return nodes;
};

/** Assemble the full `@graph` payload emitted by `HelmetContainer`. */
export const buildStructuredData = (meta: PageMeta, canonicalUrl: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    websiteSchema,
    organizationSchema,
    personSchema,
    ...(meta.path === "/" ? siteNavigationSchema : []),
    ...buildPageSchema(meta, canonicalUrl),
  ],
});

/**
 * Global metadata defaults. Route-specific values live in `PageMetadata`.
 */
const MetadataConfig = {
  title: PageMetadata.home.title,
  creator: ENTITY.alternateName,
  metadataBase: new URL(SITE_URL),
  description: PageMetadata.home.description,

  keywords: [
    BRAND_NAME,
    ENTITY.name,
    `AI Engineer ${ENTITY.country}`,
    `Software Engineer ${ENTITY.country}`,
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "AI automation developer",
    `web developer portfolio ${ENTITY.country}`,
    `freelance web developer ${ENTITY.country}`,
  ],

  authors: {
    name: ENTITY.alternateName,
    url: SITE_URL,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: ENTITY.alternateName,
    title: PageMetadata.home.title,
    description: PageMetadata.home.description,
    locale: "en_US",
    alternateLocale: ["id_ID"],
    images: [SITE_IMAGE],
    countryName: ENTITY.country,
    emails: [ENTITY.email],
  },

  twitter: {
    card: "summary_large_image",
    title: PageMetadata.home.title,
    description: PageMetadata.home.description,
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
    images: SITE_IMAGE,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  other: {
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-title": ENTITY.alternateName,
    "application-name": ENTITY.alternateName,
    "format-detection": "telephone=no",
    referrer: "origin-when-cross-origin",
    "geo.region": ENTITY.countryCode,
    "geo.placename": ENTITY.country,
    ICBM: "-2.5,118",
    copyright: `${ENTITY.alternateName} - All rights reserved`,
    owner: ENTITY.alternateName,
    category: "technology, programming, software development",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.webp", sizes: "1841x1841", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icon.webp", sizes: "180x180", type: "image/webp" }],
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "technology",
  classification: "Portfolio, Programming, Software Development",
};

export default MetadataConfig;
