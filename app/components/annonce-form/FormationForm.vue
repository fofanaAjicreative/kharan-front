<script setup lang="ts">

    const props = defineProps({
        formation:{
            type:Object,
            required:true
        }
    }) ;
 
    
    
    const formData = ref("123") ;

</script>


<template>


 <div class="main_content">

    <v-card rounded="lg" class="pa-6">
            
        <h2>  FORM  </h2>

    </v-card>

 </div>


</template>
<style lang="scss" scoped>

    .main_content{
        max-width: 500px ;
        min-width: 400px ;
        margin :auto ;
    }

</style>