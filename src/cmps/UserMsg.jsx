import { useState, useEffect } from 'react'

export function UserMsg({ msg, onClose, timeout = 3000 }) {
  const [isShowing, setIsShowing] = useState(true)
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsShowing(false)
      onClose()
    }, timeout)
    
    return () => clearTimeout(timeoutId)
  }, [])
  
  if (!isShowing) return null
  
  const msgClass = `user-msg ${msg.type}`
  
  return (
    <div className={msgClass}>
      <div className="msg-content">
        <span className="msg-text">{msg.txt}</span>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="msg-progress" style={{ animationDuration: `${timeout}ms` }}></div>
    </div>
  )
}