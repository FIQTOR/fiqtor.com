import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { isFinePointer, isReducedMotion } from './utils';
import { copyText } from './utils.tsx';

/* =====================================================================
   UIContext: toasts, motion preference, pointer type
   ===================================================================== */

interface ToastState {
  id: number;
  msg: string;
}

interface UICtx {
  /** prefers-reduced-motion */
  RM: boolean;
  /** fine pointer (mouse/trackpad) device */
  fine: boolean;
  toast: (msg: string) => void;
  copy: (text: string, msg?: string) => Promise<void>;
}

const Ctx = createContext<UICtx | null>(null);

export function useUI(): UICtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useUI must be used inside <UIProvider>');
  return c;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [RM] = useState(isReducedMotion);
  const [fine] = useState(isFinePointer);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const idRef = useRef(0);
  const timers = useRef<number[]>([]);

  const toast = useCallback((msg: string) => {
    const id = ++idRef.current;
    setToasts((list) => [...list, { id, msg }]);
    const t = window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 2400);
    timers.current.push(t);
  }, []);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  const copy = useCallback(
    async (text: string, msg?: string) => {
      await copyText(text);
      toast(msg || 'Copied to clipboard');
    },
    [toast],
  );

  // `html.js` gates the reveal-on-scroll CSS so content stays visible without
  // JS; `html.rm` is a hook for reduced-motion overrides.
  useEffect(() => {
    const D = document.documentElement;
    D.classList.add('js');
    D.classList.toggle('rm', RM);
    return () => D.classList.remove('rm');
  }, [RM]);

  const value = useMemo<UICtx>(() => ({ RM, fine, toast, copy }), [RM, fine, toast, copy]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast on" role="status" key={t.id}>
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
