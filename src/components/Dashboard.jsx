import React, { useMemo } from 'react';

export default function Dashboard({ sales, stalls }) {
  const stats = useMemo(() => {
    // Initialize a revenue counter for each stall
    const revenueByStall = stalls.reduce((acc, stall) => {
      acc[stall] = 0;
      return acc;
    }, {});

    let totalRevenue = 0;
    let totalItemsSold = 0;

    sales.forEach(sale => {
      // Use the final price recorded in the sale document
      const saleTotal = sale.price;
      totalRevenue += saleTotal;

      // Add revenue to the correct stall
      if (revenueByStall[sale.stall] !== undefined) {
        revenueByStall[sale.stall] += saleTotal;
      }
      
      // Calculate total items sold, accounting for combos and orders
      if (sale.isOrder) {
        totalItemsSold += sale.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      } else if (sale.isCombo) {
        const comboItemCount = sale.comboProducts.reduce((sum, p) => sum + p.quantity, 0);
        totalItemsSold += comboItemCount * sale.quantity;
      } else {
        totalItemsSold += sale.quantity;
      }
    });

    return { totalRevenue, totalItemsSold, revenueByStall };
  }, [sales, stalls]);

  return (
    <div className="bg-widget-beige p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-soft-pink p-4 rounded-lg">
          <p className="text-sm font-semibold text-text-light">Total Revenue</p>
          <p className="text-3xl font-bold text-text-dark">₹{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-soft-pink p-4 rounded-lg">
          <p className="text-sm font-semibold text-text-light">Total Items Sold</p>
          <p className="text-3xl font-bold text-text-dark">{stats.totalItemsSold}</p>
        </div>
        <div className="bg-soft-pink p-4 rounded-lg">
          <p className="text-sm font-semibold text-text-light">Revenue by Stall</p>
          <div className="text-md font-bold text-text-dark mt-2 space-y-1">
            {Object.entries(stats.revenueByStall).map(([stall, revenue]) => (
              <p key={stall}>{stall}: ₹{revenue.toFixed(2)}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

