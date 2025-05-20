
import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';

export function Home({ onSetPage }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

   
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="home">
          <h1>Welcome to Mister Toy</h1>
          <p>Your one-stop shop for amazing toys!</p>
          
          <div className="home-nav-icons">
            <div className="nav-icon" onClick={() => onSetPage('dashboard')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span>Dashboard</span>
            </div>
            <div className="nav-icon" onClick={() => onSetPage('toys')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <span>Toys</span>
            </div>
            <div className="nav-icon" onClick={() => onSetPage('about')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span>About</span>
            </div>
          </div>
          
          <div className="home-banner">
            <img src="/images/toys-store-banner.jpeg" alt="Toy Store Banner" />
          </div>
          
          <div className="home-info">
            <h2>Why Choose Mister Toy?</h2>
            <div className="features">
              <div className="feature">
                <h3>Quality Toys</h3>
                <p>We offer the best quality toys from around the world.</p>
              </div>
              <div className="feature">
                <h3>Great Prices</h3>
                <p>Competitive prices on all our products.</p>
              </div>
              <div className="feature">
                <h3>Fast Shipping</h3>
                <p>Quick delivery to your doorstep.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}