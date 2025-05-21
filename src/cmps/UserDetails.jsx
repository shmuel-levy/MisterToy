import { useState, useEffect } from 'react'
import { userService } from '../services/user/user.service.remote'
import { reviewService } from '../services/review/review.service.remote'
import { AddReview } from '../cmps/AddReview'
import { ReviewList } from '../cmps/ReviewList'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function UserDetails({ userId, onBack }) {
  const [user, setUser] = useState(null)
  const [userReviews, setUserReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadUser()
      loadUserReviews()
    }
  }, [userId])

  async function loadUser() {
    try {
      setIsLoading(true)
      const userData = await userService.getById(userId)
      setUser(userData)
    } catch (err) {
      console.error('Failed to load user', err)
      showErrorMsg('Failed to load user')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadUserReviews() {
    try {
      const reviews = await reviewService.query({ aboutUserId: userId })
      setUserReviews(reviews)
    } catch (err) {
      console.error('Failed to load user reviews', err)
      showErrorMsg('Failed to load reviews')
    }
  }

  async function handleAddReview(reviewToAdd) {
    try {
      const addedReview = await reviewService.add(reviewToAdd)
      setUserReviews(prevReviews => [addedReview, ...prevReviews])
      showSuccessMsg('Review added successfully')
      return addedReview
    } catch (err) {
      console.error('Failed to add review', err)
      showErrorMsg('Failed to add review')
      throw err
    }
  }

  async function handleRemoveReview(reviewId) {
    try {
      await reviewService.remove(reviewId)
      setUserReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId))
      showSuccessMsg('Review removed')
    } catch (err) {
      console.error('Failed to remove review', err)
      showErrorMsg('Failed to remove review')
      throw err
    }
  }

  if (isLoading) return <div className="loading">Loading...</div>
  if (!user) return <div>User not found</div>

  const loggedinUser = userService.getLoggedinUser()
  const canAddReview = loggedinUser && loggedinUser._id !== userId

  return (
    <section className="user-details">
      <button className="btn-back" onClick={onBack}>Back</button>
      
      <div className="user-info">
        <h2>{user.fullname}</h2>
        {user.score && <p>Score: {user.score}</p>}
      </div>
      
      {canAddReview && (
        <div className="add-review-section">
          <h3>Add a Review for {user.fullname}</h3>
          <AddReview 
            targetUserId={userId} 
            onAddReview={handleAddReview} 
          />
        </div>
      )}
      
      <div className="user-reviews">
        <h3>Reviews about {user.fullname}</h3>
        <ReviewList 
          reviews={userReviews} 
          onRemove={handleRemoveReview} 
        />
      </div>
    </section>
  )
}