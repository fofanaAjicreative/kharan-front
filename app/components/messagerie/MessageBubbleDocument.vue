<script setup lang="ts">
import { getFileIcon } from '~/utils/date'

const {  showSuccessSnackbar,showWarningSnackbar, showErrorSnackbar } = useSnackbar() ;
const { $api } = useNuxtApp() ;


    interface Message {
        sender_id: string
        is_me: boolean
        fullname: string
        content: string
        content_type: string
        date: string |Date  ,
        read_status: string,
        file: MessageFile
    }


    export interface MessageFile {
        id: string
        filename: string
        filesize: number
        mimetype: string
        aws_path: string
    }


    // timeZone
    const { getUserTimeZone } = useAuth()
    const timeZone =  getUserTimeZone()
     
/* ---------------------------- props ----------------------------------------------- */  

    const props = defineProps<{
        message: Message
        mine: boolean ,
        conversation : any
    }>()

/* ------------------------------------------------------------------------- */

    const time = computed(() => {
        return new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: timeZone
        }).format(new Date(props.message.date))

    })


/* ---------------------------------------------------------------------- */

    function formatSize(size: number) {
        if (size < 1024 * 1024){
            return `${Math.round(size / 1024)} Ko`
        }
        return `${(size / 1024 / 1024).toFixed(2)} Mo`
    }


/* ---------------------------- Download ------------------------------------------------------ */
   
    const imageUrl = ref('')

    async function downloadAttachment(attachment_id :string) {

        try {
            // Récupérer le fichier sous forme de Blob
            const blob :any = await $api(`/chat/attachments/${attachment_id}`, {
              responseType: 'blob',
            })

            // Créer un lien temporaire pour déclencher le téléchargement
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = props.message.file.filename
            document.body.appendChild(a)
            a.click()
            
            // Nettoyage
            window.URL.revokeObjectURL(url)
            a.remove()
        } catch (error :any) {
                showErrorSnackbar({
                    title: 'Erreur',
                    message: error.message
                }) ;
        }


    }

/* -------------------------------------------------------------------------- */
    onMounted(async () => {

        const blob :any = await $api(`/chat/attachments/${props.message.file?.id}`, 
        { responseType: 'blob' })
        
        imageUrl.value = URL.createObjectURL(blob) ;
    })

    onUnmounted(() => {
        if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
    })


</script>

<template>

    <div v-if="message.file"
        class="message-row"
        :class="{ mine }" >

      <div
        class="bubble"
        :class="{ mine }" >

        <div
            v-if="message.content"
            class="message-text mb-3"  >
            {{ message.content }}
        </div>

         <div v-if="message.file?.mimetype.includes('image')" 
           class="d-flex justify-start file_container">

            <!-- image  -->
            <v-card
                elevation="0"
                color="#eee"
                class="mb-2 image_card" >

                <v-card-text class="pa-0" >

                    <v-avatar size="200" rounded="0" class="profile-avatar" >
                        <v-img
                            :src="imageUrl"
                            cover
                        />
                    </v-avatar>
                    
                    <div class="d-flex justify-space-between align-center">
                        
                        <div class="ml-3 flex-gro-1">
                            <div class="font-weight-medium">
                                {{ message.file.filename }}
                            </div>
                            <div class="text-caption">
                                {{ formatSize(message.file?.filesize) }}
                            </div>
                        </div>

                        <v-btn
                            icon="mdi-download"
                            variant="text"
                            @click="downloadAttachment(message.file.id)" />
                    </div>
                </v-card-text>
            </v-card>

         </div>

        <!-- documents -->
        <v-card v-else
            variant="tonal"
            rounded="lg"
            class="mb-2" >

            <v-card-text>
                <div class="d-flex  align-center">
                    <v-icon
                        :icon="getFileIcon(message.file.mimetype)"
                        color=""
                        size="42" />

                    <div class="ml-3 flex-grow-1">
                        <div class="font-weight-medium">
                            {{ message.file.filename }}
                        </div>
                        <div class="text-caption">
                            {{ formatSize(message.file?.filesize) }}
                        </div>
                    </div>

                    <v-btn
                        icon="mdi-download"
                        variant="text"
                        @click="downloadAttachment(message.file.id)" />
                </div>
            </v-card-text>
        </v-card>

         <!-- vu -->
            <div class="message-footer" >
                <span> {{ time }} </span>
                 
                <template v-if="mine">

                    <v-icon
                        v-if="message.date <= conversation?.lastReadDate"
                        size="15"
                        class="ml-1"
                        icon="mdi-check-all"
                        color="white" >
                    </v-icon>
                    <v-icon
                        v-else
                        size="15"
                        class="ml-1"
                        icon="mdi-check"
                        color="grey" >
                    </v-icon>
                     
                </template>
            </div>
        <!-- /vu -->

    </div>

</div>

</template>

<style scoped lang="scss">

    .message-row{
        display:flex;
        margin-bottom:10px;
    }

    .message-row.mine{
        justify-content:flex-end;
    }

    .bubble{
        max-width:80%;
        padding:12px 14px;
        border-radius:8px;
        background:#eef5ff;
        box-shadow: 0 2px 8px rgba(0,0,0,.05);

    }

    .bubble.mine{
        background: $info-color ;
        color:#FFF;

        .file_container{
            justify-content: end;
        }
    }
    

    .message-text{
        white-space:pre-wrap;
        word-break:break-word;
        line-height:1.55;
    }

    .message-footer{
        display:flex;
        justify-content:flex-end;
        align-items:center;
        margin-top:8px;
        font-size:12px;
        opacity:.8;
    }

    .image_card{
        max-width: 200px;
    }

</style>