import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Pages from 'vite-plugin-pages'
import path from 'path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import {
  buildHeadConfig,
  renderHeadHtml,
  renderRouteHeadHtml,
  renderSitemap,
  renderRobots,
  renderSecurityTxt,
  NAV_PAGES,
} from './src/config/Head'

/**
 * Injects the full <head> (title, meta, OpenGraph, Twitter, JSON-LD, GA) into
 * index.html at build/dev time, and emits sitemap.xml + robots.txt +
 * .well-known/security.txt derived from the configured domain — all from
 * src/config/Head.ts. This keeps every piece of branding/SEO/security metadata
 * derived from env vars (no hardcoded domain in the repo).
 */
function htmlHeadPlugin(env: Record<string, string>): Plugin {
  const sitemap = 'sitemap.xml'
  const robots = 'robots.txt'
  const securityTxt = '.well-known/security.txt'

  return {
    name: 'vite-html-head',

    transformIndexHtml(html) {
      const config = buildHeadConfig(env)
      const withHead = html.replace('<!--vite-html-head-->', renderHeadHtml(config))
      // Apply the configured lang attribute to <html>
      return withHead.replace(/<html[^>]*>/, `<html lang="${config.lang}">`)
    },

    // Dev server: serve generated sitemap.xml / robots.txt
    configureServer(server) {
      const config = buildHeadConfig(env)
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        if (url === `/${sitemap}`) {
          res.setHeader('Content-Type', 'application/xml')
          res.end(renderSitemap(config))
          return
        }
        if (url === `/${robots}`) {
          res.setHeader('Content-Type', 'text/plain')
          res.end(renderRobots(config))
          return
        }
        if (url === `/${securityTxt}`) {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(renderSecurityTxt(config))
          return
        }
        next()
      })
    },

    // Build: emit sitemap.xml / robots.txt into the output directory
    generateBundle() {
      const config = buildHeadConfig(env)
      this.emitFile({ type: 'asset', fileName: sitemap, source: renderSitemap(config) })
      this.emitFile({ type: 'asset', fileName: robots, source: renderRobots(config) })
      this.emitFile({ type: 'asset', fileName: securityTxt, source: renderSecurityTxt(config) })
    },

    // Build: after the SPA bundle is written, generate a static per-route
    // index.html whose <head> carries unique title/description/canonical/
    // JSON-LD. Crawlers that do not run JS now see route-specific metadata
    // instead of one shared shell, while the SPA hydrates normally in-browser.
    closeBundle() {
      const config = buildHeadConfig(env)
      const outDir = path.resolve(__dirname, 'dist')
      const indexHtml = readFileSync(path.join(outDir, 'index.html'), 'utf8')

      // Pull the hashed asset tags Vite injected into the entry <head> — the
      // module script that boots the SPA, the modulepreload hints, and the
      // stylesheet link. Without these, the prerendered per-route pages ship
      // zero JavaScript and render a blank (black) screen on hard refresh.
      //
      // Only asset-bearing tags are collected, and each is captured WITH its
      // closing tag. A loose /<script[^>]*>/ match would grab just the opening
      // tag of an inline <script type="application/ld+json"> data block, and
      // injecting an unclosed <script> would swallow the module script that
      // follows — blanking the page for real.
      const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/)
      const entryHead = headMatch ? headMatch[1] : ''
      const assetTags = Array.from(
        entryHead.matchAll(
          /<script\b[^>]*\bsrc="[^"]*"[^>]*>\s*<\/script>|<link\b[^>]*>/g
        )
      )
        .map((m) => m[0])
        .filter(
          (tag) =>
            // Drop JSON-LD / non-asset data blocks outright.
            !tag.includes('ld+json') &&
            // Keep only stylesheet + modulepreload <link>s (skip canonical,
            // icons, preloads, etc. that renderRouteHeadHtml already emits or
            // that must stay route-specific).
            (!tag.startsWith('<link') ||
              /rel="(?:stylesheet|modulepreload)"/.test(tag)) &&
            // Skip the bootstrap scripts and GA loader already emitted by
            // renderRouteHeadHtml — re-adding them would duplicate the tags.
            !tag.includes('/theme-init.js') &&
            !tag.includes('/ga-init.js') &&
            !tag.includes('googletagmanager.com/gtag/js')
        )
        .join('\n    ')

      for (const route of NAV_PAGES) {
        if (route.path === '/') continue
        const filePath = path.join(outDir, route.path.replace(/^\//, ''), 'index.html')
        // Keep the already-generated (hashed) asset tags from the built entry,
        // but swap the metadata tags for route-specific ones.
        const html = indexHtml.replace(
          /<head>[\s\S]*?<\/head>/,
          `<head>${renderRouteHeadHtml(config, route)}\n    ${assetTags}\n  </head>`
        )

        // Safety net: an unclosed <script> (e.g. a JSON-LD block whose opening
        // tag was injected without its body/closing tag) makes the browser
        // swallow the following module script, shipping a blank page. Refuse
        // to emit unbalanced HTML rather than deploy a broken route.
        const opens = (html.match(/<script\b/g) || []).length
        const closes = (html.match(/<\/script>/g) || []).length
        if (opens !== closes) {
          throw new Error(
            `[html-head] Prerendered ${route.path} has ${opens} <script> but ${closes} </script> — refusing to write unbalanced HTML.`
          )
        }

        mkdirSync(path.dirname(filePath), { recursive: true })
        writeFileSync(filePath, html)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix) so config files can read VITE_* values.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
      react(),
      Pages({
        dirs: 'src/pages',
        extensions: ['tsx'],
      }),
      htmlHeadPlugin(env),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Split heavy third-party libs out of the entry chunk so the initial
      // payload (and parse/execute time) drops sharply. Each group only loads
      // on routes that actually use it.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('unified') || id.includes('micromark') || id.includes('mdast') || id.includes('hast')) return 'vendor-markdown';
            if (id.includes('lottie-web')) return 'vendor-lottie';
            if (id.includes('ogl')) return 'vendor-webgl';
            if (id.includes('react-router') || id.includes('@remix-run')) return 'vendor-router';
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'vendor-react';
          },
        },
      },
    },
    base: '/',
  }
})
