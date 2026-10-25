import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalEffects } from './GlobalEffects';
import { DetailModal } from './DetailModal';
import { PageShell } from './Loader';
import { Seo } from './Seo';
import { Analytics } from './Analytics';
import { UIProvider } from '../lib/ui';
import { ChatProvider } from '../lib/chat';
import { CatalogProvider, LanguageProvider } from '../lib/catalog';
import { ThemeProvider } from '../lib/theme';

/**
 * Shell shared by every route. The context order matters: `UIProvider` first
 * (toasts are used by contact/copy), then language, then catalog (modals), and
 * finally the chat assistant.
 */
function Content() {
  const location = useLocation();
  const skipLoader = Boolean((location.state as { skipLoader?: boolean } | null)?.skipLoader);

  // Scroll restoration on route change. (Listening to `location` directly is
  // intentional: a hash-only change also needs the scroll reset.)
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <PageShell onlyHistory={skipLoader}>
      <Seo />
      <Analytics />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="progress" aria-hidden="true" />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <DetailModal />
    </PageShell>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <UIProvider>
        <LanguageProvider>
          <ChatProvider>
            <CatalogProvider>
              <GlobalEffects />
              <Content />
            </CatalogProvider>
          </ChatProvider>
        </LanguageProvider>
      </UIProvider>
    </ThemeProvider>
  );
}
