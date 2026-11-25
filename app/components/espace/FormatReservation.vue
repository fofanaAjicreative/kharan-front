<script setup lang="ts">
 
   
/* ------------------------------ props ---------------------------------------------- */

   const props = defineProps({
        reservation:{
            type:Object,
            required:true
        }
    }) ;

/*---------------------------------------------------------------------------------------*/


</script>


<template>

    <v-chip
        v-if="reservation.format == ReservationFormat.ONLINE"
        size="small"
        variant="tonal"
        color="secondary" >

        <template #prepend>
            <v-icon>
                mdi-video-outline
            </v-icon>
        </template>

        Visioconférence

    </v-chip>


    <v-chip
        v-else-if="reservation.format == ReservationFormat.IN_PERSON"
        size="small"
        variant="tonal"
        color="secondary"
        class="ml-1" >
        <template #prepend>
            <v-icon>
                mdi-home-variant-outline
            </v-icon>
        </template>

        Présentiel
    </v-chip>


    <v-chip
        size="small"
        variant="tonal"
        color="secondary"
        class="ml-1" >
        <template #prepend>
            <v-icon>
                mdi-clock-outline
            </v-icon>
        </template>

        {{ reservation.sceance_duration }} min
    </v-chip>

</template>