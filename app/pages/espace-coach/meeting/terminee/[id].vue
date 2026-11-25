
<script setup lang="ts">

const route = useRoute()

const reservationId = computed(() => String(route.params.id))
const reservationUrl = computed(() => `/espace-coach/reservations/${reservationId.value}` )


</script>

<template>

  <v-container
    fluid
    class="meeting-ended-page fill-height d-flex align-center justify-center pa-4 pa-md-8"
  >
    <v-card
      max-width="560"
      width="100%"
      elevation="0"
      class="card_shadow pa-4 pa-sm-8 text-center"
    >
      <div class="illustration-wrapper mx-auto mb-2">
        
        <div class="illustration-circle">
          <v-icon
            icon="mdi-video-check-outline"
            size="44"
            color="success"
          />
        </div>
        <div class="success-badge">
          <v-icon icon="mdi-check" size="20" />
        </div>
      </div>

      <v-chip
        color="success"
        variant="tonal"
        size="small"
        class="mb-2"
      >
        Visioconférence terminée
      </v-chip>

      <h2 class="text-h6 text-sm-h4 font-weight-bold mb-3 title">
        Bravo, votre séance est terminée !
      </h2>

      <p class="text-body-1 text-medium-emphasis mb-7">
         
      </p>

      <v-card
        color="surface"
        variant="tonal"
        class="pa-4 mb-6 text-left"
      >
        <div class="d-flex align-start ga-3">
          <v-icon
            icon="mdi-clipboard-check-outline"
            color="secondary"
            size="28"
          />

          <div>
            <div class="font-weight-bold mb-1 text-secondary">
              Dernière étape : valider la séance
            </div>

            <p class="text-body-2 text-medium-emphasis mb-0">
              Rendez-vous sur la page de la réservation
              et cliquez sur « Changer statut »,puis « Terminer » 
              Cette confirmation permettra de comptabiliser vos versements.
            </p>
          </div>
        </div>
      </v-card>

      <v-btn
        :to="reservationUrl"
        color="secondary"
        size="default"
        variant="flat"
        block
        class="mb-4"
        append-icon="mdi-arrow-right"
      >
        Accéder à la réservation
      </v-btn>

      <NuxtLink
        to="/espace-coach"
        class="text-body-2 text-medium-emphasis text-decoration-none"
      >
        Retour à mon espace
      </NuxtLink>
    </v-card>
  </v-container>

</template>

<style scoped>

.title {
   line-height: normal ;
}

.ended-card {
  border: 1px solid rgba(var(--v-border-color), 0.12);
  background: rgb(var(--v-theme-surface));
}

.illustration-wrapper {
  position: relative;
  width: 82px;
  height: 82px;
}

.illustration-circle {
  width: 82px;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(var(--v-theme-success), 0.10);
}

.success-badge {
  position: absolute;
  right: 0;
  bottom: 2px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  background: rgb(var(--v-theme-success));
  border: 3px solid rgb(var(--v-theme-surface));
}
</style>
