<script setup lang="ts" >

  const { $api } = useNuxtApp() ;
  const { dialog, has_annonce, annonce_completed, has_service, accept, cancel } = useAnnonceDialog()  ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;

  const { showLoading, hideLoading } = useGlobalLoading() ;
  useSeoMeta({ title: 'Mes disponibilitéq' }) ;

 
  const  loaded = ref(false) ;
  const  show_snackbar = ref(true) ;


  const  loading = ref(false) ;
  const  server_error = ref(false) ;
  const  server_error_message = ref("") ;
 

/* ------------------------------------------------------------------------------ */

    function resetError() {
      server_error.value = false ;
      server_error_message.value = '' ;
      loading.value = false ;
    }
 
/* ------------------------ availabilities ------------------------------------------ */
 
    const has_google_calendar = ref<boolean>(false) ;
    const google_calendar_email = ref<string>("") ;


    const availabilities = ref<any>([
            {
              day: 1,
              opened: true,
              periods: [
                {
                  openTime: "09:00",
                  closeTime: "18:00"
                } 
              ]
            },
            {
              day: 2,
              opened: true,
              periods: [
                {
                  openTime: "09:00",
                  closeTime: "18:00"
                }
              ]
            },
            {
              day: 3,
              opened: true,
              periods: [
                {
                  openTime: "09:00",
                  closeTime: "18:00"
                } 
              ]
            },
            {
              day: 4,
              opened: false,
              periods: []
            },
            {
              day: 5,
              opened: false,
              periods: []
            },
            {
              day: 6,
              opened: false,
              periods: []
            },
            {
              day: 7,
              opened: false,
              periods: []
            },
            
    ]) ;

/* ------------------------------------------------------------------------------- */

  function setAvailabilities(){ 

      const post_data  = {
        days : availabilities.value 
      }

      
      showLoading() ;

      $api('/annonces/create_step5_set_opening_times',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
      // availabilities.value = res.data.opening_times ;

      showSuccessSnackbar({
        title: 'Disponibilités mises à jour',
        message: 'Vos disponibilités ont été mises à jour avec succès.'
      }) ;
      
      hideLoading() ;
      resetError() ;


      }).catch(error=>{

        loading.value = false ;
        server_error.value = true ;
        server_error_message.value = error.message ;

        if(error.statusCode==400){
          server_error_message.value = 'Données incomplètes ou incorrectes.'
        }
        
        console.log("Error:",error); 
        hideLoading() ;
         
      }) ;
               
  }



/* ------------------------------------------------------------------------------- */

  function connectGoogleCalendar(){ 

       showLoading() ;

      $api('google_calendar/connect',{
        method: 'POST',
      }).then((res :any) =>{

        window.location.href = res.data.url ;
        hideLoading() ;
 
      }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      })   
  }

/* ------------------------------------------------------------------------------------- */

  function disconnectGoogleCalendar(){ 

       showLoading() ;

      $api('google_calendar/disconnect',{
        method: 'POST',
      }).then((res :any) =>{

        has_google_calendar.value = false 
        google_calendar_email.value = "" ;
         
 
      }).catch(error=>{
          
        showErrorSnackbar({
              title: 'Erreur',
              message: error.message
            }) ;
       
      }).finally(()=>{
         
        hideLoading() ;
      })   
  }



  
/* --------------------------- get data ------------------------------------------------------- */


  function loadAvailabilities(){ 
               
      showLoading() ;

      $api('/annonces/get_opening_times',{
        method: 'GET',
      }).then((res :any) =>{

        console.log("AVAILABILITIES:",res.data.opening_times );
        
        
         // availabilities
        if(res.data.opening_times && res.data.opening_times.length){
          availabilities.value =  res.data.opening_times ;
          has_google_calendar.value =  res.data.has_google_calendar ;
          google_calendar_email.value =  res.data.google_calendar_email ;
        }

      
        loaded.value = true ;
        hideLoading() ;
 
    
      }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      })
               
  }



  /* --------------------------------------------------------------------------------- */

    onMounted(() => {

        resetError() ;
        if(has_annonce.value){
          loadAvailabilities() ;
        }else{
          return navigateTo("/espace-coach/annonce") ;
        } 

    });

  /* --------------------------------------------------------------------------------- */

   
