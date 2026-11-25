
<script setup lang="ts">
    const menu = ref(false) ;
    const { load, badgeCountNotification ,notifications ,menuOpenedNotification } = useNotifications() ;

    const route = useRoute()
    const isNotificationsPage = computed(() =>
        route.path.startsWith('/notifications')
    )


/* ----------------------------------------------------------------------------------- */

    watch(menu, async value => {

        if(value && !notifications.value.length ) {
            await load(true) // false : no refresh
        }
        
    })

/* ----------------------------------------------------------------------------------- */


</script>

<template>


    <!-- Sur la page notifications -->
        <v-btn
            v-if="isNotificationsPage"
            :active="false"
            color="#FFF"   
            variant="text" 
            icon 
            size="x-small"
            class="menu_btn"
            @click="menuOpenedNotification" 
        >

            <v-badge
                :content="badgeCountNotification"
                :model-value="badgeCountNotification > 0"
                >
                <v-icon
                    icon=" mdi-bell-outline"
                    size="large"
                    color="secondary" 
                > </v-icon>
            </v-badge> 

        </v-btn>

    <!-- Partout ailleurs -->

    <v-menu v-else
            v-model="menu"
            :close-on-content-click="false"
            location="bottom end"
            width="420" >

        <template #activator="{ props }">
            <v-btn 
                color="#FFF"   
                variant="text" 
                icon 
                size="default"
                class="menu_btn"

                v-bind="props"
                @click="menuOpenedNotification" >

                <v-badge
                    color="error"
                    :content="badgeCountNotification"
                    :model-value="badgeCountNotification > 0"
                    >

                    <v-icon 
                        icon=" mdi-bell-outline"
                        color="secondary"
                        size="large">
                       
                    </v-icon>

                </v-badge>

            </v-btn>
        </template>

        <!-- NotificationMenu  -->
        <NotificationMenu @close="menu = false" />

    
    </v-menu>

</template>

<style lang="scss" scoped>


    .menu_btn{
        margin: 4px ;
    }


</style>


