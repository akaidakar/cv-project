// frontend/src/components/ui/select.jsx
import React from 'react';

export const Select = ({ children, onChange, ...props }) => {
  return (
    <select onChange={onChange} {...props}>
      {children}
    </select>
  );
};

export default Select;