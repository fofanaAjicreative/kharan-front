

<script setup>
// Pas de logique particulière nécessaire pour ce composant statique,
// mais prêt à recevoir des props si vous souhaitez le rendre dynamique (ex: taille, couleur).
</script>

<template>
  <NuxtLink to="/" class="kharan-logo-link" aria-label="Accueil Kharan">
    <span class="kharan-text">KHARAN</span>
  </NuxtLink>
</template>

<style scoped>
/* Import de la police moderne et géométrique "Syncopate" depuis Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&display=swap');

.kharan-logo-link {
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
}

.kharan-text {
  font-family: 'Syncopate', sans-serif;
  font-weight: 700;
  
  /* Taille fluide et adaptative : s'adapte automatiquement entre mobile et desktop */
  font-size: clamp(1.5rem, 3vw + 1rem, 3.5rem);
  
  letter-spacing: 0.18em;
  text-transform: uppercase;
  
  /* Effet de dégradé subtil et élégant sur le texte */
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.kharan-logo-link:hover .kharan-text {
  opacity: 0.9;
  transform: scale(1.02);
}
</style>