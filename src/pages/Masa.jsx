import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function Masa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerNote, setCustomerNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [billRequested, setBillRequested] = useState(false);
  const [tableClosed, setTableClosed] = useState(false);
  const [showBillConfirm, setShowBillConfirm] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const toggleCategory = (id) =>
    setCollapsedCategories(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/menu`)
      .then(res => setMenu(res.data))
      .catch(() => setError('Menü yüklenemedi'))
      .finally(() => setLoading(false));

    fetchMyOrders();

    const socket = io(BACKEND_URL);
    socket.on('order:completed', () => fetchMyOrders());
    socket.on('order:created', () => fetchMyOrders());
    socket.on('table:closed', (data) => {
      if (data.table_id === parseInt(id)) {
        setTableClosed(true);
        setCart([]);
        setMyOrders([]);
        setBillRequested(false);
      }
    });

    return () => socket.close();
  }, [id]);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/orders/table/${id}`);
      setMyOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getBillTotal = () =>
    myOrders.reduce((sum, o) => sum + Number(o.total_price), 0).toFixed(2);

  const requestBill = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/orders/table/${id}/bill-request`);
      setBillRequested(true);
      setShowBillConfirm(false);
    } catch (err) {
      console.error(err);
      alert('Hesap isteği gönderilemedi');
    }
  };

  const addToCart = (item, e) => {
    if (e && window.innerWidth <= 768) {
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const fly = document.createElement('div');
      fly.className = 'fly-to-cart';
      const cx = rect.left + rect.width / 2 - 15;
      const cy = rect.top + rect.height / 2 - 15;
      fly.style.left = cx + 'px';
      fly.style.top = cy + 'px';
      const targetX = window.innerWidth / 2 - cx - 15;
      const targetY = window.innerHeight - cy - 15;
      fly.style.setProperty('--tx', targetX + 'px');
      fly.style.setProperty('--ty', targetY + 'px');
      document.body.appendChild(fly);
      setTimeout(() => fly.remove(), 700);
    }
    const existingItem = cart.find(c => c.id === item.id);
    if (existingItem) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => setCart(cart.filter(c => c.id !== itemId));

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) removeFromCart(itemId);
    else setCart(cart.map(c => c.id === itemId ? { ...c, quantity } : c));
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

  const submitOrder = async () => {
    if (cart.length === 0) {
      alert('Lütfen en az bir ürün seçiniz');
      return;
    }
    try {
      const response = await axios.post(`${BACKEND_URL}/api/orders`, {
        table_id: parseInt(id),
        items: cart.map(c => ({ menu_item_id: c.id, quantity: c.quantity })),
        customer_note: customerNote
      });
      if (response.data.success) {
        setCart([]);
        setCustomerNote('');
        navigate(`/order/${response.data.order_id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Sipariş gönderilemedi');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  if (tableClosed) {
    return (
      <div className="table-closed-screen">
        <img src="/logo.png" alt="Her Şey Ege'den" className="logo" />
        <div className="table-closed-content">
          <div className="table-closed-icon">✓</div>
          <h2>Teşekkürler!</h2>
          <p>İyi günler dileriz.</p>
          <p className="table-closed-sub">Masa {id}</p>
          <button className="submit-btn" style={{ marginTop: '24px', maxWidth: '240px' }} onClick={() => setTableClosed(false)}>
            Menüye Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="masa-container">
      <div className="header">
        <img src="/logo.png" alt="Her Şey Ege'den" className="logo" />
        <span className="masa-badge">Masa {id}</span>
      </div>

      {showBillConfirm && (
        <div className="confirm-overlay" onClick={() => setShowBillConfirm(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Hesap İstiyorsunuz</h3>
            <div className="bill-summary">
              {myOrders.map(order => (
                <div key={order.id} className="bill-summary-row">
                  <span>Sipariş #{order.id}</span>
                  <span>{Number(order.total_price).toFixed(2)} ₺</span>
                </div>
              ))}
              <div className="bill-summary-total">
                <span>Toplam</span>
                <span>{getBillTotal()} ₺</span>
              </div>
            </div>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowBillConfirm(false)}>Geri Dön</button>
              <button className="confirm-ok" onClick={requestBill}>Hesabı İste</button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <h3>Siparişinizi Onaylıyor Musunuz?</h3>
            <ul className="confirm-items">
              {cart.map(item => (
                <li key={item.id}>
                  <span className="confirm-qty">{item.quantity}x</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
            {customerNote && (
              <p className="confirm-note">Not: {customerNote}</p>
            )}
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowConfirm(false)}>Geri Dön</button>
              <button className="confirm-ok" onClick={() => { setShowConfirm(false); submitOrder(); }}>Onayla</button>
            </div>
          </div>
        </div>
      )}

      <div className="content">
        <div className="menu-section">
          <h2>Menü</h2>
          {menu.map(category => (
            <div key={category.id} className="category">
              <h3 className="category-toggle" onClick={() => toggleCategory(category.id)}>
                {category.name}
                <span className="category-arrow">{collapsedCategories[category.id] ? '▶' : '▼'}</span>
              </h3>
              {!collapsedCategories[category.id] && <div className="items">
                {category.items && category.items.map(item => (
                  <div key={item.id} className="menu-item">
                    {item.image_url ? (
                      <img src={`${BACKEND_URL}${item.image_url}`} alt={item.name} className="menu-item-img" />
                    ) : (
                      <div className="menu-item-img-placeholder" />
                    )}
                    <div className="menu-item-body">
                      <h4>{item.name}</h4>
                      {item.description && <p className="menu-item-desc">{item.description}</p>}
                      <div className="menu-item-footer">
                        <span className="price">{item.price} ₺</span>
                        <button onClick={(e) => addToCart(item, e)}>+ Ekle</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>}
            </div>
          ))}
        </div>

        <div className="right-column">
          <div className="cart-section">
            <h2>Sepet</h2>
            {cart.length === 0 ? (
              <p>Sepet boş</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.price} ₺</p>
                    </div>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn">Sil</button>
                  </div>
                ))}

                <div className="customer-note">
                  <label>Not:</label>
                  <textarea
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Özel talep varsa yazınız..."
                  />
                </div>

                <div className="total">
                  <h3>Toplam: {getTotalPrice()} ₺</h3>
                </div>

                <button className="submit-btn" onClick={() => setShowConfirm(true)}>Siparişi Gönder</button>
              </>
            )}
          </div>

          {myOrders.length > 0 && (
            <div className="cart-section my-orders-section">
              <div className="my-orders-header" onClick={() => setShowOrders(!showOrders)}>
                <h2>Siparişlerim ({myOrders.length})</h2>
                <span className="my-orders-arrow">{showOrders ? '▲' : '▼'}</span>
              </div>
              {showOrders && myOrders.map(order => (
                <div key={order.id} className="my-order-card">
                  <div className="my-order-header">
                    <span>#{order.id}</span>
                    <span className={`my-order-status ${order.status}`}>
                      {order.status === 'pending' ? '🍳 Hazırlanıyor' : '✅ Hazır'}
                    </span>
                    <span className="my-order-price">{order.total_price} ₺</span>
                  </div>
                  <ul className="my-order-items">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>{(item.price_at_purchase * item.quantity).toFixed(2)} ₺</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            </div>
          )}

          {myOrders.length > 0 && (
            <div className="cart-section hesap-section">
              {!billRequested ? (
                <button className="submit-btn hesap-btn" onClick={() => setShowBillConfirm(true)}>
                  Hesap İste
                </button>
              ) : (
                <div className="hesap-requested">
                  Hesap İstendi — Kasaya yönlendiriliyorsunuz
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="mobile-cart-bar" onClick={() => setDrawerOpen(true)}>
        <span className="mcb-count">
          {cart.length > 0
            ? `${cart.reduce((s, i) => s + i.quantity, 0)} ürün`
            : myOrders.length > 0 ? `${myOrders.length} sipariş` : 'Sepet'}
        </span>
        <span className="mcb-label">Adisyonu Gör</span>
        <span className="mcb-total">
          {cart.length > 0
            ? `${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)} ₺`
            : myOrders.length > 0 ? `${getBillTotal()} ₺` : ''}
        </span>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Adisyon — Masa {id}</h3>
              <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>

            <div className="drawer-body">
              {/* Sepet */}
              <div className="drawer-section">
                <h4>Sepet</h4>
                {cart.length === 0 ? (
                  <p className="drawer-empty">Sepet boş</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>{item.price} ₺</p>
                        </div>
                        <div className="quantity-control">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">Sil</button>
                      </div>
                    ))}
                    <div className="customer-note">
                      <label>Not:</label>
                      <textarea
                        value={customerNote}
                        onChange={e => setCustomerNote(e.target.value)}
                        placeholder="Özel talep varsa yazınız..."
                      />
                    </div>
                    <div className="total"><h3>Toplam: {getTotalPrice()} ₺</h3></div>
                    <button className="submit-btn" onClick={() => { setDrawerOpen(false); setShowConfirm(true); }}>
                      Siparişi Gönder
                    </button>
                  </>
                )}
              </div>

              {/* Siparişlerim */}
              {myOrders.length > 0 && (
                <div className="drawer-section">
                  <div className="my-orders-header" onClick={() => setShowOrders(!showOrders)}>
                    <h4>Siparişlerim ({myOrders.length})</h4>
                    <span>{showOrders ? '▲' : '▼'}</span>
                  </div>
                  {showOrders && myOrders.map(order => (
                    <div key={order.id} className="my-order-card">
                      <div className="my-order-header">
                        <span>#{order.id}</span>
                        <span className={`my-order-status ${order.status}`}>
                          {order.status === 'pending' ? '🍳 Hazırlanıyor' : '✅ Hazır'}
                        </span>
                        <span className="my-order-price">{order.total_price} ₺</span>
                      </div>
                      <ul className="my-order-items">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            <span>{item.quantity}x {item.name}</span>
                            <span>{(item.price_at_purchase * item.quantity).toFixed(2)} ₺</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Hesap İste */}
              {myOrders.length > 0 && (
                <div className="drawer-section">
                  {!billRequested ? (
                    <button className="submit-btn hesap-btn" onClick={() => { setDrawerOpen(false); setShowBillConfirm(true); }}>
                      Hesap İste
                    </button>
                  ) : (
                    <div className="hesap-requested">Hesap İstendi — Kasaya yönlendiriliyorsunuz</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Masa;