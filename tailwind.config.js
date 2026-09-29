/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        auris: {
          cyan: '#00e5ff',
          blue: '#0070f3',
          dark: '#0a0f18',
          panel: 'rgba(10, 15, 24, 0.85)',
          border: 'rgba(0, 229, 255, 0.25)',
          warning: '#ffb703',
          hazard: '#ef233c',
          success: '#06d6a0',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
