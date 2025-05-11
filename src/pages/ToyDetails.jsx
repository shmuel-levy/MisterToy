import { useState, useEffect } from 'react'
import { toyService } from '../services/toy.service-remote.js'

export function ToyDetails({ toyId, onBack, onEdit }) {
  const [toy, setToy] = useState(null)
  
  useEffect(() => {
    loadToy()
  }, [])
  
  async function loadToy() {
    try {
      const toyData = await toyService.getById(toyId)
      setToy(toyData)
    } catch (err) {
      console.error('Error loading toy details:', err)
      onBack()
    }
  }
  
  if (!toy) return <div className="loading">Loading...</div>
  
  return (
    <section className="toy-details">
      <div className="toy-details-header">
        <button className="btn-back" onClick={onBack}>Back</button>
        <h2>{toy.name}</h2>
      </div>
      
      <div className="toy-details-content">
        <div className="toy-image">
          <img src={toy.imgUrl || 'https://cdn.pixabay.com/photo/2017/07/28/18/33/toy-2549394_1280.jpg'}
              alt={toy.name}
              onError={(e) => {
                e.target.src = 'https://cdn.pixabay.com/photo/2017/07/28/18/33/toy-2549394_1280.jpg'
              }}
          />
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
        <button className="btn-edit" onClick={onEdit}>Edit</button>
      </div>
    </section>
  )
}