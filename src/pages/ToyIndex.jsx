import { useState, useEffect } from 'react';
import { ToyList } from '../cmps/ToyList.jsx';
import { toyService } from '../services/toy.service.js';

export function ToyIndex() {
    const [toys, setToys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        loadToys();
    }, []);
    
    function loadToys() {
        setIsLoading(true);
        
        try {
            const toysFromService = toyService.query();
            setToys(toysFromService);
        } catch (err) {
            console.error('Error loading toys:', err);
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <section className="toy-index">
            <div className="index-header">
                <h1>Our Toy Collection</h1>
                <button className="btn-add">Add New Toy</button>
            </div>
            
            {isLoading && <div className="loading">Loading...</div>}
            
            <ToyList toys={toys} />
        </section>
    );
}