
<script setup lang="ts">

    const {
        dialog,
        title,
        text,
        accept,
        cancel
    } = useConfirm()

</script>


<template>

  <v-dialog
    v-model="dialog"
    max-width="450"
    persistent >
    <v-card rounded="6">

      <v-card-title>
        <b>{{ title }}</b>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        {{ text }}
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

