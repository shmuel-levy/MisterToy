import React from "react"
import { ToyShopMap } from "../cmps/ToyShopMap"
export function About() {
  return (
    <section className="about-page">
      <div className="about-container">
        <h1>About Mister Toy</h1>
        
        <div className="about-content">
          <div className="about-info">
            <h2>Welcome to Mister Toy!</h2>
            <p>
              Mister Toy has been bringing joy to children and families since 1995. 
              We pride ourselves on offering a wide selection of high-quality toys 
              that inspire creativity, learning, and fun.
            </p>
          </div>
        </div>
        
        <div className="map-section">
          <h2>Visit Us</h2>
          <p>
            We have three convenient locations across Israel. Select a branch on the 
            map below to see more information about each store.
          </p>
          
          <ToyShopMap />
        </div>
      </div>
    </section>
  )
}