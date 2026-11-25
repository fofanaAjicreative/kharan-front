
<script setup lang="ts">

import ContentPage from '~/components/content/ContentPage.vue'

useHead({
  title: 'À propos de KHARAN',
  meta: [
    {
      name: 'description',
      content: 'Découvrez KHARAN, la plateforme qui connecte les clients aux coachs professionnels.'
    }
  ]
})
</script>

<template>

  <ContentPage
    eyebrow="Qui sommes-nous ?"
    title="Faire du potentiel une réalité."
    description="KHARAN est une plateforme dédiée au développement personnel et professionnel. Nous facilitons les rencontres entre les personnes qui souhaitent progresser et les coachs qui peuvent les accompagner."
    icon="mdi-lightbulb-on-outline" >

    <h2 style="margin-top: 0px !important;">Notre histoire</h2>
    <p>
      Nous avons créé KHARAN avec une conviction simple :
      chacun devrait pouvoir trouver le bon accompagnement
      pour avancer dans ses projets personnels et professionnels.
    </p>
    <p>
      Pourtant, identifier un coach compétent, comprendre ses
      spécialités et organiser un accompagnement peut être compliqué.
      KHARAN simplifie cette démarche en réunissant clients et coachs
      au sein d'une même plateforme.
    </p>

    <h2>Notre mission</h2>
    <p>
      Faciliter l'accès au coaching en permettant à chacun de trouver
      un accompagnement adapté à ses objectifs, ses besoins et son budget.
    </p>

    <v-row class="my-6" dense>
      <v-col cols="12" sm="6">
        <v-card 
          color="info" 
          variant="tonal"
           
          flat 
          class="pa-5 h-100">
          <v-icon icon="mdi-account-search-outline" color="secondary" size="32" />
          <h3>Pour les clients</h3>
          <p class="mb-0">
            Découvrir des coachs, comparer leurs expertises et réserver
            des séances adaptées à leurs objectifs.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card 
          color="info" 
          variant="tonal"
           
          flat 
          class="pa-5 h-100">
          <v-icon icon="mdi-account-tie-outline" color="secondary" size="32" />
          <h3>Pour les coachs</h3>
          <p class="mb-0">
            Valoriser leurs compétences, présenter leurs services
            et développer leur activité.
          </p>
        </v-card>
      </v-col>
    </v-row>

    <h2>Nos valeurs</h2>

    <h3>La confiance</h3>
    <p>
      Nous souhaitons construire un environnement dans lequel
      les clients peuvent choisir leur accompagnement en toute confiance.
    </p>

    <h3>La qualité</h3>
    <p>
      Nous mettons en avant les compétences, les expériences,
      les certifications et les retours des clients.
    </p>

    <h3>L'évolution</h3>
    <p>
      Nous croyons que chaque personne possède un potentiel
      qui peut être développé avec le bon accompagnement.
    </p>

    <h2>Notre ambition</h2>
    <p>
      Faire de KHARAN un espace de référence pour celles et ceux
      qui souhaitent apprendre, évoluer et atteindre leurs ambitions.
    </p>

    <v-alert type="info" variant="tonal" class="mt-8">
      <strong>KHARAN, votre évolution commence ici.</strong>
    </v-alert>
  </ContentPage>
</template>
