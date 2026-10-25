import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Career from './pages/Career';
import Linktree from './pages/Linktree';
import NotFound from './pages/NotFound';
import './styles/site.css';

/**
 * Route table. `/kanban` deliberately does not exist in v3.
 * `lazy` keeps heavy pages (the certificate grid with 31 images, the contact
 * form with reCAPTCHA) out of the initial bundle.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      {
        path: 'certificates',
        lazy: async () => ({ Component: (await import('./pages/Certificates')).default }),
      },
      { path: 'career', element: <Career /> },
      {
        path: 'contact',
        lazy: async () => ({ Component: (await import('./pages/Contact')).default }),
      },
      { path: 'linktree', element: <Linktree /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>,
);
