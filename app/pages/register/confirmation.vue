<script setup lang="ts" >
   
const { user } = useAuth();

</script>

 <template>
  
   <div v-if="user"
      class="main_content">

          <div class="form_content">
                <v-card rounded="10" elevation="0">
                  <v-card-text class="text-center pa-8">

                    <div class="mb-5">
                      <h1 class="title">
                      <v-icon icon="mdi-handshake-outline"  /> 
                      Bonjour {{ user.firstName }} {{ user.lastName.substring(0, 1)}}. </h1>
                        
                      </div>
                    
                    <h4 class="description ">
                      Votre profil est presque prêt 
                      <v-icon icon="mdi-star-shooting-outline" color="secondary" /> 
                    </h4>

                    
                    <v-alert
                        color="info"
                        variant="tonal"
                        rounded="md"
                        class="text-start mb-6" >
                          <p class="mb-6">
                            Pour commencer à recevoir des demandes de rendez-vous,
                            créez votre annonce de coaching.
                            <br> 
                              Décrivez votre expertise, définissez vos tarifs
                            et indiquez vos disponibilités.
                          </p>
                    </v-alert>
              
                      <!-- <v-btn  
                          color="secondary" variant="flat"
                          block
                          size="large"
                          spaced="both">
                          <span class="text-left" > Créer mon annonce </span>
                          <template v-slot:append>
                              <span class="icon_box_secondary icon_box_large">
                                  <v-icon  icon="mdi-arrow-right">  </v-icon>
                              </span>
                          </template>
                      </v-btn>
                                -->
                      <v-btn class="mt-16"
                        to="/espace-coach/annonce/add" 
                        block
                        color="black" variant="flat"
                        size="large"
                        spaced="both">
                        <span class="text-left" > Créer mon annonce </span>
                        <template v-slot:append>
                            <span class="icon_box_secondary icon_box_large">
                              <v-icon  icon="mdi-arrow-right">  </v-icon>
                            </span>
                        </template>
                      </v-btn>

                      <v-btn
                        to="/"
                        variant="text"
                        class="mt-3" >
                        Je le ferez plus tard
                      </v-btn>

                  </v-card-text>

                </v-card>
              </div>
          

   </div>
 
</template>

<style scoped lang="scss">
  
  .title{
      font-size: 28px;
      margin-bottom: 40px;
   }

   .description{
      font-size: 18px;
   }
</style>
