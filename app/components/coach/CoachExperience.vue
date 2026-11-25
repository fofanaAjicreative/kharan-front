<script setup lang="ts">

  import { formatMonthYear,formatDuration } from '~/utils/date'
  const { download } = useDownload()


/* ------------------------------- props --------------------------------------------------- */

  const props = defineProps({
        experiences:{
            type: Object ,
            required:true
        }
    }) ;

/* ---------------------------------------------------------------------------------- */

 const experienceContract  =  (type :string) => {
      if(type=='plein'){ return  "Temps plein" ; }
      else if(type=='partiel'){ return  "Temps partiel" ; }
      else if(type=='independant'){ return  "Indépendant" ; }
      else if(type=='freelance'){ return  "Freelance" ; }
      else if(type=='contract'){ return  "Contrat" ; }
 } 

/* ----------------------------------------------------------------------------------- */

  async function downloadDocument(document: any) {
      if(document.file && document.file.media_url){
         download(document.file.media_url) ;
      }
      
  }


</script>

<template>
     <div class="main_content">

        <v-row v-if="experiences.length">
                <v-col cols="12" md="12"  v-for="experience in experiences" :key="experience.id">

                <v-card class="service_card mt-4"   >

                        <!-- header -->
                        <div class="service_header d-flex flex-wrap justify-space-between align-center">
                                
                        <div>
                                <div class="service_title"> {{ experience.title }} </div>
                                
                                <!-- etablissement -->
                               <div class="service_etablissement"> 
                                     <span> 
                                      <v-icon icon="mdi-bank" size="small" > </v-icon>
                                        {{ experience.etablissement }} 
                                      </span> • 
                                      <span> {{ experienceContract(experience.contract) }} </span> 
                                </div>

                                <!-- date -->
                                <div class="service_city"> 
                                <span> 
                                <v-icon icon="mdi-clock-time-five-outline" size="small" > </v-icon>
                                {{ formatMonthYear(experience.start_date) }} – {{ formatMonthYear(experience.end_date) }}
                                </span> • 
                                <span>
                                        {{ formatDuration(experience.start_date,experience.end_date) }} </span> 
                                </div>

                                <!-- city -->
                                <div class="service_city"> 
                                        <span> 
                                <v-icon icon="mdi-map-marker-outline" > </v-icon>
                                        {{ experience.city }} 
                                </span>
                                </div>
                        </div>

                        
                        </div>
                        <v-divider class="mb-3 mt-3"> </v-divider>
                        <!-- /header -->

                        <!-- description -->
                        <div>
                           {{  experience.description  }}
                        </div>
                        <!-- /description -->

                        <div v-if="experience.file" 
                          class="d-flex flex-column justify-end align-end mt-4"  >
                                <v-btn  
                                        variant="flat" 
                                        color="#eee"
                                        prepend-icon="mdi-text-box-outline"
                                        append-icon="mdi-download-circle-outline"
                                        @click="downloadDocument(experience)" 
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
                        Le coach n'a pas encore renseigner ses expériences.
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