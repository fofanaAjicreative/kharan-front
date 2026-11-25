<script setup lang="ts">
 
 import StatusReservation from '~/components/espace/StatusReservation.vue'
 import FormatReservation from '~/components/espace/FormatReservation.vue' ;
 import CancelReservationDialog from '~/components/espace/CancelReservationDialog.vue'

 import { useDisplay } from 'vuetify' ;
 const { mobile,name} = useDisplay() ;
 
  const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar, showErrorSnackbar , showWarningSnackbar } = useSnackbar() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

  const { formatReservationDuration ,formatDateTime} = useDate()

  const { confirm , reason } = useCancelReservation() ;
  
  const { openChatPanel } = useChat() ;
  const { isOnline } = usePresence() ;

  const booking_loading = ref(false) ;
  const reschedule_dialog = ref(false) ;


/* -------------------------------------- props  ----------------------------------------------------- */

    const props = defineProps({
        reservation:{
            type:Object,
            required:true
        },
         statusOptions:{
            type:Object,
            required:true
        },
    }) ;

    
    const emit = defineEmits(['reject','newReservation']) ;
 
 /*--------------------------------------------------------------------------------------------- */

    async function rejectReservation(reservation_id :any){

        const accepted = await confirm({
            title: 'Confirmation',
            description: 'Voulez-vous definivement annuler votre commande ? Cela impliquera le remboursement.'
        })

        if (!accepted) { return } 

        showLoading() ;
    
        const form_data = { reason : reason.value }

        $api(`/reservations/${reservation_id}/reject`,{
            method: 'DELETE',
            body :form_data
           }).then(() =>{

             props.reservation.status = "canceled" ;
             props.reservation.can_cancel = false ;

            showSuccessSnackbar({
                title: 'Succès',
                message: "Le statut est mis à jour."
            }) ;

            emit('reject', { reservation_id: reservation_id })

             
          }).catch((error:any)=>{
          
            console.log("Error:",error); 
            
            let server_error_message  = error.message ;
            if(error.statusCode == 400){
              server_error_message = 'Données incomplètes ou incorrectes.'
            }

            showWarningSnackbar({
                title: 'Erreur',
                message: server_error_message
            }) ;

            
          }).finally(()=>{
                hideLoading() ;
          }) ; 
   };

 /*----------------------------------- new reservation---------------------------------------------------------- */
 
 function saveBooking(payload :any){

         const post_data = {
            booking_date : payload.booking_date ,
            format : "online" ,
         }

         showLoading() ;
         
         $api(`/services/${props.reservation.commande.id}/add_reservation`,{
            method: 'POST',
            body:post_data
         }).then((res :any) =>{
            
           
            emit('newReservation', {  }) ;
            

      }).catch(error=>{

            console.log("Error:",error); 

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
            user : props.reservation.annonce.user ,
            minimized : false ,
            unreadCount : 0 ,
        }

        openChatPanel(conversation,name.value) ;
        await nextTick() ;

    }


/* ----------------------------------------------------------------------------------------- */

  function rescheduleReservation(){
        reschedule_dialog.value = true ;
  }

/* ----------------------------------------------------------------------------------------- */


</script>

<template>
    <div class="reservation-card">

        <!-- ================= CLIENT ================= -->
        <div class="client-section">

            <div class="client-info">

                <div class="avatar-wrapper">
                    <v-avatar
                        size="72"
                        rounded="8"
                    >
                        <v-img
                            :src="reservation.annonce.photo?
                                    reservation.annonce.photo.media_url
                                    : '/images/profile.png'"
                        />
                    </v-avatar>

                    <span
                        v-if="isOnline(reservation.annonce.user.id)"
                        class="online-indicator"
                    > </span>
                    
                </div>

                <div class="client-details">

                    <div class="client-name">
                        {{ reservation.annonce.user.firstname }}
                        {{ reservation.annonce.user.lastname }}
                    </div>

                    <div class="client-email">
                        {{ reservation.annonce.user.email }}
                    </div>

                    <v-btn
                        @click="ContactClient()"
                        variant="tonal"
                        color="info"
                        size="small"
                        prepend-icon="mdi-message-outline"
                        class="contact-btn"
                        block
                    >
                        Contacter
                    </v-btn>

                </div>

            </div>

        </div>


        <!-- ================= RESERVATION ================= -->
        <div class="reservation-content">

            <!-- Service -->
            <div class="service-title">
                {{ reservation.service.title }}
            </div>


            <!-- Payment -->
            <div
                v-if="reservation.commande.payment_status === 'paid'"
                class="payment-badge"
            >
                <v-icon size="14">
                    mdi-credit-card-check
                </v-icon>

                {{ reservation.commande.total_ttc }}€ , {{ formatDateTime(reservation.created) }}
            </div>


            <!-- Date -->

             <div class="reservation-meta">

                <span class="reservation-prev text-info text-bold"> Precédente séance, </span>
                <div class="reservation-date">
                    <v-icon size="16" 
                    :color="reservation.status == ReservationStatus.COMPLETED?'success':'error'"
                    > mdi-calendar-outline </v-icon>
                    {{ formatReservationDuration( reservation.booking_date_start, reservation.booking_date_end ) }}
                 </div>


                <!-- Statut -->
                   <StatusReservation :status="reservation.status" />
                 <!-- /status -->


            </div>


            <!-- Format + durée -->
            <div class="reservation-details mt-2">

                <FormatReservation :reservation="reservation" />

                <!-- Session -->
                <v-chip
                    size="small"
                    variant="tonal"
                    color="info"  >
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
                <!-- Session -->

            </div>
            <!-- /format+duré -->

             <div class="mt-2"> 
                <v-btn 
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

        </div>


        <!-- ================= ACTIONS ================= -->

        <div class="reservation-actions">

           
            <!-- Bouton détails -->
            <v-btn
                :to="'/espace-client/reservations/' + reservation.id"
                variant="flat"
                size="small"
                color="#eee"
                rounded
                append-icon="mdi-arrow-right"
                class="details-btn" >
                Détails
            </v-btn>


            <!-- Menu changement statut -->
            <v-menu v-if="reservation.can_reject">

                <template #activator="{ props }">

                    <v-btn
                        v-bind="props"
                        icon="mdi-dots-vertical"
                        variant="text"
                        size="small"
                    />

                </template>
 
                <v-list density="compact">

                    <v-list-item @click="rejectReservation(reservation.id)"  >

                        <template #prepend>
                             <v-icon
                                icon="mdi-close-box"
                                color="error"> 
                            </v-icon>
                        </template>

                        <v-list-item-title>
                            Annuler définitivement
                        </v-list-item-title>

                    </v-list-item>

                </v-list>

            </v-menu>

        </div>
        <!-- ================= / ACTIONS ================= -->


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
                           :commande_id="props.reservation.commande.id"  
                           @selectSlot="saveBooking" />

                     </div>
                  </v-card-text>

               </v-card>
            </v-dialog>

      <!-- / new rdv -->

    </div>
</template>
 

<style lang="scss" scoped>
    
    .reservation-card {

        display: grid;

        grid-template-columns:
            240px
            minmax(300px, 1fr)
            auto;

        align-items: start;

        gap: 24px;

        width: 100%;

        padding: 14px 18px;

        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 14px;
        box-shadow: 0 12px 35px rgba(0,0,0,.04);

        background: #fff;

        transition:
            box-shadow .2s ease,
            border-color .2s ease;

        margin-bottom: 12px;
    }


    .reservation-card:hover {

        border-color: #d4d4d8;

        box-shadow:
            0 5px 18px rgba(0, 0, 0, .06);
    }


    /* =========================================================
    CLIENT
    ========================================================= */

    .client-info {

        display: flex;

        align-items: center;

        gap: 12px;

        min-width: 0;
    }


    .avatar-wrapper {

        position: relative;

        flex-shrink: 0;
    }


    .online-indicator {

        position: absolute;

        right: -1px;
        bottom: -1px;

        width: 13px;
        height: 13px;

        border-radius: 50%;

        background: #22c55e;

        border: 2px solid white;
    }


    .client-details {

        min-width: 0;

        overflow: hidden;
    }


    .client-name {

        font-size: 14px;

        font-weight: 700;

        color: #18181b;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;
    }


    .client-email {

        font-size: 12px;

        color: #71717a;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;

        margin-top: 2px;

        margin-bottom: 6px;
    }


    

    /* =========================================================
    RESERVATION
    ========================================================= */

    .reservation-content {

        min-width: 0;
    }


    .service-title {

        font-size: 16px;

        font-weight: 500;

        line-height: 1.25;

        color: #27272a;

        display: -webkit-box;

        
        -webkit-box-orient: vertical;

        overflow: hidden;

        margin-bottom: 6px;
    }


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

        font-size: 11px;

        font-weight: 500;

        margin-bottom: 0px;
    }


    /* =========================================================
    DATE
    ========================================================= */

    .reservation-meta {

        display: flex;

        align-items: center;

        flex-wrap: wrap;

        gap: 7px;

        margin-top: 8px;
        margin-bottom: 6px;
    }


    .reservation-date {

        display: flex;

        align-items: center;

        gap: 5px;

        font-size: 13px;

        font-weight: 600;

        color: #3f3f46;
    }


    /* =========================================================
    DETAILS
    ========================================================= */

    .reservation-details {

        display: flex;

        flex-wrap: wrap;
        align-items: center ;

        gap: 6px;
    }

    


    /* =========================================================
    ACTIONS
    ========================================================= */

    .reservation-actions {

        display: flex;

        align-items: center;

        justify-content: flex-end;

        gap: 5px;

        white-space: nowrap;
    }


    .status-chip {
        font-size: 11px;
        font-weight: 600;
    }
    

    /* =========================================================
    TABLET
    ========================================================= */

    @media (max-width: 1000px) {

        .reservation-card {

            grid-template-columns:
                190px
                minmax(250px, 1fr)
                auto;

            gap: 16px;

            padding: 12px 14px;
        }


        .service-title {

            font-size: 15px;
        }

    }


    /* =========================================================
    MOBILE
    ========================================================= */

    @media (max-width: 700px) {

        .reservation-card {

            display: grid;

            grid-template-columns: 1fr auto;

            gap: 12px;

            padding: 12px;

            margin-bottom: 10px;

         }


        /* Client */

        .client-section {

            grid-column: 1 / -1;

        }


        .client-info {
            gap: 10px;
        }


        /* Reservation */

        .reservation-content {

            grid-column: 1 / -1;

            padding-top: 10px;

            border-top: 1px solid #eeeeee;
        }


        .service-title {

            font-size: 14px;

            margin-bottom: 7px;
        }


        .payment-badge {

            font-size: 12px;

            padding: 3px 7px;

            margin-bottom: 7px;
        }


        .reservation-date {
            font-size: 13px;
        }


        /* Actions */

        .reservation-actions {

            grid-column: 1 / -1;

            justify-content: flex-end;

            padding-top: 8px;

            border-top: 1px solid #eeeeee;
        }

    }


    /* =========================================================
    VERY SMALL MOBILE
    ========================================================= */

    @media (max-width: 400px) {

        .reservation-card {

            padding: 10px;
        }


        .reservation-details {

            gap: 4px;
        }

    

        .status-chip {
            font-size: 10px;
        }

    }

   
  /* =========================================================
   NEW
   ========================================================= */



    @media (min-width: 700px) and (max-width: 1330px) {

        
       .reservation-card {

        display: grid;

        grid-template-columns: 1fr auto;

        gap: 12px;

        padding: 12px;

        margin-bottom: 10px;

     }


    /* Client */

    .client-section {

        grid-column: 1 / -1;

    }


    .client-info {
        gap: 10px;
    }


    /* Reservation */

    .reservation-content {

        grid-column: 1 / -1;

        padding-top: 10px;

        border-top: 1px solid #eeeeee;
    }


    .service-title {

        font-size: 14px;

        margin-bottom: 7px;
    }


    .payment-badge {

        font-size: 12px;

        padding: 3px 7px;

        margin-bottom: 7px;
    }


    .reservation-date {
        font-size: 13px;
    }


    /* Actions */

    .reservation-actions {

        grid-column: 1 / -1;

        justify-content: flex-end;

        padding-top: 8px;

        border-top: 1px solid #eeeeee;
    }

    
    }
 

</style>