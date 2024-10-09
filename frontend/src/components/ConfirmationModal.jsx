import React from 'react';
import { Button } from './ui/button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{description}</p>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={onConfirm} variant="destructive">Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;