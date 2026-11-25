<script setup lang="ts">

  const props = defineProps({
        description:{
            type:Object,
            required:true
        }
    }) ;

const description = props.description ;
 
</script>

<template>

<v-card-text class="card_content">
 
    <div class="text-body-1"
        v-html="description" > </div>

</v-card-text>

</template>

<style scoped lang="scss">

    .card_content{
        padding: 30px !important;
    }

    @media screen and (max-width: 600px) {

        .card_content{
            padding: 4px !important;
        }
        
    }
    
</style>