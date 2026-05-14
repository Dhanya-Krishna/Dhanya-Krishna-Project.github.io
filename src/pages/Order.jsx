import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

export default function Order() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const orderId = '#ST-' + Math.floor(10000 + Math.random() * 90000)

  const trackingSteps = [
    { label: 'Ordered', date: 'Today', active: true },
    { label: 'Shipped', date: 'Tomorrow', active: false },
    { label: 'Delivering', date: 'Pending', active: false },
  ]

  if (items.length === 0) {
    return (
      <div style={{ background: 'radial-gradient(ellipse at 60% 20%, #3b1a6e 0%, #1a0a2e 60%, #0d0618 100%)', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <p style={{ color: '#c084fc', fontSize: 18 }}>No active order found.</p>
          <button style={styles.backBtn} onClick={() => navigate('/home')}>
            ← Go Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'radial-gradient(ellipse at 60% 20%, #3b1a6e 0%, #1a0a2e 60%, #0d0618 100%)', minHeight: '100vh', paddingBottom: 40 }}>
      <Navbar />

      <div style={styles.container}>
        <h2 style={styles.heading}>Order Summary</h2>

        <div style={styles.row}>
          {/* Left Column */}
          <div style={styles.leftCol}>
            <div style={styles.card}>
              <div style={styles.orderHeader}>
                <span style={styles.orderId}>ORDER ID: {orderId}</span>
                <h5 style={styles.arrival}>Estimated Arrival: Tomorrow, 5 PM</h5>
              </div>

              {items.map(item => (
                <div key={item.id} style={styles.orderItem}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <div style={{ flex: 1 }}>
                    <p style={styles.itemName}>{item.name}</p>
                    <small style={{ color: '#888' }}>Qty: {item.qty}</small>
                  </div>
                  <span style={styles.itemTotal}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Tracking */}
            <div style={styles.card}>
              <h6 style={styles.trackTitle}>Track Your Delivery</h6>
              <div style={styles.trackRow}>
                {trackingSteps.map((step, i) => (
                  <div key={i} style={styles.trackStep}>
                    <div style={{
                      ...styles.dot,
                      background: step.active ? '#bc72f4' : '#dec1f3',
                    }} />
                    <div style={step.active ? styles.stepActive : styles.stepInactive}>
                      {step.label}
                    </div>
                    <small style={{ color: '#888' }}>{step.date}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Price */}
          <div style={styles.rightCol}>
            <div style={styles.card}>
              <h6 style={styles.priceTitle}>Price Details</h6>
              <div style={styles.priceRow}>
                <span>Price ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{total}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Delivery Charges</span>
                <span style={{ color: '#166534', fontWeight: 600 }}>FREE</span>
              </div>
              <hr style={{ borderColor: 'rgba(188,114,244,0.2)', margin: '12px 0' }} />
              <div style={{ ...styles.priceRow, fontWeight: 700, fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: '#c084fc' }}>₹{total}</span>
              </div>

              <button
                style={styles.placeBtn}
                onClick={() => { clearCart(); navigate('/home') }}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: 900, margin: '40px auto', padding: '0 15px' },
  heading: { fontWeight: 'bold', color: '#e2c9ff', marginBottom: 24 },
  row: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  leftCol: { flex: 2, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { flex: 1, minWidth: 220 },
  card: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(188,114,244,0.2)',
    borderRadius: 14,
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    padding: 20,
  },
  orderHeader: { borderBottom: '1px solid rgba(188,114,244,0.2)', paddingBottom: 12, marginBottom: 16 },
  orderId: { fontSize: 13, fontWeight: 'bold', color: '#c084fc' },
  arrival: { marginTop: 6, color: '#e2d4f0' },
  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  itemImg: {
    width: 70,
    height: 70,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid rgba(188,114,244,0.2)',
    background: 'rgba(255,255,255,0.05)',
  },
  itemName: { fontSize: 14, fontWeight: 600, color: '#e2d4f0', lineHeight: 1.3 },
  itemTotal: { fontWeight: 'bold', color: '#c084fc', minWidth: 60, textAlign: 'right' },
  trackTitle: { fontWeight: 'bold', color: '#e2c9ff', marginBottom: 16 },
  trackRow: { display: 'flex', justifyContent: 'space-between', textAlign: 'center' },
  trackStep: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  dot: { height: 12, width: 12, borderRadius: '50%', display: 'inline-block' },
  stepActive: { color: '#c084fc', fontWeight: 'bold', fontSize: 14 },
  stepInactive: { color: 'rgba(192,132,252,0.3)', fontSize: 14 },
  priceTitle: { fontWeight: 'bold', color: '#e2c9ff', marginBottom: 12 },
  priceRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15, color: '#e2d4f0' },
  placeBtn: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(168,85,247,0.5)',
    transition: '0.3s',
  },
  backBtn: {
    marginTop: 16,
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
    boxShadow: '0 4px 20px rgba(168,85,247,0.5)',
  },
}
