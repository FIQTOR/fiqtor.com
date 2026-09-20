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
  //   - src/config/{Github,Wakatime}.ts
  // Crypto & social stats are served by the backend (static data).
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// --- Web Speech API (SpeechRecognition) — not in the default TS DOM lib ---
interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

interface Window {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}
