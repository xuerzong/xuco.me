const color = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

const bgGridPlugin = plugin(({ addUtilities }) => {
  addUtilities({
    '.bg-grid': {
      'background-size': '32px 32px',
      'background-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.05)' stroke-dasharray='5 3'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    },
    '.bg-grid-dark': {
      'background-size': '32px 32px',
      'background-image': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(248 250 252 / 0.05)' stroke-dasharray='5 3'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
    },
    '.bg-grid-fade-out': {
      'mask-image': 'linear-gradient(#000, #000, transparent)',
      '-webkit-mask-image': 'linear-gradient(#000, #000, transparent)',
    },
  })
})

module.exports = {
  darkMode: 'class',
  content: ['app/**/*.tsx', 'components/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary-color))',
          foreground: 'var(--primary-foreground-color)',
        },
        dark: '#000000',
      },

      fontFamily: {
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },

      gridTemplateColumns: {
        'only-content': 'auto',
        'content-toc': 'auto 20rem',
      },

      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-pre-bg': color.gray['50'],
          },
        },
      },

      transitionProperty: {
        height: 'height',
      },
    },
  },

  plugins: [bgGridPlugin],
}
