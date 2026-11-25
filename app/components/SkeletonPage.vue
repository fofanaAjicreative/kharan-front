<script setup lang="ts">
</script>
<template>

    <div class="d-flex flex-wrap justify-center ga-8" >
         <div class="coach-container">
              <v-skeleton-loader v-for="value in [1,2,3]"  type="image, article" />
         </div>
         <div class="coach-sidebar-container">
               <v-skeleton-loader v-for="value in [1,2]"  type="image, article" />
         </div>
       </div>

</template>

<style lang="scss" scoped>

  .coach-container{
    width: 900px;
     
  }

  .coach-sidebar-container{
     width: 500px;
  }

</style>