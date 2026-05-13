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
      <div style={{ background: '#fbf5ff', minHeight: '100vh' }}>
        <Navbar />
        <p style={{ textAlign: 'center', marginTop: 60, color: '#9418be' }}>Product not found.</p>
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ background: '#fbf5ff', minHeight: '100vh', paddingBottom: 50 }}>
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
    color: '#9418be',
    margin: '30px 0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  container: {
    display: 'flex',
    gap: 40,
    maxWidth: 1000,
    margin: '0 auto',
    background: 'white',
    padding: 30,
    borderRadius: 15,
    border: '1px solid #eecffb',
    boxShadow: '0 4px 15px rgba(188,114,244,0.1)',
    flexWrap: 'wrap',
  },
  imageBox: { flex: 1, minWidth: 280 },
  img: { width: '100%', height: 400, objectFit: 'cover', borderRadius: 10, border: '2px dashed #b572f4' },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    minWidth: 280,
    fontSize: 16,
    lineHeight: 1.6,
  },
  b: { color: '#9418be' },
  quantity: { display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' },
  qtyBtn: {
    background: '#bc72f4',
    color: 'white',
    border: 'none',
    width: 36,
    height: 36,
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 'bold',
    transition: '0.3s',
  },
  qtyInput: {
    width: 50,
    textAlign: 'center',
    padding: 8,
    border: '1px solid #c272f4',
    borderRadius: 5,
    fontSize: 16,
  },
  addBtn: {
    background: '#bc72f4',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: 30,
    fontSize: 18,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
    marginTop: 10,
  },
  backBtn: {
    background: 'white',
    color: '#9418be',
    border: '1px solid #bc72f4',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: '0.3s',
  },
}
