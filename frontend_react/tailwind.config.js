/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        ocean: {
          primary: '#2563EB',
          secondary: '#F59E0B',
          bg: '#f9fafb',
          surface: '#ffffff',
          text: '#111827',
          muted: '#6b7280'
        }
      }
    }
  },
  plugins: []
};
