
<script setup lang="ts" >
  
  import FormatReservation from '~/components/espace/FormatReservation.vue' ;
   import JitsiMeeting from '~/components/meet/JitsiMeeting.vue' ;
  
  const { showLoading, hideLoading } = useGlobalLoading() ;
  const {  showSuccessSnackbar, showErrorSnackbar , showWarningSnackbar } = useSnackbar() ;
   const { confirm , reason } = useCancelReservation() ;

   const { user } = useAuth() ;
   const { openChatPanel } = useChat() ;
   const { truncate } = useText() ;
   const { isOnline } = usePresence() ;

  const { formatReservationDuration,formatDateTime } = useDate()

  const { $api } = useNuxtApp() ;

   import { useDisplay } from 'vuetify' ;
   const { mobile,name} = useDisplay() ;

   const loading = ref(true) ;
   const booking_loading = ref(false) ;

  const reservation = ref<any>(null) ;

  
  const router = useRouter() ;

   const canReSchedule = ref(false) ;
   const reschedule_dialog = ref(false) ;


 
// ------------------- seo ------------------------------------- 

      const page_title = ref('Détails reservation')
      useSeoMeta({ title: page_title })

// -------------------route param -------------------------------
      const route = useRoute()
      let id  = route.params.id as string ;
      if(!id){ navigateTo('/service') ; }

 /*------------------------------- meeting ------------------------------------------------ */

   const { canJoin, isUpcoming, timeRemainingText, joinMeeting } = useMeetingStatus(
      () => reservation.value.booking_date_start,
      () => reservation.value.booking_date_end,
      () => reservation.value.meetingUrl ,
      () => reservation.value.id ,
   );

 
/* -------------------------------------------------------------------------------------- */

      function loadReservationDetails(){   

            $api(`/reservations/${id}/get`).then((res :any)=>{

               console.log("RESERVATION:", res.data.reservation);
                
               reservation.value = res.data.reservation ;
               canReSchedule.value = res.data.canReSchedule ;


               if(res.data.comment_service){
                  comment_service.value = res.data.comment_service ;
               }

               if(res.data.comment_coach){
                  comment_coach.value = res.data.comment_coach ;
               }

               can_comment_coach.value = res.data.can_comment_coach ;
               can_comment_service.value = res.data.can_comment_service ;
               
               loading.value = false ;

                



            }).catch(error=>{

               loading.value = false ;
               console.log(error);
                
            })  
 
      }
   /* ------------------------------------------------------------------------------- */

      const toggleDescription  =  (reservation :any) => {
            reservation.service.expanded = !reservation.service.expanded ;
      }
    
 

 /*------------------------------------------------------------------------------- */

    async function cancelReservation (reservation_id :any){


        const accepted = await confirm({
            title: 'Confirmation',
            description: 'Voulez-vous vraiment annuler votre rendez-vous ?'
        })

        if (!accepted) { return } 

        showLoading() ;
    
        const form_data = { reason : reason.value }
   
        $api(`/reservations/${reservation_id}/cancel`,{
            method: 'DELETE',
            body :form_data
           }).then(() =>{

            reservation.value.status = "canceled" ;
            reservation.value.can_cancel = false ;

            showSuccessSnackbar({
                title: 'Succès',
                message: "Le statut est mis à jour."
            }) ;

            hideLoading() ;

          }).catch((error:any)=>{
            hideLoading() ;
            console.log("Error:",error); 
            
            let server_error_message  = error.message ;
            if(error.statusCode == 400){
              server_error_message = 'Données incomplètes ou incorrectes.'
            }

            showWarningSnackbar({
                title: 'Erreur',
                message: server_error_message
            }) ;

            
          }) ; 
   };
 


/* ----------------------------------------------------------------------------------------- */

  function rescheduleReservation(){
        reschedule_dialog.value = true ;
  }


 /*----------------------------------- new reservation---------------------------------------------------------- */
 
      function saveBooking(payload :any){

         const post_data = {
            booking_date : payload.booking_date ,
            format : "online" ,
         }

         showLoading() ;
         
         $api(`/services/${reservation.value.commande.id}/add_reservation`,{
            method: 'POST',
            body:post_data
         }).then((res :any) =>{
            
           navigateTo('/espace-client/reservations')

      }).catch(error=>{

            let error_message  = error.message ;

            if(error.statusCode == 400){
               error_message.value = 'Données incomplètes ou incorrectes.'
            }

            showErrorSnackbar({
               title: 'Erreur',
               message: error_message 
            }) ;

        }).finally(()=>{
            hideLoading() ;
            // reschedule_dialog.value = false ;
            booking_loading.value = false ;

            
        }) ;

              
    }

