<script setup lang="ts">

  import ChatHeader from '~/components/messagerie/ChatHeader.vue';
  import ChatMessages from '~/components/messagerie/ChatMessages.vue';
  import MessageInput from '~/components/messagerie/MessageInput.vue' ;

 
  const {findSession , openedSessionsCount, activeConversation,openSession } = useChat() ;

 
/* ---------------------------------  props------------------------------------------ */


    const {conversationId , panel ,minimized } = defineProps({
        
        panel: {
              type: Boolean,
              default: false,
        },
        minimized: {
            type: Boolean,
        },
        unreadCount: {
            type: Number,
            default:0
        },

        conversationId: {
              type: String,
              required :true 
        },

    });

   

 const session = computed(() => {  return findSession(conversationId); });

const emit = defineEmits(['toggle-minimized','close-panel']) ;
 
 
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

/* ------------------------------------------------------------------------------------------ */

   function toggleMinimized(){
         emit('toggle-minimized')
   }

/* -------------------------------------------------------------------------------- */
 
  onMounted(()=>{
 
      // scroll top observer : top sentinel
      observer = new IntersectionObserver(async ([entry]) => {
          if (entry?.isIntersecting) {
            // Call the exposed child method directly
             session.value?.loadMoreMessages()
          }
      }) ;

      // session.value?.getConversation(conversationId) ;


  })

/* ----------------------------------------------------------------------------- */


  onBeforeUnmount(() => {
    session.value?.setMessageContainer(null);
    session.value?.readConversation() ;
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
            :panel="true"
            :minimized="minimized" 
            :unreadCount="unreadCount"
            @toggle-minimized="toggleMinimized()"
            @close-panel="emit('close-panel')"
            />

          <v-divider/>

          <!-- message list -->
          <div  ref="messagesContainerEl"  
                @scroll="session?.onMessagesScroll()"
                class="messages-container" 
                v-show="!minimized" >

              <div ref="topSentinel" class="topSentinel" ></div>

            <div v-if="session?.loaded"> 
              <ChatMessages 
                :conversationId="conversationId"  />
            </div>
            <v-skeleton-loader 
              v-else
              v-for="value in [1,1]"  type="article" />

          </div>

          <v-divider> </v-divider>

          <!-- input message -->

          <MessageInput  
              :conversationId="conversationId"
              @sendText="sendTextMessage"
              @sendFile="sendFileMessage"
              v-show="!minimized" />


        </v-card>
   
</template>


<style scoped lang="scss">


    .topSentinel{
      margin-top: 10px;
      height: 20px;
      background: #FFF ;
    }

    .chat_view{
      border : 2px solid #ddd ;
      border-radius: 4px 4px 0 0 ;
    }

    .messages-container{
      flex:1;
      overflow-y:auto;
      min-height:0;
      max-height: 550px;
    }



    @media (max-width: 839px){
        
      .chat_view{
          max-height: 90vh;
      }

       .messages-container{
              max-height: calc(90vh - 280px) ;
       }
         
    }




</style>