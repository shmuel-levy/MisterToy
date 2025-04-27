import { httpService } from './http.service'

const BASE_URL = 'toy/'
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptyToy,
    getDefaultFilter,
    getLabels
}

function query(filterBy = getDefaultFilter()) {
    // Converting the filterBy object into a format the backend expects
    // The backend expects filterBy and sortBy as separate parameters
    const { sortBy, pageIdx, ...filterParams } = filterBy;
    
    // Convert objects to JSON strings for HTTP parameters
    const params = {
        filterBy: JSON.stringify(filterParams),
        pageIdx
    };
    
    // Add sortBy if it exists
    if (sortBy && sortBy.type) {
        params.sortBy = JSON.stringify(sortBy);
    }
    
    return httpService.get(BASE_URL, params);
}

function getById(toyId) {
    return httpService.get(BASE_URL + toyId)
}

function remove(toyId) {
    return httpService.delete(BASE_URL + toyId)
}

function save(toy) {
    const method = toy._id ? 'put' : 'post'
    return httpService[method](BASE_URL, toy)
}

function getLabels() {
    return [...labels]
}

function getDefaultFilter() {
    return {
        txt: '',
        inStock: null,
        labels: [],
        sortBy: { type: '', desc: false },
        pageIdx: 0
    }
}

function getEmptyToy() {
    return {
        name: '',
        price: '',
        labels: _getRandomLabels(),
        inStock: true
    }
}

function _getRandomLabels() {
    const labelsCopy = [...labels]
    const randomLabels = []
    for (let i = 0; i < 2; i++) {
        const randomIdx = Math.floor(Math.random() * labelsCopy.length)
        randomLabels.push(labelsCopy.splice(randomIdx, 1)[0])
    }
    return randomLabels
}