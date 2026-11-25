<script setup lang="ts">

    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;

    const {  findSession, activeConversation  } = useChat() ;
    const { isOnline ,lastSeen } = usePresence() ;


    /* ------------------------------------------------------------------------------------- */

        const {panel , conversationId, unreadCount} = defineProps({

            panel: {
                type: Boolean,
                default: false,
            },
            minimized: {
                type: Boolean,
                default: false,
            },
            unreadCount: {
                type: Number,
                default:0
            },

            conversationId: {
                type:String ,
                required :true ,
            }

        });

    const session = computed(() => {  return findSession(conversationId); });
                
 

/* ------------------------------------------------------------------------------------- */

    const backToList = ()=>{
        activeConversation.value = null ;
        activeConversation.value = null ;
    }

/* ------------------------------------------------------------------------------------- */

  const emit = defineEmits(['toggle-minimized','close-panel']) ;

/* ------------------------------------------------------------------------------------- */


</script>

<template>
 
<v-toolbar v-if="session && session.chatUser"
    flat height="60" color="white" >
    
    <v-btn v-if="mobile && !panel"
        @click="backToList()"
        size="x-small"
        icon="mdi-arrow-left">
    </v-btn>

    <!-- Avatar -->

    <v-avatar size="50" class="ml-2" >
        <v-img :src="session.chatUser.photo?session.chatUser.photo.media_url:'/images/profile.png'" />
    </v-avatar>

    <!-- Infos -->

    <div class="ml-4">

        <div class="d-flex flex-wrap font-weight-bold text-h6" >
            <span> {{ session.chatUser.fullname }}  </span>

            <v-badge
                v-if="minimized"
                :model-value="unreadCount>0"
                :content="unreadCount"
                color="secondary"
                inline
            />

        </div>

       <!--  <div class="text-caption text-medium-emphasis" >
            {{ session.chatUser.job }}
        </div> -->

        <div v-if="isOnline(session.chatUser.id)" class="d-flex align-center mt-0" >
            <v-icon size="14" :color="isOnline(session.chatUser.id)?'green':'grey'" > mdi-circle </v-icon>
            <span class="text_ago ml-1" >
                {{ isOnline(session.chatUser.id)?'En ligne':'Hors ligne' }}
            </span>
        </div>

        <div v-else class="d-flex align-center mt-0">
            <span class="text_ago" v-if="false" >
                  date
            </span>
        </div>

    </div>

    <v-spacer/>

    <!-- option btn -->

    <!-- <v-btn
        icon
        variant="text"  >
        <v-icon>
            mdi-calendar
        </v-icon>
        <v-tooltip
            activator="parent" >
            Réservations
        </v-tooltip>
    </v-btn>

    
    <v-btn
        icon
        variant="text" >
        <v-icon>
            mdi-phone-outline
        </v-icon>
    </v-btn>


    <v-btn
        icon
        variant="text" >
        <v-icon>
            mdi-video-outline
        </v-icon>
    </v-btn> -->

  <!-- / option btn -->

    

    

    <!-- Menu -->
    <v-menu>
       <!--  <template #activator="{ props }">
            <v-btn  v-bind="props" 
                icon
                variant="text"
               >
                <v-icon>  mdi-dots-vertical </v-icon>
            </v-btn>
        </template> -->
        <v-list>
            <v-list-item>
                <template #prepend>
                    <v-icon>
                        mdi-account
                    </v-icon>
                </template>

                Voir le profil

            </v-list-item>

            <v-list-item>
                <template #prepend>
                    <v-icon>
                        mdi-calendar
                    </v-icon>
                </template>
                Réservations
            </v-list-item>

            <v-divider/>

            <v-list-item>
                <template #prepend>
                    <v-icon color="red">
                        mdi-alert-circle
                    </v-icon>
                </template>
                Signaler
            </v-list-item>

        </v-list>

    </v-menu>

    <v-btn v-if="panel"
        icon
        size="small"
        variant="text"
        @click="emit('toggle-minimized')" >
        
        <v-icon>
            {{ minimized ? 'mdi-window-maximize' : 'mdi-window-minimize' }}
        </v-icon>
        
    </v-btn>

    <v-btn v-if="panel"
        @click="emit('close-panel')"
        icon="mdi-window-close"> 
    </v-btn>

</v-toolbar>

</template>

<style lang="scss" scoped>
  .text_ago{
     font-size: 12px;
     color: #424242;
  }
</style>