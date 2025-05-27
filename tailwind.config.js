/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./components/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        secondary: '#10b981'
      }
    },
  },
  plugins: [],
}