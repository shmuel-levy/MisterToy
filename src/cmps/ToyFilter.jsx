import { useState, useEffect } from 'react';
import { toyService } from '../services/toy.service-remote.js';

export function ToyFilter({ onSetFilter }) {
    const [filterBy, setFilterBy] = useState(toyService.getDefaultFilter());
    const [labels, setLabels] = useState([]);
    
    useEffect(() => {
        // Load labels from service
        setLabels(toyService.getLabels());
    }, []);
    
    useEffect(() => {
        // Update parent component when filter changes
        onSetFilter(filterBy);
    }, [filterBy]);
    
    function handleChange({ target }) {
        const { name, value, type, checked } = target;
        
        const val = type === 'checkbox' ? checked : value;
        
        // Handle special case for inStock which has 3 states
        let newVal = val;
        if (name === 'inStock') {
            if (val === 'all') {
                newVal = null;
            } else if (val === 'true') {
                newVal = true;
            } else if (val === 'false') {
                newVal = false;
            }
        }
        
        setFilterBy(prevFilter => ({ ...prevFilter, [name]: newVal }));
    }
    
    function handleLabelChange(label) {
        setFilterBy(prevFilter => {
            const labels = [...prevFilter.labels];
            
            if (labels.includes(label)) {
                // Remove label if already selected
                return {
                    ...prevFilter,
                    labels: labels.filter(l => l !== label)
                };
            } else {
                // Add label
                return {
                    ...prevFilter,
                    labels: [...labels, label]
                };
            }
        });
    }
    
    function handleSortChange(e) {
        const { value } = e.target;
        let [type, desc] = value.split('|');
        desc = desc === 'true'; // Convert string to boolean
        
        setFilterBy(prevFilter => ({
            ...prevFilter,
            sortBy: { type, desc }
        }));
    }
    
    function onSubmitFilter(ev) {
        ev.preventDefault();
        onSetFilter(filterBy);
    }
    
    const { txt, inStock, sortBy } = filterBy;
    const sortValue = sortBy?.type ? `${sortBy.type}|${sortBy.desc}` : '';
    
    return (
        <section className="toy-filter">
            <form onSubmit={onSubmitFilter}>
                <div className="filter-group">
                    <input 
                        type="text"
                        name="txt"
                        value={txt}
                        onChange={handleChange}
                        placeholder="Search toys..."
                        className="search-input"
                    />
                </div>
                
                <div className="filter-group">
                    <label>
                        <select 
                            name="inStock" 
                            value={inStock === null ? 'all' : String(inStock)}
                            onChange={handleChange}
                        >
                            <option value="all">All Toys</option>
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                        </select>
                    </label>
                </div>
                
                <div className="filter-group">
                    <label>
                        <select 
                            value={sortValue}
                            onChange={handleSortChange}
                            className="sort-select"
                        >
                            <option value="">Sort By</option>
                            <option value="name|false">Name (A-Z)</option>
                            <option value="name|true">Name (Z-A)</option>
                            <option value="price|false">Price (Low-High)</option>
                            <option value="price|true">Price (High-Low)</option>
                            <option value="createdAt|true">Newest First</option>
                            <option value="createdAt|false">Oldest First</option>
                        </select>
                    </label>
                </div>
                
                <div className="filter-group">
                    <div className="labels-filter">
                        {labels.map(label => (
                            <label key={label} className="label-checkbox">
                                <input 
                                    type="checkbox"
                                    checked={filterBy.labels.includes(label)}
                                    onChange={() => handleLabelChange(label)}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
                
                <button type="submit" className="filter-button">Apply Filter</button>
            </form>
        </section>
    );
}