/**
 * Backend API base URL — the single source of truth for every fetch.
 *
 * The value comes from the build-time env var `VITE_API_BASE_URL` (e.g.
 * `https://api.fiqtor.com/api`). Vite inlines `import.meta.env.*` literally at
 * build time, so a missing variable can silently compile to the string
 * `"undefined"`. We validate it once, at module load, and expose
 * `isApiBaseUrlValid` so callers can degrade gracefully instead of requesting
 * `https://<site>/undefined/v1/...` (which an SPA fallback answers with HTML).
 */

/** Strip a single pair of wrapping quotes and any trailing slashes. */
function normalizeBaseUrl(raw: unknown): string {
  if (typeof raw !== 'string') return '';

  let value = raw.trim();

  // A common .env mistake is `VITE_API_BASE_URL='http://...'` — the quotes are
  // kept verbatim by dotenv and end up inside the URL. Remove wrapping quotes.
  if (
    value.length >= 2 &&
    ((value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"')))
  ) {
    value = value.slice(1, -1).trim();
  }

  // Drop trailing slash(es) so `${API_BASE_URL}/v1/...` never doubles up.
  return value.replace(/\/+$/, '');
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);

/**
 * True when the base URL is genuinely usable. Guards against:
 *   - the variable being unset (inlined as `undefined` or a `${...}` literal),
 *   - an empty / whitespace-only value,
 *   - a value that is not an absolute http(s) URL.
 */
export const isApiBaseUrlValid =
  API_BASE_URL !== '' &&
  API_BASE_URL !== 'undefined' &&
  !API_BASE_URL.includes('${') &&
  /^https?:\/\//i.test(API_BASE_URL);

if (!isApiBaseUrlValid) {
  // Loud in dev so the cause is obvious; in production the UI would otherwise
  // show every live widget as "unavailable", which is harder to diagnose.
  console.warn(
    `[api] VITE_API_BASE_URL is missing or invalid (${String(rawBaseUrl)}). ` +
      'Live features (AI chat, contact form, GitHub, WakaTime, crypto, social) ' +
      'will fall back to their local defaults. Set it in the deployment ' +
      'environment and rebuild — Vite inlines this value at build time.',
  );
}

/** Normalized backend API base URL, WITHOUT a trailing slash. */
export { API_BASE_URL };

export default API_BASE_URL;
