/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

declare module '~react-pages' {
    import type { RouteObject } from 'react-router-dom'
    const routes: RouteObject[]
    export default routes
}

interface ImportMetaEnv {
  // Site / domain (optional origin override; defaults to src/config/Identity.ts)
  readonly VITE_DOMAIN: string
  readonly VITE_API_BASE_URL: string

  // Feature flags
  readonly VITE_ENABLE_AI: string

  // reCAPTCHA (site key only — never the secret)
  readonly VITE_RECAPTCHA_SITE_KEY: string

  // NOTE: Branding/identity, contact info, social URLs, resume paths, the
  // company brand and integration usernames are ALL code-based now:
  //   - src/config/Identity.ts
  //   - src/config/{Github,Wakatime,Instagram,Tiktok}.ts
  // Crypto & social stats are served by the backend (static data).
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
