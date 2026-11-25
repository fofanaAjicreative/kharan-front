<script setup lang="ts">

   const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;

    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;
 
</script>

<template>
  <div>

    <div v-if="!mobile && annonce.review_count>0 " class="d-flex align-center ga-2 justify-start"  >
        <v-rating
            :model-value="annonce.review_avg"
            readonly
            density="compact"
            color="amber"
            half-increments
            size="20" />
        <span class="text-medium-emphasis" > ( {{ annonce.review_count }} avis) </span>
    </div>

    <!-- chips -->
        <div>
            <!-- categories -->
            <div class="mt-4" >
                <v-chip v-for="category in annonce.categories" :key="category.id"
                size="small" class="me-1 mb-1"
                variant="tonal" >
                {{ category.name }} 
                </v-chip>   
            </div>


            <!-- challenges -->
            <div class="mt-4" >
                <v-chip v-for="challenge in annonce.challenges" :key="challenge.id"
                    size="small" class="me-1 mb-1"
                    color="secondary"
                    variant="tonal" >
                    {{ challenge.name }} 
                </v-chip>
            </div>
            

            <v-divider class="my-4" />

           

                <!-- Coach certifié -->
                <v-alert
                    v-if="annonce.is_certified"
                    class="mt-6"
                    color="green-lighten-5"
                    rounded="0"
                   
                >
                    <div class="font-weight-bold">
                        <v-icon  icon="mdi-certificate" class="me-2" />
                        Coach certifié</div>
                    <div class="text-body-2 mt-2">
                        Ce coach a obtenu la certification KHARAN après vérification de son
                        dossier par notre équipe. Cette certification atteste que les
                        justificatifs soumis ont été examinés selon les critères de la
                        plateforme.  
                    </div>
                </v-alert>

                 <!-- Super coach -->
                <v-alert
                    v-if="annonce.is_super"
                    class="mt-6"
                    color="green-lighten-5"
                    rounded="0" 
                     >
                    <div class="font-weight-bold">
                        <v-icon  icon="mdi-medal" class="me-2" />
                        Super Coach</div>
                    <div class="text-body-2 mt-2">
                        Ce coach se distingue par la qualité de son accompagnement et son
                        engagement auprès de ses clients. 
                    </div>
                </v-alert>


            <div v-if="!mobile" class="d-none flex-wrap ga-3 justify-center mt-6" >
                <v-btn
                    color="#424242"
                    variant="outlined"
                    rounded="4"
                    size="default"
                    prepend-icon="mdi-chat-outline" > <span class="text-capitalize"> Contacter </span>
                </v-btn>
                <v-btn
                    color="#424242"
                    variant="outlined"
                    rounded="4"
                    size="default"
                    prepend-icon="mdi-heart-outline" > <span class="text-capitalize"> Favoris </span>
                </v-btn>
                <v-btn
                    color="#424242"
                    variant="outlined"
                    rounded="4"
                    size="default"
                    prepend-icon="mdi-share-variant-outline" > <span class="text-capitalize"> Partager </span>
                </v-btn>
            </div>

            <div v-if="mobile" class="d-none flex-wrap ga-2 justify-center mt-6">
                <v-btn
                    color="#424242"
                    variant="outlined"
                    rounded="4"
                    width="80px"
                    icon="mdi-chat-outline" >
                </v-btn>

                <v-btn
                    color="#424242"
                    variant="outlined"
                    rounded="4"
                    width="80px"
                    icon="mdi-heart-outline" >
                </v-btn>
                <v-btn
                    color="#424242"
                    variant="outlined"
                    rounded="4"
                    width="80px"
                    icon="mdi-share-variant-outline" >
                </v-btn> 

            </div>
            
        </div>
        <!-- /chips -->   
  </div>
</template>
 
 
<style scoped lang="scss">


</style>