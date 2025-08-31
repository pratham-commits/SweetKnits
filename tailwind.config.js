/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-beige': '#FFF7F0', // A very light, warm beige for the page background
        'widget-beige': '#FFEFE0',    // A slightly darker beige for cards/widgets
        'soft-pink': '#FADADD',       // A gentle pink for highlights
        'accent-pink': '#F472B6',      // A stronger pink for buttons and important elements
        'text-dark': '#4E443C',        // A dark, warm brown for text
        'text-light': '#7E7267',       // A lighter brown for secondary text
      }
    },
  },
  plugins: [],
}
