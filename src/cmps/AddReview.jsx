import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function AddReview({ onAddReview, targetUserId }) {
  const [reviewTxt, setReviewTxt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(ev) {
    ev.preventDefault()
    
    if (!reviewTxt.trim()) return
    
    try {
      setIsSubmitting(true)
      await onAddReview({
        txt: reviewTxt,
        aboutUserId: targetUserId
      })
      
      showSuccessMsg('Review added successfully!')
      setReviewTxt('')
    } catch (err) {
      console.error('Error adding review', err)
      showErrorMsg('Failed to add review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="add-review" onSubmit={handleSubmit}>
      <textarea
        value={reviewTxt}
        onChange={(ev) => setReviewTxt(ev.target.value)}
        placeholder="Write your review here..."
        required
        rows="4"
      ></textarea>
      
      <button 
        className="btn-submit" 
        disabled={isSubmitting || !reviewTxt.trim()}
      >
        {isSubmitting ? 'Adding...' : 'Add Review'}
      </button>
    </form>
  )
}