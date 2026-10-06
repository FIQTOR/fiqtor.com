import { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureException } from '@/config/sentry';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level React error boundary. Catches render-time errors so a single broken
 * subtree can't blank the whole app, reports them to Sentry, and renders a
 * minimal recovery UI (reload) instead of a white screen.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureException(error, { componentStack: info.componentStack });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
          An unexpected error occurred. Please try reloading the page.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          Reload
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
