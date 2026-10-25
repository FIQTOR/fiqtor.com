/**
 * Theme bootstrap — runs before first paint.
 *
 * This file is imported by `vite.config.ts` (Node) and inlined into the
 * <head>, so it must stay dependency-free and pure. The React provider in
 * `theme.tsx` owns the runtime state; this script only applies the stored
 * choice so a light-mode visitor never sees a dark flash on reload.
 */
export const THEME_STORAGE_KEY = 'fiqtor.theme';

/** sessionStorage key the loader uses to know it already ran in this tab. */
export const LOADER_SEEN_KEY = 'seen';

/**
 * SHA-256 of the script below, for the Content-Security-Policy in
 * `public/_headers` and `vercel.json` (`script-src 'self' 'sha256-…'`).
 * The script is inlined, so `'self'` alone would block it. If you edit
 * THEME_BOOT_SCRIPT you MUST recompute this:
 *
 *   node -e "const c=require('crypto');const s=process.env.S;console.log(\"'sha256-'+c.createHash('sha256').update(s,'utf8').digest('base64')+'\"')" 
 *
 * with S set to the new script body.
 */
export const THEME_BOOT_SCRIPT_SHA256 = 'sha256-HfKfyo8UtRzpZ4X4We84oV36X74Yknfeq5DnnlzNv+s=';

/**
 * Two jobs, both of which MUST happen before the first paint:
 *
 * 1. Theme — otherwise light-mode visitors flash dark on every reload.
 *
 * 2. Scroll lock — `Loader` adds `html.ld` from a React effect, but the
 *    bundle is ~350 kB, so between first paint and that effect the full
 *    page sits behind the loader and can be scrolled with the wheel or a
 *    swipe. On a mid-range phone that is several hundred milliseconds of
 *    a page the visitor cannot see yet — they scroll, and the hero is
 *    already part-way down by the time the curtain lifts.
 *
 *    The `ld` class is only added when the loader is actually going to
 *    run (no `seen` flag this session, no bfcache restore, no reduced
 *    motion). Every other case skips it, so a repeat visit is never
 *    locked. `Loader` mirrors exactly these conditions and remains the
 *    single owner of removal, so there is no double-ownership of state.
 */
export const THEME_BOOT_SCRIPT = `(function(){var r=document.documentElement;try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')==='light'?'light':'dark';r.setAttribute('data-theme',t);r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==='dark'?'#000000':'#ffffff';}catch(e){r.setAttribute('data-theme','dark');}try{if(!/^(\\/|\\/index\\.html)$/.test(location.pathname))return;if(sessionStorage.getItem('${LOADER_SEEN_KEY}'))return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;r.classList.add('ld');var s=scrollX,e=scrollY;addEventListener('scroll',function(){if(r.classList.contains('ld')&&(scrollX!==s||scrollY!==e))scrollTo(s,e);},{passive:true});}catch(e){}})();`;
