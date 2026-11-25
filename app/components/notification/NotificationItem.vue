<script setup lang="ts">

    import dayjs from 'dayjs'
    import relativeTime from 'dayjs/plugin/relativeTime'
    dayjs.extend(relativeTime)

    /* --------------------------- props ------------------------------------------ */

    const props = defineProps<{ notification: SavedNotification }>()
    const emit = defineEmits(['close']) ;


    const { markAsRead,remove  } = useNotifications()
    const { isOnline } = usePresence() ;

    const { user }  = useAuth() ;
    const userRole = user.value.role ;

/* --------------------------------------------------------------------------------------- */

    const unread = computed(() => {  return props.notification.status == NotificationStatus.UNREAD } )

/* ---------------------------------------------------------------------------------------- */

    const avatar = computed(() => {
        return props.notification.users?.[0]?.photo
    })

    const fromUser = computed(() => {
        return ` ${props.notification.users?.[0]?.firstname} ${props.notification.users?.[0]?.lastname} `
    })

    const createdAt = computed(() => {
        return dayjs(props.notification.created ).fromNow()
    })

/* -------------------------------------------------------------------------------------------- */

async function open() {

    if ( props.notification.status === NotificationStatus.UNREAD) {
        await markAsRead(props.notification.id)
    }

    emit('close')
    navigateTo(notificationUrl.value)

}
 
/* ------------------------------------------------------------------------------------------- */

    const notificationUrl = computed(() => {

        switch (props.notification.entityType) {
            case 'reservation':

               if(userRole=='ROLE_COACH'){
                  return `/espace-coach/reservations/${props.notification.entityId}`
               }else{
                  return `/espace-client/reservations/${props.notification.entityId}`
               }
                
            case 'message':
                return `/messages/${props.notification.entityId}`

            case 'service':
                return `/service/${props.notification.entityId}`

            case 'profile':
                return `/coach/${props.notification.entityId}`

             case 'annonce':
                return `/espace-coach/annonce`
            default:
                return '/notifications'

        }

    })
/* -------------------------------------------------------------------------------- */



const colors :any = {
    
    create: "secondary",
    approve: "info",
    reject: "error" ,
    cancel: "orange" ,
    complete: "#ADB" ,
    comment: "#5D3FD3",

    reminder_24h: "info",
    reminder_30m: "info",
    reminder_5m: "info",

    approved: "info",
    waiting: "orange",
    rejected: "error",
    suspended: "warning",

  };

  const icons :any = {

    reservation_create: "mdi-calendar-outline",
    reservation_approve: "mdi-calendar-check",
    reservation_complete: "mdi-calendar-end",
    reservation_cancel: "mdi-calendar-remove",
    reservation_reject: "mdi-calendar-remove",

    reservation_reminder_24h: "mdi-calendar-clock",
    reservation_reminder_30m: "mdi-calendar-clock",
    reservation_reminder_5m: "mdi-calendar-clock",


    service_comment: "mdi-message-star-outline",
    profile_comment: "mdi-card-account-details-star-outline",


    annonce_approved: "mdi-card-account-details",
    annonce_waiting: "mdi-card-account-details",
    annonce_rejected: "mdi-card-account-details",
    annonce_suspended: "mdi-card-account-details",
    
  };


</script>

<template>

    <v-list-item
        class="notification-item"
        :class="{ unread }"
        @click="open" >

    <!-- Avatar -->

    <template #prepend>

        <div class="position-relative">

            <v-avatar  size="70" >
                <v-img  :src="avatar?avatar:'/images/profile.png'"  />
            </v-avatar>

            <!-- <div v-if="!isOnline(notification?.users?.[0]?.id)" class="online" > </div> -->

            <div class="notifi_entity" >
              <v-btn 
                  size="x-small"
                  variant="flat"
                  :color="colors[`${notification.action}`]"
                  icon
                  >
                  <v-icon 
                  :icon="icons[`${notification.entityType}_${notification.action}`]" 
                  size="small"
                  />
              </v-btn>
            </div>

         </div>

    </template>

    <!-- Content -->

    <div class="pl-4">

        <v-list-item-title class="title">
        {{ notification.title }} 
       </v-list-item-title>

        <v-list-item-subtitle class="message">
            {{ notification.message }}
        </v-list-item-subtitle>
        <small class="text-medium-emphasis">
                {{ timeAgo(notification.created) }}
        </small>

    </div>

    <!-- Date -->

    <template #append>

    <v-menu location="bottom end">

        <template #activator="{ props }">

            <v-btn
                icon
                size="small"
                variant="text"
                v-bind="props"
                @click.stop
            >
                <v-icon size="20">
                    mdi-dots-vertical
                </v-icon>
            </v-btn>

        </template>

        <v-list density="compact">

            <v-list-item
                v-if="notification.status == NotificationStatus.UNREAD"
                prepend-icon="mdi-check"
                title="Marquer comme lu"
                @click="markAsRead(notification.id)"
            />

            <v-list-item
                prepend-icon="mdi-delete-outline"
                title="Supprimer"
                @click="remove(notification.id)"
            />

        </v-list>

    </v-menu>

</template>

</v-list-item>

</template>



<style scoped lang="scss">


    .title {
        color: #424242;
        font-size: 14px;
        font-weight: bold;
    }
    .message {
        color: #424242;
        font-size: 13px;
    }


    .notification-item {
         background: #f8f8f8 ;
    }


    .unread{
        background: #e6f0fd ;
    }


     .online{
        width:10px;
        height:10px;
        border-radius:50%;
        background:#28c840;
        position:absolute;
        right:4px;
        bottom:4px;
        border:0px solid white;
    }

    .notifi_entity{
        position:absolute;
        right:-6px;
        bottom:-6px;
        border:0px solid white;
    }

 

   
</style>