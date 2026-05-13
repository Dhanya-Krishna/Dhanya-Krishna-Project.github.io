import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)

  const validate = () => {
    const errs = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) errs.email = 'Email cannot be empty.'
    else if (!emailRegex.test(email)) errs.email = 'Please enter a valid email address.'
    if (!password) errs.password = 'Password cannot be empty.'
    return errs
  }

  const handleLogin = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const result = login(email.trim(), password)
    if (!result.ok) {
      if (result.field) setErrors({ [result.field]: result.message })
      setToast({ message: result.message, type: 'error' })
      return
    }
    setToast({ message: 'Login successful! Redirecting...', type: 'success' })
    setTimeout(() => navigate('/home'), 1500)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.brand}>StatioShop</p>
        <p style={styles.subtitle}>Sign in to your account</p>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
            onKeyDown={handleKeyDown}
          />
          {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
            onKeyDown={handleKeyDown}
          />
          {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
        </div>

        <div style={styles.forgot}><a href="#" style={styles.forgotLink}>Forgot password?</a></div>

        <button style={styles.btnLogin} onClick={handleLogin}>Login</button>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        <p style={styles.registerLink}>
          New to StatioShop?{' '}
          <Link to="/register" style={styles.linkPurple}>Register here</Link>
        </p>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
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
  },
  card: {
    background: '#fff',
    border: '1px solid #eecffb',
    borderRadius: 16,
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: 380,
    boxShadow: '0 4px 15px rgba(188,114,244,0.1)',
  },
  brand: { fontSize: 22, fontWeight: 600, color: '#bc72f4', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9418be', marginBottom: '2rem', opacity: 0.8 },
  field: { marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: 13, color: '#4a1d64', marginBottom: 6, fontWeight: 600 },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 15,
    border: '1px solid #eecffb',
    borderRadius: 8,
    background: '#fbf2fd',
    color: '#4a1d64',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputError: { borderColor: '#e74c3c', boxShadow: '0 0 0 3px rgba(231,76,60,0.12)' },
  errorMsg: { fontSize: 12, color: '#e74c3c', display: 'block', marginTop: 4 },
  forgot: { textAlign: 'right', marginTop: '-0.75rem', marginBottom: '1rem' },
  forgotLink: { fontSize: 12, color: '#9418be' },
  btnLogin: {
    width: '100%',
    padding: 11,
    fontSize: 15,
    fontWeight: 600,
    background: '#bc72f4',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: '0.3s',
  },
  divider: { display: 'flex', alignItems: 'center', gap: 10, margin: '1.25rem 0' },
  dividerLine: { flex: 1, height: 1, background: '#eecffb' },
  dividerText: { fontSize: 12, color: '#9418be' },
  registerLink: { textAlign: 'center', fontSize: 14, color: '#4a1d64' },
  linkPurple: { color: '#bc72f4', fontWeight: 600 },
}
