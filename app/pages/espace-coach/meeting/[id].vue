
<script setup lang="ts" >
  
   import JitsiMeeting from '~/components/meet/JitsiMeeting.vue' ;
  
  const { showLoading, hideLoading } = useGlobalLoading() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;

   // -------------------route param -------------------------------

      const route = useRoute()
      let id  = route.params.id as string ;
      if(!id){ navigateTo('/') ; }

   // ------------------- seo ------------------------------------- 

      const page_title = ref('Visioconference')
      useSeoMeta({ title: page_title })
 
      const { user } = useAuth() ;
         
      const { formatReservationDuration,formatDateTime } = useDate()
         

      const router = useRouter() ;
      const { $api } = useNuxtApp() ;

      const reservation = ref<any>(null) ;
      const loaded = ref(false) ;
      
   
   /* --------------------------------------------------------------------------------------- */


      function onMeetingJoined() {
          console.log('Connexion réussie');
      }


      function onMeetingLeft() {
         navigateTo(`/espace-coach/meeting/terminee/${id}`)
         //router.back()
      }


      function onMeetingError(message: string) {
         // router.back()
         console.error(message);

      }

/* -------------------------------------------------------------------------------------- */

      function loadReservationDetails(){   

         $api(`/coach/reservations/${id}/get`).then((res :any)=>{
            reservation.value = res.data.reservation ;
            loaded.value = true ;
         }).catch(error=>{
            
            console.log(error);
            router.back()
         })  

      }

/* --------------------------------------------------------------------------------------- */
   
   onMounted( async () => {  
      loadReservationDetails() ;
   }); 


</script>


<template>

  <SkeletonDashboard v-if="!loaded"  />
  <template v-else>
   <div class="main_content">

      <v-btn @click="router.back()"
         class="mb-2"
         variant="text"
         size="small"
         spaced="both"
         prepend-icon="mdi-chevron-left"
         color="secondaryy"> Retour </v-btn>

      <v-card class="visio_card" elevation="0" >
           <!-- <v-card-title> Ma visioconférence </v-card-title> -->

            <JitsiMeeting

               :reservation_id="reservation.id"
               :booking_date_start="reservation.booking_date_start"
               :booking_date_end="reservation.booking_date_end"

               @joined="onMeetingJoined"
               @left="onMeetingLeft"
               @error="onMeetingError"

            />
           
      </v-card>

   </div>
</template> 

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