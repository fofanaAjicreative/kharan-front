export default defineNuxtPlugin(async () => {

 
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker non supporté');
        return;
    }else{
       // console.warn('✅ Service Worker est supporté');
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        // console.log('✅ Service Worker enregistré');
    } catch (error) {
        console.error(error);
    }


});