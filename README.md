# FIQTOR Portfolio — v3

The third generation of my personal portfolio: **React 19 + TypeScript + Vite**, a
motion-rich single-page site with a **real content catalogue** (37 projects, 30 credentials,
4 roles) and **live integrations** (AI assistant, GitHub, WakaTime, crypto, social stats,
contact form).

Dark is the default theme; a **monochrome light theme** is one click away. The name shown to
visitors is **FIQTOR** — the legal name (*Taufiiqul Hakim*) appears only in the About section
and in structured data, so it stays findable without being the brand.

This is a separate repo from the previous frontend (`personal-website/frontend`), which is
untouched — v3 is a fresh rewrite in a new visual direction.

---

## Why v3

| | v2 (previous frontend) | **v3 (this repo)** |
| --- | --- | --- |
| Stack | Vite + React + Tailwind + shadcn-ish | Vite + React + hand-written CSS system |
| Look | Light/dark, card-heavy | Dark canvas, dot grid, oversized type |
| Motion | Framer Motion page fades | Column-curtain page transitions, GSAP hero, interactive dot portrait |
| Content | i18n dictionary, EN/ID toggle | Bilingual data (EN/ID) with a language switch |
| Integrations | AI chat, contact form, stats | Same, rebuilt on a streaming SSE client with graceful fallbacks |

The `/kanban` board is intentionally **not** part of v3.

---

## Quick start

```bash
npm install
cp .env.example .env        # set VITE_API_BASE_URL (and optionally reCAPTCHA)
npm run dev                 # http://localhost:5173
npm run build               # typecheck + production build → dist/
npm run preview             # serve the production build
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b` typecheck, then the production bundle |
| `npm run preview` | Preview `dist/` |
| `npm run lint` | oxlint |
| `npm run typecheck` | TypeScript project build (no emit) |

### Theme
`src/lib/theme.tsx` owns the theme state; `src/lib/themeBoot.ts` is the tiny inline script
injected into `<head>` at build time so a light-mode visitor never sees a dark flash. Both
themes are **monochrome** — the palette is a set of CSS custom properties on
`html[data-theme="dark"|"light"]` in `site.css`.

---

## Project structure

```
index.html                      # shell; <head> is injected at build time
vite.config.ts                  # React plugin + build-time SEO plugin
public/
  img/projects|career|certificate|cryptocurrency/   # all screenshots & logos
  pdf/                          # résumés
  icon.webp                     # portrait / OG image
  favicon.ico                   # tab icon (original artwork from the v1 portfolio)
  img/icons/                    # PWA icons: 192, 512, maskable, apple-touch
  _headers, _redirects          # Cloudflare Pages housekeeping
src/
  main.tsx                      # router (Home, Projects, Career, Certificates, Contact, Linktree, 404)
  styles/site.css               # the whole visual system (ported + v3 additions)
  config/
    Identity.ts                 # ★ brand, owner, contact, social URLs, résumé paths
    Api.ts                      # VITE_API_BASE_URL validation
    Features.ts                 # reCAPTCHA / AI feature flags
    Seo.ts                      # ★ per-route meta, JSON-LD (SEO/AEO/GEO), sitemap, robots,
                                #   llms.txt, llms-full.txt, manifest (PURE → also used by vite.config)
  data/
    site.ts                     # ★ the site object `S` (services, FAQ, linktree, career, normalized catalog)
    projects.ts                 # 37 projects (EN/ID) — unchanged content from v2
    certificates.ts             # 30 credentials — unchanged content from v2
    certificatesExtra.ts        # longer descriptions used in the detail modal
    certGroups.ts               # ★ certificate taxonomy: flagship order, groups, merged quiz bundles
    galleryLabels.ts            # screenshot captions
    portrait.ts                 # 6,586-particle portrait data
  components/
    Layout.tsx                  # providers + navbar/main/footer/modal shell
    Loader.tsx                  # initial loader + column-curtain page transitions
    Navbar.tsx                  # pill nav, Linktree icon link, language + theme switch, drawer
    Logo.tsx                    # brand mark (vector redraw of the previous icon) + <Brand />
    ThemeSwitch.tsx             # dark / light toggle
    Footer.tsx                  # menu, socials, live clock
    GlobalEffects.tsx           # custom cursor, spotlight, card tilt, magnetic buttons
    DotPortrait.tsx             # interactive canvas portrait
    Cards.tsx                   # project & certificate cards
    DetailModal.tsx             # project/certificate modal (uncropped 16:9 cover) + lightbox
    FilterGallery.tsx           # project filter + certificate gallery (flagship → grouped → search)
    Seo.tsx                     # react-helmet-async <head> for SPA navigation
    home/Hero.tsx               # GSAP hero intro + parallax
    home/HomeSections.tsx       # projects, services, about, GitHub heatmap, certificates, CTA
    home/LiveStats.tsx          # crypto / social / WakaTime / GitHub live panels
  lib/
    catalog.tsx                 # catalog modal state + LanguageProvider
    chat.tsx                    # AI assistant (SSE streaming, endpoint fallback, local answers)
    ui.tsx                      # toasts + motion/pointer preferences
    utils.ts                    # pure helpers (no JSX, importable from Node)
    utils.tsx                   # icon components + clipboard
    theme.tsx                   # dark/light provider
    themeBoot.ts                # pre-paint theme script (inlined into <head>)
  hooks/useReveal.tsx           # scroll reveal, interactive titles, count-up, typewriter
  pages/                        # one file per route
```

### Editing content

* **Identity / contact / socials** → `src/config/Identity.ts`
* **Services, FAQ, process, Linktree, career** → `src/data/site.ts`
* **Projects & certificates** → `src/data/projects.ts`, `src/data/certificates.ts`
* **Which certificates are "flagship" / how they are grouped** → `src/data/certGroups.ts`
* **Routes, page titles, FAQ answers, structured data** → `src/config/Seo.ts` (`ROUTES`, `FAQ`)

