
 export const useNotificationSocketEvents = () => {

    const { socket } = useSocket();
    const notifications = useNotifications();
    const initialized = useState('notification-realtime-init',() => false );


 /* -------------------------------------------------------------------------------------  */

    const registerListeners = ()=> {

        if (initialized.value) { return;  }

        initialized.value = true;

        socket.on('notification.created', (notification :any) => {
            notifications.prepend(notification) ;
        });


    }
 
 /* -------------------------------------------------------------------------------------  */


    return {
        registerListeners,
    };




 }