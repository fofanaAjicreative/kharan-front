<script setup lang="ts">

/* --------------------------------------  pros ------------------------------------------ */


        const props = defineProps({
            tab: {
                type: String,
                required: true
            }
        });

        const emit = defineEmits(['filter']);


/* ------------------------------------------------------------------------------- */


    const selectedSort = ref('') ;
    const selectedStatus = ref('') ;
    const search = ref('') ;

  /* ----------------------------------- status -------------------------------------------------- */

    const status = [
        { title: 'Tous', value: '' },
        { title: 'En attente', value: 'waiting' },
        { title: 'Confirmé', value: 'confirmed' },
        { title: 'Annulé', value: 'canceled' },
        { title: 'Rejeté', value: 'rejected' },
        { title: 'Terminé', value: 'completed' },
        
    ]


    function statusChanged(){
        filterChanged()
    }


  /* ----------------------------------- sort -------------------------------------------------- */

    const sortOptions = [
        { label: 'Par defaut', value: '' },
        { label: 'Plus récents', value: 'booking_date_start-DESC' },
        { label: 'Plus anciens', value: 'booking_date_start-ASC' }
    ] ;

    const selectedSortLabel = computed( () =>{
        const selected  = sortOptions.find(item=>item.value == selectedSort.value ) ;
        return selected?.label ;
    });


    const sortChanged = (value :any) => {
        selectedSort.value = value  ;
        filterChanged() ;
    };


  /* -------------------------------------  search---------------------------------------------- */

        const clearSearch = () => {
          search.value= "" ;
          filterChanged() ;
        };

        watchDebounced(search, (value, oldValue) => {

              const wasSearching = oldValue.length >= 3
              const isSearching = value.length >= 3


              // recherche
              if (isSearching) {
                  filterChanged()
                  return
              }

              // sortie du mode recherche
              if (!wasSearching && value.length === 0) {
                  filterChanged()
              }

          }, {
              debounce: 400
          })

/* ------------------------------------------------------------------------------- */

 
 
    const filterChanged= () => {

        const filter = {
            search : search.value ,
            status : selectedStatus.value ,
            sort : selectedSort.value ,
        }

        emit('filter', { tab: props.tab, filter :filter });

    };

/* ------------------------------------------------------------------------------- */


</script>


<template>
     
  <div class="main_content">  
     <!-- filter -->
    <v-row class="mb-2">

        <!-- search -->
        <v-col cols="12" md="6">
            

        <v-text-field
            
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
                    @click="clearSearch()">
                </v-icon>
            </template>

        </v-text-field>

        </v-col>

        <!-- status -->
        <v-col cols="7" md="4">
            <v-select
                :disabled="tab=='rejected'"
                :items="status"
                item-title="title"
                item-value="value"
                v-model="selectedStatus"
                variant="outlined"
                density="compact"
                label="Statut" 
                @update:model-value="statusChanged()"
                    >
            </v-select>
        </v-col>
        
        <!-- sort -->
        <v-col cols="5" md="2">
            <v-menu>
            <template #activator="{ props }">
                <v-btn v-bind="props"  prepend-icon="mdi-sort" variant="text" >
                    {{ selectedSortLabel }}
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="item in sortOptions" :key="item.value"
                    @click="sortChanged(item.value)" >
                    <template #append >
                    <v-icon v-if="selectedSort === item.value" icon="mdi-check" />
                    </template>
                    <v-list-item-title> {{ item.label }} </v-list-item-title>
                </v-list-item>
            </v-list>
            </v-menu>
        </v-col>

    </v-row>
    <!-- /filter -->
    </div>
</template>

<style lang="scss" scoped>

    .main_content{
        background: #fff ;
    }
    
    @media (min-width: 839px){
        .main_content {
            margin: 20px 0px ;
        }
    }
</style>

