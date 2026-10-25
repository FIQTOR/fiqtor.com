/**
 * Backend API base URL — single source of truth for every fetch.
 *
 * The value comes from the build-time env var `VITE_API_BASE_URL` (e.g.
 * `https://api.fiqtor.com/api`). Because Vite inlines `import.meta.env.*`
 * LITERALLY at build time, a missing variable used to compile to the string
 * `"undefined"`, so requests silently went to `https://<site>/undefined/v1/...`
 * (which the SPA fallback answers with HTML → every fetch "succeeded" with no
 * data and each component quietly showed its fallback). We now validate once,
 * at module load, so a misconfigured build fails loudly instead.
 */

/** Strip a single pair of wrapping quotes and any trailing slashes. */
function normalizeBaseUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";

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
  return value.replace(/\/+$/, "");
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);

/**
 * True when the base URL is genuinely usable. Guards against:
 *   - the variable being unset (inlined as `undefined` or left as a literal
 *     `"${VITE_API_BASE_URL}"` placeholder),
 *   - an empty / whitespace-only value,
 *   - a value that is not an absolute http(s) URL.
 */
export const isApiBaseUrlValid =
  API_BASE_URL !== "" &&
  API_BASE_URL !== "undefined" &&
  !API_BASE_URL.includes("${") &&
  /^https?:\/\//i.test(API_BASE_URL);

if (!isApiBaseUrlValid) {
  // Fail loudly during development so the cause is obvious. In production we
  // still throw: a broken API base URL means EVERY data fetch is broken, so a
  // hard error is preferable to a page full of silent fallbacks. The message
  // is written to be actionable for whoever misconfigured the deploy.
  const detail =
    rawBaseUrl === undefined
      ? "VITE_API_BASE_URL is undefined (it was not set at build time)."
      : `VITE_API_BASE_URL is invalid: "${String(rawBaseUrl)}".`;

  throw new Error(
    `${detail} Set it to an absolute URL (e.g. https://api.fiqtor.com/api) in the ` +
      `deployment environment (Cloudflare Pages → Settings → Environment ` +
      `variables) and rebuild — Vite inlines this value at build time.`,
  );
}

/**
 * Normalized backend API base URL, WITHOUT a trailing slash. Use it as:
 *   `${API_BASE_URL}/v1/wakatime`
 */
export { API_BASE_URL };

export default API_BASE_URL;
