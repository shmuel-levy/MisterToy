import { useState, useEffect, useRef } from 'react'

export function Chat() {
  const [msgs, setMsgs] = useState([])
  const [userInput, setUserInput] = useState('')
  const msgsRef = useRef()

  useEffect(() => {
    if (msgs.length === 0) {
      addMsg('Hello! How can I help you today?', 'Support')
    }
  }, [])

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTo({
        top: msgsRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [msgs])

  function addMsg(text, from) {
    const newMsg = {
      id: Date.now(),
      text,
      from,
      timestamp: new Date().toLocaleTimeString()
    }
    setMsgs(prevMsgs => [...prevMsgs, newMsg])
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!userInput.trim()) return

    addMsg(userInput, 'user')

    setTimeout(() => {
      addMsg(`Sure thing honey`, 'Support')
    }, 1000)
    
    setUserInput('')
  }

  return (
    <div className="chat-container">
      <div ref={msgsRef} className="chat-messages">
        {msgs.map(msg => (
          <div key={msg.id} className={`message ${msg.from === 'user' ? 'user' : 'other'}`}>
            <section>
              <span className="timestamp">{msg.timestamp}</span>
              <h3>{msg.from === 'user' ? 'You' : msg.from}: </h3>
            </section>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={userInput}
          onChange={(ev) => setUserInput(ev.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}