export const mapService = {
    getBranches,
    getBranchInfo,
    getDefaultCenter,
    getDirections
}

function getBranches() {
    return [
        {
            id: 'tel-aviv',
            name: 'Tel Aviv',
            location: { lat: 32.0853, lng: 34.7818 },
            address: '123 Dizengoff St., Tel Aviv',
            phone: '03-1234567',
            hours: 'Sun-Thu: 9am-9pm, Fri: 9am-3pm, Sat: Closed'
        },
        {
            id: 'hadera',
            name: 'Hadera',
            location: { lat: 32.4340, lng: 34.9196 },
            address: '45 HaNasi St., Hadera',
            phone: '04-7654321',
            hours: 'Sun-Thu: 10am-8pm, Fri: 9am-2pm, Sat: Closed'
        },
        {
            id: 'bat-yam',
            name: 'Bat Yam',
            location: { lat: 32.0171, lng: 34.7457 },
            address: '78 Ha-Atzmaut Blvd., Bat Yam',
            phone: '03-9876543',
            hours: 'Sun-Thu: 8am-8pm, Fri: 8am-2pm, Sat: Closed'
        }
    ]
}

function getBranchInfo(branchId) {
    const branches = getBranches()
    return branches.find(branch => branch.id === branchId) || null
}

function getDefaultCenter() {
    return { lat: 32.0853, lng: 34.7818 }
}

function getDirections(userLocation, destinationBranchId) {
    const branches = getBranches()
    const destinationBranch = branches.find(branch => branch.id === destinationBranchId)
    
    if (!userLocation || !destinationBranch) return null
    
    return {
        origin: userLocation,
        destination: destinationBranch.location,
        distance: _calculateMockDistance(userLocation, destinationBranch.location),
        estimatedTime: _calculateMockTravelTime(userLocation, destinationBranch.location)
    }
}

function _calculateMockDistance(origin, destination) {
    const R = 6371e3 
    const phi1 = origin.lat * Math.PI/180
    const phi2 = destination.lat * Math.PI/180
    const deltaPhi = (destination.lat - origin.lat) * Math.PI/180
    const deltaLambda = (destination.lng - origin.lng) * Math.PI/180

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c 
    
    return (d / 1000).toFixed(1) 
}

function _calculateMockTravelTime(origin, destination) {
    const distance = _calculateMockDistance(origin, destination)
    const timeInHours = distance / 50
    const timeInMinutes = Math.round(timeInHours * 60)
    
    return timeInMinutes
}