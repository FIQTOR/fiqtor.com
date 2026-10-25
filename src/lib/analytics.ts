/**
 * Google Analytics 4 loader.
 *
 * Why this file exists: `GA_MEASUREMENT_ID` lived in `src/config/Identity.ts`
 * but was never injected anywhere, so production shipped with **no analytics
 * at all** — the dashboard showed zero sessions and it looked like traffic had
 * died after the v3 migration. This wires it up once, at runtime.
 *
 * Two things make GA4 safe in a strict-CSP single-page app:
 *
 * 1. The CSP in `public/_headers` allows `https://www.googletagmanager.com`
 *    (script) and `https://*.google-analytics.com` / `google-analytics.com`
 *    (connect). No `unsafe-inline` is involved: `gtag()` queues commands on
 *    `window.dataLayer` directly, so no inline script is needed.
 * 2. `send_page_view` is disabled and page views are emitted manually from
 *    the router (`<Analytics />` in `Layout`). The SPA never does a real
 *    navigation, so GA's default "one pageview on load" would count every
 *    visitor as exactly one page and miss all in-app browsing.
 */

import { GA_MEASUREMENT_ID } from '../config/Identity';

/** The env var wins when present (even as an empty string = disabled). */
const resolveId = (override: string | undefined): string => {
  const raw = (override ?? '').trim();
  if (!raw) return GA_MEASUREMENT_ID;
  return /^(G-[A-Z0-9]{6,}|UA-\d+-\d+)$/i.test(raw) ? raw : GA_MEASUREMENT_ID;
};

const MEASUREMENT_ID = resolveId(import.meta.env.VITE_GA_ID as string | undefined);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let started = false;

/**
 * The queueing stub Google's own snippet installs. Declared once at module
 * scope (rather than recreated per call) because `gtag('event', …)` may be
 * invoked before `gtag.js` finishes downloading; the real library drains
 * `dataLayer` on arrival.
 */
function gtagStub(...args: unknown[]): void {
  window.dataLayer!.push(args);
}

/**
 * Inject `gtag.js` and initialise the data layer. Idempotent — calling it
 * twice (StrictMode, remounts) does nothing the second time.
 */
export function initAnalytics(): void {
  if (started || typeof document === 'undefined' || !MEASUREMENT_ID) return;
  started = true;

  // Reserved here so route changes that happen before the script finishes
  // loading are still queued (gtag pushes into dataLayer, which gtag.js drains).
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtagStub;
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    // Page views are sent explicitly by the router, not by the initial load.
    send_page_view: false,
    anonymize_ip: true,
  });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(s);

  // The likely source of a hard failure is the CSP: `script-src` must list
  // googletagmanager.com and `connect-src` the analytics endpoints. Make that
  // obvious in the console instead of leaving an empty dashboard to debug.
  s.addEventListener('error', () => {
    // eslint-disable-next-line no-console
    console.warn(
      '[analytics] gtag.js failed to load. Check that the Content-Security-Policy in ' +
        'public/_headers allows https://www.googletagmanager.com (script-src) and ' +
        'https://*.google-analytics.com (connect-src).',
    );
  });
}

/**
 * Record a Single Page Application route change as a GA4 page view.
 * Called by `<Analytics />` on every `location` change, including the first.
 */
export function trackPageView(path: string, title: string): void {
  if (!MEASUREMENT_ID || !window.gtag) return;
  // A `page_location` of a real page view drives the "Pages and screens"
  // report; `page_title` keeps the report readable.
  window.gtag('event', 'page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: title,
  });
}

export const isAnalyticsEnabled = Boolean(MEASUREMENT_ID);
