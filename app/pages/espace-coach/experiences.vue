<script setup lang="ts" >

  const { $api } = useNuxtApp() ;
  const { dialog, has_annonce, annonce_completed, has_service, accept, cancel } = useAnnonceDialog() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;

  const { confirm } = useConfirm() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;
  import { formatMonthYear,formatDuration } from '~/utils/date'
  const { download } = useDownload()

 
  const { truncate } = useText() ;

  const  loaded = ref(false) ;
 
  useSeoMeta({ title: 'Mes expériences' })
  
  const formations = ref<any>([]) ;
  const experiences = ref<any>([]) ;

  const current_experience = ref<any>({ }) ;
  const current_formation = ref<any>({ }) ;

  const form_params = ref<any>({
    loading : false ,
    server_error : false ,
    server_error_message : "" ,
  }) ;

 
  const tab = ref('formations')

  // forms
  const  experience_dialog = ref(false) ;
  const  formation_dialog = ref(false) ;

/* ---------------------------------------------------------------------------------- */

 const experienceContract  =  (type :string) => {
      if(type=='plein'){ return  "Temps plein" ; }
      else if(type=='partiel'){ return  "Temps partiel" ; }
      else if(type=='independant'){ return  "Indépendant" ; }
      else if(type=='freelance'){ return  "Freelance" ; }
      else if(type=='contract'){ return  "Contrat" ; }
 } 

 
  const toggleDescription  =  (formation :any) => {
      formation.expanded = !formation.expanded ;
  }


/* ------------------------------------------------------------------------------- */

  async function addExperience() {
    resetError() ; 
    current_experience.value = {} ;
    experience_dialog.value = true ;
  }

/* ------------------------------------------------------------------------------- */

  async function addFormation() {

    resetError() ; 
    current_formation.value = {} ;
    formation_dialog.value = true ;

  }

/* ------------------------------------------------------------------------------- */

  async function editExperience(experience: any) {
 
    let start_month = null ;
    let start_year = null ;

    let end_month = null ;
    let end_year = null ;
    

    if(experience.start_date){
      let s_date = experience.start_date.split('T')[0] ;
      start_year =  s_date.split('-')[0] ;
      start_month =   s_date.split('-')[1] ;
    }
    if(experience.end_date){
      let e_date = experience.end_date.split('T')[0] ;
      end_year =  e_date.split('-')[0] ;
      end_month =   e_date.split('-')[1] ;
    }
 
    resetError() ; 
    current_experience.value = {
        id : experience.id ,
        title : experience.title,
        contract : experience.contract,
        etablissement : experience.etablissement,
        city : experience.city,
        description : experience.description,
        in_progress : experience.in_progress,

        start_month:  start_month ,
        start_year:  start_year ,

        end_month:  end_month ,
        end_year:  end_year ,
        file : experience.file
         
    } ;
    experience_dialog.value = true ;

    console.log("current_experience:", current_experience.value);
    

  }

/* ------------------------------------------------------------------------------- */

  async function editFormation(experience: any) {

    let start_month = null ;
    let start_year = null ;

    let end_month = null ;
    let end_year = null ;
    

    if(experience.start_date){
      let s_date = experience.start_date.split('T')[0] ;
      start_year =  s_date.split('-')[0] ;
      start_month =   s_date.split('-')[1] ;
    }
    if(experience.end_date){
      let e_date = experience.end_date.split('T')[0] ;
      end_year =  e_date.split('-')[0] ;
      end_month =   e_date.split('-')[1] ;
    }
 
    resetError() ; 
    current_formation.value = {
        id : experience.id ,
        title : experience.title,
        etablissement : experience.etablissement,
        city : experience.city,
        description : experience.description,
        in_progress : experience.in_progress,

        start_month:  start_month ,
        start_year:  start_year ,

        end_month:  end_month ,
        end_year:  end_year ,
        file : experience.file
         
    } ;

    formation_dialog.value = true ;

    console.log("current_formation:", current_formation.value);

  }




