/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

declare module '~react-pages' {
    import type { RouteObject } from 'react-router-dom'
    const routes: RouteObject[]
    export default routes
}

interface ImportMetaEnv {
  // Site / domain
  readonly VITE_DOMAIN: string
  readonly VITE_API_BASE_URL: string

  // Branding & owner identity
  readonly VITE_BRAND_NAME: string
  readonly VITE_OWNER_NAME: string
  readonly VITE_OWNER_ALIAS: string
  readonly VITE_OWNER_JOB_TITLE: string
  readonly VITE_OWNER_HEADLINE: string
  readonly VITE_OWNER_YEARS_EXPERIENCE: string
  readonly VITE_OWNER_COUNTRY: string
  readonly VITE_OWNER_COUNTRY_CODE: string
  readonly VITE_OWNER_LANGUAGES: string
  readonly VITE_PORTRAIT_IMAGE: string

  // Contact
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_CONTACT_BUSINESS_EMAIL: string
  readonly VITE_CONTACT_PHONE: string
  readonly VITE_CONTACT_WHATSAPP: string
  readonly VITE_TWITTER_HANDLE: string

  // Social profiles
  readonly VITE_SOCIAL_INSTAGRAM: string
  readonly VITE_SOCIAL_TIKTOK: string
  readonly VITE_SOCIAL_YOUTUBE: string
  readonly VITE_SOCIAL_LINKEDIN: string
  readonly VITE_SOCIAL_GITHUB: string
  readonly VITE_SOCIAL_THREADS: string

  // Company / business brand
  readonly VITE_COMPANY_NAME: string
  readonly VITE_COMPANY_URL: string
  readonly VITE_COMPANY_AI_URL: string
  readonly VITE_COMPANY_EDUCATION_URL: string
  readonly VITE_COMPANY_MARKETPLACE_URL: string
  readonly VITE_COMPANY_TEMPLATES_URL: string
  readonly VITE_COMPANY_IMAGE: string

  // Usernames / integrations
  // (Public usernames live in src/config/*.ts — secrets live on the backend.)

  // Resume files
  readonly VITE_RESUME_CREATIVE_EN: string
  readonly VITE_RESUME_CREATIVE_ID: string
  readonly VITE_RESUME_ATS_EN: string
  readonly VITE_RESUME_ATS_ID: string

  // Feature flags
  readonly VITE_ENABLE_AI: string

  // reCAPTCHA (site key only — never the secret)
  readonly VITE_RECAPTCHA_SITE_KEY: string

  // Analytics
  readonly VITE_GA_MEASUREMENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
