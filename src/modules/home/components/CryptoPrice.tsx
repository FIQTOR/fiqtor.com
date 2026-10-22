import Loading from "@/components/Loading";
import axios from "axios";
import { API_BASE_URL } from "@/config/Api";
import { useCallback, useEffect, useRef, useState } from "react";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import { useTranslation } from "@/i18n";

/**
 * Realtime refresh interval. The backend caches upstream market data briefly
 * (see backend crypto.service), so 30s is the sweet spot: fresh enough to feel
 * live, cheap enough to never hit upstream rate limits.
 */
const REFRESH_INTERVAL_MS = 30_000;

type Coin = {
  rate: number;
  /**
   * `delta.month` is a RATIO relative to 30 days ago (1 = unchanged).
   * `delta.day` (optional) is the same ratio for 24h change.
   */
  delta: { month: number; day?: number };
};

type DataType = {
  btc: Coin;
  eth: Coin;
  sol: Coin;
};

/** Number of decimals that makes sense for the magnitude of the price. */
const priceDecimals = (rate: number): number => {
  if (rate >= 1) return 2;
  if (rate >= 0.01) return 4;
  return 6;
};

const CryptoCard = ({
  coin,
  name,
  icon
}: {
  coin: Coin;
  name: string;
  icon: string;
}) => {
  // Prefer the 24h delta for a "realtime" feel; fall back to 30d when the
  // backend payload doesn't include it yet.
  const delta = typeof coin.delta.day === "number" ? coin.delta.day : coin.delta.month;
  const window = typeof coin.delta.day === "number" ? "24h" : "30d";
  const changePercent = (delta - 1) * 100;
  const isPositive = changePercent >= 0;

  return (
    <div className="flex items-center gap-3 py-2 transition-all duration-200 hover:scale-[1.01]">
      <div className="relative">
        <img
          src={icon}
          alt={name}
          className="w-8 h-8 rounded-full"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {name}
          </span>
          {/* tabular-nums keeps the number from jittering as it ticks */}
          <span className="text-base font-bold text-neutral-800 dark:text-neutral-200 tabular-nums">
            ${coin.rate.toLocaleString("en-US", {
              minimumFractionDigits: priceDecimals(coin.rate),
              maximumFractionDigits: priceDecimals(coin.rate),
            })}
          </span>
        </div>

        <div className={`flex items-center text-sm font-medium mt-1 tabular-nums ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
          {isPositive ? (
            <TbCaretUpFilled className="mr-1" />
          ) : (
            <TbCaretDownFilled className="mr-1" />
          )}
          {Math.abs(changePercent).toFixed(2)}%
          <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
            ({window})
          </span>
        </div>
      </div>
    </div>
  );
};

const CryptocurrencyPrice = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setDisabled] = useState(false);
  // True when the LAST refresh attempt failed but we still have stale data,
  // so the UI can flag that the prices are no longer fresh.
  const [isStale, setStale] = useState(false);
  // Only the very first fetch is allowed to hide the section. A transient
  // network blip later must never unmount an already-visible widget.
  const hasLoadedOnce = useRef(false);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      const newData = await getCoins(signal);
      if (signal?.aborted) return;

      if (newData === null) {
        if (!hasLoadedOnce.current) {
          setDisabled(true);
        } else {
          setStale(true);
        }
      } else {
        hasLoadedOnce.current = true;
        setStale(false);
        setData(newData);
      }
      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") {
        fetchData(signal);
      }
    };

    // Kick off the first request asynchronously so the effect body itself
    // doesn't synchronously setState (avoids a cascading render).
    const initial = window.setTimeout(refreshIfVisible, 0);

    // Poll so prices stay live while the page is open. We pause while the tab
    // is hidden (no point fetching for an unseen widget) and refresh
    // immediately when the user comes back.
    const interval = window.setInterval(refreshIfVisible, REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      controller.abort();
      window.clearTimeout(initial);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshIfVisible);
    };
  }, [fetchData]);

  if (isDisabled) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-30">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="mb-3">
        <h3 className="flex items-center gap-2 text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
          {t("home.crypto.title")}
          <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            {t("home.crypto.live")}
          </span>
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {isStale ? t("home.crypto.stale") : t("home.crypto.badge")}
        </p>
      </div>

      <div className="space-y-2">
        {data && (
          <>
            <CryptoCard
              coin={data.btc}
              name="Bitcoin"
              icon="/img/cryptocurrency/bitcoin.png"
            />
            <CryptoCard
              coin={data.eth}
              name="Ethereum"
              icon="/img/cryptocurrency/etherium.png"
            />
            <CryptoCard
              coin={data.sol}
              name="Solana"
              icon="/img/cryptocurrency/solana.png"
            />
          </>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          {t("home.crypto.footnote")}
        </p>
      </div>
    </div>
  );
};

/**
 * Fetch live crypto prices from OUR backend.
 * No third-party API key is ever exposed to the browser.
 */
async function getCoins(signal?: AbortSignal): Promise<DataType | null> {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/v1/crypto`,
      { signal, timeout: 10_000 }
    );

    const payload = res.data?.data;
    if (!payload?.btc || !payload?.eth || !payload?.sol) {
      return null;
    }

    return {
      btc: payload.btc,
      eth: payload.eth,
      sol: payload.sol,
    };
  } catch {
    return null;
  }
}

export default CryptocurrencyPrice;
