<script setup lang="ts">

 
    export interface Message {
        sender_id: string
        is_me: boolean
        fullname: string
        content: string
        content_type: string
        date: string |Date  ,
        read_status: string,
        file?: Object | null
    }

    // timeZone
    const { getUserTimeZone } = useAuth()
    const timeZone =  getUserTimeZone()

/* --------------------------------  pros -------------------------------------- */

    const { conversation ,message , mine } = defineProps({

        message: {
            type: Object,
            required: true
        },
        mine: {
            type: Boolean,
            required: true
        },
        conversation : {
            type: Object,
            required: true
        }
    })

   
    const time = computed(() => {
        return new Intl.DateTimeFormat("fr-FR",{
            hour:"2-digit",
            minute:"2-digit",
            hour12: false,
            timeZone: timeZone
        }).format(new Date(message.date))
    })


/* --------------------------------------------------------------------------------------- */

    onMounted( ()=>{

    })

 
/* --------------------------------------------------------------------------------------  */
 

</script>


<template>

    <div class="message-row" :class="{ mine }" >
        <div class="bubble" :class="{ mine }" >
            <div class="message-text">
                {{ message.content }}
             </div>

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
        border-radius:14px;
        background:#eef5ff;
        // box-shadow: 0 2px 8px rgba(0,0,0,.09);

    }

   

    .bubble.mine{
        background: $info-color;
        color:white;
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

</style>