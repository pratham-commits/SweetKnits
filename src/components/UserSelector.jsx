import React from 'react';
import { UserIcon } from './Icons.jsx';

export default function UserSelector({ users, currentUser, onSelectUser }) {
  return (
    <div className="bg-widget-beige p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-text-dark mb-4">Select User</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {users.map((user) => (
          <button
            key={user}
            onClick={() => onSelectUser(user)}
            className={`flex items-center justify-center p-3 rounded-lg font-semibold transition-all duration-200 shadow-sm
              ${currentUser === user
                ? 'bg-accent-pink text-white ring-2 ring-pink-300'
                : 'bg-soft-pink text-text-dark hover:bg-pink-200'
              }`}
          >
            <UserIcon />
            {user}
          </button>
        ))}
      </div>
    </div>
  );
}

