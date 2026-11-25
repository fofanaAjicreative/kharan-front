
<script setup lang="ts" >
  
  import CoachHeroAdmin from  '~/components/espace/CoachHeroAdmin.vue' ;
  
  const { showLoading, hideLoading } = useGlobalLoading() ;
  const {  showSuccessSnackbar, showErrorSnackbar , showWarningSnackbar } = useSnackbar() ;
  const { confirm , reason } = useCancelReservation() ;

  import { formatMonthYear,formatDuration } from '~/utils/date'
  const { download } = useDownload()

   const { user } = useAuth() ;
   const { openChatPanel } = useChat() ;
   const { truncate } = useText() ;
   const { isOnline } = usePresence() ;

  const { formatReservationDuration,formatDateTime } = useDate()

  const { $api } = useNuxtApp() ;

   import { useDisplay } from 'vuetify' ;
   const { mobile,name} = useDisplay() ;

   const loading = ref(false) ;
 
   const router = useRouter() ;

   const annonce = ref<any>(null) ;
   const availabilities = ref<any>([]) ;
   const services = ref<any>([]) ;

  const formations = ref<any>([]) ;
  const experiences = ref<any>([]) ;

  const tab = ref('annonce') ;
  const  loaded = ref(false) ;
    
 
// ------------------- seo ------------------------------------- 

      const page_title = ref("Détails de l'annonce")
      useSeoMeta({ title: page_title })

// -------------------route param -------------------------------
      const route = useRoute()
      let id  = route.params.id as string ;
      if(!id){ navigateTo('/admin') ; }

/* --------------------------------------------------------------------------- */
 
  const toggleServiceDescription  =  (service :any) => {
      service.expanded = !service.expanded ;
  }

 /*------------------------------------------------------------------------------------------ */

 const experienceContract  =  (type :string) => {
      if(type=='plein'){ return  "Temps plein" ; }
      else if(type=='partiel'){ return  "Temps partiel" ; }
      else if(type=='independant'){ return  "Indépendant" ; }
      else if(type=='freelance'){ return  "Freelance" ; }
      else if(type=='contract'){ return  "Contrat" ; }
 } 


  const toggleFormationDescription  =  (formation :any) => {
      formation.expanded = !formation.expanded ;
  }

/* ---------------------------------------------------------------------------- */


  async function downloadExperienceDocument(experience: any) {

      nextTick(() => {
        if(experience.file && experience.file.media_url){
          download(experience.file.media_url) ;
        }
      })
  }
  
 /* ---------------------------------------------------------------------------------- */

  function loadAnnonce(){ 
               
      showLoading() ;
      $api(`/admin/annonce/${id}`,{
        method: 'GET',
      }).then((res :any) =>{


        annonce.value = res.data.annonce ;

        // availabilities
        if(annonce.value.opening_times && annonce.value.opening_times.length){
          availabilities.value =  annonce.value.opening_times ;
        }

        //services
        if(annonce.value.services && annonce.value.services.length){
         services.value =  annonce.value.services ;
        }

        // status
        status_annonce.value = annonce.value.status ;
        status_certification.value = annonce.value.certification_status ;
        status_user.value = annonce.value.user.status ;
        

        console.log("ANNONCE:",annonce.value);
       
  
      }).catch(error=>{

         console.log("Error:",error); 
        
         showErrorSnackbar({
            title: 'Erreur',
            message: error.message
         }) ;
         
      }).finally(()=>{

        loading.value = false ;
        hideLoading() ;
        loaded.value = true ;
         
      })      
  }

/* ---------------------------------------------------------------------------------- */


  function loadExperiences(){ 
    
      $api(`annonces/${id}/experiences`,{
        method: 'GET',
      }).then((res :any) =>{
        
      experiences.value =  res.data.experiences ;
      formations.value =  res.data.formations ;
      
      }).catch(error=>{
        console.log("Error:",error); 
         
      })
               
  }
