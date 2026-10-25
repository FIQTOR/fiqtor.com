#!/usr/bin/env bash
# ================================================================
# Post-deploy verification for the FIQTOR portfolio (v3).
#
#   bash scripts/verify-deploy.sh                 # check production
#   bash scripts/verify-deploy.sh https://staging.fiqtor.com
#
# Run this immediately after a Cloudflare Pages deploy. It asserts the things
# that have silently broken before (missing viewport → unreadable on mobile,
# lost prerendered route shells, 404 on legacy URLs, CSP-blocked analytics)
# instead of leaving them to be discovered by a visitor.
#
# Exit code 0 = everything passed. Any other code = at least one failure.
# ================================================================
set -uo pipefail

BASE="${1:-https://fiqtor.com}"
BASE="${BASE%/}"

PASS=0
FAIL=0
WARN=0
STATUS=""

green() { printf '\033[32m%s\033[0m\n' "$*"; }
red()   { printf '\033[31m%s\033[0m\n' "$*"; }
amber() { printf '\033[33m%s\033[0m\n' "$*"; }
dim()   { printf '\033[2m%s\033[0m\n' "$*"; }

ok()   { PASS=$((PASS + 1)); green "  PASS  $*"; }
bad()  { FAIL=$((FAIL + 1)); red   "  FAIL  $*"; }
warn() { WARN=$((WARN + 1)); amber "  WARN  $*"; }

# fetch <path> -> body on stdout, status of the LAST fetch in $STATUS.
#
# `fetch` is normally called as `body=$(fetch "$route"); status_of`, which runs it in a
# subshell — an assignment inside it would be discarded. The status is
# therefore also written to a file, which the parent reads back.
STATUS_FILE=$(mktemp)
trap 'rm -f "$STATUS_FILE"' EXIT

fetch() {
  local path="$1"
  local tmp
  tmp=$(mktemp)
  local code
  # -L: Cloudflare Pages issues a 308 for "/projects" before serving
  # "/projects/", and a redirect chain is not a failure for a document.
  code=$(curl -sSL -o "$tmp" -w '%{http_code}' --max-time 20 "$BASE$path" 2>/dev/null)
  code=${code:-000}
  printf '%s' "$code" > "$STATUS_FILE"
  STATUS="$code"
  cat "$tmp"
  rm -f "$tmp"
}

# Re-read the status after `body=$(fetch ...)`; the subshell could not set it.
status_of() { STATUS=$(cat "$STATUS_FILE" 2>/dev/null); STATUS=${STATUS:-000}; }

echo "Verifying $BASE"
echo

# ---------------------------------------------------------------
echo "1. Documents (status + charset + viewport)"
# ---------------------------------------------------------------
for route in "/" "/projects" "/career" "/certificates" "/contact" "/linktree"; do
  body=$(fetch "$route"); status_of
  if [ "$STATUS" != "200" ]; then
    bad "$route -> HTTP $STATUS (expected 200)"
    continue
  fi
  ok "$route -> 200"

  # Without a viewport every mobile browser renders the page at 980px and the
  # whole layout is zoomed out. This was the single worst bug in v3.
  if ! printf '%s' "$body" | grep -qi 'name="viewport"'; then
    bad "  $route is missing <meta name=\"viewport\"> — unreadable on mobile"
  fi
  if ! printf '%s' "$body" | grep -qi 'charset'; then
    bad "  $route is missing <meta charset> — non-ASCII may be mojibaked"
  fi

  # Prerendered shells give a JS-less crawler the correct per-route title.
  # If Cloudflare's SPA fallback is serving index.html for everything, all
  # routes share the homepage title and this catches it.
  if [ "$route" != "/" ]; then
    title=$(printf '%s' "$body" | grep -o '<title>[^<]*' | head -1)
    if printf '%s' "$title" | grep -q 'FIQTOR — AI &amp; Software Engineer, Full Stack Developer'; then
      bad "  $route is serving the homepage shell (prerendered <head> lost)"
    fi
  fi
done
echo

# ---------------------------------------------------------------
echo "2. Legacy URL redirects"
# ---------------------------------------------------------------
for legacy in "/certification" "/certification/" "/certification/foo"; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$BASE$legacy" 2>/dev/null || echo "000")
  target=$(curl -sS -o /dev/null -w '%{redirect_url}' --max-time 20 "$BASE$legacy" 2>/dev/null || true)
  case "$code" in
    301|302|308) ok "$legacy -> $code $target" ;;
    200) warn "$legacy returned 200 — expected a redirect to /certificates" ;;
    *) bad "$legacy -> HTTP $code (expected 301 to /certificates)" ;;
  esac
