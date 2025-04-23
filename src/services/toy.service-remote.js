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

function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
    // return axios.get(BASE_URL, {params: { filterBy, sortBy, pageIdx }})
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
        sortBy: ''
    }
}
// function getDefaultFilter() {
//     return {
//         txt: '',
//         inStock: null,
//         labels: [],
//         pageIdx: 0,
//     }
// }



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

// function getEmptyToy() {
//     return {
//         name: '',
//         price: 0,
//         labels: [],
//         inStock: true,
//         imgUrl: 'https://cdn.pixabay.com/photo/2017/07/28/18/33/toy-2549394_1280.jpg',
//         createdAt: Date.now()
//     }
// }