
<script setup lang="ts">


/* ----------------------------------------------------------------------------------- */

    const emit = defineEmits(['close']) ;

/* ----------------------------------------------------------------------------------- */

    const {notifications , markAllAsRead ,unreadCountNotification ,badgeCountNotification } = useNotifications() ;

/* ----------------------------------------------------------------------------------- */

    async function goToNotifications() {

        emit('close')
        await navigateTo('/notifications')
    }

    
/* ----------------------------------------------------------------------------------- */

    const route = useRoute()
    const isNotificationsPage = computed(() =>
        route.path.startsWith('/notifications')
    )


/* ----------------------------------------------------------------------------------- */



</script>


<template>

    <div 
        class="card_view"
        elevation="0" >

    <!-- Header -->

    <v-card-title class="d-flex align-center justify-space-between" >

        <div>
            <h4 class="ma-1">Notifications</h4>
        </div>

        <!-- <v-chip
            v-if="1"
            color="secondary"
            size="small" >
        </v-chip> -->

    </v-card-title>

   <!--  <v-divider /> -->

    <!-- Body -->

    <NotificationList @close="emit('close')" />

    <v-divider />

    <!-- Footer -->

    <v-card-actions v-if="notifications.length">

        <v-btn v-if="unreadCountNotification > 0"
            variant="text"
            color="info"
            size="small"
            prepend-icon="mdi-check-all"
            @click="markAllAsRead" >

            Tout marquer comme lu

        </v-btn>
        

        <v-spacer />

        <v-btn v-if="!isNotificationsPage"
            variant="text"
            color="info"
            size="small"
            append-icon="mdi-menu-right"
            @click="goToNotifications"  >
            Voir toutes
        </v-btn>

    </v-card-actions>

  </div>

</template>


<style scoped>

    .card_view{
        max-height: calc(100vh - 100px) ;
        border : 1px solid #eee ;
        border-radius: 6px ;
        overflow: auto ;
        background: #fff ;
    }


</style>

