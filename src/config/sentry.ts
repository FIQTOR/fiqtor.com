/**
 * Optional Sentry error tracking for the browser bundle.
 *
 * Disabled (no-op) unless VITE_SENTRY_DSN is set at build time, so local/dev
 * builds stay clean. VITE_* values are PUBLIC — only the Sentry DSN (a
 * write-only ingest key, safe to expose) belongs here; never a real secret.
 */
import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;

export const sentryEnabled = Boolean(dsn);

export function initSentry(): void {
  if (!sentryEnabled) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0),
    sendDefaultPii: false,
  });
}

/** Report an exception to Sentry (no-op when disabled). */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!sentryEnabled) return;
  Sentry.withScope((scope) => {
    if (context) scope.setContext('react', context);
    Sentry.captureException(error);
  });
}

export { Sentry };
