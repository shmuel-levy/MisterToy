import { httpService } from '../http.service.js'
// import { socketService } from '../socket.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = 'auth/'
const USER_URL = 'user/'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    update,
    getEmptyCredentials
}

async function getUsers() {
    try {
        return await httpService.get(USER_URL)
    } catch (err) {
        console.error('Failed to get users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        return await httpService.get(`${USER_URL}${userId}`)
    } catch (err) {
        console.error(`Failed to get user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const updatedUser = await httpService.put(`${USER_URL}${user._id}`, user)
        if (getLoggedinUser()._id === user._id) saveLocalUser(updatedUser)
        return updatedUser
    } catch (err) {
        console.error(`Failed to update user ${user._id}`, err)
        throw err
    }
}

async function login(credentials) {
    try {
        const user = await httpService.post(BASE_URL + 'login', credentials)
        if (user) {
            _saveLocalUser(user)
            socketService.login(user._id)
        }
        return user
    } catch (err) {
        console.error('Failed to login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
        const user = await httpService.post(BASE_URL + 'signup', credentials)
        if (user) {
            _saveLocalUser(user)
            socketService.login(user._id)
        }
        return user
    } catch (err) {
        console.error('Failed to signup', err)
        throw err
    }
}

async function logout() {
    try {
        await httpService.post(BASE_URL + 'logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        socketService.logout()
    } catch (err) {
        console.error('Failed to logout', err)
        throw err
    }
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin, score: user.score || 0 }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

function _saveLocalUser(user) {
    return saveLocalUser(user)
}