<script setup lang="ts">

  import ChatHeader from '~/components/messagerie/ChatHeader.vue';
  import ChatMessages from '~/components/messagerie/ChatMessages.vue';
  import MessageInput from '~/components/messagerie/MessageInput.vue' ;

 
  const {findSession,closeSession , openedSessionsCount, activeConversation,openSession } = useChat() ;

 
/* ---------------------------------  props------------------------------------------ */


    const {conversationId , panel } = defineProps({
        
        panel: {
              type: Boolean,
              default: false,
        },

        conversationId: {
              type: String,
              required :true 
              
        },

    });


 const session = computed(() => {  return findSession(conversationId); });
 
/* ---------------------------- send text ---------------------------------------- */

  async function sendTextMessage(message_text:string){
      session.value?.sendTextMessage(message_text) 
  }

/* -------------------------- send file ---------------------------------------- */

  async function sendFileMessage(message_text:string , attachment :any){

    session.value?.sendFileMessage(message_text,attachment) ;

  }

/* -------------------------- topSentinel------------------------------------------------- */

    // scroll when reached 
    let  observer :any ;
    const topSentinel = ref<HTMLElement>()  

      watch(topSentinel, (el) => {
          if (!el) return
          observer.observe(el)
      })

/* --------------------------- scrollBottom -------------------------------------- */

    const messagesContainerEl = ref<HTMLElement>() ;

    watch(
          [messagesContainerEl, session],
          ([el, currentSession]) => {

            if (!el || !currentSession) return;
            currentSession.setMessageContainer(el);
            
          },
          { immediate: true }
      );

    
/* -------------------------------------------------------------------------------------- */

  watch( () => session.value?.isAtBottom, (newValue, oldValue) => {

          if (!oldValue && newValue) {
              session.value?.messageReadReceipt();
          }

      }
  );
 
 
/* -------------------------------------------------------------------------------- */
 
  onMounted(()=>{
 
      // scroll top observer : top sentinel
      observer = new IntersectionObserver(async ([entry]) => {
          if (entry?.isIntersecting) {
            // Call the exposed child method directly
             session.value?.loadMoreMessages()
          }
      }) ;
 
        
  })

/* ----------------------------------------------------------------------------- */


  onBeforeUnmount(() => {
    session.value?.setMessageContainer(null);
    session.value?.readConversation() ;
    closeSession(session.value?.chatConversation.id)
  });

/* ----------------------------------------------------------------------------- */


</script>
<template>
 
         <v-card class="chat_view coach-card d-flex flex-column" 
            :class="{ panel: panel }"
            elevation="0" >
        

          <!-- chat header -->
          <ChatHeader 
             :conversationId="conversationId"
             :panel="panel"  />


          <v-divider/>

          <!-- message list -->
          <div ref="messagesContainerEl"  
                @scroll="session?.onMessagesScroll()"
                class="messages-container" >

              <div ref="topSentinel" class="topSentinel" ></div>

              <ChatMessages 
                :conversationId="conversationId"  />

          </div>

          <v-divider> </v-divider>

          <!-- input message -->

          <MessageInput  
              :conversationId="conversationId"
              @sendText="sendTextMessage"
              @sendFile="sendFileMessage" />


        </v-card>
   
</template>


<style scoped lang="scss">


    .topSentinel{
      margin-top: 10px;
      height: 20px;
      background: #FFF ;
    }

    .chat_view{
      height: calc(100vh - 104px) ;
      border : 1px solid #ddd ;
      border-radius: 4px ;

    }


    @media (max-width: 839px){
        .chat_view{
          height: calc(100vh - 96px) ;
          border : 1px solid #eee ;
          border-radius: 0px ;
         }
 
    }


    .messages-container{
      flex:1;
      overflow-y:auto;
      min-height:0;
    }



</style>