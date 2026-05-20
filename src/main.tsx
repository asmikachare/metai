import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import App from './app/App.tsx';
import { AnalyzePage } from './app/routes/AnalyzePage.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/analyze" element={<AnalyzePage />} />
    </Routes>
  </BrowserRouter>
);
