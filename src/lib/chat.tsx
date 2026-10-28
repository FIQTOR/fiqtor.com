import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { S } from '../data/site';
import { API_BASE_URL, isApiBaseUrlValid } from '../config/Api';
import { isAIEnabled } from '../config/Features';
import { useLanguage } from './catalog';
import { Icon } from './utils.tsx';


/* =====================================================================
   AI assistant — streams Server-Sent Events from the backend:
     POST ${API_BASE_URL}/v1/ai/generate
     body   { input, history: [{role, parts:[{text}]}] }
   Events (one JSON object per `data:` line):
     { type: 'redirectLocal', url }  → navigate inside the SPA
     { type: 'redirect', platform }  → open a social profile
     { text }                        → append streamed tokens
     { status: 'failed', text }      → terminal error from the backend
     [DONE]                          → end of stream
   The backend mounted at `…/api` (Vercel) or `…/` (bare Express) — both are
   supported: the request is sent to `/v1/ai/generate` and, if the host answers
   404 (a wrong prefix), the same request is retried once under `/api`.
   ===================================================================== */

/** Route labels for the "Opening /projects…" notice. */
const LABELS: Record<string, string> = {
  '/': 'Home',
  '/projects': 'Projects',
  '/certificates': 'Certificates',
  '/career': 'Career',
  '/contact': 'Contact',
  '/linktree': 'Linktree',
};

/**
 * The backend's redirect map still speaks the previous site's vocabulary
 * (`/talk`, `/certification`, `/#about`, `/roadmap`, `/kanban`). Map every
 * answer onto a route that actually exists here so the assistant never
 * navigates into the 404 page.
 */
const ROUTE_ALIASES: Record<string, string> = {
  '/talk': '/contact',
  '/certification': '/certificates',
  '/roadmap': '/career',
  '/kanban': '/career',
  '/home': '/',
};

