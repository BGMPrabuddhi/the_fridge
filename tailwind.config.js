/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': 'rgb(4, 4, 64)',
        'button-blue': '#3c82cd',
        'button-blue-hover': '#0250a3'
      },
      boxShadow: {
        'form': '0 1px 4px rgba(0, 0, 0, 0.2)',
        'button': '0 3px 6px rgba(0, 0, 0, 0.3)'
      }
    },
  },
  plugins: [],
}