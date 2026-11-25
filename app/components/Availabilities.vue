<script setup lang="ts">

    const availabilities = defineModel<any[]>({
     required: true
    })

</script>


<template>


 <div class="main_content">

    <v-card class="pa-4 card_shadow"> 
 
            <AvailabilityWeekday  
                v-for="(day, index) in availabilities"
                :key="day.day"
                v-model="availabilities[index]"
            />

    </v-card>

 </div>


</template>
<style lang="scss" scoped>

    .card_shadow{
        max-width: 500px ;
        min-width: 320px ;
        border: 1px #ddd solid ;
        border-radius: 2;
         
    }

    @media(max-width: 389px){
        .card_shadow{
            border: none ;
        }
    }

</style>