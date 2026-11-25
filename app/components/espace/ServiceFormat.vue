<script setup lang="ts">
 
   
/* ------------------------------ props ---------------------------------------------- */

   const props = defineProps({
        service:{
            type:Object,
            required:true
        }
    }) ;

/*---------------------------------------------------------------------------------------*/


</script>


<template>
 
    <div class="d-flex flex-wrap ga-2 mt-4" >

        <!-- visio -->
        <v-chip 
            v-if="service.format == ReservationFormat.ONLINE "
            size="small"
            color="default"
            prepend-icon="mdi-video-outline"
            variant="tonal"  
            class="mt-1" >
            <template v-slot:prepend >
              <v-icon color="secondary" icon="mdi-video-outline" class="mr-1" ></v-icon>
            </template> En visioconférence
        </v-chip>

        <v-chip 
            v-else-if="service.format == ReservationFormat.IN_PERSON"
            size="small"
            color="default"
            variant="tonal"  
            class="mt-1" >

            <template v-slot:prepend >
              <v-icon color="secondary" icon="mdi-home-variant-outline" class="mr-1"></v-icon>
            </template>
            En présentiel
        </v-chip>

        <v-chip 
            v-else-if="service.format == ReservationFormat.BOTH"
            size="small"
            color="default"
            variant="tonal"  
            class="mt-1" >
            <template v-slot:prepend >
              <v-icon color="secondary" icon="mdi-video-outline" class="mr-1"></v-icon>
            </template>
             <template v-slot:append >
              <v-icon color="secondary" icon="mdi-home-variant-outline" class="ml-1"> </v-icon>
            </template>
            Visioconférence / Présentiel    
        </v-chip>
        <!-- / visio -->


        <!-- pack -->
        <v-chip
                v-if="service.sceance_number==1"
                size="small"
                variant="tonal"
                color="secondary"
                class="mt-1 ml-2"
                >
                <template v-slot:prepend >
                  <v-icon icon="mdi-numeric-1-box" class="mr-1"></v-icon>
                </template>
                Séance unique
        </v-chip>
        <v-chip
                v-else
                size="small"
                variant="tonal"
                color="secondary"
                class="mt-1 ml-2"
                >
                <template v-slot:prepend >
                  <v-icon icon="mdi-layers-triple" class="mr-1"></v-icon>
                </template>
                Pack {{ service.sceance_number }} séances  
        </v-chip>
        <!-- /pack -->

        <!-- duration -->
            <v-chip
                size="small"
                color="default"
                variant="tonal"
                class="mt-1 ml-2" 
                >
                <template v-slot:prepend >
                  <v-icon color="secondary" icon="mdi-clock-outline" class="mr-1"></v-icon>
                </template>
                {{ service.sceance_duration }} mins
        </v-chip>
        <!-- /duration -->

    </div>


</template>