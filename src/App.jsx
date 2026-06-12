import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Masa from './pages/Masa';
import Order from './pages/Order';
import KitchenLogin from './pages/KitchenLogin';
import KitchenScreen from './pages/KitchenScreen';
import './App.css';

function KitchenRoute() {
  const [token, setToken] = useState(localStorage.getItem('kitchen-token'));

  const handleLogin = (t) => {
    setToken(t);
    localStorage.setItem('kitchen-token', t);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('kitchen-token');
  };

  if (!token) return <KitchenLogin onLogin={handleLogin} />;
  return <KitchenScreen token={token} onLogout={handleLogout} />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/masa/:id" element={<Masa />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/mutfak" element={<KitchenRoute />} />
          <Route path="/" element={<h1>Her Şey Ege'den</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
