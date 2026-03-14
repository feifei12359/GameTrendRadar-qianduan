import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import TrendDetailPage from './pages/TrendDetailPage.jsx';
import TrendsPage from './pages/TrendsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/trends/:keyword" element={<TrendDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
