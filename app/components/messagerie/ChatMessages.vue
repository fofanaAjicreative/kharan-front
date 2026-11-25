<script setup lang="ts">

  import MessageBubble, { type Message } from '~/components/messagerie/MessageBubble.vue';
  import MessageBubbleDocument from '~/components/messagerie/MessageBubbleDocument.vue';
  import DateSeparator from '~/components/messagerie/DateSeparator.vue';
  import EmptyMessage from '~/components/messagerie/EmptyMessage.vue';
     
  import { getMessageDay } from '~/utils/date';

   const {  findSession, activeConversation  } = useChat() ;
  
 /* ---------------------------------  props---------------------------------------- */

    const { conversationId } = defineProps(
        {
             conversationId: {
                type:String ,
                required :true ,
            }
        }); 

 const session = computed(() => {  return findSession(conversationId); });
 
/* ------------------------------------------------------------------------------- */


    function getMessageTypeComponent(content_type :string){
         
        if(content_type=="text"){
           return  MessageBubble ;
        }else if (content_type=="file"){
            return  MessageBubbleDocument ;
        }
   }


/* --------------------------------------------------------------------------------- */

    onMounted(()=>{
        
    })


/* -------------------------------------------------------------------------------- */

    onUnmounted(() => {
        
    })

/* -------------------------------------------------------------------------------- */


</script>

<template>

<div v-if="session" class="messages" >

   <EmptyMessage v-if="session.loaded && session.chat_dates_all.length==0 " />

   <div v-if="session.loaded && session.chat_dates_all.length>0" class="messsages_container"> 

    <div v-if="session.loading_more"  class="text-center py-4" >
        <v-progress-circular indeterminate color="secondary" />
    </div>

    <template v-for="chat in session.chats" :key="chat.id" >
        <DateSeparator :label="getMessageDay(chat.date)" />
        <template v-for="message in chat.messages" :key="message.id" >
            <component
                :is="getMessageTypeComponent(message.content_type)"
                :message="message"
                :mine="message.is_me"
                :conversation="session.chatConversation"
            />
        </template>
    </template>

     <!-- Aujourd'hui -->
     <template v-for="chat in session.today_chats" :key="chat.id" >
        <DateSeparator :label="getMessageDay(chat.date)" />
        <template v-for="message in chat.messages" :key="message.id" >
            <component
                :is="getMessageTypeComponent(message.content_type)"
                :message="message"
                :mine="message.is_me"
                :session :conversation="session.chatConversation"
            />
        </template>
     </template>


     <v-fab
            v-show="!session.isAtBottom"
            class="scroll-bottom-btn"
            icon="mdi-arrow-down"
            color="info"
            variant="tonal"
            size="small"
            elevation="4"
            @click="session.scrollBottom()" />

    </div>


    </div>

</template>


<style scoped lang="scss">


    .messages{
        padding:24px;
        background:#ffffff;
    }

    .messages-container{
        position: relative;
    }
    
    .scroll-bottom-btn{
        position: absolute;
        right: 45%;
        bottom: 75px;
        z-index: 20;
    }


</style>