<script setup lang="ts">
</script>
<template>

 <div class="main_container"> 
      <v-row>
        <v-col cols="12" md="6">
              <v-skeleton-loader v-for="value in [1,2]"  type="image, article" />
        </v-col>
        <v-col cols="12" md="6">
            <v-skeleton-loader v-for="value in [1,2]"  type="image, article" />
        </v-col>
      </v-row>
 </div>
  

</template>

<style lang="scss" scoped>

  .main_container{
    
    margin: auto ;
     
  }

  

</style>