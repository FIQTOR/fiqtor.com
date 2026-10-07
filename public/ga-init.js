// Google Analytics (gtag) bootstrap.
//
// Kept as a separate file (not inline in index.html / Head.ts) so the
// Content-Security-Policy can stay on `script-src 'self'` without
// 'unsafe-inline' — an inline gtag snippet would be blocked by CSP.
//
// The measurement ID is read from this script's own `data-ga-id` attribute so
// src/config/Head.ts remains the single source of truth:
//   <script src="/ga-init.js" data-ga-id="G-XXXXXXX"></script>
(function () {
  // `document.currentScript` is reliable for a synchronous classic script; fall
  // back to locating our own tag if it is ever loaded deferred.
  var script =
    document.currentScript ||
    document.querySelector('script[data-ga-id][src$="ga-init.js"]');
  var id = script && script.getAttribute('data-ga-id');
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);
})();