/** Map a backend redirect onto a route of THIS site (unknown → 404 page). */
const normalizeRoute = (raw: string): string => {
  const path = (raw || '/').trim();
  const cut = path.search(/[?#]/);
  const base = (cut === -1 ? path : path.slice(0, cut)) || '/';
  const clean = base.length > 1 ? base.replace(/\/+$/, '') : '/';
  const known = ROUTE_ALIASES[clean] ?? clean;
  const exists =
    known === '/' || ['/projects', '/career', '/certificates', '/contact', '/linktree'].includes(known);
  return exists ? known : '/';
};

interface ChatMsg {
  id: number;
  who: 'u' | 'b';
  text: string;
  error?: boolean;
}

interface ChatCtx {
  open: boolean;
  available: boolean;
  openChat: (o?: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<ChatCtx | null>(null);

export const useChat = (): ChatCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useChat must be used inside <ChatProvider>');
  return c;
};

/** Local fallback answers when the backend is unreachable. */
const FALLBACK: [RegExp, { en: string; id: string }][] = [
  [
    /halo|hai|hi\b|hello|hey/i,
    { en: 'Hi! Ask me about services, projects, or how to get in touch.', id: 'Halo! Tanya saya soal layanan, proyek, atau cara menghubungi.' },
  ],
  [
    /project|proyek|portfolio|karya|portofolio/i,
    { en: 'There are 35+ projects on the Projects page — filter by category or search a tech name.', id: 'Ada 35+ proyek di halaman Projects — filter per kategori atau cari nama teknologi.' },
  ],
  [
    /service|layanan|jasa|iarty|build|bikin|buat/i,
    { en: `${S.company.name} builds web apps, AI integrations, and business systems. Automation is available too.`, id: `${S.company.name} membuat aplikasi web, integrasi AI, dan sistem bisnis. Otomasi juga tersedia.` },
  ],
  [
    /price|harga|cost|biaya|budget/i,
    { en: 'Pricing depends on scope. Send a brief through the Contact form or WhatsApp and you get an estimate.', id: 'Harga tergantung ruang lingkup. Kirim ringkasan lewat form Kontak atau WhatsApp dan Anda dapat estimasi.' },
  ],
  [
    /contact|kontak|whatsapp|wa\b|email|hubung/i,
    { en: `Email: ${S.email}\nWhatsApp: +${S.wa}`, id: `Email: ${S.email}\nWhatsApp: +${S.wa}` },
  ],
  [
    /skill|stack|tech|teknologi/i,
    { en: 'Core stack: ' + S.stack.slice(0, 8).join(', ') + ', plus AI integrations.', id: 'Stack utama: ' + S.stack.slice(0, 8).join(', ') + ', plus integrasi AI.' },
  ],
];

const localAnswer = (q: string, lang: 'en' | 'id' | 'zh'): string => {
  const hit = FALLBACK.find(([re]) => re.test(q));
  if (hit) return (hit[1] as Record<string, string>)[lang] || hit[1].en;
  if (lang === 'zh') return `该问题建议直接与我沟通更高效 — WhatsApp +${S.wa} 或发送邮件至 ${S.email}。`;
  return lang === 'en'
    ? `That one is quicker to answer directly — WhatsApp +${S.wa} or email ${S.email}.`
    : `Pertanyaan itu lebih cepat dijawab langsung — WhatsApp +${S.wa} atau email ${S.email}.`;
};

/**
 * POST the prompt and return the streaming response.
 *
 * The canonical deployment mounts Express under `/api`
 * (`…/api/v1/ai/generate`), so `API_BASE_URL` is tried first. Some hosts expose
 * the same routes without the prefix, so the other form is tried ONCE as a
 * fallback. A retry is triggered by BOTH:
 *
 *   • HTTP 404 — the wrong prefix (an HTML shell or a JSON "not found"),
 *   • a thrown request — DNS failure, CORS, connection refused, or a
 *     non-2xx the browser surfaces as a network error.
 *
 * The previous version only retried on 404 and then cast `null` to `Response`,
 * which crashed the caller (`res.ok`) if every attempt failed. An AbortError
 * (the visitor closed the panel, or a redirect ended the turn) is NOT retried
 * and is re-thrown so the caller can tell it apart from a real failure.
 */
async function openStream(
  body: string,
  signal: AbortSignal,
): Promise<Response> {
  const bases = [API_BASE_URL];
  if (API_BASE_URL.endsWith('/api')) bases.push(API_BASE_URL.slice(0, -4));
  else bases.push(`${API_BASE_URL}/api`);

  let lastError: unknown = null;
  let last: Response | null = null;

  for (const base of bases) {
    try {
      const res = await fetch(`${base}/v1/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body,
        signal,
      });
      // A real answer (the route exists): stream it, whatever the status.
      if (res.status !== 404) return res;
      // 404 → the prefix is wrong on this host; remember it and try the other.
      last = res;
    } catch (err) {
      // The request was cancelled: propagate immediately, never retry.
      if ((err as Error).name === 'AbortError') throw err;
      // A transport-level failure (CORS, DNS, refused). Try the other prefix.
      lastError = err;
    }
  }

  // Every attempt failed. Prefer the last real HTTP response (so the caller can
  // read its status, e.g. 429) over a thrown error, then surface the error.
  if (last) return last;
  throw lastError ?? new Error('AI request failed');
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [pending, setPending] = useState(false);
  const [input, setInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const available = isAIEnabled();

  const greeting = useCallback(
    (): ChatMsg => ({
      id: ++idRef.current,
      who: 'b',
      text:
        lang === 'en'
          ? `Hi! I'm ${S.alias}'s AI assistant. Ask me about services, projects, or contact details.`
          : `Halo! Saya asisten AI ${S.alias}. Tanya soal layanan, proyek, atau kontak.`,
    }),
    [lang],
  );

  const openChat = useCallback(
    (o = true) => {
      setOpen(o);
      if (o) {
        setMsgs((m) => (m.length ? m : [greeting()]));
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
      }
    },
    [greeting],
  );

  const toggle = useCallback(() => openChat(!open), [open, openChat]);

  const send = useCallback(
    async (raw: string) => {
      const q = raw.trim();
      if (!q || pending) return;
      setInput('');
      const history = msgs
        .filter((m) => !m.error)
        .slice(-10)
        .map((m) => ({ role: m.who === 'u' ? 'user' : 'model', parts: [{ text: m.text }] }));
      const userMsg: ChatMsg = { id: ++idRef.current, who: 'u', text: q };
      const botId = ++idRef.current;
      setMsgs((m) => [...m, userMsg, { id: botId, who: 'b', text: '' }]);
      setPending(true);

      const append = (chunk: string, reset = false) =>
        setMsgs((list) =>
          list.map((m) => (m.id === botId ? { ...m, text: reset ? chunk : m.text + chunk, error: false } : m)),
        );

      if (!isApiBaseUrlValid) {
        append(localAnswer(q, lang));
        setPending(false);
        return;
      }

      const ctrl = new AbortController();
      ctrlRef.current = ctrl;
      // Declared outside the try so the AbortError path can see whether the
      // turn already produced an answer (redirect / streamed text).
      let handled = false;
      try {
        const res = await openStream(JSON.stringify({ input: q, history }), ctrl.signal);
        if (!res.ok || !res.body) {
          // 429 (rate limit / daily quota) is a real, explainable answer from
          // the backend: its JSON body says which limit was hit. Showing the
          // canned fallback instead would read as "the AI is broken" when the
          // visitor only needs to wait.
          if (res.status === 429) {
            const info = await res.json().catch(() => null);
            const wait = Number(res.headers.get('retry-after') || 0);
            const mins = wait > 0 ? Math.ceil(wait / 60) : 0;
            append(
              mins
                ? lang === 'en'
                  ? `I've hit my message limit. Please try again in about ${mins} minute${mins === 1 ? '' : 's'} — or reach me on WhatsApp right away.`
                  : `Batas pesan tercapai. Coba lagi sekitar ${mins} menit lagi — atau langsung hubungi saya lewat WhatsApp.`
                : (info && (info.error || info.message)) ||
                    (lang === 'en'
                      ? `I've hit my message limit. Please try again later — or reach me on WhatsApp.`
                      : `Batas pesan tercapai. Coba lagi nanti — atau hubungi saya lewat WhatsApp.`),
            );
            setPending(false);
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }

        // Content-type guard: an HTML error page (SPA fallback, WAF, captive
        // portal) has no SSE events, so surface it instead of "reading" tags.
        const ct = res.headers.get('content-type') ?? '';
        if (ct && !/event-stream|text\/plain/i.test(ct)) throw new Error(`unexpected content-type ${ct}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let acc = '';

        /** Handle one parsed SSE event. Returns true when the turn is over. */
        const onEvent = (chunk: string): boolean => {
          const payload = chunk.trim();
          if (!payload || payload === '[DONE]') return false;
          let evt: { type?: string; url?: string; platform?: string; text?: string; status?: string };
          try {
            evt = JSON.parse(payload) as typeof evt;
          } catch {
            // Not JSON: treat the chunk as plain text (older backends).
            evt = { text: payload };
          }
          if (evt.status === 'failed') {
            append(evt.text || localAnswer(q, lang));
            return true;
          }
          if (evt.type === 'redirectLocal' && evt.url) {
            const target = normalizeRoute(evt.url);
            // A full navigation would interrupt the chat mid-conversation.
            // Stay in the SPA and close the panel instead.
            const label = LABELS[target] ?? 'that page';
            append(lang === 'en' ? `Opening ${label}…` : `Membuka halaman ${label}…`);
            setPending(false);
            setToast(lang === 'en' ? `Opening ${label}…` : `Membuka halaman ${label}…`);
            openChat(false);
            setTimeout(() => {
              // Same path + hash (e.g. already on "/") would be a no-op for
              // React Router, so fall back to a native navigation.
              if (target.split('#')[0] === location.pathname) window.location.assign(target);
              else navigate(target);
              setToast(null);
            }, 450);
            handled = true;
            return true;
          }
          if (evt.type === 'redirect' && evt.platform) {
            append(lang === 'en' ? `Opening ${evt.platform}…` : `Membuka ${evt.platform}…`);
            setPending(false);
            window.open(evt.platform, '_blank', 'noopener');
            handled = true;
            return true;
          }
          // Token frames do NOT end the turn — only redirects and failures do.
          if (evt.text) {
            acc += evt.text;
            append(acc, true);
          }
          return false;
        };

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // SSE frames end with a blank line; tolerate \r\n and a trailing
          // frame without the final newline.
          const frames = buffer.split(/\r?\n\r?\n/);
          buffer = frames.pop() ?? '';
          for (const frame of frames) {
            for (const line of frame.split(/\r?\n/)) {
              if (!line.startsWith('data:')) continue;
              if (onEvent(line.slice(5).replace(/^ /, '')) && handled) {
                // The turn is over (redirect / failure): stop reading.
                ctrl.abort();
                break;
              }
            }
            if (handled) break;
          }
          if (handled) break;
        }
        // Flush a final frame that arrived without the closing blank line.
        if (!handled && buffer.trim()) {
          for (const line of buffer.split(/\r?\n/)) {
            if (line.startsWith('data:')) onEvent(line.slice(5).replace(/^ /, ''));
          }
        }
        if (!acc.trim() && !handled) append(localAnswer(q, lang));
      } catch (err) {
        // `openChat(false)` aborts the request; and an early redirect/answer
        // closes the stream ourselves (see `onEvent`). Neither is a failure.
        const aborted = (err as Error).name === 'AbortError';
        if (aborted && handled) return;
        if (aborted) {
          setMsgs((list) => list.filter((m) => m.id !== botId));
          return;
        }
        // Never leave an empty bubble behind: answer locally so the visitor
        // still gets something useful when the backend is unreachable.
        append(localAnswer(q, lang));
      } finally {
        ctrlRef.current = null;
        setPending(false);
      }
    },
    [pending, msgs, lang, openChat, navigate, location.pathname],
  );

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    // `pending` is a trigger: a typing indicator also needs to be scrolled in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, pending]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') openChat(false);
    };
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, [open, openChat]);

  useEffect(() => () => ctrlRef.current?.abort(), []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(id);
  }, [toast]);

  const value = useMemo(() => ({ open, available, openChat, toggle }), [open, available, openChat, toggle]);
  const suggestions =
    lang === 'en' ? ['What can you build?', 'Show me projects', 'How do I contact you?'] : ['Bisa buat apa saja?', 'Lihat proyek', 'Cara menghubungi'];

  return (
    <Ctx.Provider value={value}>
      {children}
      {available && (
        <>
          <span className="chat-tip" style={{ display: open ? 'none' : undefined }} aria-hidden="true">
            {lang === 'en' ? 'Ask my AI 👋' : 'Tanya AI saya 👋'}
          </span>
          <button
            className="chat-fab"
            type="button"
            aria-label={lang === 'en' ? 'Open AI assistant' : 'Buka asisten AI'}
            aria-expanded={open}
            onClick={() => toggle()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a8 8 0 0 1-11.6 7.1L3 20l1-4.6A8 8 0 1 1 21 12z" />
            </svg>
          </button>
          <div className={'chat' + (open ? ' open' : '')} role="dialog" aria-label={lang === 'en' ? 'AI assistant' : 'Asisten AI'}>
            {toast && <div className="ch-toast">{toast}</div>}
            <div className="ch-h">
              <i />
              {lang === 'en' ? 'AI assistant' : 'Asisten AI'}
              <button type="button" aria-label={lang === 'en' ? 'Close' : 'Tutup'} onClick={() => openChat(false)}>
                ×
              </button>
            </div>
            <div className="ch-b" ref={bodyRef} aria-live="polite">
              {msgs.map((m) => (
                <div className={'msg ' + m.who + (m.error ? ' err' : '')} key={m.id} style={{ whiteSpace: 'pre-wrap' }}>
                  {m.text || (m.who === 'b' && pending ? <PendingDots /> : null)}
                </div>
              ))}
            </div>
            {msgs.length < 2 && (
              <div className="qr">
                {suggestions.map((s) => (
                  <button type="button" key={s} onClick={() => void send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form
              className="ch-f"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <input
                ref={inputRef}
                placeholder={lang === 'en' ? 'Ask anything…' : 'Tulis pertanyaan…'}
                autoComplete="off"
                aria-label={lang === 'en' ? 'Question' : 'Pertanyaan'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1200}
              />
              <button aria-label={lang === 'en' ? 'Send' : 'Kirim'} disabled={pending || !input.trim()}>
                <Icon name="arrow" size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </Ctx.Provider>
  );
}

function PendingDots() {
  return (
    <span className="dots">
      <span />
      <span />
      <span />
    </span>
  );
}