/* ----------------------------------------------------------------------------- */

      async function ContactClient(){

          const conversation = {
            conversation : null ,
            user : reservation.value.annonce.user ,
            minimized : false ,
            unreadCount : 0 ,
        }

        openChatPanel(conversation,name.value) ;
        await nextTick() ;

      }


/*----------------------------------- comment --------------------------------------------------*/


   const can_comment_coach = ref(false) ;
   const can_comment_service = ref(false) ;


   const comment_service_dialog = ref(false) ;
   const comment_coach_dialog = ref(false) ;


   let comment_service = ref({
      rating : 0,
      comment:""
   })

   let comment_coach = ref({
      rating : 0,
      comment:""
   })


   function saveCommentService(){

      if(
         !comment_service.value.comment ||
         !comment_service.value.comment.trim().length ||
         comment_service.value.rating<=0){
         
         return ;
      } 

      const post_data = {
         rating : Number(comment_service.value.rating) ,
         comment : comment_service.value.comment ,
      }

      showLoading() ;
      
      $api(`/services/${reservation.value.service.id}/review`,{
         method: 'POST',
         body:post_data
      }).then((res :any) =>{
         
         comment_service.value = res.data.review ;
         comment_service_dialog.value = false ;

      }).catch(error=>{

            let error_message  = error.message ;

            if(error.statusCode == 400){
               error_message.value = 'Données incomplètes ou incorrectes.'
            }

            showErrorSnackbar({
               title: 'Erreur',
               message: error_message 
            }) ;

        }).finally(()=>{
            hideLoading() ;
            comment_service_dialog.value = false ;
        }) ;

              
    }
 


    function saveCommentCoach(){

      if(
         !comment_coach.value.comment ||
         !comment_coach.value.comment.trim().length ||
         comment_coach.value.rating<=0){
         
         return ;
      } 

      const post_data = {
         rating : Number(comment_coach.value.rating) ,
         comment : comment_coach.value.comment ,
      }

      showLoading() ;
      
      $api(`/annonces/${reservation.value.annonce.id}/review`,{
         method: 'POST',
         body:post_data
      }).then((res :any) =>{
         
         comment_coach.value = res.data.review ;
         comment_coach_dialog.value = false ;

      }).catch(error=>{

            let error_message  = error.message ;

            if(error.statusCode == 400){
               error_message.value = 'Données incomplètes ou incorrectes.'
            }

            showErrorSnackbar({
               title: 'Erreur',
               message: error_message 
            }) ;

        }).finally(()=>{
            hideLoading() ;
            comment_coach_dialog.value = false ;
        }) ;

              
    }

   /* ----------------------------------------------------------------------------- */

      const canJoinMeeting = computed(() => {
            //return true ;
            return (
               (reservation.value.status == ReservationStatus.APPROVED) && 
               (reservation.value.format == ReservationFormat.ONLINE) && 
               canJoin.value 
            )
      });

    /* --------------------------------------------------------------------------------------- */

   
      onMounted( async () => {  
           loadReservationDetails() ;

         }); 


   /* --------------------------------------------------------------------------------------- */


      function onMeetingJoined() {
          console.log('Connexion réussie');
      }

      function onMeetingLeft() {
         console.log('Participant déconnecté');
      }

      function onMeetingError(message: string) {
         console.error(message);
      }


</script>


