import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // This is a simple, hardcoded password.
    // In a real-world production app, you would use a more secure authentication service.
    if (password === 'SweetKnits2025') {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="bg-background-beige min-h-screen flex items-center justify-center">
      <div className="bg-widget-beige p-10 rounded-lg shadow-2xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-text-dark mb-2">Sweetknits Sales</h1>
        <p className="text-center text-text-light mb-8">Please log in to continue</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-text-light font-semibold mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-soft-pink rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-pink"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-accent-pink text-white font-bold rounded-lg hover:bg-pink-500 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

