<script setup lang="ts">


    const { user , isCoach , isClient ,isAdmin } = useAuth();

/* ----------------------------------------------------------------------- */

  const reservations_link = computed(()=>{ 

        if(isCoach.value){
            return '/espace-coach/reservations'
        }else if(isClient.value){
            return '/espace-client/reservations'
        }else if(isAdmin.value){
            return '/admin/annonces'
        }else{
            return '/'
        }  

    })


</script>

<template>
    <v-card  class="main_view" elevation="0">
        <v-sheet
            class="fill-height d-flex flex-column align-center 
            justify-center text-center pa-8"
            color="transparent" >

            <v-avatar
                size="100"
                color="info"
                variant="tonal"
                class="mb-6" >

                <v-icon
                    icon="mdi-account-multiple-outline"
                    size="54" >
                </v-icon>
            </v-avatar>

            <h2 class="text-h5 font-weight-bold mb-2">
                Pas de conversations
            </h2>

            <p class="ma-0 "> Vous n'avez pas encore de conversation. </p>

            <p
                class="text-medium-emphasis text-body-1 mb-8 text-leftt"
                style="max-width:420px;" >

                <v-icon
               
                variant="tonal"
                color="secondary"
                icon="mdi-lightbulb-outline"  />
                Vous pouvez initier une concersation depuis vos reservations
                en cliquant sur le boutton "contacter" du client ou du coach.
            </p>

            <v-btn 
                color="info"
                variant="tonal"
                prepend-icon="mdi-message-plus"
                size="large"
               
                :to="reservations_link" >
                Nouvelle conversation
            </v-btn>

        </v-sheet>
    </v-card>
</template>

<style lang="scss" scoped>

    .main_view{
        height: 60vh;
        /* margin: 0px 10px 40px 10px ;
        border-radius: 8px ;
        border : 0px solid #ddd ; */
    }

</style>