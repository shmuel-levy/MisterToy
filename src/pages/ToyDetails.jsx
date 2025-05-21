import { useState, useEffect } from 'react'
import { toyService } from '../services/toy.service-remote.js' 
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function ToyDetails({ toyId, onBack, onEdit, user }) {
  const [toy, setToy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMsg, setNewMsg] = useState('')
  
  useEffect(() => {
    loadToy()
  }, [])
  
  async function loadToy() {
    setIsLoading(true)
    try {
      const toyData = await toyService.getById(toyId)
      setToy(toyData)
    } catch (err) {
      console.error('Error loading toy details:', err)
      showErrorMsg('Failed to load toy details')
      onBack()
    } finally {
      setIsLoading(false)
    }
  }
  
  async function handleAddMsg(ev) {
    ev.preventDefault()
    
    if (!user) {
      showErrorMsg('Please login to add messages')
      return
    }
    
    if (!newMsg.trim()) return
    
    try {
      await toyService.addMsg(toyId, newMsg)
      setNewMsg('')
      showSuccessMsg('Message added successfully')
      loadToy() 
    } catch (err) {
      console.error('Failed to add message:', err)
      showErrorMsg('Failed to add message')
    }
  }
  
  async function handleRemoveMsg(msgId) {
    try {
      await toyService.removeMsg(toyId, msgId)
      showSuccessMsg('Message removed')
      loadToy() 
    } catch (err) {
      console.error('Failed to remove message:', err)
      showErrorMsg('Failed to remove message')
    }
  }
  
  function handleEditClick() {
    if (!user || !user.isAdmin) {
      showErrorMsg('Only admins can edit toys')
      return
    }
    
    onEdit()
  }
  
  if (isLoading) return <div className="loading">Loading...</div>
  if (!toy) return <div className="error">Toy not found</div>
  
  return (
    <section className="toy-details">
      <div className="toy-details-header">
        <button className="btn-back" onClick={onBack}>Back</button>
        <h2>{toy.name}</h2>
      </div>
      
      <div className="toy-details-content">
        <div className="toy-image">
         <img src={`public/images/${toy.imgUrl}`} alt={toy.name} />
        </div>
        
        <div className="toy-info">
          <h3 className="price">${toy.price}</h3>
          <p className="stock-status">
            Status: <span className={toy.inStock ? 'in-stock' : 'out-of-stock'}>
              {toy.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </p>
          
          <div className="toy-labels">
            <h4>Labels:</h4>
            <div className="labels">
              {toy.labels.map(label => (
                <span key={label} className="label">{label}</span>
              ))}
            </div>
          </div>
          
          <p className="created-at">
            Created: {new Date(toy.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="toy-actions">
        {user && user.isAdmin && (
          <button className="btn-edit" onClick={handleEditClick}>Edit</button>
        )}
      </div>
      
      <div className="toy-messages">
        <h3>Messages</h3>
        
        {user ? (
          <form className="add-message-form" onSubmit={handleAddMsg}>
            <input
              type="text"
              value={newMsg}
              onChange={(ev) => setNewMsg(ev.target.value)}
              placeholder="Add your message..."
              required
            />
            <button type="submit" className="btn-send">Send</button>
          </form>
        ) : (
          <p className="login-prompt">Please login to add messages</p>
        )}
        
        <div className="messages-list">
          {toy.msgs && toy.msgs.length > 0 ? (
            <ul>
              {toy.msgs.map(msg => (
                <li key={msg.id} className="message-item">
                  <div className="message-content">
                    <span className="message-author">{msg.by.fullname}:</span>
                    <span className="message-text">{msg.txt}</span>
                  </div>
                  
                  {user && (user.isAdmin || user._id === msg.by._id) && (
                    <button 
                      className="btn-delete-msg"
                      onClick={() => handleRemoveMsg(msg.id)}
                      title="Delete message"
                    >
                      ✕
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-messages">No messages yet</p>
          )}
        </div>
      </div>
    </section>
  )
}