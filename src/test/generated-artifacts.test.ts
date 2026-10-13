/// <reference types="node" />
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Guards the build-time generation contract documented in AGENTS.md:
 * `<head>`, `sitemap.xml`, `robots.txt` and `.well-known/security.txt` are
 * produced by `htmlHeadPlugin` (vite.config.ts) from `src/config/Head.ts`.
 *
 * These are SOURCE invariants, so they run in `npm test` without a build and
 * fail fast when someone hand-edits `index.html` or drops a static copy into
 * `public/`. Without this, the next build silently overwrites the hand-edit —
 * or ships a duplicated, conflicting tag.
 */

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const MARKER = '<!--vite-html-head-->';

const readProjectFile = (relativePath: string): string =>
  readFileSync(path.join(projectRoot, relativePath), 'utf8');

const headInner = (html: string): string => html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';

describe('generated artifact contract', () => {
  const indexHtml = readProjectFile('index.html');

  it('keeps exactly one head marker for htmlHeadPlugin to replace', () => {
    // Two markers would leave the second one in the built HTML as a literal
    // comment, since String.replace only swaps the first occurrence.
    expect(indexHtml.split(MARKER).length - 1).toBe(1);
  });

  it('places the marker inside <head>', () => {
    expect(indexHtml).toContain('<head>');
    expect(headInner(indexHtml)).toContain(MARKER);
  });

  it('leaves <head> otherwise empty so hand-written tags cannot duplicate generated ones', () => {
    // transformIndexHtml only swaps the marker — anything else written into
    // <head> by hand survives the build and duplicates the generated tags.
    expect(headInner(indexHtml).replace(MARKER, '').trim()).toBe('');
  });

  it.each(['sitemap.xml', 'robots.txt', '.well-known/security.txt'])(
    'ships no static public/%s, which the plugin emits at build time',
    (relativePath) => {
      expect(existsSync(path.join(projectRoot, 'public', relativePath))).toBe(false);
    },
  );
});
