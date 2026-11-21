/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        night: {
          DEFAULT: '#1B1A33',
          deep: '#121126',
          soft: '#2A2949'
        },
        turmeric: {
          DEFAULT: '#E8A33D',
          light: '#F3C474',
          dark: '#C7822A'
        },
        sage: {
          DEFAULT: '#7C9C7A',
          light: '#A6C2A4',
          dark: '#5C7C5A'
        },
        terracotta: {
          DEFAULT: '#D9714E',
          light: '#E89A7E',
          dark: '#B8543A'
        },
        sandstone: {
          DEFAULT: '#F3EBDD',
          dim: '#EAE0CC'
        },
        ink: '#232024'
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.18)', opacity: '0.9' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        breathe: 'breathe 8s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite'
      },
      boxShadow: {
        'glow-turmeric': '0 0 50px -10px rgba(232,163,61,0.45)',
        'glow-turmeric-lg': '0 0 90px -12px rgba(232,163,61,0.5)',
        'glow-sage': '0 0 50px -10px rgba(124,156,122,0.4)',
        'glow-terracotta': '0 0 50px -10px rgba(217,113,78,0.4)',
        card: '0 10px 40px -14px rgba(0,0,0,0.55)',
        'card-hover': '0 16px 50px -12px rgba(0,0,0,0.6)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.06)'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3C474 0%, #E8A33D 55%, #C7822A 100%)',
        'sage-gradient': 'linear-gradient(135deg, #A6C2A4 0%, #7C9C7A 60%, #5C7C5A 100%)',
        'terracotta-gradient': 'linear-gradient(135deg, #E89A7E 0%, #D9714E 60%, #B8543A 100%)',
        'mesh-hero': 'radial-gradient(at 15% 10%, rgba(232,163,61,0.16) 0px, transparent 45%), radial-gradient(at 85% 15%, rgba(124,156,122,0.14) 0px, transparent 45%), radial-gradient(at 50% 90%, rgba(217,113,78,0.10) 0px, transparent 50%)',
        shimmer: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)'
      }
    }
  },
  plugins: []
}
