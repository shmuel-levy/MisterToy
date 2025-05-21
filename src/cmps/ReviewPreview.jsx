import { userService } from '../services/user/user.service.remote'

export function ReviewPreview({ review, onRemove }) {
  const loggedinUser = userService.getLoggedinUser()
  const isAuthor = loggedinUser && review.byUser._id === loggedinUser._id
  const isAdmin = loggedinUser && loggedinUser.isAdmin

  return (
    <div className="review-preview">
      <p className="review-content">"{review.txt}"</p>
      <div className="review-info">
        <p>
          <span className="review-about">For: </span>
          <span className="review-user">{review.aboutUser.fullname}</span>
        </p>
        <p>
          <span className="review-by">By: </span>
          <span className="review-user">{review.byUser.fullname}</span>
        </p>
      </div>
      
      {(isAuthor || isAdmin) && (
        <button 
          className="btn-remove" 
          onClick={() => onRemove(review._id)}
          title="Remove Review"
        >
          ✕
        </button>
      )}
    </div>
  )
}