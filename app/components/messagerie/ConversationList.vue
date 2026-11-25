<script setup lang="ts">

    // components
    import ConversationItem from '~/components/messagerie/ConversationItem.vue';
    import EmptyConversation from '~/components/messagerie/EmptyConversation.vue';


    const { user } = useAuth();

    import { watchDebounced } from '@vueuse/core' ;

    import { useDisplay } from 'vuetify' ;
    const { mobile,smAndDown } = useDisplay() ;


    const { $api } = useNuxtApp() ;
    const { socket } = useSocket();

    const { activeConversation,ischatContactLoaded,setchatContactLoaded  } = useChat() ;

    const { getUnredConcersations,isUnReadConnversation ,readConnversation } = usePresence() ;

    const { badgeCountMessage } = useNotifications() ; 


   

    
    // loading
    let loaded = ref(false) ; 
    let loading = ref(false) ; 
    let loading2 = ref(false) ; 

    // pagination
    let page = ref(1) ;
    let per_page = ref(20) ;
    const hasMore = ref(false) ;
    let count_conversations = ref(0) ; 


    const conversations = ref<any[]>([])


/* --------------------------------------------------------------------------- */

    async function ConversationSelected(conversation :any){
 
        const conversationId = conversation.conversation.id ;
        // set active conversation
        activeConversation.value = conversation ;

        // badge count
        if(isUnReadConnversation(conversationId)){
            badgeCountMessage.value -- ;
        }
        

        // mark ad read
        readConnversation(conversationId) ;

        
        await nextTick()  ;

    }

/* ------------------------------------------------------------------------ */


 const backToEspace = ()=>{
     
      if(user.value.role == Role.COACH ){
          navigateTo('/espace-coach')
      }else if(user.value.role == Role.USER ){
          navigateTo('/espace-client')
      }else{
        navigateTo('/')
      }
}


/* ---------------------- search ------------------------------------ */

   const search = ref('') ;
 

   const searchTextChange = (value :any) => {
         search.value= "" ;
         searchValidate() ;
   };


/* --------------------------------------------------------------------------- */


   const searchValidate= () => {
          
        page.value =  1 ;
        conversations.value = [] ;

        loading.value = true ;
        hasMore.value = true ;

        getContactsPagination() ;
         
   };

   
/* --------------------------------------------------------------------------- */

   watchDebounced(search, (value, oldValue) => {

        const wasSearching = oldValue.length >= 3
        const isSearching = value.length >= 3
 
        console.log("wasSearching",wasSearching);
        console.log("isSearching",isSearching);
        console.log("search",value);
        
        // recherche
        if (isSearching) {
            searchValidate()
            return
        }

        // sortie du mode recherche
        if (!wasSearching && value.length === 0) {
            searchValidate()
        }

    }, {
        debounce: 400
    })

 
/* ---------------------------------------------------------------------- */

     function loadMoreConversations(){
        
        if(loading.value || !hasMore.value){
            return
        }
        
        // page & per_page
        page.value =  page.value+1 ;
        hasMore.value = true ;
        getContactsPagination() ;


      }

/* ----------------------------------------------------------------------- */

   const sleep = (ms :number) => new Promise(resolve => setTimeout(resolve, ms));

    async function getContactsPagination(){ 

        setchatContactLoaded(false)  ;

        let base_url = `chat/get_users_contacts?`
        let url_sufix = '' ;

        // search
        if(search.value.length>2){
           url_sufix = url_sufix+`&search=${search.value}` ;
        }

        // page & per_page
         url_sufix = url_sufix+`&page=${page.value}&per_page=${per_page.value}` ;

        // complete url
        let url = base_url+url_sufix ;

       
        $api(url,{ method: 'GET', }).then( async (res :any) =>{

            if(res.data.contacts && Array.isArray(res.data.contacts) && res.data.contacts.length>0){
                conversations.value.push(...res.data.contacts); 
            }

            // load more
            count_conversations.value = res.data.total ;
            if(count_conversations.value <= per_page.value*page.value){
                hasMore.value = false ;
            }
 
            // select the first 
            if( page.value== 1 && 
                conversations.value.length>0 &&
                !smAndDown.value){
                
                ConversationSelected(conversations.value[0]) ;
                
            }

            console.log("CONTACTS:", conversations.value );


        }).catch(error=>{
            console.log("Error:",error); 
         }).finally(()=>{

            loaded.value = true  ;
            loading.value = false  ;
            loading2.value = false  ;
            setchatContactLoaded(true)  ;
        })


    }
 

