<script setup lang="ts">
</script>
<template>

 <div class="main_container"> 
      <v-row>
        <v-col v-for="value in [1,2,1,1,1,1,1,1]" cols="12" md="3">
              <v-skeleton-loader   type="image, article" />
        </v-col>
         
      </v-row>
 </div>
  

</template>

<style lang="scss" scoped>

  .main_container{

    margin: auto ;
    margin-top: 20px ;

  }

  @media (max-width:1024px) {
    
    .main_container{

     margin-top: 65px ;

    }

  }

  

</style>