
<script setup lang="ts" >
  
  import FormatReservation from '~/components/espace/FormatReservation.vue' ;
   import { Role, ReservationStatus,ReservationFormat } from '~/enums'

  const { showLoading, hideLoading } = useGlobalLoading() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;

   
   // ------------------- seo ------------------------------------- 

      const page_title = ref('Détails reservation')
      useSeoMeta({ title: page_title })


      import { useDisplay } from 'vuetify' ;
      const { mobile,name} = useDisplay() ;

         const { user } = useAuth() ;
         const { openChatPanel } = useChat() ;
         const { truncate } = useText() ;
         const { isOnline } = usePresence() ;

         const { formatReservationDuration,formatDateTime } = useDate()
         const { confirm , reason } = useCancelReservation() ;


      const { $api } = useNuxtApp() ;

      

      const loading = ref(true) ;
      const reservation = ref<any>(null) ;
      const router = useRouter() ;


/*------------------------------- meeting ------------------------------------------------ */

 const { canJoin, isUpcoming, timeRemainingText, joinMeeting } = useMeetingStatus(
    () => reservation.value.booking_date_start,
    () => reservation.value.booking_date_end,
    () => reservation.value.meetingUrl ,
    () => reservation.value.id ,
);



  /* ----------------------------  change status ------------------------------------------ */

        const statusOptions = computed(() => {

            const options = [];

            if (reservation.value.can_approve) {
                options.push({
                    label: 'Approuver',
                    value: 'approved'
                });
            }

            if (reservation.value.can_complete) {
                options.push({
                    label: 'Terminer',
                    value: 'completed'
                });
            }

            if (reservation.value.can_cancel) {
                options.push({
                    label: 'Annuler',
                    value: 'canceled'
                });
            }

            if (reservation.value.can_reject) {
                options.push({
                    label: 'Rejeter',
                    value: 'rejected'
                });
            }

            return options;

         });


