// services/user/index.js
const { VITE_LOCAL } = import.meta.env
const DEV = import.meta.env.MODE === 'development'

// Use dynamic imports to avoid circular dependencies
let userService = null

// Initialize the service based on environment
async function initService() {
  if (VITE_LOCAL === 'true') {
    const { userService: localService } = await import('./user.service.local.js')
    userService = localService
  } else {
    const { userService: remoteService } = await import('./user.service.remote.js')
    userService = remoteService
  }

  // For debugging
  if (DEV) window.userService = userService
}

// Start initialization
initService()

// Export a proxy that forwards calls to the real service once it's loaded
export default new Proxy({}, {
  get(target, prop) {
    // Return a function that checks if userService is initialized
    return (...args) => {
      if (!userService) {
        console.warn('User service not yet initialized, initializing now...')
        return initService().then(() => userService[prop](...args))
      }
      return userService[prop](...args)
    }
  }
})