/* ---------------------------- sentinel ----------------------------------------------- */

    // scroll when reached 
    let  observer :any ;
    const sentinel = ref<HTMLElement>()  

    watch(sentinel, (el) => {
        if (!el) return
        observer.observe(el)
    })

    onBeforeUnmount(() => {
        observer?.disconnect()
    })


/* ---------------------------------- socket ---------------------------------------------  */

    const registerSocketListeners = ()=> {

        socket.on('conversation.read', (data :any) => {

            // conversation read
            let existing = conversations.value.find(
                  c => c.conversation.id === data.id
            );
 
            if(existing){
                existing.conversation  = data ;
            }

             

 
        });
 

    }

/* ----------------------------- MOUNTED ------------------------------------ */

   onMounted(async ()=>{

       

        // scroll observer
        observer = new IntersectionObserver(async ([entry]) => {
            if (entry?.isIntersecting) {
                loadMoreConversations() ;
            }
        }) ;

        await getUnredConcersations() ;
        
        // register socket events
        registerSocketListeners() ;

        // load conversations
        getContactsPagination() ;


   });


</script>

<template>
    <div>
          
        <v-skeleton-loader v-if="!loaded"
            v-for="value in [1,2]"  type="image, article" />

        <div v-if="loaded" class="page_contant">

            <!-- <EmptyConversation v-if="loaded && !conversations.length" /> -->

            <v-card v-if="loaded"  class="chat_view" elevation="0" >

                <!-- search -->
                <div class="px-2 pb-2 pt-2">
                        <v-text-field
                            :loading="false"
                            prepend-inner-icon="mdi-magnify"
                            density="compact"
                            label="Chercher"
                            variant="outlined"
                            hide-details
                            single-line 
                            v-model="search" >

                            <template #append-inner >
                                <v-icon v-if="search.length>0" color="dark" 
                                    icon="mdi-close-circle-outline"
                                    @click="searchTextChange">
                                </v-icon>
                            </template>

                        </v-text-field>
                    </div>
                    <v-divider> </v-divider>

                <!-- search -->

            <div v-if="loading">
                <v-skeleton-loader v-for="item in [1,2]"  type="image, article" />
            </div>

            <div v-else class="parent-container">
                <EmptyConversation v-if="!conversations.length"   />

                <!-- conversation list -->
                    <div v-else class="conversation-list" >
                        
                        <v-list lines="two" >
                            <ConversationItem v-for="conversation in conversations" :key="conversation.id"
                                :conversation="conversation"
                                @select="ConversationSelected" />
                        </v-list>
                    
                        <div v-if="hasMore"  class="text-center py-4" >
                            <v-progress-circular indeterminate color="secondary" />
                        </div>

                        <div ref="sentinel" class="sentinel" > &nbsp; </div>
                    
                    </div>
                <!-- conversation list -->

            </div>

        </v-card>
        
    </div>

  </div>
</template>

<style lang="css" scoped>

    .sentinel{
        height: 50px;
     }

    .parent-container {
        height: 100%;  
        display: flex;
        flex-direction: column;
        overflow: hidden;  
    }

    .conversation-list{
        height: 100%;
        overflow-y: auto;
        min-height:0;
        padding: 10px;
        box-sizing: border-box;
    }

    .chat_view{
        height: calc(100vh - 104px) ;
        border-radius: 4px ;
        border : 1px solid #ddd ;
    }
 
     @media (max-width: 839px){
        .chat_view{
          height: calc(100vh - 82px) ;
          border-radius: 0px ;
         }
 
    }

</style>