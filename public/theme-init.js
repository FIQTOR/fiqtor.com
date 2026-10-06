// Pre-paint theme bootstrap.
//
// Runs synchronously in <head> BEFORE the app bundle and before first paint, so
// the correct theme class (light/dark) is on <html> from the very first frame.
// next-themes' ThemeProvider applies the class after hydration (and its inline
// script is blocked by our CSP), which makes a dark page flash white on load.
//
// Kept as a separate file (not inline in index.html / Head.ts) so the
// Content-Security-Policy can stay on `script-src 'self'` without
// 'unsafe-inline'. next-themes uses localStorage key "theme" ("light"/"dark").
(function () {
  var root = document.documentElement;
  var theme = 'dark';
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      theme = saved;
    }
  } catch (error) {
    theme = 'dark';
  }
  // Suppress CSS transitions during the first paint so a dark page does not
  // animate white -> black; the class is dropped on the next frame.
  root.classList.add('theme-boot');
  root.classList.add(theme);
  root.style.colorScheme = theme;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      root.classList.remove('theme-boot');
    });
  });
})();
