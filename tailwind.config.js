/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#FF1C1C',
          'red-dark': '#CC0000',
          blue: '#3B4CCA',
          'blue-dark': '#2A3A9A',
          yellow: '#FFDE00',
          'yellow-dark': '#CCAB00',
          white: '#FFFFFF',
          black: '#212121',
          'gray-light': '#F5F5F5',
          'gray-medium': '#CCCCCC',
          'gray-dark': '#666666',
        },
        type: {
          normal: '#A8A878',
          fire: '#F08030',
          water: '#6890F0',
          electric: '#F8D030',
          grass: '#78C850',
          ice: '#98D8D8',
          fighting: '#C03028',
          poison: '#A040A0',
          ground: '#E0C068',
          flying: '#A890F0',
          psychic: '#F85888',
          bug: '#A8B820',
          rock: '#B8A038',
          ghost: '#705898',
          dragon: '#7038F8',
          dark: '#705848',
          steel: '#B8B8D0',
          fairy: '#EE99AC',
        }
      },
      fontFamily: {
        'pokemon': ['Pokemon Solid', 'system-ui', 'sans-serif'],
        'pokemon-text': ['Open Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pokeball': "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSIjRkYxQzFDIi8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzIwMCAxNTUuMjI4IDE1NS4yMjggMjAwIDEwMCAyMDBTMCAxNTUuMjI4IDAgMTAwaDIwMFoiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIzMCIgZmlsbD0iIzIxMjEyMSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPgo=')",
        'gradient-pokemon': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-pokeball': 'linear-gradient(135deg, #ff1c1c 0%, #ffde00 100%)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}