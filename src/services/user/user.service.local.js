import { storageService } from '../async-storage.service.js'
import { utilService } from '../util.service.js'
import { socketService } from '../socket.service.js' 

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USER_DB = 'userDB'


_createUsers()

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    update,
    getEmptyCredentials
}


function _createUsers() {
    let users = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_DB))
    if (!users || !users.length) {
        users = [
            {
                _id: 'u101',
                username: 'admin',
                password: '1234',
                fullname: 'Admin User',
                score: 100,
                isAdmin: true
            },
            {
                _id: 'u102',
                username: 'user1',
                password: '1234',
                fullname: 'Regular User',
                score: 50,
                isAdmin: false
            }
        ]
        localStorage.setItem(STORAGE_KEY_USER_DB, JSON.stringify(users))
    }
    
   
    storageService.query('user').then(storedUsers => {
        if (!storedUsers || !storedUsers.length) {
            storageService.postMany('user', users)
        }
    })
}

async function getUsers() {
    try {
        return await storageService.query('user')
    } catch (err) {
        console.error('Failed to get users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        return await storageService.get('user', userId)
    } catch (err) {
        console.error(`Failed to get user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
 
        const userToSave = {
            _id: user._id,
            fullname: user.fullname,
            score: user.score || 0,
            isAdmin: user.isAdmin
        }
        
        const updatedUser = await storageService.put('user', userToSave)
        
        if (getLoggedinUser()?._id === user._id) {
            saveLocalUser(updatedUser)
        }
        
        return updatedUser
    } catch (err) {
        console.error(`Failed to update user ${user._id}`, err)
        throw err
    }
}

async function login(credentials) {
    try {
        const users = await storageService.query('user')
        const user = users.find(user => 
            user.username === credentials.username && 
            user.password === credentials.password
        )
        
        if (!user) throw new Error('Invalid username or password')
 
        const userWithoutPassword = { ...user }
        delete userWithoutPassword.password
        
        saveLocalUser(userWithoutPassword)
       
        setTimeout(() => socketService.login(user._id), 100)
        
        return userWithoutPassword
    } catch (err) {
        console.error('Failed to login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
      
        const users = await storageService.query('user')
        const existingUser = users.find(user => user.username === credentials.username)
        if (existingUser) throw new Error('Username already taken')
        
        const newUser = {
            _id: utilService.makeId(),
            username: credentials.username,
            password: credentials.password,
            fullname: credentials.fullname,
            score: 0,
            isAdmin: false
        }
        
        const addedUser = await storageService.post('user', newUser)
        
      
        const userWithoutPassword = { ...addedUser }
        delete userWithoutPassword.password
        
        saveLocalUser(userWithoutPassword)
       
        setTimeout(() => socketService.login(newUser._id), 100)
        
        return userWithoutPassword
    } catch (err) {
        console.error('Failed to signup', err)
        throw err
    }
}

async function logout() {
    try {
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
    user = { 
        _id: user._id, 
        fullname: user.fullname, 
        isAdmin: user.isAdmin, 
        score: user.score || 0 
    }
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