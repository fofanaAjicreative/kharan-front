<script setup lang="ts">

  import ConversationList from '~/components/messagerie/ConversationList.vue';
  import ChatView from '~/components/messagerie/ChatView.vue';
  import { formatMonthYear,formatDuration ,formatReservationDate } from '~/utils/date' ;

 
 
/* ------------------------- variables ------------------------------------------- */ 
 

/* -------------------------------------------------------------------------------- */
    
  onMounted(() => {
       
 

  });
 
</script>

<template>
  
  <section class="mb-2 page_content" >

     <NotificationMenu />

  </section>



</template>

<style scoped lang="scss">

  .page_content{
     max-width: 700px ;
     margin: auto;
     padding-top: 20px ;
     padding-bottom: 20px ;
  }

     

   
</style>