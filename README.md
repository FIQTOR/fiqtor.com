# 🎨 Frontend — Portfolio SPA

React 19 + TypeScript + Vite single-page app for the portfolio. Branding, identity and SEO metadata are configuration-driven (code in `src/config/`, plus a few env vars), so the project doubles as a reusable template.

> 🔗 See the [root README](../README.md) for full-stack setup and configuration.

## ✨ Features

- ⚡ **Vite + React 19** with TypeScript (strict) and HMR.
- 🎨 **Tailwind CSS v4** (`@tailwindcss/vite`) + Framer Motion animations, dark/light theme.
- 🧭 **File-based routing** via `vite-plugin-pages` (`src/pages/*.tsx`).
- 🔍 **Config-driven SEO** — `<head>`, OpenGraph, Twitter, JSON-LD, `sitemap.xml`, and `robots.txt` are **generated at build time** from `src/config/Head.ts` + `src/config/Identity.ts`.
- 🤖 **Interactive widgets** — AI assistant, contact form (reCAPTCHA), live GitHub/WakaTime stats, crypto widget.
- 🌐 **Fully configurable** — no personal data in component code; identity comes from `src/config/Identity.ts` and only a few `VITE_*` env vars.
- 🔐 **No secrets in the bundle** — crypto prices and social stats are fetched from *our backend* (static data); integration usernames live in `src/config/*.ts`. No third-party API key ever reaches the browser.

## 🛠 Tech Stack

- React 19, TypeScript, Vite, Tailwind CSS v4
- Framer Motion, GSAP, `react-helmet-async`, `react-router-dom`
- `three` / `ogl` (3D), `lottie-web`
- Axios, `react-google-recaptcha`
- Icons: `react-icons`, `lucide-react`

## ✅ Prerequisites

- Node.js **20.x+**, npm

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

## 📂 Project Structure

```
frontend/
├── public/            # static assets (img, pdf, favicon) — sitemap/robots are generated
├── src/
│   ├── components/    # shared UI components
│   ├── config/        # Identity, Metadata, Head, Github/Wakatime (kebab-case files soon)
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
├── index.html         # minimal shell (head injected at build)
├── vite.config.ts     # htmlHeadPlugin (head + sitemap + robots)
└── .env.example
```

> 🧹 **Naming conventions:** shared `components/` and module files use **PascalCase** (`CareerView.tsx`); module sub-folders are `sections/` (page blocks) and `components/` (domain pieces); each page-module has an `index.tsx` entry.

## 🚢 Deployment

Vercel-ready (`vercel.json`, SPA rewrite that preserves `sitemap.xml` / `robots.txt`). Import the `frontend/` folder, set `VITE_API_BASE_URL` (and optionally `VITE_DOMAIN`), and deploy.

## 🔒 Security

- Never commit `.env` (gitignored) — only `.env.example` is tracked.
- `VITE_*` values are **public**; no secrets in the frontend.
- reCAPTCHA **secret** key belongs on the backend, never here.
- **No third-party API keys on the client.** Crypto/social data comes from the backend (static), and integration usernames live in `src/config/*.ts`. If you add a live provider later, proxy it through the backend.
- No hardcoded credentials in source — secrets live only in env on the backend; public identity lives in `src/config/`.

## 📄 License

ISC.
