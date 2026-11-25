// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { fr } from 'vuetify/locale'



const defaultTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF', // F8FAFC
    surface: '#FFFFFF',
    primary: '#fff4f2',      // fff4f2 , # ff8c4b, fc5739 , #1E40AF #fed8c4 Bleu profond : confiance et autorité
    primary_darken_1: '#ffac7d', 
    primary_darken_2: '#ffc9a1',
    'primary-darken-3': '#ffe9dc',
    secondary: '#ff5a2c',    //  #fc5739 F59E0B 10B981 #ff5a2c
    accent: '#F59E0B',       // Ambre : énergie et motivation
    error: '#EF4444',
    info: '#3B82F6',
    success: '#22C55E',
    warning: '#F59E0B',
  },
}



const darkTheme = {
  dark: true,
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#3B82F6',      // Bleu plus lumineux pour le mode sombre
    secondary: '#10B981',
    accent: '#FCD34D',
    error: '#F87171',
  },
}

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
        defaultTheme: 'defaultTheme',
        themes: {
          defaultTheme,
          darkTheme,
        },
        // Génère automatiquement des variantes claires/sombres pour vos couleurs
        variations: {
          colors: ['primary', 'secondary'],
          lighten: 2,
          darken: 2,
        },
    },
     locale: {
      locale: 'fr',
      messages: { fr },
    },
  })
  app.vueApp.use(vuetify)
})
