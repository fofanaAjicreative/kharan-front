<script setup lang="ts" >

 import CoachHero from  '~/components/espace/CoachHero.vue' ;
 import AnnonceStatusAlert from '~/components/espace/AnnonceStatusAlert.vue' ;
 import ServiceFormat from '~/components/espace/ServiceFormat.vue' ;

  const { $api } = useNuxtApp() ;
  const { dialog, has_annonce, annonce_completed, has_service, accept, cancel } = useAnnonceDialog()
  const { showLoading, hideLoading } = useGlobalLoading() ;
  const { confirm } = useConfirm() ;

  const { truncate } = useText() ;

  const  loaded = ref(false) ;
  const  loading = ref(false) ;
  useSeoMeta({ title: 'Mon annonce' })
  
  const services = ref<any>([]) ;
  const annonce = ref<any>(null) ;

  const route = useRoute() ;
  const currentTab = route.query.tab == 'services'?'services':'annonce'
  const tab = ref(currentTab)

/* ---------------------------------------------------------------------------------- */

 
  const toggleDescription  =  (service :any) => {
      service.expanded = !service.expanded ;
  }


/* ------------------------------------------------------------------------------- */
  

  async function removeService(service: any) {

    const accepted = await confirm({
      title: 'Supprimer le service',
      text: 'Voulez-vous vraiment supprimer ce service ?'
    })

    if (!accepted) { return } 

    showLoading() ;

    $api(`/annonces/delete_service/${service.id}`,{
      method: 'DELETE',
    }).then((res :any) =>{
        loadAnnonce() ;
    }).catch(error=>{
      hideLoading() ;
      console.log(error);
    })

  }


/* ------------------------------------------------------------------------------- */

  function enableService(service :any ){ 
    
    const old_value = !service.enabled ;

      loading.value = true ;
      showLoading() ;

      const post_data = {
        enabled : service.enabled
      }

      console.log(post_data);

      
      $api(`/annonces/enable_service/${service.id}`,{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
         
        console.log("Res:",res);
        hideLoading() ;
        
      }).catch(error=>{
        service.enabled = old_value ; 
        hideLoading() ;
        console.log(error);
      })
               
  }


/* ---------------------------------------------------------------------------------- */


  function loadAnnonce(){ 
               
      showLoading() ;

      $api('/annonces/my_annonce',{
        method: 'GET',
       }).then((res :any) =>{

        // console.log("Annonce:",res.data.annonce );
        // console.log("SERVICES:",res.data.annonce.services);

  
        annonce.value = res.data.annonce ;
        services.value = res.data.annonce.services ;

      
        loaded.value = true ;

        hideLoading() ;
         
    
      }).catch(error=>{

        loaded.value = true 
        console.log("Error:",error); 
        hideLoading() ;
         
      })
               
  }



  /* --------------------------------------------------------------------------------- */

    onMounted(() => {
        
          if(has_annonce.value){
            loadAnnonce() ;
          } else{
            loaded.value = true 
          }

    });

  /* --------------------------------------------------------------------------------- */

   
