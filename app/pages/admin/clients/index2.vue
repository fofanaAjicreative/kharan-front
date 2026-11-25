<script setup lang="ts">

 
  const { $api } = useNuxtApp() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;
 
  const { showWarningSnackbar } = useSnackbar() ;
   
  const { formatDateTime } = useDate()
 
  import { useDisplay } from 'vuetify' ;
  const { mobile,name} = useDisplay() ;

  const { openChatPanel } = useChat() ;
  const { isOnline } = usePresence() ;

  

/* ------------------------------------------------------------------------ */

  const loaded = ref(false) ;
  let loading = ref(false) ; 

  let server_error = ref() ; 
 
  let clients = ref<any[]>([]) ; 
  let count_clients = ref(0) ; 

  // pagination
  let page = ref(1) ;
  let per_page = ref(4) ;
 
 
  const statuses = ref<any>([]) ;
 
   statuses.value = [
           {
            id : "active" ,
            name : "Activé"
           },
           {
            id : "inactive" ,
            name : "Désactivé"
           },
           {
            id : "banned" ,
            name : "Bani"
           } 
        ] ;
  

  const search = ref('') ;
  const status = ref(null) ;



/* -------------  search---------------------------------------------- */

      const clearSearch = () => {
          search.value= "" ;
          attributeChanged() ;
      };


      watchDebounced(search, (value, oldValue) => {

            const wasSearching = oldValue.length >= 3
            const isSearching = value.length >= 3


            // recherche
            if (isSearching) {
               attributeChanged()
               return
            }

            // sortie du mode recherche
            if (!wasSearching && value.length === 0) {
              attributeChanged()
            }

      }, {
         debounce: 400
      })
 /* ----------------------------  sort ------------------------------------------ */


   const selectedSort = ref('')

   const sortOptions = [
      { label: 'Trier', value: '' },
      { label: 'Plus récents', value: 'created-DESC' },
      { label: 'Plus anciens', value: 'created-ASC' }
   ] ;

   const selectedSortLabel = computed( () =>{
      const selected  = sortOptions.find(item=>item.value == selectedSort.value ) ;
      return selected?.label ;
   });


   const sort = (value :any) => {
      selectedSort.value = value  ;
      attributeChanged() ;
   };


 /* ------------------------------------ chat ----------------------------------------- */

    async function ContactClient(coach :any){
      const conversation = {
            conversation : null ,
            user : coach ,
            minimized : false ,
            unreadCount : 0 ,
        }
        openChatPanel(conversation,name.value) ;
        await nextTick() ;
    }

 
/* ---------------------  Reinitialiser les filtres ------------------- */

        function resetFilters(){

           // search
            search.value = '' ;

            //status
            status.value = null ;
            
            // load client
            attributeChanged() ;
 
        }

/* ----------------------------------------------------------------------------*/

   async function attributeChanged() {

        page.value =  1 ;
        clients.value = [] ;

        loading.value = true ;
    
        getClientsWithPagination()
   }

/* --------------------------- datatable -------------------------------------------------*/

   async function onUpdateOptions(options: any) {

      // console.log('OPTIONS:', options)
      page.value = options.page
      await getClientsWithPagination() ;

    }
  

 

 
/* -------------------------- LOAD ANNONCE  --------------------------------------------------- */
    

  async function getClientsWithPagination(){ 
          
      loading.value = true ;

      if(loaded.value){   // not first load
        showLoading() ;
      }

      let base_url = `admin/clients?`
      let url_sufix = '' ;

      // search
      if(search.value.length>2){
         url_sufix = url_sufix+`&search=${search.value}` ;
      }
 
      // status
      if(status.value){
         url_sufix = url_sufix+`&status=${status.value}` ;
      }
 
      // page & per_page
      url_sufix = url_sufix+`&page=${page.value}&per_page=${per_page.value}` ;

      // sort  
      let field = selectedSort.value ;
      if(field){
         url_sufix = url_sufix+`&sort=${field}` ;
      }

      // complete url
      let url = base_url+url_sufix ;
 
            // R E Q U E S T // aaa
      $api(url,{ method: 'GET', }).then((res :any) =>{

         // console.log("DATA:",res.data);
 
        if(res.data.clients && Array.isArray(res.data.clients) && res.data.clients.length>0){
           const clis = res.data.clients ;
           clients.value = clis.map((client: any) => {
             // Transform the annonce object if needed
             return {
                client: {
                  fullname: client.fullname,
                  email:  client.email,
                  phone_number:  client.phone_number,
                  photo : client.photo,
                  id : client.id,
                },
                contact: {
                    email : client.email,
                    phone_number : client.phone_number,
                },
                status: client.status,
                created: client.created,
                id: client.id,
              };
           });
         }

        console.log("CLIENTS:",clients.value);
         
        count_clients.value = res.data.total ;
          
      }).catch(error=>{

        console.log("Error:",error); 
        server_error.value = "Une erreur s'est produite lors du chargement des clients." ;
  
      }).finally(()=>{

        loaded.value = true  ;
        loading.value = false  ;

        hideLoading() ;
 
      })

   }


   
      const headers = [
        {
          title: 'Client',
          key: 'client',
          sortable: false,
          maxWidth: '350px',
          minWidth: '200px',
        },
        {
          title: 'Contact',
          key: 'contact',
          sortable: false,
          minWidth: '300px',
          maxWidth: '400px',
        },
        {
          title: 'Statut',
          key: 'status',
          sortable: false,
          maxWidth: '150px',
        },
        {
          title: 'Création',
          key: 'created',
          sortable: false,
          minWidth: '200px',
          maxWidth: '200px',
         
        },
        
        {
          title: 'Actions',
          key: 'actions',
          sortable: false,
          maxWidth: '150px',
        },
         {
          title: '',
          key: 'data-table-expand',
          sortable: false,
          width: '48px',
        },
     ]

     const expanded = ref<any[]>([])

  /* ------------------------------ Mounted--------------------------------------- */

    onMounted(() => {
 
      attributeChanged() ;
       
    });

 
