import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

export function MaterialUi({ labels, selectedLabels, onLabelSelect }) {
  return (
    <div className="material-ui-container">
      <Autocomplete
        multiple
        id="toy-labels-autocomplete"
        options={labels}
        value={selectedLabels}
        onChange={(event, newValue) => {
          onLabelSelect(newValue)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Toy Labels"
            placeholder="Select labels"
          />
        )}
        sx={{ width: '100%', marginBottom: 2 }}
      />
    </div>
  )
}