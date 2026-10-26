/**
 * Google Search Console ownership file — served at its EXACT `.html` URL.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Search Console's "HTML file" verification method asks you to upload a file
 * named `googled903a8563115dfcf.html` and then fetches
 * `https://fiqtor.com/googled903a8563115dfcf.html`, requiring a 200 whose body
 * is the token. The file itself is in `public/` and deploys fine, but
 * Cloudflare Pages has "clean URL" handling that ALWAYS answers `/foo.html`
 * with a 308 to `/foo`:
 *
 *     GET /googled903a8563115dfcf.html → 308  Location: /googled903a8563115dfcf
 *
 * A 308 is not a 200, so Google reports "Your verification file was not found
 * in the required location." `_redirects` cannot take the URL back either —
 * its rules are applied after the asset match, so the 308 wins first.
 *
 * A Pages Function, however, runs BEFORE static-asset resolution: this module
 * is mounted at the route `/googled903a8563115dfcf.html`, is matched on the
 * request path, and returns the token itself. The 308 never gets a chance to
 * fire and the exact URL answers 200.
 *
 * Pages maps `functions/<route>.js` to `/<route>`, so this one file is the
 * whole fix — no build wiring, and it applies on every push. The body is kept
 * byte-identical to `public/googled903a8563115dfcf.html`; if Google reissues
 * the token, update both (and rename this file to the new hash).
 *
 * The extension-less `/googled903a8563115dfcf` still works via the clean-URL
 * redirect, so nothing else changes.
 *
 * Docs: https://developers.cloudflare.com/pages/functions/routing/
 */

/** Exact token Google issued for this property. Must not be altered. */
const VERIFICATION_BODY = 'google-site-verification: googled903a8563115dfcf.html';

export async function onRequest() {
  return new Response(VERIFICATION_BODY, {
    status: 200,
    headers: {
      // Google reads the token as plain text; `text/html` matches what the
      // static file would have been served as.
      'Content-Type': 'text/html; charset=utf-8',
      // Never let an edge/browser cache serve a stale or empty body while the
      // property is being (re)verified.
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
