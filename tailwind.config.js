/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wood-dark': '#2C1810',
        'wood-medium': '#3C2820',
        'wood-light': '#4C3830',
        'text-light': 'rgba(255, 248, 240, 0.7)',
        'spiritual-yellow': 'rgba(255, 223, 128, 0.4)',
      },
    },
  },
  plugins: [],
}
