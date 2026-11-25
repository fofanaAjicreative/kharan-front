<script setup lang="ts">
 
  import StatusReservation from '~/components/espace/StatusReservation.vue' ;
  import FormatReservation from '~/components/espace/FormatReservation.vue' ;

 import { useDisplay } from 'vuetify' ;
 const { mobile,name} = useDisplay() ;
  
  const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar,showWarningSnackbar, showErrorSnackbar } = useSnackbar() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;
  const { openChatPanel } = useChat() ;
  const { isOnline } = usePresence() ;
  
  const { formatReservationDuration ,formatDateTime } = useDate()

  const { confirm , reason } = useCancelReservation() ;

 
/* ----------------------------- props ---------------------------------------------------------- */


    const props = defineProps({
        reservation:{
            type:Object,
            required:true
        }
    }) ;

   const emit = defineEmits(['statusChanged']) ;

/*------------------------------- meeting ------------------------------------------------ */

 const { canJoin, isUpcoming, timeRemainingText, joinMeeting } = useMeetingStatus(
    () => props.reservation.booking_date_start,
    () => props.reservation.booking_date_end,
    () => props.reservation.meetingUrl,
    () => props.reservation.id,

);

/*------------------------------------------------------------------------------- */

    const can_approve = ref(props.reservation.can_approve) ;
    const can_complete = ref(props.reservation.can_complete) ;
    const can_cancel = ref(props.reservation.can_cancel) ;
    const can_reject = ref(props.reservation.can_reject) ;

    const status = ref(props.reservation.status) ;

        const statusOptions = computed(() => {

            const options = []; 

            if (can_approve.value) {
                options.push({
                    label: 'Approuver',
                    value: 'approved'
                });
            }

            if (can_complete.value) {
                options.push({
                    label: 'Terminer',
                    value: 'completed'
                });
            }

            if (can_cancel.value) {
                options.push({
                    label: 'Annuler',
                    value: 'canceled'
                });
            }

            if (can_reject.value) {
                options.push({
                    label: 'Rejeter',
                    value: 'rejected'
                });
            }

            return options;

        });


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

            console.log("res:", res.data.reservation );
            
            status.value = res.data.reservation.status ;

            can_approve.value = res.data.reservation.can_approve ;
            can_complete.value = res.data.reservation.can_complete ;
            can_cancel.value = res.data.reservation.can_cancel ;
            can_reject.value = res.data.reservation.can_reject ;

            showSuccessSnackbar({
                title: 'Succès',
                message: "Le statut est mis à jour."
            }) ;

            hideLoading() ;

            // for calendar
            emit("statusChanged",{reservation :res.data.reservation})


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


/* ----------------------------------------------------------------------------- */


    async function ContactClient(){

        const conversation = {
            conversation : null ,
            user : props.reservation.user ,
            minimized : false ,
            unreadCount : 0 ,
        }

        openChatPanel(conversation,name.value) ;
        
        await nextTick() ;

    }

/* ----------------------------------------------------------------------------- */

  const canJoinMeeting = computed(() => {
     return (
           (props.reservation.status == ReservationStatus.APPROVED) && 
           (props.reservation.format == ReservationFormat.ONLINE) && 
           canJoin.value 
          )

  });

/* ----------------------------------------------------------------------------- */
 
    onMounted( async () => {  

       

    }); 


</script>


<template>
    <div class="reservation-card">

        <!-- ================= CLIENT ================= -->
        <div class="client-section">

            <div class="client-info">

                <div class="avatar-wrapper">
                    <v-avatar
                        size="72"
                        rounded="8" >
                        <v-img
                            :src="reservation.user.photo
                                    ? reservation.user.photo.media_url : '/images/profile.png'"
                        />
                    </v-avatar>
                    <span v-if="isOnline(reservation.user.id)" class="online-indicator" > </span>
                </div>

                <div class="client-details">

                    <div class="client-name">
                        {{ reservation.user.firstname }}
                        {{ reservation.user.lastname }}
                    </div>

                    <div class="client-email">
                        {{ reservation.user.email }}
                    </div>

                    <v-btn
                        @click="ContactClient()"
                        variant="tonal"
                        color="info"
                        size="small"
                        prepend-icon="mdi-message-outline"
                        class="contact-btn mt-2"
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

                {{ reservation.commande.total_coach }}€ , {{ formatDateTime(reservation.created) }}
            </div>


            <!-- Date -->
            <div class="reservation-meta">

                <div class="reservation-date">
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
                    color="info" >
                    <template #prepend>
                        <v-icon size="13">
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

            </div>


            <!-- Format + durée -->
            <div class="reservation-details">

                <FormatReservation :reservation="reservation" />

                <v-btn 
                    v-if="canJoinMeeting"
                    @click="joinMeeting"
                    size="small"
                    color="secondary"
                    variant="flat" 
                    prepend-icon="mdi-video-outline"
                    append-iconn="mdi-phone-hangup"
                    class="ml-2" >
                     Rejoindre la visioconférence
                </v-btn>

            </div>

        </div>


        <!-- ================= ACTIONS ================= -->
        <div class="reservation-actions">

            <!-- status -->
               <StatusReservation :status="status" />
            <!-- /status -->


            <!-- Bouton détails -->
            <v-btn
                :to="'/espace-coach/reservations/' + reservation.id"
                variant="text"
                size="small"
                append-icon="mdi-arrow-right"
                class="details-btn"
            >
                Détails
            </v-btn>


            <!-- Menu changement statut -->
            <v-menu v-if="statusOptions.length">

                <template #activator="{ props }">

                    <v-btn
                        v-bind="props"
                        icon="mdi-dots-vertical"
                        variant="text"
                        size="small"
                    />

                </template>


                <v-list density="compact">

                    <v-list-item
                        v-for="item in statusOptions"
                        :key="item.value"
                        @click="changeStatus(reservation.id, item.value)"
                    >

                        <template #prepend>

                            <v-icon
                                v-if="item.value === 'approved'"
                                color="info"
                            >
                                mdi-check-bold
                            </v-icon>

                            <v-icon
                                v-else-if="item.value === 'rejected'"
                                color="error"
                            >
                                mdi-cancel
                            </v-icon>

                            <v-icon
                                v-else-if="item.value === 'canceled'"
                                color="warning"
                            >
                                mdi-close-box
                            </v-icon>

                            <v-icon
                                v-else-if="item.value === 'completed'"
                                color="success"
                            >
                                mdi-checkbox-marked-outline
                            </v-icon>

                        </template>

                        <v-list-item-title>
                            {{ item.label }}
                        </v-list-item-title>

                    </v-list-item>

                </v-list>

            </v-menu>

        </div>
        <!-- ================= / ACTIONS ================= -->

    </div>
</template>
 

<style lang="scss" scoped>

.reservation-card {

    display: grid;

    grid-template-columns:
        240px
        minmax(300px, 1fr)
        auto;

    align-items: start ;

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

    font-size: 12px;

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

    margin-top: 4px;
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

    align-items: center ;

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