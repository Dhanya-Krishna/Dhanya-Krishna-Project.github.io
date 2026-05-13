import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    phone: '', address: '', pincode: '',
  })
  const [error, setError] = useState('')

  const set = (field) => (e) => {
    let val = e.target.value
    if (field === 'phone') val = val.replace(/[^0-9]/g, '').slice(0, 10)
    if (field === 'pincode') val = val.replace(/[^0-9]/g, '').slice(0, 6)
    setForm(p => ({ ...p, [field]: val }))
  }

  const handleRegister = () => {
    const { name, email, password, confirm, phone, address, pincode } = form
    if (!name || !email || !password || !confirm || !phone || !address || !pincode) {
      setError('Please fill all fields!'); return
    }
    if (password !== confirm) { setError('Passwords do not match!'); return }
    if (!/^[0-9]{10}$/.test(phone)) { setError('Phone number must be exactly 10 digits!'); return }
    if (!/^[0-9]{6}$/.test(pincode)) { setError('Pincode must be exactly 6 digits!'); return }

    register({ name, email, password, phone, address, pincode })
    navigate('/home')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.brand}>StatioShop</p>
        <p style={styles.subtitle}>Create your account</p>

        {[
          { label: 'Full Name', field: 'name', type: 'text' },
          { label: 'Email', field: 'email', type: 'email' },
          { label: 'Password', field: 'password', type: 'password' },
          { label: 'Confirm Password', field: 'confirm', type: 'password' },
          { label: 'Phone Number', field: 'phone', type: 'text' },
          { label: 'Address', field: 'address', type: 'text' },
          { label: 'Pincode', field: 'pincode', type: 'text' },
        ].map(({ label, field, type }) => (
          <div key={field} style={styles.field}>
            <label style={styles.label}>{label}</label>
            <input
              style={styles.input}
              type={type}
              value={form[field]}
              onChange={set(field)}
            />
          </div>
        ))}

        {error && <p style={styles.errorMsg}>{error}</p>}

        <button style={styles.btn} onClick={handleRegister}>Register</button>

        <div style={styles.link}>
          <Link to="/login" style={styles.linkPurple}>Back to Login</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fbf5ff',
    padding: '20px 0',
  },
  card: {
    background: '#fff',
    border: '1px solid #eecffb',
    borderRadius: 16,
    padding: '2rem',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 4px 15px rgba(188,114,244,0.1)',
  },
  brand: { fontSize: 22, fontWeight: 600, color: '#bc72f4', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#9418be', marginBottom: 20 },
  field: { marginBottom: 12 },
  label: { fontSize: 13, color: '#4a1d64', fontWeight: 600, display: 'block', marginBottom: 4 },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #eecffb',
    background: '#fbf2fd',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  errorMsg: { color: '#e74c3c', fontSize: 13, marginBottom: 8 },
  btn: {
    width: '100%',
    marginTop: 15,
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
  link: { textAlign: 'center', marginTop: 10 },
  linkPurple: { color: '#bc72f4', fontWeight: 600 },
}
