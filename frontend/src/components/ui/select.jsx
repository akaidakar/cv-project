// frontend/src/components/ui/select.jsx
import React from 'react';

export const Select = ({ options, onChange }) => { // Change to named export
  return (
    <select onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// If you want to keep the default export as well, you can do:
export default Select;