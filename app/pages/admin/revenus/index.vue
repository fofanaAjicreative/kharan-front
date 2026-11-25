<script setup lang="ts">
 
     import StatisticItem from '~/components/espace/StatisticItem.vue' ;
     
 
    const { $api } = useNuxtApp() ;
 
/* ----------------------------------------------------------------------------------*/


    const loaded = ref(false) ;
    const loaded2 = ref(false) ;
 
    const statistics = ref<any>({}) ;


/* ----------------------------------------------------------------------------------*/

  function loadStatistics(){ 
      
       $api(`admin/earning_statistics`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("statistics:",res.data );
        statistics.value =  res.data.statistics ;
 
      }).catch(error=>{
        console.log("Error:",error); 
       }).finally(()=>{
        loaded.value = true   ;  
       })
            
  }

  /* ----------------------------------------------------------------------------------*/

  function loadGraphs(){ 
      
       $api(`admin/earning_graphs`,{
        method: 'GET',
      }).then((res :any) =>{

        console.log("loadGraphs:",res.data );
        
        chartSeries_CA.value = res.data.data_ca ;
        chartSeries_Revenus.value = res.data.data_revenus ;

        
 
      }).catch(error=>{
        console.log("Error:",error); 
       }).finally(()=>{
        loaded2.value = true   ;  
       })
            
  }
  
 

/* ---------------------------------------------------------------------------------- */



        // Configuration des séries de données
        const chartSeries_CA = ref<any>([
          {
              name: '',
              data: [],
          },
        ])

        const chartSeries_Revenus = ref<any>([
          {
              name: '',
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
            categories: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
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
         
        colors: ['#22C55E','#3B82F6'],  
        })


/* --------------------------------------------------------------------------------- */
    
    onMounted(() => {

      loadStatistics() ;  
      loadGraphs() ;  

      
      
    });

    

</script>

<template>
  

  <div class="page_main_content">


 
 

    <SkeletonDashboard v-if="!loaded"  />

    <div v-else >

        <v-row>

                <!-- left side -->
            <v-col cols="12" lg="12">

                <v-card class="service_card mt-4">
                        <v-card-text class="d-flex flex-wrap  align-centerr justify-center">

                            <v-row>

                                <v-col cols="12" lg="4">
                                    <StatisticItem  
                                    :title="'Total CA'"
                                    :value="`${statistics.total_ca}&euro;`"
                                    :icon="'mdi-currency-usd'"
                                    :color="'info'"
                                    />
                                </v-col>

                                <v-col cols="12" lg="4">

                                    <StatisticItem
                                    :title="'Total revenus '"
                                    :value="`${statistics.revenus}&euro;`"
                                    :icon="'mdi-cash-multiple'"
                                    :color="'success'"
                                    :link="'/espace-coach/reservations/today'"
                                    />
                                
                                </v-col>


                                <v-col cols="12" lg="4">

                                    <StatisticItem
                                    :title="'Versements coachs'"
                                    :value="`${statistics.payouts}&euro;`"
                                    :icon="'mdi-credit-card-check'"
                                    :color="'info'"
                                    :link="'/espace-coach/reservations/today'"
                                    />
                                
                                </v-col>

                                <v-col cols="12" lg="4">
                                    <StatisticItem  
                                    :icon="'mdi-wallet'"
                                    :title="'CA en attente'"
                                    :value="`${statistics.total_ca_waiting}&euro;`"
                                    :color="'orange'"
                                    />
                                </v-col>

                                <v-col cols="12" lg="4">
                                    <StatisticItem  
                                    :icon="'mdi-bank'"
                                    :title="'Total TVA'"
                                    :value="`${statistics.total_tva}&euro;`"
                                    :color="'secondary'"
                                    />
                                </v-col>
                                
                            </v-row>

                        </v-card-text>
                    </v-card>

                
            </v-col>

            <!-- CA -->
            <v-col v-if="loaded2"  cols="12" lg="6">

                <v-card class="service_card mt-4 pa-3">
                <v-card-title class="graph_title"> Chiffre d'affaires </v-card-title>
                
                <v-card-text>
                   
                    <apexchart
                        type="area"
                        height="289"
                        :options="chartOptions"
                        :series="chartSeries_CA" >
                    </apexchart>

                </v-card-text>
                </v-card>

            </v-col>

            <!-- Revu -->
            <v-col v-if="loaded2"  cols="12" lg="6">

                <v-card class="service_card mt-4 pa-3">
                <v-card-title class="graph_title"> Revenus </v-card-title>
                
                <v-card-text>
                   
                    <apexchart
                        type="area"
                        height="289"
                        :options="chartOptions"
                        :series="chartSeries_Revenus" >
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