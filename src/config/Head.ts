/**
 * Static <head> configuration for the HTML entry (index.html).
 *
 * These values are injected into index.html at BUILD TIME by the
 * `htmlHeadPlugin` defined in vite.config.ts, which imports this module and
 * passes the resolved env record (from Vite's loadEnv). This guarantees that
 * crawlers which do NOT execute JavaScript still receive correct metadata.
 *
 * At runtime, react-helmet-async overrides these tags with the same values
 * (see src/config/Metadata.ts, which reads from src/config/Identity.ts).
 *
 * Branding/identity comes from `src/config/Identity.ts` (static, code-based).
 * The ONLY env var still honored is `VITE_DOMAIN` (optional site-origin
 * override for local/staging deployments). This module stays PURE so it can be
 * imported from both the Vite Node config AND the browser app code.
 */

import {
  BRAND_NAME,
  OWNER_NAME,
  JOB_TITLE,
  HEADLINE,
  COUNTRY,
  COUNTRY_CODE,
  CONTACT_EMAIL,
  TWITTER_HANDLE,
  GA_MEASUREMENT_ID,
  SITE_ORIGIN,
} from "./Identity";

/** Env record – either Vite's `import.meta.env` or the object from `loadEnv`. */
export type EnvRecord = Record<string, string | boolean | undefined>;

export interface HeadConfig {
  lang: string;
  title: string;
  /** Owner's full name (used in JSON-LD Person). */
  ownerName: string;
  /** Owner's job title. */
  jobTitle: string;
  description: string;
  keywords: string;
  author: string;
  contactEmail: string;
  themeColor: string;
  applicationName: string;
  geoRegion: string;
  geoPlaceName: string;
  canonical: string;
  og: {
    type: string;
    siteName: string;
    url: string;
    title: string;
    description: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
    locale: string;
    alternateLocale: string;
  };
  twitter: {
    card: string;
    site: string;
    creator: string;
    url: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  icons: {
    favicon: string;
    appleTouch: string;
  };
  /** Google Analytics measurement ID; empty disables the snippet. */
  gaMeasurementId: string;
}

/** Build a normalised absolute origin from a domain (protocol optional). */
export const normalizeOrigin = (raw?: string): string => {
  const value = (raw || "").trim().replace(/\/+$/, "");
  if (!value) return "https://example.com";
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
};

/** Derive the full head configuration from the static identity config. */
export const buildHeadConfig = (env: EnvRecord = {}): HeadConfig => {
  const str = (k: string, fallback = ""): string => {
    const v = env[k];
    return v === undefined || v === null ? fallback : String(v);
  };

  // Identity is code-based; only the domain may be overridden via env.
  const brand = BRAND_NAME;
  const jobTitle = JOB_TITLE;
  const ownerName = OWNER_NAME;
  const headline = HEADLINE;
  const origin = normalizeOrigin(str("VITE_DOMAIN") || SITE_ORIGIN);
  const title = `${brand} - ${jobTitle}`.trim();

  const keywords = [
    brand,
    ownerName,
    `AI Engineer ${COUNTRY}`,
    `Software Engineer ${COUNTRY}`,
    `Full Stack Developer ${COUNTRY}`,
    `web developer ${COUNTRY}`,
    `programmer ${COUNTRY}`,
    `freelance web developer ${COUNTRY}`,
    `jasa pembuatan website ${COUNTRY}`,
    `jasa pembuatan aplikasi ${COUNTRY}`,
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Node.js Developer",
    "Express Developer",
    "Laravel Developer",
    "AI automation developer",
    "AI integration developer",
    "OpenAI developer",
    "Google Gemini developer",
    "business system developer",
    "e-commerce developer",
    "landing page developer",
    "web application developer",
    "portfolio website developer",
    "REST API developer",
    "PostgreSQL developer",
    "MySQL developer",
    "Tailwind CSS developer",
    "UI/UX developer",
    "software engineer portfolio",
    "hire full stack developer",
    "remote software engineer",
  ].join(", ");

  return {
    lang: "en",
    title,
    ownerName,
    jobTitle,
    description: headline,
    keywords,
    author: brand,
    contactEmail: CONTACT_EMAIL,
    themeColor: "#000000",
    applicationName: brand,
    geoRegion: COUNTRY_CODE,
    geoPlaceName: COUNTRY,
    canonical: `${origin}/`,
    og: {
      type: "profile",
      siteName: brand,
      url: `${origin}/`,
      title,
      description: headline,
      image: `${origin}/icon.webp`,
      imageWidth: 1841,
      imageHeight: 1841,
      imageAlt: brand,
      locale: "en_US",
      alternateLocale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      url: `${origin}/`,
      title,
      description: headline,
      image: `${origin}/icon.webp`,
      imageAlt: brand,
    },
    icons: {
      favicon: "/favicon.ico",
      appleTouch: "/icon.webp",
    },
    gaMeasurementId: GA_MEASUREMENT_ID,
  };
};

/** Escape a string for safe use inside an HTML attribute. */
const escapeAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Render the `<head>` inner HTML string from a HeadConfig. */
export const renderHeadHtml = (cfg: HeadConfig): string => {
  const a = escapeAttr;
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Career", path: "/career" },
    { name: "Projects", path: "/projects" },
    { name: "Certification", path: "/certification" },
    { name: "Linktree", path: "/linktree" },
    { name: "Contact", path: "/talk" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${cfg.canonical}#website`,
        url: cfg.canonical.replace(/\/$/, ""),
        name: cfg.applicationName,
        alternateName: `${cfg.ownerName} Portfolio`,
        inLanguage: ["en", "id"],
        author: { "@id": `${cfg.canonical}#person` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${cfg.canonical}projects?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Person",
        "@id": `${cfg.canonical}#person`,
        name: cfg.ownerName,
        alternateName: cfg.applicationName,
        jobTitle: cfg.jobTitle,
        description: cfg.description,
        url: cfg.canonical.replace(/\/$/, ""),
        image: cfg.og.image,
        email: cfg.contactEmail ? `mailto:${cfg.contactEmail}` : undefined,
        address: { "@type": "PostalAddress", addressCountry: cfg.geoRegion },
      },
      ...navLinks.map((item, i) => ({
        "@type": "SiteNavigationElement",
        position: i + 1,
        name: item.name,
        url: `${cfg.canonical.replace(/\/$/, "")}${item.path === "/" ? "/" : item.path}`,
      })),
    ],
  };

