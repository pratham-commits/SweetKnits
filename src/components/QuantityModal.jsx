import React, { useState, useEffect } from 'react';

export default function QuantityModal({ isOpen, onClose, onSubmit, productName }) {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1); // Reset to 1 every time it opens
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const numQuantity = parseInt(quantity, 10);
        if (numQuantity > 0) {
            onSubmit(numQuantity);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background-beige p-6 rounded-lg shadow-xl w-full max-w-sm mx-4">
                <h3 className="text-lg font-bold text-text-dark mb-4">Enter Quantity for {productName}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-2 border border-widget-beige rounded-md text-text-dark bg-white focus:outline-none focus:ring-2 focus:ring-accent-pink"
                        min="1"
                        autoFocus
                    />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-accent-pink text-white rounded-md hover:bg-pink-500">
                            Confirm Sale
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

