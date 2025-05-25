import io from 'socket.io-client'

export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'

export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_REMOVED = 'review-removed'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

window.socketService = socketService

document.addEventListener('DOMContentLoaded', () => {
    socketService.setup()
})

function createSocketService() {
    var socket = null
    const socketService = {
        async setup() {
            socket = io(baseUrl)
            console.log('Socket service setup completed')
    
            setTimeout(async () => {
                try {
                    const { default: userService } = await import('./user')
                    const user = await userService.getLoggedinUser()
                    if (user && user._id) {
                        console.log('Auto-reconnecting user:', user._id)
                        this.login(user._id)
                    } else {
                        console.log('No logged in user to reconnect')
                    }
                } catch (err) {
                    console.log('Could not auto-reconnect user:', err.message)
                }
            }, 500) 
        },
        on(eventName, cb) {
            socket.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            socket.emit(eventName, data)
        },
        login(userId) {
            if (!socket) {
                console.warn('Socket not connected yet, retrying...')
                setTimeout(() => this.login(userId), 100)
                return
            }
            console.log('Socket login for user:', userId)
            socket.emit(SOCKET_EMIT_LOGIN, userId)
        },
        logout() {
            if (!socket) return
            console.log('Socket logout')
            socket.emit(SOCKET_EMIT_LOGOUT)
        },
        terminate() {
            socket = null
        },
    }
    return socketService
}

function createDummySocketService() {
    var listenersMap = {}
    const socketService = {
        listenersMap,
        setup() {
            listenersMap = {}
            console.log('Dummy socket service setup')
        },
        terminate() {
            this.setup()
        },
        login(userId) {
            console.log('Dummy socket service here, login - got it for user:', userId)
        },
        logout() {
            console.log('Dummy socket service here, logout - got it')
        },
        on(eventName, cb) {
            listenersMap[eventName] = [...(listenersMap[eventName]) || [], cb]
        },
        off(eventName, cb) {
            if (!listenersMap[eventName]) return
            if (!cb) delete listenersMap[eventName]
            else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
        },
        emit(eventName, data) {
            var listeners = listenersMap[eventName]
            if (eventName === SOCKET_EMIT_SEND_MSG) {
                listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
            }

            if (!listeners) return

            listeners.forEach(listener => {
                listener(data)
            })
        },
       
        testChatMsg() {
            this.emit(SOCKET_EVENT_ADD_MSG, { from: 'Someone', txt: 'Aha it worked!' })
        },
        testUserUpdate() {
          
            this.emit(SOCKET_EVENT_USER_UPDATED, { _id: 'test', fullname: 'Test User', score: 555 })
        }
    }
    window.listenersMap = listenersMap
    return socketService
}