  const ga = cfg.gaMeasurementId
    ? `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${a(cfg.gaMeasurementId)}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ${JSON.stringify(cfg.gaMeasurementId)});
    </script>`
    : "";

  return `
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="${a(cfg.icons.favicon)}" />
    <link rel="apple-touch-icon" href="${a(cfg.icons.appleTouch)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Preload the brand font so text paints without a late swap-in -->
    <link rel="preload" href="${a("/font/Ginto.ttf")}" as="font" type="font/ttf" crossorigin />

    <!-- Generated at build time from src/config/Head.ts -->
    <title>${cfg.title}</title>
    <meta name="title" content="${a(cfg.title)}" />
    <meta name="description" content="${a(cfg.description)}" />
    <meta name="keywords" content="${a(cfg.keywords)}" />
    <meta name="author" content="${a(cfg.author)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="theme-color" content="${a(cfg.themeColor)}" />
    <meta name="application-name" content="${a(cfg.applicationName)}" />
    <meta name="geo.region" content="${a(cfg.geoRegion)}" />
    <meta name="geo.placename" content="${a(cfg.geoPlaceName)}" />
    <link rel="canonical" href="${a(cfg.canonical)}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${a(cfg.og.type)}" />
    <meta property="og:site_name" content="${a(cfg.og.siteName)}" />
    <meta property="og:url" content="${a(cfg.og.url)}" />
    <meta property="og:title" content="${a(cfg.og.title)}" />
    <meta property="og:description" content="${a(cfg.og.description)}" />
    <meta property="og:image" content="${a(cfg.og.image)}" />
    <meta property="og:image:secure_url" content="${a(cfg.og.image)}" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content="${cfg.og.imageWidth}" />
    <meta property="og:image:height" content="${cfg.og.imageHeight}" />
    <meta property="og:image:alt" content="${a(cfg.og.imageAlt)}" />
    <meta property="og:locale" content="${a(cfg.og.locale)}" />
    <meta property="og:locale:alternate" content="${a(cfg.og.alternateLocale)}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="${a(cfg.twitter.card)}" />
    <meta name="twitter:site" content="${a(cfg.twitter.site)}" />
    <meta name="twitter:creator" content="${a(cfg.twitter.creator)}" />
    <meta name="twitter:url" content="${a(cfg.twitter.url)}" />
    <meta name="twitter:title" content="${a(cfg.twitter.title)}" />
    <meta name="twitter:description" content="${a(cfg.twitter.description)}" />
    <meta name="twitter:image" content="${a(cfg.twitter.image)}" />
    <meta name="twitter:image:alt" content="${a(cfg.twitter.imageAlt)}" />

    <!-- Baseline structured data for crawlers that do not execute JS -->
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>${ga}
  `;
};

