import { useState, useEffect } from 'react';
import { toyService } from '../services/toy.service.js';

export function ToyFilter({ onSetFilter }) {
    const [filterBy, setFilterBy] = useState(toyService.getDefaultFilter());
    const [labels, setLabels] = useState([]);
    
    useEffect(() => {
        setLabels(toyService.getLabels());
    }, []);
    
    useEffect(() => {
        onSetFilter(filterBy);
    }, [filterBy]);
    
    function handleChange({ target }) {
        const { name, value, type } = target;
        
        let updatedValue = value;
        if (name === 'inStock') {
            if (value === 'true') updatedValue = true;
            else if (value === 'false') updatedValue = false;
            else updatedValue = null;
        }
        
        setFilterBy(prevFilter => ({ ...prevFilter, [name]: updatedValue }));
    }
    
    function handleLabelChange(label) {
        const updatedLabels = [...filterBy.labels];
        const idx = updatedLabels.findIndex(currLabel => currLabel === label);
        
        if (idx < 0) {
            updatedLabels.push(label);
        } else {
            updatedLabels.splice(idx, 1);
        }
        
        setFilterBy(prevFilter => ({ ...prevFilter, labels: updatedLabels }));
    }
    
    return (
        <section className="toy-filter">
            <h2>Filter Toys</h2>
            <div className="filter-form-row">
                <div className="filter-form-group">
                    <label htmlFor="name-filter">By Name:</label>
                    <input 
                        type="text"
                        id="name-filter"
                        name="txt"
                        value={filterBy.txt}
                        onChange={handleChange}
                        placeholder="Search toy name..."
                    />
                </div>
                
                <div className="filter-form-group">
                    <label htmlFor="stock-filter">In Stock:</label>
                    <select 
                        id="stock-filter"
                        name="inStock"
                        value={filterBy.inStock === null ? '' : filterBy.inStock.toString()}
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="true">In Stock</option>
                        <option value="false">Out of Stock</option>
                    </select>
                </div>
                
                <div className="filter-form-group">
                    <label htmlFor="sort-by">Sort By:</label>
                    <select 
                        id="sort-by"
                        name="sortBy"
                        value={filterBy.sortBy}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="created">Created</option>
                    </select>
                </div>
            </div>
            
            <div className="labels-filter">
                <p>Filter by labels:</p>
                <div className="labels-container">
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
        </section>
    );
}