
  // dto : append to onlineUsers
    interface PresenceUpdateDto {
        userId: string
        online: boolean
        lastSeen?: string
    }


 export const usePresence = () => {

   
    const { user ,isCoach,isClient ,isAdmin } = useAuth();
    const {socket } = useSocket() ;
    const { $api } = useNuxtApp() ;


  /* -------------------------------------------------------------------------------------- */

    
    const onlineUsers = useState<Map<string, PresenceUpdateDto>>( "presence:users", () => new Map() ) ;
    const initialized = useState(  "presence:initialized", () => false ) ;
    const subscribeUserIds = useState<string[]>( "subscribe:users", () => [] ) ;
    const unreadConversationIds = useState<string[]>( "unread:conversations", () => [] ) ;

 /* ----------------------------------------------------------------------------------- */

    async function subscribeToClientsOrCoachs(){ 

           let  endpoint = '' ;
           if(isCoach.value){
                endpoint = '/coach/clients_ids';
           }else if(isClient.value){
                endpoint = '/client/coachs_ids';
           }else if(isAdmin.value){
                endpoint = '/admin/coachs_ids';
           }else{
                return ;
           }
 
            $api(endpoint).then((res :any)=>{

                subscribeUserIds.value = res.data;
                init(); // register listener
                subscribe(res.data);// request online status
                
            }).catch(error=>{
                console.log(error);
                
            })   
    }

  /* -------------------------------------------------------------------------------------- */

    function init() {

        
       if (initialized.value){ return } ;

        initialized.value = true ;

        // current presence status of my clients/coachs 
        socket.on("presence:initial", (usersStatus :any) => {

            console.log("presence:initial",usersStatus);
            
            for (const user of usersStatus) {
                onlineUsers.value.set(user.userId, user)
            }
        })

        // on update
        socket.on("presence:update",(userStatus: PresenceUpdateDto) => {
            //console.log("presence:update",userStatus);
            onlineUsers.value.set( userStatus.userId,userStatus )
        })

        

    }

 /* -------------------------- request presence status of my clients/coachs   ------------------ */

    function subscribe(subscribeUserIds: string[]) {
        if (!subscribeUserIds.length)  return
        socket.emit( "presence:subscribe", { userIds : subscribeUserIds } )

    }

 /* -------------------------------------------------------------------------- */

    function unsubscribe(userIds: string[]) {
        if (!userIds.length) return
        socket.emit( "presence:unsubscribe",  { userIds : userIds } ) ;
    }

 /* -------------------------------------------------------------------------- */

    function isOnline(userId: any) {
      return onlineUsers.value.get(userId)?.online ?? false
    }

 /* -------------------------------------------------------------------------- */

     function lastSeen(userId: string) {
        return onlineUsers.value.get(userId)?.lastSeen
    }

 /* -------------------------------------------------------------------------- */

    function clear() {
        onlineUsers.value.clear()  ;
    }



 /* ------------------------------------------------------------------------------ */


    async function getUnredConcersations() {
     
        $api('/chat/get_user_unred_concersations').then((res :any)=>{
            unreadConversationIds.value = res.data.conversationIds;

         }).catch(error=>{
            console.log(error);
            
        })
       
   }


 /* ------------------------------------------------------------------------------ */


    function isUnReadConnversation(conversationId: string) {
        return unreadConversationIds.value.includes(conversationId)
    }


    function readConnversation(conversationId: string) {
        unreadConversationIds.value = unreadConversationIds.value.filter((item :string) => item !== conversationId);
    }


 /* ------------------------------------------------------------------------------ */




   return {
        onlineUsers ,initialized ,
        subscribeUserIds ,
        subscribeToClientsOrCoachs,
        unsubscribe,
        isOnline,
        lastSeen,
        clear,

        // unreadConversation
        unreadConversationIds ,
        getUnredConcersations ,
        isUnReadConnversation,
        readConnversation , 
       
    }
 
 /* -------------------------------------------------------------------------- */



}