/* ------------------------------- status ------------------------------------ */

  const status_users = ref<any>([]) ;
  const status_user = ref<any>() ;

  const status_annonces = ref<any>([]) ;
  const status_annonce = ref<any>("") ;

  const status_certifications = ref<any>([]) ;
  const status_certification = ref<any>("") ;

  status_users.value = [
           { id : "active" , name : "Activé" },
           { id : "inactive" , name : "Désactivé" },
           { id : "banned" , name : "Bani" } 
        ] ;

  status_annonces.value = [
    { id: "approved", name: "Approuvée" },
    { id: "waiting", name: "En attente" },
    { id: "rejected", name: "Rejetée" },
    { id: "suspended", name: "Suspendue" }
  ]; 
  

  status_certifications.value = [
    { id: "approved", name: "Approuvée" },
    { id: "waiting", name: "En attente" },
    { id: "rejected", name: "Rejetée" },
    { id: "suspended", name: "Suspendue" }
  ]; 

/* ------------------------------------------------------------------------ */

async function changeAnnonceStatus(){

      loading.value = true ;
      const form_data = { 
          status : status_annonce.value ,
      }

    showLoading() ;
       
      $api(`admin/annonce/${id}/change_status`,{
          method: 'POST',
          body :form_data
        }).then((res :any) =>{

          annonce.value = res.data.annonce ;

          showSuccessSnackbar({
              title: 'Succès',
              message: "Le statut est mis à jour."
          }) ;

      }).catch((error:any)=>{
          console.log("Error:",error); 
          
          let server_error_message  = error.message ;
          if(error.statusCode == 400){
            server_error_message = 'Données incomplètes ou incorrectes.'
          }

          showErrorSnackbar({
              title: 'Erreur',
              message: server_error_message
          }) ;
 
      }).finally(()=>{
          hideLoading() ;
          loading.value = false ;
      }) ; 

 }


      
/* ------------------------------------------------------------------------ */

async function changeCertificationStatus(){

      loading.value = true ;
      const form_data = { 
          status : status_certification.value ,
      }

    showLoading() ;
       
      $api(`admin/annonce/${id}/certification_status`,{
          method: 'POST',
          body :form_data
        }).then((res :any) =>{

          annonce.value = res.data.annonce ;

          showSuccessSnackbar({
              title: 'Succès',
              message: "Le statut est mis à jour."
          }) ;

      }).catch((error:any)=>{
          console.log("Error:",error); 
          
          let server_error_message  = error.message ;
          if(error.statusCode == 400){
            server_error_message = 'Données incomplètes ou incorrectes.'
          }

          showErrorSnackbar({
              title: 'Erreur',
              message: server_error_message
          }) ;
 
      }).finally(()=>{
          hideLoading() ;
          loading.value = false ;
      }) ; 

 }
     
/* ------------------------------------------------------------------------ */

async function changeSuperStatus(){

      loading.value = true ;
      const form_data = { 
        is_super : annonce.value.is_super
      }

      console.log(form_data);
      

    showLoading() ;
       
      $api(`admin/annonce/${id}/super_status`,{
          method: 'POST',
          body :form_data
        }).then((res :any) =>{

          annonce.value = res.data.annonce ;

          showSuccessSnackbar({
              title: 'Succès',
              message: "Le statut est mis à jour."
          }) ;

      }).catch((error:any)=>{
          console.log("Error:",error); 
          
          let server_error_message  = error.message ;
          if(error.statusCode == 400){
            server_error_message = 'Données incomplètes ou incorrectes.'
          }

          showErrorSnackbar({
              title: 'Erreur',
              message: server_error_message
          }) ;
 
      }).finally(()=>{
          hideLoading() ;
          loading.value = false ;
      }) ; 

 }
