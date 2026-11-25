<script setup lang="ts">
 
    const { has_annonce, annonce_completed,  has_service, } = useAnnonceDialog() ;

 
/* ------------------------------ props ---------------------------------------------- */

   const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;

/*--------------------------------------------------------------------------*/

   const booking_intervals :any = {
      "15": "Chaque quart d’heure",
      "30": "Chaque demi-heure",
      "60": "Chaque heure",
  }

/* ---------------------------------------------------------------------------*/

</script>

<template>
 
    
        <div>
            <v-divider class="mb-2" />

            <!-- format  -->
            <div class="pa-2">
                <div v-if="annonce.format == ReservationFormat.ONLINE"
                  class="d-flex align-center ga-2" >

                   <v-chip
                        class="me-1 mb-1"
                        prepend-icon="mdi-video-outline"
                        size="small"
                        color="info"
                        variant="flat" >
                       Visioconférence
                    </v-chip>
                    
                </div>
                <div v-else>
                    <v-chip v-if="annonce.format == ReservationFormat.IN_PERSON"
                        class="me-1 mb-1"
                        prepend-icon="mdi-check-circle"
                        size="small"
                        color="info"
                        variant="tonal" >
                       Présentiel
                    </v-chip>
                    <v-chip v-if="annonce.format == ReservationFormat.BOTH"
                        class="me-1 mb-1"
                        prepend-icon="mdi-video-outline"
                        append-icon="mdi-home-variant-outline"
                        size="small"
                        color="info"
                        variant="flat" >
                       Visioconférence / Présentiel 
                    </v-chip>
                         
                    <v-chip  
                        class="me-1 mb-1"
                        size="small"
                        prepend-icon="mdi-clock-outline"
                        color="secondary"
                        variant="flat" >
                          {{ booking_intervals[annonce.booking_interval] }}
                    </v-chip>


                   
                    <div class="address mt-1">
                        <v-icon color="#000" icon="mdi-store-marker">  </v-icon>
                        {{ annonce.address }}
                       <span v-if="annonce.building"> , {{ annonce.building }}</span>
                    </div>
                     
                    
                </div>
            </div>

            <v-divider class="mb-4 mt-2" />


            <!-- categories -->
            <div class="mt-0" >
                <v-chip v-for="category in annonce.categories" :key="category.id"
                    class="me-1 mb-1"
                    prepend-icon="mdi-layers"
                    size="small" 
                    color="#000"
                    variant="tonal" >
                    {{ category.name }}
                    <v-icon v-if="!category.enabled" class="ml-1"
                     color="error" icon="mdi-pause"> </v-icon>  
                </v-chip>   
            </div>


            <!-- challenges -->
            <div class="mt-4" >
                <v-chip v-for="challenge in annonce.challenges" :key="challenge.id"
                    class="me-1 mb-1"
                    prepend-icon="mdi-check-circle"
                    size="small"
                    color="secondary"
                    variant="tonal" >
                    {{ challenge.name }} 
                     <v-icon v-if="!challenge.enabled" class="ml-1"
                     color="error" icon="mdi-pause"> </v-icon>
                </v-chip>
            </div>
 

             
             
        </div>
 
</template>
 
 
<style scoped lang="scss">
 .address {
        font-size: 13px;
    }
</style>