import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        hitam: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ba038', // Brand green from CDC HITAM
          500: '#3b832b',
          600: '#2d6821',
          700: '#1b5e20', // Institutional forest green
          800: '#16481a',
          900: '#0f3312',
          950: '#061a08',
        },
        slate: {
          850: '#151e2e',
          900: '#0f172a',
          925: '#0b1120',
          950: '#070b14',
        },
        brand: {
          accent: '#f59e0b', // Amber highlight for prizes/pitch
          emerald: '#10b981',
          cyan: '#06b6d4',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(75, 160, 56, 0.25)',
        'glow-md': '0 0 35px -5px rgba(75, 160, 56, 0.35)',
        'glow-accent': '0 0 30px -5px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
