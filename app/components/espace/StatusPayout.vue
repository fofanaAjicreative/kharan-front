<script setup lang="ts">

 /* -----------------------------propos ------------------------------------------------ */

    const props = defineProps({
        status:{
            type: String,
            required:true
        }
    }) ;
   

</script>

<template>

    <v-chip  v-if="status === 'paid'"
        size="default"
        variant="tonal"
        color="success"
        prepend-icon="mdi-check-all"
        >
        Payé
    </v-chip>

    <v-chip  v-if="status === 'processing'"
        size="default"
        variant="tonal"
        color="info"
        prepend-icon="mdi-clock-outline"
        >
        En cours
    </v-chip>

    <v-chip  v-if="status === 'requires_review'"
        size="default"
        variant="tonal"
        color="orange"
        prepend-icon="mdi-alert"
        >
        À vérifier
    </v-chip>


</template>

<style scoped lang="scss">


  
</style>