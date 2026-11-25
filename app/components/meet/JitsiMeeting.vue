
<script setup lang="ts">

import MeetingTimerOverlay from '~/components/meet/MeetingTimerOverlay.vue' ;
const { user ,isCoach, isClient } = useAuth();

const { joinReservationMeeting, leftReservationMeeting } = useMeeting() ;

 /* ---------------------------- interfaces  ---------------------------------------------- */

    
    interface MeetAccessResponse {
        provider: 'jitsi';
        domain: string;
        roomName: string;
        token: string;
        expiresAt: string;

        user: {
            id: string;
            name: string;
            role: 'coach' | 'client';
        };
    }


    declare global {

    interface Window {
        JitsiMeetExternalAPI?: new (
        domain: string,
        options: Record<string, any>
        ) => any;
    }
    }


/* ---------------------------- props ---------------------------------------------- */

const props = defineProps<{
   reservation_id: string , 
   booking_date_start: string , 
   booking_date_end: string , 
  }>();

   

    const emit = defineEmits<{
        joined: [];
        left: [];
        error: [message: string];
        readyToClose: [];
    }>();

/* ---------------------------- / props ---------------------------------------------- */


const { $api } = useNuxtApp();

const meetingContainer = ref<HTMLElement | null>(null);

const loading = ref(true);
const joined = ref(false);
const error = ref('');

let jitsiApi: any = null;
let disposed = false;


let isConferenceDestroyed = ref(false);


/*  -------------------Chargement du script Jitsi. Le script est partagé entre les instances ------------ */

 
let jitsiScriptPromise: Promise<void> | null = null;


function loadJitsiScript(domain: string): Promise<void> {


  if (typeof window === 'undefined') {
    return Promise.reject( new Error('Jitsi doit être chargé côté navigateur'),  );
  }

  if (window.JitsiMeetExternalAPI) { return Promise.resolve(); }

  if (jitsiScriptPromise) { return jitsiScriptPromise; }


  jitsiScriptPromise = new Promise((resolve, reject) => {

    const script = document.createElement('script');

    script.src = `https://${domain}/external_api.js`;
    script.async = true;


    script.onload = () => {

        if (window.JitsiMeetExternalAPI) {
            resolve();
        } else {
            reject(
            new Error('API Jitsi indisponible'),
            );
        }

    };


    script.onerror = () => {
      jitsiScriptPromise = null;
      reject( new Error('Impossible de charger Jitsi'), );
    };

    document.head.appendChild(script);

  });

  return jitsiScriptPromise;
}

/* ------------------------- aaa Récupération du token auprès du backend ------------------------------------- */

 
async function getMeetAccess(): Promise<MeetAccessResponse | null> {

    try{
        const res =  await $api( `/meet/reservations/${props.reservation_id}/access`,
            { method: 'GET' },
        );

        return res.data ;

    }catch(err :any){
        console.log(err);
        return null ;
        
        
    }
}
 

/* ----------------------------- Initialisation de la conférence ---------------------------------------- */

async function initializeMeeting() {

  try {

    loading.value = true;
    error.value = '';

    // call backend api
    const access = await getMeetAccess();

    if( !access){
      throw new Error(`Le token de connexion n'a pas pu être généré `);
    }

    console.log("access:",access);
    

    if (disposed) return;

    if (
      access.provider !== 'jitsi' ||
      !access.domain ||
      !access.roomName ||
      !access.token
    ){
      throw new Error( 'Informations de connexion invalides' );
    }

    if(
      new Date(access.expiresAt).getTime() <= Date.now()
    ){
      throw new Error( 'Le token de connexion a expiré' );
    }

    // load  <script>
    await loadJitsiScript(access.domain);


    if (disposed) return;

    if (!meetingContainer.value) {
      throw new Error( 'Conteneur vidéo introuvable' );
    }

    const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;

    if (!JitsiMeetExternalAPI) {
      throw new Error( 'API Jitsi non disponible' );
    }


    // aaa 
    jitsiApi = new JitsiMeetExternalAPI(
      access.domain,
      {
        roomName: access.roomName,
        jwt: access.token,

        parentNode: meetingContainer.value,

        width: '100%',
        height: '100%',

        userInfo: {
          displayName: access.user.name,
        },

        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,

          // Configuration de Deep Linking des versions récentes
          deeplinking: {
            disabled: true,
          },

          disableInviteFunctions: true,


          startWithAudioMuted: false,
          startWithVideoMuted: false,

           toolbarButtons: [
              'microphone',
              'camera',
              'hangup',
              'chat',
              'fullscreen',
              'tileview',
              'settings',
            ],

        },

    
      },

    );

    registerEvents();

  } catch (err: any) {

    if (disposed) return;

    console.error('[Jitsi]', err);

    error.value =
      err?.data?.message ||
      err?.message ||
      'Impossible de rejoindre la visioconférence';

    emit('error', error.value);

  } finally {

    if (!disposed) {
      loading.value = false;
    }

  }
}

 /* -------------------------------- Événements Jitsi. -------------------------------- */

