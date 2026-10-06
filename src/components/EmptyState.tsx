import type { ComponentType, ReactNode } from 'react';

interface StateProps {
  /** Optional icon component (receives className). */
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  /** Optional secondary line / description. */
  description?: ReactNode;
  /** Optional action (e.g. a "clear filters" button). */
  action?: ReactNode;
  className?: string;
}

/**
 * Shared empty-state block: icon + message + optional action, centered.
 * Keeps "no results" / "nothing here yet" visuals consistent across pages.
 */
export function EmptyState({ icon: Icon, title, description, action, className = '' }: StateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center text-text-muted ${className}`}>
      {Icon && <Icon className="mb-4 h-20 w-20 opacity-20" />}
      <p className="text-xl font-medium">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm opacity-80">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Shared error-state block. Mirrors `EmptyState` but with an error tone so
 * failures read distinctly from "nothing to show".
 */
export function ErrorState({ icon: Icon, title, description, action, className = '' }: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 text-center ${className}`}>
      {Icon && <Icon className="mb-4 h-16 w-16 text-red-500/40" />}
      <p className="text-lg font-medium text-red-500">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
