import React from 'react';
import Navigation from './Navigation';

export default function Layout({ activeTab, onTabChange, children }) {
  return (
    <div className="bg-background-beige min-h-screen text-text-dark font-sans flex">
      {/* The Navigation component will render the sidebar for desktop */}
      <Navigation activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Add padding to the bottom to avoid being obscured by the mobile nav bar */}
          <div className="pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>

      {/* The Navigation component will also render the bottom bar for mobile */}
    </div>
  );
}