/* ------------------------------------------------------------------------------- */

  async function removeExperience(experience: any) {

      const accepted = await confirm({
        title: 'Supprimer',
        text: 'Voulez-vous vraiment supprimer cette expérience ?'
      })
      if (!accepted) { return } 

      showLoading() ;

      $api(`/user/experience/${experience.id}/delete`,{
        method: 'DELETE',
      }).then((res :any) =>{
            experiences.value = experiences.value.filter((item :any) => item.id!=experience.id)
            hideLoading() ;
      }).catch(error=>{
        hideLoading() ;

        showErrorSnackbar({
          title: 'Erreur',
          message: error.message
        }) 

        console.log(error);
      })

  }

/* ---------------------------------------------------------------------------- */


  async function downloadExperienceDocument(experience: any) {
      if(experience.file && experience.file.media_url){
        download(experience.file.media_url) ;
      }
  }
  

/* ------------------------------------------------------------------------------- */

  async function removeFormation(formation: any) {

    const accepted = await confirm({
      title: 'Supprimer',
      text: 'Voulez-vous vraiment supprimer cette formation ?'
    })
    if (!accepted) { return } 

    showLoading() ;

    $api(`/user/formation/${formation.id}/delete`,{
      method: 'DELETE',
    }).then((res :any) =>{
          formations.value = formations.value.filter((item :any) => item.id!=formation.id)
          hideLoading() ;
    }).catch(error=>{
      hideLoading() ;

      showSuccessSnackbar({
        title: 'Erreur',
        message: error.message
       }) 

      console.log(error);
    })

  }

/* ---------------------------------------------------------------------------------- */


  function loadExperiences(){ 
               
      showLoading() ;

      $api('/user/experiences?',{
        method: 'GET',
       }).then((res :any) =>{
        
        console.log("EXPERIENCES:",res.data );

        experiences.value =  res.data.experiences ;
        formations.value =  res.data.formations ;
        
        loaded.value = true ;
        hideLoading() ;
         
    
      }).catch(error=>{

    
        console.log("Error:",error); 
        hideLoading() ;
         
      })
               
  }


/* ---------------------------------------------------------------------------------- */ 


    function resetError() {
      form_params.value.loading = false ;
      form_params.value.server_error = false ;
      form_params.value.server_error_message = "" ;
    }

/* ---------------------------------------------------------------------------------- */

  function saveExperience(post_data :FormData ){ 
 
       showLoading() ;

      if(!current_experience.value.id){ // add
        $api('/user/experience/add',{
            method: 'POST',
            body:post_data
        }).then((res :any) =>{
          hideLoading() ;
          experience_dialog.value = false ;
          loadExperiences() ;
          resetError() ;
        }).catch(error=>{
          
          hideLoading() ;

          form_params.value.loading = false ;
          form_params.value.server_error = true ;
          form_params.value.server_error_message = error.message ;

          if(error.statusCode==400){
            form_params.value.server_error_message = 'Données incomplètes ou incorrectes.'
          }
          console.log("Error:",error);   
        })
      }else{ // edit

        $api(`/user/experience/${current_experience.value.id}/edit`,{
            method: 'PUT',
            body:post_data
        }).then((res :any) =>{
          hideLoading() ;
          experience_dialog.value = false ;
          loadExperiences() ;
          resetError() ;
        }).catch(error=>{
          
          hideLoading() ;

          form_params.value.loading = false ;
          form_params.value.server_error = true ;
          form_params.value.server_error_message = error.message ;

          if(error.statusCode==400){
            form_params.value.server_error_message = 'Données incomplètes ou incorrectes.'
          }
          console.log("Error:",error);   
        })

      }
               
  }

