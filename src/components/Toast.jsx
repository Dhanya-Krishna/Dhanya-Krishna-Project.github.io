import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'error', onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      onDone?.()
    }, 3000)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null

  const bg = type === 'success' ? '#6a0dad' : '#c0392b'

  return (
    <div style={{
      ...styles.toast,
      background: bg,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(60px)',
    }}>
      {message}
    </div>
  )
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%) translateY(60px)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 10,
    fontSize: 14,
    transition: 'all 0.4s ease',
    zIndex: 999,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  },
}
