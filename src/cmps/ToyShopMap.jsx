import React, { useState } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { mapService } from "../services/map.service"

const API_KEY = 'AIzaSyC48KHXzvS7FKnBhuufT1Gux66i5WbC0gU'

const mapContainerStyle = {
  width: '100%',
  height: '50vh'
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
}

export function ToyShopMap() {
  const branchData = mapService.getBranches()
  const [selectedBranch, setSelectedBranch] = useState(branchData[0])
  const [activeMarker, setActiveMarker] = useState(null)
  const [center, setCenter] = useState(mapService.getDefaultCenter())
  const zoom = 11

  const handleBranchClick = (branch) => {
    setCenter(branch.location)
    setSelectedBranch(branch)
  }

  const handleMarkerClick = (branch) => {
    setActiveMarker(branch.id)
    setSelectedBranch(branch)
  }

  return (
    <div className="toy-shop-map-container">
      <h2>Our Toy Shop Branches</h2>
      
      <div className="branch-buttons">
        {branchData.map(branch => (
          <button 
            key={branch.id}
            className={`branch-button ${selectedBranch && selectedBranch.id === branch.id ? 'selected' : ''}`}
            onClick={() => handleBranchClick(branch)}
          >
            {branch.name}
          </button>
        ))}
      </div>
      
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
        >
          {branchData.map(branch => (
            <Marker
              key={branch.id}
              position={branch.location}
              onClick={() => handleMarkerClick(branch)}
            />
          ))}
          
          {activeMarker && (
            <InfoWindow
              position={branchData.find(b => b.id === activeMarker).location}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div>
                <h3>{branchData.find(b => b.id === activeMarker).name}</h3>
                <p>{branchData.find(b => b.id === activeMarker).address}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      {selectedBranch && (
        <div className="branch-info">
          <h3>{selectedBranch.name} Branch Information</h3>
          <div className="branch-details">
            <p><strong>Address:</strong> {selectedBranch.address}</p>
            <p><strong>Phone:</strong> {selectedBranch.phone}</p>
            <p><strong>Hours:</strong> {selectedBranch.hours}</p>
          </div>
        </div>
      )}
    </div>
  )
}