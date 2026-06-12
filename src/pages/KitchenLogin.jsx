import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function KitchenLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${BACKEND_URL}/api/kitchen/login`, { password });
      onLogin(res.data.token);
    } catch {
      setError('Hatalı şifre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kitchen-login">
      <div className="kitchen-login-box">
        <img src="/logo.png" alt="logo" className="kitchen-logo" />
        <h2>Mutfak Girişi</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
            autoFocus
          />
          {error && <p className="kitchen-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default KitchenLogin;