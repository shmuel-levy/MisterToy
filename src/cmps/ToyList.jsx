import { ToyPreview } from './ToyPreview.jsx'

export function ToyList({ toys, onRemoveToy, onSelectToy, user }) {
  if (!toys || !toys.length) {
    return <div className="empty-list">No toys to show</div>
  }
  
  return (
    <section className="toy-list">
      {toys.map(toy => (
        <div key={toy._id} className="toy-card">
          <ToyPreview toy={toy} />
          <div className="toy-actions">
            <button 
              className="btn-details"
              onClick={() => onSelectToy(toy._id)}
            >
              Details
            </button>
          
            {user && user.isAdmin && (
              <button 
                className="btn-delete"
                onClick={() => onRemoveToy(toy._id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}