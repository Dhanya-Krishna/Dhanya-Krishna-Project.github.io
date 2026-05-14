import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('upi')
  return (
    <div style={{ background: 'radial-gradient(ellipse at 60% 20%, #3b1a6e 0%, #1a0a2e 60%, #0d0618 100%)', minHeight: '100vh' }}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.cartBox}>
          <div style={styles.title}>🛒 Cart</div>

          {items.length === 0 ? (
            <div style={styles.empty}>
              <p>Your cart is empty.</p>
              <Link to="/home" style={styles.shopLink}>Continue Shopping →</Link>
            </div>
          ) : (
            <>
              {items.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <div style={styles.itemLeft}>
                    <img src={item.image} alt={item.name} style={styles.itemImg} />
                    <div>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemPrice}>₹{item.price} each</p>
                    </div>
                  </div>

                  <div style={styles.itemRight}>
                    <div style={styles.qtyControls}>
                      <button style={styles.qBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span style={styles.qtyNum}>{item.qty}</span>
                      <button style={styles.qBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <b style={{ color: '#c084fc', minWidth: 70, textAlign: 'right' }}>
                      ₹{item.price * item.qty}
                    </b>
                    <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                </div>
              ))}

              <div style={styles.totalBox}>
                <b>Total: ₹{total}</b>
              </div>
              <div style={styles.paymentSection}>
  <p style={styles.paymentTitle}>Select Payment Method</p>
  <div style={styles.paymentOptions}>
    {[
      { id: 'upi', label: '📲 UPI' },
      { id: 'card', label: '💳 Card' },
      { id: 'netbanking', label: '🏦 Net Banking' },
      { id: 'cod', label: '📦 Cash on Delivery' },
    ].map(opt => (
      <button
        key={opt.id}
        style={{
          ...styles.paymentBtn,
          background: paymentMethod === opt.id
            ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
            : 'rgba(255,255,255,0.05)',
          border: paymentMethod === opt.id
            ? '1px solid transparent'
            : '1px solid rgba(188,114,244,0.3)',
          color: paymentMethod === opt.id ? '#fff' : '#c084fc',
          boxShadow: paymentMethod === opt.id
            ? '0 2px 14px rgba(168,85,247,0.45)'
            : 'none',
        }}
        onClick={() => setPaymentMethod(opt.id)}
      >
        {opt.label}
      </button>
    ))}
  </div>

  {/* UPI */}
  {paymentMethod === 'upi' && (
    <div style={styles.paymentForm}>
      <p style={styles.formLabel}>Enter UPI ID</p>
      <input style={styles.formInput} placeholder="yourname@upi" />
    </div>
  )}

  {/* Card */}
  {paymentMethod === 'card' && (
    <div style={styles.paymentForm}>
      <p style={styles.formLabel}>Card Number</p>
      <input style={styles.formInput} placeholder="1234 5678 9012 3456" maxLength={19} />
      <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <p style={styles.formLabel}>Expiry</p>
          <input style={styles.formInput} placeholder="MM/YY" maxLength={5} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={styles.formLabel}>CVV</p>
          <input style={styles.formInput} placeholder="•••" maxLength={3} type="password" />
        </div>
      </div>
      <p style={styles.formLabel}>Name on Card</p>
      <input style={styles.formInput} placeholder="Full Name" />
    </div>
  )}

  {/* Net Banking */}
  {paymentMethod === 'netbanking' && (
    <div style={styles.paymentForm}>
      <p style={styles.formLabel}>Select Bank</p>
      <select style={styles.formInput}>
        <option value="">-- Choose your bank --</option>
        <option>State Bank of India</option>
        <option>HDFC Bank</option>
        <option>ICICI Bank</option>
        <option>Axis Bank</option>
        <option>Kotak Mahindra Bank</option>
        <option>Punjab National Bank</option>
      </select>
    </div>
  )}

  {/* COD */}
  {paymentMethod === 'cod' && (
    <div style={styles.paymentForm}>
      <p style={{ color: '#c084fc', fontSize: 14, textAlign: 'center' }}>
        💵 Pay when your order arrives at your doorstep.
      </p>
    </div>
  )}
  </div>

  <button
  style={styles.checkoutBtn}
  onClick={() => navigate('/order')}
   >
  Checkout →
  </button>
              
                
              
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: 800, margin: '40px auto', padding: '0 16px' },
  cartBox: {
    background: 'rgba(255,255,255,0.06)',
    padding: 24,
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(188,114,244,0.2)',
  },
  title: {
    fontSize: 24,
    color: '#e2c9ff',
    marginBottom: 20,
    fontWeight: 'bold',
    fontFamily: "'Courier New', Courier, monospace",
    letterSpacing: 1,
    textShadow: '0 0 16px rgba(192,132,252,0.4)',
  },
  empty: { textAlign: 'center', padding: '40px 0', color: '#c084fc' },
  shopLink: {
    display: 'inline-block',
    marginTop: 12,
    color: '#c084fc',
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid rgba(192,132,252,0.4)',
    padding: '8px 18px',
    borderRadius: 8,
  },
  cartItem: {
    border: '1px solid rgba(188,114,244,0.2)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(6px)',
  },
  itemLeft: { display: 'flex', gap: 12, alignItems: 'center', flex: 1 },
  itemImg: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 8,
    border: '1px solid rgba(188,114,244,0.25)',
  },
  itemName: { fontSize: 13, color: '#e2d4f0', maxWidth: 300, lineHeight: 1.4 },
  itemPrice: { fontSize: 12, color: '#c084fc', marginTop: 4 },
  itemRight: { display: 'flex', alignItems: 'center', gap: 16 },
  qtyControls: { display: 'flex', alignItems: 'center', gap: 8 },
  qBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    border: 'none',
    width: 28,
    height: 28,
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(168,85,247,0.4)',
  },
  qtyNum: { minWidth: 24, textAlign: 'center', fontWeight: 600, color: '#e2d4f0' },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalBox: {
    textAlign: 'right',
    fontSize: 20,
    marginTop: 20,
    color: '#c084fc',
    paddingTop: 12,
    borderTop: '1px solid rgba(188,114,244,0.2)',
  },
  checkoutBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    borderRadius: 8,
    padding: '12px 30px',
    display: 'block',
    margin: '20px auto 0',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(168,85,247,0.5)',
    transition: '0.3s',
  },
  paymentSection: {
  marginTop: 24,
  padding: 20,
  borderRadius: 12,
  border: '1px solid rgba(188,114,244,0.2)',
  background: 'rgba(255,255,255,0.03)',
},
paymentTitle: {
  color: '#e2c9ff',
  fontWeight: 700,
  fontSize: 15,
  marginBottom: 12,
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: 1,
},
paymentOptions: {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginBottom: 16,
},
paymentBtn: {
  padding: '9px 16px',
  borderRadius: 20,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
  transition: '0.3s',
  backdropFilter: 'blur(8px)',
},
paymentForm: {
  marginTop: 12,
  padding: 16,
  borderRadius: 10,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(188,114,244,0.15)',
},
formLabel: {
  color: '#c084fc',
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 6,
},
formInput: {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid rgba(188,114,244,0.3)',
  background: 'rgba(255,255,255,0.07)',
  color: '#e2d4f0',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
},
}
