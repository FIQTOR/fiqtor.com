import { useTheme } from '../lib/theme';
import { useLanguage } from '../lib/catalog';

/**
 * Dark / light switch. Both themes are monochrome, so the icon is the only
 * affordance needed; the label is exposed to screen readers and to a tooltip.
 */
export function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const { lang } = useLanguage();
  const isDark = theme === 'dark';
  const label = isDark
    ? lang === 'zh'
      ? '切换到浅色主题'
      : lang === 'en'
      ? 'Switch to light theme'
      : 'Ganti ke tema terang'
    : lang === 'zh'
      ? '切换到深色主题'
      : lang === 'en'
      ? 'Switch to dark theme'
      : 'Ganti ke tema gelap';

  return (
    <button
      type="button"
      className={'theme-sw' + (compact ? ' compact' : '')}
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={!isDark}
    >
      <span className="sr">{label}</span>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
          </>
        ) : (
          <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2z" />
        )}
      </svg>
    </button>
  );
}