/* ---------------------------------------------------------------------------------- */

  function saveFormation(post_data :FormData ){ 
 
       showLoading() ;

      if(!current_formation.value.id){ // add
        $api('/user/formation/add',{
            method: 'POST',
            body:post_data
        }).then((res :any) =>{
          hideLoading() ;
          experience_dialog.value = false ;
          formation_dialog.value = false ;
          loadExperiences() ;
          resetError() ;
        }).catch(error=>{
          
          hideLoading() ;

          form_params.value.loading = false ;
          form_params.value.server_error = true ;
          form_params.value.server_error_message = error.message ;

          if(error.statusCode==400){
            form_params.value.server_error_message = 'Données incomplètes ou incorrectes.'
          }
          console.log("Error:",error);   
        })
      }else{ // edit

        $api(`/user/formation/${current_formation.value.id}/edit`,{
            method: 'PUT',
            body:post_data
        }).then((res :any) =>{
          hideLoading() ;
          experience_dialog.value = false ;
          formation_dialog.value = false ;
          loadExperiences() ;
          resetError() ;
        }).catch(error=>{
          
          hideLoading() ;

          form_params.value.loading = false ;
          form_params.value.server_error = true ;
          form_params.value.server_error_message = error.message ;

          if(error.statusCode==400){
            form_params.value.server_error_message = 'Données incomplètes ou incorrectes.'
          }
          console.log("Error:",error);   
        })

      }
               
  }


  /* --------------------------------------------------------------------------------- */

    onMounted(() => {
      loadExperiences() ;
    });

  /* --------------------------------------------------------------------------------- */

   
