import { useEffect, useRef, useState } from 'react';
import { S } from '../../data/site';
import { API_BASE_URL, isApiBaseUrlValid } from '../../config/Api';
import { useLanguage } from '../../lib/catalog';
import { formatCompact } from '../../lib/utils';
import { Icon } from '../../lib/utils.tsx';

/* =====================================================================
   LIVE STATS — the widgets from the previous frontend, rebuilt on the
   v3 visual system. Every panel degrades to the last good value (or a
   skeleton) when the backend is unreachable; nothing throws.
   ===================================================================== */

type Coin = { rate: number; delta: { month: number; day?: number } };
/** The backend can answer with a partial map (e.g. one feed is down). */
type Coins = Partial<Record<'btc' | 'eth' | 'sol', Coin>>;
type Social = {
  tiktok?: { followers: number; following: number; likes: number };
  instagram?: { followers: number; following: number };
};
type Waka = { text: string; since: string };

/** Fallbacks mirror the numbers used by the previous frontend. */
const SOCIAL_FALLBACK: Social = {
  tiktok: { followers: 1955, following: 33, likes: 130000 },
  instagram: { followers: 696, following: 579 },
};

const COIN_META = [
  { key: 'btc' as const, name: 'Bitcoin', icon: '/img/cryptocurrency/bitcoin.png' },
  { key: 'eth' as const, name: 'Ethereum', icon: '/img/cryptocurrency/etherium.png' },
  { key: 'sol' as const, name: 'Solana', icon: '/img/cryptocurrency/solana.png' },
];

const priceDecimals = (rate: number): number => (rate >= 1 ? 2 : rate >= 0.01 ? 4 : 6);

const usd = (rate: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: priceDecimals(rate),
    maximumFractionDigits: priceDecimals(rate),
  }).format(rate);

