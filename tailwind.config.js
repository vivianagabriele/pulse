/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f8',
          100: '#ffe6ef',
          500: '#FF3CAC',
          600: '#FB1583',
        },
      },
      boxShadow: {
        glow: '0 10px 30px rgba(255, 60, 172, 0.18)',
      },
    },
  },
  plugins: [],
};