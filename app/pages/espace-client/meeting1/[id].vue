
<script setup lang="ts" >
  
   import JitsiMeeting from '~/components/meet/JitsiMeeting.vue' ;
   import MeetingTimerOverlay from '~/components/meet/MeetingTimerOverlay.vue' ;
  
  const { showLoading, hideLoading } = useGlobalLoading() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;



   // -------------------route param -------------------------------

      const route = useRoute()
      let id  = route.params.id as string ;

      if(!id){ navigateTo('/service') ; }
   
   // ------------------- seo ------------------------------------- 

      const page_title = ref('Visioconference')
      useSeoMeta({ title: page_title })
 
      const { user } = useAuth() ;
      const { formatReservationDuration,formatDateTime } = useDate()
         
      const { $api } = useNuxtApp() ;

      const loading = ref(true) ;
      
      const router = useRouter() ;


   /* --------------------------------------------------------------------------------------- */


      function onMeetingJoined() {
          console.log('Connexion réussie');
      }

      function onMeetingLeft() {
          router.back()
      }

      function onMeetingError(message: string) {
         console.error(message);
      }


</script>


<template>

   <div class="main_content">

      <v-btn @click="router.back()"
         class="mb-2"
         variant="text"
         size="small"
         spaced="both"
         prepend-icon="mdi-chevron-left"
         color="secondaryy"> Retour </v-btn>

      <v-card class="visio_card" elevation="0" >
         <!--  <v-card-title> Ma visioconférence </v-card-title> -->

         <ClientOnly>
            <!-- <JitsiMeeting
               :reservation-id="id"
               @joined="onMeetingJoined"
               @left="onMeetingLeft"
               @error="onMeetingError"
            /> -->
         </ClientOnly>
      </v-card>

   </div>


</template>

<style lang="scss" scoped>


   .main_content{
      padding: 4px ;
   }

   .right_side{
      padding: 0 !important ;
   }

   .visio_card {
      border-radius: 4px ;
      border : 0px $secondary-color solid ;
   }

</style>