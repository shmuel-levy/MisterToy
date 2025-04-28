import { useState } from 'react'
import { Chat } from './Chat'
import { PopUp } from './PopUp'

export function ChatButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  function togglePopup() {
    setIsPopupOpen(prevState => !prevState)
  }

  return (
    <>
      <button className="chat-float-button" onClick={togglePopup}>
        <span className="chat-icon">💬</span>
      </button>

      <PopUp 
        isOpen={isPopupOpen}
        onClose={togglePopup}
        header={<h3>Chat with us</h3>}
        footer={<button onClick={togglePopup}>Close</button>}
      >
        <Chat />
      </PopUp>
    </>
  )
}