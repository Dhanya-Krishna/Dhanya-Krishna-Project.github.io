import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div style={{ background: 'radial-gradient(ellipse at 60% 20%, #3b1a6e 0%, #1a0a2e 60%, #0d0618 100%)', minHeight: '100vh' }}>
      <Navbar />
      <p style={{ textAlign: 'center', marginTop: 60, color: '#c084fc' }}>Product not found.</p>
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
      <div style={{ background: 'radial-gradient(ellipse at 60% 20%, #3b1a6e 0%, #1a0a2e 60%, #0d0618 100%)', minHeight: '100vh', paddingBottom: 50 }}> 
      <Navbar />

      <div style={styles.title}>Product Details</div>

      <div style={styles.container}>
        <div style={styles.imageBox}>
          <img src={product.image} alt={product.name} style={styles.img} />
        </div>

        <div style={styles.details}>
          <p><b style={styles.b}>Name:</b> {product.name}</p>
          <p><b style={styles.b}>Price:</b> ₹{product.price}</p>
          <p><b style={styles.b}>Category:</b> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
          <p><b style={styles.b}>In Stock:</b> {product.stock} units</p>
          <p style={{ marginTop: 8 }}><b style={styles.b}>Description:</b></p>
          <p style={{ lineHeight: 1.6 }}>{product.description}</p>

          <div style={styles.quantity}>
            <span><b style={styles.b}>Quantity:</b></span>
            <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <input style={styles.qtyInput} type="text" value={qty} readOnly />
            <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
          </div>

          <button style={styles.addBtn} onClick={handleAdd}>
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>

          <button
            style={{ ...styles.backBtn, marginTop: 12 }}
            onClick={() => navigate('/home')}
          >
            ← Back to Shop
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2c9ff',
    margin: '30px 0',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: "'Courier New', Courier, monospace",
    textShadow: '0 0 20px rgba(192,132,252,0.5)',
  },
  container: {
    display: 'flex',
    gap: 40,
    maxWidth: 1000,
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    padding: 30,
    borderRadius: 16,
    border: '1px solid rgba(188,114,244,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    flexWrap: 'wrap',
  },
  imageBox: { flex: 1, minWidth: 280 },
  img: {
    width: '100%',
    height: 400,
    objectFit: 'cover',
    borderRadius: 12,
    border: '1px solid rgba(188,114,244,0.3)',
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    minWidth: 280,
    fontSize: 16,
    lineHeight: 1.6,
    color: '#e2d4f0',
  },
  b: { color: '#c084fc' },
  quantity: { display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' },
  qtyBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    border: 'none',
    width: 36,
    height: 36,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 'bold',
    boxShadow: '0 2px 10px rgba(168,85,247,0.4)',
    transition: '0.3s',
  },
  qtyInput: {
    width: 50,
    textAlign: 'center',
    padding: 8,
    border: '1px solid rgba(188,114,244,0.3)',
    borderRadius: 8,
    fontSize: 16,
    background: 'rgba(255,255,255,0.07)',
    color: '#e2d4f0',
  },
  addBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: 30,
    fontSize: 18,
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(168,85,247,0.5)',
    transition: '0.3s',
    marginTop: 10,
  },
  backBtn: {
    background: 'transparent',
    color: '#c084fc',
    border: '1px solid rgba(192,132,252,0.4)',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: '0.3s',
  },
}
