
<script setup lang="ts">

import ContentPage from '~/components/content/ContentPage.vue'

useHead({
  title: 'Mentions légales'
})

const { settings } = useSiteSettings() ; 


const informations = [
  {
    icon: 'mdi-domain',
    title: 'Éditeur de la plateforme',
    fields: [
      ['Nom commercial', settings.value.legal.commercialName],
      ['Raison sociale', settings.value.legal.companyName],
      ['Forme juridique', settings.value.legal.legalForm],
      ['Adresse du siège social', settings.value.legal.registeredAddress],
      ['Numéro d’immatriculation', settings.value.legal.registrationNumber],
      ['E-mail', settings.value.contact.email]
    ]
  },
  {
    icon: 'mdi-account-tie',
    title: 'Direction de la publication',
    fields: [
      ['Responsable de publication', settings.value.legal.publicationDirector]
    ]
  },
  {
    icon: 'mdi-server',
    title: 'Hébergement',
    fields: [
      ['Hébergeur', settings.value.hosting.provider],
      ['Adresse', settings.value.hosting.address],
      ['Site internet', settings.value.hosting.website]
    ]
  },
  {
    icon: 'mdi-copyright',
    title: 'Propriété intellectuelle',
    fields: [
      ['Marque', settings.value.legal.commercialName],
      ['Droits', 'Tous droits réservés']
    ]
  }
]
</script>

<template>
  <ContentPage
    eyebrow="Informations réglementaires"
    title="Mentions légales."
    description="Retrouvez les informations relatives à l'éditeur, à l'hébergement et à la propriété intellectuelle de la plateforme KHARAN."
    icon="mdi-scale-balance"
  >
    <p class="mb-8 mt-0">
      Conformément aux dispositions légales applicables,
      les informations suivantes sont mises à disposition
      des utilisateurs de la plateforme KHARAN.
    </p>

    <v-row dense>
      <v-col
        v-for="section in informations"
        :key="section.title"
        cols="12"
      >
        <v-card
          variant="outlined"
          class="pa-5 mb-3 information_card"
         >
          <div class="d-flex align-center ga-3 mb-5">
            <v-avatar 
               color="#f0f5ff" 
               rounded="lg">
              <v-icon 
              :icon="section.icon" 
              color="secondary" />
            </v-avatar>

            <h3 class="text-h6 font-weight-bold">
              {{ section.title }}
            </h3>
          </div>

          <div
            v-for="field in section.fields"
            :key="field[0]"
            class="d-flex flex-column flex-sm-row justify-space-between ga-1 py-3 border-b"
          >
            <span class="text-medium-emphasis">
              {{ field[0] }}
            </span>

            <strong class="text-body-2 text-sm-right">
              {{ field[1] }}
            </strong>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <h2>Protection des données personnelles</h2>
    <p>
      Les modalités de collecte et de traitement des données personnelles
      sont détaillées dans notre
      <NuxtLink to="/confidentialite">
        politique de confidentialité
      </NuxtLink>.
    </p>

    <h2>Conditions d'utilisation</h2>
    <p>
      L'utilisation de KHARAN est soumise à nos
      <NuxtLink to="/cgu">
        conditions générales d'utilisation
      </NuxtLink>.
    </p>
  </ContentPage>
</template>

<style scoped >

.information_card{
    border: 1px #ddd solid ;
    border-radius: 8px ;
}
</style>
