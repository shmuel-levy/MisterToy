import { useState, useEffect } from 'react'
import { userService } from '../services/user/user.service.remote.js'
import { reviewService } from '../services/review/review.service.remote.js'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { AddReview } from '../cmps/AddReview.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

export function ReviewExplore() {
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
    loadReviews()
  }, [])

  async function loadUsers() {
    try {
      const users = await userService.getUsers()
      setUsers(users)
    } catch (err) {
      console.error('Failed to load users', err)
      showErrorMsg('Failed to load users')
    }
  }

  async function loadReviews() {
    try {
      setIsLoading(true)
      const reviews = await reviewService.query()
      setReviews(reviews)
    } catch (err) {
      console.error('Failed to load reviews', err)
      showErrorMsg('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddReview(reviewToAdd) {
    try {
      const addedReview = await reviewService.add(reviewToAdd)
      setReviews(prevReviews => [addedReview, ...prevReviews])
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
      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId))
      showSuccessMsg('Review removed successfully')
    } catch (err) {
      console.error('Failed to remove review', err)
      showErrorMsg('Failed to remove review')
      throw err
    }
  }

  function handleUserSelect(ev) {
    setSelectedUserId(ev.target.value)
  }

  const loggedinUser = userService.getLoggedinUser()

  return (
    <section className="review-explore">
      <h1>User Reviews</h1>
      
      {!loggedinUser && (
        <div className="login-message">
          <p>Please log in to write reviews</p>
        </div>
      )}
      
      {loggedinUser && (
        <div className="review-form-container">
          <div className="user-select">
            <label>
              Select User to Review:
              <select value={selectedUserId} onChange={handleUserSelect}>
                <option value="">-- Select User --</option>
                {users.map(user => (
                  user._id !== loggedinUser._id && (
                    <option key={user._id} value={user._id}>
                      {user.fullname}
                    </option>
                  )
                ))}
              </select>
            </label>
          </div>
          
          {selectedUserId && (
            <AddReview
              targetUserId={selectedUserId}
              onAddReview={handleAddReview}
            />
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className="loading">Loading reviews...</div>
      ) : (
        <ReviewList 
          reviews={reviews} 
          onRemove={handleRemoveReview} 
        />
      )}
    </section>
  )
}