import React from 'react';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';

export default function ToppingList({ toppings, onAddTopping, onEditTopping, onDeleteTopping }) {
  return (
    <div className="bg-widget-beige p-6 rounded-lg shadow-md flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text-dark">Toppings</h2>
        <button
          onClick={onAddTopping}
          className="flex items-center px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-200"
        >
          <PlusIcon />
          <span className="ml-2 sm:hidden lg:inline">Add Topping</span>
        </button>
      </div>
      <div className="space-y-3 overflow-y-auto flex-grow" style={{maxHeight: '400px'}}>
        {toppings.length > 0 ? (
          toppings.map((topping) => (
            <div key={topping.id} className="bg-background-beige p-4 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <p className="font-bold text-text-dark">{topping.name}</p>
                <p className="text-sm text-text-light">₹{parseFloat(topping.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                 <button 
                  onClick={() => onEditTopping(topping)}
                  className="p-2 text-text-light hover:text-text-dark transition-colors"
                  aria-label={`Edit ${topping.name}`}
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => onDeleteTopping(topping.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  aria-label={`Delete ${topping.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-light text-center py-4">No toppings yet. Click "Add Topping" to get started!</p>
        )}
      </div>
    </div>
  );
}

