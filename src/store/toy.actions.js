import { toyService } from '../services/toy.service.js'
import { SET_TOYS, REMOVE_TOY, ADD_TOY, UPDATE_TOY, SET_FILTER_BY } from './toy.reducer.js'

export function loadToys(filterBy) {
    return dispatch => {
        try {
            const toys = toyService.query(filterBy)
            dispatch({ type: SET_TOYS, toys })
        } catch (err) {
            console.error('Error loading toys:', err)
            throw err
        }
    }
}

export function removeToy(toyId) {
    return dispatch => {
        try {
            toyService.remove(toyId)
            dispatch({ type: REMOVE_TOY, toyId })
        } catch (err) {
            console.error('Error removing toy:', err)
            throw err
        }
    }
}

export function saveToy(toy) {
    return dispatch => {
        const actionType = toy._id ? UPDATE_TOY : ADD_TOY
        
        try {
            const savedToy = toyService.save(toy)
            dispatch({ type: actionType, toy: savedToy })
            return savedToy
        } catch (err) {
            console.error('Error saving toy:', err)
            throw err
        }
    }
}

export function setFilterBy(filterBy) {
    return dispatch => {
        dispatch({ type: SET_FILTER_BY, filterBy })
    }
}