/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warna Brand BeliSenang.com
        'bs-yellow': '#facc15',
        'bs-red': '#ef4444',
        'bs-blue': '#3b82f6',
        'bs-peach': '#ffedd5',
        'bs-dark': '#1a1a1a',
      },
      boxShadow: {
        // Shadow kaku khas Neo-Brutalism
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
        'brutal-xl': '16px 16px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
      },
      animation: {
        // Memindahkan animasi marquee ke config agar CSS lebih bersih
        'marquee-fast': 'marquee 15s linear infinite',
        'marquee-slow': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}