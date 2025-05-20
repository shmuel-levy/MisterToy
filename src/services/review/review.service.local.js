import { storageService } from '../async-storage.service.js'
import { userService } from '../user.service.js'
import { utilService } from '../util.service.js'

export const reviewService = {
  add,
  query,
  remove,
}

function query(filterBy = {}) {
  return storageService.query('review')
    .then(reviews => {
      if (filterBy.byUserId) {
        reviews = reviews.filter(review => review.byUser._id === filterBy.byUserId)
      }
      if (filterBy.aboutUserId) {
        reviews = reviews.filter(review => review.aboutUser._id === filterBy.aboutUserId)
      }
      return reviews
    })
}

async function remove(reviewId) {
  await storageService.remove('review', reviewId)
  return reviewId
}

async function add(reviewToAdd) {
  try {
    const aboutUser = await userService.getById(reviewToAdd.aboutUserId)
    const loggedinUser = userService.getLoggedinUser()
    
   
    const review = {
      txt: reviewToAdd.txt,
      byUser: {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
      },
      aboutUser: {
        _id: aboutUser._id,
        fullname: aboutUser.fullname,
      },
      createdAt: Date.now(),
    }
    
    const addedReview = await storageService.post('review', review)
    
  
    loggedinUser.score += 10
    userService.saveLocalUser(loggedinUser)
    
    return addedReview
  } catch (err) {
    console.error('Failed to add review:', err)
    throw err
  }
}