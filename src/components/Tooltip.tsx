import type { ReactNode } from 'react';

interface TooltipProps {
  /** Tooltip text. */
  label: ReactNode;
  /** The control the tooltip describes (button/link). */
  children: ReactNode;
}

/**
 * Small pill tooltip shown on hover/focus, anchored above its trigger.
 * Reusable so NavLink, the theme toggle (and future controls) stay in sync.
 *
 * The trigger should sit inside a `group` wrapper. The tooltip is
 * `aria-hidden` because the trigger already carries the accessible name.
 */
export default function Tooltip({ label, children }: TooltipProps) {
  return (
    <div className="group/tooltip relative inline-flex">
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 flex-col items-center origin-bottom scale-75 translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover/tooltip:scale-100 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:scale-100 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100"
      >
        <span className="relative z-10 whitespace-nowrap rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl dark:bg-neutral-100 dark:text-neutral-900">
          {label}
        </span>
        <div className="-mt-1 h-2 w-2 rotate-45 bg-neutral-900 dark:bg-neutral-100" />
      </div>
    </div>
  );
}
