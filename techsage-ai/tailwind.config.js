/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean:  '#1E40AF', // Deep, trusted bank blue (Replaces Forest)
        wave:   '#3B82F6', // Soft, friendly bright blue (Replaces Sage)
        amber:  '#F59E0B', // Warm highlight for tips
        caution:'#E9C46A',
        danger: '#D62828',
        warm:   '#FDFAF6',
        muted:  '#6B7280',
        ink:    '#1A1A1A',
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}