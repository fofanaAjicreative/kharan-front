<script setup lang="ts">
    const { has_annonce, annonce_completed,  has_service, } = useAnnonceDialog() ;
</script>

<template>
     <div class="services_content">

      <v-card rounded="4" class="services_card">
        <v-card-text class="text-center services_card_content">
          
          <h2 class="text-h5 font-weight-bold mb-4 mt-0"> Votre profil est presque prêt  </h2>

          <!-- annonce  -->
           <div  v-if="!has_annonce">
            <v-alert
                color="info"
                variant="tonal"
                rounded="md"
                class="text-start mb-6" >
                  <div>
                    <h3 class="mb-2 mt-1"> <v-icon icon="mdi-alert" color="secondary" > </v-icon> Vous n'avez pas encore d'annonce </h3> 
                    Pour commencer à recevoir des demandes de rendez-vous,
                    créez votre annonce de coaching.<br>
                     
                      Décrivez votre expertise, définissez vos tarifs
                    et indiquez vos disponibilités.
                  </div>
            </v-alert>

            <v-alert 
               icon="mdi-information-slab-circle"
               class="mb-8" 
               color="success" 
               variant="tonal" 
               density="compact"  >
               <div class="text-left">
                  Vous aurez accès à d'autres options dans le menu 
                  quand vous aurez complété la création de votre annonce et ajouté vos services ou prestations.
               </div>
              
             </v-alert>
    
          
        <v-btn 
           to="/espace-coach/annonce/add"
            color="secondary" variant="flat"
            block
            size="large"
            append-icon="mdi-arrow-right"
            >
            <span class="text-left" > Créer mon annonce </span>
             
        </v-btn>

      </div>

      <!-- incomplet -->
      <div v-else-if="!annonce_completed"> 

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

            <v-alert 
               icon="mdi-information-slab-circle"
               class="mb-8" 
               color="success" 
               variant="tonal" 
               density="compact"  >
               <div class="text-left">
                  Vous aurez accès à d'autres options dans le menu 
                  quand vous aurez complété la création de votre annonce et ajouté vos services ou prestations.
               </div>
              
            </v-alert>

        <v-btn 
           to="/espace-coach/annonce/add"
            color="black" 
            variant="flat"
            block
            size="large"
            append-icon="mdi-arrow-right"
            >
            <span class="text-left" >  Compléter mon annonce </span>
            
        </v-btn>

      </div>

      <!-- service -->
        <div v-else-if="!has_service"> 

            <v-alert
                color="info"
                variant="tonal"
                rounded="md"
                class="text-start mb-6" >
                  <div>
                    <h3 class="mb-2 mt-1"> <v-icon icon="mdi-alert" color="secondary" > </v-icon> Vous n'avez pas encore de service </h3> 
                    Pour commencer à recevoir des demandes de rendez-vous, décrivez votre expertise, définissez vos tarifs
                    et indiquez vos disponibilités.
                  </div>
            </v-alert>

             <v-alert 
               icon="mdi-information-slab-circle"
               class="mb-8" 
               color="success" 
               variant="tonal" 
               density="compact"  >
               <div class="text-left">
                  Vous aurez accès à d'autres options dans le menu 
                  quand vous aurez complété la création de votre annonce et ajouté vos services ou prestations.
              </div>
              
             </v-alert>

            <v-btn 
              to="/espace-coach/annonce?tab=services"
                color="black" variant="flat"
                block
                size="large"
                append-icon="mdi-arrow-right"
                >
                <span class="text-left" >  Ajouter des services </span>
            </v-btn>

        </div>
    
        </v-card-text>

      </v-card>


    </div>
</template>

<style scoped lang="scss">

  .services_content{
    max-width: 600px;
    margin: auto;
    margin-bottom: 30px !important ;
    margin-top: 30px !important ;
  }

  .services_card{
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1) !important;
  }

  .services_card_content{
      padding: 40px 30px !important;
  }

  @media (max-width: 600px) {

    .services_content{
      
      margin-bottom: 20px !important ;
      margin-top: 20px !important ;
      
    }

    .services_card_content{
      padding: 20px 10px !important;
    }
  }

</style>
  . 