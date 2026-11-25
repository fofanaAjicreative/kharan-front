
<script setup lang="ts">

    const {
        dialog, reason ,
        title, description,
        accept,
        cancel
    } = useCancelReservation()

</script>


<template>

  <v-dialog
    v-model="dialog"
    max-width="450"
    persistentt >
    <v-card rounded="6">

      <v-card-title>
        <b>{{ title }}</b>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        {{ description }}
      </v-card-text>

       <v-card-text>
            <v-textarea 
              v-model="reason"
              variant="outlined"
              rows="4"
              rounded="0"
              density="compact"
              label="Veuillez nous donner les raisons de votre décision.">
            </v-textarea>
      </v-card-text>


      <v-card-actions>

        <v-spacer />

        <v-btn
          color="#eee"
          variant="flat"
          @click="cancel" >
          Annuler
        </v-btn>

        <v-btn
          color="secondary"
          variant="flat"
          @click="accept" >
          Confirmer
        </v-btn>

      </v-card-actions>

    </v-card>

  </v-dialog>

</template>

