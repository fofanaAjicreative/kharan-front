// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true ,
  imports: {
    dirs: [
      // Indique à Nuxt d'auto-importer tous les fichiers exportés dans ce dossier
      'enums',// Ou avec sous-dossiers : 'enums/**'
    ]
  },
  // components: [
  //   {
  //     path: '~/components/espace',
  //     pathPrefix: false, // Empêche de devoir préfixer par "Espace"
  //   },
  //   '~/components'
  // ],
  modules: [
            // '@nuxt/fonts',
             '@pinia/nuxt',
             '@vueuse/nuxt'
            ],
  css: [
          '~/assets/styles/main.scss',
          '~/assets/styles/fonts.css',
      ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
      plugins: [
        vuetify({ autoImport: true }),
      ],
      vue: {
        template: {
          transformAssetUrls,
        },
      },
      css :{ // for variables usage
        preprocessorOptions :{
          scss :{
            additionalData: '@use "~/assets/styles/variables/_main.scss" as *;',
          }
        }
      }
  },
  routeRules: {
    '/': {  appLayout:'default' }, 
    '/login/**': { appLayout: 'auth' },
    '/register/**': { appLayout: 'auth' },
    '/espace-coach/**': { appLayout: 'coach' },
    '/messagerie/**': { appLayout: 'chat' },
    '/espace-client/**': { appLayout: 'client' },
    '/admin/**': { appLayout: 'admin' },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'https://apikharan.laabal.com/api/',
      socketUrl:'https://apikharan.laabal.com',
      // apiBaseUrl: 'http://localhost:5000/api/',
      // socketUrl:'http://localhost:5000',
      pushPublicKey:'BPpdK-_1J1FBP8lr1ZlutnYrEpt848PMV6N6o23x6UXaLDC582DKTONCG8yiIWUEJcWqv3B9pN1SF6Al8F9lPX8'
    },
  },
  app:{
    head: { 
      script: [
        // { src: 'https://meet.laabal.com/external_api.js', defer: true }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
        },
      ],
    }
  },

  devServer: {
    host: '0.0.0.0', // or 'localhost', or a custom domain
    port: 3000
  }

  

})
