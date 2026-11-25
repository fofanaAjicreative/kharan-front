<script setup lang="ts">

  import StatisticItem from '~/components/espace/StatisticItem.vue' ;
  import ReservationCardClient from '~/components/espace/ReservationCardClient.vue' ;
  import EmptyReservation from '~/components/espace/EmptyReservation.vue' ;

   const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

  const loaded = ref(false) ;
  const reservations = ref<any>([]) ;

  const statistics = ref<any>({}) ;

/* ----------------------------------------------------------------------------------*/

 
  function loadDashboard(){ 
      
      // showLoading() ;
      $api(`dashboard_statistics`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("DASHBOARD:",res.data );

        statistics.value =  res.data.statistics ;
        reservations.value =  res.data.today_reservations ;
        
        hideLoading() ;
        loaded.value = true ;
      }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      })
               
  }

  

  /* --------------------------------------------------------------------------------- */
    
    onMounted(() => {
        loadDashboard()   ;             
    });

    
 
</script>

<template>
  
 <SkeletonDashboard v-if="!loaded"  />

  <div v-else class="page_main_content">

     <div class="page_content">



        <!-- reservations -->
        <div v-if="reservations.length" class="mt-4">
            <v-card class="service_card">
                <v-card-text>

                    <!-- header -->
                    <div class="d-flex justify-space-between align-center">
                        <div class="title"> Prochaine séance</div>

                        <v-btn  v-if="reservations.length"
                            :to="'/espace-client/reservations/'"
                            variant="text" 
                            append-icon="mdi-chevron-right"
                            size="default"
                            class=""> Voir tout
                        </v-btn>
                    </div>

                    <!-- reservation  -->

                    <div v-if="reservations.length" class="pt-4" >
                        <template v-for="reservation in reservations.slice(0,1)"  >
                            <ReservationCardClient :reservation="reservation" :statusOptions="[]" />
                        </template>
                    </div>

                    <EmptyReservation v-if="!reservations.length" />

                </v-card-text>
            </v-card>
        </div>
        <!-- /reservations -->

      <!-- statics -->
          <div>
              <v-card class="service_card mt-4">
                  <v-card-text class="d-flex flex-wrap  align-centerr justify-center">

                    <v-row>
                        <v-col cols="12" md="6">

                          <StatisticItem
                          :title="'Séances à venir'"
                          :value="statistics.next_reservations"
                          :icon="'mdi-calendar-clock'"
                          :color="'secondary'"
                          :link="'/espace-client/reservations'"
                          />
                          
                        </v-col>
                        <v-col cols="12" md="6">

                          <StatisticItem  
                            :icon="'mdi-calendar-check'"
                            :title="'Séances terminées'"
                            :value="statistics.completed_reservations"
                            :color="'info'"
                            :link="'/espace-client/reservations'"
                          />

                        </v-col>
                        
                    </v-row>

                  </v-card-text>
              </v-card>
          </div>
          <!-- /statics -->



          
         
     </div>
  
  </div>



</template>

<style scoped lang="scss">

    .page_main_content{
        max-width: 1400px ;
        margin: auto ;
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