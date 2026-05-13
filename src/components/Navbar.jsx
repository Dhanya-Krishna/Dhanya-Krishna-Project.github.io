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
      <Link to="/home" style={styles.logo}>StatioShop</Link>

      {!isAdmin && onSearch !== undefined && (
        <input
          style={styles.search}
          type="text"
          placeholder="Search products..."
          onChange={e => onSearch(e.target.value)}
        />
      )}

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
    </nav>
  )
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    background: 'white',
    borderBottom: '2px solid #c272f4',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#bc72f4',
    textDecoration: 'none',
  },
  search: {
    padding: '8px 12px',
    width: 250,
    borderRadius: 8,
    border: '1px solid #eecffb',
    background: '#fbf2fd',
    outline: 'none',
    fontSize: 14,
  },
  navLinks: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  btn: {
    background: '#d297e9',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 5,
    color: 'white',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 14,
    transition: '0.3s',
  },
}
