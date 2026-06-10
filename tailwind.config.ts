import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        pixel: '0 0 0 3px rgba(42, 39, 63, .9), 8px 8px 0 rgba(42, 39, 63, .18)',
        glow: '0 0 35px rgba(255, 149, 188, .38)',
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        scan: 'scan 4s linear infinite',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -14px, 0)' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 48px' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
