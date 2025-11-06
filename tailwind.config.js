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
        dark: {
          bg: '#1E1E1E',
          surface: '#282828',
          sidebar: '#1A1A1A',
          border: '#3C3C3C',
          hover: '#353535',
          text: '#E8E8E8',
          'text-secondary': '#B4B4B4',
        },
      },
    },
  },
  plugins: [],
};
