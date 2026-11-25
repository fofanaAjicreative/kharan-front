<script setup lang="ts">

 

/* ----------------------------- propos ----------------------------------------------------- */

    const props = defineProps({
        status:{
            type:String,
            required:true
        }
    }) ;
   

</script>

<template>

 
            <!-- waiting-->
            <div v-if="status=='waiting'" class="mt-4">

                <v-alert
                    color="secondary"
                    variant="tonal"
                    rounded="0"
                    class="text-start mb-6"
                    closable >
                    <div class="pa-1 description">
                        <h2 class="mb-4 mb-sm-2 mt-1 title">
                            <v-icon  icon="mdi-information-slab-circle" /> Votre annonce est en attente de validation  </h2>  
                        Notre équipe va prochainement examiner votre annonce.
                        En attendant, vous pouvez continuer à compléter et à améliorer votre profil afin de présenter au mieux votre expertise.<br>
                        Pensez notamment à renseigner <b>vos expertises, services, disponibilités, expériences professionnelles et formations</b>.<br>
                        Vous pouvez également <b> configurer votre moyen de paiement</b> afin que votre compte soit prêt à recevoir des réservations.<br>
                        Vous serez informé(e) dès que notre équipe aura terminé l'examen de votre annonce.<br>
                        Une question ou besoin d'aide ?<b> Notre équipe reste à votre disposition</b>.
                    </div>
                </v-alert>

            </div>
            <!-- / Annonce status -->

            <!-- Annonce status -->
            <div v-else-if="status=='rejected'" class="mt-4">
                <v-alert
                    color="error"
                    variant="flat"
                    rounded="0"
                    class="text-start mb-6"
                    closable >
                    <div class="pa-1 description">
                        <h2 class="mb-4 mb-sm-2 title"> 
                            <v-icon  icon="mdi-alert" /> Annonce rejetée  </h2>  
                        Après examen, notre équipe n'a pas pu valider votre annonce dans son état actuel.<br>
                        Nous vous invitons à consulter les remarques laissées par notre équipe et à apporter les modifications nécessaires à votre profil et à votre annonce.<br>
                        Pensez également à vérifier <b> vos expertises, services, disponibilités, expériences professionnelles, formations et informations de paiement</b> afin de compléter votre profil.<br>
                        Après avoir effectué les modifications nécessaires, contactez notre équipe afin que nous puissions <b> réexaminer votre annonce </b> et vous accompagner dans sa validation.
                    </div>
                </v-alert>

            </div>
            <!-- / Annonce status -->

       
            <div v-else-if="status=='suspended'" class="mt-4">
                <v-alert
                    color="warning"
                    variant="flat"
                    rounded="0"
                    class="text-start mb-6"
                    closable
                >
                    <div class="pa-1 description">
                        <h2 class="mb-4 mb-sm-2 title">
                            <v-icon icon="mdi-pause-circle" />
                            Annonce suspendue
                        </h2>

                        Nous vous informons que votre annonce a été temporairement suspendue par notre équipe. Durant cette période, elle ne sera plus visible par les utilisateurs et ne pourra plus recevoir de nouvelles demandes de réservation.<br>

                        Cette décision peut être liée au non-respect de nos règles de publication, à des informations incomplètes ou à la nécessité de vérifier certains éléments de votre profil ou de votre annonce.<br>

                        Nous vous invitons à consulter les éventuelles remarques laissées par notre équipe et à vérifier
                        <b>vos expertises, services, disponibilités, expériences professionnelles, formations et informations de paiement</b>,
                        afin de vous assurer que votre profil et votre annonce sont conformes aux exigences de la plateforme.<br>

                        Si vous estimez que cette suspension nécessite des éclaircissements, ou si vous avez effectué les corrections nécessaires, contactez notre équipe afin que nous puissions examiner votre situation et vous accompagner dans la réactivation de votre annonce.
                    </div>
                </v-alert>
            </div>
        

</template>

<style scoped lang="scss">
  
   .title{
     line-height: normal ;
     font-size: 20px;
   }

   .description{
    line-height: normal;
   }

</style>