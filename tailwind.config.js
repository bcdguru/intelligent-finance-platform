/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:   '#0E2841',
          teal:   '#156082',
          blue:   '#0F9ED5',
          cobalt: '#0961FD',
          orange: '#E97132',
          green:  '#196B24',
          lime:   '#4EA72E',
          purple: '#A02B93',
          ink:    '#001141',
          gray:   '#C1C7CD',
          silver: '#E8E8E8',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