---

## Live integrations (backend contract)

All network calls go to `VITE_API_BASE_URL` (default `http://localhost:4000/api`) and degrade
gracefully — if the backend is down, the UI keeps working with local defaults.

| Feature | Endpoint | Notes |
| --- | --- | --- |
| AI assistant | `POST /v1/ai/generate` | Streams `text/event-stream`. Events: `{text}` tokens, `{type:'redirectLocal',url}`, `{type:'redirect',platform}` |
| Contact form | `POST /v1/contact/send` | JSON `{name,email,wa,type,budget,timeline,message,captcha}` |
| GitHub contributions | `GET /v1/github/contributions` | Live panel; the homepage heatmap uses the public contributions API directly |
| WakaTime | `GET /v1/wakatime` | `data.text` + `data.range.start_text` |
| Crypto prices | `GET /v1/crypto` | `{btc,eth,sol}` with `rate` + `delta.day|month` |
| Social stats | `GET /v1/social/stats` | TikTok / Instagram follower counts |

`/kanban` is not part of v3.

---

## SEO · AEO · GEO

Everything is generated from one pure module, `src/config/Seo.ts`, which is used twice: by
`vite.config.ts` at build time (static HTML per route) and by `<Seo />` at runtime (SPA
navigation).

**SEO**
* Per-route `<title>`, description, keywords, canonical, and OpenGraph/Twitter cards.
* `hreflang` for `en`, `id`, and `x-default` (every page carries the EN/ID switch).
* `sitemap.xml` with `xhtml:link` alternates, `robots.txt`, `.well-known/security.txt`,
  and a web app manifest.
* A static `/<route>/index.html` per route, so crawlers and hard refreshes get correct
  metadata without running JavaScript.

**AEO (answer engines)**
* `FAQPage` — 8 short, self-contained Q&As (who / what / where / experience / certificates /
  contact / international / stack). The same answers are rendered on `/contact` under
  *Quick answers* and in the *Key facts* block on the homepage.
* `HowTo` — the four-step engagement process.
* `ItemList` — services, the 37 projects, all 25 certificate entries, the career roles.
* `BreadcrumbList` on every route, `SpeakableSpecification` pointing at the headline, lead,
  identity line, and fact rows.

**GEO (generative engines)**
* `/llms.txt` — concise entity summary + page index + facts (llmstxt.org format).
* `/llms-full.txt` — the complete record: identity, skills, every project, career, every
  certificate, and citation guidance.
* `robots.txt` explicitly allows the named AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot,
  PerplexityBot, Google-Extended, Applebot-Extended, CCBot, and others) — being quotable is
  the point of a portfolio.
* `Person` JSON-LD carries the legal name as `additionalName`, `knowsAbout`, `hasCredential`,
  `award`, `subjectOf` (the résumé PDFs), and `sameAs` for every profile.

Deploy targets:

* **Cloudflare Pages** — build `npm run build`, output `dist` (see `public/_headers`, `_redirects`).
* **Vercel** — `vercel.json` includes the SPA rewrites and security headers.
* **Any static host** — serve `dist/` with an SPA fallback for unknown paths.

### Deploying to Cloudflare Pages

Dashboard settings (both must match `wrangler.jsonc`):

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |
| Node version | 20 or newer |

Environment variables — these are **inlined at build time**, so changing one
requires a redeploy, not just a restart:

| Variable | Example | Notes |
| --- | --- | --- |
| `VITE_DOMAIN` | `fiqtor.com` | Feeds canonical / OG / JSON-LD URLs |
| `VITE_API_BASE_URL` | `https://api.fiqtor.com/api` | Every live widget degrades gracefully if wrong |
| `VITE_ENABLE_AI` | `TRUE` | `false` hides the assistant FAB |
| `VITE_RECAPTCHA_SITE_KEY` | `6L…` | Empty = widget off (backend still rate-limits) |
| `VITE_GA_ID` | *(leave empty)* | Empty → falls back to `GA_MEASUREMENT_ID`; set `none` to disable |

After every deploy, verify the live site:

```bash
bash scripts/verify-deploy.sh                      # production
bash scripts/verify-deploy.sh https://staging…     # any other origin
```

It checks the failures that are invisible in a browser-free glance: a missing
`<meta name="viewport">` (the whole site renders zoomed-out on phones), lost
prerendered `<head>` per route, 404s on legacy URLs, missing security headers,
and CSP-blocked analytics. Exit code is non-zero on any failure.

**Legacy redirects.** v2 served `/certification`; v3 calls the page
`/certificates`. `public/_redirects` 301s the old path so inbound links and
existing Google results keep working — keep those rules above the SPA
fallback, because Cloudflare evaluates `_redirects` top-down.

---

## Accessibility & performance notes

* Respects `prefers-reduced-motion` (loader, hero intro, cursor effects and tilt all disable).
* Cursor/tilt/magnetic effects only run on precise-pointer devices.
* The interactive titles, reveal-on-scroll and count-ups are progressive: without JS the
  content is still visible.
* Pages that are heaviest (certificates, contact/reCAPTCHA) are lazy-loaded routes.
* Images are `loading="lazy"` with explicit dimensions to avoid layout shift.
* Mobile: 320–430px audited (tap targets ≥ 2.9rem, no horizontal overflow, iOS-safe input
  sizes, bottom-sheet modals, scroll-safe heatmap and galleries).
* The certificate page shows 9 flagship credentials first; the remaining records are grouped
  by type and one click away, and repeated quiz completions are merged into one card.

---

## License

MIT — see [LICENSE](./LICENSE).
