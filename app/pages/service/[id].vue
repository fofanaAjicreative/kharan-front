
<script setup lang="ts" >
  
  import ServiceReviews from '~/components/coach/ServiceReviews.vue' ;
  import ServiceFormat from '~/components/espace/ServiceFormat.vue' ;

   const { showLoading, hideLoading } = useGlobalLoading() ;
   const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
   import { cleanHtml,cleanAndTruncate, stripHtml } from '~/utils/html'

  const { $api } = useNuxtApp() ;

   import { useDisplay } from 'vuetify' ;
   const { mobile } = useDisplay() ;

   const { truncate } = useText() ;


  const loading = ref(true) ;
  const booking_loading = ref(false) ;
  const router = useRouter() ;

   // ------------------- seo ------------------------------------- 
   
      const page_title = ref('')
      useSeoMeta({ title: page_title })

   // -------------------route param -------------------------------
   
      const route = useRoute()
      let id  = route.params.id as string ;
      if(!id){ navigateTo('/service') ; }

   
   // ------------------- data -------------------------------------


      let  server_error = ref(false) ;
      let  server_error_message = ref("") ;
      const service = ref<any>(null) ;

 
   // ----------------------- get service details  -------------------------------

   function loadServiceDetails(){   

      $api(`/annonces/services/${id}`).then((res :any )=>{
         service.value  = res.data.service ;
         loading.value = false ;
         console.log("service:", service.value );
         // seo
         page_title.value = service.value.title

      }).catch(error=>{
            console.log(error); 
            
            console.log(error); 
            clearNuxtData(); // Optionnel : nettoie le cache Nuxt
            showError({
                statusCode: 404,
                statusMessage: 'Page introuvable',
                fatal: true // Force la redirection complète vers error.vue
            });
      });

   }

   //--------------------------------------------------------------------

 
      function saveBooking(payload :any){ 

         booking_loading.value = true ;
         server_error.value = false ;
         showLoading() ;


         const post_data = {
            booking_date : payload.booking_date ,
            format :  payload.format ,
         }
    

         $api(`/services/${id}/reserve`,{
            method: 'POST',
            body:post_data
         }).then((res :any) =>{
            
           console.log("BOOKED:", res);

            window.location.href = res.payment_url ;
             

            /* showSuccessSnackbar({
               title: 'Réservation réussie',
               message: 'Votre réservation a été effectuée avec succès.'
            }) ; */
           
      
      hideLoading() ;
      

      }).catch(error=>{

         console.log("Error:",error); 

         server_error.value = true ;
         server_error_message.value  = error.message ;
         
         if(error.statusCode == 400){
            server_error_message.value = error.message || 'Données incomplètes ou incorrectes.'
         }

           
         /* showErrorSnackbar({
            title: 'Erreur',
            message: server_error_message.value
         }) ; */

          
      }).finally(()=>{
         hideLoading() ;
         booking_loading.value = false ;
         loading.value = false ;
      });
     
   }
 
/* ---------------------------------------------------------------------------------- */

 
  const toggleDescription  =  (seance :any) => {
      seance.expanded = !seance.expanded ;
  }
 

/* ---------------------------------------------------------------------------------- */

 
   //----------------------- mounted -------------------------------

      onMounted( async () => {  
           loadServiceDetails() ;
       }); 




</script>


