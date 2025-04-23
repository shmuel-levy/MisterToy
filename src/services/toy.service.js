import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'toyDB'

export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptyToy,
    getDefaultFilter,
    getLabels
}

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

function getLabels() {
    return [...labels]
}

function query(filterBy = getDefaultFilter()) {
    let toys = _loadToysFromStorage()
    
    if (!toys || !toys.length) {
        toys = _createToys()
        _saveToysToStorage(toys)
    }
    
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        toys = toys.filter(toy => regex.test(toy.name))
    }
    
    if (filterBy.inStock !== null) {
        toys = toys.filter(toy => toy.inStock === filterBy.inStock)
    }
    
    if (filterBy.labels && filterBy.labels.length > 0) {
        toys = toys.filter(toy => {
            return filterBy.labels.every(label => toy.labels.includes(label))
        })
    }
    
    if (filterBy.sortBy) {
        switch (filterBy.sortBy) {
            case 'name':
                toys.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'price':
                toys.sort((a, b) => a.price - b.price)
                break
            case 'created':
                toys.sort((a, b) => b.createdAt - a.createdAt)
                break
        }
    }
    
    return toys
}

function getById(toyId) {
    const toys = _loadToysFromStorage()
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) throw new Error(`Toy with id ${toyId} not found!`)
    return toy
}

function remove(toyId) {
    let toys = _loadToysFromStorage()
    toys = toys.filter(toy => toy._id !== toyId)
    _saveToysToStorage(toys)
    return toyId
}

function save(toy) {
    if (toy._id) {
        return _update(toy)
    } else {
        return _add(toy)
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        inStock: null,
        labels: [],
        sortBy: ''
    }
}

function getEmptyToy() {
    return {
        name: '',
        price: 0,
        labels: [],
        inStock: true,
        imgUrl: 'https://cdn.pixabay.com/photo/2017/07/28/18/33/toy-2549394_1280.jpg',
        createdAt: Date.now()
    }
}

function _add(toy) {
    const newToy = {
        ...toy,
        _id: utilService.makeId()
    }
    const toys = _loadToysFromStorage()
    toys.push(newToy)
    _saveToysToStorage(toys)
    return newToy
}

function _update(toy) {
    let toys = _loadToysFromStorage()
    toys = toys.map(currToy => currToy._id === toy._id ? {...toy} : currToy)
    _saveToysToStorage(toys)
    return toy
}

function _createToys() {
    return [
        {
            _id: 't101',
            name: 'Talking Doll',
            price: 123,
            labels: ['Doll', 'Battery Powered', 'Baby'],
            createdAt: 1631031801011,
            inStock: true,
            imgUrl: 'https://m.media-amazon.com/images/I/61bXwgzxR7L._AC_SL1500_.jpg',
        },
        {
            _id: 't102',
            name: 'Racing Car',
            price: 80,
            labels: ['On wheels', 'Battery Powered', 'Outdoor'],
            createdAt: 1631031801012,
            inStock: true,
            imgUrl: 'https://m.media-amazon.com/images/I/71GFzbMLDOL._AC_SL1500_.jpg',
        },
        {
            _id: 't103',
            name: 'Puzzle Game',
            price: 45,
            labels: ['Puzzle', 'Box game'],
            createdAt: 1631031801013,
            inStock: false,
            imgUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fimage-vector%2Fjigsaw-puzzle-game-kids-park-illustration-594123335&psig=AOvVaw04ZXLNacHUhn1Rf5oeI1u6&ust=1744970710043000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJik_Mzo3owDFQAAAAAdAAAAABAE',
        }
    ]
}

function _saveToysToStorage(toys) {
    storageService.saveToStorage(STORAGE_KEY, toys)
}

function _loadToysFromStorage() {
    return storageService.loadFromStorage(STORAGE_KEY) || []
}