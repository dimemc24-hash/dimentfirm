/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        'fresh-blue': '#3B82F6',
        'warm-amber': '#F59E0B',
        'soft-green': '#10B981',
        'gentle-purple': '#8B5CF6',

        // Semantic dark-mode-aware colors via CSS custom properties
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
          elevated: 'var(--color-surface-elevated)',
        },
        on: {
          DEFAULT: 'var(--color-on-surface)',
          muted: 'var(--color-on-muted)',
          faint: 'var(--color-on-faint)',
        },
        edge: {
          DEFAULT: 'var(--color-edge)',
          subtle: 'var(--color-edge-subtle)',
        },

        // Firm mascot colors
        'turtle-green': 'var(--color-turtle-green)',
        'turtle-green-light': 'var(--color-turtle-green-light)',
        'turtle-brown': 'var(--color-turtle-brown)',
        'turtle-shell': 'var(--color-turtle-shell)',
        'hare-orange': 'var(--color-hare-orange)',
        'hare-orange-light': 'var(--color-hare-orange-light)',
        'hare-brown': 'var(--color-hare-brown)',
        'hare-cream': 'var(--color-hare-cream)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
