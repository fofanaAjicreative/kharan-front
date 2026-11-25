<script setup lang="ts">

    export interface Attachment {
        id: string
        file: File
        preview?: string ,

        progress: number,
        uploading: boolean ,
        uploaded: boolean ,
        error: boolean ,
    }

    const model = defineModel<Attachment>({
        required: true
    })

    const emit = defineEmits<{
        remove:[Attachment]
    }>()


 
 /* -------------------------------------------------------------------------------- */   


    function isImage(file: File){
        return file.type.startsWith("image/")
    }

    function removeAttachment(item: Attachment){
        emit("remove", item)
    }

/* ------------------------------------------------------------------------------- */

    function getFileIcon(file: File) {

        if (file.type === "application/pdf")
            return "mdi-file-pdf-box"

        if (file.type.includes("word"))
            return "mdi-file-word"

        if (file.type.includes("excel") || file.name.endsWith(".xlsx"))
            return "mdi-file-excel"

        if (file.type.includes("powerpoint"))
            return "mdi-file-powerpoint"

        return "mdi-file-document-outline"
    }
 
/* ---------------------------------------------------------------------- */

    function formatSize(size: number) {
        if (size < 1024 * 1024){
            return `${(size / 1024).toFixed(1)} Ko`
        }
        return `${(size / 1024 / 1024).toFixed(2)} Mo`
    }

/* ---------------------------------------------------------------------- */

</script>

<template>

 <div v-if="model" class="attachments" >

           <v-card v-if="isImage(model.file)"
                rounded="6"
                max-width="100"
                max-height="120"
                border  elevation="0" >

                <v-img
                    :src="model.preview"
                    height="120"
                    cover />

                <v-btn
                    icon
                    size="25"
                    color="red"
                    class="remove-btn"
                    @click="removeAttachment(model)" >
                    <v-icon icon="mdi-close" size="small"> </v-icon>
                </v-btn>

            </v-card>

            <!-- DOCUMENT -->

            <v-card
                v-else
                rounded="4"
                max-width="260"
                max-height="80"
                border elevation="0"
                color="#eee"
                class="pa-2" >

                <div class="d-flex align-center">

                    <v-icon
                        :icon="getFileIcon(model.file)"
                        size="38"
                        color="secondary" >
                    </v-icon>

                    <div class="ml-3">
                        <span class="font-weight-medium">
                            {{ model.file.name }}
                        </span>
                        <div class="text-caption text-medium-emphasis">
                            {{ formatSize(model.file.size) }}
                        </div>
                    </div>

                   
                </div>

                    <v-btn
                        icon
                        size="25"
                        color="red"
                        class="remove-btn"
                        @click="removeAttachment(model)" >
                        <v-icon icon="mdi-close"> </v-icon>
                    </v-btn>
            </v-card>


            <div  :class="isImage(model.file)? 'image_progress' : 'document_progress'"
                   class="d-flex flex-column align-center" > 
                   
                <v-progress-linear
                    v-if="model.progress>0"
                    :model-value="model.progress"
                    color="secondary"
                    height="10"
                    rounded="4"
                    class="mt-3" />

                 <v-chip v-if="model.progress >= 90"
                    class="mt-2"
                    size="small"
                    color="secondary"  >
                    Finalisation...
                </v-chip>

            </div>


     
</div>

</template>


<style scoped>

    .attachments{
        padding:12px 6px;
    }

    .remove-btn{
        position:absolute;
        top:2px;
        right:2px;
    }

    .image_progress{
        max-width: 100px;
    }

    .document_progress{
        max-width: 260px;
    }

</style>