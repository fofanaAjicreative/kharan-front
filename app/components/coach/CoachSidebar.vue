<script setup lang="ts">

    const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;
   
</script>

<template>

<v-card  class="coach_sidebar" >

    <v-card-text class="pa-6">

        <CoachSidebarContent :annonce="annonce" />
 
    </v-card-text>

</v-card>

</template>

<style scoped lang="scss">

    .coach_sidebar{
        position: -webkit-sticky;
        position:sticky;
        top:95px;
        box-shadow: 0 12px 35px rgba(0,0,0,.08);
        border: 0px #eee solid ;
        border-radius: 0px;
    }

    .price{
        font-size: 20px;
        font-weight: bold ;
    }




</style>