import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const register = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = (email, password) => {
    const stored = localStorage.getItem('user')
    if (!stored) return { ok: false, message: 'No registered account found. Please register first.' }
    const saved = JSON.parse(stored)
    if (saved.email !== email) return { ok: false, field: 'email', message: 'Email not found.' }
    if (saved.password !== password) return { ok: false, field: 'password', message: 'Incorrect password.' }
    setUser(saved)
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
