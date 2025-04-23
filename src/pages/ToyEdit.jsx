import { useState, useEffect } from 'react';
import { toyService } from '../services/toy.service.js';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges.js';

export function ToyEdit({ toyId, onSaveToy, onCancel }) {
  const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy());
  const [originalToy, setOriginalToy] = useState(null);
  const [labels, setLabels] = useState([]);
  const [isModified, setIsModified] = useState(false);
  
  // Use our custom hook
  const showUnsavedChangesPrompt = useUnsavedChanges(isModified);

  useEffect(() => {
    loadLabels();
    if (toyId) loadToy();
  }, []);
  
  // Check for modifications
  useEffect(() => {
    if (!originalToy) return;
    
    // Compare current state with original
    const isChanged = JSON.stringify(toyToEdit) !== JSON.stringify(originalToy);
    setIsModified(isChanged);
  }, [toyToEdit, originalToy]);

  function loadToy() {
    try {
      const toy = toyService.getById(toyId);
      setToyToEdit(toy);
      setOriginalToy(JSON.parse(JSON.stringify(toy))); // Deep copy
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

  function handleCancel() {
    if (isModified) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    onCancel();
  }

  function onSubmitForm(ev) {
    ev.preventDefault();
    
    try {
      const savedToy = toyService.save(toyToEdit);
      setIsModified(false);
      onSaveToy(savedToy);
    } catch (err) {
      console.error('Error saving toy:', err);
    }
  }

  return (
    <section className="toy-edit">
      <h2>{toyToEdit._id ? 'Edit Toy' : 'Add Toy'}</h2>
      
      {showUnsavedChangesPrompt && (
        <div className="unsaved-changes-alert">
          You have unsaved changes!
        </div>
      )}
      
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
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
}