</script>

 <template>
  
  <div class="main_content">

    <SkeletonDashboard v-if="!loaded"  />
    <v-row v-else>
       <v-col cols="12" lg="6">

          <div class="form_content">

            <p class="page_title text-center" > Mes disponibilités </p>
            <v-divider class="mb-6 mt-2"></v-divider>

            <Availabilities v-model="availabilities"  />

            <div class="mt-6" v-if="server_error">
              <v-alert class="mt" color="warning" density="compact" variant="tonal"
                icon="mdi-alert-circle-outline" >
                <template #prepend>
                  <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                </template>
                <b>{{ server_error_message}} </b><br>
                <ul>
                  <li> Assurez-vous que les heures d'ouvertues sont toujours inférieures aux heures de fermeture (Ex: 09:00 < 14:30)</li>
                  <li> Veriez que les heures ne se superposent ou ne chevauchent pas</li>
                </ul>
              </v-alert>
            </div>


            <v-btn 
                @click="setAvailabilities()"
                class="mt-4"
                color="secondary" variant="flat"
                block
                size="large"
                spaced="both">
                Enrégistrer
            </v-btn>
            
          </div>

       </v-col>
       <v-col cols="12" lg="6">

            <div class="form_content" v-if="loaded">

              <p class="page_title text-center" > Connecter mon agenda </p>
               <v-divider class="mb-6 mt-2"></v-divider>

               <!-- to connect -->
              <v-alert v-if="!has_google_calendar"
                variant="tonal"
                color="info"
                rounded="md"
                icon="mdi-information-slab-circle"  >

                    <div class="d-flex align-start justify-space-between flex-wrap ga-4">
                         <div>


                            <div class="text-h6 font-weight-bold mb-1">
                                Synchronisez votre agenda Google
                            </div>

                            <div class="text-body-2 text-medium-emphasis mb-4">
                                Connectez votre agenda <strong>Google Calendar</strong> 
                                pour garder vos disponibilités toujours à jour. 
                                Les créneaux déjà occupés dans votre agenda seront automatiquement
                                pris en compte lors des prises de rendez-vous.
                            </div>



                           </div>
                     </div>

                  <v-card-text class="pa-0 d-flex justify-start">
                    <div class="d-flex justify-space-between align-center">  
                        <div class="d-none">
                              <v-avatar
                                
                                size="44"
                                rounded="0"
                                image="/images/google-calendar.png" >
                              </v-avatar>

                              <span class="agenda_name">   </span>
                        </div>
                        <div>
                              <v-btn 
                                @click="connectGoogleCalendar()"
                                prepend-icon="mdi-google"
                                color="info"
                                variant="flat"
                                size="large"
                                >
                                Connecter Google Calendar
                            </v-btn>
                        </div>

                    </div>  
                </v-card-text>

              </v-alert>
              <!-- connected -->
              <v-alert v-else
                      variant="tonal"
                      color="success"
                      rounded="md"
                      icon="mdi-check-circle"
                      class="mb-4">

                <div class="d-flex align-start justify-space-between flex-wrap ga-4">
                    <div>
                        <div class="text-h6 font-weight-bold mb-1">
                            Agenda Google connecté
                        </div>

                        <div class="text-body-2 text-medium-emphasis mb-4">
                            Votre <strong>Google Calendar</strong> est synchronisé. 
                            Les rendez-vous et événements de votre agenda sont automatiquement pris en compte 
                            pour bloquer vos créneaux et éviter les doubles réservations avec vos clients.
                        </div>
                    </div>
                </div>

                <v-card-text class="pa-0">
                    <div class="d-flex justify-space-between align-center flex-wrap ga-3">
                        <!-- Optionnel : Afficher l'email ou le compte connecté si vous l'avez dans vos data -->
                        <div class="d-flex align-center ga-2 text-body-2 text-medium-emphasis">
                            <v-icon icon="mdi-google" size="small"></v-icon>
                            <span>Synchronisation avec <b> {{google_calendar_email}} </b></span>
                        </div>

                        <div>
                            <v-btn 
                              @click="disconnectGoogleCalendar()"
                              color="error"
                              variant="outlined"
                              size="default"
                              prepend-icon="mdi-link-off">
                              Déconnecter l'agenda
                            </v-btn>

                             
                        </div>
                    </div>  
                </v-card-text>
            </v-alert>
            <!-- /connected -->

          </div>

       </v-col>
    </v-row>

  
  </div>
 
</template>

<style scoped lang="scss">
  

  .main_content{
    padding: 4px;
    margin-bottom: 20px;
  }


  
  .form_content{
    max-width: 500px;
    margin: auto;
  }

  .page_title{
      font-size: 22px ;
      font-weight: bold ;
      margin: 10px 0px 10px 0px ;
  }

  @media (max-width: 839px){
    .page_title{
      font-size: 18px ;
      margin: 10px 0px 8px 0px ;
   }

   .coach_hero{
     border: none ;
   }

  }
 
  .agenda_name{
    font-size: 16px ;
    font-weight: bold ;
    margin-left: 10px;

  }

  .agenda{
     box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.04),
    0 8px 24px rgba(15, 23, 42, 0.06);
   }

 
</style>
