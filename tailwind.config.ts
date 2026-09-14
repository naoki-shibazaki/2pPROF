import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"DotGothic16"', 'monospace'],
      },
      colors: {
        retro: {
          sky:        '#5BA3D9',
          'sky-light':'#87CEEB',
          ground:     '#3a7a34',
          navy:       '#1a1a4e',
          'navy-mid': '#3a3a7e',
          blue:       '#6060cc',
          cream:      '#f0efe8',
          'tab-bar':  '#c0c0d8',
          'tab-off':  '#9090b0',
          gold:       '#ffd700',
          'win-blue': '#000080',
          shadow:     '#0a0a2e',
        },
      },
      boxShadow: {
        pixel:        '2px 2px 0 0 #0a0a2e',
        'pixel-lg':   '4px 4px 0 0 #0a0a2e',
        'pixel-window': 'inset 0 0 0 2px #6060cc, 4px 4px 0 0 #0a0a2e',
        'win95-raised':
          'inset -1px -1px 0 #0a0a2e, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf',
        'win95-sunken':
          'inset 1px 1px 0 #0a0a2e, inset -1px -1px 0 #ffffff, inset 2px 2px 0 #808080, inset -2px -2px 0 #dfdfdf',
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'cursor-blink': 'blink 0.8s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
