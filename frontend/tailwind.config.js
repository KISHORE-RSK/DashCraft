/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f8f4eb',
          100: '#efe5d2',
          200: '#dec8b1',
          300: '#caa386',
          400: '#b88562',
          500: '#a56c43',
          600: '#8f5734',
          700: '#754629',
          800: '#613c24',
          900: '#4d311f',
          950: '#261910',
        },
        olive: {
          50: '#f0f3eb',
          100: '#e1e7d5',
          200: '#c4cdb1',
          300: '#a2af88',
          400: '#819363',
          500: '#667846',
          600: '#4f5e34',
          700: '#3d4a29',
          800: '#333d24',
          900: '#2a331f',
          950: '#151c0e',
        }
      }
    },
  },
  plugins: [],
}
