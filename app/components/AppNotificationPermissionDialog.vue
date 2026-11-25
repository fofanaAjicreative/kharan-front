<script setup lang="ts">

 
  const { isAuthenticated } = useAuth();

  const { subscribe , push } = usePushManager();
 
  const { dialog, showDialog ,accept, cancel } = useNotificationDialog() ;
 

  /* ------------------------------------------------------------------------------ */

    async function confirmDialog(){

       /*  await push.requestPermission() ;
        subscribe() ; */
        accept() ;

    }

    async function cancelDialog(){

        /* await push.requestPermission() ;
        subscribe() ; */
        cancel() ;
    }

  /* ------------------------------------------------------------------------------ */

    onMounted( async ()=>{
          if(isAuthenticated.value && !(await push.isGranted()) ){ 
            showDialog() ;

            await push.requestPermission() ;
            subscribe() ;
            
          }
    })

  /* ------------------------------------------------------------------------------ */

</script>


<template>
   
   <v-dialog
     
    v-model="dialog"
    max-width="620"
    persistentt >
    <v-card rounded="6">
    <v-card-text class="text-center pa-8">


       <div class="mb-5">
        <h2 class="title">

           Restez informé en temps réel
          <v-icon icon="mdi-clock-time-two-outline" color="#000" /> 
          
          </h2>
        </div>       

 
      
      <h4 class="description ">

        <!-- Bonjour {{ user.firstName }} {{ user.lastName.substring(0, 1)}}.  -->
       
      </h4>
      
      <v-alert
          color="info"
          variant="tonal"
          rounded="md"
          class="text-start mb-6" >
            <p class="mb-6">
               Activez les notifications pour suivre votre activité sans avoir à garder l'application 
               ouverte. 
               Vous serez averti immédiatement des nouvelles réservations, 
               des confirmations, des annulations, des messages et des rappels de rendez-vous. 
               Ainsi, vous ne manquerez aucune information importante.
              </p>
      </v-alert>
      
  
      <v-btn  
          @click="confirmDialog()" 
          color="black" 
          variant="flat"
          block
          size="large"
          prepend-icon="mdi-bell-outline"
           >
           Activer les notifications
      </v-btn>

      <v-btn
        variant="text"
        class="mt-3"
        @click="cancelDialog()" >
        Plus tard
      </v-btn>

    </v-card-text>

  </v-card>
</v-dialog>

</template>