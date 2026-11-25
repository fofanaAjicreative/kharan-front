<script setup lang="ts">
 
    const { has_annonce, annonce_completed,  has_service, } = useAnnonceDialog() ;

    import AnnonceCertificationStatus from '~/components/espace/AnnonceCertificationStatus.vue' ;

/* ------------------------------ props ---------------------------------------------- */

   const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;

/*---------------------------------------------------------------------------------------*/


</script>

<template>
  <div>

    
    <!-- chips -->
        <div>

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
            

            <div v-if="!annonce_completed">
                <v-divider class="my-4" />
                <v-alert
                    color="secondary"
                    variant="tonal"
                    rounded="md"
                    class="text-start mb-6" >
                    <div>
                        <h3 class="mb-2 mt-1"> <v-icon icon="mdi-alert" color="secondary" > </v-icon> Votre annonce est incomplete </h3>  
                        Pour commencer à recevoir des demandes de rendez-vous, complétez votre annonce.<br>
                        Décrivez votre expertise, définissez vos tarifs et indiquez vos disponibilités.
                    </div>
                </v-alert>
 
            </div>

            <v-divider class="my-4" />

            <!-- super coach -->
             <v-alert
                v-if="annonce.is_super"
                class="mt-6"
                color="green-lighten-5"
                rounded="lg"
                icon="mdi-medal">
                <div class="font-weight-bold">Vous êtes Super Coach</div>
                <div class="text-body-2 mt-2">
                    Notre équipe vous a attribué le statut Super Coach en reconnaissance de
                    votre engagement et de la qualité de votre accompagnement.
                    Cette distinction valorise votre expertise et renforce la confiance
                    des clients envers votre profil. Continuez à offrir des prestations
                    de qualité et à faire de chaque accompagnement une expérience positive !
                </div>
            </v-alert>

            <!-- certification -->
            <AnnonceCertificationStatus :status="annonce.certification_status" />

            <div  class="d-flex flex-wrap ga-2 justify-center mt-6" >
                <v-btn v-if="annonce_completed && has_service"
                    :to="`/coach/${annonce.id}`"
                    color="dark"
                    variant="tonal"
                    size="default"
                    width="130px"
                    prepend-icon="mdi-web" > 
                    <span class="text-capitalize"> Voir </span>
                </v-btn>
                <v-btn
                    to="/espace-coach/annonce/add"
                    color="secondary"
                    variant="flat"
                    size="default"
                    width="130px"
                    append-icon="mdi-square-edit-outline" > 
                    <span class="text-capitalize"> Modifier </span>
                </v-btn>
                
                <!-- <v-btn
                   color="secondary"
                    variant="tonal"
                    size="default"
                    width="120px"
                    prepend-icon="mdi-share-variant-outline" > 
                    <span class="text-capitalize"> Partager </span>
                </v-btn> -->
            </div>
 
             
        </div>
        <!-- /chips -->   
  </div>
</template>
 
 
<style scoped lang="scss">


</style>