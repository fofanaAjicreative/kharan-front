<script setup >

    const props = defineProps(['roomName', 'displayName','tokenFromNestJS']);

    const jitsiContainer = ref(null);
    let api = null;



 onMounted(() => {

    const domain = "meet.laabal.com";

    const options = {

        roomName: props.roomName,
        jwt: props.tokenFromNestJS,
        parentNode: jitsiContainer.value,
        width: '100%',
        height: 600,

        userInfo: {
            displayName: props.displayName
        },
        

        configOverwrite: {
            prejoinPageEnabled: false ,// Shunte la page d'attente Jitsi
            startWithAudioMuted: true,
            startWithCaleraOff: true,
        },



        interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: ['microphone', 'camera', 'chat', 'desktop', 'hangup']
        }


    };

    // Initialisation de l'API
    api = new window.JitsiMeetExternalAPI(domain, options);

    // Gestion des événements
    api.addEventListeners({

        videoConferenceLeft: () => {

            console.log("L'utilisateur a quitté la réunion");
            navigateTo("/");

        }

    });


    });
  
    onUnmounted(() => {
        if (api) api.dispose();
    });

</script>

<template>
  <div ref="jitsiContainer" class="jitsi-wrapper"></div>
</template>

<style scoped>
    .jitsi-wrapper {
        border: 1px solid #ccc;
        border-radius: 8px;
        overflow: hidden;
    }
</style>