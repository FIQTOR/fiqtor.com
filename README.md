# 🎨 Frontend — Portfolio SPA

React 19 + TypeScript + Vite single-page app for the portfolio. All branding, identity, and SEO metadata are configuration-driven (env vars), so the project doubles as a reusable template.

> 🔗 See the [root README](../README.md) for full-stack setup and configuration.

## ✨ Features

- ⚡ **Vite + React 19** with TypeScript (strict) and HMR.
- 🎨 **Tailwind CSS v4** (`@tailwindcss/vite`) + Framer Motion animations, dark/light theme.
- 🧭 **File-based routing** via `vite-plugin-pages` (`src/pages/*.tsx`).
- 🔍 **Config-driven SEO** — `<head>`, OpenGraph, Twitter, JSON-LD, `sitemap.xml`, and `robots.txt` are **generated at build time** from `src/config/Head.ts` + env vars.
- 🤖 **Interactive widgets** — AI assistant, contact form (reCAPTCHA), live GitHub/WakaTime stats, crypto widget.
- 🌐 **Fully configurable** — no personal data in component code; everything comes from `VITE_*` env vars.

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

All values are configured through env vars. See [`.env.example`](.env.example) for the full documented list.

> ⚠️ **Every `VITE_*` variable is embedded in the public browser bundle.** Never put secrets (API secrets, private tokens) behind a `VITE_` variable — keep those on the backend.

Key groups:

| Group | Variables |
|-------|-----------|
| Domain / API | `VITE_DOMAIN`, `VITE_API_BASE_URL` |
| Branding / owner | `VITE_BRAND_NAME`, `VITE_OWNER_NAME`, `VITE_OWNER_ALIAS`, `VITE_OWNER_JOB_TITLE`, `VITE_OWNER_HEADLINE`, `VITE_OWNER_YEARS_EXPERIENCE`, `VITE_OWNER_COUNTRY`, `VITE_OWNER_COUNTRY_CODE`, `VITE_OWNER_LANGUAGES`, `VITE_PORTRAIT_IMAGE` |
| Contact | `VITE_CONTACT_EMAIL`, `VITE_CONTACT_BUSINESS_EMAIL`, `VITE_CONTACT_PHONE`, `VITE_CONTACT_WHATSAPP`, `VITE_TWITTER_HANDLE` |
| Social | `VITE_SOCIAL_INSTAGRAM`, `VITE_SOCIAL_TIKTOK`, `VITE_SOCIAL_YOUTUBE`, `VITE_SOCIAL_LINKEDIN`, `VITE_SOCIAL_GITHUB`, `VITE_SOCIAL_THREADS` |
| Resume | `VITE_RESUME_CREATIVE_EN`, `VITE_RESUME_CREATIVE_ID`, `VITE_RESUME_ATS_EN`, `VITE_RESUME_ATS_ID` |
| Integrations | `VITE_GITHUB_USERNAME`, `VITE_WAKATIME_USERNAME`, `VITE_INSTAGRAM_USERNAME`, `VITE_INSTAGRAM_USER_ID`, `VITE_INSTAGRAM_ACCESS_TOKEN`, `VITE_TIKTOK_USERNAME`, `VITE_TIKTOK_API_KEY`, `VITE_LIVECOINWATCH_API_KEY` |
| reCAPTCHA | `VITE_RECAPTCHA_SITE_KEY` (site key only) |
| Company | `VITE_COMPANY_NAME`, `VITE_COMPANY_URL`, `VITE_COMPANY_AI_URL`, `VITE_COMPANY_EDUCATION_URL`, `VITE_COMPANY_MARKETPLACE_URL`, `VITE_COMPANY_TEMPLATES_URL`, `VITE_COMPANY_IMAGE` |
| Flags | `VITE_ENABLE_AI`, `VITE_GA_MEASUREMENT_ID` |

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

### `<head>` / SEO generation

- `src/config/Head.ts` builds the `<head>` (title, meta, OG, Twitter, JSON-LD, GA) **and** `sitemap.xml` + `robots.txt`.
- The `htmlHeadPlugin` in `vite.config.ts` injects them at dev/build time.
- `index.html` is a minimal shell with a `<!--vite-html-head-->` marker — **don't edit it directly**; change env vars or `Head.ts` instead.
- No domain is hardcoded — everything derives from `VITE_DOMAIN`.

## 📂 Project Structure

```
frontend/
├── public/            # static assets (img, pdf, favicon) — sitemap/robots are generated
├── src/
│   ├── components/    # shared UI components
│   ├── config/        # Identity, Metadata, Head, AppConfig, integrations
│   ├── context/       # React contexts (theme, container, welcome)
│   ├── data/          # 📝 your content (projects, career, certificates…)
│   ├── layouts/       # layout wrappers
│   ├── modules/       # feature modules (home, contact, linktree…)
│   ├── pages/         # file-based routes
│   ├── App.tsx
│   └── main.tsx
├── index.html         # minimal shell (head injected at build)
├── vite.config.ts     # htmlHeadPlugin (head + sitemap + robots)
└── .env.example
```

## 🚢 Deployment

Vercel-ready (`vercel.json`, SPA rewrite that preserves `sitemap.xml` / `robots.txt`). Import the `frontend/` folder, add all `VITE_*` env vars, set `VITE_DOMAIN` and `VITE_API_BASE_URL`, and deploy.

## 🔒 Security

- Never commit `.env` (gitignored) — only `.env.example` is tracked.
- `VITE_*` values are **public**; no secrets in the frontend.
- reCAPTCHA **secret** key belongs on the backend, never here.
- No hardcoded personal data or credentials in source — all via env vars.

## 📄 License

ISC.