<template>

   <v-container class="py-8 pt-4" max-width="1800" >

       <SkeletonDashboard v-if="loading"  />

        <template v-else>
 

          <v-btn @click="router.back()"
                     class="mb-1"
                     variant="text"
                     prepend-icon="mdi-chevron-left"
                     color="secondaryy"> Retour </v-btn>

            <div class="d-flex flex-wrap ga-4" >

                <!-- sidebar -->
               <div class="left_side"  >

                  <v-card class="card_shadow mb-0" >
                     <v-card-text class="pa-4 ma-auto">
                        
                     <div class="d-flex ga-4">

                           <NuxtLink :to="`/coach/${reservation.annonce.id}`">
                              <div class="position-relative">
                                 <v-avatar  size="75" rounded="8" >
                                    <v-img  :src="reservation.annonce.photo?reservation.annonce.photo.media_url:'/images/profile.png'"  />
                                 </v-avatar>
                                 <div v-if="isOnline(reservation.annonce.user.id)" class="online" > </div>
                              </div>
                           </NuxtLink>

                           <div>

                              <p  class="coach_name"> {{ reservation.annonce.user.firstname }} {{ reservation.annonce.user.lastname }} </p>
                              <p class="coach_email"> {{ reservation.annonce.user.email }}</p>
                              <p class="coach_email text-info"> {{ reservation.annonce.title }} </p>

                              <v-btn 
                                 @click="ContactClient()"
                                 class="mt-2"
                                 variant="tonal" 
                                 color="info" 
                                 prepend-icon="mdi-message-outline"
                                 size="default" 
                                 block
                                 > Contacter </v-btn>


                                 <!-- avis -->
                              <div v-if="can_comment_coach"
                                    class="mt-4">
                                    <div  v-if="comment_coach.rating"
                                          class="d-flex flex-column  align-center "  >
                                          <v-rating
                                             :model-value="comment_coach.rating"
                                             readonly
                                             density="compact"
                                             color="amber"
                                             size="23"
                                             half-increments
                                          />
                                          <v-btn 
                                             @click="comment_coach_dialog=true"
                                             block 
                                             variant="tonal" 
                                             color="secondary" 
                                             prepend-icon="mdi-comment-text-outline"
                                             append-icon="mdi-pencil"
                                             class="mt-1"
                                             size="default"> Votre avis  </v-btn>
                                    </div>
                                    <v-btn v-else
                                          @click="comment_coach_dialog=true"
                                          block
                                          variant="tonal" 
                                          color="secondary" 
                                          prepend-icon="mdi-star-outline"
                                          append-icon="mdi-comment-text-outline"
                                          size="default"> Votre avis  
                                    </v-btn>

                                 </div>
                                 <!-- /avis -->
      
                           </div>
                        </div>

                     </v-card-text>
                  </v-card>

               </div>

               <!-- right side -->
                <div class="right_side">
 
                    <v-card class="card_shadow mb-5" >
                        <v-card-text class="pa-6">

                           <h3 class="service_title"> 
                              {{ reservation.service.title }} 

                              <v-btn
                                 :to="'/service/' + reservation.service.id"
                                 color="info" size="small" variant="text" icon="mdi-search-web" >
                              </v-btn>
                           
                           </h3>
                           <div class="service_description" >

                              {{ reservation.service.expanded ? reservation.service.description : truncate(reservation.service.description, 200) }}
                           
                              <v-btn v-if="reservation.service.description.length>200"
                                    variant="text" color="secondary" size="small"
                                    class="toggle_description"
                                    @click="toggleDescription(reservation)" >
                                    {{ reservation.service.expanded ? 'Voir moins' : 'Voir plus' }}
                                </v-btn>
                           </div>

                           <div class="d-flex justify-space-between align-start flex-wrap ga-4" >
                                

                           </div>

                        </v-card-text>
                     </v-card>

                     <v-card class="card_shadow mb-5" >
                        <v-card-text class="pa-6 ma-auto">

                           <v-row>
                              <v-col md="8">

                                    <!-- Payment -->
                                          <div
                                             v-if="reservation.commande.payment_status === 'paid'"
                                             class="payment-badge"
                                          >
                                             <v-icon size="14">
                                                mdi-credit-card-check
                                             </v-icon>

                                             {{ reservation.commande.total_ttc }} &euro; , {{ formatDateTime(reservation.created) }}
                                          </div>
                                    <!-- / Payment -->

                                    <!-- date -->
                                    <div class="d-flex flex-wrap align-center mt-0">
                                          <div class="service_date" > 
                                             <v-icon size="16" 
                                                icon="mdi-calendar-outline"
                                                color="info">
                                             </v-icon>
                                             
                                             {{ formatReservationDuration( reservation.booking_date_start, reservation.booking_date_end ) }}

                                           </div>

                                           <!-- Session -->
                                             <v-chip
                                                size="small"
                                                variant="tonal"
                                                color="secondary"
                                             >
                                                <template #prepend>
                                                      <v-icon>
                                                         mdi-layers-outline
                                                      </v-icon>
                                                </template>

                                                <span v-if="reservation.commande.sceance_number === 1">
                                                      Séance unique
                                                </span>

                                                <span v-else>
                                                      Séance
                                                      {{ reservation.commande.sceance_used }}/{{ reservation.commande.sceance_number }}
                                                </span>
                                             </v-chip>
                                          <!-- /Session -->

                                    </div>

                                     <!-- service type -->
                                    <div>
                                          <FormatReservation :reservation="reservation" />

                                          <v-btn 
                                             v-if="canJoinMeeting"
                                             @click="joinMeeting"
                                             size="default"
                                             color="secondary"
                                             variant="flat" 
                                             prepend-icon="mdi-video-outline"
                                             append-icon="mdi-phone-hangup"
                                             
                                             class="mt-1 ml-2" >
                                             Rejoindre la visioconférence
                                          </v-btn>

                                    </div>
                                    <div class="mt-4">
                                           <v-btn 
                                           v-if="canReSchedule"
                                             @click="rescheduleReservation()" 
                                             size="default"
                                             color="info"
                                             variant="outlined" 
                                             prepend-icon="mdi-calendar-refresh" 
                                             append-icon="mdi-arrow-right"
                                             class="mt-1 ml-2" 
                                             >
                                             {{ 
                                                reservation.commande.sceance_used==0?
                                                'Un autre rendez-vous':'Prochain rendez-vous' 
                                                }} 
                                          </v-btn>
                                    </div>

                                 <v-divider class="mt-8 mb-2 d-sm-none"> </v-divider>

                              </v-col>
                              <!-- /left -->

                               <!-- right -->
                           <v-col md="4">

                              <div class="d-flex flex-column align-center pa-2">

                                 <!-- status -->
                                 <div class="d-flex justify-space-between ga-2 mb-1">
                                    
                                   <v-btn v-if="reservation.status=='waiting'"
                                    variant="tonal" 
                                    color="orange" 
                                    width="150px" rounded="pill"
                                    
                                    prepend-icon="mdi-clock-outline"
                                    size="small"> En attente </v-btn>

                                    <v-btn v-else-if="reservation.status=='approved'"
                                    variant="tonal" 
                                    color="info" 
                                    width="150px" rounded="pill"
                                   
                                    prepend-icon="mdi-check-circle-outline"
                                    size="small"> Approuvé </v-btn>

                                    <v-btn v-else-if="reservation.status=='rejected'"
                                    variant="tonal" 
                                    color="error" 
                                    width="150px" rounded="pill"
                                    
                                    prepend-icon="mdi-close-circle-outline"
                                    size="small"> Rejeté </v-btn>

                                    <v-btn v-else-if="reservation.status=='canceled'"
                                    variant="tonal" 
                                    color="error" 
                                    width="150px" rounded="pill"
                                    
                                    prepend-icon="mdi-cancel"
                                    size="small"> Annulé </v-btn>

                                    <v-btn v-else-if="reservation.status=='completed'"
                                    variant="tonal" 
                                    color="success" 
                                    width="150px" rounded="pill"
                                    
                                    prepend-icon="mdi-check-all"
                                    size="small"> Terminé </v-btn>
                                 </div>
                                 <!-- /status -->
                                 
                                 <!--  status actions -->
                                 <v-btn v-if="reservation.can_cancel"
                                    @click="cancelReservation(reservation.id)"
                                    variant="outlined" 
                                    color="error" 
                                    append-icon="mdi-close-box"
                                    width="150px" rounded="4"
                                    spaced="both"
                                    class="mt-1"
                                    size="small"> Annuler </v-btn>
                                 <!--  /status actions -->
                                  
                              </div>

                              <!-- avis -->
                               <div v-if="can_comment_service"
                                     class="d-flex flex-column align-center mt-2">
                                    <div  v-if="comment_service.rating"
                                        class="d-flex flex-column  align-center "  >
                                          <v-rating
                                             :model-value="comment_service.rating"
                                             readonly
                                             density="compact"
                                             color="amber"
                                             size="23"
                                             half-increments
                                          />
                                          <v-btn 
                                             @click="comment_service_dialog=true"
                                             width="150px" 
                                             variant="tonal" 
                                             color="secondary" 
                                             prepend-icon="mdi-comment-text-outline"
                                             append-icon="mdi-pencil"
                                             class="mt-1"
                                             size="default"> Votre avis  </v-btn>
                                    </div>
                                    <v-btn v-else
                                       @click="comment_service_dialog=true"
                                       width="150px" rounded="4"
                                       variant="tonal" 
                                       color="secondary" 
                                       prepend-icon="mdi-star-outline"
                                       append-icon="mdi-comment-text-outline"
                                       size="default"> Votre avis  
                                 </v-btn>

                               </div>
                               <!-- /avis -->
                                 
                           </v-col>
                        </v-row>

                        </v-card-text>
                     </v-card>

                      <!-- cancel reason -->
                      <v-card v-if="reservation.cancel_user_id" 
                        color="orange"
                        class="card_shadow card_reason mb-5" >

                        <div class="pa-2 pb-0">
                           Annulé par <b>{{ reservation.cancel_user_id==user.id ?'Moi':' le client'   }}</b> 
                           , {{ formatDateTime(reservation.cancel_date) }}
                        </div>
                        
                        <v-card-text class="">
                           {{  reservation.cancel_reason }}
                        </v-card-text>
                     </v-card>
                     <!-- /cancel reason -->

                      <!-- reject reason -->
                      <v-card 
                        v-if="reservation.commande.reject_user_id" 
                        color="warning"
                        class="card_shadow card_reason mb-5" >

                        <div class="pa-2 pb-0">
                           Rejeté par <b>{{ reservation.commande.reject_user_id==user.id ?'Moi':' le client'   }}</b> 
                           , {{ formatDateTime(reservation.commande.reject_date) }}
                        </div>
                        
                        <v-card-text class="">
                           {{  reservation.commande.reject_reason }}
                        </v-card-text>
                     </v-card>
                     <!-- /reject reason -->

                  
                </div>
                <!-- / right side -->

            </div>

        </template>

   </v-container>


      <!-- new rdv dialog -->
            <v-dialog
               v-model="reschedule_dialog"
               max-width="600"
               persistent >
               <v-card rounded="10">

                  <v-toolbar color="#F8F8F8">

                        <v-toolbar-title> Prendre rendez-vous </v-toolbar-title>
                        <v-toolbar-items>
                           <v-btn
                              text="Fermer"
                              variant="text"
                              prepend-icon="mdi-close"
                              @click="reschedule_dialog = false" ></v-btn>
                        </v-toolbar-items>

                  </v-toolbar>

                  <v-card-text class="pa-8">
                     <div class="text-center">
                        <BookingServiceSlots 
                           :id="reservation.service.id"  
                           :format="reservation.service.format"  
                           :annonce="reservation.annonce"
                           :booking_loading="booking_loading"  
                           :commande_id="reservation.commande.id" 
                           @selectSlot="saveBooking" />
                     </div>
                  </v-card-text>

               </v-card>
            </v-dialog>

      <!-- / new rdv -->

         <!-- comment service dialog -->
            <v-dialog
               v-model="comment_service_dialog"
               max-width="600"
               min-width="300"
               persistent >
               <v-card rounded="10">

                  <v-toolbar color="#F8F8F8">

                        <v-toolbar-title> Votre avis sur le service </v-toolbar-title>
                        <v-toolbar-items>
                           <v-btn
                              variant="text"
                              icon="mdi-close"
                              @click="comment_service_dialog = false" ></v-btn>
                        </v-toolbar-items>

                  </v-toolbar>

                  <v-card-text class="pa-8">

                     <h3 class="mt-0"> {{ reservation.service.title }} </h3>

                     <v-row>
                        <v-col cols="12" md="12">
                           <v-rating v-model="comment_service.rating" color="amber"
                              density="compact"
                               half-increments
                              size="medium" >
                           </v-rating>
                        </v-col>
                        
                        <v-col cols="12" md="12">
                              <v-textarea 
                                 v-model="comment_service.comment"
                                 variant="outlined"
                                 rows="4"
                                 label="Votre commentaire">
                              </v-textarea> 
                        </v-col>

                        <v-col cols="12">
                              <div class="mt-0">
                              <v-btn 
                                 :disabled="(!comment_service.comment.length || comment_service.rating==0)"
                                 :loading="loading" 
                                 @click="saveCommentService()" 
                                 variant="flat" 
                                 color="secondary" 
                                 block
                                 > Enregistrer
                                 </v-btn>
                              </div>
                        </v-col>

                        </v-row>

                  </v-card-text>
               </v-card>
            </v-dialog>

      <!-- /comment service dialog -->

      <!-- comment coach dialog -->

       <v-dialog
            v-model="comment_coach_dialog"
            max-width="800"
            min-width="300"
            persistent >
            <v-card rounded="10">

               <v-toolbar color="#F8F8F8">

                     <v-toolbar-title> Votre avis sur le coach </v-toolbar-title>
                     <v-toolbar-items>
                        <v-btn
                           variant="text"
                           icon="mdi-close"
                           @click="comment_coach_dialog = false" ></v-btn>
                     </v-toolbar-items>

               </v-toolbar>

                  <v-card-text class="pa-8">

                     <v-row>
                           <v-col md="4" class="hidden-sm-and-down">

                              <div class="position-relative" style="width: 250px; margin: auto;">
                                 <v-avatar  size="100" rounded="10" >
                                       <v-img  :src="reservation.annonce.photo?reservation.annonce.photo.media_url:'/images/profile.png'"  />
                                 </v-avatar>
                               </div>
                               <div style="margin: auto;margin-top: 10px;"   >
                                 <p  class="coach_name"> {{ reservation.annonce.user.firstname }} {{ reservation.annonce.user.lastname }} </p>
                                 <p class="coach_email"> {{ reservation.annonce.user.email }}</p>
                                 <p class="coach_email text-info"> {{ reservation.annonce.title }} </p>
                               </div>

                           </v-col>
                           <v-col md="8">

                              <v-row>
                                    <v-col cols="12" md="12">
                                      <v-rating v-model="comment_coach.rating" color="amber"
                                        density="compact" half-increments
                                        size="medium" >
                                      </v-rating>
                                    </v-col>
                                   
                                    <v-col cols="12" md="12">
                                         <v-textarea 
                                             v-model="comment_coach.comment"
                                             variant="outlined"
                                             rows="4"
                                             label="Votre commentaire">
                                          </v-textarea> 
                                    </v-col>
 
                                    <v-col cols="12">
                                        <div class="mt-0">
                                          <v-btn 
                                             :disabled="(!comment_coach.comment.length || comment_coach.rating==0)"
                                             :loading="loading" 
                                             @click="saveCommentCoach()" 
                                             variant="flat" 
                                             color="secondary" 
                                             block
                                             > Enregistrer
                                            </v-btn>
                                        </div>
                                    </v-col>

                                  </v-row>
                           </v-col>
                     </v-row>

                  </v-card-text>
               </v-card>
            </v-dialog>
      <!-- comment coach dialog -->


