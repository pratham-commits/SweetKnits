import React, { useState, useMemo } from 'react';
import { PlusIcon, TrashIcon, SearchIcon } from './Icons';

export default function CreateOrderModal({ isOpen, onClose, onSubmit, products, combos, stalls }) {
  const [orderItems, setOrderItems] = useState({});
  const [selectedStall, setSelectedStall] = useState(stalls[0]);
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Combine products and combos and then filter by search term
  const availableItems = useMemo(() => {
    const stallProducts = products.filter(p => p.stall === selectedStall);
    const stallCombos = combos.filter(c => c.stall === selectedStall);
    const allItems = [...stallProducts, ...stallCombos];
    
    if (!searchTerm) {
      return allItems;
    }
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, combos, selectedStall, searchTerm]);

  const orderTotal = useMemo(() => {
    return Object.values(orderItems).reduce((total, { item, quantity }) => {
      return total + item.price * quantity;
    }, 0);
  }, [orderItems]);

  const handleAddItem = (item) => {
    const newOrderItems = { ...orderItems };
    const existingItemKey = Object.keys(newOrderItems).find(key => newOrderItems[key].item.id === item.id);
    if (existingItemKey) {
      newOrderItems[existingItemKey].quantity += 1;
    } else {
      newOrderItems[`${item.id}-${Date.now()}`] = { item, quantity: 1 };
    }
    setOrderItems(newOrderItems);
  };

  const handleQuantityChange = (key, quantity) => {
    const newQuantity = Math.max(1, Number(quantity));
    setOrderItems({ ...orderItems, [key]: { ...orderItems[key], quantity: newQuantity } });
  };
  
  const handleRemoveItem = (key) => {
    const newOrderItems = { ...orderItems };
    delete newOrderItems[key];
    setOrderItems(newOrderItems);
  };

  const handleSubmitOrder = () => {
    if (Object.keys(orderItems).length === 0) {
      alert("Please add at least one item to the order.");
      return;
    }
    onSubmit(orderItems, orderTotal, selectedStall);
    resetAndClose();
  };

  const resetAndClose = () => {
    setOrderItems({});
    setSelectedStall(stalls[0]);
    setSearchTerm('');
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-2xl m-4 flex flex-col" style={{ height: '90vh' }}>
        {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-text-dark mb-4">Create New Order</h2>
              <p className="text-text-light mb-6">First, select the stall for this order.</p>
              <div className="mb-6">
                <label htmlFor="order-stall-select" className="block text-text-light font-semibold mb-2">Stall</label>
                <select id="order-stall-select" value={selectedStall} onChange={(e) => setSelectedStall(e.target.value)} className="w-full px-4 py-2 border border-soft-pink rounded-lg bg-white" required>
                  {stalls.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                 <button type="button" onClick={resetAndClose} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Cancel</button>
                 <button type="button" onClick={() => setStep(2)} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Next</button>
              </div>
            </div>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-text-dark mb-4">Build Order for <span className="text-accent-pink">{selectedStall}</span></h2>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              {/* Left Side: Available Items */}
              <div className="flex flex-col">
                <div className="relative mb-2">
                   <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                   <input
                     type="text"
                     placeholder="Search items..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="bg-white border border-soft-pink text-text-dark text-sm rounded-lg pl-10 p-2.5 shadow-sm w-full"
                   />
                </div>
                <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                  {availableItems.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-lg flex justify-between items-center shadow-sm">
                      <div>
                        <p className="font-semibold">{item.name} {item.products && <span className="text-xs text-blue-500 font-normal">(Combo)</span>}</p>
                        <p className="text-sm text-text-light">₹{item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => handleAddItem(item)} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"><PlusIcon /></button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right Side: Current Order */}
              <div className="flex flex-col">
                <h3 className="font-bold text-lg mb-2">Current Order</h3>
                <div className="flex-grow space-y-2 overflow-y-auto pr-2 bg-white p-3 rounded-lg">
                  {Object.keys(orderItems).length > 0 ? Object.entries(orderItems).map(([key, { item, quantity }]) => (
                    <div key={key} className="flex justify-between items-center gap-2">
                      <span className="flex-grow">{item.name} {item.products && <span className="text-xs text-blue-500 font-normal">(Combo)</span>}</span>
                      <input type="number" min="1" value={quantity} onChange={(e) => handleQuantityChange(key, e.target.value)} className="w-16 text-center border rounded-md" />
                      <button onClick={() => handleRemoveItem(key)} className="p-1 text-red-500 hover:text-red-700"><TrashIcon /></button>
                    </div>
                  )) : <p className="text-text-light text-center">Add items from the left.</p>}
                </div>
              </div>
            </div>
            {/* --- RESPONSIVE FOOTER (FIXED) --- */}
            <div className="mt-6 pt-4 border-t border-soft-pink flex flex-col sm:flex-row justify-between items-center gap-4">
              <button type="button" onClick={() => setStep(1)} className="w-full sm:w-auto px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Back</button>
              <div className="text-center sm:text-right">
                <p className="text-xl font-bold text-text-dark">Total: ₹{orderTotal.toFixed(2)}</p>
              </div>
              <button type="button" onClick={handleSubmitOrder} className="w-full sm:w-auto px-8 py-3 bg-accent-pink text-white font-bold text-lg rounded-lg hover:bg-pink-500">Finalize Sale</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