<template>

   <v-container class="py-8 pt-4" max-width="1800" >

        <SkeletonPage v-if="loading"  />

        <template v-else>

            <div class="d-flex flex-wrap justify-center ga-4" >

                <!-- CONTENU -->

                <div class="left_side">

                  <v-btn @click="router.back()"
                     class="mb-1"
                     variant="text"
                     prepend-icon="mdi-chevron-left"
                     color="secondaryy"> Retour </v-btn>

                    <v-card class="card_shadow mb-5" >
                        <v-card-text class="card_content">
                           <div class="d-flex justify-space-between align-start flex-wrap ga-4" >
                                 <div class="flex-grow-1">

                                    <h3 class="service_title"> {{ service.title }} </h3>
                                    <div class="service_description" >
                                       {{ service.description }}
                                    </div>

                                    <div class="d-flex flex-wrap ga-2 mt-5 justify-space-between align-end" >
                                        
                                       <!-- format -->
                                       <ServiceFormat :service="service" />
                                       <div v-if="!mobile"  class="service_price">
                                             {{ service.price_ttc }}€    
                                       </div>

                                    </div>

                                 </div>
                     

                           </div>

                        </v-card-text>

                        <v-divider/>

                        <v-card-actions v-if="mobile"  class="pa-4" >
                           
                           <v-spacer/>

                            <div class="service_price" > 
                               {{ service.price_ttc }}€    
                           </div>

                        </v-card-actions>

                     </v-card>

                     <!-- seances -->


                     <v-card class="card_shadow mb-5" >

                        <v-card-text 
                          v-for="(seance, index) in service.seances"  :key="index"
                          class="card_content">

                           <!-- title -->
                           <div class="d-flex align-center">
                              <v-avatar color="info" 
                                size="24" rounded="4" class="mr-2 text-caption font-weight-bold">
                                 {{ Number(index) + 1 }}
                              </v-avatar>

                              <h3 class="seance_title">
                                 {{ seance.title }} 
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

                                    {{ seance.duration }} mins
                                 </v-chip>
                                                            </h3>
                           </div>
                        
                           <!-- description -->
                           <div class="" >
 
                              <template v-if="seance.expanded">
                                 <div v-html="cleanHtml(seance.description)"></div>
                              </template>

                              <template v-else>
                                 <div v-html="cleanAndTruncate(seance.description,500)"></div>
                              </template>

                              <v-btn v-if="seance.description.length>500"
                                 @click="toggleDescription(seance)"
                                 variant="text" 
                                 color="secondary" size="default"
                                 class="toggle_description"
                                 >
                                 {{ seance.expanded ? 'Voir moins' : 'Voir plus' }}
                           </v-btn>

                            </div>
                           <!-- /description -->

                        </v-card-text>

                     </v-card>

                     <!-- /seances -->

                     <!-- avis desktop -->
                       <v-card v-if="service.review_count && !mobile"
                       class="card_shadow mb-5"  >
                        <v-card-text class="pa-0">
                           <ServiceReviews 
                              v-if="service"
                              :service="service" />
                        </v-card-text>
                     </v-card>
                     <!-- /avis -->
                  
                </div>

                <!-- sidebar -->
               <div class="right_side"  >
                     <v-btn v-if="!mobile"
                        to="/coachs"
                        class="mb-1"
                        variant="text"
                        color="secondaryy"> 
                     </v-btn>

                     <v-card class="card_shadow mb-5" >
                        <v-card-text class="pa-5">
                           <BookingServiceSlots 
                           :id="id"  
                           :format="service.format"  
                           :annonce="service.annonce"
                           :booking_loading="booking_loading"  
                           @selectSlot="saveBooking" />
      
                           <v-alert v-if="server_error"
                              class="mt-4" color="warning" density="compact" variant="tonal"
                              icon="mdi-alert-circle-outline" >
                              <template #prepend>
                                 <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                              </template>  {{ server_error_message }}
                           </v-alert>
                        </v-card-text>
                     </v-card>

                     <!-- avis mobile -->
                     <v-card v-if="service.review_count && mobile"
                       class="card_shadow mb-5"  >
                        <v-card-text class="pa-0">
                           <ServiceReviews 
                              v-if="service"
                              :service="service" />
                        </v-card-text>
                     </v-card>
                     <!-- /avis -->


               </div>

            </div>

        </template>


       
        

</v-container>


</template>

<style lang="scss" scoped>

  .left_side{
     width: 800px;
  }


  .right_side{
     width: 500px;
   }
  

  .service_title{
     font-size: 20px ;
     font-weight: bold ;
     margin-top: 0px ;
  }

  
  .seance_title{
     font-size: 16px ;
     margin: 4px;
     font-weight: bold ;
  }


   .service_description{
     font-size: 15px ;
     color: #424242 ;
   }


   .service_price{
     font-size: 20px ;
     font-weight: bold ;
     color: $secondary-color ;
   }



 .slot_btn{
   width: 100%;
   height: 35px;
   border-radius: 8px;
   border-color: #aaa ;
   color: #333 ;
   font-weight: 500 ;
 }

 .v-btn--active {
  transform: scale(1.0);
}
  

   .card_content{
        padding: 30px !important;
   }

   @media screen and (max-width: 600px) {

      .card_content{
         padding: 20px !important;
      }
        
   }

       
</style>