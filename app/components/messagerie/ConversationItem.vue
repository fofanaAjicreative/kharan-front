<script setup lang="ts">

    import { formatMonthYear,formatDuration ,timeAgo } from '~/utils/date'

    const { activeConversation } = useChat() ;
    const { isOnline , isUnReadConnversation ,readConnversation } = usePresence() ;
    const { user } = useAuth() ;

/* -------------------------- props ----------------------------------------------- */

    const {conversation} = defineProps({
        conversation: {
            type: Object,
            required: true
        }
    })

/* ------------------------------------------------------------------------- */


    const selected = computed(() =>
        { 
          return conversation.conversation.id == activeConversation.value?.conversation.id
        } 
    )

/* ------------------------------------------------------------------------- */

    const emit = defineEmits<{
        select:[conversation:any] 
    }>()


 /* ----------------------------------------------------------------------- */

    async function selectConversation (conversation :any){
        emit('select', conversation) ;
    }

/* --------------------------------------------------------------------------------- */

    onMounted(()=>{
        
    })


</script>

<template>

<v-list-item
    class="conversation-item"
    :class="{ selected }"
    @click="selectConversation(conversation)" >

    <template #prepend>
        <div class="position-relative mr-2">
            <v-avatar size="56">
                <v-img :src="conversation.user.photo?conversation.user.photo.media_url:'/images/profile.png'"/>
            </v-avatar>

            <!-- <v-badge dot
                    :color="isOnline(conversation.user.id) ? 'success' : 'grey'" /> -->

            <div v-if="isOnline(conversation.user.id)" class="online" > </div>
            <!-- <div v-if="isOnline(conversation.user.id)" class="online2" > 4 min</div> -->
        </div>
    </template>

    <v-list-item-title>
        <div class="d-flex justify-space-between align-center">
            <span class="font-weight-bold text-h6 fullname">
                {{ conversation.user.fullname }} 
            </span>
           
        </div>
    </v-list-item-title>

    <v-list-item-subtitle>
       
        <!-- my message -->
        <div v-if="conversation.conversation.lastMessageSenderId==user.id"
              class="d-flex justify-space-between align-center mt-1" >

            <span class="message">
                Vous: 
                <span v-if="conversation.conversation.lastMessageType=='file'" > 
                    Fichier  
                    <v-icon
                        icon="mdi-attachment"
                        size="small"  >
                    </v-icon>
                </span>
                <span v-else> {{ conversation.conversation.lastMessageText }} </span>
            </span>

            <div class="d-flex">
              <!-- read status -->
               <v-icon
                    v-if="conversation.conversation.lastMessageDate<=conversation.conversation.lastReadDate"
                    size="20"
                    class="ml-1"
                    icon="mdi-check-all"
                    color="info" >
                </v-icon>

                <v-icon
                    v-else
                    size="20"
                    class="ml-1"
                    icon="mdi-check"
                    color="grey" >
                </v-icon>     
                
                <span class="text_time_ago text-medium-emphasis ml-2">
                 {{  timeAgo(conversation.conversation.lastMessageDate) }}
                </span>
            </div>
        </div>

        <!-- other member message -->
        <div v-else
              class="d-flex justify-space-between align-center mt-1" >

            <span class="message">
                <span v-if="conversation.conversation.lastMessageType=='file'" > 
                    Fichier  
                    <v-icon
                        icon="mdi-attachment"
                        size="small"  >
                    </v-icon>
                </span>
                <span v-else> {{ conversation.conversation.lastMessageText }} 
                     </span>
            </span>


             <div class="d-flex">
                <span 
                    v-if="isUnReadConnversation(conversation.conversation.id)"
                    class="unread" >
                </span>  

                <span class="text_time_ago text-medium-emphasis ml-2">
                    {{  timeAgo(conversation.conversation.lastMessageDate) }}
                </span>
            </div>
            
            
        </div>
    </v-list-item-subtitle>
</v-list-item>

</template>

<style scoped lang="scss">

    .conversation-item{
        margin-bottom: 8px;
        transition:.2s;
        background:#f8f8f8;
     }

    .conversation-item:hover{
        background:#f6f8fc;
        cursor:pointer;
    }

    .selected{
        background:#eef5ff;
        margin-top: 8px;
        margin-bottom: 4px;
    }

    .online{
        width:13px;
        height:13px;
        border-radius:50%;
        background:#28c840;
        position:absolute;
        right:2px;
        bottom:2px;
        border:2px solid white;
    }

    .online2{
        background:#000;
        color:#28c840;
        position:absolute;
        right:-4px;
        bottom:0px;
        padding: 0px 4px;
        border-radius: 10px;
        font-size: 11px;
    }

    .unread{
        width:14px;
        height:14px;
        border-radius:50%;
        background:$secondary-color;
        border:0px solid white ;
    }


    .message{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    .fullname{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        max-width: 200px;
    }
    .text_time_ago{
        font-size: 12px;
    }

</style>