/*------------------------------------------------------------------------------- */
     

   // -------------------route param -------------------------------
      const route = useRoute()
      let id  = route.params.id as string ;
      if(!id){ navigateTo('/service') ; }

 
   /* -------------------------------------------------------------------------------------- */

      function loadReservationDetails(){   

            $api(`/coach/reservations/${id}/get`).then((res :any)=>{

               console.log("RESERVATION:", res.data.reservation);
                
               reservation.value = res.data.reservation ;
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

    async function changeStatus (reservation_id :any , new_status :any){

       let form_data = { 
            status : new_status ,
            reason : reason.value
        }

        if(new_status=="canceled"){

            const accepted = await confirm({
                title: 'Confirmation',
                description: "Voulez-vous vraiment annuler ce rendez-vous ? Le client pourra prendre un autre rendez-vous."
            })

            if (!accepted) { return } 

            form_data = { 
                status : new_status ,
                reason : reason.value
            }

        }else if(new_status=="rejected"){


            const accepted = await confirm({
                title: 'Confirmation',
                description: "Voulez-vous definivement rejeter ce rendez-vous ? Cela impliquera le remboursement du client."
            })

            if (!accepted) { return } 

            form_data = { 
                status : new_status ,
                reason : reason.value
            }

        }


        showLoading() ;
       
        $api(`coach/reservations/${reservation_id}/change_status`,{
            method: 'POST',
            body :form_data
          }).then((res :any) =>{

            reservation.value = res.data.reservation ;

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

            showErrorSnackbar({
                title: 'Erreur',
                message: server_error_message
            }) ;

            
          }) ; 
   };

      /* ----------------------------------------------------------------------------- */

      async function ContactClient(){

         const conversation = {
               conversation : null ,
               user : reservation.value.user ,
               minimized : false ,
               unreadCount : 0 ,
         }

         openChatPanel(conversation,name.value) ;
         await nextTick() ;

      }

  /* ----------------------------------------------------------------------------- */

     
      const canJoinMeeting = computed(() => {
             
            return(

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



            <!-- <v-card>
               <v-card-title> Ma visioconférence </v-card-title>

               <ClientOnly>
                  <JitsiMeeting
                     :reservation-id="reservation.id"
                     @joined="onMeetingJoined"
                     @left="onMeetingLeft"
                     @error="onMeetingError"
                  />
               </ClientOnly>
            </v-card> -->


 
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

                     <div class="position-relative">

                        <v-avatar  size="75" rounded="8" >
                           <v-img  :src="reservation.user.photo?reservation.user.photo.media_url:'/images/profile.png'"  />
                        </v-avatar>

                        <div v-if="isOnline(reservation.user.id)" class="online" > </div>

                     </div>

                     <div>
                        <p  class="coach_name"> {{ reservation.user.firstname }} {{ reservation.user.lastname }} </p>
                        <p class="coach_email"> {{ reservation.user.email }}</p>

                        <v-btn 
                           @click="ContactClient()"
                           class="mt-2"
                           variant="tonal" 
                           color="info" 
                           prepend-icon="mdi-message-outline"
                           size="default" 
                           block > Contacter </v-btn>

                        <!-- <v-btn 
                           variant="tonal" 
                           color="secondary" 
                           prepend-icon="mdi-calendar-outline"
                           class="mt-1"
                           size="default" 
                           block
                           > Reservations </v-btn> -->

                        </div>

                     </div>

                     </v-card-text>
                  </v-card>

                  
               </div>

               <!-- right side -->
                <div class="right_side">
 
                    <v-card class="card_shadow mb-4" >
                        <v-card-text class="pa-6">

                           <h3 class="service_title"> {{ reservation.service.title }} </h3>
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
                              <v-col lg="8">

                                    <!-- Payment -->
                                          <div
                                             v-if="reservation.commande.payment_status === 'paid'"
                                             class="payment-badge"
                                          >
                                             <v-icon size="14">
                                                mdi-credit-card-check
                                             </v-icon>

                                             {{ reservation.commande.total_coach }} &euro; , {{ formatDateTime(reservation.created) }}
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

                                 <v-divider class="mt-8 mb-2 d-sm-none"> </v-divider>

                              </v-col>
                              <!-- /left -->

                               <!-- right -->
                               <v-col lg="4">

                                 <div class="d-flex flex-column align-center pa-2">
                                          <!-- status -->
                                          <div class="d-flex justify-space-between ga-2 mb-2">
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
                                             <v-menu v-if="statusOptions.length" >

                                                <template #activator="{ props }">
                                                      <v-btn v-bind="props"  
                                                         append-icon="mdi-dots-vertical"
                                                         size="small"
                                                         color="secondary" 
                                                         variant="outlined" 
                                                         spaced="both"
                                                         class="mt-0" >
                                                         Changer statut
                                                      </v-btn>
                                                </template>
                                                <v-list>
                                                      <v-list-item v-for="item in statusOptions" :key="item.value"
                                                         @click="changeStatus(reservation.id,item.value)" >
                                                          
                                                         <template #append >
                                                            <v-icon v-if="item.value === 'approved'" color="info" icon="mdi-check-bold" />
                                                            <v-icon v-else-if="item.value === 'rejected'" color="error" icon="mdi-cancel" />
                                                            <v-icon v-else-if="item.value === 'canceled'" color="error" icon="mdi-close-box" />
                                                            <v-icon v-else-if="item.value === 'completed'" color="success" icon="mdi-checkbox-marked-outline" />
                                                            <v-icon v-else-if="item.value === 'waiting'" color="orange" icon="mdi-clock-outline" />
                                                         </template>

                                                         <v-list-item-title> {{ item.label }} </v-list-item-title>
                                                      </v-list-item>
                                                </v-list>
                                             </v-menu>
                                             <!--  /status actions -->

                                 </div>
                                 
                              </v-col>

                           </v-row>

                          

                        </v-card-text>
                     </v-card>

                     <!-- cancel reason -->
                      <v-card v-if="reservation.cancel_user_id" 
                        class="card_shadow card_reason mb-5"
                        color="orange"
                        >

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
                      <v-card v-if="reservation.commande.reject_user_id" 
                        color="warning"
                        class="card_shadow card_reason mb-5"
                         >

                        <div class="pa-2 pb-0">
                           Rejeté par <b>{{ reservation.commande.reject_user_id==user.id ?'Moi':' le client'   }}</b> 
                           {{ formatDateTime(reservation.commande.reject_date) }}
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