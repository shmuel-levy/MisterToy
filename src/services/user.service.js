import { httpService } from './http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const BASE_URL = 'auth/'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    getEmptyCredentials
}

async function login(credentials) {
    try {
        const user = await httpService.post(BASE_URL + 'login', credentials)
        if (user) _saveLocalUser(user)
        return user
    } catch (err) {
        console.error('Failed to login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
        const user = await httpService.post(BASE_URL + 'signup', credentials)
        if (user) _saveLocalUser(user)
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
    } catch (err) {
        console.error('Failed to logout', err)
        throw err
    }
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}