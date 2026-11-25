
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
                  <RouterLink to="/admin/profile">
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
                  to="/admin"
                  title="Dashboard">
            </v-list-item>
             
            <v-list-item 
                  value="/admin/annonces"
                  to="/admin/annonces"
                  title="Annonces">
                  <template v-slot:prepend >
                     <v-icon  
                     icon="mdi-card-account-details-outline"></v-icon>
                  </template>
            </v-list-item>
            
            <v-list-item 
                  value="/admin/clients"
                  to="/admin/clients"
                  title="Clients">
                  <template v-slot:prepend >
                     <v-icon  
                     icon="mdi-account-multiple-outline"></v-icon>
                  </template>
            </v-list-item>
             
            <v-list-item 
                  prepend-icon="mdi-calendar" 
                  append-icon="mdi-chevron-rightt" 
                  value="reservations"
                  to="/admin/reservations"
                  title="Reservations">
            </v-list-item>

            <v-list-item 
                  value="reservations"
                  to="/admin/reservations/calendar"
                  title="Calendrier">
                  <template v-slot:prepend >
                     <v-icon   
                     icon="mdi-calendar-month-outline"></v-icon>
                  </template>
            </v-list-item>

              
            <!-- Revenus -->
            <v-list-group value="Revenus">
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
                        to="/admin/revenus"
                        value="Dashboard"
                        title="Dashboard">
                        <template v-slot:prepend >
                        <v-icon   
                        icon="mdi-view-dashboard-outline"></v-icon>
                        </template>
                  </v-list-item>

                  <v-list-item 
                        to="/admin/revenus/versements"
                        value="Versements"
                        title="Versements">
                        
                        <template v-slot:prepend >
                              <v-icon   
                              icon="mdi-invoice-list-outline"></v-icon>
                        </template>

                  </v-list-item>

           </v-list-group>

           <!-- /Revenus -->

            
            <!-- categories -->
            <v-list-group value="categories">
                  <template v-slot:activator="{ props }">
                        <v-list-item
                              v-bind="props"
                              value="categories"
                              title="Catégories"
                              prepend-icon="mdi-view-list"
                              >
                        </v-list-item>
                  </template>

                  <v-list-item 
                        value="Categories"
                        to="/admin/categories"
                        title="Categories">
                        <template v-slot:prepend >
                        <v-icon   
                        icon="mdi-layers-outline"></v-icon>
                        </template>
                  </v-list-item>

                  <v-list-item 
                        value="Challenges"
                        to="/admin/categories/challenges"
                        title="Challenges">
                        <template v-slot:prepend >
                        <v-icon   
                        icon="mdi-tag-multiple-outline"></v-icon>
                        </template>
                  </v-list-item>

           </v-list-group>
           <!-- /categories -->

            <v-list-item 
                  prepend-icon="mdi-email-outline" 
                  append-icon="mdi-chevron-rightt" 
                  value="Contacts"
                  to="/admin/contacts"
                  title="Contacts">
            </v-list-item>


            <!-- settings -->
            <v-list-group value="settings">

                  <template v-slot:activator="{ props }">
                        <v-list-item
                              v-bind="props"
                              value="settings"
                              title="Settings"
                              prepend-icon="mdi-cog-outline"
                              >
                        </v-list-item>
                  </template>

                  <v-list-item 
                        value="Site"
                        to="/admin/configuration/site"
                        title="Site web">
                        <template v-slot:prepend >
                        <v-icon   
                        icon="mdi-web"></v-icon>
                        </template>
                  </v-list-item>

                   

           </v-list-group>
           <!-- /categories -->


           <!-- messageries -->
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

           

            <!-- logout  -->
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