export function useAppInitializer() {

    const {isAuthenticated } = useAuth();
    const { loadSettings } = useSiteSettings() ;

    const { loadSummaryNotification, loadSummaryMessage } = useNotifications();
    const { connectSocket } = useSocket();
    const { registerListeners } = useNotificationSocketEvents();
    const { initSocketListeners } = useChat();

    const { subscribe } = usePushManager();
    const { subscribeToClientsOrCoachs } = usePresence();
 

  /* ------------------------------------------------------------------- */  

    async function initialize() {
 
        
        await loadSettings() ;

        // socket : connect
        if(isAuthenticated.value){

            // socket
            connectSocket();

            // socket listeners
            initSocketListeners()

            // saved Notification
            registerListeners();

            // socket : presence
            subscribeToClientsOrCoachs() ; 

            // load notifcation badge
            loadSummaryNotification();
            loadSummaryMessage();

            // push notification
            subscribe() ;
                

        }
 
        // watch socket
        watch(isAuthenticated, (isAuthenticated) => {
             
            if(isAuthenticated){

                // socket
            connectSocket();

            // socket listeners
            initSocketListeners()

            // saved Notification
            registerListeners();

            // socket : presence
            subscribeToClientsOrCoachs() ; 

            // load notifcation badge
            loadSummaryNotification();
            loadSummaryMessage();

            // push notification
            subscribe() ;
                    
            }

        })
       
        

    }

  /* ------------------------------------------------------------------- */  

    return {
        initialize ,
    };

}