import React from 'react';
import { TrashIcon, EditIcon } from './Icons';

// A simple download icon for the button
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export default function SalesLog({ 
  sales, 
  users, 
  stalls, 
  onDelete, 
  onEdit, 
  userFilter, 
  onUserFilterChange, 
  stallFilter, 
  onStallFilterChange,
  onDownloadPDF
}) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="bg-widget-beige p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-text-dark">Recent Sales</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Filters */}
          <div>
            <label htmlFor="sales-user-filter" className="text-sm font-medium text-text-light mr-2">User:</label>
            <select id="sales-user-filter" value={userFilter} onChange={(e) => onUserFilterChange(e.target.value)} className="bg-white border border-soft-pink text-text-dark text-sm rounded-lg p-2 shadow-sm w-full">
              <option value="All Users">All Users</option>
              {users.map(user => <option key={user} value={user}>{user}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sales-stall-filter" className="text-sm font-medium text-text-light mr-2">Stall:</label>
            <select id="sales-stall-filter" value={stallFilter} onChange={(e) => onStallFilterChange(e.target.value)} className="bg-white border border-soft-pink text-text-dark text-sm rounded-lg p-2 shadow-sm w-full">
              <option value="All Stalls">All Stalls</option>
              {stalls.map(stall => <option key={stall} value={stall}>{stall}</option>)}
            </select>
          </div>
          {/* PDF Download Button */}
          <button onClick={onDownloadPDF} className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors">
            <DownloadIcon />
            Download PDF
          </button>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sales.length > 0 ? (
          sales.map((sale) => (
            <div key={sale.id} className="bg-background-beige p-4 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                {sale.isOrder ? (
                  <>
                    <p className="font-bold text-text-dark">Custom Order</p>
                    <ul className="text-sm text-text-light list-disc list-inside ml-4">
                      {sale.orderItems.map((item, index) => <li key={index}>{item.quantity}x {item.name}</li>)}
                    </ul>
                    <p className="font-semibold text-text-dark mt-1">Total: ₹{sale.price.toFixed(2)}</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-text-dark">{sale.quantity}x {sale.productName}</p>
                    <p className="font-semibold text-text-dark mt-1">Total: ₹{sale.price.toFixed(2)}</p>
                  </>
                )}
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                  <span>Sold by: <span className="font-semibold">{sale.soldBy}</span></span>
                  <span>|</span>
                  <span>{formatTimestamp(sale.timestamp)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => onEdit(sale)} className="p-2 text-text-light hover:text-text-dark" aria-label={`Edit sale`} disabled={sale.isOrder}><EditIcon /></button>
                <button onClick={() => onDelete(sale.id)} className="p-2 text-red-400 hover:text-red-600" aria-label={`Delete sale`}><TrashIcon /></button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-light text-center py-4">No sales found for this filter.</p>
        )}
      </div>
    </div>
  );
}

