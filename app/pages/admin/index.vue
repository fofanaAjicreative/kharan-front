<script setup lang="ts">

  import StatisticItem from '~/components/espace/StatisticItem.vue' ;

 
 
 const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

  const loaded = ref(false) ;
  const reservations = ref<any>([]) ;

  const statistics = ref<any>({}) ;

/* ----------------------------------------------------------------------------------*/

 
  function loadDashboard(){ 
      
      // showLoading() ;
      $api(`admin/dashboard_statistics`,{
        method: 'GET',
      }).then((res :any) =>{

         
        statistics.value =  res.data.statistics ;
         
       
      }).catch(error=>{
       
            let error_message = error.message ;

            if(error.statusCode==400){
            error_message = 'Données incomplètes ou incorrectes.'
            }
            
            showErrorSnackbar({
                title: 'Erreur',
                message: error_message
            }) ;

      }).finally(()=>{
        hideLoading() ;
        loaded.value = true ;
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

        <!-- statics -->
          <div>
              <v-card class="service_card mt-4">
                  <v-card-text class="d-flex flex-wrap  align-centerr justify-center">

                    <v-row class="dashboard_row">

                        <!--  reservation today   -->
                        <v-col cols="12" lg="4" md="6">

                          <StatisticItem
                            :title="`Séances d'aujourd'hui`"
                            :value="statistics.reservations_today"
                            :icon="'mdi-calendar'"
                            color="secondary"
                            :link="'/admin/reservations'"
                          />
                          
                        </v-col>

                         <!--  reservation next  -->
                        <v-col cols="12" lg="4" md="6">

                          <StatisticItem
                            :title="`Séances à venir `"
                            :value="statistics.reservations_next"
                            :icon="'mdi-calendar-month'"
                            color="info"
                            :link="'/admin/reservations/calendar'"
                          />
                          
                        </v-col>

                        <!--  reservation completed  -->
                        <v-col cols="12" lg="4" md="6">

                          <StatisticItem
                            :title="`Séances terminées`"
                            :value="statistics.reservations_completed"
                            :icon="'mdi-calendar-multiple-check'"
                            color="success"
                            :link="'/admin/reservations'"
                          />
                          
                        </v-col>

                        <!-- annonce waiting -->
                        <v-col cols="12" lg="4" md="6">

                          <StatisticItem  
                            :icon="'mdi-card-account-details-outline'"
                            :title="'Annonces en attente'"
                            :value="statistics.annonces_waiting"
                            :color="'orange'"
                            :link="'/admin/annonces'"
                          />

                        </v-col>

                        <!-- annonce approved -->
                        <v-col cols="12" lg="4" md="6">

                          <StatisticItem  
                            :icon="'mdi-card-account-details-outline'"
                            :title="'Annonces actives'"
                            :value="statistics.annonces_approved"
                            color="success"
                            :link="'/admin/annonces'"
                          />

                        </v-col>


                        <!-- client total -->
                        <v-col cols="12" lg="4" md="6">

                          <StatisticItem  
                            :icon="'mdi-account-multiple-outline'"
                            :title="'Total clients '"
                            :value="statistics.clients_total"
                            color="secondary"
                            :link="'/admin/clients'"
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