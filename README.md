# 🎨 Frontend — Portfolio SPA

React 19 + TypeScript + Vite single-page app for the portfolio. Branding, identity and SEO metadata are configuration-driven (code in `src/config/`, plus a few env vars), so the project doubles as a reusable template.

> 🔗 See the [root README](../README.md) for full-stack setup and configuration.

## ✨ Features

- ⚡ **Vite + React 19** with TypeScript (strict) and HMR.
- 🎨 **Tailwind CSS v4** (`@tailwindcss/vite`) + Framer Motion animations, dark/light theme.
- 🧭 **File-based routing** via `vite-plugin-pages` (`src/pages/*.tsx`).
- 🔍 **Config-driven SEO** — `<head>`, OpenGraph, Twitter, JSON-LD, `sitemap.xml`, and `robots.txt` are **generated at build time** from `src/config/Head.ts` + `src/config/Identity.ts`.
- 🤖 **AI Assistant (`src/components/AIHelper.tsx`)** — streaming chat with:
  - 🎙️ **Voice dictation** — Web Speech API transcribes speech straight into the composer textarea (append mode, auto-stops on close).
  - 📎 **Attachment type picker** — a popup to choose **Image / Video / Document** before opening the file dialog (max 4.5MB; drag-and-drop also supported).
  - A 4-bar equalizer animation while listening, copy & regenerate actions, and a dimmed + blurred backdrop (with a width-stable scroll lock) while the panel is open.
- 🖼️ **Interactive widgets** — contact form (reCAPTCHA), live GitHub/WakaTime stats, crypto widget.
- 🌐 **Fully configurable** — no personal data in component code; identity comes from `src/config/Identity.ts` and only a few `VITE_*` env vars.
- 🔐 **No secrets in the bundle** — crypto prices and social stats are fetched from *our backend* (static data); integration usernames live in `src/config/*.ts`. No third-party API key ever reaches the browser.

## 🛠 Tech Stack

- React 19, TypeScript, Vite, Tailwind CSS v4
- Framer Motion, GSAP, `react-helmet-async`, `react-router-dom`
- `ogl` (WebGL line waves), `animejs`, `lottie-web`
- Axios, `react-google-recaptcha`
- Icons: `react-icons`

## ✅ Prerequisites

- Node.js **24.x**, npm

## 📦 Installation

```bash
cd frontend
npm install
cp .env.example .env    # then edit .env with your values
```

## ▶️ Running

```bash
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # ESLint
```

Make sure the backend is running (`http://localhost:4000`) and `VITE_API_BASE_URL` matches it.

## ⚙️ Configuration

### Environment Variables (`frontend/.env`)

Only a handful of values remain in env — everything else is code-based. See [`.env.example`](.env.example).

> ⚠️ **Every `VITE_*` variable is embedded in the public browser bundle.** Never put secrets (API secrets, private tokens) behind a `VITE_` variable — keep those on the backend.

