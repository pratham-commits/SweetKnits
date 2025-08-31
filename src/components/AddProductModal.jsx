import React, { useState } from 'react';

export default function AddProductModal({ isOpen, onClose, onSubmit, stalls }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stall, setStall] = useState(stalls[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price || isNaN(price) || Number(price) <= 0 || !stall) {
      alert("Please enter a valid name, price, and select a stall.");
      return;
    }
    onSubmit({ name, price: Number(price), stall });
    
    setName('');
    setPrice('');
    setStall(stalls[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Added `relative` class here to fix the dropdown z-index issue */}
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-md m-4 relative">
        <h2 className="text-2xl font-bold text-text-dark mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="product-stall" className="block text-text-light font-semibold mb-2">Stall</label>
            <select
              id="product-stall"
              value={stall}
              onChange={(e) => setStall(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink bg-white"
              required
            >
              {stalls.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="product-name" className="block text-text-light font-semibold mb-2">Product Name</label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="product-price" className="block text-text-light font-semibold mb-2">Price (₹)</label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
              required
              min="0.01"
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
              className="px-6 py-2 bg-accent-pink text-white font-semibold rounded-lg hover:bg-pink-500 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

