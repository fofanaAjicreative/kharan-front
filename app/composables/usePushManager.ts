import { PushManagerService } from "~/services/push-manager.service";

export const usePushManager = () => {


    const { $api } = useNuxtApp() ;

    const config = useRuntimeConfig();
    const push = new PushManagerService(config.public.pushPublicKey);


/* -------------------------------------------------------------------------------------- */

    async function subscribe(){


        const permission_granted = await push.isGranted() ;

        if (!permission_granted) return ;

        const subscription = await push.subscribe();

        if (!subscription) return ;


        $api('/notifications/subscribe',
              { 
                method: 'POST', 
                body: subscription 
              }).then((res :any) =>{
      
        }).catch(error=>{
            console.log(error);
        }) 
        

    }


/* ---------------------------------------------------------------------------- */

    async function unsubscribe(){

      const endpoint = await push.unsubscribe();

      if (endpoint) {

          $api('/notifications/unsubscribe',
          { 
            method: 'DELETE', 
            body:{
              endpoint: endpoint
            }
          }).then((res :any) =>{
       

          }).catch(error=>{
              console.log(error);
          }) 
      }

    }


/* ------------------------------------------------------------------------------------ */

    return {
        push ,
        subscribe,
        unsubscribe
    }

}


 