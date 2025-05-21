import { useState, useEffect } from 'react'
import { ReviewPreview } from './ReviewPreview.jsx'
import { showErrorMsg } from '../services/event-bus.service'
// import { socketService, SOCKET_EVENT_REVIEW_ADDED, SOCKET_EVENT_REVIEW_REMOVED } from '../services/socket.service'

export function ReviewList({ reviews: initialReviews, onRemove }) {
  const [reviews, setReviews] = useState(initialReviews || [])

  useEffect(() => {
    if (initialReviews) setReviews(initialReviews)
  }, [initialReviews])

  useEffect(() => {
    // socketService.on(SOCKET_EVENT_REVIEW_ADDED, onReviewAdded)
    // socketService.on(SOCKET_EVENT_REVIEW_REMOVED, onReviewRemoved)
    
    // Clean up
    return () => {
      socketService.off(SOCKET_EVENT_REVIEW_ADDED, onReviewAdded)
      socketService.off(SOCKET_EVENT_REVIEW_REMOVED, onReviewRemoved)
    }
  }, [])

  function onReviewAdded(review) {
    setReviews(prevReviews => [review, ...prevReviews])
  }

  function onReviewRemoved(reviewId) {
    setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId))
  }

  async function handleRemoveReview(reviewId) {
    try {
      await onRemove(reviewId)
    } catch (err) {
      showErrorMsg('Failed to remove review')
    }
  }

  if (!reviews.length) return <div className="no-reviews">No reviews yet</div>

  return (
    <section className="review-list">
      <h2>What People Think</h2>
      {reviews.map(review => (
        <ReviewPreview 
          key={review._id} 
          review={review} 
          onRemove={handleRemoveReview} 
        />
      ))}
    </section>
  )
}