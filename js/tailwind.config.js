module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary': '#004080',
        'primary-dark': '#003366',
        'secondary': '#ffc107',
        'warning': '#f59e0b',
        'header-orange': '#f97316',
        'blue': { '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8', '400': '#60A5FA' },
        'green': { '500': '#22c55e', '600': '#16a34a', '700': '#15803d', '400': '#4ADE80' },
        'amber': { '500': '#f59e0b', '600': '#d97706', '700': '#b45309' },
        'purple': { '500': '#8b5cf6', '600': '#7c3aed', '700': '#6d28d9', 'accent': '#8b5cf6' },
        'gray-50': '#f9fafb', '100': '#f3f4f6', '200': '#e5e7eb', '300': '#d1d5db',
        '400': '#9ca3af', '500': '#6b7280', '600': '#4b5563', '700': '#374151',
        '800': '#1f2937', '900': '#111827',
        'orange': { '100': '#fff7ed', '500': '#f97316', '600': '#ea580c' }
      }
    }
  },
  plugins: [] // Loại bỏ các plugin mặc định nếu đã bao gồm
}