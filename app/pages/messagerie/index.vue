<script setup lang="ts">

  import ConversationList from '~/components/messagerie/ConversationList.vue';
  import ChatView from '~/components/messagerie/ChatView.vue';
  import EmptyConversation from '~/components/messagerie/EmptyConversation.vue';
  import EmptyConversationSelected from '~/components/messagerie/EmptyConversationSelected.vue';

 import { useDisplay } from 'vuetify' ;
 const { mobile ,name ,smAndDown} = useDisplay() ;
  
  const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;
  const { activeConversation ,closeSession ,openSession,findSession,ischatContactLoaded } = useChat() ;

/* ------------------------------ variables ------------------------------------------- */ 

   
  const conversationId = ref<any>(null);

 /* -------------------------------------------------------------------------------------- */

  watch(name, async (name) => {
        // alert(name)
  })
   
  watch(activeConversation, async (activeConversation, previousConversation) => {
 

      console.log("previousConversation:",previousConversation);
      
    
      if(!activeConversation){
        conversationId.value  = null ;
        return ;
      }
 
      const currentSession = openSession(activeConversation.conversation.id);

      await currentSession.getConversation(activeConversation.user.id);
      // new conversationID
      conversationId.value  = activeConversation.conversation?.id ;

      // close previous session
      if(previousConversation){
        closeSession(previousConversation.conversation?.id) ;
      }
         
 
        
  })


/* -------------------------------------------------------------------------------- */
    
  onMounted(() => {

    activeConversation.value = null  ;
      
  });

/* -------------------------------------------------------------------------------- */

  onUnmounted(() => {

      // close previous session
      if(activeConversation.value){
        closeSession(activeConversation.value.conversation?.id)
      }
      
  })


 
</script>

<template>
  
  <section class="mb-2 page_content" >

    <div>

      <!-- desktop -->

      <div v-if="!smAndDown">
        <v-row class="ga">
          <v-col cols="4">
              <ConversationList/>
          </v-col>
          <v-col cols="8">

            <div v-if="ischatContactLoaded"> 
              <ChatView  v-if="conversationId" 
                       :conversationId="conversationId"
                       :panel="false"/>
              <EmptyConversationSelected v-else />
            </div>

            <v-skeleton-loader 
              v-else
              v-for="value in [1,2]"  type="image, article" />

          </v-col>
        </v-row>
      </div>


      <!-- mobile -->
      <div v-else>

        <ConversationList v-if="!activeConversation"  />
        <ChatView  v-else
            :conversationId="conversationId"
            :panel="false" />
            
      </div>

      
    </div>
      
  </section>



</template>

<style scoped lang="scss">

  .page_content{
     padding: 0px;
  }

  .stats_item{
    display: flex;
    flex-direction: column;
    align-items: center ;
    justify-content: center;
    padding: 10px ;
   /*  border: 1px #ddd solid ; */
    width: 250px ;
    height: 100px;
    box-shadow: 0 2px 5px rgba(0,0,0,.08);
     border-radius: 6px;
     .value{
       font-size: 24px;
       font-weight: bold ;
       color: #000 ;
       margin: 0px;
     }
     .title{
       font-size: 14px;
       color: #424242;
       margin: 0px;
       
     }
  }


  .no_item{
      
      box-shadow: 0 12px 25px rgba(0,0,0,.08);
     
      border-radius: 10px;
      margin-bottom: 20px;
    }

   .rdv_item{
      border: 1px #eee solid ;
       box-shadow: 0 12px 25px rgba(0,0,0,.08);
      padding:10px ;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .coach_name{
        margin: 0px ;
        font-size: 15px ;
        font-weight: bold ;
        color: #000;
    }


    .annonce_title{
        margin: 0px ;
        font-size: 12px ;
        color: #424242;
        margin-bottom: 10px;
    }

    .service_title{
         margin: 0px ;
        font-size: 14px ;
        color: #424242;
        a{
          text-decoration: none ;
        }
    }
    .service_date{
        margin: 0px ;
        margin-bottom: 10px;
        margin-top: 4px;
        font-size: 14px ;
        color: #424242;
        font-weight: bold ;
    }


   
</style>