</script>

 <template>
  
  <div class="main_content">


    <SkeletonDashboard v-if="!loaded"  />
    <section v-else
     class="mb-2 profil_form" >

      <v-sheet elevation="0" class="coach_hero" >


         
        <v-tabs 
          v-model="tab"
          color="secondary" 
          bg-color="#F4F4F4"
          grow show-arrows 
          >
          <v-tab value="annonce"> Mon annonce </v-tab>
          <v-tab value="services" v-if="annonce_completed"> Mes services </v-tab>
        </v-tabs>

          <v-divider></v-divider>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="annonce">
              <v-sheet>

                  <div class="services_contentt">

                      <CoachConfirmation v-if="!has_annonce" />
                      
                      <div v-if="has_annonce && annonce" 
                          class="annonce_content" >


                           <!-- Annonce status -->
                              <AnnonceStatusAlert :status="annonce.status" />
                            <!-- / Annonce status -->
                          
                          <CoachHero :annonce="annonce" />

                      </div>
                     
                  </div>
                 
              </v-sheet>
            </v-tabs-window-item>
            
            <v-tabs-window-item value="services">
              <v-sheet  >
                <div class="tab_content" >

                  <div class="services_content">
                     
                    <!-- header -->
                    <div v-if="loaded && services.length" class="d-flex justify-space-between ">
                      <span class="text-secondary"> 
                        {{ services.length }} service(s)
                      </span>
                      <v-btn 
                        to="/espace-coach/services/add" 
                        prepend-icon="mdi-plus"
                        variant="flat"
                        color="secondary"
                        size="default" >
                        Ajouter un service </v-btn>
                    </div>
                    <!-- <v-divider></v-divider> -->
                    <!-- header -->

                    <v-row>
                      <v-col cols="12" md="6"  v-for="service in services" :key="service.id">

                        <v-card class="service_card mt-4"   >

                          <!-- title -->
                          <div class="service_header d-flex flex-wrap justify-space-between align-center">
                                  
                              <div>
                                   <span class="service_title"> {{ service.title }} </span>
                              </div>
                              <div style="min-width: 100px; margin-left: 6px ;">
                               
                                <v-switch
                                    v-model="service.enabled"
                                    :label="service.enabled?'Activé':'Desactivé'"                         
                                    v-on:change="enableService(service)"
                                    color="info"
                                    inset="material"
                                    size="small"
                                    hide-details >
                                </v-switch>
                                
                              </div>
 
                          </div>
                          <v-divider> </v-divider>
                          <!-- /title -->

                          <!-- description -->
                          <v-card-text>

                          <div>

                            {{ service.expanded ? service.description : truncate(service.description, 400) }}
                            <v-btn v-if="service.description.length>500"
                                variant="text" color="secondary" size="small"
                                class="toggle_description"
                                @click="toggleDescription(service)" >
                                {{ service.expanded ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>

                          </div>

                          <div class="d-flex flex-wrap justify-space-between align-center">
                               
                              <!-- format -->
                              <ServiceFormat :service="service" />

                              <div class="mt-4 ml-2">  
                                <span class="service_price "> {{ service.price }}&euro; </span> 
                                <span class="service_price_ttc text-info">({{ service.price_ttc }}&euro;) TTC  </span> 
                                
                              </div>  

                          </div>
                                                          
                          </v-card-text>
                          <!-- /description -->

                            <v-divider> </v-divider>
                            <div class="pa-4 d-flex justify-space-between">
                                  
                                <v-btn 
                                    @click="removeService(service)"
                                    color="secondary"
                                    prepend-icon="mdi-trash-can-outline"
                                    variant="outlined" >
                                    Supprimer 
                                </v-btn>

                                <v-btn 
                                 :to="`/espace-coach/services/${service.id}`"
                                  variant="outlined" 
                                  color="info"
                                  append-icon="mdi-square-edit-outline" > 
                                  Modifier </v-btn>

                            </div>

                        </v-card>

                      </v-col>
                    </v-row>

                  </div>


                  <!-- no_data -->
                  <div v-if="loaded && !services.length"
                     class="no_data text-center"  >
                    <v-btn color="#eee" variant="flat" icon="mdi-server-outline" size="x-large"></v-btn>
                    <h2 class="title">Vous n’avez pas encore de prestation </h2>

                    <p class="description"> 
                       Ajoutez vos prestations pour présenter votre expertise aux clients. Définissez vos services, 
                       tarifs et modalités, puis rendez-les disponibles à la réservation.
                    </p>

                    <p class="mt-10">
                       <v-btn to="/espace-coach/services/add" variant="flat" color="secondary" > Ajouter un service </v-btn>
                    </p>
                  </div>
                  <!-- / no_data -->

                </div>

              </v-sheet>
            </v-tabs-window-item>
          </v-tabs-window>

      </v-sheet>

    </section>

  </div>
 
</template>

<style scoped lang="scss">
  

  .tab_content{
      padding : 10px ;
  }


  .service_card{
    box-shadow: 0 12px 35px rgba(0,0,0,.08);
    border: 1px #eee solid ;
    border-radius: 6px ;
  }
  .services_content{
    padding: 10px ;
    margin: auto;
  }

  @media (max-width: 839px){
    
    .services_content{
      padding: 4px ;
    }

  }


  .service_title{
    font-size: 16px ;
    font-weight: bold ;
  }

  .service_price{
    font-size: 14px ;
    font-weight: bold ;
    color: #333 ;
  }

  .service_price_ttc{
    font-size: 16px ;
    font-weight: bold ;
  }

  .service_header{
    padding: 10px ;
    flex-wrap: nowrap;
  }

  @media(max-width: 500px) {
    .service_header{
        flex-wrap: wrap;
      }
  }



  .no_data{
    max-width: 500px ;
    margin: auto ;
    padding: 30px 10px;
    .title{
      font-size: 18px ;
    }
    .description{
      color : #424242 ;
      font-size: 14px ;

    }

  }
    
  /* ----------------------- annonce ---------------------------------- */

  .coach_hero{
       box-shadow: 0 12px 35px rgba(0,0,0,.08);
        border: 0px #eee solid ;
        border-radius: 10px;
  }


  .annonce_content{
   /*  max-width: 1200px ; */
    margin : 0px   ;
  }

  .annonce{
    border : 1px #eee solid ;
    border-radius: 6px ;
    padding: 10px ;
  }



</style>
