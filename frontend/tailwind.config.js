/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        elder: {
          bg: '#f8fafc',
          card: '#ffffff',
          primary: '#0f3c5f',
          primaryHover: '#0b2d48',
          secondary: '#1e293b',
          accent: '#0284c7',
          accentLight: '#e0f2fe',
          safe: '#16a34a',
          safeBg: '#f0fdf4',
          warn: '#d97706',
          warnBg: '#fffbeb',
          danger: '#dc2626',
          dangerBg: '#fef2f2'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
