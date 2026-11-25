<script setup lang="ts">

import ReservationCardCoach from '~/components/espace/ReservationCardCoach.vue';
import EmptyReservation from '~/components/espace/EmptyReservation.vue'

  const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

   
  const loaded = ref(false) ; 

  const today_reservations = ref<any>([]) ;


  const tab = ref('today') ;
  
/* ----------------------------------------------------------------------------------*/
 
  async function todayReservations(){ 

       $api(`coach/today_reservations`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("TODAY:",res.data );

        today_reservations.value =  res.data.reservations ;
        loaded.value = true ;
   
      }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      }) ; 
               
  }
  
   
/* -------------------------- local pagination ----------------------------------- */

   const visibleToday = ref(3) ;

   function showMoreToday() {
     visibleToday.value += 3
   }

   const hasMoreToday = computed( () =>
       today_reservations.value.length > visibleToday.value
   )



  /* ----------------------------  change status ------------------------------------------ */

    const statusOptions = [
      { label: 'Approuver', value: 'approved' },
      { label: 'Terminer', value: 'completed' },
      { label: 'Rejeter', value: 'rejected' },
      { label: 'En attente', value: 'waiting' }
    ] ;
  

/* --------------------------------------------------------------------------------- */
    
    onMounted(() => {
      todayReservations()   ; 
     
    });
 
</script>

<template>
  
 <section class="mb-2 page_content" >
     
    <SkeletonDashboard v-if="!loaded"  />

      <div v-else>
        <v-sheet elevation="0">

          <v-tabs 
            v-model="tab" 
            color="secondary" 
            bg-color="#F4F4F4"
            grow show-arrows >
             <v-tab value="today" > Séances du jour </v-tab>
          </v-tabs>
          <v-divider></v-divider>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="today">

              <div class="pa-5"  >

               <div v-if="today_reservations.length">

                  <template v-for="reservation in today_reservations.slice(0, visibleToday) " :key="reservation.id">
                      <ReservationCardCoach :reservation="reservation" :statusOptions="statusOptions" />
                  </template>
    
                  <!-- more  -->
                    <div class="text-center mt-6">
                      <v-btn v-if="hasMoreToday"
                          color="secondary"
                          variant="outlined"
                          size="small"
                          rounded="4"
                          @click="showMoreToday" > Afficher plus
                      </v-btn>
                    </div>
                  <!-- / more  -->

                </div>
                
                <EmptyReservation v-if="loaded && !today_reservations.length" />

              </div>

            </v-tabs-window-item>
          </v-tabs-window>
        </v-sheet>
      </div>
      
  </section>

</template>

<style scoped lang="scss">

  .page_content{
    // max-width: 1000px ;
    margin:auto
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


  .no_item{
      
      box-shadow: 0 12px 25px rgba(0,0,0,.08);
     
      border-radius: 10px;
      margin-bottom: 20px;
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