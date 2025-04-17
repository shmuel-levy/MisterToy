import { createStore } from 'redux'

// Import reducers
import { toyReducer } from './toy.reducer.js'

const rootReducer = toyReducer

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined

export const store = createStore(rootReducer, middleware)