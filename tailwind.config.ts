import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        hana: {
          header: '#5C3344',
          'header-light': '#7A4558',
          cream: '#FAF6F0',
          wine: '#4A2032',
          gold: '#8B6914',
          card: '#FFFFFF',
          text: '#3D2B1F',
          muted: '#8C7B75',
          success: '#5B8C5A',
          warning: '#D4A017',
          danger: '#C0392B',
          border: '#E8DDD5',
        },
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'PingFang TC', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
} satisfies Config
