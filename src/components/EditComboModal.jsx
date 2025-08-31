import React, { useState, useEffect } from 'react';

export default function EditComboModal({ isOpen, onClose, onSubmit, combo }) {
  const [comboName, setComboName] = useState('');
  const [comboProducts, setComboProducts] = useState({});
  const [price, setPrice] = useState('');

  // When the modal opens, populate the form with the combo's current data
  useEffect(() => {
    if (combo) {
      setComboName(combo.name);
      // Convert the products array into the same { productId: { name, quantity } } format
      const productsMap = combo.products.reduce((acc, p) => {
        acc[p.productId] = { name: p.name, quantity: p.quantity };
        return acc;
      }, {});
      setComboProducts(productsMap);
      setPrice(combo.price);
    }
  }, [combo]);

  const handleQuantityChange = (productId, quantity) => {
    const newQuantity = Math.max(1, Number(quantity));
    setComboProducts({
      ...comboProducts,
      [productId]: { ...comboProducts[productId], quantity: newQuantity },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comboName.trim()) {
        alert("Please enter a name for the combo.");
        return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      alert("Please enter a valid price for the combo.");
      return;
    }
    
    const updatedProductsArray = Object.entries(comboProducts).map(([id, data]) => ({
        productId: id,
        name: data.name,
        quantity: data.quantity
    }));

    onSubmit(combo.id, { name: comboName, products: updatedProductsArray, price: Number(price) });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-background-beige p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-text-dark mb-4">Edit Combo</h2>
          <div className="mb-4">
            <label htmlFor="edit-combo-name" className="block text-text-light font-semibold mb-2">Combo Name</label>
            <input id="edit-combo-name" type="text" value={comboName} onChange={(e) => setComboName(e.target.value)} className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink" required />
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
            <h3 className="font-semibold text-text-dark">Products in Combo</h3>
            {Object.entries(comboProducts).map(([productId, data]) => (
              <div key={productId} className="bg-white p-3 rounded-lg flex justify-between items-center">
                <span className="font-semibold text-text-dark">{data.name}</span>
                <input
                  type="number"
                  min="1"
                  value={data.quantity}
                  onChange={(e) => handleQuantityChange(productId, e.target.value)}
                  className="w-20 px-2 py-1 border border-soft-pink rounded-md text-center"
                />
              </div>
            ))}
          </div>
          <div className="mb-6">
            <label htmlFor="edit-combo-price" className="block text-text-light font-semibold mb-2">Price (₹)</label>
            <input id="edit-combo-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink" required min="0.01" step="0.01" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-accent-pink text-white font-semibold rounded-lg hover:bg-pink-500 transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
