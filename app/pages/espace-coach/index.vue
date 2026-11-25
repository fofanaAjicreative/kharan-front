<script setup lang="ts">
 
     import StatisticItem from '~/components/espace/StatisticItem.vue' ;
     import ReservationCardCoach from '~/components/espace/ReservationCardCoach.vue' ;
     import EmptyReservation from '~/components/espace/EmptyReservation.vue' ;
     import AnnonceStatusAlert from '~/components/espace/AnnonceStatusAlert.vue' ;

     

    const { dialog, 
              has_annonce, annonce_completed,has_service, 
              accept, cancel ,
              set_has_annonce,
              set_annonce_completed,
              set_has_service ,
              annonce_small
          } = useAnnonceDialog() ;

    const { $api } = useNuxtApp() ;
    const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
    const { showLoading, hideLoading } = useGlobalLoading() ;

    
/* ----------------------------------------------------------------------------------*/


    const loaded = ref(false) ;
    const reservations = ref<any>([]) ;

    const statistics = ref<any>({}) ;


/* ----------------------------------------------------------------------------------*/

  function loadStatistics(){ 
      
       $api(`coach/dashboard_statistics`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("statistics:",res.data );
        statistics.value =  res.data.statistics ;

      }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      })
               
  }

  
/* -------------------------------------------------------------------------------------*/

  function loadReservations(){ 
      
       $api(`coach/dashboard_reservations`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("reservations:",res.data.reservations );

        reservations.value =  res.data.reservations ;
       

      }).catch(error=>{
        console.log("Error:",error); 
       
      }).finally(()=>{
        loaded.value = true ;
        hideLoading() ;
      })
               
  }

/* --------------------------------------------------------------------------------- */
    
    onMounted(() => {


        // set_has_annonce(false)
        // set_annonce_completed(true)
        // set_has_service(false) ;

        if(has_annonce.value && annonce_completed.value){
            loadReservations() ; 
            loadStatistics() ;  
        }else{
            loaded.value = true 
        }
            
        
        
    });

    

</script>

<template>
  

  <div class="page_main_content">

   
    <div> 

        <SkeletonDashboard v-if="!loaded"  />
    
         <div v-else >

            <CoachConfirmation v-if="!has_annonce || !annonce_completed || !has_service" />

            <div v-if="has_annonce && annonce_completed && has_service">
                 
                <AnnonceStatusAlert v-if="annonce_small" :status="annonce_small.status" />  
                
                <!-- reservation -->
                <div v-if="reservations.length" >
                    <v-card class="service_card">
                        <v-card-text>

                            <!-- header -->
                            <div class="d-flex justify-space-between align-center">
                                <div class="title"> Prochaine séance</div>

                                <v-btn  v-if="reservations.length"
                                    :to="'/espace-coach/reservations/'"
                                    size="default"
                                    variant="text" 
                                    append-icon="mdi-chevron-right"
                                    class=""> Voir tout
                                </v-btn>
                            </div>

                            <!-- reservation  -->
                            <div v-if="reservations.length" class="pt-4" >

                                <template v-for="reservation in reservations" :key="reservation.id">
                                    <ReservationCardCoach :reservation="reservation"/>
                                </template>
                                    
                            </div>
                            <EmptyReservation v-if="!reservations.length" />

                        </v-card-text>
                    </v-card>
                </div>
                <!-- /reservation -->

                    <!-- statics -->
                    <div>
                        <v-card class="service_card mt-4">
                            <v-card-text class="d-flex flex-wrap  align-centerr justify-center">

                                <v-row class="dashboard_row">
                                    <v-col cols="12" md="6">

                                    <StatisticItem
                                    :title="'Séances du jour'"
                                    :value="statistics.today_reservations"
                                    :icon="'mdi-calendar-clock'"
                                    :color="'success'"
                                    :link="'/espace-coach/reservations/today'"
                                    />
                                    
                                    </v-col>
                                    <v-col cols="12" md="6">

                                    <StatisticItem  
                                    :icon="'mdi-calendar-month-outline'"
                                    :title="'En attente de validation'"
                                    :value="statistics.waiting_reservations"
                                    :color="'orange'"
                                    />

                                    </v-col>
                                    <v-col cols="12" md="6">

                                        <StatisticItem  
                                        :icon="'mdi-calendar-month-outline'"
                                        :title="'Séances à venir'"
                                        :value="statistics.next_reservations"
                                        :color="'secondary'"
                                        />

                                    </v-col>
                                    <v-col cols="12" md="6">

                                    <StatisticItem 
                                    :icon="'mdi-calendar-check'"
                                    :title="'Séances complètes'"
                                    :value="statistics.completed_reservations"
                                    :color="'info'"
                                    />
                                    
                                    </v-col>
                                </v-row>

                            </v-card-text>
                        </v-card>
                    </div>
                    <!-- /statics -->
                  
            </div>
            <!-- completed and has service -->

        </div>
        <!-- loaded -->

    </div>

  </div>



</template>

<style scoped lang="scss">

    .page_main_content{
        
        
        background: #fff ;
    }

    .service_card{
        box-shadow: 0 12px 35px rgba(0,0,0,.08);
        border: 0px #eee solid ;
        border-radius: 6px ;
    }
 
   .title{
       font-size: 16px;
       color: #000;
       margin: 0px;
       font-weight: bold ;
    }



</style>