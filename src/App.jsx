import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import TrendsPage from './pages/TrendsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trends" element={<TrendsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
