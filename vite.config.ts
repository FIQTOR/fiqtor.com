import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Pages from 'vite-plugin-pages'
import path from 'path'
import {
  buildHeadConfig,
  renderHeadHtml,
  renderSitemap,
  renderRobots,
} from './src/config/Head'

/**
 * Injects the full <head> (title, meta, OpenGraph, Twitter, JSON-LD, GA) into
 * index.html at build/dev time, and emits sitemap.xml + robots.txt derived from
 * the configured domain — all from src/config/Head.ts. This keeps every piece
 * of branding/SEO derived from env vars (no hardcoded domain in the repo).
 */
function htmlHeadPlugin(env: Record<string, string>): Plugin {
  const sitemap = 'sitemap.xml'
  const robots = 'robots.txt'

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
        next()
      })
    },

    // Build: emit sitemap.xml / robots.txt into the output directory
    generateBundle() {
      const config = buildHeadConfig(env)
      this.emitFile({ type: 'asset', fileName: sitemap, source: renderSitemap(config) })
      this.emitFile({ type: 'asset', fileName: robots, source: renderRobots(config) })
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
    base: '/',
  }
})
