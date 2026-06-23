export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@vite-pwa/nuxt',
    '@nuxtjs/supabase',
  ],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/',
      exclude: ['/login'],
    },
  },

  css: ['~/assets/styles/main.css'],

  app: {
    head: {
      title: '花寓 — YU Florist 職人平台',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
        },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  googleFonts: {
    families: {
      'Noto Sans TC': [400, 500, 700],
    },
    display: 'swap',
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '花寓職人平台',
      short_name: '花寓',
      description: 'YU Florist 手作職人管理平台',
      theme_color: '#5C3344',
      background_color: '#FAF6F0',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      navigateFallback: '/',
    },
  },
})
