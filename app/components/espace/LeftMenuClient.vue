
<script setup lang="ts">

     const { user,logout } = useAuth();
     const { closeChatPanels } = useChat() ;

 
      const { badgeCountMessage  , menuOpenedMessage } = useNotifications() ;

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
                  <RouterLink to="/espace-client/profile">
                        <v-btn   
                              variant="flat" 
                              icon="mdi-square-edit-outline"
                              color="#FFF">
                              
                        </v-btn>
                  </RouterLink>
            </template>
 
      </v-list-item>

      <v-divider></v-divider>
          
      <v-list density="comfortable">

            <v-list-item 
                  prepend-icon="mdi-view-dashboard" 
                  value="compte"
                  to="/espace-client"
                  title="Dashboard">
            </v-list-item>

            
            <v-list-item 
                  prepend-icon="mdi-calendar" 
                  append-icon="mdi-chevron-rightt" 
                  value="reservations"
                  to="/espace-client/reservations"
                  title="Mes reservations">
            </v-list-item>

            <v-list-item 
                  value="reservations"
                  to="/espace-client/reservations/calendar"
                  title="Calendrier">
                  <template v-slot:prepend >
                     <v-icon  
                    
                     icon="mdi-calendar-month-outline"></v-icon>
                  </template>
            </v-list-item>

            <v-list-item 
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
                              color="info"
                              size="default"
                              class="mr-0"> </v-icon>
                    </v-badge>

                  </template>
            </v-list-item>

                  
            <v-list-item 
                  elevation="10"
                  color="secondary"
                  prepend-icon="mdi-login-variant" 
                  value="card"
                  @click="deconnexion()"
                  title="Déconnexion">

                  <template v-slot:prepend >
                     <v-icon  
                      color="secondary"
                      icon="mdi-login-variant"></v-icon>
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
            font-size: 15px;
      }
      .user_email{
            font-size: 12px;

      }
</style>