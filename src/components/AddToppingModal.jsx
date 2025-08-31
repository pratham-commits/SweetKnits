import React, { useState } from 'react';

export default function AddToppingModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price || isNaN(price) || Number(price) < 0) {
      alert("Please enter a valid topping name and price.");
      return;
    }
    onSubmit({ name, price: Number(price) });
    
    // Reset fields and close modal
    setName('');
    setPrice('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-text-dark mb-6">Add New Topping</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="topping-name" className="block text-text-light font-semibold mb-2">Topping Name</label>
            <input
              id="topping-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="topping-price" className="block text-text-light font-semibold mb-2">Price (₹)</label>
            <input
              id="topping-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
            >
              Add Topping
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

