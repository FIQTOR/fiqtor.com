import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import MetadataConfig, {
  PageMetadata,
  SITE_IMAGE,
  absoluteUrl,
  buildStructuredData,
  getPageMetaByPath,
} from "@/config/Metadata";
import type { PageKey } from "@/config/Metadata";
import { BRAND_NAME } from "@/config/Identity";

interface HelmetContainerProps {
  /** Explicit registry key. Omit to resolve from the current route. */
  page?: PageKey;
  /** Overrides the registry title. Brand suffix is appended automatically. */
  title?: string;
  /** Overrides the registry description. */
  description?: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
}

const BRAND = BRAND_NAME;

export default function HelmetContainer({
  page,
  title,
  description,
  keywords,
  canonical,
  noindex,
}: HelmetContainerProps) {
  const { pathname } = useLocation();

  const meta =
    (page ? PageMetadata[page] : getPageMetaByPath(pathname)) ??
    PageMetadata.notFound;

  const pageTitle = title
    ? title.includes(BRAND)
      ? title
      : `${title} - ${BRAND}`
    : meta.title;

  const pageDescription = description || meta.description;
  const canonicalUrl = canonical ? absoluteUrl(canonical) : absoluteUrl(meta.path);
  const pageKeywords = (
    keywords ?? [...meta.keywords, ...MetadataConfig.keywords]
  ).join(", ");
  const isNoindex = noindex ?? meta.noindex ?? false;
  const imageUrl = absoluteUrl(SITE_IMAGE.url);

  return (
    <Helmet prioritizeSeoTags>
      {/* Basic HTML Meta Tags */}
      <html lang="en" />
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={MetadataConfig.creator} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Entity summary for generative / answer engines (GEO & AEO) */}
      <meta name="abstract" content={meta.answer} />
      <meta name="subject" content={MetadataConfig.category} />

      {/* OpenGraph Tags */}
      <meta property="og:site_name" content={MetadataConfig.openGraph.siteName} />
      <meta
        property="og:type"
        content={meta.schemaType === "ProfilePage" ? "profile" : "website"}
      />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content={SITE_IMAGE.type} />
      <meta property="og:image:width" content={String(SITE_IMAGE.width)} />
      <meta property="og:image:height" content={String(SITE_IMAGE.height)} />
      <meta property="og:image:alt" content={SITE_IMAGE.alt} />
      <meta property="og:locale" content={MetadataConfig.openGraph.locale} />
      {MetadataConfig.openGraph.alternateLocale.map((locale) => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={MetadataConfig.twitter.card} />
      <meta name="twitter:site" content={MetadataConfig.twitter.site} />
      <meta name="twitter:creator" content={MetadataConfig.twitter.creator} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={SITE_IMAGE.alt} />

      {/* Robots & Theme Settings */}
      <meta
        name="robots"
        content={
          isNoindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta name="theme-color" content={MetadataConfig.other["theme-color"]} />
      <meta name="geo.region" content={MetadataConfig.other["geo.region"]} />
      <meta name="geo.placename" content={MetadataConfig.other["geo.placename"]} />

      {/* Structured Data (JSON-LD graph) */}
      <script type="application/ld+json">
        {JSON.stringify(buildStructuredData(meta, canonicalUrl))}
      </script>
    </Helmet>
  );
}