/** Public routes exposed to crawlers (used by sitemap.xml + JSON-LD nav). */
export const NAV_PAGES: Array<{
  name: string;
  path: string;
  changefreq: string;
  priority: string;
  /** Route-specific SEO, emitted into the static per-route HTML head. */
  title: string;
  description: string;
  keywords: string[];
}> = [
  {
    name: "Home",
    path: "/",
    changefreq: "weekly",
    priority: "1.0",
    title: `${BRAND_NAME} - AI & Software Engineer, Full Stack Developer`,
    description:
      `${BRAND_NAME} is an AI and software engineer from ${COUNTRY} building full stack web apps, AI automation, and business systems.`,
    keywords: [
      `${BRAND_NAME} portfolio`,
      `AI engineer ${COUNTRY}`,
      `hire software engineer ${COUNTRY}`,
    ],
  },
  {
    name: "Projects",
    path: "/projects",
    changefreq: "weekly",
    priority: "0.9",
    title: `Projects Portfolio - Web, AI & Business Apps - ${BRAND_NAME}`,
    description:
      `Searchable portfolio of applications built by ${BRAND_NAME}: AI automation, web apps, business systems, e-commerce, and landing pages.`,
    keywords: [
      `${BRAND_NAME} projects`,
      "web development portfolio",
      "AI automation projects",
      "React project showcase",
    ],
  },
  {
    name: "Career",
    path: "/career",
    changefreq: "monthly",
    priority: "0.8",
    title: `Career Timeline & Work Experience - ${BRAND_NAME}`,
    description:
      `Year-by-year work history of ${BRAND_NAME}: engineering roles, company projects, technical responsibilities, and leadership milestones in tech.`,
    keywords: [
      `${BRAND_NAME} career`,
      "software engineer work experience",
      `developer timeline ${COUNTRY}`,
    ],
  },
  {
    name: "Certification",
    path: "/certification",
    changefreq: "monthly",
    priority: "0.7",
    title: `Certifications & Credentials - ${BRAND_NAME}`,
    description:
      `Verified professional and academic certificates held by ${BRAND_NAME}, including cloud and software engineering credentials with issue dates.`,
    keywords: [
      `${BRAND_NAME} certificates`,
      `developer certifications ${COUNTRY}`,
      "AWS Academy certificate",
    ],
  },
  {
    name: "Contact",
    path: "/talk",
    changefreq: "yearly",
    priority: "0.7",
    title: `Contact & Hire - Project Inquiries - ${BRAND_NAME}`,
    description:
      `Send a project brief to ${BRAND_NAME} by form, WhatsApp, or email. Replies within 24 hours, GMT+7 (WIB), in English or Bahasa ${COUNTRY}.`,
    keywords: [
      `contact ${BRAND_NAME}`,
      `hire full stack developer ${COUNTRY}`,
      "freelance web developer inquiry",
    ],
  },
  {
    name: "Linktree",
    path: "/linktree",
    changefreq: "monthly",
    priority: "0.6",
    title: `Social Links & Profiles - ${BRAND_NAME}`,
    description:
      `One page with every official ${BRAND_NAME} profile: Instagram, TikTok, YouTube, LinkedIn, GitHub, plus direct WhatsApp and email contact routes.`,
    keywords: [
      `${BRAND_NAME} links`,
      `${BRAND_NAME} instagram`,
      `${BRAND_NAME} github`,
      `${BRAND_NAME} linkedin`,
    ],
  },
  {
    name: "Kanban",
    path: "/kanban",
    changefreq: "monthly",
    priority: "0.5",
    title: `Kanban Board Management System - ${BRAND_NAME}`,
    description:
      `An interactive Kanban board for managing tasks across a five-stage workflow with drag and drop, priority badges, and progressive outreach counters.`,
    keywords: [
      `${BRAND_NAME} kanban`,
      "kanban board",
      "task management system",
      "drag and drop board",
    ],
  },
];

/**
 * Render a route-specific `<head>` for the static prerender pass. Crawlers that
 * do not execute JS receive a unique title/description/canonical/JSON-LD per
 * route instead of the single shared shell.
 */
