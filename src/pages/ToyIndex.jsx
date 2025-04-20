import { useState, useEffect } from 'react';
import { ToyList } from '../cmps/ToyList.jsx';
import { ToyFilter } from '../cmps/ToyFilter.jsx';
import { toyService } from '../services/toy.service.js';

export function ToyIndex({ onSelectToy, onAddToy }) {
    const [toys, setToys] = useState([]);
    const [filterBy, setFilterBy] = useState(toyService.getDefaultFilter());
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        loadToys();
    }, [filterBy]);
    
    function loadToys() {
        setIsLoading(true);
        
        try {
            const toysFromService = toyService.query(filterBy);
            setToys(toysFromService);
        } catch (err) {
            console.error('Error loading toys:', err);
        } finally {
            setIsLoading(false);
        }
    }
    
    function onSetFilter(filterBy) {
        setFilterBy(filterBy);
    }
    
    function onRemoveToy(toyId) {
        try {
            toyService.remove(toyId);
            setToys(prevToys => prevToys.filter(toy => toy._id !== toyId));
        } catch (err) {
            console.error('Error removing toy:', err);
        }
    }
    
    return (
        <section className="toy-index">
            <div className="index-header">
                <h1>Our Toy Collection</h1>
                <button className="btn-add" onClick={onAddToy}>Add New Toy</button>
            </div>
            
            <ToyFilter onSetFilter={onSetFilter} />
            
            {isLoading && <div className="loading">Loading...</div>}
            
            <ToyList 
                toys={toys} 
                onRemoveToy={onRemoveToy} 
                onSelectToy={onSelectToy} 
            />
        </section>
    );
}