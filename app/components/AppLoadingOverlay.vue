
<script setup lang="ts">
    const { loading } = useGlobalLoading() ;
</script>

<template>
  <v-overlay
    :model-value="loading"
    persistent
    class="align-center justify-center"
  >
    <div class="text-center">
      <v-progress-circular
        indeterminate
        size="44"
        color="primary"
      />

      <div class="mt-4 text-white">
         
      </div>
    </div>
  </v-overlay>
</template>
