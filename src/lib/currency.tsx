import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { useLanguage } from './catalog';

export type CurrencyCode = 'IDR' | 'USD' | 'CNY' | 'SGD' | 'EUR' | 'GBP' | 'AUD' | 'JPY' | 'MYR';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  country: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', country: 'Indonesia' },
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'China' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore' },
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia' },
];

const CURRENCY_KEY = 'fiqtor.currency';

// Static fallback rates relative to 1 IDR in case live fetch fails or is offline
const FALLBACK_RATES_FROM_IDR: Record<CurrencyCode, number> = {
  IDR: 1,
  USD: 0.000062,
  CNY: 0.00045,
  SGD: 0.000083,
  EUR: 0.000057,
  GBP: 0.000049,
  AUD: 0.000095,
  JPY: 0.0094,
  MYR: 0.00028,
};

interface CurrencyCtx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (amountIDR: number, periodSuffix?: { en: string; id: string; zh?: string }) => string;
  rates: Record<string, number>;
}

const CurrencyContext = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY) as CurrencyCode;
      if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) return saved;
    } catch {
      /* ignore */
    }
    if (lang === 'zh') return 'CNY';
    if (lang === 'id') return 'IDR';
    return 'USD';
  });

  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES_FROM_IDR);

  // Auto-switch default currency if user switches language and hasn't explicitly locked it
  useEffect(() => {
    try {
      const hasSaved = localStorage.getItem(CURRENCY_KEY);
      if (!hasSaved) {
        if (lang === 'zh') setCurrencyState('CNY');
        else if (lang === 'id') setCurrencyState('IDR');
        else setCurrencyState('USD');
      }
    } catch {
      /* ignore */
    }
  }, [lang]);

  // Fetch live exchange rates from open.er-api.com
  useEffect(() => {
    let active = true;
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/IDR');
        if (!res.ok) return;
        const data = await res.json();
        if (active && data?.rates) {
          setRates((prev) => ({ ...prev, ...data.rates }));
        }
      } catch {
        /* fallback rates remain */
      }
    };
    fetchRates();
    return () => {
      active = false;
    };
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_KEY, c);
    } catch {
      /* ignore */
    }
  };

  const formatPrice = useMemo(() => {
    return (amountIDR: number, periodSuffix?: { en: string; id: string; zh?: string }): string => {
      const rate = rates[currency] || FALLBACK_RATES_FROM_IDR[currency] || 1;
      const converted = amountIDR * rate;

      let formattedNumber = '';
      if (currency === 'IDR') {
        formattedNumber = `Rp ${Math.round(amountIDR).toLocaleString('id-ID')}`;
      } else if (currency === 'JPY') {
        formattedNumber = `¥${Math.round(converted).toLocaleString('ja-JP')}`;
      } else {
        const rounded = converted >= 100 ? Math.round(converted) : Math.round(converted * 10) / 10;
        const symbol = SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.symbol || currency;
        formattedNumber = `${symbol}${rounded.toLocaleString('en-US')}`;
      }

      const prefix = lang === 'zh' ? '起价 ' : lang === 'id' ? 'Mulai ' : 'From ';
      const suffix = periodSuffix
        ? lang === 'zh'
          ? periodSuffix.zh || periodSuffix.en
          : lang === 'id'
          ? periodSuffix.id
          : periodSuffix.en
        : '';

      return `${prefix}${formattedNumber}${suffix}`;
    };
  }, [currency, rates, lang]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, rates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyCtx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return ctx;
}
