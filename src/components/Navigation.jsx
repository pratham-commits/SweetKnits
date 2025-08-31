import React from 'react';

const SalesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const ManageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-8-2.5a2.5 2.5 0 015 0m-5 0V19a2 2 0 002 2h2a2 2 0 002-2v-2.5m-10 0V19a2 2 0 002 2h2a2 2 0 002-2v-2.5" /></svg>;

export default function Navigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'sales', name: 'Sales', icon: <SalesIcon /> },
    { id: 'manage', name: 'Manage', icon: <ManageIcon /> },
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
  ];

  const commonButtonClasses = "flex items-center justify-center md:justify-start w-full p-3 my-1 rounded-lg font-semibold transition-colors duration-200";
  const activeClasses = "bg-accent-pink text-white";
  const inactiveClasses = "hover:bg-soft-pink text-text-dark";

  return (
    <>
      {/* --- Bottom Tab Bar for Mobile --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-widget-beige border-t border-soft-pink flex justify-around shadow-lg z-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-2 w-full ${activeTab === tab.id ? 'text-accent-pink' : 'text-text-light'}`}
          >
            {tab.icon}
            <span className="text-xs">{tab.name}</span>
          </button>
        ))}
      </nav>

      {/* --- Sidebar for Desktop --- */}
      <aside className="hidden md:flex flex-col w-64 bg-widget-beige border-r border-soft-pink p-4">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-text-dark">Sweetknits Sales</h1>
        </div>
        <nav>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${commonButtonClasses} ${activeTab === tab.id ? activeClasses : inactiveClasses}`}
            >
              {tab.icon}
              <span className="ml-3">{tab.name}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

