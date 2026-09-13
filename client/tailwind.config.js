/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kingBlue: '#0B2D6B',
        kingPurple: '#5B2BE0',
        kingPink: '#FF4FA3',
        kingYellow: '#FFC300',
        kingWhite: '#FFFFFF',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0B2D6B 0%, #5B2BE0 45%, #FF4FA3 80%, #FFC300 100%)',
      }
    },
  },
  plugins: [],
}
