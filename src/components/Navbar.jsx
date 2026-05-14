import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onSearch }) {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = pathname.startsWith('/admin')

  return (
    <nav style={styles.navbar}>
      {/* Row 1: Logo + Nav Buttons */}
      <div style={styles.topRow}>
        <Link to="/home" style={styles.logo}>StatioShop</Link>
        <div style={styles.navLinks}>
          <Link to="/home" style={styles.btn}>Home</Link>
          <Link to="/cart" style={styles.btn}>Cart ({count})</Link>
          <Link to="/order" style={styles.btn}>Orders</Link>
          {user && (
            <button onClick={handleLogout} style={{ ...styles.btn, cursor: 'pointer', border: 'none' }}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Search bar (full width on small screens) */}
      {!isAdmin && onSearch !== undefined && (
        <div style={styles.searchRow}>
          <input
            style={styles.search}
            type="text"
            placeholder="Search products..."
            onChange={e => onSearch(e.target.value)}
          />
        </div>
      )}
    </nav>
  )
}

const styles = {
  navbar: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 20px',
    background: 'rgba(13, 6, 24, 0.85)',
    borderBottom: '1px solid rgba(188,114,244,0.25)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: 10,
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    color: '#c084fc',
    textDecoration: 'none',
    flexShrink: 0,
    letterSpacing: '0.5px',
    textShadow: '0 0 20px rgba(192,132,252,0.5)',
  },
  searchRow: {
    width: '100%',
  },
  search: {
    padding: '9px 14px',
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 10,
    border: '1px solid rgba(188,114,244,0.3)',
    background: 'rgba(255,255,255,0.07)',
    outline: 'none',
    fontSize: 14,
    color: '#e2d4f0',
    backdropFilter: 'blur(8px)',
  },
  navLinks: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  btn: {
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 8,
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    transition: '0.3s',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 10px rgba(168,85,247,0.35)',
  },
}