| Variable | Purpose |
|----------|---------|
| `VITE_DOMAIN` | Optional site-origin override (defaults to `SITE_ORIGIN` in `src/config/Identity.ts`) |
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_RECAPTCHA_SITE_KEY` | reCAPTCHA **site** key (never the secret) |
| `VITE_ENABLE_AI` | `TRUE` / `FALSE` to toggle AI features |

### Identity & branding (`src/config/Identity.ts`)

> ℹ️ Branding, owner identity, contact info, social URLs, resume paths, the company/business brand, the site origin and the Google Analytics ID are **code-based** (NOT env vars). Edit [`src/config/Identity.ts`](src/config/Identity.ts) and rebuild.

| Export | Controls |
|--------|----------|
| `BRAND_NAME`, `OWNER_NAME`, `OWNER_ALIAS`, `JOB_TITLE`, `HEADLINE` | Names / role / tagline |
| `YEARS_OF_EXPERIENCE`, `COUNTRY`, `COUNTRY_CODE`, `LANGUAGES` | Profile facts |
| `CONTACT_EMAIL`, `BUSINESS_EMAIL`, `CONTACT_PHONE`, `WHATSAPP_NUMBER`, `TWITTER_HANDLE` | Contact info |
| `SOCIAL_LINKS`, `RESUME`, `PORTRAIT_IMAGE` | Socials, resumes, portrait |
| `COMPANY` | Company/business brand (services & linktree) |
| `SITE_ORIGIN`, `GA_MEASUREMENT_ID` | Canonical origin & analytics |

> 🔐 **No API keys here.** Crypto prices (`/api/v1/crypto`) and social stats (`/api/v1/social/stats`) are fetched from the backend, which serves static data. Integration usernames also live in source, not env:
>
> | File | Controls |
> |------|----------|
> | `src/config/Github.ts` | GitHub username (profile link) |
> | `src/config/Wakatime.ts` | WakaTime username (profile link) |
>
> Social handles (Instagram, TikTok, YouTube, LinkedIn, GitHub) come from `SOCIAL_LINKS` in `src/config/Identity.ts`.

### Content (`src/data/`)

Replace the sample content with your own:

| File | Controls |
|------|----------|
| `projects.ts` | Project portfolio |
| `career.ts` | Work experience timeline |
| `certificate.ts` | Certificates & awards |
| `skills.ts` / `services.ts` | Skills & services |
| `menu.ts` | Navigation |
| `social.ts` | Social links (wired to `Identity.ts`) |

### Integration usernames (`src/config/`)

Public usernames are kept out of env and live in source, since they're not secrets and are edited far less often than env vars: `Github.ts`, `Wakatime.ts`. Social handles live in `SOCIAL_LINKS` inside `src/config/Identity.ts`. Secrets for those integrations stay on the **backend**.

### `<head>` / SEO generation

- `src/config/Head.ts` builds the `<head>` (title, meta, OG, Twitter, JSON-LD, GA) **and** `sitemap.xml` + `robots.txt`.
- The `htmlHeadPlugin` in `vite.config.ts` injects them at dev/build time.
- `index.html` is a minimal shell with a `<!--vite-html-head-->` marker — **don't edit it directly**; change `src/config/Identity.ts` (or the optional `VITE_DOMAIN`) instead.
- Origin defaults to `SITE_ORIGIN` in `src/config/Identity.ts`, optionally overridden via `VITE_DOMAIN`.

### Styling & layout notes

- **No horizontal scroll:** `html, body { overflow-x: clip }` in `src/index.css` guards against page-wide horizontal scroll from full-bleed / off-screen decorative elements. Use `w-full` (not `w-screen` / `100vw`, which includes the scrollbar width).
- **Stable layout width:** `html { scrollbar-gutter: stable }` permanently reserves the scrollbar space, so opening overlays that lock scrolling (e.g. the AI panel) never causes a layout shift.
- **Voice-input types:** the Web Speech API typings live in `src/vite-env.d.ts` (not in the default TS DOM lib).

## 📂 Project Structure

```
frontend/
├── public/            # static assets (img, pdf, favicon) — sitemap/robots are generated
├── src/
│   ├── components/    # shared UI components (incl. AIHelper.tsx, Footer.tsx)
│   ├── config/        # Identity, Metadata, Head, Github/Wakatime
│   ├── context/       # React contexts (theme, container, welcome)
│   ├── data/          # 📝 your content (projects, career, certificates…)
│   ├── layouts/       # layout wrappers
│   ├── modules/       # feature modules — page = folder
│   │   ├── home/      #   ├── sections/  (header, about, skills…) + components/ + index.tsx
│   │   ├── career/    #   └── components/ (CareerView.tsx)
│   │   ├── certification/  # certificates grid
│   │   ├── contact/   # contact form, recaptcha, response message
│   │   ├── linktree/  # linktree box
│   │   └── projects/  # projects grid
│   ├── pages/         # file-based routes (thin wrappers around modules)
│   ├── App.tsx
│   └── main.tsx
├── functions/         # Cloudflare Pages Functions — middleware for correct asset 404s
├── index.html         # minimal shell (head injected at build)
├── vite.config.ts     # htmlHeadPlugin (head + sitemap + robots)
├── wrangler.jsonc     # Cloudflare Pages config (optional; for CLI deploys)
└── .env.example
```

> 🧹 **Naming conventions:** shared `components/` and module files use **PascalCase** (`CareerView.tsx`); module sub-folders are `sections/` (page blocks) and `components/` (domain pieces); each page-module has an `index.tsx` entry.

## 🚢 Deployment

The project deploys to **Cloudflare Pages** (Git integration — auto-redeploys on every push) or **Vercel**. Both configs are committed and independent.

### Cloudflare Pages (recommended)

Pages builds `dist/` (`npm run build`) and serves it as static assets. Routing that a static config can't express lives in **Pages Functions**:

| File                          | Purpose                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `functions/_middleware.js`    | Returns a real `404` for missing files; leaves the SPA shell for real routes. |
| `public/_headers`             | Security headers (CSP, HSTS, X-Frame-Options, …) + asset cache policy.         |
| `public/_redirects`           | Kept rule-free on purpose (see note below) — add only real 301s here.          |
| `wrangler.jsonc`              | Optional: only for CLI deploys (`npm run deploy`); not needed for Git integration. |

> ⚠️ **Why the middleware is needed — the "all images broken" bug.**
> Pages' automatic SPA fallback answers **every** unmatched path with the root `index.html` (`200 text/html`) — including requests that clearly want a file, like `/img/projects/typo.webp` or `/assets/missing.js`. The browser then receives HTML where it expected an image/script and shows a **broken resource**, so a single wrong/stale/mis-cased asset URL looks like "all the images are gone".
> `functions/_middleware.js` runs the request normally (real files are served untouched), then replaces the one wrong case: a request that looks like a file but came back as the HTML shell becomes a genuine `404`. Client-side routes (no file extension) still fall back to the shell, so deep links keep working.
> Do **not** "fix" routing with a `/* /index.html 200` rule in `_redirects` — Cloudflare follows `_redirects` rules even when a static file exists, so a catch-all would clobber every prerendered `/<route>/index.html`.

**Cloudflare Pages Git integration (your setup).** Dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick this repo, and set:

- **Framework preset:** `None`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (this repo *is* the frontend)
- **Environment variables:** `VITE_DOMAIN`, `VITE_API_BASE_URL`, `VITE_RECAPTCHA_SITE_KEY`, `VITE_ENABLE_AI`, `VITE_SENTRY_DSN`

Every push then builds and redeploys automatically — including `functions/` and the copied `_headers` / `_redirects`.

**Custom domain.** Add `fiqtor.com` under **Pages project → Custom domains**, then point DNS at it (remove any record that still sends the domain to another host, e.g. Vercel). Until the domain is pointed at Pages, visitors keep hitting the old origin and none of this takes effect.

**CLI alternative** (optional — Git integration already deploys for you):

```bash
npx wrangler login
npm run deploy        # build + `wrangler pages deploy dist`
npm run preview:cf    # build + `wrangler pages dev dist` (real runtime + Functions)
```

⚠️ `VITE_*` values are baked into the **public** bundle — never put real secrets there.

### Vercel

`vercel.json` is committed (SPA rewrite that preserves `sitemap.xml` / `robots.txt` and excludes paths with a file extension, so assets are never swallowed by the SPA rule). Import the `frontend/` folder, set the same `VITE_*` vars, and deploy.

## 🔒 Security

- Never commit `.env` (gitignored) — only `.env.example` is tracked.
- `VITE_*` values are **public**; no secrets in the frontend.
- reCAPTCHA **secret** key belongs on the backend, never here.
- **No third-party API keys on the client.** Crypto/social data comes from the backend (static), and integration usernames live in `src/config/*.ts`. If you add a live provider later, proxy it through the backend.
- No hardcoded credentials in source — secrets live only in env on the backend; public identity lives in `src/config/`.

## 📄 License

ISC.
