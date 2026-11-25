
<script setup lang="ts">


/* ------------------------------- props----------------------------------------------- */

    const selectedTags = defineModel<any[]>({
      required: true
    })
 
  
    const props = defineProps<{
        tags: any[] ,
        title : string ,
        placeholder : string ,
        loading : boolean ,
        }>()


    const emit = defineEmits(['saveTag']) ;

/* ------------------------------------------------------------------------------ */

   const server_error = ref(false) ;
   const server_error_message = ref("") ;

    const search = ref('')
 
    const filteredTags = computed(() => {

        if(!search.value) return props.tags ;
 
        const filtred =  props.tags.filter(tag => {
           return  tag.name.toLowerCase().includes(search.value.toLowerCase())
        }) 

        return filtred ;
    })

/* ------------------------------------------------------------------------------ */

    function createTag(){
        if(!search.value.length) return ;
        emit('saveTag', search.value)
    }


/* --------------------------- expose --------------------------------------------------- */

    function dataSaved() {
        search.value = "" ;
    }

    function serverError(error :string) {
        server_error.value = true ;
        server_error_message.value = error ;
    }

    defineExpose({
        dataSaved , serverError
    });

/* ------------------------------------------------------------------------------ */


</script>



<template>

  <v-autocomplete
    v-model="selectedTags"
    v-model:search="search"
    :items="filteredTags"
    item-title="name"
    item-value="id"
    multiple
    chips
    closable-chips
    :clearable="false"
    variant="outlined"
    :label="title"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-tag-multiple"
    no-filter >

   <template v-slot:chip="{ props, item }">
        <v-chip v-bind="props" >
            <template v-slot:prepend>
                <v-icon v-if="!item.enabled"
                   start icon="mdi-pause" color="warning"></v-icon>
            </template>
            {{ item.name }}
        </v-chip>
    </template>

    <template #item="{ props, item }">
        <v-list-item
              v-bind="props" 
              :subtitle="item.enabled?'':'En attente de validation'"
              :title="item.name"
              >
            <template #append>
                <v-icon v-if="!item.enabled"
                    icon="mdi-pause-circle"
                    color="warning" />
            </template>
        </v-list-item>
    </template>

    <template #no-data>

        <div class="pa-4 text-center">

            <v-icon 
              icon="mdi-tag-search"
              size="42" 
              color="grey" 
              class="mb-2" >
            </v-icon>
            
            <div class="text-subtitle-2"> Aucun donnée trouvé </div>
            <div class="text-caption text-medium-emphasis mb-1"> Vous pouvez créer un nouveau. </div>
            <div class="text-caption text-medium-emphasis mb-4 text-info"> Il doit être validé par l'administrateur. </div>

            <v-btn
                color="secondary"
                variant="flat"
                :loading="loading"
                prepend-icon="mdi-plus"
                @click="createTag" >
                Créer "{{ search }}"  
            </v-btn>

            <v-alert v-if="server_error"
                class="mt" color="warning" density="compact" variant="tonal"
                icon="mdi-alert-circle-outline">
                <template #prepend>
                <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                </template>  {{ server_error_message }}
            </v-alert>

        </div>

    </template>

 </v-autocomplete>

</template>
