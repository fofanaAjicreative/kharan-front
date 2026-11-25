
<script setup>

  import ChatPanels from '~/components/messagerie/ChatPanels.vue' ;
  import CancelReservationDialog from '~/components/espace/CancelReservationDialog.vue' ;
  import UpcomingReservationDialog from '~/components/espace/UpcomingReservationDialog.vue' ;


  const { initialize } = useAppInitializer() ;

  const route = useRoute() ;
  const { user , isAuthenticated ,isCoach } = useAuth() ;
  const { getUpcommingReservation } = useUpcomingReservation() ;
  const { showDialog, set_has_annonce, set_annonce_completed,set_has_service } = useAnnonceDialog() ;
 

  useHead({
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
  })

 /* ------------------------------------------------------------------------------- */ 
    const isMessageriePage = computed(() =>
        route.path.startsWith('/messagerie')
    ) 
/* ----------------------- annonce check -------------------------------------- */ 



  function showAnnonceDialog(){ 

      showDialog({
        has_annonce: user.value.has_annonce ,
        annonce_completed: user.value.annonce_completed ,
        has_service: user.value.has_service ,
        dismissed_annonce_dialog_at: user.value.dismissed_annonce_dialog_at ,
      })
       
  }

 /* ------------------------------------------------------------------------------- */ 

  onMounted( async () => {

    if(isCoach.value){
      showAnnonceDialog() ;
    }

    // 🛡️ TRÈS IMPORTANT 
    await initialize(); 

    if(user.value){
      await getUpcommingReservation()
    }
   
 
  })



/* ------------------------------------------------------------------------ */ 

  onUnmounted(() => {
      
  })



</script>

<template>

  <div>

    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>


    <!-- dialog -->
      <AppLoadingOverlay />
      <AppConfirmDialog  />
      <CancelReservationDialog   />
      <AppSnackbar />
      <ChatPanels   />
      <UpcomingReservationDialog />
      <AppAuthDialog />

      <AppCoachAnnonceDialog />

  </div>

</template>


