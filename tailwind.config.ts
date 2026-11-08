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
        // Official Institutional Navy Palette
        navy: {
          50: '#F0F4F9',
          100: '#DDE5F0',
          200: '#BACBE1',
          300: '#94AED0',
          400: '#698DBB',
          500: '#4A72A6',
          600: '#345785',
          700: '#254064',
          800: '#1A2E49',
          900: '#0B192C', // Primary Institutional Navy
          950: '#060D17',
        },
        // Innovation Muted Teal Palette
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488', // Innovation Teal Accent
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Controlled Urgency & Prize Amber Accent
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        // Clean Institutional Canvas
        canvas: {
          DEFAULT: '#F8FAFC',
          pure: '#FFFFFF',
          subtle: '#F1F5F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F8FAFC',
        },
        // HITAM Brand aliases mapped to institutional colors
        hitam: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#0D9488',
          500: '#0F766E',
          600: '#115E59',
          700: '#0B192C',
          800: '#1A2E49',
          900: '#0B192C',
          950: '#060D17',
        },
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
        heading: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'monospace',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 1px 4px 0 rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        'elevated': '0 4px 12px -2px rgba(11, 25, 44, 0.08), 0 2px 4px -2px rgba(11, 25, 44, 0.04)',
        'modal': '0 20px 25px -5px rgba(11, 25, 44, 0.15), 0 8px 10px -6px rgba(11, 25, 44, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
