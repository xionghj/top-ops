/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    borderRadius: {
      DEFAULT: '3px',
      'full': '9999px',
    }
  },
  plugins: [],
}
