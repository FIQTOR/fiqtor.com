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

  return {
    lang: "en",
    title,
    ownerName,
    jobTitle,
    description: headline,
    keywords: [brand, ownerName].filter(Boolean).join(", "),
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
}> = [
  { name: "Home", path: "/", changefreq: "weekly", priority: "1.0" },
  { name: "Projects", path: "/projects", changefreq: "weekly", priority: "0.9" },
  { name: "Career", path: "/career", changefreq: "monthly", priority: "0.8" },
  { name: "Certification", path: "/certification", changefreq: "monthly", priority: "0.7" },
  { name: "Contact", path: "/talk", changefreq: "yearly", priority: "0.7" },
  { name: "Linktree", path: "/linktree", changefreq: "monthly", priority: "0.6" },
];

/** Render sitemap.xml from the configured origin (no hardcoded domain). */
export const renderSitemap = (cfg: HeadConfig, lastmod?: string): string => {
  const o = cfg.canonical.replace(/\/$/, "");
  const date = lastmod || "2026-01-01";
  const urls = NAV_PAGES.map(
    (p) => `  <url>
    <loc>${o}${p.path === "/" ? "/" : p.path}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${
      p.path === "/"
        ? `
    <image:image>
      <image:loc>${o}/icon.webp</image:loc>
      <image:title>${cfg.title}</image:title>
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
