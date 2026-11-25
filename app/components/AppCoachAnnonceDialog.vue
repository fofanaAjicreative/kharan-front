<script setup lang="ts">

   const { user } = useAuth();

    const {
        dialog,
        has_annonce,
        annonce_completed,
        has_service,
        accept,
        cancel
    } = useAnnonceDialog()


   const confirm = (url :string)=>{
        accept() ;
        navigateTo(url) ;
   }

</script>


<template>
   
   <v-dialog
    v-model="dialog"
    max-width="520"
    persistentt >
    <v-card rounded="4">
    <v-card-text class="text-center pa-8">


       <div class="mb-5">
        <h2 class="title">
       
        Bonjour {{ user.firstName }} {{ user.lastName.substring(0, 1)}}.  
        <!-- <v-icon icon="mdi-handshake-outline"/> -->  </h2>
          
        </div>
      
      <h4 class="description ">
        Votre profil est presque prêt 
        <!-- <v-icon icon="mdi-star-shooting-outline" color="secondary" />  -->
      </h4>



          <!-- annonce  -->
        <div  v-if="!has_annonce">
            <v-alert
                color="info"
                variant="tonal"
                rounded="md"
                class="text-start mb-6" >
                  <div>
                    <h3 class="mb-2 mt-1"> <v-icon icon="mdi-alert" color="secondary" > </v-icon> Votre n'avez pas encore d'annonce </h3> 
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
            @click="confirm('/espace-coach/annonce/add')"
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
            @click="confirm('/espace-coach/annonce/add')"
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
               @click="confirm('/espace-coach/annonce?tab=services')"
                color="black" variant="flat"
                block
                size="large"
                append-icon="mdi-arrow-right"
                >
                <span class="text-left" >  Ajouter des services </span>
            </v-btn>

        </div>
    
    
      <!-- --------------------------------------------------------- -->
      <v-btn
        variant="text"
        class="mt-3"
        @click="cancel " >
        Plus tard
      </v-btn>

    </v-card-text>

  </v-card>
</v-dialog>

</template>