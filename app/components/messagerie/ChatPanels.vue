<script setup lang="ts">

    import ChatViewPanel from '~/components/messagerie/ChatViewPanel.vue' ;
    const { panelConversations ,closeChatPanel } = useChat() ;



/* ------------------------------------------------------------------------ */

    function togglePanel(conversationId: string) {

        const panel = panelConversations.value.find(
            item => item.conversation.id === conversationId
        );

        if (!panel) {
            return;
        }

        panel.minimized = !panel.minimized;

        if (!panel.minimized) {
            panel.unreadCount = 0;
        }
    }

</script>

 
<template>

    <div class="chat-panels">

    <div
        v-for="panelConversation in panelConversations"
        :key="panelConversation.conversation.id"
        class="chat-panel" >
           
 
        <div class="chat-panel" >

            <ChatViewPanel 
                :conversationId="panelConversation.conversation.id"
                :panel="false"
                :minimized="panelConversation.minimized"
                :unreadCount="panelConversation.unreadCount"

                @toggle-minimized="togglePanel(panelConversation.conversation.id)" 
                @close-panel="closeChatPanel(panelConversation.conversation.id)"
                />
                
        </div>


    </div>

</div>
  
</template>


<style lang="scss" scoped>
   
    .chat-panels {
        position: fixed;
        right: 14px;
        bottom: 0px;
        display: flex;
        align-items: flex-end;
        gap: 8px;
        z-index: 9999;
     }

   

    .chat-panel {
        min-width: 340px;
        max-width: 375px;
        margin: 1px 0px;
    }

     @media (max-width:389px){
        
       .chat-panels {
         right: 0;
       }

        .chat-panel {
            width: 100%;
        }
         
    }

 
</style>