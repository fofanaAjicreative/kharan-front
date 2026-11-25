<script setup lang="ts">

    import ServiceFormat from '~/components/espace/ServiceFormat.vue'

    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;
    
    const { truncate } = useText() ;
    
    /* ------------------------------- props ----------------------------------------- */

    const props = defineProps({
        service:{
            type:Object,
            required:true
        }
    }) ;

 



</script>

<template>

 <v-card class="service_card mb-5" >

    <v-card-text class="pa-6">

        <div class="d-flex justify-space-between align-start flex-wrap ga-4" >

            <div class="flex-grow-1">

                <h3 class="service_title"> {{ service.title }} </h3>

                <div class="service_description" >

                    {{ service.expanded ? service.description : truncate(service.description, 500) }}

                     <v-btn :to="`/service/${service.id}`"
                        variant="text" 
                        color="info" 
                        size="small"
                        class="toggle_description" > En savoir plus </v-btn>

 
                </div>

                <div class="d-flex flex-wrap ga-2 mt-5 justify-space-between align-end" >

                <!-- format -->
                <ServiceFormat :service="service" />

                <div v-if="!mobile" class="service_price">
                     {{ service.price_ttc }}€    
                </div>

                </div>

            </div>
 

        </div>

    </v-card-text>

    <v-divider/>

    <v-card-actions class="d-flex justify-space-between flex-wrap pa-4" >
        <div  v-if="mobile"  class="service_price" > 
            {{ service.price_ttc }}€    
        </div>

        <div  v-else  class="service_price" > 
            
        </div>

         

        <v-btn
            color="info"
            variant="outlined"
            prepend-icon="mdi-calendar-check"
            :to="`/service/${service.id}`"
         >
            Prendre rendez-vous 
        </v-btn>

    </v-card-actions>

</v-card>

</template>

<style scoped>

.service_card{
    box-shadow: 0 12px 35px rgba(0,0,0,.08);
}

.service_card{
    transition:.25s;
}

.service_card:hover{
    transform:translateY(-4px);

    box-shadow:
        0 10px 30px rgba(0,0,0,.08);
}

.service_title{
    font-size: 16px;
    font-weight: bold;
    margin-top: 0px ;
    margin-bottom: 10px ;
}
.service_description{
    font-size: 14px ;
    color: #424242;
}

.service_price{
    font-size: 16px;
    font-weight: 600;
    color:#424242;
}

</style>