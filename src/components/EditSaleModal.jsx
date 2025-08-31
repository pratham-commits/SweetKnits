import React, { useState, useEffect } from 'react';

export default function EditSaleModal({ isOpen, onClose, onSubmit, sale }) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');

  // When the modal opens, populate the form with the sale's current data
  useEffect(() => {
    if (sale) {
      setQuantity(sale.quantity || 1);
      setPrice(sale.price || '');
    }
  }, [sale]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuantity = parseInt(quantity, 10);
    const newPrice = parseFloat(price);

    if (!newQuantity || newQuantity <= 0 || !newPrice || newPrice < 0) { // Allow price to be 0
      alert("Please enter a valid quantity and price.");
      return;
    }
    onSubmit(sale.id, { quantity: newQuantity, price: newPrice });
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-text-dark mb-4">Edit Sale</h2>
        <p className="text-text-light mb-6">Editing sale for: <span className="font-semibold">{sale?.productName}</span></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-quantity" className="block text-text-light font-semibold mb-2">Quantity</label>
            <input
              id="edit-quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
              required
              min="1"
            />
          </div>
           <div className="mb-6">
            <label htmlFor="edit-price" className="block text-text-light font-semibold mb-2">Price per Item (₹)</label>
            <input
              id="edit-price"
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
              className="px-6 py-2 bg-accent-pink text-white font-semibold rounded-lg hover:bg-pink-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

