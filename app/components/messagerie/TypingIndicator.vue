<script setup lang="ts">

    const props = defineProps<{
        visible: boolean
        firstname: string|undefined
    }>()  ;


</script>

<template>

    <Transition name="typing">

        <div v-if="visible"
            class="typing-indicator px-4 py-2" >

            <div class="d-flex align-center">
                <!-- <v-avatar
                    size="28"
                    class="mr-3" >
                    <v-icon size="18">
                        mdi-account
                    </v-icon>
                </v-avatar>
               -->
                <div class="bubble">
                    <span class="mr-2">
                        {{ firstname }} est en train d'écrire
                    </span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
                
            </div>

        </div>

    </Transition>

</template>

<style scoped>

    .typing-indicator{
        min-height:44px;
    }

    .bubble{
        display:flex;
        align-items:center;
        background:#f5f5f5;
        border-radius:20px;
        padding:8px 14px;

    }

    .dot{
        width:6px;
        height:6px;
        margin-left:4px;
        border-radius:50%;
        background:#9e9e9e;
        animation: bounce 1.4s infinite;
    }


    .dot:nth-child(3){
        animation-delay:.2s;
    }


    .dot:nth-child(4){
        animation-delay:.4s;
    }


    @keyframes bounce{
        0%,80%,100%{
            transform:translateY(0);
            opacity:.3;
        }

        40%{
            transform:translateY(-4px);
            opacity:1;
        }
    }

    .typing-enter-active,
    .typing-leave-active{
        transition:all .25s ease;
    }

    .typing-enter-from,
    .typing-leave-to{
        opacity:0;
        transform:translateY(10px);
    }

</style>