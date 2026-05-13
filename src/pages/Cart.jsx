import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  return (
    <div style={{ background: '#fbf5ff', minHeight: '100vh' }}>
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
                    <b style={{ color: '#9418be', minWidth: 70, textAlign: 'right' }}>
                      ₹{item.price * item.qty}
                    </b>
                    <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                </div>
              ))}

              <div style={styles.totalBox}>
                <b>Total: ₹{total}</b>
              </div>

              <button
                style={styles.checkoutBtn}
                onClick={() => navigate('/order')}
              >
                Checkout
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
    background: 'white',
    padding: 24,
    borderRadius: 15,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: { fontSize: 24, color: '#9418be', marginBottom: 20, fontWeight: 'bold' },
  empty: { textAlign: 'center', padding: '40px 0', color: '#9418be' },
  shopLink: {
    display: 'inline-block',
    marginTop: 12,
    color: '#bc72f4',
    fontWeight: 600,
    textDecoration: 'none',
  },
  cartItem: {
    border: '1px solid #eecffb',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  itemLeft: { display: 'flex', gap: 12, alignItems: 'center', flex: 1 },
  itemImg: { width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eecffb' },
  itemName: { fontSize: 13, color: '#4a1d64', maxWidth: 300, lineHeight: 1.4 },
  itemPrice: { fontSize: 12, color: '#9418be', marginTop: 4 },
  itemRight: { display: 'flex', alignItems: 'center', gap: 16 },
  qtyControls: { display: 'flex', alignItems: 'center', gap: 8 },
  qBtn: {
    background: '#bc72f4',
    color: 'white',
    border: 'none',
    width: 28,
    height: 28,
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyNum: { minWidth: 24, textAlign: 'center', fontWeight: 600, color: '#4a1d64' },
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
    color: '#9418be',
    paddingTop: 12,
    borderTop: '1px solid #eecffb',
  },
  checkoutBtn: {
    background: '#9418be',
    color: 'white',
    borderRadius: 8,
    padding: '12px 30px',
    display: 'block',
    margin: '20px auto 0',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    transition: '0.3s',
  },
}
