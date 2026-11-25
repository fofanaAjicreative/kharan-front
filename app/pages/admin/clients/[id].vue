
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
  const router = useRouter() ;
  const { $api } = useNuxtApp() ;

   import { useDisplay } from 'vuetify' ;
   const { mobile,name} = useDisplay() ;

   const loading = ref(false) ;
 
  

  const client = ref<any>(null) ;
  const  loaded = ref(false) ;
    
 
// ------------------- seo ------------------------------------- 

      const page_title = ref("Détails du client")
      useSeoMeta({ title: page_title })

// -------------------route param -------------------------------
      const route = useRoute()
      let id  = route.params.id as string ;
      if(!id){ navigateTo('/admin') ; }

   
  
 /* ---------------------------------------------------------------------------------- */

  function loadClient(){ 
               
      showLoading() ;
      $api(`/admin/client/${id}`,{
        method: 'GET',
      }).then((res :any) =>{


        client.value = res.data.user ;
        status_user.value = client.value.status ;
        

        console.log("CLIENT:",client.value);
       
  
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

 
/* ------------------------------- status ------------------------------------ */

  const status_users = ref<any>([]) ;
  const status_user = ref<any>() ;
 
  status_users.value = [
           { id : "active" , name : "Activé" },
           { id : "inactive" , name : "Désactivé" },
           { id : "banned" , name : "Bani" } 
        ] ;
  
/* ---------------------------------------------------------------------------------- */


   async function changeClientStatus(){

      loading.value = true ;

      const form_data = { 
        status : status_user.value ,
      }

     showLoading() ;
       
      $api(`admin/user/${client.value.id}/change_status`,{
          method: 'POST',
          body :form_data
        }).then((res :any) =>{

          client.value = res.data.user ;

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
 /* ------------------------------------ chat ----------------------------------------- */

    async function ContactClient(coach :any){
      const conversation = {
            conversation : null ,
            user : coach ,
            minimized : false ,
            unreadCount : 0 ,
        }
        openChatPanel(conversation,name.value) ;
        await nextTick() ;
    }

/* ---------------------------------------------------------------------------------- */
   
   onMounted( async () => {  

    loadClient() ;
    
   }); 
/* ------------------------------------------------------------------------------- */

</script>


<template>

   <v-container class="py-8 pt-4" max-width="1800" >

       <SkeletonDashboard v-if="!loaded"  />

        <template v-else>
          <v-row>
              <v-col cols="12" lg="7">
             
                <div class="card_shadow pa-4">
                    <div class="header d-flex flex-wrap ga-10">

                        <div class="coach_photo">
                            <v-avatar size="150" rounded="0" class="profile-avatar" >
                                <v-img 
                                    :src="client.photo? 
                                        client.photo.media_url: '/images/profile.png'"
                                /> 
                            </v-avatar>
                        </div>

                        <div class="coach_info">

                            <div class="coah_name">
                                <span class=" client_name mr-2">{{ client.firstname }} {{ client.lastname }} </span>

                                  <!-- status -->
                                
                                    <v-chip
                                      v-if="client.status == 'active'"
                                      size="small"
                                      variant="tonal"
                                      color="success"> Activé </v-chip>

                                    <v-chip
                                      v-else-if="client.status == 'inactive'"
                                      size="small"
                                      color="warning"
                                      variant="tonal"
                                      append-icon="mdi-close"
                                    > Désactivé </v-chip>

                                    <v-chip
                                      v-else-if="client.status == 'banned'"
                                      size="small"
                                      variant="tonal"
                                      append-icon="mdi-close-circle"
                                      color="error"
                                    > Bani </v-chip>
                                  
                            </div>
                          <div class="mt-1 mb-1"> 
                            <div class="d-flex align-center ga-2" >
                                <v-icon size="small" icon="mdi-cellphone">  </v-icon>
                                <span class="client_email"> {{ client.phone_number }} </span>
                            </div>


                            <div class="d-flex align-center ga-2" >
                                <v-icon size="small" icon="mdi-email-outline">  </v-icon>
                                <span class="client_email"> {{ client.email }} </span>
                            </div>
                          </div>

                            <v-btn
                              @click="ContactClient(client)"
                              variant="tonal"
                              color="info"
                              size="default"
                              prepend-icon="mdi-message-outline"
                              class="contact-btn mt-2"
                              block >
                              Contacter
                          </v-btn>

                              
                        </div>

                    </div>
                      
                </div>
              </v-col>
              <v-col cols="12" lg="5">
                    <div class="card_shadow pa-6">

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
                          @click="changeClientStatus()"
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
               
          
        </template>

   </v-container>

</template>
 

<style lang="scss" scoped>
  

  @media(max-width:500px){
    
    .coach_photo , .coach_info {
      margin: auto ;
    }

  }

  
  .client_name{
      font-size: 20px;
      font-weight: bold ;
      line-height: normal;
  }

  .client_email,
  .client_phone{

    font-size: 12px ;
    color: #424242 ;

  }


       
</style>