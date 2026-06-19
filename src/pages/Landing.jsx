import React from 'react';
import { useNavigate } from 'react-router-dom';

const PHONE = '+905312412436';
const PHONE_DISPLAY = '+90 531 241 24 36';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif", background: '#fff', minHeight: '100vh', color: '#1a1a2e' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Nunito:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --navy: #1a3a6b; --navy-dark: #142d54; --navy-light: #c8d4e8; --muted: #7a8a9a; --bg-soft: #f4f7fd; }
        .lp-nav { position: sticky; top: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--navy-light); padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; }
        .lp-brand { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--navy); text-decoration: none; }
        .lp-nav-btn { background: var(--navy); color: #fff; border: none; padding: 9px 22px; border-radius: 20px; font-size: 14px; font-weight: 700; font-family: 'Nunito', sans-serif; cursor: pointer; transition: background 0.2s; }
        .lp-nav-btn:hover { background: var(--navy-dark); }
        .lp-hero { min-height: 88vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 24px 40px; background: linear-gradient(160deg, #f0f4fb 0%, #ffffff 50%, #f8f2ea 100%); position: relative; overflow: hidden; }
        .lp-hero::before { content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(26,58,107,0.06) 0%, transparent 70%); top: -100px; right: -100px; pointer-events: none; }
        .lp-badge { display: inline-block; background: var(--bg-soft); border: 1px solid var(--navy-light); color: var(--navy); font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 18px; border-radius: 20px; margin-bottom: 28px; }
        .lp-h1 { font-family: 'Playfair Display', serif; font-size: clamp(38px, 8vw, 72px); color: var(--navy); line-height: 1.15; margin-bottom: 12px; }
        .lp-h1 em { font-style: italic; color: #8a6200; }
        .lp-sub { font-size: clamp(16px, 3vw, 20px); color: var(--muted); max-width: 540px; line-height: 1.6; margin-bottom: 48px; }
        .lp-cta-group { display: flex; flex-direction: column; gap: 14px; align-items: center; width: 100%; max-width: 360px; }
        .lp-btn-primary { width: 100%; background: var(--navy); color: #fff; border: none; padding: 16px 28px; border-radius: 14px; font-size: 16px; font-weight: 700; font-family: 'Nunito', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(26,58,107,0.25); text-decoration: none; }
        .lp-btn-primary:hover { background: var(--navy-dark); transform: translateY(-2px); }
        .lp-divider { color: var(--muted); font-size: 13px; font-weight: 600; }
        .lp-stores { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .lp-store { display: flex; align-items: center; gap: 8px; background: #1a1a2e; color: #fff; padding: 11px 20px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: 600; transition: opacity 0.2s, transform 0.15s; }
        .lp-store:hover { opacity: 0.85; transform: translateY(-1px); }
        .lp-store-text { display: flex; flex-direction: column; line-height: 1.2; }
        .lp-store-text small { font-size: 10px; font-weight: 400; opacity: 0.75; }
        .lp-store-text span { font-size: 14px; font-weight: 700; }
        .lp-about { background: var(--bg-soft); padding: 80px 24px; }
        .lp-section { max-width: 900px; margin: 0 auto; }
        .lp-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }
        .lp-h2 { font-family: 'Playfair Display', serif; font-size: clamp(28px, 5vw, 44px); color: var(--navy); margin-bottom: 24px; line-height: 1.2; }
        .lp-body { font-size: 17px; color: #3a4a5a; line-height: 1.8; max-width: 680px; }
        .lp-body p + p { margin-top: 16px; }
        .lp-pillars { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 48px; }
        .lp-pillar { background: #fff; border-radius: 16px; padding: 28px 24px; border: 1px solid var(--navy-light); }
        .lp-pillar-icon { font-size: 32px; margin-bottom: 14px; }
        .lp-pillar h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--navy); margin-bottom: 8px; }
        .lp-pillar p { font-size: 14px; color: var(--muted); line-height: 1.6; }
        .lp-how { padding: 80px 24px; background: #fff; }
        .lp-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; margin-top: 48px; }
        .lp-step { text-align: center; }
        .lp-step-num { width: 52px; height: 52px; border-radius: 50%; background: var(--navy); color: #fff; font-family: 'Playfair Display', serif; font-size: 22px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .lp-step h3 { font-weight: 700; font-size: 16px; color: var(--navy); margin-bottom: 8px; }
        .lp-step p { font-size: 14px; color: var(--muted); line-height: 1.6; }
        .lp-contact { background: var(--navy); color: #fff; padding: 72px 24px; text-align: center; }
        .lp-contact .lp-label { color: rgba(255,255,255,0.5); }
        .lp-contact .lp-h2 { color: #fff; margin-bottom: 32px; }
        .lp-contact-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 32px; margin-bottom: 40px; }
        .lp-contact-item { display: flex; align-items: center; gap: 10px; font-size: 15px; color: rgba(255,255,255,0.85); }
        .lp-contact-item a { color: rgba(255,255,255,0.85); text-decoration: none; }
        .lp-contact-item a:hover { color: #fff; text-decoration: underline; }
        .lp-contact-cta { display: inline-flex; align-items: center; gap: 10px; background: #fff; color: var(--navy); padding: 16px 36px; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; border: none; font-family: 'Nunito', sans-serif; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .lp-contact-cta:hover { opacity: 0.92; transform: translateY(-2px); }
        footer { background: var(--navy-dark); color: rgba(255,255,255,0.45); text-align: center; padding: 20px 24px; font-size: 13px; }
        @media (max-width: 600px) { .lp-hero { min-height: 92vh; padding: 40px 20px 32px; } .lp-stores { flex-direction: column; align-items: center; } .lp-store { width: 200px; justify-content: center; } }
      `}</style>

      {/* NAV */}
      <nav className="lp-nav">
        <img src="/weblogo yatt.png" alt="Her Şey Ege'den" style={{ height: '36px', objectFit: 'contain' }} />
        <button className="lp-nav-btn" onClick={() => navigate('/masa/1')}>Menüyü Gör</button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <img src="/weblogo yuvar.png" alt="Her Şey Ege'den" style={{ width: '140px', height: '140px', objectFit: 'contain', marginBottom: '24px' }} />
        <div className="lp-badge">Ege Mutfağı &bull; Doğal &bull; Sağlıklı</div>
        <h1 className="lp-h1">Her Şey<br /><em>Ege'den</em> Gelir</h1>
        <p className="lp-sub">
          Anne eli değmiş, doğal ve taze malzemelerle hazırlanmış Ege lezzetleri.
          Masanızdan QR ile sipariş verin, biz getiririz.
        </p>
        <div className="lp-cta-group">
          <button className="lp-btn-primary" onClick={() => navigate('/masa/1')}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            Menüye Git &amp; Sipariş Ver
          </button>
          <span className="lp-divider">veya uygulamayı indir</span>
          <div className="lp-stores">
            <a href="#" className="lp-store">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="lp-store-text"><small>App Store'dan İndir</small><span>iPhone</span></div>
            </a>
            <a href="#" className="lp-store">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.63.24.97.19l12.45-7.19-2.77-2.77-10.65 9.77zM.32 1.56C.12 1.9 0 2.33 0 2.86v18.28c0 .53.12.96.32 1.3l.07.06 10.24-10.24v-.24L.39 1.5l-.07.06zM20.67 10.38l-2.73-1.58-3.08 3.08 3.08 3.08 2.75-1.59c.79-.45.79-1.54-.02-2.99zM4.15.25l12.45 7.19-2.77 2.77L3.18.44A1.24 1.24 0 014.15.25z"/></svg>
              <div className="lp-store-text"><small>Google Play'den İndir</small><span>Android</span></div>
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="lp-about">
        <div className="lp-section">
          <div className="lp-label">Hakkımızda</div>
          <h2 className="lp-h2">Ege'nin Bereketiyle,<br />Annenin Elleriyle</h2>
          <div className="lp-body">
            <p>Her Şey Ege'den olarak sunduğumuz her tabak, Ege'nin güneşli topraklarından gelen taze malzemelerle ve <strong>ev yapımı özen</strong>le hazırlanmaktadır. Sanayi ürünleri değil; zeytinyağı, taze otlar ve mevsim sebzeleri.</p>
            <p>Kahvaltıdan mezelere, tatlıdan içeceklere kadar menümüzdeki her şey <strong>doğal, sağlıklı ve gerçek</strong>. Büyükannelerimizin mutfaklarından taşıdığımız tatları sizlerle buluşturuyoruz.</p>
          </div>
          <div className="lp-pillars">
            <div className="lp-pillar"><div className="lp-pillar-icon">🫒</div><h3>Doğal Malzeme</h3><p>Katkısız, taze ve mevsimlik ürünler. Hiçbir yapay katkı maddesi kullanmıyoruz.</p></div>
            <div className="lp-pillar"><div className="lp-pillar-icon">👐</div><h3>Ev Yapımı</h3><p>Anne eli değmiş, günlük hazırlanan tarifler. Her porsiyonda sevgi var.</p></div>
            <div className="lp-pillar"><div className="lp-pillar-icon">🌿</div><h3>Sağlıklı</h3><p>Zeytinyağlı, hafif ve besleyici seçenekler. Ege mutfağının en iyi yanı bu.</p></div>
            <div className="lp-pillar"><div className="lp-pillar-icon">📱</div><h3>Kolay Sipariş</h3><p>QR ile masanızdan tarayın, menüyü görün ve doğrudan sipariş verin.</p></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how">
        <div className="lp-section">
          <div className="lp-label">Nasıl Çalışır?</div>
          <h2 className="lp-h2">Sipariş Vermek<br />Hiç Bu Kadar Kolay Olmamıştı</h2>
          <div className="lp-steps">
            <div className="lp-step"><div className="lp-step-num">1</div><h3>QR Tarayın</h3><p>Masanızdaki QR kodu telefonunuzla tarayın, saniyeler içinde menüye ulaşın.</p></div>
            <div className="lp-step"><div className="lp-step-num">2</div><h3>Seçin &amp; Ekleyin</h3><p>İstediğiniz ürünleri sepete ekleyin, not bırakabilirsiniz.</p></div>
            <div className="lp-step"><div className="lp-step-num">3</div><h3>Siparişi Gönderin</h3><p>Tek tuşla siparişiniz mutfağa iletilir, garsonunuz bilgilenir.</p></div>
            <div className="lp-step"><div className="lp-step-num">4</div><h3>Tadını Çıkarın</h3><p>Siparişiniz hazır olunca masanıza getirilir. Afiyet olsun!</p></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="lp-contact">
        <div className="lp-label">İletişim &amp; Konum</div>
        <h2 className="lp-h2">Bizi Bulun</h2>
        <div className="lp-contact-grid">
          <div className="lp-contact-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Cennet Mah. Tunç Sok. No:19A, Küçükçekmece / İstanbul</span>
          </div>
          <div className="lp-contact-item">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
          </div>
          <div className="lp-contact-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.089.534 4.075 1.475 5.802L0 24l6.336-1.447A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.724.977.995-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
            <a href={`https://wa.me/${PHONE.replace('+', '')}`} target="_blank" rel="noopener noreferrer">WhatsApp ile Yazın</a>
          </div>
        </div>
        <button className="lp-contact-cta" onClick={() => navigate('/masa/1')}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Hemen Sipariş Ver
        </button>
      </section>

      {/* MAP */}
      <section style={{ width: '100%', height: '340px' }}>
        <iframe
          title="Konum"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          allowFullScreen
          src="https://maps.google.com/maps?q=Cennet+Mah+Tunç+Sok+No+19A+Küçükçekmece+İstanbul&output=embed"
        />
      </section>

      <footer>
        <img src="/weblogo yatt.png" alt="Her Şey Ege'den" style={{ height: '28px', objectFit: 'contain', opacity: 0.5, marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
        &copy; 2026 Her Şey Ege'den. Tüm hakları saklıdır.
        <div style={{ marginTop: '6px', fontSize: '11px', opacity: 0.4 }}>Powered by 3B Tech</div>
      </footer>
    </div>
  );
}