function registerEvents() {

  if (!jitsiApi) return;

  //-------------------------------

  jitsiApi.addEventListener( 'videoConferenceJoined',
    () => {

      if (disposed) return;

      joined.value = true;
      emit('joined');

      joinReservationMeeting(props.reservation_id)
    },
  );


 //-------------------------------
  
  jitsiApi.addEventListener( 'videoConferenceLeft',
    () => {

      joined.value = false;

      // call api

      endMeeting()


     },
  );

  //-------------------------------
    
    jitsiApi.addEventListener( 'readyToClose',
        () => {
            joined.value = false;
            emit('readyToClose');
        },
    );

 //-------------------------------
  
 /*  jitsiApi.addEventListener( 'errorOccurred',

    (event: any) => {

      console.error('[Jitsi error]', event);

      const message = event?.error?.message || 'Une erreur est survenue pendant la visioconférence';
      error.value = message;
      emit('error', message);

    },

  ); */

  jitsiApi.addListener('errorOccurred', (event: {

      error: {
        name: string;
        params?: any[];
        type?: string;
        isFatal?: boolean;
        message?: any;
      };
    }) => {

      console.error('[Jitsi error]', event?.error?.name);

      if (event?.error?.name == 'conference.destroyed') {
        isConferenceDestroyed.value = true;
      }else{


      const message = event?.error?.message || 'Une erreur est survenue pendant la visioconférence';
      error.value = message;
      emit('error', message);

      }


      
    });




}
 


 /* ------------------------------   Destruction de l'IFrame. ---------------------------------------- */

function disposeMeeting() {

  disposed = true;

  if (jitsiApi) {

    try {
      jitsiApi.dispose();
    } catch (e) {
      console.error('[Jitsi dispose]', e);
    }

    jitsiApi = null;
  }

  joined.value = false;

 }

/* ----------------------------------------------------------------------- */

    onMounted(() => {
        initializeMeeting();
    });

/* ----------------------------------------------------------------------- */

    onBeforeUnmount(() => {
         disposeMeeting();
    });

/* ----------------------------------------------------------------------- */


  const roomContainer = ref<HTMLElement | null>(null)

  async function toggleFullscreen() {
    if (!roomContainer.value) return

    if (!document.fullscreenElement) {
      await roomContainer.value.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

/* ------------------------------------------------------------------------- */

function leaveMeeting() {

  if (!jitsiApi) return;
  jitsiApi.executeCommand('endConference');
  jitsiApi.executeCommand('hangup');
  

}

  watch(isConferenceDestroyed, (newVal) => {

    // if(newVal) {
    //     endMeeting() ;
    // }

  })

  /* ----------------------- timer ends ---------------------------------- */

   async function endMeeting() {
    
    leftReservationMeeting(props.reservation_id) ;

    if (!jitsiApi) return;
    if(isCoach.value){
      jitsiApi.executeCommand('endConference');
      navigateTo(`/espace-coach/meeting/terminee/${props.reservation_id}`)
    }else if(isClient.value){
      jitsiApi.executeCommand('hangup');
      navigateTo(`/espace-client/meeting/terminee/${props.reservation_id}`)
    }

    disposeMeeting() ;


  }

/* ----------------------------------------------------------------------- */


</script>




<template>

  <div ref="roomContainer" class="video-room">

  <!-- Jitsi -->
  <div class="jitsi-container">

    <!-- Chargement -->
    <div v-if="loading"
      class="d-flex flex-column align-center justify-center pa-8" >

      <v-progress-circular
        indeterminate
        color="secondary"
        size="55"
      />
      <div class="text-body-2 mt-4"> Connexion à la visioconférence... </div>
    </div>

    <!-- Erreur -->
    <v-alert  
        v-if="error"
        type="error"
        variant="tonal"
        class="ma-4"
      >  {{ error }}  </v-alert>


    <!-- video -->

      <div
        ref="meetingContainer"
        class="jitsi-frame"
        :class="{ 'd-none': loading || error }" > 
      
      </div>

    <!-- /video -->

    

  </div>

  <!-- /Jitsi -->

  <!-- Chronomètre indépendant de Jitsi -->
    <MeetingTimerOverlay v-if="!loading"
        :start="booking_date_start"
        :end="booking_date_end"
        :grace-minutes="1"
        @close-requested="endMeeting"
      />

    <!-- Bouton plein écran -->
      <!-- <v-btn
        class="fullscreen-button"
        icon="mdi-fullscreen"
        color="secondary"
        variant="flat"
        @click="toggleFullscreen"
      /> -->

  </div>

</template>

<style scoped>

.jitsi-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
}

.jitsi-frame {
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
}


.jitsi-frame {
  width: 100%;
  height: 75vh;
  min-height: 550px;
  overflow: hidden;
  position: relative;
}

/* L'iframe générée par Jitsi */
.jitsi-frame :deep(iframe) {
  width: 100% !important;
  height: 100% !important;
  min-height: 550px !important;
  border: 0;
}

</style>