/* ---------------------------------------------------------------------------------- */


   async function changeCoachStatus(){

      loading.value = true ;

      const form_data = { 
        status : status_user.value ,
      }

     showLoading() ;
       
      $api(`admin/user/${annonce.value.user.id}/change_status`,{
          method: 'POST',
          body :form_data
        }).then((res :any) =>{

          annonce.value.user = res.data.user ;

          showSuccessSnackbar({
              title: 'Succès',
              message: "Le statut est mis à jour."
          }) ;


      }).catch((error:any)=>{
          console.log("Error:",error); 
          
          let server_error_message  = error.message ;
          if(error.statusCode == 400){
            server_error_message = 'Données incomplètes ou incorrectes.'
          }

          showErrorSnackbar({
              title: 'Erreur',
              message: server_error_message
          }) ;
 
      }).finally(()=>{
          hideLoading() ;
          loading.value = false ;
      }) ; 


}

/* ---------------------------------------------------------------------------------- */
   
   onMounted( async () => {  

    loadAnnonce() ;
    loadExperiences()

   }); 
/* ------------------------------------------------------------------------------- */

</script>


<template>

   <v-container class="py-8 pt-4" max-width="1800" >

       <SkeletonDashboard v-if="!loaded"  />

        <template v-else>


         <v-sheet elevation="0">

            <v-tabs 
                v-model="tab" 
                color="secondary"
                bg-color="#F4F4F4"
                grow show-arrows
                >
               <v-tab value="annonce" > Annonce </v-tab>
               <v-tab value="status" > Statuts </v-tab>
               <v-tab value="services" > Services </v-tab>
               <v-tab value="availabilities" > Disponibilité  </v-tab>
               <v-tab value="formations" > Expériences  </v-tab>
            </v-tabs>

            <v-divider></v-divider>

            <v-tabs-window v-model="tab">

            <!-- ---------------------------------  annonce  ------------------------- -->
              <v-tabs-window-item value="annonce">
               <v-sheet class="pa-0"  >
                  <div class="tab_content" >
                     
                    <CoachHeroAdmin :annonce="annonce"> </CoachHeroAdmin>
                  
                  </div>
               </v-sheet>
               </v-tabs-window-item>
            <!-- ---------------------------------  status  ------------------------- -->
              <v-tabs-window-item value="status">
               <v-sheet class="pa-0"  >
                  <div class="tab_content pa-2 mt-4" >
                     
                    <v-row>

                      <!-- Annonce -->
                      <v-col cols="12" lg="6">

                        <div class="card_shadow pa-4 ma" >

                          <h4 class="mt-1 mb-1 bloc_title2"> L'annonce</h4>
                          <v-divider class="mb-6 mt-1" />

                          <div class="mb-6">
                            <v-chip
                                v-if="annonce.status == 'approved'"
                                size="default"
                                rounded="8"
                                color="success" 
                                variant="tonal" 
                                
                                > 
                                Approuvée {{ formatDateTime(annonce.validation_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.status == 'waiting'"
                                size="default"
                                rounded="8"
                                color="warning" > En attente {{ formatDateTime(annonce.validation_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.status == 'rejected'"
                                size="default"
                                rounded="8"
                                color="error" > Rejetée {{ formatDateTime(annonce.validation_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.status == 'suspended'"
                                size="default"
                                rounded="8"
                                color="error" > Suspendue {{ formatDateTime(annonce.validation_date) }} </v-chip>
                         
                          </div>
                             
                          <v-select 
                            v-model="status_annonce"
                            :items="status_annonces"
                            item-title="name"
                            item-value="id"
                            label="Statut"
                            variant="outlined"
                            density="compact"
                            clearable
                            hide-details
                          />

                          <v-btn  class="mt-4"
                            @click="changeAnnonceStatus()"
                             :loading="loading"
                              type="submit" 
                              variant="flat" 
                              color="secondary" 
                              block >
                              Enrégistrer
                          </v-btn>

                        </div>

                      </v-col>

                      <!-- coach -->
                      <v-col cols="12" lg="6">

                        <div class="card_shadow pa-4 ma" >
                          
                          <h4 class="mt-1 mb-1 bloc_title2"> COACH </h4>
                          <v-divider class="mb-6 mt-1" />

                          <div class="mb-6">
                             <v-chip
                                v-if="annonce.user.status == 'active'"
                                size="default"
                                rounded="8"
                                variant="tonal"
                                color="success"> Activé {{ formatDateTime(annonce.user.status_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.user.status == 'inactive'"
                                size="default"
                                rounded="8"
                                color="warning"
                                variant="tonal"
                                append-icon="mdi-close"
                              > Désactivé {{ formatDateTime(annonce.user.status_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.user.status == 'banned'"
                                size="default"
                                rounded="8"
                                variant="tonal"
                                append-icon="mdi-close-circle"
                                color="error"
                              > Bani {{ formatDateTime(annonce.user.status_date) }} </v-chip>
                         
                          </div>
                             
                          <v-select 
                            v-model="status_user"
                            :items="status_users"
                            item-title="name"
                            item-value="id"
                            label="Statut"
                            variant="outlined"
                            density="compact"
                            clearable
                            hide-details
                          />

                          <v-btn  class="mt-4"
                            @click="changeCoachStatus()"
                             :loading="loading"
                              type="submit" 
                              variant="flat" 
                              color="secondary" 
                              block >
                              Enrégistrer
                          </v-btn>

                        </div>

                      </v-col>

                      <!-- Certification -->
                      <v-col cols="12" lg="6">

                        <div class="card_shadow pa-4 ma" >

                          <h4 class="mt-1 mb-1 bloc_title2"> Certification </h4>
                          <v-divider class="mb-6 mt-1" />

                          <div class="mb-6">
                            <v-chip
                                v-if="annonce.certification_status == 'approved'"
                                size="default"
                                rounded="8"
                                color="success" 
                                variant="tonal" 
                                
                                > 
                                Approuvée {{ formatDateTime(annonce.certification_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.certification_status == 'waiting'"
                                size="default"
                                rounded="8"
                                color="warning" > En attente {{ formatDateTime(annonce.certification_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.certification_status == 'rejected'"
                                size="default"
                                rounded="8"
                                color="error" > Rejetée {{ formatDateTime(annonce.certification_date) }} </v-chip>

                              <v-chip
                                v-else-if="annonce.certification_status == 'suspended'"
                                size="default"
                                rounded="8"
                                color="error" > Suspendue {{ formatDateTime(annonce.certification_date) }} </v-chip>
                         
                          </div>
                             
                          <v-select 
                            v-model="status_certification"
                            :items="status_certifications"
                            item-title="name"
                            item-value="id"
                            label="Statut"
                            variant="outlined"
                            density="compact"
                            clearable
                            hide-details
                          />

                          <v-btn  class="mt-4"
                            @click="changeCertificationStatus()"
                             :loading="loading"
                              type="submit" 
                              variant="flat" 
                              color="secondary" 
                              block >
                              Enrégistrer
                          </v-btn>

                        </div>

                      </v-col>

                      <!-- super coach -->

                      <v-col cols="12" lg="6">

                        <div class="card_shadow pa-4 ma" >

                          <h4 class="mt-1 mb-1 bloc_title2"> SUPER COACH </h4>
                          <v-divider class="mb-6 mt-1" />

                          <div class="mb-6">
                             
                          </div>
                             
                            <v-switch 
                                 v-model="annonce.is_super"
                                 label="Super coach"
                                 color="info"
                                 inset="square"
                                 true-icon="mdi-medal"
                                 false-icon="mdi-medal" 
                                 size="small"
                                 hide-details
                                 >
                            </v-switch>


                          <v-btn  class="mt-4"
                            @click="changeSuperStatus()"
                             :loading="loading"
                              type="submit" 
                              variant="flat" 
                              color="secondary" 
                              block >
                              Enrégistrer
                          </v-btn>

                        </div>

                      </v-col>




                    </v-row>
                     
                  
                  </div>
               </v-sheet>
               </v-tabs-window-item>
            <!-- ---------------------------------  services  ------------------------- -->
               <v-tabs-window-item value="services">
               <v-sheet class="pa-0"  >
                  <div class="tab_content" >
                     
                    <div class="services_content">
                     
                    <!-- header -->
                    <div v-if="loaded && services.length" class="d-flex justify-space-between ">
                      <span class="text-secondary"> 
                        {{ services.length }} service(s)
                      </span>
                      
                    </div>
                    
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

                                 <v-chip
                                    v-if="service.enabled"
                                    size="small"
                                    color="success"> Activé </v-chip>

                                 <v-chip
                                    v-else
                                    size="small"
                                    color="warning"
                                    append-icon="mdi-close"> Désactivé </v-chip>
                               
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
                                @click="toggleServiceDescription(service)" >
                                {{ service.expanded ? 'Voir moins' : 'Voir plus' }}
                            </v-btn>

                          </div>

                          <div class="d-flex flex-wrap justify-space-between align-center">
                               
                              <!-- format -->
                              <ServiceFormat :service="service" />

                              <div class="mt-4">  
                                <span class="service_price"> {{ service.price }} &euro; </span> 
                              </div>  

                          </div>
                                                          
                          </v-card-text>
                          <!-- /description -->
 
                        </v-card>

                      </v-col>
                    </v-row>

                  </div>


                  <!-- no_data -->
                  <div v-if="loaded && !services.length"
                     class="no_data text-center"  >
                    <v-btn color="#eee" variant="flat" icon="mdi-server-outline" size="x-large"></v-btn>
                    <h2 class="title">Pas encore de prestation </h2>

                  </div>
                  <!-- / no_data -->
     
                  </div>
               </v-sheet>
               </v-tabs-window-item>

            <!-- ---------------------------------  disponibilite  ------------------------- -->
            <v-tabs-window-item value="availabilities">
               <v-sheet class="pa-0"  >
                  <div class="tab_content" >
                     <Availabilities v-model="availabilities"  />
                  </div>
               </v-sheet>
            </v-tabs-window-item>

            <!-- ---------------------------------  formations  ------------------------- -->
            <v-tabs-window-item value="formations">
               <v-sheet class="pa-0"  >
                  <div class="tab_content" >
                    <div class="mt-6">                   
                    <v-row>
                      <!-- formations -->
                      <v-col cols="12" lg="6">

                        <h2 class="bloc_title"> Formations </h2>

                          <v-card v-for="formation in formations" :key="formation.id"
                            class="service_card mt-4"   >

                             
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
                                    @click="toggleFormationDescription(formation)" >
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

                            </v-card>
                        
                      </v-col>
                      <!-- expériences -->
                      <v-col cols="12" lg="6">

                          <h2 class="bloc_title"> Expériences </h2>
                          <v-card v-for="experience in experiences" :key="experience.id"
                            class="service_card mt-4">

                              <!-- title -->
                              <div class="service_header d-flex flex-wrap justify-space-between align-center">
                                      
                                  <div>
                                      <div class="service_title"> {{ experience.title }} </div>
                                      
                                      <!-- etablissement -->
                                      <div class="service_etablissement"> 
                                        <span> 
                                          <v-icon icon="mdi-bank" size="small" > </v-icon>
                                            {{ experience.etablissement }} 
                                          </span>  • 
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
                                    @click="toggleFormationDescription(experience)" >
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

                          </v-card>
                      </v-col>
                    </v-row>
                    </div>
                  </div>
               </v-sheet>
            </v-tabs-window-item>

          </v-tabs-window>

         </v-sheet>
          
        </template>

   </v-container>

</template>
 

<style lang="scss" scoped>
 
   .service_card{
    box-shadow: 0 12px 35px rgba(0,0,0,.08);
    border: 1px #eee solid ;
    border-radius: 6px ;
  }

  .services_content{
    padding: 10px ;
    margin: auto;
    margin-top: 20px;
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
    font-size: 18px ;
    font-weight: bold ;
    color: $secondary-color;
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

  /* formations */

   .bloc_title{
    color: $secondary-color;
    font-size: 16px;
    text-transform: uppercase;
   }


   .bloc_title2{
    color: #424242 ;
    font-size: 14px;
    text-transform: uppercase;
    color: $secondary-color;
   }

  .service_etablissement,.service_city{
     font-size: 14px ;
  }

  .service_city{
    color: #424242 ;
   

  }

       
</style>