import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const toUTC = (dt) => dt ? new Date(dt.includes('Z') ? dt : dt + 'Z') : null;
const fmtTime = (dt) => {
  const d = toUTC(dt);
  return d ? d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : null;
};

function OrderTimeline({ order }) {
  const events = [
    { label: 'Sipariş geldi',  time: order.created_at,       icon: '🟢' },
    { label: 'Tamamlandı',     time: order.completed_at,     icon: '✅' },
    { label: 'Hesap istendi',  time: order.bill_requested_at, icon: '🧾' },
    { label: 'Masa kapatıldı', time: order.closed_at,        icon: '🔒' },
  ].filter(e => e.time);

  return (
    <div className="order-timeline-kitchen">
      {events.map((e, i) => (
        <span key={i} className="otk-event">
          {e.icon} <strong>{e.label}</strong> {fmtTime(e.time)}
        </span>
      ))}
    </div>
  );
}

function KitchenScreen({ token, onLogout }) {
  const [tab, setTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [billRequests, setBillRequests] = useState([]);
  const [completedTables, setCompletedTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closeConfirm, setCloseConfirm] = useState(null); // table_id

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/kitchen/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) { console.error(err); }
  }, [token]);

  const fetchBillRequests = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/kitchen/bill-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBillRequests(res.data);
    } catch (err) { console.error(err); }
  }, [token]);

  const fetchCompleted = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/kitchen/completed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompletedTables(res.data);
    } catch (err) { console.error(err); }
  }, [token]);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchOrders(), fetchBillRequests(), fetchCompleted()]);
    setLoading(false);
  }, [fetchOrders, fetchBillRequests, fetchCompleted]);

  useEffect(() => {
    fetchAll();
    const socket = io(BACKEND_URL);
    socket.on('order:created', fetchAll);
    socket.on('order:completed', fetchAll);
    socket.on('bill:requested', () => { fetchBillRequests(); fetchCompleted(); });
    socket.on('table:closed', fetchAll);
    return () => socket.close();
  }, [fetchAll, fetchBillRequests, fetchCompleted]);

  const completeOrder = async (orderId) => {
    try {
      await axios.put(`${BACKEND_URL}/api/kitchen/orders/${orderId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.filter(o => o.id !== orderId));
      fetchCompleted();
    } catch (err) { console.error(err); }
  };

  const closeTable = async (tableId) => {
    try {
      await axios.post(`${BACKEND_URL}/api/kitchen/table/${tableId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBillRequests(prev => prev.filter(t => t.id !== tableId));
      setCloseConfirm(null);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const getElapsed = (createdAt) => {
    const diff = Math.floor((Date.now() - toUTC(createdAt)) / 1000 / 60);
    return diff < 1 ? 'Az önce' : `${diff} dk önce`;
  };

  const activeCount = orders.length + billRequests.length;
  const completedCount = completedTables.length;

  return (
    <div className="kitchen-screen">
      <div className="kitchen-header">
        <img src="/logo.png" alt="logo" className="kitchen-header-logo" />
        <h1>Mutfak</h1>
        <button onClick={onLogout} className="kitchen-logout">Çıkış</button>
      </div>

      {/* Sekmeler */}
      <div className="kitchen-tabs">
        <button
          className={`kitchen-tab ${tab === 'active' ? 'active' : ''}`}
          onClick={() => setTab('active')}
        >
          Aktif Siparişler
          {activeCount > 0 && <span className="kitchen-tab-badge">{activeCount}</span>}
        </button>
        <button
          className={`kitchen-tab ${tab === 'completed' ? 'active' : ''}`}
          onClick={() => setTab('completed')}
        >
          Tamamlanan Siparişler
          {completedCount > 0 && <span className="kitchen-tab-badge done">{completedCount}</span>}
        </button>
      </div>

      {/* AKTİF SİPARİŞLER */}
      {tab === 'active' && (
        <>
          {billRequests.length > 0 && (
            <div className="bill-requests-section">
              <h2 className="bill-requests-title">Hesap İstekleri</h2>
              <div className="bill-requests-list">
                {billRequests.map(table => (
                  <div key={table.id} className="bill-request-card">
                    <div className="bill-request-info">
                      <span className="bill-table-icon">🧾</span>
                      <span className="bill-table-name">Masa {table.table_number}</span>
                      <span className="bill-table-sub">Hesap istiyor</span>
                    </div>
                    {closeConfirm === table.id ? (
                      <div className="close-confirm">
                        <span>Masayı kapatmak istiyor musunuz?</span>
                        <div className="close-confirm-btns">
                          <button className="close-cancel-btn" onClick={() => setCloseConfirm(null)}>İptal</button>
                          <button className="close-ok-btn" onClick={() => closeTable(table.id)}>Evet, Kapat</button>
                        </div>
                      </div>
                    ) : (
                      <button className="close-table-btn" onClick={() => setCloseConfirm(table.id)}>
                        Masayı Kapat
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="kitchen-loading">Yükleniyor...</div>
          ) : orders.length === 0 ? (
            <div className="kitchen-empty">Bekleyen sipariş yok</div>
          ) : (
            <div className="kitchen-orders">
              {orders.map(order => (
                <div key={order.id} className="kitchen-card">
                  <div className="kitchen-card-header">
                    <span className="kitchen-table">Masa {order.table_number}</span>
                    <span className="kitchen-time">{getElapsed(order.created_at)}</span>
                    <span className="kitchen-order-no">#{order.id}</span>
                  </div>
                  <ul className="kitchen-items">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        <span className="kitchen-qty">{item.quantity}x</span>
                        <span className="kitchen-name">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                  {order.customer_note && (
                    <div className="kitchen-note">Not: {order.customer_note}</div>
                  )}
                  <button className="kitchen-complete-btn" onClick={() => completeOrder(order.id)}>
                    Tamamlandı
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAMAMLANAN SİPARİŞLER */}
      {tab === 'completed' && (
        <div className="completed-section">
          {completedTables.length === 0 ? (
            <div className="kitchen-empty">Bugün tamamlanan sipariş yok</div>
          ) : (
            <div className="completed-tables">
              {completedTables.map(tableGroup => {
                const isClosed = tableGroup.table_status === 'available';
                const isConfirming = closeConfirm === tableGroup.table_id;

                return (
                  <div key={tableGroup.table_id} className={`completed-table-card ${isClosed ? 'closed' : ''}`}>
                    <div className="completed-table-header">
                      <div className="completed-table-title">
                        <span className="completed-table-name">Masa {tableGroup.table_number}</span>
                        <span className={`completed-table-status ${isClosed ? 'status-closed' : 'status-open'}`}>
                          {isClosed ? 'Kapatıldı' : 'Açık'}
                        </span>
                      </div>
                      <div className="completed-table-total">
                        {tableGroup.table_total.toFixed(2)} ₺
                      </div>
                    </div>

                    {tableGroup.orders.map(order => (
                      <div key={order.id} className="completed-order-row">
                        <div className="completed-order-meta">
                          <span className="completed-order-no">#{order.id}</span>
                          <span className="completed-order-time">
                            {fmtTime(order.created_at)}
                          </span>
                          <span className={`completed-order-badge ${order.status}`}>
                            {order.status === 'completed' ? 'Tamamlandı' : 'Kapatıldı'}
                          </span>
                        </div>
                        <ul className="completed-order-items">
                          {order.items.map((item, i) => (
                            <li key={i}>
                              <span>{item.quantity}x {item.name}</span>
                              <span>{(item.price_at_purchase * item.quantity).toFixed(2)} ₺</span>
                            </li>
                          ))}
                        </ul>
                        <div className="completed-order-subtotal">
                          {parseFloat(order.discount) > 0 && (
                            <span className="completed-adj">İndirim: −{parseFloat(order.discount).toFixed(2)} ₺</span>
                          )}
                          {parseFloat(order.extra_charge) > 0 && (
                            <span className="completed-adj">{order.extra_charge_label || 'İlave'}: +{parseFloat(order.extra_charge).toFixed(2)} ₺</span>
                          )}
                          <strong>{parseFloat(order.total_price).toFixed(2)} ₺</strong>
                        </div>
                        <OrderTimeline order={order} />
                      </div>
                    ))}

                    {!isClosed && (
                      <div className="completed-table-footer">
                        {isConfirming ? (
                          <div className="close-confirm">
                            <span>Masayı kapatmak istiyor musunuz?</span>
                            <div className="close-confirm-btns">
                              <button className="close-cancel-btn" onClick={() => setCloseConfirm(null)}>İptal</button>
                              <button className="close-ok-btn" onClick={() => closeTable(tableGroup.table_id)}>Evet, Kapat</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="close-table-btn"
                            onClick={() => setCloseConfirm(tableGroup.table_id)}
                          >
                            Masayı Kapat
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KitchenScreen;
