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
    <!-- APPROVED -->
    <v-alert
        v-if="status === 'approved'"
        class="mt-6"
        color="green-lighten-5"
        rounded="lg"
        icon="mdi-certificate"
    >
        <div class="font-weight-bold">Coach certifié</div>
        <div class="text-body-2 mt-2">
            Votre demande de certification a été approuvée par notre équipe.
            Cette certification valorise votre profil et renforce la confiance des clients envers
            votre expertise et votre parcours professionnel. Nous vous encourageons à maintenir
            votre profil à jour et à continuer d'offrir des prestations de qualité.
        </div>
    </v-alert>

    <!-- WAITING -->
    <v-alert
        v-else-if="status === 'waiting'"
        class="mt-6"
        color="blue-lighten-5"
        rounded="lg"
        icon="mdi-clock-outline"
    >
        <div class="font-weight-bold">Certification en attente de validation</div>
        <div class="text-body-2 mt-2">
            Votre demande de certification a bien été prise en compte et est actuellement
            en cours d'examen par notre équipe. Nous vérifions les informations et les
            justificatifs transmis afin de nous assurer de leur conformité.
            Vous serez informé dès qu'une décision sera prise. Merci pour votre patience.
        </div>
    </v-alert>

    <!-- REJECTED -->
    <v-alert
        v-else-if="status === 'rejected'"
        class="mt-6"
        color="red-lighten-5"
        rounded="lg"
        icon="mdi-alert-circle-outline"
    >
        <div class="font-weight-bold">Demande de certification rejetée</div>
        <div class="text-body-2 mt-2">
            Après examen de votre dossier, notre équipe n'a malheureusement pas pu
            approuver votre demande de certification dans son état actuel.
            Nous vous invitons à consulter les éventuelles remarques de notre équipe
            et à vérifier les informations de votre profil ainsi que les justificatifs
            fournis. Après avoir effectué les corrections nécessaires, vous pourrez
            contacter notre équipe afin de connaître les démarches à suivre pour
            soumettre à nouveau votre demande.
        </div>
    </v-alert>

    <!-- SUSPENDED -->
    <v-alert
        v-else-if="status === 'suspended'"
        class="mt-6"
        color="orange-lighten-5"
        rounded="lg"
        icon="mdi-certificate-outline"
    >
        <div class="font-weight-bold">Certification suspendue</div>
        <div class="text-body-2 mt-2">
            Nous vous informons que votre certification a été temporairement suspendue
            par notre équipe. Cette décision peut nécessiter une vérification
            complémentaire de votre dossier ou une mise à jour de certains justificatifs.
            Nous vous invitons à consulter les éventuelles remarques associées à cette
            décision et à contacter notre équipe pour connaître les démarches à effectuer
            en vue d'un éventuel rétablissement de votre certification.
        </div>
    </v-alert>
</template>


<style scoped lang="scss">
   

</style>