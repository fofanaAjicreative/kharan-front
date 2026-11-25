<script setup lang="ts">

  import ReservationCardClient from '~/components/espace/ReservationCardClient.vue'
  import ReservationCardClientIncompled from '~/components/espace/ReservationCardClientIncompled.vue'
  import EmptyReservation from '~/components/espace/EmptyReservation.vue'

  import { useDisplay } from 'vuetify' ;
  const { mobile,name} = useDisplay() ;

  import { formatMonthYear,formatDuration } from '~/utils/date'
  const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

  const { openChatPanel } = useChat() ;


  const tab = ref('next') ; //incompleted
  const loaded = ref(false) ;

  const past_reservations = ref<any>([]) ;
  const next_reservations = ref<any>([]) ;
  const rejected_reservations = ref<any>([]) ;
  const incompleted_reservations = ref<any>([]) ;

    
 
/* ----------------------------------------------------------------------------------*/
 
  async function loadNextReservations(){ 

      showLoading() ;

      $api(`next_reservations`,{
        method: 'GET',
      }).then((res :any) =>{

          console.log("NEXT:",res.data );

          next_reservations.value =  res.data.reservations ;
          loaded.value = true ;

      }).catch(error=>{
          console.log("Error:",error); 
       }).finally(()=>{
           
          hideLoading() ;
      })
               
  }

/* ----------------------------------------------------------------------------------*/
 
  async function loadPastReservations(){ 
      
      // showLoading() ;
      $api(`past_reservations`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("PAST:",res.data );
        past_reservations.value =  res.data.reservations ;

       }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      })
               
  }

  
/* ----------------------------------------------------------------------------------*/
 
  async function loadRejectedReservations(){ 
      // showLoading() ;
      $api(`reservations?status=rejected`,{
        method: 'GET',
      }).then((res :any) =>{
        console.log("REJECTED:",res.data );
        rejected_reservations.value =  res.data.reservations ;
    
      }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      })
               
  }


/* ----------------------------------------------------------------------------------*/
 
  async function loadIncompletedReservations(){ 

      showLoading() ;

      $api(`incompleted_reservations`,{
        method: 'GET',
      }).then((res :any) =>{

          console.log("INCOMPLETED:",res.data );

          incompleted_reservations.value =  res.data.reservations ;
          loaded.value = true ;

      }).catch(error=>{
          console.log("Error:",error); 
       }).finally(()=>{
           
          hideLoading() ;
      })
               
  }


  /* -------------------------- local pagination : next ----------------------------------- */

   const visibleNext = ref(3) ;
   function showMoreNext() {
     visibleNext.value += 3
   }

   const hasMoreNext = computed( () =>
       next_reservations.value.length > visibleNext.value
   )



/* -------------------------- local pagination : past ----------------------------------- */


      const visiblePast = ref(3) ;
      function showMorePast() {
        visiblePast.value += 3
      }

      const hasMorePast = computed( () =>
          past_reservations.value.length > visiblePast.value
      )




/* -------------------------- local pagination : rejected ----------------------------------- */

   const visibleRejected = ref(3) ;
   function showMoreRejected() {
     visibleRejected.value += 3
   }

   const hasMoreRejected = computed( () =>
       rejected_reservations.value.length > visibleRejected.value
   )

/* ----------------------------- emit ---------------------------------------------------- */

   function rejectReservation(data :any){
      // incompleted_reservations.value = incompleted_reservations.value
      //                                  .filter((item :any)=>item.id !== data.reservation_id) ;
      loadRejectedReservations() ;
      loadIncompletedReservations() ;
      tab.value = "rejected" ;
   }


 /* ----------------------------------------------------------------------------------------- */ 

   function newReservation(data :any){

      loadIncompletedReservations() ;
      loadNextReservations()
      tab.value = "next"

   }


 /* ----------------------------------------------------------------------------------------- */ 

  function statusChanged(data :any){

     if(data?.reservation?.status==ReservationStatus.CANCELED){
       
        loadIncompletedReservations() ;
        tab.value = "incompleted"
    } 

  }

/* -------------------------- local pagination : incompleted ----------------------------------- */

   const visibleIncompleted = ref(3) ;

   function showMoreIncompleted() {
      visibleIncompleted.value += 3
   }

   const hasMoreIncompleted = computed( () =>
      incompleted_reservations.value.length > visibleIncompleted.value
   )

 
/* ------------------------------------------------------------------------------------------- */

     
    onMounted(() => {

      loadNextReservations() ; 
      loadPastReservations() ;             
      loadRejectedReservations() ;     
      loadIncompletedReservations() ;     


    });

/* ------------------------------------------------------------------------------------------- */

 
</script>

