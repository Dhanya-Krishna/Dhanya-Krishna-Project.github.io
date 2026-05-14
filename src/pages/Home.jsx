import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { products, categories } from '../data/products'
import { useCart } from '../context/CartContext'
import { useState, useEffect, useRef } from 'react'

function HeroAnimation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const emojis = ['✏️', '📝', '🖊️', '📒', '⭐', '✨', '🖋️', '📌']
    const particles = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 14 + Math.random() * 14,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -0.3 - Math.random() * 0.4,
      opacity: 0.15 + Math.random() * 0.35,
      emoji: emojis[i % emojis.length],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.font = `${p.size}px serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.emoji, 0, 0)
        ctx.restore()

        p.x += p.speedX
        p.y += p.speedY
        p.rotation += p.rotSpeed

        if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width }
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      borderRadius: 16, pointerEvents: 'none',
    }} />
  )
}
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
    <div style={{ background: 'radial-gradient(ellipse at 60% 20%, #3b1a6e 0%, #1a0a2e 60%, #0d0618 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Navbar onSearch={setSearch} />

      <div style={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
          ...styles.catBtn,
           background: activeCategory === cat
           ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
           : 'rgba(255,255,255,0.06)',
           color: activeCategory === cat ? '#ffffff' : '#c084fc',
           border: activeCategory === cat
           ? '1px solid transparent'
           : '1px solid rgba(192,132,252,0.3)',
           boxShadow: activeCategory === cat
           ? '0 2px 14px rgba(168,85,247,0.45)'
           : 'none',
}}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.hero}>
        <HeroAnimation />                         
  <div style={{ position: 'relative', zIndex: 1 }}></div>
        <h2 style={{ color: '#ffffff', fontSize: 28, fontWeight: 700 }}>Welcome to StatioShop!</h2>
        <p style={{ marginTop: 8, color: '#c084fc' }}>Your one-stop stationery store</p>
        
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
          <p style={{ color: '#c084fc', textAlign: 'center', marginTop: 40 }}>
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
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 'auto',paddingTop:8, }}>
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
    justifyContent:'center',
    flexWrap: 'wrap',
  },
  catBtn: {
    border: '1px solid rgba(188,114,244,0.4)',
    padding: '8px 16px',
    borderRadius: 20,
    cursor: 'pointer',
    fontWeight: 600,
    transition: '0.3s',
    fontSize: 14,
    backdropFilter: 'blur(8px)',
    background: 'rgba(255,255,255,0.07)',
    color: '#c084fc',
  },
  hero: {
    margin: 20,
    padding: 40,
    textAlign: 'center',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(188,114,244,0.25)',
    backdropFilter: 'blur(12px)',
    color: '#ffffff',
    boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
    position:'relative',
    overflow:'hidden',
  },
 
  
  products: { padding: '20px' },
  sectionTitle: { color: '#e2c9ff', marginBottom: 16 },
  catTitle: {
    color: '#c084fc',
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
    paddingBottom: 6,
    borderBottom: '1px solid rgba(188,114,244,0.2)',
  },
  grid: {
    display: 'flex',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 30,
    flexWrap:'wrap',
    justifyContent:'center',
    marginBottom: 40,
  },
  card: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(188,114,244,0.2)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    width:220,
    flexShrink:0,
    display:'flex',
    flexDirection:'column',
    padding: 12,
    textAlign: 'center',
    borderRadius: 14,
  },
  imageBox: { height: 220, overflow: 'hidden', marginBottom: 10, borderBottom: '1px solid rgba(188,114,244,0.15)', borderRadius: 8 },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  productName: { fontSize: 13, color: '#e2d4f0', margin: '6px 0', lineHeight: 1.4 },
  price: { fontSize: 14, fontWeight: 600, color: '#c084fc' },
  cardBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    padding: '7px 12px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
    boxShadow: '0 2px 10px rgba(168,85,247,0.4)',
    transition: '0.3s',
  },
}



