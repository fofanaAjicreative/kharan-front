 export const useSocket = () => {

    const { $socket} = useNuxtApp() ;
    const isSocketConnected = useState<Boolean | null>( "is-socket-connected", () => false ) ;
   
/* ------------------------------------------------------------------------------- */

 
    const connectSocket = () => {

        if (!$socket.connected) {
            console.log('Lancement de $socket.connect()...')
            $socket.connect()
            isSocketConnected.value = true
        }

    }
 
 /* -------------------------------------------------------------------------------- */

    const disconnectSocket = () => {

        $socket.disconnect() ;
        isSocketConnected.value = false ;
    }

 /* -------------------------------------------------------------------------------- */

    return {
        socket: $socket,
        connectSocket,
        disconnectSocket,
        isSocketConnected
    }

/* -------------------------------------------------------------------------------- */


}