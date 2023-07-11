/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gray-light': '#F6F6F6'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false // <== disable this!
  }
}