export const renderRouteHeadHtml = (
  cfg: HeadConfig,
  route: (typeof NAV_PAGES)[number]
): string => {
  const a = escapeAttr;
  const origin = cfg.canonical.replace(/\/$/, "");
  const canonical = `${origin}${route.path === "/" ? "/" : route.path}`;
  const keywords = [...route.keywords, cfg.keywords].join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: cfg.applicationName,
        alternateName: `${cfg.ownerName} Portfolio`,
        inLanguage: ["en", "id"],
        author: { "@id": `${origin}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${origin}/#person`,
        name: cfg.ownerName,
        alternateName: cfg.applicationName,
        jobTitle: cfg.jobTitle,
        description: cfg.description,
        url: origin,
        image: cfg.og.image,
        email: cfg.contactEmail ? `mailto:${cfg.contactEmail}` : undefined,
        address: { "@type": "PostalAddress", addressCountry: cfg.geoRegion },
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: route.title,
        description: route.description,
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${origin}/#person` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement:
          route.path === "/"
            ? [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${origin}/`,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${origin}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: route.name,
                  item: canonical,
                },
              ],
      },
    ],
  };

  return `
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="${a(cfg.icons.favicon)}" />
    <link rel="apple-touch-icon" href="${a(cfg.icons.appleTouch)}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preload" href="${a("/font/Ginto.ttf")}" as="font" type="font/ttf" crossorigin />
    <title>${a(route.title)}</title>
    <meta name="title" content="${a(route.title)}" />
    <meta name="description" content="${a(route.description)}" />
    <meta name="keywords" content="${a(keywords)}" />
    <meta name="author" content="${a(cfg.author)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="theme-color" content="${a(cfg.themeColor)}" />
    <meta name="application-name" content="${a(cfg.applicationName)}" />
    <meta name="geo.region" content="${a(cfg.geoRegion)}" />
    <meta name="geo.placename" content="${a(cfg.geoPlaceName)}" />
    <link rel="canonical" href="${a(canonical)}" />

    <meta property="og:type" content="${route.path === "/" ? "profile" : "website"}" />
    <meta property="og:site_name" content="${a(cfg.og.siteName)}" />
    <meta property="og:url" content="${a(canonical)}" />
    <meta property="og:title" content="${a(route.title)}" />
    <meta property="og:description" content="${a(route.description)}" />
    <meta property="og:image" content="${a(cfg.og.image)}" />
    <meta property="og:image:secure_url" content="${a(cfg.og.image)}" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content="${cfg.og.imageWidth}" />
    <meta property="og:image:height" content="${cfg.og.imageHeight}" />
    <meta property="og:image:alt" content="${a(cfg.og.imageAlt)}" />
    <meta property="og:locale" content="${a(cfg.og.locale)}" />
    <meta property="og:locale:alternate" content="${a(cfg.og.alternateLocale)}" />

    <meta name="twitter:card" content="${a(cfg.twitter.card)}" />
    <meta name="twitter:site" content="${a(cfg.twitter.site)}" />
    <meta name="twitter:creator" content="${a(cfg.twitter.creator)}" />
    <meta name="twitter:url" content="${a(canonical)}" />
    <meta name="twitter:title" content="${a(route.title)}" />
    <meta name="twitter:description" content="${a(route.description)}" />
    <meta name="twitter:image" content="${a(cfg.twitter.image)}" />
    <meta name="twitter:image:alt" content="${a(cfg.twitter.imageAlt)}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
    </script>`;
};

/** Escape a string for safe use inside XML text/attributes (sitemap). */
const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** Render sitemap.xml from the configured origin (no hardcoded domain). */
export const renderSitemap = (cfg: HeadConfig, lastmod?: string): string => {
  const o = cfg.canonical.replace(/\/$/, "");
  // Default to the build date (ISO yyyy-mm-dd) so crawlers see fresh lastmod
  // without a hardcoded value that inevitably goes stale.
  const date = lastmod || new Date().toISOString().slice(0, 10);
  const urls = NAV_PAGES.map(
    (p) => `  <url>
    <loc>${escapeXml(`${o}${p.path === "/" ? "/" : p.path}`)}</loc>
    <lastmod>${escapeXml(date)}</lastmod>
    <changefreq>${escapeXml(p.changefreq)}</changefreq>
    <priority>${escapeXml(p.priority)}</priority>${
      p.path === "/"
        ? `
    <image:image>
      <image:loc>${escapeXml(`${o}/icon.webp`)}</image:loc>
      <image:title>${escapeXml(cfg.title)}</image:title>
    </image:image>`
        : ""
    }
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
};

/**
 * Render .well-known/security.txt (RFC 9116) from the configured origin.
 * `expires` defaults to roughly one year out; callers may override it.
 */
export const renderSecurityTxt = (cfg: HeadConfig, expires?: string): string => {
  const o = cfg.canonical.replace(/\/$/, "");
  const expiry = expires || "2027-09-23T00:00:00.000Z";
  return `Contact: mailto:${cfg.contactEmail}
Expires: ${expiry}
Preferred-Languages: en, id
Canonical: ${o}/.well-known/security.txt
`;
};

/** Render robots.txt from the configured origin (no hardcoded domain). */
export const renderRobots = (cfg: HeadConfig): string => {
  const o = cfg.canonical.replace(/\/$/, "");
  return `User-agent: *
Allow: /

# Answer engine crawlers
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${o}/sitemap.xml
`;
};

export default buildHeadConfig;
