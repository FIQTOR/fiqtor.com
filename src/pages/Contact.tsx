import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { S } from '../data/site';
import { API_BASE_URL } from '../config/Api';
import { RECAPTCHA_SITE_KEY, isRecaptchaEnabled } from '../config/Features';
import { InteractiveTitle, useLocalClock, useReveal } from '../hooks/useReveal';
import { useLanguage } from '../lib/catalog';
import { ext } from '../lib/utils';
import { Icon, type IconName } from '../lib/utils.tsx';
import { PageHeader } from '../components/FilterGallery';
import { FaqList } from '../components/FaqList';
import { ProcessSteps } from '../components/ProcessSteps';
import { ServiceList } from '../components/ServiceList';
import { useUI } from '../lib/ui';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const ref = useReveal();
  const { lang } = useLanguage();
  const { copy } = useUI();
  const clock = useLocalClock(S.tz, S.tzLabel);
  const t = useCallback((en: string, id: string) => (lang === 'en' ? en : id), [lang]);

  /* ---------- form state ---------- */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wa, setWa] = useState('');
  const [type, setType] = useState(S.contactTypes[0].en);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; captcha?: string }>({});
  const [status, setStatus] = useState<Status>('idle');
  const [stat, setStat] = useState('');
  const [captcha, setCaptcha] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const captchaEnabled = isRecaptchaEnabled();

  /** The message that gets sent / previewed, composed from the form fields. */
  const composed = useMemo(() => {
    const lines = [
      t(`Hi, I'm ${name.trim() || '[name]'}.`, `Halo, saya ${name.trim() || '[nama]'}.`),
      t(`Project type: ${type}.`, `Jenis proyek: ${type}.`),
      budget || timeline
        ? [budget && `${t('Budget', 'Budget')}: ${budget}`, timeline && `${t('Timeline', 'Waktu')}: ${timeline}`].filter(Boolean).join(' · ')
        : '',
      [email.trim() && `Email: ${email.trim()}`, wa.trim() && `WA: ${wa.trim()}`].filter(Boolean).join(' · '),
      '',
      message.trim() || t('[tell me about the idea]', '[ceritakan idemu]'),
    ];
    return lines.filter((l) => l !== '').join('\n');
  }, [name, email, wa, type, budget, timeline, message, t]);

  const pct = useMemo(() => {
    const parts = [!!name.trim(), /\S+@\S+\.\S+/.test(email), message.trim().length > 9, !!budget, !!timeline, !!type];
    return Math.round((parts.filter(Boolean).length / parts.length) * 100);
  }, [name, email, message, budget, timeline, type]);

  const C = 2 * Math.PI * 34;
  const meterText =
    pct < 50
      ? t('Keep going — the more detail, the faster the reply', 'Lanjutkan — makin lengkap makin cepat dibalas')
      : pct < 100
        ? t('Almost there', 'Hampir selesai')
        : t('Complete. Ready to send!', 'Lengkap. Siap dikirim!');

  const clear = () => {
    if (stat) setStat('');
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    let ok = true;
    if (!name.trim()) {
      e.name = t('Name is required.', 'Nama wajib diisi.');
      ok = false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      e.email = t('That email does not look valid.', 'Email belum valid.');
      ok = false;
    }
    if (message.trim().length < 10) {
      e.message = t('Message needs at least 10 characters.', 'Pesan minimal 10 karakter.');
      ok = false;
    }
    if (captchaEnabled && !captcha) {
      e.captcha = t('Please complete the reCAPTCHA.', 'Selesaikan reCAPTCHA dulu.');
      ok = false;
    }
    setErrors(e);
    if (!ok) {
      setStat(t('Check the highlighted fields.', 'Periksa kolom yang ditandai.'));
      if (e.name) nameRef.current?.focus();
      else if (e.email) emailRef.current?.focus();
      else if (e.message) msgRef.current?.focus();
    }
    return ok;
  };

  const submit = async () => {
    if (!validate() || status === 'sending') return;
    setStatus('sending');
    setStat(t('Sending…', 'Mengirim…'));
    // reCAPTCHA v2 tokens are single-use and expire after ~2 minutes. If the
    // previous attempt failed, the widget still looks "solved" while holding a
    // token the backend already rejected (or that has since expired), so the
    // retry would fail too. Reset the widget up front — AFTER the token in the
    // request below is read, so this attempt still sends the one just verified.
    const token = captcha;
    captchaRef.current?.reset();
    setCaptcha(null);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/contact/send`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          wa: wa.trim(),
          type,
          budget,
          timeline,
          message,
          composed,
          captcha: token,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('success');
      setStat('');
    } catch {
      setStatus('error');
      setStat(t('Sending failed. Try WhatsApp or email instead.', 'Gagal mengirim. Coba WhatsApp atau email.'));
    }
  };

  /**
   * Contact channels, most-active first. WhatsApp is the primary channel (it
   * gets answered fastest), so it is rendered as a full-width feature card;
   * the rest follow in the grid.
   */
  const channels: Array<{
    icon: IconName;
    name: string;
    value: string;
    href: string;
    copy: string;
    primary?: boolean;
    note?: string;
  }> = [
    {
      icon: 'whatsapp',
      name: 'WhatsApp',
      value: '+' + S.wa,
      href: `https://wa.me/${S.wa}?text=${encodeURIComponent(
        t('Hi FIQTOR! I found your site and would like to talk about a project.', 'Halo FIQTOR! Saya dari situs Anda dan ingin membahas proyek.'),
      )}`,
      copy: '+' + S.wa,
      primary: true,
      note: t('Fastest reply · usually minutes · 08:00–22:00 WIB', 'Balasan tercepat · biasanya beberapa menit · 08.00–22.00 WIB'),
    },
    { icon: 'mail', name: 'Email', value: S.email, href: `mailto:${S.email}`, copy: S.email, note: t('Best for briefs & files', 'Cocok untuk brief & lampiran') },
    { icon: 'instagram', name: 'Instagram', value: '@' + S.alias.toLowerCase() + 'r', href: S.social.instagram, copy: S.social.instagram },
    { icon: 'tiktok', name: 'TikTok', value: '@' + S.alias.toLowerCase(), href: S.social.tiktok, copy: S.social.tiktok },
    { icon: 'github', name: 'GitHub', value: '@' + S.alias.toLowerCase(), href: S.social.github, copy: S.social.github },
    { icon: 'linkedin', name: 'LinkedIn', value: S.alias, href: S.social.linkedin, copy: S.social.linkedin },
  ];
  const primary = channels.find((c) => c.primary)!;
  const rest = channels.filter((c) => !c.primary);

  if (status === 'success') {
    return (
      <div ref={ref}>
        <PageHeader
          crumb={t('Contact', 'Kontak')}
          title={t('Message sent.', 'Pesan terkirim.')}
          lead={t('Thanks for reaching out — a reply usually lands within 24 hours.', 'Terima kasih sudah menghubungi — balasan biasanya dalam 24 jam.')}
        />
        <section className="sec pgsec">
          <div className="succ">
            <i aria-hidden="true">✓</i>
            <h2>{t('Talk soon.', 'Sampai jumpa.')}</h2>
            <p>
              {t(
                'Your brief is on its way. In the meantime, the AI assistant at the bottom-right can answer quick questions.',
                'Ringkasan Anda sedang dikirim. Sementara itu, asisten AI di kanan bawah bisa menjawab pertanyaan cepat.',
              )}
            </p>
            <div style={{ display: 'flex', gap: '.7rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn-w btn-wa" href={`https://wa.me/${S.wa}`} target="_blank" rel="noopener">
                <Icon name="whatsapp" size={18} />
                {t('Faster: continue on WhatsApp', 'Lebih cepat: lanjut lewat WhatsApp')}
              </a>
              <Link className="btn2" to="/projects">
                {t('Browse projects', 'Lihat proyek')}
              </Link>
              <button
                className="btn2"
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setName('');
                  setEmail('');
                  setWa('');
                  setMessage('');
                  setBudget('');
                  setTimeline('');
                  setCaptcha(null);
                  requestAnimationFrame(() => {
                    document.getElementById('main')?.scrollIntoView({ behavior: 'smooth' });
                    nameRef.current?.focus({ preventScroll: true });
                  });
                }}
              >
                {t('Send another message', 'Kirim pesan lain')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={ref}>
      <PageHeader
        crumb={t('Contact', 'Kontak')}
        title={t('Let’s talk.', 'Ayo ngobrol.')}
        lead={t(
          'WhatsApp is the fastest way to reach me — usually answered within minutes, 08:00–22:00 WIB. Prefer a form or email? Both are below.',
          'WhatsApp adalah jalur tercepat — biasanya dibalas dalam hitungan menit, 08.00–22.00 WIB. Lebih suka form atau email? Keduanya tersedia di bawah.',
        )}
      >
        <div className="st rv">
          <span>
            <i />
            {t('Available for new projects', 'Tersedia untuk proyek baru')}
          </span>
          <span>{clock}</span>
          <span>{t('Replies in English or Bahasa Indonesia', 'Dibalas dalam bahasa Inggris atau Indonesia')}</span>
        </div>
        {/* Some enquiries arrive as "can I see your CV first?" — the PDF is
            already published, so the answer is one click instead of a reply. */}
        <p className="cv-dl rv">
          <a href={lang === 'en' ? S.resume.atsEn : S.resume.atsId} download>
            <Icon name="arrow" size={14} />
            {t('Download my CV (PDF)', 'Unduh CV saya (PDF)')}
          </a>
          <span>
            {t('ATS-friendly, updated for this year.', 'Format ATS, diperbarui tahun ini.')}
          </span>
        </p>
      </PageHeader>

      <section className="sec pgsec">
        {/* Primary channel: WhatsApp, full width, one tap to open a chat */}
        <a
          className="ch ch-primary rv"
          href={primary.href}
          target="_blank"
          rel="noopener"
          aria-label={t('Chat on WhatsApp', 'Chat lewat WhatsApp')}
          data-cur={t('Chat', 'Chat')}
        >
          <span className="ic">
            <Icon name="whatsapp" size={26} />
          </span>
          <div className="ch-tx">
            <small>
              <i className="dot" aria-hidden="true" />
              {t('Most active channel', 'Jalur paling aktif')}
            </small>
            <b>{t('Chat on WhatsApp', 'Chat lewat WhatsApp')}</b>
            <span className="ch-val">{primary.value}</span>
            {primary.note && <span className="ch-note">{primary.note}</span>}
          </div>
          <span className="ch-go" aria-hidden="true">
            {t('Open chat', 'Buka chat')}
            <Icon name="arrow" size={18} />
          </span>
          <span className="sr">{t('(opens in a new tab)', '(terbuka di tab baru)')}</span>
        </a>
        <div className="cc">
          {rest.map((c) => (
            <div className="ch rv" key={c.name}>
              <span className="ic">
                <Icon name={c.icon} />
              </span>
              <div>
                <small>{c.name}</small>
                <b>{c.value}</b>
                {c.note && <em className="ch-note">{c.note}</em>}
              </div>
              <a
                className="ca"
                href={c.href}
                target={ext(c.href) ? '_blank' : undefined}
                rel={ext(c.href) ? 'noopener' : undefined}
                aria-label={`${t('Open', 'Buka')} ${c.name}`}
                data-cur={t('Open', 'Buka')}
              />
              <div className="ac2">
                <button type="button" aria-label={`${t('Copy', 'Salin')} ${c.name}`} onClick={() => void copy(c.copy, `${c.name} ${t('copied', 'tersalin')}`)}>
                  <Icon name="copy" size={16} /> {t('Copy', 'Salin')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* The form comes straight after the channels: reaching it is the whole
            point of this page, so nothing information-heavy may sit in front of
            it. Pricing used to sit here and pushed the form a full screen down. */}
        <InteractiveTitle text={t('Tell me what you need.', 'Ceritakan kebutuhanmu.')} className="sub-h" />
        {/* The sticky sub-nav lets a visitor jump to pricing or the FAQ
            without scrolling through the form first. */}
        <nav className="pg-jump rv" aria-label={t('On this page', 'Di halaman ini')}>
          <a href="#services">{t('Pricing', 'Harga')} ↓</a>
          <a href="#answers-h">{t('Quick answers', 'Jawaban singkat')} ↓</a>
        </nav>

        <div className="cf">
          <form
            id="contact-form"
            className="fm rv"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            {status === 'error' && (
              <p className="recap" role="alert">
                {t(
                  'The message could not be delivered. You can copy it and send it via WhatsApp or email using the buttons below.',
                  'Pesan gagal terkirim. Salin pesannya lalu kirim lewat WhatsApp atau email dengan tombol di bawah.',
                )}
              </p>
            )}
            <div className="g2">
              <div>
                <label htmlFor="fn">{t('Name', 'Nama')}</label>
                <input
                  id="fn"
                  name="name"
                  ref={nameRef}
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby="en"
                  value={name}
                  onChange={(e) => {
                    clear();
                    setName(e.target.value);
                  }}
                />
                <div className="err" id="en" role="alert">
                  {errors.name}
                </div>
              </div>
              <div>
                <label htmlFor="fe">Email</label>
                <input
                  id="fe"
                  name="email"
                  type="email"
                  ref={emailRef}
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby="ee"
                  value={email}
                  onChange={(e) => {
                    clear();
                    setEmail(e.target.value);
                  }}
                />
                <div className="err" id="ee" role="alert">
                  {errors.email}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="fw">
                WhatsApp <em>({t('optional', 'opsional')})</em>
              </label>
              <input
                id="fw"
                name="wa"
                type="tel"
                autoComplete="tel"
                placeholder="08xxxxxxxxxx"
                value={wa}
                onChange={(e) => {
                  clear();
                  setWa(e.target.value);
                }}
              />
            </div>

            <div role="group" aria-labelledby="l1">
              <span className="lbl" id="l1">
                {t('Project type', 'Jenis proyek')}
              </span>
              <div className="opts">
                {S.contactTypes.map((o) => (
                  <button key={o.en} type="button" aria-pressed={type === o.en} onClick={() => setType(o.en)}>
                    {o[lang]}
                  </button>
                ))}
              </div>
            </div>
            <div role="group" aria-labelledby="l2">
              <span className="lbl" id="l2">
                {t('Budget estimate', 'Perkiraan budget')} <em>({t('optional', 'opsional')})</em>
              </span>
              <div className="opts">
                {S.budgets.map((o) => (
                  <button key={o.en} type="button" aria-pressed={budget === o[lang]} onClick={() => setBudget(budget === o[lang] ? '' : o[lang])}>
                    {o[lang]}
                  </button>
                ))}
              </div>
            </div>
            <div role="group" aria-labelledby="l3">
              <span className="lbl" id="l3">
                {t('Timeline', 'Target waktu')} <em>({t('optional', 'opsional')})</em>
              </span>
              <div className="opts">
                {S.timelines.map((o) => (
                  <button key={o.en} type="button" aria-pressed={timeline === o[lang]} onClick={() => setTimeline(timeline === o[lang] ? '' : o[lang])}>
                    {o[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="fm">{t('Tell me about the idea', 'Ceritakan idemu')}</label>
              <textarea
                id="fm"
                name="message"
                ref={msgRef}
                maxLength={1500}
                required
                aria-invalid={!!errors.message}
                aria-describedby="em cn"
                value={message}
                onChange={(e) => {
                  clear();
                  setMessage(e.target.value);
                }}
              />
              <div className="cnt2">
                <span className="err" id="em" role="alert">
                  {errors.message}
                </span>
                <span>{message.length} / 1500</span>
              </div>
            </div>

            {captchaEnabled && (
              <div>
                <div className="recaptcha">
                  <ReCAPTCHA ref={captchaRef} sitekey={RECAPTCHA_SITE_KEY} theme="dark" onChange={(v) => setCaptcha(v)} />
                </div>
                {errors.captcha && <div className="captcha-err">{errors.captcha}</div>}
              </div>
            )}

            {/* Two ways to send, visually separated: the WhatsApp button opens
                a chat elsewhere (nothing is delivered yet) and the form button
                actually submits. Side by side they read as two "send" buttons
                doing the same thing, so each label now states its outcome. */}
            <div className="submit-row">
              <button
                type="submit"
                className="btn-o submit-main"
                disabled={status === 'sending'}
                aria-busy={status === 'sending'}
              >
                {status === 'sending' ? t('Sending…', 'Mengirim…') : t('Send this form', 'Kirim form ini')}
              </button>
              <span className="submit-or" aria-hidden="true">
                {t('or', 'atau')}
              </span>
              <a
                className="btn-w btn-wa submit-wa"
                href={`https://wa.me/${S.wa}?text=${encodeURIComponent(composed)}`}
                target="_blank"
                rel="noopener"
              >
                <Icon name="whatsapp" size={18} />
                {t('Open in WhatsApp', 'Buka di WhatsApp')}
                <span className="sr"> {t('(new tab)', '(tab baru)')}</span>
              </a>
              <button type="button" className="btn2 submit-copy" onClick={() => void copy(composed, t('Message copied', 'Pesan tersalin'))}>
                <Icon name="copy" size={16} /> {t('Copy message', 'Salin pesan')}
              </button>
            </div>
            <p className="form-hint">
              {t(
                'The form is delivered straight to my inbox. The WhatsApp button opens a chat pre-filled with your message — nothing is sent until you press send there.',
                'Form langsung masuk ke inbox saya. Tombol WhatsApp membuka chat yang sudah terisi pesan Anda — belum terkirim sampai Anda menekan kirim di sana.',
              )}
            </p>
            <p className="stat" role="status">
              {stat}
            </p>
          </form>

          <aside className="pv rv" aria-label={t('Message preview', 'Pratinjau pesan')}>
            <div className="pv-card">
              <div className="pv-h">
                <i />
                {t('Message preview — updates as you type', 'Pratinjau pesan — berubah saat kamu mengetik')}
              </div>
              <div className="pv-b">
                <div className="bub">{composed}</div>
              </div>
            </div>
            <div className="pv-card meter">
              <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
                <defs>
                  <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#9bb4ff" />
                    <stop offset="1" stopColor="#c4a3ff" />
                  </linearGradient>
                </defs>
                <g transform="rotate(-90 42 42)">
                  <circle className="bgc" cx="42" cy="42" r="34" />
                  <circle className="fg" cx="42" cy="42" r="34" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - pct / 100) }} />
                </g>
                <text x="42" y="48" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff">
                  {pct}%
                </text>
              </svg>
              <div>
                <b>{t('Form completeness', 'Kelengkapan form')}</b>
                <small>{meterText}</small>
              </div>
            </div>
          </aside>
        </div>

        {/* Pricing sits AFTER the form: it answers "how much?" for people still
            deciding, but it must never stand between a ready visitor and the
            send button. `anchor="services"` keeps the /#pricing deep link and
            the nav item working. */}
        <InteractiveTitle text={t('What it costs.', 'Berapa biayanya.')} className="sub-h" />
        <p className="lead-sub rv">
          {t(
            'Each service in detail, with its starting price. Already sent a brief? Skip this — you will get a quote by reply.',
            'Setiap layanan dijelaskan lengkap beserta harga awalnya. Sudah kirim ringkasan? Lewati saja — Anda akan dapat penawaran lewat balasan.',
          )}
        </p>
        <ServiceList anchor="services" />

        <InteractiveTitle text={t('How it works.', 'Cara kerjanya.')} className="sub-h" />
        <ProcessSteps />

        <InteractiveTitle text={t('Common questions.', 'Pertanyaan umum.')} className="sub-h" />
        <FaqList />
        {/* Direct answers, phrased for answer engines: short, self-contained,
            and mirrored in the page's FAQPage structured data. */}
        <div className="answers rv" aria-labelledby="answers-h">
          <h3 id="answers-h">{t('Quick answers', 'Jawaban singkat')}</h3>
          <dl>
            <div>
              <dt>{t(`Who is ${S.name}?`, `Siapa ${S.name}?`)}</dt>
              <dd>
                {t(
                  `${S.name} is an AI and software engineer from Indonesia, founder of ${S.company.name}, with ${S.years}+ years of experience and ${S.projects.length} shipped projects.`,
                  `${S.name} adalah AI & software engineer dari Indonesia, pendiri ${S.company.name}, dengan pengalaman ${S.years}+ tahun dan ${S.projects.length} proyek yang sudah dirilis.`,
                )}
              </dd>
            </div>
            <div>
              <dt>{t('How fast is the reply?', 'Seberapa cepat balasannya?')}</dt>
              <dd>
                {t(
                  'WhatsApp is fastest (usually minutes, 08:00–22:00 WIB). Email and the form are answered within 24 hours.',
                  'WhatsApp paling cepat (biasanya beberapa menit, 08.00–22.00 WIB). Email dan form dibalas dalam 24 jam.',
                )}
              </dd>
            </div>
            <div>
              <dt>{t('What can be built?', 'Apa saja yang bisa dibangun?')}</dt>
              <dd>
                {t(
                  'Web apps, AI integration and automation, business systems (ERP, CRM, HRIS, school platforms), e-commerce, and landing pages.',
                  'Aplikasi web, integrasi & otomasi AI, sistem bisnis (ERP, CRM, HRIS, platform sekolah), e-commerce, dan landing page.',
                )}
              </dd>
            </div>
            <div>
              <dt>{t('Working hours?', 'Jam kerja?')}</dt>
              <dd>
                {t(
                  'GMT+7 (WIB), Monday to Saturday, 08:00–22:00. International clients welcome.',
                  'GMT+7 (WIB), Senin–Sabtu, 08.00–22.00. Klien internasional dipersilakan.',
                )}
              </dd>
            </div>
            {/* These two mirror entries in the page's FAQPage structured data
                (see CONTACT_FAQ in src/config/Seo.ts). The schema is invalid —
                and the rich result is dropped — if a question exists there but
                not on the page, so keep the two in sync when adding one. */}
            <div>
              <dt>{t('What certifications?', 'Sertifikasi?')}</dt>
              <dd>
                {t(
                  'BNSP national Junior Web Developer competency, 1st of 24 teams in SEAMEO QITEP in Science web cloud engineering, 4th of 44 in LKS Web Technologies (East Java), plus freeCodeCamp, Dicoding and W3Docs programs.',
                  'Kompetensi nasional BNSP Junior Web Developer, juara 1 dari 24 tim di web cloud engineering SEAMEO QITEP in Science, peringkat 4 dari 44 di LKS Web Technologies (Jawa Timur), serta program freeCodeCamp, Dicoding, dan W3Docs.',
                )}
              </dd>
            </div>
            <div>
              <dt>{t('How do we start?', 'Bagaimana memulai?')}</dt>
              <dd>
                {t(
                  'Pick a channel — the form, WhatsApp, or email — and send a short brief. A clear brief gets a faster estimate.',
                  'Pilih jalur — form, WhatsApp, atau email — lalu kirim ringkasan singkat. Ringkasan yang jelas menghasilkan estimasi lebih cepat.',
                )}
              </dd>
            </div>
          </dl>
        </div>
        <p className="rv" style={{ marginTop: '2rem', color: 'var(--muted)' }}>
          {t('Need a quick way in?', 'Butuh cara cepat?')}{' '}
          <Link to="/linktree" className="btn2" style={{ marginLeft: '.5rem', padding: '.5rem 1rem', fontSize: '.9rem' }}>
            {t('Open Linktree', 'Buka Linktree')} →
          </Link>
        </p>
      </section>
    </div>
  );
}