</script>



<template>
  
 <SkeletonDashboard v-if="!loaded"  />

<section v-else class="mb-2 " >

  <v-card class="card_shadow">
    <v-card-text>
       <!-- certified  -->
        <v-expansion-panels model-value="1"  class="mb">
              <v-expansion-panel value="1" elevation="0">
                <v-expansion-panel-title class="expansion_panel_title" 
                collapse-icon="mdi-minus" expand-icon="mdi-plus" > Filtres </v-expansion-panel-title>
                <v-expansion-panel-text class="expansion-content">
                      
                  <div class="d-flex flex-wrap ga-4 align-center">
                      
                      <!-- search -->
                    
                        <v-text-field
                          style="min-width: 300px;"
                          clearable
                          :loading="false"
                          prepend-inner-icon="mdi-magnify"
                          density="compact"
                          label="Chercher"
                          variant="outlined"
                          hide-details
                          single-line 
                          v-model="search"
                          @click:clear="clearSearch()" >
                        </v-text-field>


                      <!-- status -->
                      
                      <v-select
                            style="min-width: 150px;"
                            v-model="status"
                            :items="statuses"
                              item-title="name"
                            item-value="id"
                            label="Statut"
                            variant="outlined"
                            density="compact"
                            clearable
                            hide-details
                            @update:modelValue="attributeChanged()"
                          />
                       

                       
                    <!-- sort -->

                    <v-menu  >
                        <template #activator="{ props }">
                            <v-btn v-bind="props"  prepend-icon="mdi-sort" variant="text" >
                              {{ selectedSortLabel }}
                            </v-btn>
                        </template>
                      <v-list>
                          <v-list-item v-for="item in sortOptions" :key="item.value"
                            @click="sort(item.value)" >
                            <template #append >
                            <v-icon v-if="selectedSort === item.value" icon="mdi-check" />
                            </template>
                            <v-list-item-title> {{ item.label }} </v-list-item-title>
                          </v-list-item>
                      </v-list>
                    </v-menu>
                          

                    <!-- reset -->
                    <v-btn
                        color="secondary"
                        variant="outlined"
                        @click="resetFilters()"
                        >
                        Réinitialiser
                    </v-btn>

                  </div>
                    
                </v-expansion-panel-text>
              </v-expansion-panel>
        </v-expansion-panels>
        <!-- / certified  -->

    </v-card-text>
  </v-card>
  

  <v-card class="mt-4" rounded="0" elevation="1" >
    <v-card-text>
     <div class="card_shadoww">
    
    <!-- -------------------------------------------
         Error
    -------------------------------------------- -->

    <v-alert
      v-if="server_error"
      rounded="0"
      color="error"
      variant="tonal"
      closable
      class="mb-0" >  {{ server_error }} </v-alert>

    <!-- -------------------------------------------
         Data table
    -------------------------------------------- -->


    <v-data-table-server
      v-model:page="page"
      v-model:items-per-page="per_page"
      
      :headers="headers"
      :items="clients"
      :items-length="count_clients"

      :loading="loading"

      item-value="id"

      @update:options="onUpdateOptions"

      items-per-page-text="Éléments par page"
      no-data-text="Aucune donnée"
      loading-text="Chargement..." 
      
      v-model:expanded="expanded"
      show-expand
      expand-strategy="single"
      
      >


      <!-- header -->
      <template #headers="{ columns }">

          <tr class="custom-header">

            <th
              v-for="column in columns"  
              :style="{
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                }"
              class="custom-header-cell" >
              
              <span v-if="column.key !== 'data-table-expand'">
                {{ column.title }}
              </span>

            </th>

          </tr>

      </template>
      <!-- / header -->

      <!-- expand button -->

      <template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
         
        <v-btn
          :append-icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          :text="isExpanded(internalItem) ? 'Reservations' : 'Reservations'"
        
          color="medium-emphasis"
          size="small"
          variant="outlined"
          
          @click="toggleExpand(internalItem)"
      ></v-btn>

      </template>

    <!-- expand button -->

    <!-- expands content -->

      <template #expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="pa-4">
            <div class="expanded-content">
              <h3 class="text-subtitle-1 mb-2">
                {{ item.id }}
              </h3>

              <p>
                {{ item.description || 'Aucune description disponible.' }}
              </p>

              <div class="mt-3">
                <strong>Statut :</strong>
                {{ item.status }}
              </div>
            </div>
          </td>
        </tr>
      </template>

    <!-- /expands content -->

      <!-- client -->
      <template #item.client="{ item  }">

        <div class="client-section">

            <div class="client-info">

                <div class="avatar-wrapper">
                    <v-avatar
                        size="72"
                        rounded="4" >
                        <v-img
                            :src=" item.client.photo ? item.client.photo.media_url : '/images/profile.png' "
                        />
                    </v-avatar>

                    <span v-if="isOnline(item.client.id)"
                        class="online-indicator" > </span>

                </div>

                <div class="client-details">

                    <div class="client-name">
                        {{ item.client.fullname }}
                     </div>
 
                    <v-btn
                        @click="ContactClient(item.client)"
                        variant="tonal"
                        color="info"
                        size="small"
                        prepend-icon="mdi-message-outline"
                        class="contact-btn mt-2"
                        block >
                        Contacter
                    </v-btn>

                </div>

            </div>
           
        </div>
 
      </template>

       <!-- client -->
      <template #item.contact="{ item  }">

        <div class="client-section">
            <div class="client-info">
                <div class="client-details">
                    <div class="client-email"> {{ item.client.email }} </div>
                    <div class="client-email"> {{ item.client.phone_number }} </div>
                </div>
            </div>
        </div>
 
      </template>

      <!-- status -->
      <template #item.status="{ item }">

        <v-chip
          v-if="item.status == 'active'"
          size="small"
          variant="tonal"
          color="success"> Activé </v-chip>

        <v-chip
          v-else-if="item.status == 'inactive'"
          size="small"
          color="warning"
          variant="tonal"
          append-icon="mdi-close"
        > Désactivé </v-chip>

        <v-chip
          v-else-if="item.status == 'banned'"
          size="small"
          variant="tonal"
          append-icon="mdi-close-circle"
          color="error"
        > Bani </v-chip>
        
      </template>

       

      <!-- created at -->
      <template #item.created="{ item }">
        {{ formatDateTime(item.created) }}
      </template>


      <!-- Actions -->
      
      <template #item.actions="{ item }">

       <div class="d-flex align-center ga-1 justify-center">

        <v-btn
            :to="'/admin/clients/' + item.id"
            size="small"
            variant="text"
            append-icon="mdi-arrow-right"
            class="details-btn" >
            Détails
        </v-btn>

       </div>

      </template>

    </v-data-table-server>

    </div>
    </v-card-text>
  </v-card>

    
</section>



</template>

<style lang="scss" scoped  >
 
 .expansion_panel_title{
    font-size: 16px;
    font-weight: 500;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.5rem 1rem;
    background-color: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0e0e0;
    }
  }

/* table header */
.custom-header {
   background: #f8f8f8;
}

.custom-header-cell {
  height: 56px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #333 !important;
  text-transform: uppercase;
}


/* =========================================================
   CLIENT
   ========================================================= */

.client-info {

    display: flex;

    align-items: center;

    gap: 12px;

    min-width: 0;
}


.avatar-wrapper {

    position: relative;

    flex-shrink: 0;
}


.online-indicator {

    position: absolute;

    right: -1px;
    bottom: -1px;

    width: 13px;
    height: 13px;

    border-radius: 50%;

    background: #22c55e;

    border: 2px solid white;
}


.client-details {

    min-width: 0;
    overflow: hidden;
    padding: 8px;
}


.client-name {

    font-size: 14px;

    font-weight: 700;

    color: #18181b;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
}


.client-email {

    font-size: 14px;

    color: #424242;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    margin-top: 1px;

    margin-bottom: 6px;
}

   
</style>