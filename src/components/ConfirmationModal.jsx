import React from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-sm m-4 text-center">
        <h2 className="text-2xl font-bold text-text-dark mb-4">{title}</h2>
        <p className="text-text-light mb-8">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
