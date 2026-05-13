import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory.toLowerCase()
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const grouped = categories.slice(1).reduce((acc, cat) => {
    const items = filtered.filter(p => p.category === cat.toLowerCase())
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div style={{ background: '#fbf5ff', minHeight: '100vh' }}>
      <Navbar onSearch={setSearch} />

      <div style={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              ...styles.catBtn,
              background: activeCategory === cat ? '#9418be' : 'white',
              color: activeCategory === cat ? 'white' : '#9418be',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.hero}>
        <h2>Welcome to StatioShop!</h2>
        <p style={{ marginTop: 8, color: '#9418be' }}>Your one-stop stationery store</p>
        <button
          style={styles.shopBtn}
          onClick={() => setActiveCategory('All')}
        >
          Shop Now
        </button>
      </div>

      <div style={styles.products}>
        <h3 style={styles.sectionTitle}>Featured Products</h3>

        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} id={cat.toLowerCase()}>
            <h4 style={styles.catTitle}>{cat}</h4>
            <div style={styles.grid}>
              {items.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product, 1)}
                  onViewDetails={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          </section>
        ))}

        {Object.keys(grouped).length === 0 && (
          <p style={{ color: '#9418be', textAlign: 'center', marginTop: 40 }}>
            No products found.
          </p>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, onAddToCart, onViewDetails }) {
  return (
    <div style={styles.card}>
      <div style={styles.imageBox}>
        <img src={product.image} alt={product.name} style={styles.img} />
      </div>
      <p style={styles.productName}>{product.name}</p>
      <p style={styles.price}>Price: ₹{product.price}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
        <button style={styles.cardBtn} onClick={onAddToCart}>Add to Cart</button>
        <button style={styles.cardBtn} onClick={onViewDetails}>View Details</button>
      </div>
    </div>
  )
}

const styles = {
  categories: {
    display: 'flex',
    gap: 10,
    padding: '15px 20px',
    flexWrap: 'wrap',
  },
  catBtn: {
    border: '1px solid #c472f4',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    transition: '0.3s',
    fontSize: 14,
  },
  hero: {
    margin: 20,
    padding: 40,
    textAlign: 'center',
    borderRadius: 10,
    background: '#fbf2fd',
    border: '2px dashed #b572f4',
    color: '#8918be',
  },
  shopBtn: {
    marginTop: 15,
    padding: '10px 20px',
    background: '#bc72f4',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
    transition: '0.3s',
  },
  products: { padding: '20px' },
  sectionTitle: { color: '#9418be', marginBottom: 16 },
  catTitle: {
    color: '#9418be',
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
    paddingBottom: 6,
    borderBottom: '1px solid #eecffb',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 40,
  },
  card: {
    background: 'white',
    border: '1px solid #eecffb',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    padding: 12,
    textAlign: 'center',
    borderRadius: 8,
  },
  imageBox: { height: 220, overflow: 'hidden', marginBottom: 10, borderBottom: '1px solid #eecffb' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  productName: { fontSize: 13, color: '#4a1d64', margin: '6px 0', lineHeight: 1.4 },
  price: { fontSize: 14, fontWeight: 600, color: '#9418be' },
  cardBtn: {
    background: '#bc72f4',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    padding: '7px 12px',
    cursor: 'pointer',
    fontSize: 12,
    transition: '0.3s',
  },
}
