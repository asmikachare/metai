import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { useLayoutEffect } from 'react';
import App from './app/App.tsx';
import { AnalyzePage } from './app/routes/AnalyzePage.tsx';
import { ExplorePage } from './app/routes/ExplorePage.tsx';
import { ArchivePage } from './app/routes/ArchivePage.tsx';
import './styles/index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    const id = setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/analyze" element={<AnalyzePage />} />
    </Routes>
  </BrowserRouter>
);
