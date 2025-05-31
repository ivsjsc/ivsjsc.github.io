/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./src/**/*.{html,js}",
    "./header.html",
    "./news-archive.html" // Thêm các file HTML khác nếu cần
  ],
  theme: {
    extend: {
      colors: {
        'ivs-primary': '#1D4ED8',
        'ivs-secondary': '#FBBF24',
        'ivs-orange-500': '#F97316',
        'ivs-gray-700': '#374151',
        'ivs-text-white': '#FFFFFF',
        'ivs-neutral-600': '#4B5563',
        'ivs-blue-400': '#60A5FA',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}