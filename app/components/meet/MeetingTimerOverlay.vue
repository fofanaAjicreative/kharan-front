<script setup lang="ts">
 

/* ------------------------ props ------------------------------------- */


    const props = defineProps<{
        start: string
        end: string
        graceMinutes?: number
    }>()


    const emit = defineEmits<{
        closeRequested: []
    }>()

/* ------------------------ / props ------------------------------------- */


const expanded = ref(false)
const alertDismissed = ref(false)
const closeEmitted = ref(false)


const timer = useReservationTimer({
    start: props.start,
    end: props.end,
    graceMinutes: props.graceMinutes ?? 15
})

/* ------------------------------------------------------------------ */

const status = computed(() => {

  switch (timer.phase.value) {

    case 'waiting':
      return { label: 'En attente', color: 'info' }
    case 'running':
      return { label: 'En cours', color: 'success' }
    case 'grace':
      return { label: 'Temps supplémentaire', color: 'warning' }
    default:
      return { label: 'Terminée', color: 'error' }
 
  }

})

/* ------------------------------------------------------------------ */


const timerLabel = computed(() => {

  if (timer.phase.value === 'waiting') return 'Début dans'
  if (timer.phase.value === 'grace') return 'Fermeture dans'
  if (timer.phase.value === 'finished') return 'Séance terminée'
  return 'Temps restant'

})


/* ------------------------------------------------------------------ */

const showTimer = computed(() =>
  timer.isTenMinuteWarning.value  
)

const showWarning = computed(() =>
  timer.isFiveMinuteWarning.value && !alertDismissed.value
)




/* ------------------------------------------------------------------ */

    watch(timer.phase, (phase) => {
        
    if (phase === 'grace') {
        alertDismissed.value = false
    }

    if (phase === 'finished' && !closeEmitted.value) {
        closeEmitted.value = true
        emit('closeRequested')
    }
    }, { immediate: true })

/* ------------------------------------------------------------------ */


</script>



<template>

  <div v-if="showTimer || timer.phase.value === 'grace' "
    class="timer-overlay">
    <v-card
      class="timer-card"
      elevation="0"
      rounded="8"
      color="surface" >

      <div class="d-flex align-center justify-space-between px-3 pt-3">

            <div class="d-flex align-center ga-2">
              <v-icon size="small">mdi-video</v-icon>
              <span class="text-subtitle-2 font-weight-bold"> </span>
            </div>

            <v-chip
            :color="status.color"
            size="small"
            variant="tonal"
            >
            {{ status.label }}
            </v-chip>

      </div>

      <div class="timer-main px-3 pt-3 pb-2">
        <div class="text-caption text-medium-emphasis">
          {{ timerLabel }}
        </div>

        <div
          class="timer-value"
          :class="{
            'text-warning': timer.phase.value === 'grace',
            'text-error': timer.phase.value === 'finished'
          }"
        >
          {{ timer.formattedTime.value }}
        </div>

        <div class="text-caption text-medium-emphasis">
          Fin prévue à {{ timer.endTimeLabel.value }}
        </div>
      </div>

      <v-expand-transition>
        <div v-if="expanded">
          <v-divider />

          <v-row class="px-3 py-3" dense>
            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">
                Durée prévue
              </div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ timer.durationMinutes }} minutes
              </div>
            </v-col>

            <v-col cols="6">
              <div class="text-caption text-medium-emphasis">
                Tolérance
              </div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ timer.graceMinutes }} minutes
              </div>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>

      <v-divider />

      <v-btn
        block
        variant="text"
        size="small"
        rounded="0"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Réduire' : 'Détails de la séance' }}

        <v-icon end>
          {{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
        </v-icon>
      </v-btn>
    </v-card>

    <v-alert
      v-if="showWarning"
      class="timer-alert mt-2"
      type="warning"
      variant="tonal"
      density="compact"
      closable
      @click:close="alertDismissed = true"
    >
       La séance approche de sa fin.

    </v-alert>

    <v-alert
      v-if="timer.phase.value === 'grace'"
      class="timer-alert mt-2"
      color="warning"
      variant="tonal"
      density="compact"
    >
      La durée prévue est terminée.
      Vous disposez encore de temps pour conclure.
    </v-alert>

    
  </div>

  
</template>



<style scoped>
        .timer-overlay {
          position: absolute;
          z-index: 20;
          top: max(6px, env(safe-area-inset-top));
          right: 6px;
          width: 280px;
          pointer-events: none;
        }

        .timer-card,
        .timer-alert {
        pointer-events: auto;
        }

        .timer-main {
        text-align: center;
        }

        .timer-value {
          font-size: 36px;
          line-height: 1.25;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          letter-spacing: 1px;
        }

        @media (max-width: 600px) {
        .timer-overlay {
            top: max(10px, env(safe-area-inset-top));
            right: 12px;
            left: 12px;
            width: auto;
        }

        .timer-value {
            font-size: 30px;
        }

        .timer-card {
            border-radius: 8px !important;
        }
        }
</style>