done
echo

# ---------------------------------------------------------------
echo "3. Machine-readable files"
# ---------------------------------------------------------------
# path | expected content-type-ish fragment | required body substring
check_file() {
  local path="$1" want_type="$2" want_body="$3"
  local headers body
  headers=$(curl -sSI --max-time 20 "$BASE$path" 2>/dev/null || true)
  body=$(fetch "$path"); status_of
  if [ "$STATUS" != "200" ]; then
    bad "$path -> HTTP $STATUS"
    return
  fi
  if [ -n "$want_type" ] && ! printf '%s' "$headers" | grep -qi "$want_type"; then
    warn "$path served as unexpected content-type (wanted $want_type)"
  fi
  if [ -n "$want_body" ] && ! printf '%s' "$body" | grep -q "$want_body"; then
    bad "$path is missing expected content: $want_body"
    return
  fi
  ok "$path"
}

check_file "/robots.txt"            "text/plain"            "Sitemap:"
check_file "/sitemap.xml"           "xml"                   "<urlset"
check_file "/llms.txt"              "text/plain"            "# FIQTOR"
check_file "/llms-full.txt"         "text/plain"            "Full record"
check_file "/manifest.webmanifest"  "json"                  "short_name"
check_file "/.well-known/security.txt" "text/plain"        "Contact:"

if ! fetch "/robots.txt" | grep -q "GPTBot"; then
  warn "robots.txt does not explicitly allow AI crawlers (GEO signal weakened)"
fi
echo

# ---------------------------------------------------------------
echo "4. Security headers"
# ---------------------------------------------------------------
hdrs=$(curl -sSI --max-time 20 "$BASE/" 2>/dev/null || true)
check_header() {
  if printf '%s' "$hdrs" | grep -qi "^$1:"; then
    ok "header $1"
  else
    bad "header $1 is missing"
  fi
}
check_header "strict-transport-security"
check_header "content-security-policy"
check_header "x-content-type-options"
check_header "x-frame-options"
check_header "referrer-policy"

if printf '%s' "$hdrs" | grep -qi '^content-security-policy:' &&
   ! printf '%s' "$hdrs" | grep -qi 'googletagmanager\.com'; then
  warn "CSP does not allow googletagmanager.com — GA4 will be blocked"
fi
echo

# ---------------------------------------------------------------
echo "5. Asset caching"
# ---------------------------------------------------------------
css=$(fetch "/" | grep -o '/assets/[^"]*\.css' | head -1)
if [ -n "$css" ]; then
  h=$(curl -sSI --max-time 20 "$BASE$css" 2>/dev/null || true)
  if printf '%s' "$h" | grep -qi 'immutable'; then
    ok "hashed asset sent with immutable cache ($css)"
  else
    warn "hashed asset $css is missing Cache-Control: immutable"
  fi
else
  warn "could not locate a hashed CSS asset on the homepage"
fi
echo

# ---------------------------------------------------------------
echo "6. Structured data (JSON-LD)"
# ---------------------------------------------------------------
for route in "/" "/contact" "/projects" "/certificates" "/career"; do
  body=$(fetch "$route"); status_of
  if printf '%s' "$body" | grep -q 'application/ld+json'; then
    ok "$route has JSON-LD"
  else
    bad "$route has no JSON-LD block"
  fi
done

# FAQPage must only appear where the page really renders the Q&A.
if fetch "/" | grep -q '"FAQPage"'; then ok "/ FAQPage present"; fi
if fetch "/contact" | grep -q '"FAQPage"'; then ok "/contact FAQPage present"; fi
if fetch "/certificates" | grep -q '"FAQPage"'; then
  bad "/certificates claims FAQPage but renders no FAQ block (rich-result policy)"
fi
echo

# ---------------------------------------------------------------
echo "7. Analytics wiring (informational)"
# ---------------------------------------------------------------
# gtag ships inside the hashed entry bundle, not in the HTML document.
main_js=$(fetch "/" | grep -o '/assets/[^"]*\.js' | head -1)
if [ -n "$main_js" ] && fetch "$main_js" | grep -q 'googletagmanager'; then
  ok "gtag initialisation found in $main_js"
else
  warn "gtag not found — GA4 is disabled (VITE_GA_ID empty?) or never shipped"
fi
echo

# ---------------------------------------------------------------
echo "----------------------------------------"
if [ "$FAIL" -eq 0 ]; then
  green "All checks passed ($PASS passed, $WARN warnings)."
else
  red "$FAIL check(s) failed ($PASS passed, $WARN warnings)."
fi
echo "----------------------------------------"
[ "$FAIL" -eq 0 ]
