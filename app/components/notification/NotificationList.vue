
<script setup lang="ts">
 
    const { notifications, loading ,loadMore,hasMore ,page ,loaded } = useNotifications()  ;

    /* --------------------------- props ------------------------------------------ */

     const emit = defineEmits(['close']) ;


</script>


<template>

    <v-list
        class="pa-2"
        lines="two" 
        density="comfortable"
        >

        <!-- Chargement -->

        <template v-if="loading && !loaded">

            <NotificationSkeleton
                v-for="i in 3"
                :key="i" />

        </template>

        <!-- Liste vide -->

        <template v-if="loaded && !notifications.length" >
            <NotificationEmpty />
        </template>

       
        <!-- Notifications -->

        <template v-if="1" >

            <NotificationItem
                v-for="notification in notifications"
                :key="notification.id"
                :notification="notification"
                @close="emit('close')" />

        </template>

         <v-btn  v-if="loaded && hasMore"
           class="mt-4 mb-2"
            @click="loadMore()" 
            block
            size="default"
            variant="flat"  
            color="#eee" >  Afficher plus   </v-btn>

        <!-- <div ref="bottom"  class="py-2" ></div> -->
 
    </v-list>

   
</template>

<style scoped>

     

</style>

