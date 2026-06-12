import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch order
    axios.get(`${BACKEND_URL}/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => {
        console.error(err);
        setError('Sipariş bulunamadı');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Sipariş bulunamadı</div>;

  return (
    <div className="order-container">
      <h1>✓ Siparişiniz Alındı!</h1>
      
      <div className="order-summary">
        <div className="order-header">
          <h2>Masa {order.table_id}</h2>
          <p>Sipariş No: #{order.id}</p>
        </div>

        <div className="order-items">
          <h3>Sipariş Detayları:</h3>
          <ul>
            {order.items && order.items.map(item => (
              <li key={item.id}>
                <span>{item.name} x{item.quantity}</span>
                <span className="price">{(item.price_at_purchase * item.quantity).toFixed(2)} ₺</span>
              </li>
            ))}
          </ul>
        </div>

        {order.customer_note && (
          <div className="customer-note">
            <h4>Not:</h4>
            <p>{order.customer_note}</p>
          </div>
        )}

        <div className="order-total">
          <h2>Toplam: {order.total_price} ₺</h2>
        </div>

        <p className="order-status">
          <strong>Durum:</strong> {order.status === 'pending' ? 'Hazırlanıyor...' : 'Tamamlandı'}
        </p>
      </div>

      <button onClick={() => navigate(`/masa/${order.table_id}`)} className="back-btn">Menüye Dön</button>
    </div>
  );
}

export default Order;
