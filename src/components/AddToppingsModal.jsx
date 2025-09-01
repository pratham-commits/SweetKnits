import React, { useState, useMemo, useEffect } from 'react';
import { PlusIcon, TrashIcon } from './Icons';

export default function AddToppingsModal({ isOpen, onClose, onSubmit, saleItem, toppings }) {
  const [selectedToppings, setSelectedToppings] = useState({});
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);

  const basePrice = useMemo(() => {
    if (!saleItem) return 0;
    if (saleItem.isOrder) return saleItem.price;
    return saleItem.price * saleItem.quantity;
  }, [saleItem]);

  const calculatedTotal = useMemo(() => {
    const toppingsTotal = Object.values(selectedToppings).reduce((total, topping) => {
      return total + (topping.price * topping.quantity);
    }, 0);
    return basePrice + toppingsTotal;
  }, [selectedToppings, basePrice]);

  // When the modal opens or the calculated total changes, update the final total
  // unless the user is actively editing the price.
  useEffect(() => {
    if (!isEditingPrice) {
      setFinalTotal(calculatedTotal);
    }
  }, [calculatedTotal, isEditingPrice, isOpen]);

  const handleAddTopping = (topping) => {
    setIsEditingPrice(false); // Reset price editing when the order changes
    const newSelection = { ...selectedToppings };
    if (newSelection[topping.id]) {
      newSelection[topping.id].quantity += 1;
    } else {
      newSelection[topping.id] = { name: topping.name, price: topping.price, quantity: 1 };
    }
    setSelectedToppings(newSelection);
  };
  
  const handleRemoveTopping = (toppingId) => {
    setIsEditingPrice(false); // Reset price editing when the order changes
    const newSelection = { ...selectedToppings };
    delete newSelection[toppingId];
    setSelectedToppings(newSelection);
  };

  const handleFinalizeSale = () => {
    if(finalTotal < 0 || isNaN(finalTotal)) {
        alert("Please enter a valid final price.");
        return;
    }
    const toppingsArray = Object.values(selectedToppings).map(t => ({ name: t.name, price: t.price, quantity: t.quantity }));
    onSubmit(toppingsArray, finalTotal);
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedToppings({});
    setIsEditingPrice(false);
    onClose();
  };

  if (!isOpen || !saleItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-background-beige p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col" style={{ height: '90vh' }}>
        <h2 className="text-2xl font-bold text-text-dark mb-4">Add Toppings (Optional)</h2>
        <p className="text-text-light mb-6">Select toppings to add to <span className="font-semibold">{saleItem.isOrder ? saleItem.name : `${saleItem.quantity}x ${saleItem.name}`}</span>.</p>
        
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Left: Available Toppings */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg mb-2">Available Toppings</h3>
            <div className="flex-grow space-y-2 overflow-y-auto pr-2">
              {toppings.map(topping => (
                <div key={topping.id} className="bg-white p-3 rounded-lg flex justify-between items-center shadow-sm">
                  <div>
                    <p className="font-semibold">{topping.name}</p>
                    <p className="text-sm text-text-light">₹{topping.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleAddTopping(topping)} className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600"><PlusIcon /></button>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Selected Toppings */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg mb-2">Added Toppings</h3>
            <div className="flex-grow space-y-2 overflow-y-auto pr-2 bg-white p-3 rounded-lg">
              {Object.keys(selectedToppings).length > 0 ? Object.entries(selectedToppings).map(([id, topping]) => (
                <div key={id} className="flex justify-between items-center gap-2">
                  <span>{topping.quantity}x {topping.name}</span>
                  <button onClick={() => handleRemoveTopping(id)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                </div>
              )) : <p className="text-text-light text-center">No toppings added yet.</p>}
            </div>
          </div>
        </div>

        {/* --- RESPONSIVE FOOTER WITH EDITABLE PRICE --- */}
        <div className="mt-6 pt-4 border-t border-soft-pink flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-md font-semibold text-text-light">Calculated Total: ₹{calculatedTotal.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-1">
                <label htmlFor="final-price" className="text-xl font-bold text-text-dark">Final Total: ₹</label>
                <input 
                  id="final-price"
                  type="number"
                  value={finalTotal.toFixed(2)}
                  onChange={(e) => setFinalTotal(Number(e.target.value))}
                  onFocus={() => setIsEditingPrice(true)}
                  className="text-xl font-bold text-text-dark bg-transparent border-b-2 border-accent-pink w-28 focus:outline-none"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <button type="button" onClick={handleFinalizeSale} className="w-full sm:w-auto px-8 py-3 bg-accent-pink text-white font-bold text-lg rounded-lg hover:bg-pink-500">Finalize Sale</button>
        </div>
      </div>
    </div>
  );
}

