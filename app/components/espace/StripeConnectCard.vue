
<script setup lang="ts">
import { computed, onMounted } from 'vue';

const { status, loading, loaded, submitting, error, fetchStatus,refreshStatus, startOnboarding, } = useStripeConnect();

const config = computed(() => {

  const states = {

    NOT_CONNECTED: {
      title: 'Aucun compte connecté',
      description: 'Connectez votre compte Stripe pour recevoir vos revenus.',
      color: 'grey',
      icon: 'mdi-bank-plus',
      action: 'Connecter mon compte',
      canStart: true,
    },

    ONBOARDING_INCOMPLETE: {
      title: 'Configuration incomplète',
      description: 'Vous devez terminer la configuration de votre compte Stripe.',
      color: 'warning',
      icon: 'mdi-clipboard-edit-outline',
      action: 'Continuer l’inscription',
      canStart: true,
    },

    PENDING_VERIFICATION: {
      title: 'Vérification en cours',
      description: 'Stripe vérifie vos informations. Vous serez informé lorsque votre compte sera activé.',
      color: 'info',
      icon: 'mdi-clock-outline',
      action: 'Vérification en cours',
      canStart: false,
    },

    ACTION_REQUIRED: {
      title: 'Informations requises',
      description: 'Stripe attend des informations supplémentaires pour activer votre compte.',
      color: 'warning',
      icon: 'mdi-alert-circle-outline',
      action: 'Compléter mes informations',
      canStart: true,
    },

    ACTIVE: {
      title: 'Compte opérationnel',
      description: 'Votre compte Stripe est activé. Vous pouvez recevoir vos versements.',
      color: 'success',
      icon: 'mdi-check-circle-outline',
      action: 'Modifier les informations',//Compte activé
      canStart: true,
    },

    RESTRICTED: {
      title: 'Compte restreint',
      description: 'Votre compte nécessite une intervention. Consultez Stripe pour résoudre le problème.',
      color: 'error',
      icon: 'mdi-alert-outline',
      action: 'Résoudre le problème',
      canStart: true,
    },

  };

  return states[status.value];

});

/* ---------------------------------------------------------------------------- */

    onMounted(async () => {

    await fetchStatus();
    
    
    if (  ['return', 'refresh'].includes( String(useRoute().query.stripe)) ) {
        await refreshStatus();
    }

    });


</script>


<template>

  <SkeletonDashboard v-if="!loaded"  />
  
  <div v-else >

    <!-- title -->
     <div class="mb-6">

      <h1 class="title"> Compte de versement </h1>

      <p class="text-body-1 text-medium-emphasis mt-2">
        Gérez votre compte Stripe et consultez
        son statut d'activation.
      </p>
    </div>
     <!-- title -->

     <!-- card  -->

     <v-card  class="card_shadow pa-4"
      rounded="2"
      border
      elevation="0" >

      <!-- title -->
      <v-card-title class="d-flex align-center ga-3">
        <v-icon
          icon="mdi-wallet-outline"
          size="28"
        />

        <span>Compte de versement</span>
      </v-card-title>

      <v-divider />

    <!-- body -->
      <v-card-text>
        <div class="d-flex align-center ga-3 mb-4">

          <v-icon
            :icon="config.icon"
            :color="config.color"
            size="40"
          />

          <div>
            <div class="text-h6">
              {{ config.title }}
            </div>

            <v-chip
              :color="config.color"
              size="small"
              class="mt-1"
            >
              {{ status }}
            </v-chip>
          </div>
        </div>

        <p class="text-body-2 text-medium-emphasis">
          {{ config.description }}
        </p>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mt-4"
          closable
        >
          {{ error }}
        </v-alert>

      </v-card-text>

      <v-divider />
      <!-- footer -->
      <v-card-actions class="pa-2 pt-4  pb- d-flex align-center flex-wrap">
        <v-btn
          color="secondary"
          variant="flat"
          :loading="submitting"
          :disabled=" loading || !config.canStart "
          @click="startOnboarding"  >

          {{ config.action }}

        </v-btn>

        <v-spacer />

        <v-btn
          icon="mdi-refresh"
          variant="flat"
          size="default"
          :loading="loading"
          aria-label="Actualiser le statut"
          @click="refreshStatus"
        > 
          
        </v-btn>

      </v-card-actions>
  </v-card>

  </div>
  
  
</template>
