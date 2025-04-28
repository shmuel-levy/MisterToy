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
    getLabels,
    getLabelStats,
    getPriceStats,
    getInventoryStats
}

function query(filterBy = getDefaultFilter()) {
    const { sortBy, pageIdx, ...filterParams } = filterBy;
    
    const params = {
        filterBy: JSON.stringify(filterParams),
        pageIdx
    };
    
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

function getLabelStats() {
    return query()
        .then(response => {
            const toys = response.toys || []
            const labelCountMap = _getToyCountByLabelMap(toys)
            
            const data = Object.keys(labelCountMap)
                .map(label => ({
                    title: label,
                    value: Math.round((labelCountMap[label] / toys.length) * 100)
                }))
            
            return data
        })
}

function getPriceStats() {
    return query()
        .then(response => {
            const toys = response.toys || []
            const priceByLabelMap = _getAvgPriceByLabelMap(toys)
            
            const data = Object.keys(priceByLabelMap)
                .map(label => ({
                    title: label,
                    value: priceByLabelMap[label]
                }))
            
            return data
        })
}

function getInventoryStats() {
    return query()
        .then(response => {
            const toys = response.toys || []
            const inStockByLabelMap = _getInStockPercentageByLabelMap(toys)
            
            const data = Object.keys(inStockByLabelMap)
                .map(label => ({
                    title: label,
                    value: inStockByLabelMap[label]
                }))
            
            return data
        })
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

function _getToyCountByLabelMap(toys) {
    const toyCountByLabelMap = {}
    labels.forEach(label => toyCountByLabelMap[label] = 0)
    
    toys.forEach(toy => {
        if (toy.labels && Array.isArray(toy.labels)) {
            toy.labels.forEach(label => {
                if (toyCountByLabelMap.hasOwnProperty(label)) {
                    toyCountByLabelMap[label]++
                }
            })
        }
    })
    
    return toyCountByLabelMap
}

function _getAvgPriceByLabelMap(toys) {
    const labelPriceSums = {}
    const labelCounts = {}
    labels.forEach(label => {
        labelPriceSums[label] = 0
        labelCounts[label] = 0
    })
    
    toys.forEach(toy => {
        if (toy.labels && Array.isArray(toy.labels) && toy.price) {
            const price = parseFloat(toy.price)
            if (!isNaN(price)) {
                toy.labels.forEach(label => {
                    if (labelPriceSums.hasOwnProperty(label)) {
                        labelPriceSums[label] += price
                        labelCounts[label]++
                    }
                })
            }
        }
    })
    
    const avgPriceByLabelMap = {}
    labels.forEach(label => {
        avgPriceByLabelMap[label] = labelCounts[label] > 0 
            ? Math.round(labelPriceSums[label] / labelCounts[label]) 
            : 0
    })
    
    return avgPriceByLabelMap
}

function _getInStockPercentageByLabelMap(toys) {
    const inStockCounts = {}
    const totalCounts = {}
    labels.forEach(label => {
        inStockCounts[label] = 0
        totalCounts[label] = 0
    })
    
    toys.forEach(toy => {
        if (toy.labels && Array.isArray(toy.labels)) {
            toy.labels.forEach(label => {
                if (totalCounts.hasOwnProperty(label)) {
                    totalCounts[label]++
                    if (toy.inStock) {
                        inStockCounts[label]++
                    }
                }
            })
        }
    })
    
    const inStockPercentageByLabelMap = {}
    labels.forEach(label => {
        inStockPercentageByLabelMap[label] = totalCounts[label] > 0 
            ? Math.round((inStockCounts[label] / totalCounts[label]) * 100) 
            : 0
    })
    
    return inStockPercentageByLabelMap
}