</template>
 

<style lang="scss" scoped>

  .online{
        width: 13px;
        height: 13px;
        border-radius:50%;
        background:#28c840;
        position:absolute;
        right:4px;
        bottom:4px;
        border:0px solid white;
    }

 
   .left_side {
       flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 300px;
      max-width: 350px;
   }

   .right_side {
       flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 350px;
      min-width: 300px;
   }

   .coach_name{
        margin: 0px ;
        font-size: 14px ;
        font-weight: bold ;
        color: #424242;
    }

   .coach_email{
      margin: 0px ;
      font-size: 12px ;   
   }
  

  .service_title{
     font-size: 20px ;
     font-weight: bold ;
     margin: 0px;
     margin-bottom: 4px ;
     line-height: normal;
  }


   .service_description{
      margin-top: 20px;
     font-size: 14px ;
     color: #424242 ;
   }


   .service_price{
     font-size: 20px ;
     font-weight: bold ;
     color: $secondary-color ;
   }


   .service_date{
         margin-bottom: 6px;
        margin-top: 6px;
        font-size: 14px ;
        color: #424242;
        font-weight: bold ;
        padding: 4px;
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

/* -------------------------------------------------------------------- */



/* =========================================================
   PAYMENT
   ========================================================= */

.payment-badge {

    display: inline-flex;

    align-items: center;

    gap: 5px;

    width: fit-content;

    padding: 4px 8px;

    border-radius: 8px;

    background: #3b82f6;

    color: white;

    font-size: 15px;

    font-weight: 500;

    margin-bottom: 8px;
}




@media (max-width: 700px) {

  .payment-badge {
    font-size: 12px;
  }


  .service_title{
     font-size: 18px ;
   }


   .service_description{
     font-size: 13px ;
   }

   .service_date{
     font-size: 13px;
  }


   /* .coach_name{
      font-size: 16px ;
   }

   .coach_email{
      font-size: 13px ;   
   } */
  
}


.card_reason{
   font-size: 14px ;
   border-radius: 2px ;
}
  
       
</style>