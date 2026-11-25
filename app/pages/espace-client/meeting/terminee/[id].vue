
<script setup lang="ts">

const route = useRoute()

const reservationId = computed(() => String(route.params.id))

const reservationUrl = computed(() => `/espace-client/reservations/${reservationId.value}` )

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
      class="card_shadow pa-5 pa-sm-8 text-center"
    >
      <div class="illustration-wrapper mx-auto mb-6">

        <div class="illustration-circle">

          <v-icon
            icon="mdi-handshake-outline"
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
        Merci pour cette séance !
      </h2>

      <p class="text-body-1 text-medium-emphasis mb-7">
        
      </p>

      <v-card
        color="surface"
        variant="tonal"
        class="pa-4 mb-5 text-left" 
      >
        <div class="d-flex align-start ga-3">
          <v-icon
            icon="mdi-clock-check-outline"
            color="secondary"
            size="28"
          />

          <div>
            <div class="font-weight-bold mb-1 text-secondary">
              Rendez-vous demain !
            </div>

            <p class="text-body-2 text-medium-emphasis mb-0">
              Votre coach doit d'abord confirmer que la séance
              est terminée. Une fois cette validation effectuée,
              vous pourrez revenir demain pour partager votre
              expérience et donner votre avis.
            </p>
          </div>
        </div>
      </v-card>

      <div class="review-preview pa-4 rounded-lg mb-6">
        <div class="d-flex align-center ga-3 mb-3">

          <v-avatar 
             color="orange-lighten-5" size="42">
            <v-icon 
              icon="mdi-account-star-outline"
              color="orange-darken-2"
              />
          </v-avatar>

          <div class="text-left">
            <div class="font-weight-bold">
              Évaluez votre coach
            </div>
            <div class="text-caption text-medium-emphasis">
              Votre expérience avec votre coach
            </div>
          </div>
        </div>

        <v-divider class="mb-3" />

        <div class="d-flex align-center ga-3">
          <v-avatar color="orange-lighten-5" size="42">
            <v-icon
              icon="mdi-book-open-variant"
              color="orange-darken-2"
            />
          </v-avatar>

          <div class="text-left">
            <div class="font-weight-bold">
              Évaluez le service
            </div>
            <div class="text-caption text-medium-emphasis">
              La qualité de cette prestation
            </div>
          </div>
        </div>

        <div class="d-flex justify-center ga-1 mt-4">
          <v-icon
            v-for="n in 5"
            :key="n"
            icon="mdi-star-outline"
            color="amber"
            size="27"
          />
        </div>
      </div>

      <v-btn
        :to="reservationUrl"
        color="secondary"
        variant="flat"
        size="default"
        block
        class="mb-4"
        append-icon="mdi-arrow-right"
      >
        Voir ma réservation
      </v-btn>

      <NuxtLink
        to="/espace-client"
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

.review-preview {
  background: rgba(var(--v-theme-primary), 0.035);
  border: 1px solid rgba(var(--v-border-color), 0.12);
}
</style>
