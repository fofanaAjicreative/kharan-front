<script setup lang="ts">

    import AttachmentPreview from '~/components/messagerie/AttachmentPreview.vue' ;
    import type { Attachment } from './AttachmentPreview.vue';
    import TypingIndicator from '~/components/messagerie/TypingIndicator.vue';

    const { showErrorSnackbar } = useSnackbar() ;
    const { socket, connectSocket ,  isSocketConnected } = useSocket() ;
   

    const {  findSession } = useChat() ;
 
    

    /* ----------------------- props -------------------------------------------------------------- */

        const { conversationId} = defineProps({
 
            conversationId: {
                type:String ,
                required :true ,
            }

        });

        const session = computed(() => {  return findSession(conversationId); });

    /* ---------------------------------------------------------------------------- */

        const emit = defineEmits<{
            sendText:[string] ,
            sendFile:[string,any] ,
        }>()

    /* ----------------------------------------------------------------------------- */

    const fileInput = ref<HTMLInputElement | null>(null);
    const message = ref<String>("") ;
    const sending = ref(false) ;


   /* ------------------------------------------------------------------------------- */

   const ALLOWED_MIME_TYPES = [
    // PDF
    'application/pdf',

    // Microsoft Word
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

    // Excel
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

    // PowerPoint
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',

    // Texte
    'text/plain',
    'application/rtf',

    // OpenDocument
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',

    // Audio
    'audio/mpeg',      // MP3
    'audio/wav',       // WAV
    'audio/ogg',       // OGG Audio
    'audio/x-m4a',     // M4A
    'audio/mp4',       // MP4 Audio

    // Vidéo
    'video/mp4',       // MP4 Vidéo
    'video/webm',      // WebM
    'video/ogg',       // OGG Vidéo
    'video/quicktime', // MOV (Apple)
    'video/x-msvideo'  // AVI
  ];
    
    const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 Mo


    
/* ---------------------------------------------------------------------- */

    const canSend = computed(() =>
        message.value.trim().length > 0 ||attachment.value
    )

/* ---------------------------------------------------------------------- */

    async function sendMessage(){
        
        if(!canSend.value)  return

        sending.value = true

        if(attachment.value){
            emit("sendFile", message.value.trim() , attachment.value)
        }else{
            emit("sendText", message.value.trim())
        }
        
        message.value = "" ;
        await nextTick()  ;
        sending.value = false ;
        
    }

/* ------------------------------------------------------------------------------- */

    function onKeydown(e: KeyboardEvent){
        if( e.key==="Enter" && !e.shiftKey ){
            e.preventDefault()
            sendMessage()
        }
    }


/* ----------------------  Attachment ------------------------------------------ */

  
    const attachment = ref<Attachment|null>(null) ;

    function removeAttachment(item: any){
        attachment.value = null ;
        resetFileInput() ;
    }


    function setAttachmentProgress(progress: any){

        if(attachment.value){
            attachment.value.progress = Number(progress) ;
        }
       
    }

 
/*---------------------------------------------------------------------------------*/

    async function onFilesSelected(event: Event) {

        
            const input = event.target as HTMLInputElement

            if (!input.files?.length) return

            const file = input.files[0] ;
            if (!file) return
 
            const isImage = file.type.startsWith('image/')

           /*  if (!isImage && !isAllowedDocument) {
                
                showErrorSnackbar({
                    title: 'Fichier joint',
                    message: 'Type de fichier non autorisé'
                }) ;

                return
            } */

            if (file.size > MAX_FILE_SIZE) {
                showErrorSnackbar({
                    title: 'Fichier joint',
                    message: 'Le fichier est trop volumineux (Max: 20 Mo)'
                }) ;
                return
            }

            attachment.value = {
                id: crypto.randomUUID(),
                file,
                preview: isImage ? URL.createObjectURL(file) : undefined,
                progress: 0,
                uploading: true,
                uploaded: false,
                error: false,
            }
    }


/* ---------------------------  typing  ---------------------------------------------- */


    let typing = false
    let emit_timeout: ReturnType<typeof setTimeout>

    function onTyping() {

        // Ne rien envoyer si le champ est vide
        if (!message.value.trim()) { return }
        

        if(!typing) {
            typing = true ;
            session.value?.emitTyping() ; 
        }

        clearTimeout(emit_timeout)

        emit_timeout = setTimeout(() => {
            typing = false
        }, 1500)
    }
    


/* ---------------------------- SOCKET EVENT LISTNERS  --------------------------- */


    socket.on('file_upload_progress', (data: any) => {
        setAttachmentProgress(data.progress)
    });

    socket.on('file_upload_complete', (data: any) => {
        removeAttachment(data) ;
    });

    socket.on('upload_error', (data: any) => {
       
        showErrorSnackbar({
            title: 'Erreur',
            message: "Une ereur s'est produite. veuillez recommencer/"
        }) ;

        setTimeout(()=>{ 
            removeAttachment(data) ;
        },2000)

    });
    

/* ----------------------------------------------------------------------------- */


function resetFileInput() {
    if (fileInput.value) {
        fileInput.value.value = '';
    }
}


 /* -------------------------------------------------------------------------------- */

    onMounted(()=>{
    
        
    })

/* -------------------------------------------------------------------------------- */

    onUnmounted(() => {
         
    })
   
  

</script>

<template>

    <v-card v-if="session"
        elevation="0" class="pa-2 no_border" >

        <TypingIndicator  
            :visible="session.isTyping"
            :firstname="session.typingUser?.firstName" />


        <AttachmentPreview
            v-if="attachment"
            v-model="attachment" 
            @remove="removeAttachment"  />

    <!-- <v-divider  v-if="attachment" class="mb-2 mt-2"/> -->

    <div class="d-flex align-center" >
        

       <!--  <v-menu>
            <template #activator="{ props }">
                <v-btn
                    icon="mdi-paperclip"
                    variant="text"
                    size="small" 
                    v-bind="props"
                />
            </template>

            <v-list>
                <v-list-item @click="selectImages">
                    <template #prepend>
                        <v-icon>mdi-image</v-icon>
                    </template>
                    Images
                </v-list-item>

                <v-list-item @click="selectDocuments">
                    <template #prepend>
                        <v-icon>mdi-file-document</v-icon>
                    </template>
                    Documents
                </v-list-item>
            </v-list>
        </v-menu> -->
    

        <input
            ref="fileInput"
            type="file"
            hidden
            multiple="false"
            @change="onFilesSelected"
        />

        <v-btn
            icon="mdi-paperclip"
            variant="text"
            size="small" 
            @click="fileInput?.click()"
            >
        </v-btn>
       
        <v-textarea
            v-model="message"
            color="#eee"
            class="mx-2 message_input "
            auto-grow
            rows="1"
            max-rows="6"
            variant="outlined"
            hide-details
            single-line 
            rounded="xl"
            density="comfortable"
            placeholder="Message..."
            @keydown="onKeydown"
            @update:modelValue="onTyping"
        />

         <!-- <v-btn
            icon="mdi-emoticon-outline"
            variant="text"
            size="small" >
        </v-btn> -->


        <v-btn
            v-if="canSend"
            icon
            color="secondary"
            :loading="sending"
            @click="sendMessage">

            <v-icon> mdi-send </v-icon>
        </v-btn>

        <!-- <v-btn v-else
            icon
            variant="text" >
        <v-icon> mdi-microphone-outline </v-icon>
        </v-btn> -->
    </div>

 </v-card>

</template>

<style scoped lang="scss">

    .no_border{
        border :0px ;
    }

   
</style>