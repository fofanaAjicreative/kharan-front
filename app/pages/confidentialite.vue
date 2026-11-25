
<script setup lang="ts">

   import ContentPage from '~/components/content/ContentPage.vue'

    useHead({
        title: 'Politique de confidentialité'
    })
    
</script>

<template>
  <ContentPage
    eyebrow="Protection de vos données"
    title="Votre confiance est précieuse."
    description="Nous accordons une importance particulière à la protection de vos données personnelles et à la transparence concernant leur utilisation."
    icon="mdi-shield-lock-outline"
  >
    <v-alert type="info" variant="tonal" class="mb-8">
      Dernière mise à jour : 11 novembre 2026.
    </v-alert>

    <h2>1. Introduction</h2>
    <p>
      La présente politique de confidentialité explique comment
      KHARAN collecte, utilise, conserve et protège les données
      personnelles des utilisateurs de sa plateforme.
    </p>
    <p>
      Elle concerne les visiteurs, les clients et les coachs utilisant
      les services proposés par KHARAN.
    </p>

    <h2>2. Les données collectées</h2>
    <p>Dans le cadre de l'utilisation de notre plateforme, nous pouvons collecter :</p>

    <h3>Informations d'identification</h3>
    <ul>
      <li>Nom et prénom ;</li>
      <li>Adresse e-mail ;</li>
      <li>Numéro de téléphone, le cas échéant ;</li>
      <li>Photo de profil ;</li>
      <li>Informations relatives au compte utilisateur.</li>
    </ul>

    <h3>Informations relatives aux coachs</h3>
    <ul>
      <li>Présentation professionnelle et biographie ;</li>
      <li>Expériences et formations ;</li>
      <li>Certifications et expertises ;</li>
      <li>Services, tarifs et disponibilités ;</li>
      <li>Avis et évaluations des clients.</li>
    </ul>

    <h3>Informations relatives aux réservations</h3>
    <ul>
      <li>Historique des réservations ;</li>
      <li>Services commandés ;</li>
      <li>Dates et horaires des séances ;</li>
      <li>Informations nécessaires au suivi des paiements.</li>
    </ul>

    <h2>3. Utilisation des données</h2>
    <p>Les données collectées peuvent être utilisées pour :</p>
    <ul>
      <li>Créer et gérer les comptes utilisateurs ;</li>
      <li>Mettre en relation les clients et les coachs ;</li>
      <li>Gérer les réservations et les séances ;</li>
      <li>Assurer le suivi des paiements ;</li>
      <li>Permettre les échanges via la messagerie ;</li>
      <li>Améliorer la qualité et la sécurité de la plateforme ;</li>
      <li>Répondre aux demandes d'assistance.</li>
    </ul>

    <h2>4. Paiements et prestataires externes</h2>
    <p>
      Les paiements peuvent être traités par des prestataires spécialisés,
      notamment Stripe lorsque ce service est utilisé.
      Les informations bancaires sont traitées conformément aux
      politiques de confidentialité et de sécurité de ces prestataires.
    </p>
    <p>
      KHARAN ne doit pas être présenté comme stockant les numéros
      complets de cartes bancaires si ceux-ci sont exclusivement
      traités par son prestataire de paiement.
    </p>

    <h2>5. Partage des données</h2>
    <p>
      Certaines informations sont partagées entre clients et coachs
      lorsque cela est nécessaire à la fourniture des services.
    </p>
    <p>
      Les données peuvent également être communiquées aux prestataires
      techniques et de paiement intervenant dans le fonctionnement
      de la plateforme, dans la limite de leurs missions.
    </p>

    <h2>6. Durée de conservation</h2>
    <p>
      Les données sont conservées pendant la durée nécessaire
      aux finalités pour lesquelles elles ont été collectées,
      sous réserve des obligations légales et réglementaires applicables.
    </p>

    <h2>7. Sécurité des données</h2>
    <p>
      KHARAN met en œuvre des mesures techniques et organisationnelles
      destinées à protéger les informations contre les accès non autorisés,
      la perte, la modification ou la divulgation.
    </p>

    <h2>8. Vos droits</h2>
    <p>
      Selon la législation applicable, vous pouvez notamment disposer
      de droits d'accès, de rectification, de suppression, d'opposition
      et de limitation du traitement de vos données.
    </p>
    <p>
      Pour exercer vos droits, vous pouvez contacter le responsable
      du traitement à l'adresse indiquée sur notre page de contact.
    </p>

    <h2>9. Cookies</h2>
    <p>
      La plateforme peut utiliser des cookies et technologies similaires
      nécessaires à son fonctionnement, à la sécurité et, le cas échéant,
      à la mesure d'audience.
    </p>
    <p>
      Les cookies non essentiels doivent être soumis aux règles de
      consentement applicables.
    </p>

    <h2>10. Modifications</h2>
    <p>
      Cette politique peut être mise à jour afin de refléter les évolutions
      de nos services ou de nos obligations légales.
    </p>
  </ContentPage>
</template>
