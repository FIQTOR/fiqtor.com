import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { S } from '../data/site';
import { DotPortrait } from '../components/DotPortrait';
import { InteractiveTitle, useTypewriter } from '../hooks/useReveal';
import { isReducedMotion, localHour } from '../lib/utils';
import { Icon } from '../lib/utils.tsx';
import { useLanguage } from '../lib/catalog';
import { useUI } from '../lib/ui';

const SOC = ['whatsapp', 'instagram', 'tiktok', 'github', 'linkedin', 'mail'] as const;

/**
 * Linktree — a standalone link hub. Shares the global theme but keeps its own
 * layout (centered card, portrait, link list) and a share QR. Its backdrop is
 * intentionally monochrome: black-and-white glows on a hairline grid, no hue.
 */
export default function Linktree() {
  const { toast, copy } = useUI();
  const { lang } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  // One array, memoised: useTypewriter keys off the CONTENT, but building the
  // list inline still re-allocates on every render, and a stable reference
  // makes the intent obvious.
  const headline = t('AI & software engineer', 'AI & software engineer');
  // One array, memoised on `lang` (which is what `t` reads through).
  const words = useMemo(
    () => [headline, (lang === 'en' ? 'Founder ' : 'Pendiri ') + S.company.name, 'Web · Apps · AI'],
    [headline, lang],
  );
  const typed = useTypewriter(words);
  const hour = localHour(S.tz);
  const status = hour >= 8 && hour < 22 ? t('Online now · quick replies', 'Online sekarang · balas cepat') : t('Resting · messages still read', 'Sedang istirahat · pesan tetap dibaca');

  // `location.href` is only meaningful on the client; derive it in an effect
  // so the page can also be server-rendered headlessly.
  const [shareUrl, setShareUrl] = useState('');
  const [showQr, setShowQr] = useState(false);
  useEffect(() => {
    const sync = () => setShareUrl(location.href.split('#')[0]);
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);

  /* ---------- particle burst on link click ---------- */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const reduce = isReducedMotion();
    type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; c: string };
    let parts: P[] = [];
    let run = false;
    const frame = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts = parts.filter((p) => p.life > 0);
      parts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.vx *= 0.985;
        p.life -= 1;
        ctx.globalAlpha = Math.max(0, p.life / 60);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.3);
        ctx.fill();
      });
      if (parts.length) requestAnimationFrame(frame);
      else run = false;
    };
    const burst = (x: number, y: number) => {
      if (reduce) return;
      const dpr = devicePixelRatio || 1;
      cv.width = innerWidth * dpr;
      cv.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = 0; i < 34; i++) {
        const a = Math.random() * 6.28;
        const s = 2 + Math.random() * 5;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 2,
          r: 1.5 + Math.random() * 2.5,
          life: 40 + Math.random() * 20,
          // Monochrome burst: white / light greys only.
          c: ['#ffffff', 'rgba(255,255,255,.72)', 'rgba(255,255,255,.45)'][i % 3],
        });
      }
      if (!run) {
        run = true;
        requestAnimationFrame(frame);
      }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('.lk');
      if (!a) return;
      burst(e.clientX, e.clientY);
      try {
        navigator.vibrate?.(12);
      } catch {
        /* ignore */
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const saveVCard = () => {
    const v = `BEGIN:VCARD\nVERSION:3.0\nFN:${S.owner}\nNICKNAME:${S.alias}\nTITLE:${S.role}\nTEL;TYPE=CELL:+${S.wa}\nEMAIL:${S.email}\nURL:${shareUrl || S.social.github}\nEND:VCARD`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([v], { type: 'text/vcard' }));
    a.download = S.owner.replace(/\s+/g, '-') + '.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast(t('Contact downloaded', 'Kontak diunduh'));
  };

  const share = async () => {
    const url = shareUrl || location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: S.name, text: S.role, url });
        return;
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }
    await copy(url, t('Link copied', 'Tautan tersalin'));
  };

  const soc = SOC.map((k) => ({ k, l: S.links.find((x) => x.icon === k) })).filter((x) => x.l);

  return (
    <>
      {/* Monochrome backdrop: the hairline grid only. The three blurred glow
          blobs were removed on request — the grid is the part that reads as
          "designed" without tinting anything. No `{!RM && ...}` guard: this is
          static decoration with no animation left to opt out of. */}
      <div className="lt-bg" aria-hidden="true" />
      <section className="lt2">
        <DotPortrait id="ltPort" className="lt-port" />

        <div className="lt-hub">
          {S.hubs.map((h) => (
            <a key={h.domain} href={h.href} target="_blank" rel="noopener">
              <img src={h.image} alt="" width={34} height={34} />
              <b>{h.label[lang]}</b>
              <small>{h.domain}</small>
            </a>
          ))}
        </div>

        <InteractiveTitle as="h1" text={S.owner} />
        <p className="typ" aria-label={headline}>
          {typed}
        </p>
        <span className="lt-st">
          <i />
          <span>{status}</span>
        </span>

        <div className="lt-soc">
          {soc.map(({ k, l }) => (
            <a
              key={k}
              href={l!.url}
              target={/^https?:/.test(l!.url) ? '_blank' : undefined}
              rel={/^https?:/.test(l!.url) ? 'noopener' : undefined}
              aria-label={l!.label[lang]}
            >
              <Icon name={k} />
            </a>
          ))}
        </div>

        <div className="lt-acts">
          <button type="button" onClick={saveVCard}>
            <Icon name="download" size={18} /> {t('Save contact', 'Simpan kontak')}
          </button>
          <button type="button" onClick={() => void share()}>
            <Icon name="share" size={18} /> {t('Share', 'Bagikan')}
          </button>
          <button type="button" onClick={() => setShowQr((v) => !v)} aria-expanded={showQr}>
            {t('QR code', 'Kode QR')}
          </button>
        </div>

        {showQr && shareUrl && (
          <div className="lt-qr">
            <div className="qr-card">
              <QRCodeSVG value={shareUrl} size={150} level="M" bgColor="#ffffff" fgColor="#0a0a0a" />
            </div>
            <small>{t('Scan to open this page on another device', 'Pindai untuk membuka halaman ini di perangkat lain')}</small>
          </div>
        )}

        <ul className="lt-l">
          {S.links.map((l) => (
            <li className="rv in" key={l.label.en}>
              <a
                className={'lk' + (l.featured ? ' ft2' : '')}
                href={l.url}
                target={/^https?:/.test(l.url) ? '_blank' : undefined}
                rel={/^https?:/.test(l.url) ? 'noopener' : undefined}
                data-cur={t('Open', 'Buka')}
              >
                {l.featured && <span className="bd2">{t('Start here', 'Mulai di sini')}</span>}
                <span className="ik">
                  <Icon name={l.icon} />
                </span>
                <span>
                  <b>{l.label[lang]}</b>
                  <small>{l.note[lang]}</small>
                </span>
                <span className="ar" aria-hidden="true">
                  <Icon name="arrow" size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="lt-note">{t('Move the cursor over the portrait, then pick a destination.', 'Gerakkan kursor ke potret, lalu pilih tujuanmu.')}</p>
      </section>
      <canvas className="burst" ref={canvasRef} />
    </>
  );
}
