/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#AB0908',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FED7D7',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#AB0908',
          800: '#7F0605',
          900: '#5C0504',
        },
      },
    },
  },
  plugins: [],
};
