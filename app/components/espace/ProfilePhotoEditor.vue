<script setup lang="ts">

const { confirm } = useConfirm() ;
const {  showWarningSnackbar } = useSnackbar() ;


/* ---------------------------- props ----------------------------------------- */

    const props = defineProps<{
        modelValue?: string | null
        size?: number
        loading?: boolean
    }>()


    const emit = defineEmits<{
        'update:modelValue': [value: string | null]
        'change': [file: File]
        'delete': []
    }>()


/* ---------------------------- / props ----------------------------------------- */


const fileInput = ref<HTMLInputElement | null>(null)

const preview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const hasPhoto = computed(() => {
    return !!props.modelValue
})

const imageSrc = computed(() => {
    return preview.value || props.modelValue || undefined
})

 

// --------------------------------------------------
// Ouvrir le sélecteur de fichier
// --------------------------------------------------

function openFilePicker() {
    fileInput.value?.click()
}


// --------------------------------------------------
// Sélection d'une nouvelle image
// --------------------------------------------------

function onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement

    const file = input.files?.[0]

    if (!file) {
        return
    }


    // Vérification du type
    if (!file.type.startsWith('image/')) {

        showWarningSnackbar({
            title: 'Fichier',
            message: 'Veuillez selectionner un fichier image valide.'
        }) ;

        return ;

    }


    // Exemple : maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {

         showWarningSnackbar({
            title: 'Fichier',
            message: 'Le fichier est trop volumineux (5MB max)'
        }) ;

        return ;
    }


    selectedFile.value = file


    // Création du preview
    if (preview.value) {
        URL.revokeObjectURL(preview.value)
    }


    preview.value = URL.createObjectURL(file)


}

/* ----------------------------------------------------------------------------- */


function resetFileInput() {
    if (fileInput.value) {
        fileInput.value.value = '';
    }
}

// --------------------------------------------------
// Supprimer la photo
// --------------------------------------------------

function cancelPhoto() {

    if (preview.value) {
        URL.revokeObjectURL(preview.value)
    }

    preview.value = null
    selectedFile.value = null
    resetFileInput() ;
}

defineExpose({ cancelPhoto });


// --------------------------------------------------------------------------

    async function deletePhoto() {


      const accepted = await confirm({
        title: 'Supprimer',
        text: 'Voulez-vous vraiment supprimer ?'
      })
      
      if (!accepted) { return } 



        if(preview.value) {
            URL.revokeObjectURL(preview.value)
        }

        preview.value = null
        selectedFile.value = null

        emit('delete')
    }

// --------------------------------------------------------------------------


    function savePhoto() {

        if (!selectedFile.value) {
            return ;
        }
    
        emit('change', selectedFile.value) ;

    }

    


// --------------------------------------------------
// Nettoyage
// --------------------------------------------------

onBeforeUnmount(() => {

    if (preview.value) {
        URL.revokeObjectURL(preview.value)
    }

})

</script>


<template>

    <div class="o-ediprofile-phottor mb-4">

        <!-- Photo -->
        <v-avatar
            :size="size || 280"
            rounded="4"
            class="profile-avatar"
        >

            <v-img
                v-if="imageSrc"
                :src="imageSrc"
                cover
            />

             <v-img
                v-else
                :src="'/images/profile.png'"
                cover
            />

            
        </v-avatar>


        <!-- Boutons -->
        <div class="d-flex ga-2 mt-4 justify-space-betweenn">

            <!-- Ajouter -->
            <v-btn
                v-if="!hasPhoto && !preview"
                color="secondary"
                variant="outlined"
                prepend-icon="mdi-file-image-plus"
                :loading="loading"
                 width="280"
                @click="openFilePicker" >
                Ajouter
            </v-btn>


            <!-- Modifier -->
            <v-btn
                v-if="hasPhoto && !preview"
                color="secondary"
                variant="outlined"
                prepend-icon="mdi-pencil"
                :loading="loading"
                width="135"
                @click="openFilePicker"  >
                Modifier
            </v-btn>


            <!-- Supprimer -->
            <v-btn
                v-if="hasPhoto && !preview"
                color="error"
                variant="flat"
                prepend-icon="mdi-delete"
                :loading="loading"
                width="135"
                @click="deletePhoto" >
                Supprimer
            </v-btn>


            <!-- cancel -->
            <v-btn
                v-if="preview"
                color="#eee"
                variant="flat"
                width="135"
                @click="cancelPhoto()" >
                Annuler
            </v-btn>

            <!-- Save -->
            <v-btn
                v-if="preview"
                color="secondary"
                variant="flat"
                append-icon="mdi-check-circle"
                :loading="loading"
                width="135"
                @click="savePhoto()" >
                Enrégistrer
            </v-btn>

        </div>


        <!-- Input caché -->
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            hidden
            @change="onFileSelected"
        />

    </div>

</template>