</script>

 <template>
  
  <div class="main_content">

    <section class="mb-2" >

      <SkeletonDashboard v-if="!loaded"  />
      <v-sheet v-else elevation="0" class="coach_hero" >

        <v-tabs
         v-model="tab" 
         color="secondary" 
         bg-color="#F4F4F4"
         grow>
          <v-tab value="formations">Formations </v-tab>
          <v-tab value="experiences"> Expériences </v-tab>
        </v-tabs>

          <v-divider></v-divider>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="formations">
              <v-sheet class="pa-0"  >

                <div class="tab_content" >

                  <div class="services_content">
                     
                    <!-- header -->
                    <div v-if="loaded && formations.length" class="d-flex justify-space-between ">
                      <span class="text-secondary" > 
                        {{ formations.length }} formation(s)
                      </span>
                      <v-btn 
                          @click="addFormation()"
                          prepend-icon="mdi-plus"
                          variant="flat"
                          color="secondary">
                          Ajouter </v-btn>
                    </div>
                    <!-- <v-divider></v-divider> -->
                    <!-- header -->

                    <v-row>
                      <v-col cols="12" md="12"  v-for="formation in formations" :key="formation.id">

                        <v-card class="service_card mt-4"   >

                          <!-- title -->
                          <div class="service_header d-flex flex-wrap justify-space-between align-center">
                                  
                              <div>
                                   <div class="service_title"> {{ formation.title }} </div>
                                   
                                   <!-- etablissement -->
                                   <div class="service_etablissement"> 
                                     <span> 
                                      <v-icon icon="mdi-bank" size="small" > </v-icon>
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
                          <v-divider> </v-divider>
                          <!-- /title -->

                          <!-- description -->
                          <v-card-text>

                          <div>
                            {{ formation.expanded ? formation.description : truncate(formation.description, 400) }}
                            <v-btn v-if="formation.description.length>400"
                                variant="text" color="secondary" size="small"
                                class="toggle_description"
                                @click="toggleDescription(formation)" >
                                {{ formation.expanded ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>

                          </div>

                          <div v-if="formation.file" 
                             class="d-flex flex-column justify-end align-ends mt-4"  >
                                <v-avatar rounded="0" size="150" container   
                                    :image="formation.file?.filetype?.includes('image')?formation.file.media_url :'/images/document_placeholder.jpg'"
                                    @click="" />

                                <v-btn  
                                    width="150"
                                    variant="flat" 
                                    color="#eee"
                                    prepend-icon="mdi-download"
                                    @click="downloadExperienceDocument(formation)" 
                                    class="mt-2"  >
                                    Télécharger
                                </v-btn>
                          </div>
                 
                          </v-card-text>
                          <!-- /description -->

                            <v-divider class="mb-4" > </v-divider>
                            <div class="d-flex justify-end ga-6 ">
                                  
                                <v-btn 
                                    @click="removeFormation(formation)"
                                    color="secondary"
                                    variant="outlined"
                                    prepend-icon="mdi-trash-can-outline"
                                     >
                                    Supprimer 
                                </v-btn>

                                <v-btn 
                                    @click="editFormation(formation)"
                                    color="info"
                                    prepend-icon="mdi-square-edit-outline"
                                    variant="outlined" >
                                    Modifier 
                                </v-btn>

                            </div>
                        </v-card>

                      </v-col>
                    </v-row>

                  </div>
                    
                  <!-- no_data -->
                    <div v-if="loaded && !formations.length"
                      class="no_data text-center"  >
                      
                        <v-avatar
                          size="70"
                          color="secondary"
                          variant="tonal"
                          class="mb-6" >

                          <v-icon
                              icon="mdi-account-school-outline"
                              size="34" >
                          </v-icon>
                        </v-avatar>

                      <!-- <h3 class="title"> &nbsp; </h3> -->
                      <p class="description"> Aucune formation enrégistrée  </p>

                      <p class="mt-8">
                        <v-btn 
                          @click="addFormation()"
                          variant="flat" color="secondary" > Ajouter une formation </v-btn>
                      </p>
                    </div>
                  <!-- / no_data -->
                     
                  
                </div>
              </v-sheet>
            </v-tabs-window-item>
            <v-tabs-window-item value="experiences">
              <v-sheet  >

                <div class="tab_content" >

                  <div class="services_content">
                     
                    <!-- header -->
                    <div v-if="loaded && experiences.length" class="d-flex justify-space-between ">
                      <span class="text-secondary" > 
                        {{ experiences.length }} expérience(s)
                      </span>
                      <v-btn 
                          @click="addExperience()"
                          prepend-icon="mdi-plus"
                          variant="flat"
                          color="secondary">
                          Ajouter </v-btn>
                    </div>
                    <!-- <v-divider></v-divider> -->
                    <!-- header -->

                    <v-row>
                      <v-col cols="12" md="12"  v-for="experience in experiences" :key="experience.id">

                        <v-card class="service_card mt-4"   >

                          <!-- title -->
                          <div class="service_header d-flex flex-wrap justify-space-between align-start">
                                  
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
                          <v-divider> </v-divider>
                          <!-- /title -->

                          <!-- description -->
                          <v-card-text>

                          <div>
                            {{ experience.expanded ? experience.description : truncate(experience.description, 400) }}
                            <v-btn v-if="experience.description.length>400"
                                variant="text" color="secondary" size="small"
                                class="toggle_description"
                                @click="toggleDescription(experience)" >
                                {{ experience.expanded ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>

                          </div>
                           
                          <div v-if="experience.file" 
                             class="d-flex flex-column justify-end align-ends mt-4"  >
                                <v-avatar rounded="0" size="150" container   
                                    :image="experience.file?.filetype?.includes('image')?experience.file.media_url :'/images/document_placeholder.jpg'"
                                    @click="" />

                                <v-btn  
                                    width="150"
                                    variant="flat" 
                                    color="#eee"
                                    prepend-icon="mdi-download"
                                    @click="downloadExperienceDocument(experience)" 
                                    class="mt-2"  >
                                    Télécharger
                                </v-btn>
                          </div>
                 
                          </v-card-text>
                          <!-- /description -->

                            <v-divider class="mb-4"> </v-divider>
                            <div class="d-flex justify-end ga-6">
                                  
                                <v-btn 
                                    @click="removeExperience(experience)"
                                    color="secondary"
                                    variant="outlined"
                                    prepend-icon="mdi-trash-can-outline"
                                    >
                                    Supprimer 
                                </v-btn>

                                <v-btn 
                                    @click="editExperience(experience)"
                                    color="info"
                                    prepend-icon="mdi-square-edit-outline"
                                    variant="outlined" >
                                    Modifier 
                                </v-btn>

                            </div>
                        </v-card>

                      </v-col>
                    </v-row>

                  </div>


                  <!-- no_data -->
                  <div v-if="loaded && !experiences.length"
                     class="no_data text-center"  >
                     
                      <v-avatar
                          size="70"
                          color="secondary"
                          variant="tonal"
                          class="mb-6" >

                          <v-icon
                              icon="mdi-certificate"
                              size="34" >
                          </v-icon>
                      </v-avatar>
                    <!-- <h2 class="title"> &nbsp; </h2> -->

                    <p class="description"> Aucune expérience prefessionnelle enrégistrée  </p>

                    <p class="mt-8">
                       <v-btn 
                        @click="addExperience()"
                        variant="flat" color="secondary" > Ajouter une expérience </v-btn>
                    </p>
                  </div>
                  <!-- / no_data -->

                </div>

              </v-sheet>
            </v-tabs-window-item>
          </v-tabs-window>

      </v-sheet>

    </section>

    <!-- dialog experience -->
     <section>
           
        <v-dialog
          v-model="experience_dialog"
          max-width="920"
          persistent >
          <v-card rounded="0">

            <v-toolbar color="secondary">
                
                <v-toolbar-title v-if="current_experience.id">Modifier votre expérience</v-toolbar-title>
                <v-toolbar-title v-else >Ajouter une expérience</v-toolbar-title>

                <v-toolbar-items>
                  <v-btn
                    text="Fermer"
                    variant="text"
                    prepend-icon="mdi-close"
                    @click="experience_dialog = false"
                  ></v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text class="pa-2">

             <!--  <div class="text-center">
                <h2 class="ma"> Ajouter une expérience </h2> 
              </div> -->

              <ExperienceForm 
                :experience="current_experience"
                v-model="form_params"
                @saveExperience="saveExperience"
              />

            </v-card-text>
          </v-card>
        </v-dialog>

     </section>
     <!-- /dialog -->

    <!-- dialog formation -->
     <section>
           
        <v-dialog
          v-model="formation_dialog"
          max-width="920"
          persistent >
          <v-card rounded="0">

            <v-toolbar color="secondary">
                
                <v-toolbar-title v-if="current_formation.id">Modifier votre formation</v-toolbar-title>
                <v-toolbar-title v-else >Ajouter une formation</v-toolbar-title>

                <v-toolbar-items>
                  <v-btn
                    text="Fermer"
                    variant="text"
                    prepend-icon="mdi-close"
                    @click="formation_dialog = false"
                  ></v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text class="pa-2">
 
              <FormationForm 
                :experience="current_formation"
                v-model="form_params"
                @saveFormation="saveFormation"
              />

            </v-card-text>
          </v-card>
        </v-dialog>

     </section>
     <!-- /dialog -->

  </div>
 
</template>

<style scoped lang="scss">
  

  .coach_hero{
      box-shadow: 0 12px 35px rgba(0,0,0,.08);
      border: 1px #eee solid ;
      border-radius: 0px;
  }

  .tab_content{
     padding-top: 20px ;
  }

  .services_content{
   
    padding: 20px ;
    max-width: 1000px;
    margin: auto;
  }


  @media(max-width: 839px) {
    .services_content{
      padding: 0px ;
      
    }
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


  .tab_content{
    margin: auto;
    margin :10px   ;
    
  }

  .annonce{
    border : 1px #eee solid ;
    border-radius: 10px ;
    padding: 10px ;
  }

  .service_card{
    box-shadow: 0 12px 35px rgba(0,0,0,.08);
    border: 1px #ddd solid ;
    border-radius: 2px ;
    padding: 8px;

   }

</style>
