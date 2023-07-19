/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1677ff',
        'gray-light': '#F6F6F6',
        secondary: '#666666',
        danger: 'var(--adm-color-danger)'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false // <== disable this!
  }
}
