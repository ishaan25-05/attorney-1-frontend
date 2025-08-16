/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'legal': {
          'charcoal': '#0F0E0E',
          'dark': '#1C1A1A',
          'brown': '#4A3C35',
          'medium': '#7C5F4C',
          'light': '#B8916D',
          'tan': '#E5C9A1',
        }
      }
    },
  },
  plugins: [],
};
