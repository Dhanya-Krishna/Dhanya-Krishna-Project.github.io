import { useState, useEffect } from 'react'

const STORAGE_KEY = 'inv_v3'

const defaultInventory = [
  { id: '001', name: 'Classic Notebook', price: '120', stock: '45' },
]

const defaultOrders = [
  { id: '#ORD-9021', customer: 'Devika B.', product: 'Notebook x2', total: '₹240', delivered: false },
  { id: '#ORD-9022', customer: 'Rahul M.', product: 'Pen x5', total: '₹100', delivered: true },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [inventory, setInventory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultInventory
    } catch { return defaultInventory }
  })
  const [orders, setOrders] = useState(defaultOrders)
  const [selected, setSelected] = useState(null)

  // Modal state
  const [modal, setModal] = useState(null) // { type: 'add' | 'edit', data: {} }
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory))
  }, [inventory])

  const openAdd = () => {
    setFormData({ name: '', price: '', stock: '' })
    setFormError('')
    setModal({ type: 'add' })
  }

  const openEdit = () => {
    if (!selected) { alert('Select a row first!'); return }
    setFormData({ name: selected.name, price: selected.price, stock: selected.stock })
    setFormError('')
    setModal({ type: 'edit' })
  }

  const handleDelete = () => {
    if (!selected) { alert('Select a row first!'); return }
    if (!window.confirm('Delete this product?')) return
    setInventory(prev => prev.filter(i => i.id !== selected.id))
    setSelected(null)
  }

  const handleSubmit = () => {
    const { name, price, stock } = formData
    if (!name || !price || !stock) { setFormError('All fields are required.'); return }
    if (modal.type === 'add') {
      const newId = String(inventory.length + 1).padStart(3, '0')
      setInventory(prev => [...prev, { id: newId, name, price, stock }])
    } else {
      setInventory(prev => prev.map(i => i.id === selected.id ? { ...i, name, price, stock } : i))
      setSelected(s => ({ ...s, name, price, stock }))
    }
    setModal(null)
  }

  const toggleOrder = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, delivered: !o.delivered } : o))
  }

  return (
    <div style={styles.body}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Statio Admin</h2>
        <div
          style={{ ...styles.nav, ...(activeTab === 'inventory' ? styles.navActive : {}) }}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </div>
        <div
          style={{ ...styles.nav, ...(activeTab === 'orders' ? styles.navActive : {}) }}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </div>
      </nav>

      {/* Main */}
      <main style={styles.main}>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <section>
            <h1 style={styles.h1}>Inventory Management</h1>
            <div style={styles.stat}>
              <small style={{ color: '#bc72f4', fontWeight: 'bold' }}>TOTAL PRODUCTS</small>
              <h3>{inventory.length}</h3>
            </div>

            <div style={styles.btns}>
              <button style={styles.btnPrimary} onClick={openAdd}>+ Add Product</button>
              <button style={styles.btnDefault} onClick={openEdit}>Edit</button>
              <button style={{ ...styles.btnDefault, color: '#dc2626' }} onClick={handleDelete}>Delete</button>
            </div>

            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['ID', 'Product', 'Price', 'Stock'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr
                      key={item.id}
                      style={selected?.id === item.id ? styles.selectedRow : {}}
                      onClick={() => setSelected(item)}
                    >
                      <td style={styles.td}>{item.id}</td>
                      <td style={styles.td}><b>{item.name}</b></td>
                      <td style={styles.td}>₹{item.price}</td>
                      <td style={styles.td}>{item.stock} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <section>
            <h1 style={styles.h1}>Customer Orders</h1>
            <div style={styles.card}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Order ID', 'Customer', 'Product', 'Total', 'Status', 'Action'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={styles.td}>{order.id}</td>
                      <td style={styles.td}>{order.customer}</td>
                      <td style={styles.td}>{order.product}</td>
                      <td style={styles.td}>{order.total}</td>
                      <td style={styles.td}>
                        <span style={order.delivered ? styles.badgeDelivered : styles.badgePending}>
                          {order.delivered ? 'Delivered' : 'Pending'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.btnDefault} onClick={() => toggleOrder(order.id)}>
                          {order.delivered ? 'Mark Pending' : 'Mark Delivered'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ color: '#9418be', marginBottom: 16 }}>
              {modal.type === 'add' ? 'Add Product' : 'Edit Product'}
            </h3>
            {['name', 'price', 'stock'].map(field => (
              <div key={field} style={{ marginBottom: 12 }}>
                <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  style={styles.input}
                  value={formData[field]}
                  onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                />
              </div>
            ))}
            {formError && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>{formError}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button style={styles.btnPrimary} onClick={handleSubmit}>Save</button>
              <button style={styles.btnDefault} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  body: { display: 'flex', background: '#fbf5ff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  sidebar: {
    width: 220,
    background: '#2d133b',
    color: 'white',
    position: 'fixed',
    height: '100%',
    padding: '20px 0',
    borderRight: '2px solid #bc72f4',
  },
  sidebarTitle: {
    padding: '0 20px 15px',
    borderBottom: '1px solid rgba(188,114,244,0.3)',
    fontSize: '1.1rem',
    color: '#bc72f4',
  },
  nav: { padding: '15px 20px', cursor: 'pointer', color: '#dec1f3', transition: '0.2s' },
  navActive: { background: '#4a1d64', color: 'white', borderLeft: '4px solid #bc72f4' },
  main: { marginLeft: 220, padding: 30, width: '100%' },
  h1: { fontSize: '1.5rem', marginBottom: 20, color: '#9418be' },
  stat: {
    background: 'white',
    border: '1px solid #eecffb',
    borderRadius: 10,
    padding: '16px 24px',
    marginBottom: 20,
    display: 'inline-block',
    boxShadow: '0 4px 10px rgba(188,114,244,0.05)',
  },
  btns: { display: 'flex', gap: 10, marginBottom: 20 },
  btnPrimary: {
    padding: '10px 18px',
    borderRadius: 8,
    border: 'none',
    background: '#bc72f4',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    transition: '0.3s',
  },
  btnDefault: {
    padding: '10px 18px',
    borderRadius: 8,
    border: '1px solid #eecffb',
    background: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    color: '#9418be',
    transition: '0.3s',
  },
  card: {
    background: 'white',
    border: '1px solid #eecffb',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(188,114,244,0.1)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '14px 18px',
    textAlign: 'left',
    borderBottom: '1px solid #eecffb',
    background: '#fbf2fd',
    fontSize: '0.85rem',
    color: '#9418be',
    textTransform: 'uppercase',
  },
  td: { padding: '14px 18px', textAlign: 'left', borderBottom: '1px solid #eecffb' },
  selectedRow: { background: '#f5e8ff', outline: '1px solid #bc72f4' },
  badgeDelivered: {
    padding: '5px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#dcfce7', color: '#166534',
  },
  badgePending: {
    padding: '5px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
    background: '#fef9c3', color: '#854d0e',
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    width: 360,
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
  },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#4a1d64', marginBottom: 4 },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid #eecffb',
    background: '#fbf2fd',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
}
