<script setup lang="ts">

   const { login_dialog } = useAuth();


    const cancel = ()=>{
      login_dialog.value = false ;
    }
  
    const confirm = ()=>{
        login_dialog.value = false ;
        navigateTo('/login')
    }


</script>


<template>
   
   <v-dialog
    v-model="login_dialog"
    max-width="520"
    persistentt >
    <v-card rounded="4">
    <v-card-text class="text-center pa-8">


        <div class="mb-0">
            <h2 class="title">  Vous y êtes presque 
              <v-icon icon="mdi-star-shooting-outline" color="secondary" />  </h2>
        </div>
       
 
          <div>

              <v-alert
                  color="info"
                  variant="tonal"
                  rounded="md"
                  class="text-start mb-6" >
                    <div class="description">
                      <h3 class="mb-4 mt-1"> Connectez-vous pour poursuivre </h3> 
                       
                      Pour réserver des séances et bénéficier des services de coaching avec les coach, 
                      vous devez être connecté à votre compte. <br>
                      Vous n'avez pas encore de compte ? Inscrivez-vous gratuitement en quelques instants.
                       
                    </div>
              </v-alert>

              <v-btn 
                  @click="confirm"
                  color="secondary" variant="flat"
                  block
                  size="large"
                  append-icon="mdi-arrow-right"
                  >
                  <span class="text-left" > Connexion / Inscription </span>
              </v-btn>

          </div>
 
    
    
      <!-- --------------------------------------------------------- -->
      <v-btn
        variant="text"
        class="mt-3"
        @click="cancel" >
          Annuler
      </v-btn>

    </v-card-text>

  </v-card>
</v-dialog>

</template>

<style scoped lang="scss">

  .description {
    line-height: normal ;
  }
</style>