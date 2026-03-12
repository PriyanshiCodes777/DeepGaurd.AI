/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#7c3aed',
          600: '#6d28d9',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(124, 58, 237, 0.35)',
      },
    },
  },
  plugins: [],
};
