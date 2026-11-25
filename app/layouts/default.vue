
<script setup lang="ts" >

    import Header from '~/components/Header.vue';

    useHead({
      titleTemplate: (title) => title ? `${title} | Kharan` : 'Kharan'
    })

 
/* ----------------------- annonce check -------------------------------------- */ 

 

 /* ---------------------------------------------------------------------------- */

    onMounted( async ()=>{
 
    })

 /* ---------------------------------------------------------------------------- */

  

</script>

<template>
  <v-app>


    <Header />
    <!-- PAGE -->
    <v-main>
      
          <slot />
      
    </v-main>

    <!-- /PAGE -->

    
    <Footer />
   
     <!-- completer son annonce  -->
    
    <AppNotificationPermissionDialog />

  </v-app>
</template>