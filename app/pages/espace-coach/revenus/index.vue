<script setup lang="ts">
 
     import StatisticItem from '~/components/espace/StatisticItem.vue' ;
     

     

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
 
    const statistics = ref<any>({}) ;


/* ----------------------------------------------------------------------------------*/

  function loadStatistics(){ 
      
       $api(`coach/earning_statistics`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("statistics:",res.data );
        statistics.value =  res.data.statistics ;

        // graph

        chartSeries.value[0].data = res.data.payouts_graph.amounts ;
        chartOptions.value.xaxis.categories = res.data.payouts_graph.dates ;

      }).catch(error=>{
        console.log("Error:",error); 
       }).finally(()=>{
        loaded.value = true   ;  
        hideLoading() ;
      })
            
  }

  
 

/* ---------------------------------------------------------------------------------- */



        // Configuration des séries de données
        const chartSeries = ref<any>([
        {
            name: 'Versement',
            data: [],
        },
        ])

        // Configuration des options du graphique
        const chartOptions = ref({
        chart: {
            type: 'area',
            toolbar: {
            show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            categories: [],
        },
        yaxis: {
            labels: {
                formatter: function (val :any) {
                    return val + ' €' // Ajoute " €" après chaque valeur de l'axe Y
                }
            }
       },
            // -------------------------------------------
        tooltip: {
            y: {
            formatter: function (val :any) {
                return val + ' €'  
            }
            }
        },
         
        colors: ['#1867C0'],  
        })


/* --------------------------------------------------------------------------------- */
    
    onMounted(() => {

        if(has_annonce.value && annonce_completed.value){
            
            loadStatistics() ;  
        }else{
            loaded.value = true 
        }
            
        
        
    });

    

</script>

<template>
  

  <div class="page_main_content">


 
 

    <SkeletonDashboard v-if="!loaded"  />

    <div v-else >

        <v-row>

                <!-- left side -->
            <v-col cols="12" lg="4">

                <v-card class="service_card mt-4">
                        <v-card-text class="d-flex flex-wrap  align-centerr justify-center">

                            <v-row class="dashboard_row">

                                <v-col cols="12">
                                    <StatisticItem  
                                    :title="'Dernier versement'"
                                    :subTitle="`${statistics?.payouts_last?.date}`"
                                    :value="`${statistics?.payouts_last?.amount}&euro;`"
                                    :icon="'mdi-credit-card-check'"
                                    :color="'success'"
                                    />
                                </v-col>

                                <v-col cols="12">

                                    <StatisticItem
                                    :title="'Revenus versés'"
                                    :value="`${statistics.payouts_paid}&euro;`"
                                    :icon="'mdi-credit-card-check'"
                                    :color="'info'"
                                     
                                    />
                                
                                </v-col>

                                <v-col cols="12">
                                    <StatisticItem  
                                    :icon="'mdi-wallet'"
                                    :title="'Revenus en attente'"
                                    :value="`${statistics.payouts_waiting}&euro;`"
                                    :color="'orange'"
                                    />
                                </v-col>
                                
                            </v-row>

                        </v-card-text>
                    </v-card>

                
            </v-col>

            <!-- right side -->
            <v-col cols="12" lg="8">

                <v-card class="service_card mt-4 pa-3">
                <v-card-title class="graph_title"> Derniers versements </v-card-title>
                
                <v-card-text>
                   
                    <apexchart
                        type="area"
                        height="289"
                        :options="chartOptions"
                        :series="chartSeries" >
                    </apexchart>

                </v-card-text>
                </v-card>

            </v-col>
        </v-row>

    </div>
    <!-- loaded -->
 
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

    .graph_title{
       font-size: 17px;
       color: #424242;
       font-weight: bold ;
    }

  

</style>