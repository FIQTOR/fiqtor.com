import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  buildSeoConfig,
  buildJsonLd,
  canonicalFor,
  routeByPath,
  ROUTES,
  type RouteSeo,
} from '../config/Seo';

/**
 * Runtime <head> management for SPA navigation. The build-time plugin bakes
 * the same tags into every prerendered route, so a hard refresh is correct
 * even before React hydrates; this component keeps them in sync afterwards.
 */
const cfg = buildSeoConfig({
  VITE_DOMAIN: import.meta.env.VITE_DOMAIN,
  VITE_GA_ID: import.meta.env.VITE_GA_ID,
});

const NOT_FOUND: RouteSeo = {
  path: '/404',
  label: 'Not Found',
  crumb: 'Not found',
  title: `Page Not Found — ${cfg.brand}`,
  description: `This URL does not exist on ${new URL(cfg.origin).hostname}. Return to the homepage or report the broken link.`,
  keywords: [],
  priority: '0',
  changefreq: 'yearly',
  noindex: true,
};

export function Seo() {
  const { pathname } = useLocation();
  const route = routeByPath(pathname) ?? NOT_FOUND;
  const canonical = canonicalFor(cfg, route.path);

  return (
    <Helmet>
      <html lang="en" />
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <meta name="keywords" content={route.keywords.join(', ')} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={route.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />

      {/* The language is a query parameter, not a separate URL document
          (`/id/...` does not exist), so the only hreflang the site can honour
          is `x-default`. Emitting an `id` alternate that resolves to the same
          English document is a contradiction and Search Console reports it as
          "Duplicate hreflang" / "Return tag does not match" — the correct
          signal for a single-document site is simply to omit it. */}
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      <meta property="og:type" content={route.path === '/' ? 'profile' : 'website'} />
      <meta property="og:site_name" content={cfg.brand} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:image" content={cfg.origin + cfg.image.url} />
      <meta property="og:image:secure_url" content={cfg.origin + cfg.image.url} />
      <meta property="og:image:type" content={cfg.image.type} />
      <meta property="og:image:width" content={String(cfg.image.width)} />
      <meta property="og:image:height" content={String(cfg.image.height)} />
      <meta property="og:image:alt" content={cfg.image.alt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={cfg.twitter} />
      <meta name="twitter:creator" content={cfg.twitter} />
      <meta name="twitter:title" content={route.title} />
      <meta name="twitter:description" content={route.description} />
      <meta name="twitter:image" content={cfg.origin + cfg.image.url} />
      <meta name="twitter:image:alt" content={cfg.image.alt} />

      <script type="application/ld+json">{JSON.stringify(buildJsonLd(cfg, route))}</script>
    </Helmet>
  );
}

/** Absolute URL helper shared by the UI (e.g. share buttons). */
export const siteOrigin = cfg.origin;

/** Every public route — used by the sitemap/footer link list. */
export const SITE_ROUTES = ROUTES;
