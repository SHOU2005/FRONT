/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Emerald Theme Colors
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // PRIMARY
          600: '#059669',  // SECONDARY
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Custom theme colors for consistency
        theme: {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#34d399',
          dark: '#064e3b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #10b981, 0 0 10px #10b981' },
          '100%': { boxShadow: '0 0 20px #10b981, 0 0 30px #10b981' },
        },
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'emerald-gradient-light': 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        'emerald-gradient-subtle': 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      },
      boxShadow: {
        'emerald': '0 4px 14px 0 rgba(16, 185, 129, 0.25)',
        'emerald-lg': '0 10px 40px 0 rgba(16, 185, 129, 0.3)',
        'emerald-inner': 'inset 0 2px 4px 0 rgba(16, 185, 129, 0.1)',
      },
    },
  },
  plugins: [],
}
