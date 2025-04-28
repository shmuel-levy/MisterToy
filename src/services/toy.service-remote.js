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

// Stats Functions for Dashboard
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

// Helper Functions
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
    // First initialize with all labels at 0
    const toyCountByLabelMap = {}
    labels.forEach(label => toyCountByLabelMap[label] = 0)
    
    // Count toys by label
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
    // First initialize price sums and counts for all labels
    const labelPriceSums = {}
    const labelCounts = {}
    labels.forEach(label => {
        labelPriceSums[label] = 0
        labelCounts[label] = 0
    })
    
    // Add up prices and counts by label
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
    
    // Calculate averages
    const avgPriceByLabelMap = {}
    labels.forEach(label => {
        avgPriceByLabelMap[label] = labelCounts[label] > 0 
            ? Math.round(labelPriceSums[label] / labelCounts[label]) 
            : 0
    })
    
    return avgPriceByLabelMap
}

function _getInStockPercentageByLabelMap(toys) {
    // First initialize in-stock and total counts for all labels
    const inStockCounts = {}
    const totalCounts = {}
    labels.forEach(label => {
        inStockCounts[label] = 0
        totalCounts[label] = 0
    })
    
    // Count in-stock and total toys by label
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
    
    // Calculate percentages
    const inStockPercentageByLabelMap = {}
    labels.forEach(label => {
        inStockPercentageByLabelMap[label] = totalCounts[label] > 0 
            ? Math.round((inStockCounts[label] / totalCounts[label]) * 100) 
            : 0
    })
    
    return inStockPercentageByLabelMap
}