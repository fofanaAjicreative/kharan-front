    export interface ChatMessage {
        id: string;
        conversationId: string;
        sender_id: string;
        content?: string;
        read?: boolean;
        is_me?: boolean;
        [key: string]: any;
    }

    export interface Conversation {
        conversation: any;
        user: any;
      
    }

/* ---------------------------------------------------------------------------------------- */

    export interface PanelConversation {
        conversation: any;
        user: any;
       
        minimized : boolean ;
        unreadCount: number ;
    }

/* ---------------------------------------------------------------------------------------- */


/* ---------------------------------------------------------------------------------------- */

export function useChat() {

    const { $api , $refreshToken } = useNuxtApp() ;
    const config = useRuntimeConfig() ;

    const {socket , isSocketConnected,connectSocket,disconnectSocket} = useSocket() ;
    const {user } = useAuth() ;
    const {unreadConversationIds } = usePresence() ;
    const { showLoading, hideLoading } = useGlobalLoading() ;
    const { showSuccessSnackbar,showWarningSnackbar, showErrorSnackbar } = useSnackbar() ;

    const { badgeCountMessage } = useNotifications() ;

    const ischatContactLoaded = useState('chat-contact-loaded',() => false );

    const realtimeInitialized = useState('chat-realtime-init',() => false );

    type ChatSession = ReturnType<typeof createChatSession>;

    const sessions = useState<Record<string, ChatSession>>( 'chat-sessions', () => ({}));
 
    const activeConversation = useState<Conversation | null>( 'active-conversation', () => null ) ;

    const panelConversations = useState<PanelConversation[]>('chat-panel-conversations', () => []);


    // refresh token
    const messageQueue = useState<Array<{ event: string, data: any }>>("socket-queue", () => []) ;
    const isRefreshing = useState<boolean>("socket-is-refreshing", () => false) ;


    const sleep = (ms :number) => new Promise(resolve => setTimeout(resolve, ms));

    function setchatContactLoaded(val:boolean) {
        ischatContactLoaded.value = val ;
    }
/* ------------------------------ FACTORY ------------------------------------------------------- */

function createChatSession(conversationId: string) {

    const session = reactive({

        // ------------------------------------------------------------------
        // Identity
        // ------------------------------------------------------------------

        conversationId,

        // ------------------------------------------------------------------
        // Conversation
        // ------------------------------------------------------------------

        chatUser: null as any,

        chatConversation: null as any,

        // ------------------------------------------------------------------
        // Messages
        // ------------------------------------------------------------------

 
        loading: false,

        hasMore: true,

        page: 1,

        // ------------------------------------------------------------------
        // Dates / groups
        // ------------------------------------------------------------------

        loaded: false,

        loading_more: false,

        chat_dates: [] as any[],

        chat_dates_all: [] as any[],

        chats: [] as any[],

        today_chats: [] as any[],

        load_count: 1,

        max_dates_count: 1 ,

        // ------------------------------------------------------------------
        // UI
        // ------------------------------------------------------------------

        messagesContainer: null as HTMLElement | null,

        isAtBottom: true,

        loadingMoreMessage: false,


        isTyping: false,
        typingUser: null as any,
        typingTimeout: null as ReturnType<typeof setTimeout> | null,


        // ------------------------------------------------------------------
        // Read receipt
        // ------------------------------------------------------------------

        readReceiptTimer: null as ReturnType<typeof setTimeout> | null,

        lastSentReadMessageId: null as string | null,


        // ==================================================================
        // COMPUTED-LIKE GETTERS
        // ==================================================================

        get no_message() {

            return this.loaded &&
                   this.chat_dates_all.length === 0;

        },

        get count_message() {

            return (
                this.chats.flatMap((group :any) => group.messages).length +
                this.today_chats.flatMap((group :any) => group.messages).length
            );

        },


        // ==================================================================
        // METHODS
        // ==================================================================

        setMessageContainer(el :HTMLElement|null) {
            this.messagesContainer = el ;
        },


        // ------------------------------------------------------------------

        scrollBottom() {

            nextTick(() => {

                if (!this.messagesContainer) {
                    return;
                }

                // this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight ; 

                this.messagesContainer?.scrollTo({
                    top: this.messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });

            });

        },

        // ------------------------------------------------------------------

        isScrolledToBottom(tolerance = 30): boolean {

            const container = this.messagesContainer;

            if (!container) {
                return false;
            }

            return (
                container.scrollTop + container.clientHeight >=
                container.scrollHeight - tolerance
            );

        },

        // ------------------------------------------------------------------

        onMessagesScroll() {
            this.isAtBottom = this.isScrolledToBottom();
        },

        // ------------------------------------------------------------------
 
        restoreScrollTop(height: number) {

               nextTick(() => {

                if (!this.messagesContainer) {
                    return;
                }
                this.messagesContainer.scrollTop = height;
            });
        },


        // ------------------------------------------------------------------

        getIndex(nbr: number): number {

            if (nbr > this.chat_dates.length) {
                return this.getIndex(nbr - 1);
            }

            return nbr;

        },


        // ------------------------------------------------------------------
        // Reset
        // ------------------------------------------------------------------

        resetConversationData() {


            this.chatUser = null ;
            this.chatConversation = null  ;


            this.loading = false ;
            this.hasMore = true ;
            this.page = 1 ;


            this.loaded = false ;
            this.loading_more = false ;

            this.chat_dates = [];

            this.chat_dates_all = [];

            this.chats = [];

            this.today_chats = [];

            this.load_count = 1;

 
        
            this.messagesContainer =  null ;
            this.isAtBottom =  true ;
            this.loadingMoreMessage =  true ;

            this.isTyping =  false ;
            this.typingUser =  null ;
            this.typingTimeout =  null ;

            this.readReceiptTimer =  null ;
            this.lastSentReadMessageId =  null ;

        },

        resetConversationMessages() {

            this.loading = false ;
            this.hasMore = true ;
            this.page = 1 ;


            this.loaded = false ;
            this.loading_more = false ;

            this.chat_dates = [];

            this.chat_dates_all = [];

            this.chats = [];

            this.today_chats = [];

            this.load_count = 1;
        },

        // ------------------------------------------------------------------
        // Read receipt
        // ------------------------------------------------------------------

        messageReadReceipt() {

            if (!this.chatConversation) { return; }

            if (this.readReceiptTimer) {
                clearTimeout(this.readReceiptTimer);
            }

            this.readReceiptTimer = setTimeout(() => {
                
                emitSecure('message.read', {
                    room_name: this.chatConversation.name,
                    conversationId: this.chatConversation.id,
                    userId: this.chatUser?.id,
                });

                this.readReceiptTimer = null ;

            }, 400);

        },


        // ------------------------------------------------------------------
        // New message
        // ------------------------------------------------------------------

        newMessage(message: ChatMessage) {
 
            message.is_me = message.sender_id === user.value?.id;
 

            if (!this.today_chats.length) {

                this.today_chats = [{
                    date: new Date().toISOString(),
                    messages: [message]
                }];

                // for new conversation
                if(this.chat_dates_all.length==0){
                    this.chat_dates_all = [(new Date()).toISOString()] ;
                }


            } else {

                this.today_chats[0].messages.push(message);

            }

            if (message.sender_id === user.value?.id) {
                this.scrollBottom();
            }

            this.onMessagesScroll();

        },



/* ------------------------------------------------------------------------------ */

    async  getConversation(user_id :string) {


            // reset data 
            this.resetConversationData() ;

            $api(`/chat/get_private_conversation/${user_id}`).then((res :any )=>{

            // console.log("PRIVATE_CONVERSATION:",res.data);

            this.chatConversation = res.data.conversation ;
            this.chatUser =  res.data.user ;

            // join conversation room
            if(res.data.conversation){

                this.joinConversation(user_id) ;

                // mark messages as read
                this.readConversation() ;
            }

        }).catch(error=>{
          console.log(error); 
        });

    },


/* ------------------------- set member last read message ------------------------------ */

    async  readConversation() {
       $api(`chat/read_private_conversation/${this.chatUser.id}`,{ method: 'POST' })
    },

    

/* ------------------------------------------------------------------------------ */

    async  joinConversation(user_id :string) {
        emitSecure('join_private_conversation', { user_id: this.chatUser.id });
        // this.getPrivateConversationChatDates(user_id) ;
    },

/* ------------------------------------------------------------------------------ */

    async leaveConversation(conversation_name :string) {
        
        if(isSocketConnected.value){
           emitSecure('leave_private_conversation', { room_name: conversation_name });
        } 

    },

/* ---------------------------- get chat dates ----------------------------------------- */

    async  getPrivateConversationChatDates(user_id :string) {

      
        $api(`/chat/get_private_conversation/${user_id}/chat_dates`).then((res :any )=>{
       
            this.chat_dates = res.data.chat_dates ;
            this.chat_dates_all = JSON.parse(JSON.stringify(res.data.chat_dates)) ;

            

            //console.log("DATES:",chat_dates); 

            // if(this.chat_dates.length){

                let nbr = this.getIndex(this.max_dates_count);
                let dates = this.chat_dates.splice(0, nbr);

                // load messages of this dates
                this.getPrivateConversationMessages(user_id, dates) ;
                 
            // }
        
         }).catch(error=>{
          console.log(error); 
        });

    },

    
/* ---------------------------- get messages of dates ------------------------------------ */
 

    async  getPrivateConversationMessages(user_id :string , dates :string[]) {


        /* -------------------------------------------------------------------------- */

          const container = this.messagesContainer;

            if (!container) {
                return;
            }

            this.loading_more = true ;


            const oldHeight = container.scrollHeight;
            const oldTop = container.scrollTop;
 

        /* --------------------------------------------------------------------------- */


            let post_data = { dates : dates }

            $api(`chat/get_private_conversation/${user_id}/messages`,{
                method: 'POST',
                body:post_data
            }).then((res :any )=>{

          
            let chats_dates = res.data.messages ;

            if(chats_dates.length){

                let first =  chats_dates[(chats_dates.length-1)] ;
                let is_today = isToday(first.date) ;

                if(this.load_count == 1 && is_today ){
    
                    this.today_chats = [first] ;

                    // push others in chats list
                    chats_dates = chats_dates.filter((item :any)=>item.date !== first.date ) ;
                    this.chats.unshift(...chats_dates) ;
                
                }else{
                    this.chats.unshift(...chats_dates) ;
                }

                // scroll to bottom
                if(this.load_count == 1){

                    setTimeout(()=>{
                        this.scrollBottom() ;
                    },300)
                    
                }else{
    

                    nextTick(() => {

                        const newHeight = container.scrollHeight ;
                        const newTop = oldTop + (newHeight - oldHeight) ; 
                        container.scrollTop =  newTop ;
        
                    });
                    
                
                }

                this.load_count ++ ;
                this.loading_more = false ;


                this.loaded = true ; 
                if(this.count_message<6){

                    this.loadMoreMessages() ;

                }

            }else{
                this.loading_more = false ;
            }
 
        }).catch(error=>{
          console.log(error); 
        }).finally(async ()=>{
            this.loaded = true ; 
        });
    },

/* --------------------------------------------------------------------------- */

        async loadMoreMessages() { 
        
  
            if(this.loading_more){ return ; }
            

            if(this.loaded && this.chat_dates.length){

 
                let nbr = this.getIndex(this.max_dates_count);

                let dates = this.chat_dates.splice(0, nbr);
                 if (dates.length === 0) { 
                    this.loading_more = false ;
                    return; 
                }

 
                this.getPrivateConversationMessages(this.chatUser.id,dates) ;
                
            }

        } ,

/* ---------------------------- send message ---------------------------------------- */

        async sendTextMessage(message_text:string){

            if (message_text.trim().length==0) { return; }

 

            if(this.chatConversation){ // emit new_private_message

                let data = { 
                    conversation_id: this.chatConversation.id ,
                    user_id: this.chatUser.id ,
                    message_parent_id: null ,
                    content : message_text,
                }

                // emit socket
                emitSecure('new_private_message', data) ;

            }  
            
        },

    /* --------------------------------------------------------------------------------- */

        async sendFileMessage(message_text:string , attachment :any){

            this.sendAttachment(message_text,attachment.file)

        },

    /* ---------------------------- upload Document  -------------------------------------------- */

    async sendAttachment(message_content:any ,file : File) {

        const reader = new FileReader();
        const chunkSize = 1024 * 50; // 16KB chunks
        let currentChunk = 0;
        const totalChunks = Math.ceil(file.size / chunkSize);
        const fileId = `${user.value.id}_${Date.now()}`;
    
        // function
        const readNextChunk = () => {

        const start = currentChunk * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        reader.readAsArrayBuffer(chunk);

        }

        // event 
        reader.onload = (e) => {

        const upload_progress = ((currentChunk + 1) / totalChunks) * 100 ;
        
        emitSecure('upload_binary_chunk', {
            fileId,
            chunk: e.target!.result,
            chunkIndex: currentChunk,
            totalChunks,
            fileName: file.name,
            mimetype: file.type,
            
        });
    
        currentChunk++;
        
        if (currentChunk < totalChunks) {
            readNextChunk();
        }else {

            emitSecure('file_chunk_complete', {
                user_id :  this.chatUser.id ,
                fileId :fileId ,
                filetype : 'doc',
                content : message_content?message_content:""
            });
    
        }
        

        };

        readNextChunk();

    },


/* ---------------------------------------------------------------------------------- */
 
    
    /* --------------------------------------------------------------------------------------- */

        setTyping(user: any) {

            this.isTyping = true;
            this.typingUser = user;

            if (this.typingTimeout) {
                clearTimeout(this.typingTimeout);
            }

            this.typingTimeout = setTimeout(() => {

                this.isTyping = false;
                this.typingUser = null;
                this.typingTimeout = null;

            }, 2000);

        } ,

    /* --------------------------------------------------------------------------------------- */

        emitTyping(){
         
            emitSecure('user_typing', {

                room_name: this.chatConversation.name ,
                conversationId : this.chatConversation.id , 
                user: user.value 

            });
        }

    /* --------------------------------------------------------------------------------------- */
    
    });

    return session;
}

 
/* ---------------------------------------------------------------------------------------- */

function openSession(conversationId: string): ChatSession {

    let session = sessions.value[conversationId];

    if (!session) {
        session = createChatSession(conversationId);
        sessions.value[conversationId] = session;
    }

    return session;
}
 

/* ----------------------------------------------------------------------------------------- */


function findSession(  conversationId: string ): ChatSession | null {
    return sessions.value[conversationId] ?? null;
}


/* ----------------------------------------------------------------------------------------- */


    function closeSession(conversationId: string) {


        let session = findSession(conversationId) ;
        if(session){

            session.leaveConversation(session.chatConversation.name) ;
            session.resetConversationData() ;
        
            delete sessions.value[conversationId];
            
        }
        
       
    }


/* ----------------------------------------------------------------------------------------- */


function initSocketListeners() {

    if (realtimeInitialized.value) { return;  }

     realtimeInitialized.value = true;

    //=========================================================================
    // CONNEXION
    //=========================================================================

       // Succès de la connexion // aaa
        socket.on('connect',  () => {

            isSocketConnected.value = true
            console.log('🟢 Socket connectée avec succès')
 
            setTimeout(async ()=>{

                for (const [key, session] of Object.entries(sessions.value)) {

                    console.log("⚖️ session :",session.chatUser.lastname,isSocketConnected.value);
    
                    await session.resetConversationMessages() ;
                    await session.joinConversation(session.chatUser.id) ;

                }

                setTimeout(() => {
                    while(messageQueue.value.length > 0) {

                        const msg = messageQueue.value.shift()
                        if (msg && msg?.data?.content ) {
                            console.log("📨",msg.event,msg.data);
                            socket.emit(msg.event, msg.data)
                        }

                    }
                }, 500);

            },1000)

            
        }) ;
 
        
        // Échec de la connexion (ex: erreur réseau ou token invalide)
        socket.on('connect_error', async (error) => {
            isSocketConnected.value = false
            console.log('❌Échec de la connexion socket :', error.message)
  
        })

        


        // Gestion de la déconnexion inopinée
        socket.on('disconnect', (reason) => {

            isSocketConnected.value = false
        
            // Si le serveur a fermé la connexion de force (ex: kick ou session invalidée)
            if(reason === 'io server disconnect') {
               console.log('🔴Socket déconnectée :server')
            }else{
               console.log('🔴Socket déconnectée :client')
            }


        })
 

    // ================================================================
    // TOKEN EXPIRED
    // ================================================================
    
        socket.on('auth:token:expired', async (data) => {

            console.log("⚠️-------SOCKET EXPIRING------------⚠️");

            if(data?.message?.content){
                console.log("⚠️ new_private_message",data.message);
                handleExpiredSession("new_private_message",data.message)
            }else{
                 console.log("⚠️ other_message",data.message);
                handleExpiredSession()
            }
            
        } );


    // ================================================================
    //LOAD OLD MESSAGES
    // ================================================================

    socket.on('joined_private_conversation', async (message: any) => { 
 

        const session = findSession(message.conversationId);
        if (!session) { return; }

        session.getPrivateConversationChatDates(message.userId) ;
 

    });


    // ================================================================
    // NEW PRIVATE MESSAGE
    // ================================================================
 

    socket.on('new_private_message', async (message: ChatMessage) => { 
 

        const session = findSession(message.conversationId);
        if (!session) { return; }

      
        // append messages
        session.newMessage(message);


        // Le correspondant nous envoie un message
        // et nous sommes actuellement dans la conversation : marquer comme lu

        if (
            message.sender_id !== user.value?.id &&
            document.visibilityState === 'visible' &&
            session.isAtBottom
        ){
            session.messageReadReceipt();
        }

        // chat panel 
        incrementPanelUnread(message.conversationId,message) ;

    });

    // ================================================================
    //   MARQUER COMME LU
    // ================================================================

    socket.on('conversation.read', (data :any) => {

        const session = findSession(data.conversationId);
        if (!session) { return; }

        session.chatConversation.conversationId = data.id ;
        session.chatConversation.lastReadMessageId = data.lastReadMessageId ;
        session.chatConversation.lastReadDate = data.lastReadDate ;   

    });



    // ================================================================
    // ABSENCE PRIVATE MESSAGE
    // ================================================================

    socket.on('new_absence_message', async (message: ChatMessage) => { 
 
        // conversation list
        if(/* !unreadConversationIds.value.includes(message.conversationId) */1){
            badgeCountMessage.value ++ ;
            unreadConversationIds.value.push(message.conversationId)
        }

    });


    // ================================================================
    // TYPING
    // ================================================================


    socket.on('user_typing', (data) => {

        const session = findSession(data.conversationId);

        if (!session) { return; }

        session.isTyping = true ;
        session.typingUser = data.user ;


        // Annule le précédent timeout
        if (session.typingTimeout) {
            clearTimeout(session.typingTimeout);
        }


        // On attend 2 secondes après le dernier événement
        session.typingTimeout = setTimeout(() => {

            session.isTyping = false;
            session.typingUser = null;
            session.typingTimeout = null;

        }, 2000);

    
    });


    // ================================================================
    // MESSAGE READ
    // ================================================================

    socket.on('message.read', (data) => {
 
        const session = findSession(data.conversationId);

        if (!session) {  return; }

        session.chatConversation.lastReadDate = new Date().toISOString() ; 

    });

    // ================================================================
    // UPCOMING RESEVATION
    // ================================================================



    socket.on('upcoming.reservation', (data) => {
  
        const { reservation,showDialog  } = useUpcomingReservation() ;

        reservation.value = data ;
        showDialog() ;


    });

}
 
//============================== / listener ============================================
 

/* ----------------------------------------------------------------------------------------- */
    const openedSessions = computed(() =>
        Object.values(sessions.value)
    );
/* ----------------------------------------------------------------------------------------- */
    const openedSessionsCount = computed(() =>
        Object.keys(sessions.value).length
    );


/* ---------------------------------- PANEL ------------------------------------------------- */

    function openChatPanel(conversation: PanelConversation, screen:any) {

        const userId = conversation.user.id;

        const existing = panelConversations.value.find( item => item.user.id === userId  );

        if (existing){
            existing.minimized = false;
            return;
        }


        // minimize olds
        if(panelConversations.value.length>1){
          // panelConversations.value.map(panelConversation=>panelConversation.minimized = true)
        }

         // close old panels

        switch (screen) { 
            case 'xs': 
            case 'sm': 
                if(panelConversations.value.length>0){
                    const nDerniers = panelConversations.value.splice(-1);
                    for(let panelConversation of nDerniers ){
                        closeSession(panelConversation.conversation.id);
                    }
                }
                break ;
            case 'md': 
                if(panelConversations.value.length>1){
                    const nDerniers = panelConversations.value.splice(-1);
                    for(let panelConversation of nDerniers ){
                        closeSession(panelConversation.conversation.id);
                    }
                }
            break ;
            case 'lg':
                if(panelConversations.value.length>2){
                    const nDerniers = panelConversations.value.splice(-1);
                    for(let panelConversation of nDerniers ){
                        closeSession(panelConversation.conversation.id);
                    }
                }
                break ;
            case 'xl': 
            case 'xxl': 
                if(panelConversations.value.length>3){
                    const nDerniers = panelConversations.value.splice(-1);
                    for(let panelConversation of nDerniers ){
                        closeSession(panelConversation.conversation.id);
                    }
                }
            break ;
        }


        $api(`/chat/get_private_conversation/${userId}`).then((res :any )=>{

            showLoading() ;
            
            // join conversation room
            if(res.data.conversation){

                let session  = openSession(res.data.conversation.id) ;

                session.resetConversationData() ;

                session.chatConversation = res.data.conversation ;
                session.chatUser =  res.data.user ;
                
                // join conversation
                session.joinConversation(userId) ;

                //open panel
                panelConversations.value.unshift({
                    conversation:session.chatConversation,
                    user:session.chatUser,
                    minimized: false,
                    unreadCount: 0,
                });

                // mark messages as read
                session.readConversation() ;
 
            }

        }).catch(error=>{

            showErrorSnackbar({
                title: 'Erreur',
                message: error.message
            }) ;

        }).finally(()=>{
            hideLoading() ;
         });;
 

    }
/* ----------------------------------------------------------------------------------------- */

    function incrementPanelUnread( conversationId: string,  message: any ) {


        // Message envoyé par moi
        if(message.sender_id == user.value?.id){
            return;
        }
 
        const panel = panelConversations.value.find(
            item => item.conversation.id === conversationId
        );
 
        if (!panel) { 
            return; 
        }

        if (panel.minimized) {
            panel.unreadCount++;
        }

    }

/* ----------------------------------------------------------------------------------------- */

  function closeChatPanel(conversationId: string) {

    const index = panelConversations.value.findIndex(item => item.conversation?.id === conversationId);

    if (index === -1) { return;  }

    panelConversations.value.splice(index, 1); 


    // close session
    closeSession(conversationId) ;

  }

/* ----------------------------------------------------------------------------------------- */

 function closeChatPanels(){

    // main messagerie
    if(activeConversation.value){
        closeSession(activeConversation.value.conversation?.id)
    }

    // chat panels
    for(let panelConversation of panelConversations.value){
        closeSession(panelConversation.conversation?.id) ;
    }

    panelConversations.value.length = 0  ; // = []


 }


 
/* ----------------------------------------------------------------------------------------- */


   // ================================================================
    //                  EMIT SECURE
    // ================================================================

     // Fonction d'envoi sécurisée à utiliser dans tes composants
    const emitSecure = (event: string, data: any) => {

        if(isSocketConnected.value){ // Si tout va bien, on envoie direct
            console.log("🟢🟢 Emit socket connecté:",event)
            socket.emit(event, data); 
        }else{

            console.log("🔴🔴 Emit socket déconnecté:",event)
            messageQueue.value.push({ event, data })
            handleExpiredSession() ;

            return ;


        }

    }
 
 
/* -------------------------------------------------------------------------------- */


    // Fonction centralisée pour gérer le refresh et la reconnexion
    const handleExpiredSession = async (failedEvent?: string, failedData?: any) => {

        // Si un refresh est déjà en cours, on met juste le message dans la file et on attend
        if(failedEvent && failedData) {
            messageQueue.value.push({ event: failedEvent, data: failedData })
        }

        /* if(isRefreshing.value) return
        isRefreshing.value = true */

        try {
            console.log("📛Token socket expiré en pleine conversation. Rafraîchissement en cours...")

            // 1. Appel HTTP vers le serveur pour recréer un cookie access_token frais
            /* await $fetch('/auth/refresh_token', {
                baseURL: config.public.apiBaseUrl,
                method: 'POST',
                credentials: 'include',
            }).finally(() => {
                console.log(" 🔰 SOCKET REFRESHED");
            }) */

            await $refreshToken() ; 
        
         
            // 2. On écoute la prochaine reconnexion unique pour vider la file d'attente
            /* socket.once("connect", async () => {

                console.log("✅ Socket reconnecté avec succès ! Envoi des messages en attente...")


                for (const [key, session] of Object.entries(sessions.value)) {

                    console.log("session2 :",session.chatUser.lastname);
                    console.log("⚖️socket2 :",isSocketConnected.value );

                    await session.resetConversationMessages() ;
                    await session.joinConversation(session.chatUser.id) ;

                }


                setTimeout(() => {

                    while(messageQueue.value.length > 0) {

                        const msg = messageQueue.value.shift()
                        if (msg) {
                            console.log("📨",msg.data);
                            
                            socket.emit(msg.event, msg.data)
                        }

                    }

                }, 500);
                 
            }) */

            // 3. On force la reconnexion du socket (qui utilisera automatiquement le nouveau cookie)
             console.log(" 🔰 SOCKET REFRESHED");
             connectSocket() ;

        } catch (error) {

            disconnectSocket() ;
            console.log("Impossible de rafraîchir la session, déconnexion définitive.", error) ;

            const { logout } = useAuth();
            closeChatPanels() ;
            logout();
  
        } finally {
            isRefreshing.value = false
        } 


    }
 
/* ----------------------------------------------------------------------------------------- */

    return {
 
        sessions,
        openedSessions,
        openedSessionsCount,
        findSession ,
        closeSession,

        handleExpiredSession ,
        emitSecure ,

        activeConversation ,
        panelConversations ,

        closeChatPanel ,
        openChatPanel ,
        closeChatPanels,
        
        openSession, 
        createChatSession,
        initSocketListeners,

        ischatContactLoaded ,
        setchatContactLoaded
         
    }



}

