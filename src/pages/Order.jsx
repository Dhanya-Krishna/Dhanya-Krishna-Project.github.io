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
      <div style={{ background: '#fbf5ff', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <p style={{ color: '#9418be', fontSize: 18 }}>No active order found.</p>
          <button style={styles.backBtn} onClick={() => navigate('/home')}>
            ← Go Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fbf5ff', minHeight: '100vh', paddingBottom: 40 }}>
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
              <hr style={{ borderColor: '#eecffb', margin: '12px 0' }} />
              <div style={{ ...styles.priceRow, fontWeight: 700, fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: '#9418be' }}>₹{total}</span>
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
  heading: { fontWeight: 'bold', color: '#9418be', marginBottom: 24 },
  row: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  leftCol: { flex: 2, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { flex: 1, minWidth: 220 },
  card: {
    background: 'white',
    border: '1px solid #eecffb',
    borderRadius: 12,
    boxShadow: '0 4px 10px rgba(188,114,244,0.05)',
    padding: 20,
  },
  orderHeader: { borderBottom: '1px solid #eecffb', paddingBottom: 12, marginBottom: 16 },
  orderId: { fontSize: 13, fontWeight: 'bold', color: '#bc72f4' },
  arrival: { marginTop: 6, color: '#9418be' },
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
    border: '1px solid #eecffb',
    background: '#fbf2fd',
  },
  itemName: { fontSize: 14, fontWeight: 600, color: '#4a1d64', lineHeight: 1.3 },
  itemTotal: { fontWeight: 'bold', color: '#9418be', minWidth: 60, textAlign: 'right' },
  trackTitle: { fontWeight: 'bold', color: '#9418be', marginBottom: 16 },
  trackRow: { display: 'flex', justifyContent: 'space-between', textAlign: 'center' },
  trackStep: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  dot: { height: 12, width: 12, borderRadius: '50%', display: 'inline-block' },
  stepActive: { color: '#9418be', fontWeight: 'bold', fontSize: 14 },
  stepInactive: { color: '#dec1f3', fontSize: 14 },
  priceTitle: { fontWeight: 'bold', color: '#9418be', marginBottom: 12 },
  priceRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 },
  placeBtn: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    background: '#bc72f4',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    transition: '0.3s',
  },
  backBtn: {
    marginTop: 16,
    padding: '10px 20px',
    background: '#bc72f4',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
  },
}
