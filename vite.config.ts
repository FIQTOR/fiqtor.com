import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { THEME_BOOT_SCRIPT } from './src/lib/themeBoot.ts';
import {
  ALL_ROUTES,
  buildSeoConfig,
  renderHeadHtml,
  renderRobots,
  renderRouteHeadHtml,
  renderLlmsFullTxt,
  renderLlmsTxt,
  renderManifest,
  renderNoscript,
  renderSecurityTxt,
  renderSitemap,
  type EnvRecord,
} from './src/config/Seo.ts';

/** Inline script that applies the saved theme before first paint. */
const THEME_SCRIPT = `<script>${THEME_BOOT_SCRIPT}</script>`;

/**
 * Build-time SEO:
 *  - injects the full <head> into index.html,
 *  - emits sitemap.xml, robots.txt and .well-known/security.txt,
 *  - after the bundle is written, creates a static `/<route>/index.html`
 *    whose <head> carries route-specific metadata (same hashed asset tags),
 *    so a crawler that does not run JS still sees the right title/description
 *    and a hard refresh of a deep link boots the SPA normally.
 */
const ROOT = path.dirname(fileURLToPath(import.meta.url));

function seoPlugin(env: EnvRecord): Plugin {
  const cfg = buildSeoConfig(env);

  return {
    name: 'fiqtor-seo',
    transformIndexHtml(html) {
      // The theme bootstrap script must run before the first paint (it sets
      // `data-theme` on <html>), otherwise a light-mode visitor sees a dark
      // flash on every reload. It is inlined into the head, ahead of the CSS.
      return html
        .replace('<!--vite-html-head-->', `${THEME_SCRIPT}\n    ${renderHeadHtml(cfg)}`)
        .replace('<!--vite-html-noscript-->', renderNoscript(cfg));
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml');
          res.end(renderSitemap(cfg));
          return;
        }
        if (url === '/llms.txt' || url === '/llms-full.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(url === '/llms.txt' ? renderLlmsTxt(cfg) : renderLlmsFullTxt(cfg));
          return;
        }
        if (url === '/manifest.webmanifest') {
          res.setHeader('Content-Type', 'application/manifest+json');
          res.end(renderManifest(cfg));
          return;
        }
        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain');
          res.end(renderRobots(cfg));
          return;
        }
        if (url === '/.well-known/security.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(renderSecurityTxt(cfg));
          return;
        }
        next();
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: renderSitemap(cfg) });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: renderRobots(cfg) });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: renderLlmsTxt(cfg) });
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: renderLlmsFullTxt(cfg) });
      this.emitFile({ type: 'asset', fileName: 'manifest.webmanifest', source: renderManifest(cfg) });
      this.emitFile({ type: 'asset', fileName: '.well-known/security.txt', source: renderSecurityTxt(cfg) });
    },
    closeBundle() {
      const outDir = path.resolve(ROOT, 'dist');
      let indexHtml: string;
      try {
        indexHtml = readFileSync(path.join(outDir, 'index.html'), 'utf8');
      } catch {
        return;
      }

      // Keep only the asset tags Vite injected (module script, stylesheet,
      // modulepreload). Loose matches would grab half of an inline script and
      // break the HTML.
      const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/);
      const entryHead = headMatch ? headMatch[1] : '';

      /**
       * Tags that are neither route metadata nor asset references — they are
       * document-level requirements that must survive into EVERY prerendered
       * shell. Without them the per-route `index.html` files would drop
       * `charset` and `viewport`, and every deep link would render a 980px
       * zoomed-out page on mobile. `charset` must also stay inside the first
       * 1024 bytes, so both are re-emitted first.
       */
      const bootTags = Array.from(entryHead.matchAll(/<meta\b[^>]*\/?>/g))
        .map((m) => m[0].trim())
        .filter((tag) => /\b(?:charset|name="viewport")/i.test(tag))
        .join('\n    ');

      // Keep inline scripts (the theme bootstrap must stay), external module
      // scripts, and stylesheet/modulepreload links. JSON-LD is re-generated
      // per route below, so it is dropped here to avoid duplicates.
      const assetTags = Array.from(
        entryHead.matchAll(
          /<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>|<script\b[^>]*\bsrc="[^"]*"[^>]*>\s*<\/script>|<link\b[^>]*\/?>/g,
        ),
      )
        .map((m) => m[0].trim())
        .filter((tag) => {
          if (/ld\+json/.test(tag)) return false;
          if (THEME_BOOT_SCRIPT && tag.includes(THEME_BOOT_SCRIPT)) return true;
          if (tag.startsWith('<link')) return /rel="(?:stylesheet|modulepreload)"/.test(tag);
          return true;
        })
        .join('\n    ');

      /*
       * A route shell that loses its metadata guards silently — it still looks
       * like valid HTML — so fail the build loudly instead of shipping a deep
       * link that renders zoomed-out on every phone.
       */
      if (!/charset=/i.test(bootTags) || !/name="viewport"/i.test(bootTags)) {
        throw new Error(
          '[seo] charset/viewport not found in the entry <head> — refusing to write route shells ' +
            'that would render the site unusable on mobile. Did index.html lose its meta tags?',
        );
      }

      let shellsWritten = 0;
      let shellBytes = 0;

      for (const route of ALL_ROUTES) {
        if (route.path === '/') continue;
        const filePath = path.join(outDir, route.path.replace(/^\//, ''), 'index.html');
        const html = indexHtml.replace(
          /<head>[\s\S]*?<\/head>/,
          `<head>\n    ${bootTags}\n    ${renderRouteHeadHtml(cfg, route)}\n    ${assetTags}\n  </head>`,
        );
        const opens = (html.match(/<script\b/g) || []).length;
        const closes = (html.match(/<\/script>/g) || []).length;
        if (opens !== closes) {
          throw new Error(`[seo] ${route.path}: unbalanced <script> tags — refusing to write.`);
        }
        mkdirSync(path.dirname(filePath), { recursive: true });
        writeFileSync(filePath, html);
        shellsWritten += 1;
        shellBytes += Buffer.byteLength(html);
      }

      /**
       * Report what the prerender step actually cost.
       *
       * Every route shell is a full copy of index.html with a different head.
       * At six routes that was negligible; with case-study pages it is a real
       * amount of duplicated bytes, and a silent multiplier is how a deploy
       * quietly doubles in size. Printing it keeps the cost visible and makes
       * a sudden jump (a title that stopped slugging uniquely, a route list
       * that got concatenated twice) obvious in the build log.
       */
      if (shellsWritten > 4) {
        console.log(
          `\n[seo] wrote ${shellsWritten} route shells, ${(shellBytes / 1024).toFixed(0)} KB total ` +
            `(avg ${(shellBytes / shellsWritten / 1024).toFixed(1)} KB/route from a ${(Buffer.byteLength(indexHtml) / 1024).toFixed(1)} KB index.html)`,
        );
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix) so the SEO plugin can read VITE_* values.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 'bundle' is the explicit, stable default: it reads the TS config file
    // deterministically (the experimental 'native' loader can emit warnings
    // to stdout that look like errors in CI logs).
    configLoader: 'bundle',
    plugins: [react(), seoPlugin(env)],
    resolve: {
      alias: { '@': path.resolve(ROOT, './src') },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Split the heavy third-party libs out of the entry chunk.
          advancedChunks: {
            groups: [
              { name: 'vendor-react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'vendor-router', test: /[\\/]node_modules[\\/](react-router|@remix-run)[\\/]/ },
              { name: 'vendor-gsap', test: /[\\/]node_modules[\\/]gsap[\\/]/ },
              { name: 'vendor-recaptcha', test: /[\\/]node_modules[\\/]react-google-recaptcha[\\/]/ },
            ],
          },
        },
      },
    },
  };
});