<template>
  
 <SkeletonDashboard v-if="!loaded"  />
 <section v-else class="mb-2 profil_form" >

      <v-sheet elevation="0">

        <v-tabs 
          v-model="tab" 
          color="secondary" grow
          slider-color="secondary"
          bg-color="#F4F4F4"
          show-arrows
          >
          <v-tab 
           prepend-iconn="mdi-timer-outline"
           value="next" > À vénir </v-tab>

          <v-tab v-if="past_reservations.length"
           prepend-iconn="mdi-clock-outline"
           value="past"  > Passés </v-tab>

          <v-tab v-if="incompleted_reservations.length"
          prepend-iconn="mdi-calendar-refresh-outline"
          value="incompleted"  > À completer/ À annuler  </v-tab>

          <v-tab 
          prepend-iconn="mdi-cancel"
          value="rejected" v-if="rejected_reservations.length" > Commande annulées </v-tab>
        </v-tabs>

        <v-divider></v-divider>

          <v-tabs-window v-model="tab">
            
    <!-- ---------------------------------  next  ------------------------------------------ -->

          <v-tabs-window-item value="next">
              <v-sheet class="pa-5"  >
                 <div class="tab_content" >
                    <div>
                      <h3 class="mb-1 mt-1 text-center">  &nbsp; </h3>   
                      <div v-if="next_reservations.length">

                     
                        <template v-for="reservation in next_reservations.slice(0, visibleNext) " :key="reservation.id">
                            <ReservationCardClient 
                                :reservation="reservation" 
                                @statusChanged="statusChanged"
                              />
                        </template>


                        <!-- more  -->
                          <div class="text-center mt-6">
                              <v-btn v-if="hasMoreNext"
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  rounded="pill"
                                  @click="showMoreNext" > Afficher plus
                              </v-btn>
                              </div>
                        <!-- / more  -->

                      </div>
                      <EmptyReservation v-else />
                  </div>

               

                 </div>
              </v-sheet>
            </v-tabs-window-item>

    <!-- --------------------------------- past ------------------------------------------ -->

            <v-tabs-window-item value="past">
              <v-sheet class="pa-5"  >
                 <div class="tab_content" >
                    <div>
                     <h3 class="mb-1 mt-1 text-center">  &nbsp; </h3> 
                      <div v-if="past_reservations.length">

                        <template v-for="reservation in past_reservations.slice(0, visiblePast) " :key="reservation.id">
                            <ReservationCardClient 
                                :reservation="reservation" 
                                @statusChanged="statusChanged"
                              />
                        </template>
 
                      </div>
                      <EmptyReservation v-else />

                  </div>

                  <!-- more  -->
                <div class="text-center mt-6">
                    <v-btn v-if="hasMorePast"
                        variant="outlined"
                        color="secondary"
                        size="small"
                        rounded="pill"
                        @click="showMorePast" > Afficher plus
                    </v-btn>
                    </div>
                <!-- / more  -->

                 </div>
              </v-sheet>
            </v-tabs-window-item>

        <!-- --------------------------------- rejected ------------------------------------------ -->
            
            <v-tabs-window-item value="rejected">
              <v-sheet class="pa-5"  >
                 <div class="tab_content" >
                    <div>
                     <h3 class="mb-1 mt-1 text-center">  &nbsp; </h3> 

                      <div v-if="rejected_reservations.length">

                        <template v-for="reservation in rejected_reservations.slice(0, visibleRejected) " :key="reservation.id">
                            <ReservationCardClient 
                                :reservation="reservation" 
                                @statusChanged="statusChanged"
                              />
                        </template>
 
                      </div>
                      <EmptyReservation v-else />

                  </div>

                  <!-- more  -->
                <div class="text-center mt-6">
                    <v-btn v-if="hasMoreRejected"
                        color="secondary"
                        variant="outlined"
                        rounded="pill"
                        size="small"
                        @click="showMoreRejected" > Afficher plus
                    </v-btn>
                    </div>
                <!-- / more  -->

                 </div>
              </v-sheet>
            </v-tabs-window-item>
<!-- --------------------------------- incompleted ------------------------------------------ -->
            
            <v-tabs-window-item value="incompleted">
              <v-sheet class="pa-5"  >
                 <div class="tab_content" >
                    <div>
                     <h3 class="mb-1 mt-1 text-center">  &nbsp; </h3> 

                      <div v-if="incompleted_reservations.length">

                        <template v-for="reservation in incompleted_reservations.slice(0,visibleIncompleted) " :key="reservation.id">
                            <ReservationCardClientIncompled 
                              :reservation="reservation" :statusOptions="[]"
                              @reject="rejectReservation"
                              @newReservation="newReservation"
                              />
                        </template>
 
                      </div>
                      <EmptyReservation v-else />

                  </div>

                  <!-- more  -->
                <div class="text-center mt-6">
                    <v-btn v-if="hasMoreIncompleted"
                        color="secondary"
                        variant="outlined"
                        rounded="pill"
                        size="small"
                        @click="showMoreIncompleted" > Afficher plus
                    </v-btn>
                    </div>
                <!-- / more  -->

                 </div>
              </v-sheet>
            </v-tabs-window-item>
            


          </v-tabs-window>


      </v-sheet>
  </section>



</template>

<style scoped lang="scss">

  .page_content{
    max-width: 900px ;
  }

  .stats_item{
    display: flex;
    flex-direction: column;
    align-items: center ;
    justify-content: center;
    padding: 10px ;
   /*  border: 1px #ddd solid ; */
    width: 250px ;
    height: 100px;
    box-shadow: 0 2px 5px rgba(0,0,0,.08);
     border-radius: 6px;
     .value{
       font-size: 24px;
       font-weight: bold ;
       color: #000 ;
       margin: 0px;
     }

     .title{
       font-size: 14px;
       color: #424242;
       margin: 0px;
     }

  }



   .rdv_item{
      border: 1px #eee solid ;
       box-shadow: 0 12px 25px rgba(0,0,0,.08);
      padding:10px ;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .coach_name{
        margin: 0px ;
        font-size: 15px ;
        font-weight: bold ;
        color: #000;
    }


    .annonce_title{
        margin: 0px ;
        font-size: 12px ;
        color: #424242;
        margin-bottom: 10px;
    }

    .service_title{
         margin: 0px ;
        font-size: 14px ;
        color: #424242;
        a{
          text-decoration: none ;
        }
    }
    .service_date{
        margin: 0px ;
        margin-bottom: 10px;
        margin-top: 4px;
        font-size: 14px ;
        color: #424242;
        font-weight: bold ;
    }


   
</style>