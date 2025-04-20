import { useState, useEffect } from 'react';
import { toyService } from '../services/toy.service.js';

export function ToyEdit({ toyId, onSaveToy, onCancel }) {
  const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy());
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    loadLabels();
    if (toyId) loadToy();
  }, []);

  function loadToy() {
    try {
      const toy = toyService.getById(toyId);
      setToyToEdit(toy);
    } catch (err) {
      console.error('Error loading toy for edit:', err);
      onCancel();
    }
  }

  function loadLabels() {
    const labels = toyService.getLabels();
    setLabels(labels);
  }

  function handleChange({ target }) {
    const { name, value, type, checked } = target;
    
    // Handle different input types
    const val = type === 'number' ? +value : 
               type === 'checkbox' ? checked : 
               value;
    
    setToyToEdit(prevToy => ({ ...prevToy, [name]: val }));
  }

  function handleLabelChange(selectedLabel) {
    const updatedLabels = [...toyToEdit.labels];
    const labelIndex = updatedLabels.indexOf(selectedLabel);
    
    if (labelIndex === -1) {
      updatedLabels.push(selectedLabel);
    } else {
      updatedLabels.splice(labelIndex, 1);
    }
    
    setToyToEdit(prevToy => ({
      ...prevToy,
      labels: updatedLabels
    }));
  }

  function onSubmitForm(ev) {
    ev.preventDefault();
    
    try {
      const savedToy = toyService.save(toyToEdit);
      onSaveToy(savedToy);
    } catch (err) {
      console.error('Error saving toy:', err);
    }
  }

  return (
    <section className="toy-edit">
      <h2>{toyToEdit._id ? 'Edit Toy' : 'Add Toy'}</h2>
      
      <form onSubmit={onSubmitForm}>
        <div className="form-group">
          <label htmlFor="name">Toy Name:</label>
          <input 
            type="text"
            id="name"
            name="name"
            value={toyToEdit.name}
            onChange={handleChange}
            required
            placeholder="Enter toy name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input 
            type="number"
            id="price"
            name="price"
            value={toyToEdit.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="imgUrl">Image URL:</label>
          <input 
            type="text"
            id="imgUrl"
            name="imgUrl"
            value={toyToEdit.imgUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
          {toyToEdit.imgUrl && (
            <div className="img-preview">
              <img src={toyToEdit.imgUrl} alt="Toy preview" />
            </div>
          )}
        </div>
        
        <div className="form-group checkbox">
          <label>
            <input 
              type="checkbox"
              name="inStock"
              checked={toyToEdit.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>
        </div>
        
        <div className="form-group">
          <label>Labels:</label>
          <div className="labels-selection">
            {labels.map(label => (
              <label key={label} className="label-checkbox">
                <input 
                  type="checkbox"
                  checked={toyToEdit.labels.includes(label)}
                  onChange={() => handleLabelChange(label)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
}