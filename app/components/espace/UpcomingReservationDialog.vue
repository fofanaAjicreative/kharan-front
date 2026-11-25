<script setup lang="ts">


const { user ,isCoach, isClient } = useAuth();
 
const { formatReservationTime } = useDate()

const {  dialog,isStarted, reservation,showDialog,dismissDialog , 
    timeRemainingText } = useUpcomingReservation()


    let audio: HTMLAudioElement | null = null;

/* ------------------------------------------------------------------------------------- */

    watch(dialog, (newVal) => {
        if (newVal) {
            audio = new Audio('/sounds/ringtone.mp3'); // Place ton fichier son dans public/sounds/
            audio.loop = true;
            audio.play().catch((err) => console.log('Autoplay bloqué par le navigateur:', err));
        }else{

        }
    });

/* ------------------------------------------------------------------------------------- */

    const stopSound = () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    };

/* ------------------------------------------------------------------------------------- */

    const dismiss = () => { 

        stopSound();
        dismissDialog();

    };

/* ------------------------------------------------------------------------------------- */

    const joinMeeting = () => {

    
        if(isCoach.value){
            navigateTo(`/espace-coach/meeting/${reservation.value.reservation.id}`)
        }else if(isClient.value){
            navigateTo(`/espace-client/meeting/${reservation.value.reservation.id}`)
        }

        stopSound();
        dismissDialog();

    };


/* ------------------------------------------------------------------------------------- */

   
/* --------------------------------------------------------------------------------------- */

    onMounted( async () => {  
        console.log("upcoming:", reservation.value)
    }); 

 
</script>


<template>

  <v-dialog
    v-model="dialog"
    max-width="450"
    persistent >

    <v-card 
      v-if="reservation"
      rounded="4">

        <!-- header -->

        <div class="d-flex align-center justify-space-between px-3 pt-3">

            <div class="d-flex align-center ga-2">
              <v-icon 
                size="default" 
                color="default"
                icon="mdi-video"
                 ></v-icon>
              <span class="text-subtitle-2 font-weight-bold"> Votre séance  </span>
            </div>

            <v-chip v-if="isStarted"
                color="info"
                size="default"
                variant="tonal" >
                En cours
            </v-chip>
            <v-chip v-else
                color="warning"
                size="default"
                variant="tonal" >
                En attente
            </v-chip>

        </div>

        <!-- /header -->
      
      <v-card-text class="text-cente pa-4">
 
        <v-divider class="mb-1 mt-1"> </v-divider>

        <div class="description d-flex justify-center"> 
             <p> {{ reservation.service.title }}</p>
        </div>
        
        
        <v-divider class="mb-6 mt-1"> </v-divider>

        <div class="d-flex flex-wrap justify-center">
               <div class="d-flex ga-2">

                    <div v-if="user.role == Role.COACH">
                        <v-avatar size="80" rounded="4" >
                            <v-img
                                :src="reservation.client.photo || '/images/profile.png'"
                            />
                        </v-avatar>
                    </div>
                    <div v-else-if="user.role== Role.USER">
                        <v-avatar size="80" rounded="4" >
                            <v-img
                                :src="reservation.coach.photo || '/images/profile.png'"
                            />
                        </v-avatar>
                    </div>

                    <div class="client-details ml-4">

                        <div v-if="user.role == Role.COACH "
                             class="client-name"> {{reservation.client.firstName}}  {{reservation.client.lastName}}
                        </div>
                        <div v-else-if="user.role == Role.USER "
                             class="client-name"> {{reservation.coach.firstName}}  {{reservation.coach.lastName}}
                        </div>

                        <div class="duration">
                            {{ formatReservationTime(reservation.reservation.booking_date_start, reservation.reservation.booking_date_end ) }}
                        </div>
                                    

                        <v-btn 
                            @click="joinMeeting()"
                            size="default"
                            color="secondary"
                            variant="flat" 
                            prepend-icon="mdi-video-outline"
                            append-iconn="mdi-phone-hangup"
                            block
                            class="mt-2" >
                            Rejoindre la visio  
                        </v-btn>

                        
                    </div>

                </div>

        </div>
       

         <v-divider class="mb- mt-6"> </v-divider>

        <div class="text-center">
            <v-btn
               @click="dismiss()"
                variant="text"
                class="mt-3" >
                Plus tard
            </v-btn>
        </div>

      </v-card-text>
 
    </v-card>
     
  </v-dialog>

</template>

<style lang="scss" scoped>
    .title {
        font-size: 16px ;
     }

     .description{
        margin: 0px ;
        color: $info-color;
        font-size: 15px;
     }


    .client-name {

        font-size: 15px;
        font-weight: 700;
        color: #18181b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
    }
    
    .duration{
        text-align: center;
        font-weight: bolder ;
        color: #FFF;
        border: 1px #eee solid ;
        padding: 4px;
        background: #424242;
        border-radius: 4px;
        
        margin: auto;
    }

</style>

