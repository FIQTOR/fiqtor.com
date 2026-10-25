/**
 * Cloudflare Pages Functions middleware — correct asset 404s for an SPA.
 *
 * WHY THIS EXISTS
 * ---------------
 * This is a single-page app, so Cloudflare Pages runs its SPA fallback
 * (`/* /index.html 200` in `public/_redirects`): any request that does not
 * match a static file is answered with the root `index.html` and HTTP 200.
 * That is what makes deep links work, including the unknown ones that the
 * router turns into a client-side 404.
 *
 * The problem: the fallback catches EVERY unmatched path — including requests
 * that clearly want a file, such as `/img/projects/typo.webp` or
 * `/assets/missing.js`. Those get `200 text/html` instead of `404`, so the
 * browser downloads HTML where it expected an image or script and renders a
 * broken resource. Visually this looks like "all images are missing" as soon
 * as a single asset URL is wrong (typo, wrong case, stale filename, or a file
 * that failed to deploy).
 *
 * WHAT THIS DOES
 * --------------
 * Runs the normal request first (`context.next()` — the real asset is served
 * when it exists), then corrects the one case the fallback gets wrong: if the
 * request looks like a static file but the response came back as the HTML
 * shell, replace it with a genuine `404`. Client-side routes (no file
 * extension) are left untouched, so navigation still falls back to the shell.
 *
 * Ported verbatim from the v2 repo (`fiqtor.com`), where it fixed this in
 * production. It was NOT carried over when v3 was written, so dropping v2
 * without this file would have reintroduced the bug.
 *
 * NOTE: Pages picks this file up automatically from `functions/` in the
 * project root — no build wiring needed. It works with the Cloudflare Pages
 * Git integration, so it applies on every push.
 *
 * Docs: https://developers.cloudflare.com/pages/functions/middleware/
 */

/**
 * Paths that are files, not client-side routes.
 *
 * Keep this list exhaustive for v3: the build emits several extensionless
 * files that would otherwise be answered by the SPA shell with a wrong
 * content type. `llms.txt` has an extension and is covered by the generic
 * rule below; the extensionless ones are listed explicitly.
 */
function isAssetPath(pathname) {
  // Hashed build output.
  if (pathname.startsWith('/assets/')) return true;

  // Served from `public/`, but reachable without a conventional extension or
  // with a path that the generic "has a dot" rule does not always catch.
  if (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname.startsWith('/.well-known/') ||
    // Leftover Vercel Analytics endpoint: it must 404, never resolve to
    // the HTML shell (which the browser rejects as a bad MIME type).
    pathname.startsWith('/_vercel/')
  ) {
    return true;
  }

  // Final path segment carries a file extension (e.g. .webp, .woff2, .pdf,
  // .js, .css, .png, .svg, .ico, .json, .webmanifest). Client-side routes in
  // this project never contain a dot in their last segment.
  const lastSegment = pathname.split('/').pop() || '';
  return /\.[a-z0-9]+$/i.test(lastSegment);
}

/** True when a response is the SPA HTML shell. */
function isHtmlShell(response) {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('text/html');
}

export async function onRequest(context) {
  const response = await context.next();

  const { pathname } = new URL(context.request.url);

  // A real file was served (image/webp, application/javascript, …): keep it.
  if (!isAssetPath(pathname) || !isHtmlShell(response)) {
    return response;
  }

  // The request wanted a file, but Pages handed back the SPA shell because
  // the file does not exist. Return an honest 404 so the browser reports the
  // resource correctly instead of rendering HTML as an image.
  return new Response('Not Found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
