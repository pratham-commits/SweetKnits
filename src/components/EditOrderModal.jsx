import React, { useState, useEffect, useMemo } from 'react';
import { TrashIcon } from './Icons.jsx';

export default function EditOrderModal({ isOpen, onClose, onSubmit, sale }) {
  const [orderItems, setOrderItems] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);

  // When the modal opens, populate it with the sale's current data
  useEffect(() => {
    if (sale && sale.isOrder) {
      setOrderItems(sale.orderItems || []);
      setFinalPrice(sale.price || 0);
    }
  }, [sale]);

  const calculatedTotal = useMemo(() => {
    return orderItems.reduce((total, item) => {
      // The price of each item was saved, so we can recalculate
      return total + (item.price * item.quantity);
    }, 0);
  }, [orderItems]);

  const handleQuantityChange = (index, quantity) => {
    const newQuantity = Math.max(1, Number(quantity));
    const newItems = [...orderItems];
    newItems[index].quantity = newQuantity;
    setOrderItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(finalPrice) || Number(finalPrice) < 0) {
        alert("Please enter a valid final price.");
        return;
    }
    onSubmit(sale.id, orderItems, Number(finalPrice));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold text-text-dark mb-6">Edit Custom Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4 bg-white p-3 rounded-lg">
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center gap-2">
                <span className="flex-grow">{item.name}</span>
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity} 
                  onChange={(e) => handleQuantityChange(index, e.target.value)} 
                  className="w-20 text-center border rounded-md"
                />
              </div>
            ))}
          </div>
          
          <p className="text-sm text-text-light text-right mb-2">Recalculated Total: ₹{calculatedTotal.toFixed(2)}</p>

          <div className="mb-6">
            <label htmlFor="final-order-price" className="block text-text-light font-semibold mb-2">Final Price (₹)</label>
            <input
              id="final-order-price"
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg font-bold text-lg"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-accent-pink text-white font-semibold rounded-lg hover:bg-pink-500">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
