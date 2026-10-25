import { describe, expect, it } from 'vitest';
import { API_BASE_URL, isApiBaseUrlValid } from './Api';

/**
 * Regression guard for a shipped production bug: when the Cloudflare Pages
 * build ran WITHOUT `VITE_API_BASE_URL`, Vite inlined the literal string
 * "undefined", so every fetch hit `https://<site>/undefined/v1/...`. The SPA
 * fallback answered those with HTML, so nothing errored visibly — WakaTime,
 * social stats and crypto prices all silently dropped to their fallbacks.
 *
 * `src/config/Api.ts` now validates the base URL once at load and throws on a
 * missing/malformed value. These tests lock in that contract.
 *
 * Docs: https://vite.dev/guide/env-and-mode#env-variables
 */

describe('API_BASE_URL', () => {
  it('is a valid, absolute http(s) URL in the test environment', () => {
    expect(isApiBaseUrlValid).toBe(true);
    expect(API_BASE_URL).toMatch(/^https?:\/\//);
  });

  it('never contains the literal "undefined" that caused the outage', () => {
    expect(API_BASE_URL).not.toContain('undefined');
  });

  it('has no trailing slash (so `${API_BASE_URL}/v1/...` never doubles up)', () => {
    expect(API_BASE_URL.endsWith('/')).toBe(false);
  });

  it('does not leak env-template placeholders', () => {
    expect(API_BASE_URL).not.toContain('${');
  });
});
