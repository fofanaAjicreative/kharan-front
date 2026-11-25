<script setup lang="ts">

    import StripeConnectCard from '~/components/espace/StripeConnectCard.vue';

    useHead({
      title: 'Compte de versement',
    });

</script>


<template>


  <v-container max-width="900" class="py-8" >
   
    <StripeConnectCard />

  </v-container>


</template>

<style scoped lang="scss">

.title{
   font-weight: bold;
   font-size: 30px;
   line-height: normal ;
}

</style>