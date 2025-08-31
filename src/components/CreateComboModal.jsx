import React, { useState, useMemo } from 'react';

export default function CreateComboModal({ isOpen, onClose, onSubmit, products, stalls }) {
  const [comboName, setComboName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({});
  const [price, setPrice] = useState('');
  const [selectedStall, setSelectedStall] = useState(stalls[0]);
  const [step, setStep] = useState(1); // 1 for stall, 2 for products, 3 for final details

  // Filter products based on the selected stall for Step 2
  const availableProducts = useMemo(() => {
    return products.filter(p => p.stall === selectedStall);
  }, [products, selectedStall]);

  const handleNextStep = (nextStep) => {
    if (nextStep === 3 && Object.keys(selectedProducts).length === 0) {
      alert("Please select at least one product for the combo.");
      return;
    }
    setStep(nextStep);
  };
  
  const handleProductToggle = (product) => {
    const existing = selectedProducts[product.id];
    const newSelection = { ...selectedProducts };
    if (existing) {
      delete newSelection[product.id];
    } else {
      newSelection[product.id] = { name: product.name, quantity: 1 };
    }
    setSelectedProducts(newSelection);
  };

  const handleQuantityChange = (productId, quantity) => {
    const newQuantity = Math.max(1, Number(quantity));
    setSelectedProducts({
      ...selectedProducts,
      [productId]: { ...selectedProducts[productId], quantity: newQuantity },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comboName.trim() || !price || isNaN(price) || Number(price) <= 0) {
      alert("Please enter a valid combo name and price.");
      return;
    }
    
    const comboProducts = Object.entries(selectedProducts).map(([id, data]) => ({
        productId: id,
        name: data.name,
        quantity: data.quantity
    }));

    onSubmit({ name: comboName, products: comboProducts, price: Number(price), stall: selectedStall });
    resetAndClose();
  };
  
  const resetAndClose = () => {
    setComboName('');
    setSelectedProducts({});
    setPrice('');
    setSelectedStall(stalls[0]);
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-text-dark mb-4">Create a New Combo</h2>
              <p className="text-text-light mb-6">First, select which stall this combo belongs to.</p>
              <div className="mb-6">
                <label htmlFor="combo-stall-select" className="block text-text-light font-semibold mb-2">Stall</label>
                <select id="combo-stall-select" value={selectedStall} onChange={(e) => setSelectedStall(e.target.value)} className="w-full px-4 py-2 border border-soft-pink rounded-lg bg-white" required>
                  {stalls.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                 <button type="button" onClick={resetAndClose} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Cancel</button>
                 <button type="button" onClick={() => handleNextStep(2)} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Next</button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-text-dark mb-4">Select Products</h2>
              <p className="text-text-light mb-6">Now, choose products from the <span className="font-semibold">{selectedStall}</span> stall.</p>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                {availableProducts.map(product => (
                  <div key={product.id} className="bg-white p-3 rounded-lg flex justify-between items-center">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={!!selectedProducts[product.id]} onChange={() => handleProductToggle(product)} className="h-5 w-5 rounded text-accent-pink focus:ring-accent-pink"/>
                      <span className="font-semibold text-text-dark">{product.name}</span>
                    </label>
                    {selectedProducts[product.id] && (
                      <input type="number" min="1" value={selectedProducts[product.id].quantity} onChange={(e) => handleQuantityChange(product.id, e.target.value)} className="w-20 px-2 py-1 border rounded-md text-center"/>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-4">
                 <button type="button" onClick={() => setStep(1)} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Back</button>
                 <button type="button" onClick={() => handleNextStep(3)} className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">Fix Price</button>
              </div>
            </div>
          )}

          {step === 3 && (
             <div>
              <h2 className="text-2xl font-bold text-text-dark mb-4">Set Combo Name & Price</h2>
               <div className="mb-4">
                  <label htmlFor="combo-name" className="block text-text-light font-semibold mb-2">Combo Name</label>
                  <input id="combo-name" type="text" value={comboName} onChange={(e) => setComboName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
               </div>
               <div className="mb-6">
                  <label htmlFor="combo-price" className="block text-text-light font-semibold mb-2">Price (₹)</label>
                  <input id="combo-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required min="0.01" step="0.01" />
               </div>
               <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400">Back</button>
                  <button type="submit" className="px-6 py-2 bg-accent-pink text-white font-semibold rounded-lg hover:bg-pink-500">Create Combo</button>
               </div>
             </div>
          )}
        </form>
      </div>
    </div>
  );
}

