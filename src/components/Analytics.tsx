import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { routeByPath } from '../config/Seo';
import { initAnalytics, trackPageView } from '../lib/analytics';

/**
 * SPA page-view tracking for GA4.
 *
 * The router renders every route inside one document, so GA's built-in
 * "pageview on load" fires once per session and never again. This component
 * turns each `location` change into an explicit `page_view`, which is the only
 * way the "Pages and screens" report ever shows `/projects`, `/career`, etc.
 *
 * The first view is scheduled on a short timeout so the route's `<title>` has
 * been written by `<Seo />` (react-helmet-async commits after render) — sending
 * it synchronously would tag the landing view with the previous page's title.
 */
export function Analytics() {
  const location = useLocation();
  const first = useRef(true);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const route = routeByPath(path);
    const title = route?.title ?? document.title;
    const delay = first.current ? 60 : 0;
    first.current = false;

    const timer = setTimeout(() => trackPageView(path, title), delay);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}
