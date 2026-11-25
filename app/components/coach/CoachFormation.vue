<script setup lang="ts">

  import { formatMonthYear,formatDuration } from '~/utils/date'
  const { download } = useDownload()


/* ------------------------------- props --------------------------------------------------- */

  const props = defineProps({
        formations:{
            type: Object ,
            required:true
        }
    }) ;


/* ----------------------------------------------------------------------------------- */
 
  async function downloadDocument(document: any) {
      if(document.file && document.file.media_url){
         download(document.file.media_url) ;
      }
      
  }

/* ----------------------------------------------------------------------------------- */

</script>

<template>
     <div class="main_content">

        <v-row v-if="formations.length">
                <v-col cols="12" md="12"  v-for="formation in formations" :key="formation.id">

                <v-card class="service_card mt-4"   >

                        <!-- title -->
                        <div class="service_header d-flex flex-wrap justify-space-between align-center">
                                
                        <div>
                                <div class="service_title"> {{ formation.title }} </div>
                                
                                <!-- etablissement -->
                                <div class="service_etablissement"> 
                                        <span> 
                                        <v-icon icon="mdi-school" size="small" > </v-icon>
                                        {{ formation.etablissement }} 
                                        </span>  
                                </div>

                                <!-- date -->
                                <div class="service_city"> 
                                <span> 
                                <v-icon icon="mdi-clock-time-five-outline" size="small" > </v-icon>
                                {{ formatMonthYear(formation.start_date) }} – {{ formatMonthYear(formation.end_date) }}
                                </span> • 
                                <span>
                                        {{ formatDuration(formation.start_date,formation.end_date) }} </span> 
                                </div>

                                <!-- city -->
                                <div class="service_city"> 
                                        <span> 
                                <v-icon icon="mdi-map-marker-outline" > </v-icon>
                                        {{ formation.city }} 
                                </span>
                                </div>
                        </div>

                        
                        </div>
                        <v-divider class="mb-3 mt-3"> </v-divider>
                        <!-- /title -->

                        <!-- description -->
                        <div>
                           {{  formation.description  }}
                        </div>
                        <!-- /description -->

                        <div v-if="formation.file" 
                          class="d-flex flex-column justify-end align-end mt-4"  >
                                <v-btn  
                                        variant="flat" 
                                        color="#eee"
                                        prepend-icon="mdi-certificate"
                                        append-icon="mdi-download-circle-outline"
                                        @click="downloadDocument(formation)" 
                                >
                                        Télécharger
                                </v-btn>
                        </div>

                        
                </v-card>

        </v-col>
        </v-row>
        <v-row v-else >
                <v-col cols="12" md="12" >

                <!-- no_data -->
                  <div class="no_data text-center"  >

                    <v-btn class="mb-4"
                        color="#eee" 
                        variant="flat" 
                        icon="mdi-school-outline" 
                        size="x-large"></v-btn>
                     
                    <p  style="max-width: 400px ; margin: auto; color:#424242 "> 
                        Le coach n'a pas encore renseigner ses formations.
                    </p>

                     
                  </div>
                  <!-- / no_data -->

                 </v-col>
        </v-row>


     </div>
</template>

<style lang="scss" scoped>

        .main_content{
          padding: 20px ;
        }

        @media screen and (max-width: 600px) {
          .main_content{
            padding: 0px ;
          }
        }

        .service_card{
                padding: 20px ;
                box-shadow: 0 12px 35px rgba(0,0,0,.08);
                border: 0px #eee solid ;
                border-radius: 10px;
        }

        .services_content{
                padding: 20px ;
                margin: auto;
        }


        .service_title{
                font-size: 16px ;
                font-weight: bold ;
        }

        .service_etablissement,.service_city{
                font-size: 14px ;
        }

        .service_city{
                color: #424242 ;
        }


        

</style>