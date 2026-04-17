/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#05050A',
        surface: 'rgba(17, 24, 39, 0.65)',
        'surface-elevated': 'rgba(31, 41, 55, 0.85)',
        border: 'rgba(55, 65, 81, 0.6)',
        primary: '#6366F1', // Indigo
        'primary-hover': '#4F46E5',
        success: '#10B981',
        warning: '#F59E0B',
        critical: '#EF4444',
        info: '#3B82F6',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'md': '10px',
        'lg': '16px',
      }
    },
  },
  plugins: [],
}
