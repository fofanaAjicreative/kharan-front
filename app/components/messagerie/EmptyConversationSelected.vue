<script setup lang="ts">

    const emit = defineEmits<{
        newConversation: []
    }>()

</script>

<template>
    <v-card  class="chat_view" elevation="0">
        <v-sheet
            class="fill-height d-flex flex-column align-center 
            justify-center text-center pa-8"
            color="transparent" >

            <v-avatar
                size="120"
                color="info"
                variant="tonal"
                class="mb-6" >

                <v-icon
                    icon="mdi-message-outline"
                    size="74" >
                </v-icon>
            </v-avatar>

            <h2 class="text-h6 font-weight-bold mb-2">
               Selectionnez une concersation
            </h2>
 

        </v-sheet>
    </v-card>
</template>

<style lang="scss" scoped>

    .chat_view{
        height: calc(100vh - 110px) ;
        border-radius: 8px ;
        border : 1px solid #ddd ;
    }

</style>