import React from 'react';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon } from './Icons';

export default function ComboList({ 
  combos, 
  onSell, 
  onCreateCombo, 
  onEditCombo, 
  onDeleteCombo, 
  stalls, 
  filter, 
  onFilterChange,
  searchTerm,
  onSearchChange
}) {
  return (
    <div className="bg-widget-beige p-6 rounded-lg shadow-md flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-text-dark">Combos</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search combos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white border border-soft-pink text-text-dark text-sm rounded-lg pl-10 p-2.5 shadow-sm w-full sm:w-48"
            />
          </div>
          {/* Stall Filter */}
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-white border border-soft-pink text-text-dark text-sm rounded-lg p-2.5 shadow-sm w-full h-full"
          >
            <option value="All Stalls">All Stalls</option>
            {stalls.map(stall => <option key={stall} value={stall}>{stall}</option>)}
          </select>
          {/* Create Button */}
          <button
            onClick={onCreateCombo}
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200"
          >
            <PlusIcon />
            <span className="ml-2 sm:hidden lg:inline">Create Combo</span>
          </button>
        </div>
      </div>

      {/* Body - Make it scrollable */}
      <div className="space-y-3 overflow-y-auto flex-grow" style={{maxHeight: '400px'}}>
        {combos.length > 0 ? (
          combos.map((combo) => (
            <div key={combo.id} className="bg-background-beige p-4 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <p className="font-bold text-text-dark">{combo.name}</p>
                <div className="text-sm text-text-light">
                  {combo.products.map(p => `${p.quantity}x ${p.name}`).join(', ')}
                </div>
                <p className="font-semibold text-text-dark mt-1">₹{parseFloat(combo.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                 <button 
                  onClick={() => onEditCombo(combo)}
                  className="p-2 text-text-light hover:text-text-dark transition-colors"
                  aria-label={`Edit ${combo.name}`}
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => onDeleteCombo(combo.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  aria-label={`Delete ${combo.name}`}
                >
                  <TrashIcon />
                </button>
                <button
                  onClick={() => onSell(combo)}
                  className="px-5 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Sell
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-light text-center py-4">No combos found.</p>
        )}
      </div>
    </div>
  );
}

