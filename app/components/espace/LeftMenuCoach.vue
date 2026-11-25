
<script setup lang="ts">

    
  const { user,logout } = useAuth();

    const { badgeCountMessage  , menuOpenedMessage } = useNotifications() ;

      const { dialog, has_annonce, annonce_completed, has_service, accept, cancel } = useAnnonceDialog()

     const { closeChatPanels } = useChat() ;

/* -------------------------------------------------------------------------------------- */
    
     function openMessagerie(){
            menuOpenedMessage() ;
            navigateTo('/messagerie')
     }
  
 
/* --------------------------------------------------------------------------------- */
      
           function deconnexion(){

               closeChatPanels() ;
               logout() ;
                 
           }
           
/* --------------------------------------------------------------------------------- */
  function closeEspaceMenu(){
      
   }

</script>

<template>

  <div class="side_content" v-if="user">

      <v-list-item lines="two"  >

            <template v-slot:prepend>
                  <v-avatar size="60" >
                        <v-img
                            :src="user.photo?user.photo:'/images/profile.png'"
                        />
                  </v-avatar>
            </template>

            <v-list-item-title class="user_name"> {{`${user.firstName} ${user.lastName}`}} </v-list-item-title>
            <v-list-item-subtitle class="user_email"> {{ user.email }} </v-list-item-subtitle>
            <v-list-item-subtitle class="user_email"> 
                 <b> Fuseau : </b> {{ user.timeZone }} 
            </v-list-item-subtitle>



            <template v-slot:append>
                  <RouterLink to="/espace-coach/profile">
                        <v-btn   
                              variant="flat" 
                              icon="mdi-square-edit-outline"
                              color="#FFF">
                              
                        </v-btn>
                  </RouterLink>
            </template>
 
      </v-list-item>

      <v-divider></v-divider>
          
      <v-list 
            density="comfortable">

            <v-list-item 
                  prepend-icon="mdi-view-dashboard" 
                  value="compte"
                  to="/espace-coach"
                  title="Dashboard">
            </v-list-item>

            <v-list-item 
                  prepend-icon="mdi-bullhorn-variant-outline" 
                  value="/espace-coach/annonce"
                  to="/espace-coach/annonce"
                  title="Mon annonce">
            </v-list-item>

            <v-list-item v-if="annonce_completed"
                  prepend-icon="mdi-server-outline" 
                  append-icon="mdi-chevron-rightt" 
                  value="/espace-coach/annonce?tab=services"
                  to="/espace-coach/annonce?tab=services"
                  title="Mes services">
            </v-list-item>


            <v-list-item  v-if="annonce_completed && has_service"
                  value="reservations"
                  to="/espace-coach/reservations/today"
                  title="Reservations du jour ">
                  <template v-slot:prepend >
                     <v-icon  color="success" icon="mdi-calendar-clock"></v-icon>
                  </template>
            </v-list-item>

            <v-list-item v-if="annonce_completed && has_service"
                  value="reservations"
                  to="/espace-coach/reservations"
                  title="Reservations liste">
                  <template v-slot:prepend >
                     <v-icon  color="info" icon="mdi-list-box-outline"></v-icon>
                  </template>
            </v-list-item>

            <v-list-item v-if="annonce_completed && has_service"
                  value="reservations"
                  to="/espace-coach/reservations/calendar"
                  title="Calendrier">
                  <template v-slot:prepend >
                     <v-icon  color="secondary" 
                     icon="mdi-calendar-month-outline"></v-icon>
                  </template>
            </v-list-item>

             
            <!-- Revenus -->
            <v-list-group
                  v-if="annonce_completed"
                  value="categories">
                  <template v-slot:activator="{ props }">
                        <v-list-item
                              v-bind="props"
                              value="Revenus"
                              title="Revenus"
                              prepend-icon="mdi-credit-card-outline"
                              >
                               
                              <template v-slot:prepend >
                                    <v-icon  color="success" icon="mdi-credit-card-outline"></v-icon>
                              </template>

                        </v-list-item>
                  </template>

                  <v-list-item 
                        to="/espace-coach/revenus"
                        value="Dashboard"
                        title="Dashboard">
                        <template v-slot:prepend >
                        <v-icon   
                        icon="mdi-view-dashboard-outline"></v-icon>
                        </template>
                  </v-list-item>

                  <v-list-item 
                        to="/espace-coach/revenus/versements"
                        value="Versements"
                        title="Versements">
                        <template v-slot:prepend >
                        <v-icon   
                        icon="mdi-invoice-list-outline"></v-icon>
                        </template>
                  </v-list-item>

                  <v-list-item 
                        to="/espace-coach/revenus/stripe"
                        value="Compte de versement"
                        title="Compte de versement">
                        <template v-slot:prepend >
                        <v-icon   color="secondary"
                         icon="mdi-account-credit-card-outline"></v-icon>
                        </template>
                  </v-list-item>

           </v-list-group>

           <!-- /Revenus -->


            <v-list-item v-if="annonce_completed"
                  prepend-icon="mdi-timetable" 
                  append-icon="mdi-chevron-rightt" 
                  value="timetable"
                  to="/espace-coach/annonce/disponibilite"
                  title="Ma disponibilité">
            </v-list-item>

            <v-list-item v-if="annonce_completed"
                  prepend-icon="mdi-school-outline" 
                  append-icon="mdi-chevron-rightt" 
                  value="experiences"
                  to="/espace-coach/experiences"
                  title="Diplomes/expériences">
            </v-list-item>

            <v-list-item v-if="annonce_completed && has_service"
                  value="card"
                  @click="openMessagerie()"
                  title="Messagerie">
                  <template v-slot:prepend >
                      
                        <v-badge
                        :content="badgeCountMessage"
                        :model-value="badgeCountMessage>0"
                        color="secondary" >
                        <v-icon 
                              icon="mdi-message-outline" 
                              size="default"
                              color="info"
                              class="mr-0"> </v-icon>
                    </v-badge>

                  </template>

            </v-list-item>

            <v-list-item 
                  prepend-icon="mdi-login-variant" 
                  value="card"
                  @click="deconnexion()"
                  title="Déconnexion">

                  <template v-slot:prepend >
                     <v-icon  color="error" icon="mdi-login-variant"></v-icon>
                  </template>

            </v-list-item>

      </v-list>
      
  </div>
  <div v-else>
      <v-skeleton-loader v-for="value in [1,2]"  type="image, article" />
  </div>

</template>

<style scoped lang="scss">

      .user_name{
            font-weight: bold;
            font-size: 16px;
            text-transform: capitalize;
      }
      .user_email{
            font-size: 12px;

      }
</style>