/** GET a JSON payload from the backend, returning `null` on any failure. */
async function getJson<T>(path: string, signal?: AbortSignal): Promise<T | null> {
  if (!isApiBaseUrlValid) return null;
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Small helper: run an async loader once + on a timer while the tab is visible. */
function usePolling<T>(load: (signal: AbortSignal) => Promise<T | null>, intervalMs: number) {
  const [data, setData] = useState<T | null>(null);
  const [done, setDone] = useState(false);
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    const ctrl = new AbortController();
    let timer = 0;

    const run = async () => {
      const next = await loadRef.current(ctrl.signal);
      if (ctrl.signal.aborted) return;
      if (next !== null) setData(next);
      setDone(true);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (document.visibilityState !== 'visible') return;
      timer = window.setTimeout(async () => {
        await run();
        schedule();
      }, intervalMs);
    };
    void run().then(schedule);

    const onVis = () => {
      if (document.visibilityState === 'visible') {
        void run();
        schedule();
      } else {
        clearTimeout(timer);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [intervalMs]);

  return { data, done };
}

function CryptoPanel() {
  const { lang } = useLanguage();
  const { data, done } = usePolling<Coins>(
    async (signal) => {
      const payload = await getJson<{ data?: Coins }>('/v1/crypto', signal);
      return payload?.data ?? null;
    },
    30_000,
  );

  if (!data) {
    return (
      <>
        {COIN_META.slice(0, 2).map((c) => (
          <div className="lv" key={c.key}>
            <div className="lv-h">
              <img src={c.icon} alt="" width={18} height={18} style={{ width: '1.1rem', height: '1.1rem', borderRadius: '50%' }} />
              {c.name}
            </div>
            {done ? (
              <small>{lang === 'en' ? 'Price feed offline — open CoinGecko for live rates.' : 'Feed harga mati — buka CoinGecko untuk harga live.'}</small>
            ) : (
              <span className="lv-skel" />
            )}
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {COIN_META.map((meta) => {
        const coin = data[meta.key];
        // Skip a coin the backend did not return instead of throwing on `delta`.
        if (!coin || !coin.delta) return null;
        const delta = typeof coin.delta.day === 'number' ? coin.delta.day : coin.delta.month;
        const pct = (delta - 1) * 100;
        return (
          <div className="lv" key={meta.key}>
            <div className="lv-h">
              <img src={meta.icon} alt="" width={18} height={18} style={{ width: '1.1rem', height: '1.1rem', borderRadius: '50%' }} />
              {meta.name}
            </div>
            <b>{usd(coin.rate)}</b>
            <span className={'delta ' + (pct >= 0 ? 'up' : 'down')}>
              {pct >= 0 ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%{' '}
              <span style={{ fontWeight: 400, opacity: 0.7 }}>{typeof coin.delta.day === 'number' ? '24h' : '30d'}</span>
            </span>
          </div>
        );
      })}
    </>
  );
}

function SocialPanel() {
  const { lang } = useLanguage();
  const { data, done } = usePolling<Social>(
    async (signal) => {
      const payload = await getJson<{ data?: Social }>('/v1/social/stats', signal);
      return payload?.data ?? null;
    },
    5 * 60_000,
  );
  // When the feed is down the last known numbers are shown, but they must not
  // masquerade as live data — the Crypto panel already says "feed offline",
  // so this one does too.
  const offline = !data && done;
  const social = data ?? (done ? SOCIAL_FALLBACK : null);
  const t = (en: string, id: string) => (lang === 'en' ? en : id);

  return (
    <div className="lv">
      <div className="lv-h">
        <Icon name="tiktok" size={17} />
        {t('Social reach', 'Jangkauan sosial')}
      </div>
      {!social ? (
        <span className="lv-skel" />
      ) : (
        <>
          {social.tiktok && (
            <>
              <b>{formatCompact(social.tiktok.followers)}</b>
              <small>{t('TikTok followers', 'pengikut TikTok')}</small>
              <div className="lv-row">
                <span>
                  TikTok {t('likes', 'suka')} <b>{formatCompact(social.tiktok.likes)}+</b>
                </span>
              </div>
            </>
          )}
          {social.instagram && (
            <div className="lv-row">
              <span>
                Instagram <b>{formatCompact(social.instagram.followers)}</b> {t('followers', 'pengikut')}
              </span>
            </div>
          )}
          {offline && (
            <small className="lv-stale">
              {t('Last known figures — feed offline', 'Angka terakhir diketahui — feed mati')}
            </small>
          )}
          <a href={S.social.tiktok} target="_blank" rel="noopener" style={{ fontSize: '.82rem', width: 'fit-content' }}>
            @{S.alias.toLowerCase()} ↗
          </a>
        </>
      )}
    </div>
  );
}

function WakaPanel() {
  const { lang } = useLanguage();
  const { data, done } = usePolling<Waka>(
    async (signal) => {
      const payload = await getJson<{ data?: { text?: string; range?: { start_text?: string } } }>('/v1/wakatime', signal);
      const d = payload?.data;
      if (!d || typeof d.text !== 'string' || !d.text) return null;
      return { text: d.text.replace(/hrs/g, 'hours').replace(/mins/g, 'minutes'), since: d.range?.start_text ?? '' };
    },
    10 * 60_000,
  );

  return (
    <div className="lv">
      <div className="lv-h">
        <Icon name="cert" size={17} />
        {lang === 'en' ? 'Coding lifetime' : 'Total waktu coding'}
      </div>
      {data ? (
        <>
          <b>{data.text}</b>
          {data.since && (
            <small>
              {lang === 'en' ? 'Since' : 'Sejak'} {data.since}
            </small>
          )}
          <a href={`https://wakatime.com/@${S.wakatime}`} target="_blank" rel="noopener" style={{ fontSize: '.82rem', width: 'fit-content' }}>
            wakatime.com/@{S.wakatime} ↗
          </a>
        </>
      ) : done ? (
        <small>
          {lang === 'en'
            ? 'Stats are being maintained — check the WakaTime profile directly.'
            : 'Statistik sedang dalam pemeliharaan — cek profil WakaTime langsung.'}
        </small>
      ) : (
        <span className="lv-skel" />
      )}
    </div>
  );
}

function GithubPanel() {
  const { lang } = useLanguage();
  const { data, done } = usePolling<{ total: number }>(
    async (signal) => {
      const d = await getJson<{ user?: { contributionsCollection?: { contributionCalendar?: { totalContributions?: number } } } }>(
        '/v1/github/contributions',
        signal,
      );
      const total = d?.user?.contributionsCollection?.contributionCalendar?.totalContributions;
      return typeof total === 'number' ? { total } : null;
    },
    10 * 60_000,
  );

  return (
    <div className="lv">
      <div className="lv-h">
        <Icon name="github" size={17} />
        {lang === 'en' ? 'GitHub contributions' : 'Kontribusi GitHub'}
      </div>
      {data ? <b>{new Intl.NumberFormat('en').format(data.total)}</b> : done ? <small>{lang === 'en' ? 'Open the profile for live activity.' : 'Buka profil untuk aktivitas langsung.'}</small> : <span className="lv-skel" />}
      <small>{lang === 'en' ? 'last 12 months' : '12 bulan terakhir'}</small>
      <a href={S.social.github} target="_blank" rel="noopener" style={{ fontSize: '.82rem', width: 'fit-content' }}>
        github.com/{S.github} ↗
      </a>
    </div>
  );
}


export function LiveStats() {
  return (
    <div className="live rv">
      <CryptoPanel />
      <SocialPanel />
      <WakaPanel />
      <GithubPanel />
    </div>
  );
}
