<script setup lang="ts">

  import CategoryForm from '~/components/espace/CategoryForm.vue' ;

  const { $api } = useNuxtApp() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;
 
  const { showWarningSnackbar } = useSnackbar() ;

  const { confirm } = useConfirm() ;
 

/* ------------------------------------------------------------------------ */

  const loaded = ref(false) ;
  let loading = ref(false) ; 

  let server_error = ref() ; 
 
  let categories = ref<any[]>([]) ; 
  let count_categories = ref(0) ; 

  // pagination
  let page = ref(1) ;
  let per_page = ref(5) ;
 
 
  const statuses = ref<any>([]) ;
 
   statuses.value = [
           {
            id : "true" ,
            name : "Activé"
           },
           {
            id : "false" ,
            name : "Désactivé"
           } 
        ] ;
  

  const search = ref('') ;
  const status = ref(null) ;


    const current_category = ref<any>({ }) ;
    const category_dialog = ref(false) ;

    const form_params = ref<any>({
      loading : false ,
      server_error : false ,
      server_error_message : "" ,
    }) ;


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
 
/* ---------------------  Reinitialiser les filtres ------------------- */

        function resetFilters(){

          server_error.value = false ;
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
        categories.value = [] ;

        loading.value = true ;
    
        getCategories()
   }

/* --------------------------- datatable -------------------------------------------------*/

   async function onUpdateOptions(options: any) {

      page.value = options.page
      await getCategories() ;

    }
  
/* ---------------------------------------------------------------------------- */
    

  async function getCategories(){ 
          
      loading.value = true ;

      if(loaded.value){   // not first load
        showLoading() ;
      }

      let base_url = `admin/categories?`
      let url_sufix = '' ;

      // search
      if(search.value.length>2){
         url_sufix = url_sufix+`&search=${search.value}` ;
      }
 
      // status
      if(status.value){
         url_sufix = url_sufix+`&enabled=${status.value}` ;
      }
 
      // page & per_page
      url_sufix = url_sufix+`&page=${page.value}&per_page=${per_page.value}` ;
 
      // complete url
      let url = base_url+url_sufix ;
 
            // R E Q U E S T // aaa
      $api(url,{ method: 'GET', }).then((res :any) =>{

         // console.log("DATA:",res.data);
 
         
           const cats = res.data.categories ;
           categories.value = cats.map((cat: any) => {
             
             return {
                name:  cat.name ,
                enabled: cat.enabled,
                id: cat.id,
              };
           });
         

        console.log("CATEGORIES:",categories.value);
        count_categories.value = res.data.total ;
          
      }).catch(error=>{

        console.log("Error:",error); 
        server_error.value = "Une erreur s'est produite lors du chargement..." ;
  
      }).finally(()=>{

        loaded.value = true  ;
        loading.value = false  ;

        hideLoading() ;
 
      })

   }

      const headers = [
        {
          title: 'Nom',
          key: 'name',
          sortable: false,
          maxWidth: '350px',
          minWidth: '200px',
        },
        {
          title: 'Statut',
          key: 'enabled',
          sortable: false,
          maxWidth: '150px',
        },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false,
          maxWidth: '150px',
        },
   ]

 
 /*------------------------------------------------------------------------------- */

    async function deleteCat(cat :any ){

      const accepted = await confirm({
        title: 'Supprimer',
        text: 'Voulez-vous vraiment supprimer ?'
      })
      if (!accepted) { return } 

   
      $api(`/admin/categories/${cat.id}`,{
            method: 'DELETE',
            }).then((res :any) =>{

              attributeChanged() ;

          }).catch((error:any)=>{
            hideLoading() ;
            console.log("Error:",error); 
            
            let server_error_message  = error.message ;
            if(error.statusCode == 400){
              server_error_message = 'Données incomplètes ou incorrectes.'
            }

            showWarningSnackbar({
                title: 'Erreur',
                message: server_error_message
            }) ;

            
          }) ; 
   };


/* ------------------------------------------------------------------------------- */

  function changeStatus(cat :any ){ 
    
    const old_value = !cat.enabled ;

      loading.value = true ;
      showLoading() ;

      const post_data = {
        enabled : cat.enabled
      }

      console.log(post_data);

  
      $api(`/admin/categories/${cat.id}/enable`,{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
         
       
        
      }).catch(error=>{
        cat.enabled = old_value ;
        console.log(error);
      }).finally(()=>{
        loading.value = false ;
        hideLoading() ;
       })
       
  }

/* ---------------------------------------------------------------------------------- */ 


    function resetError() {
      form_params.value.loading = false ;
      form_params.value.server_error = false ;
      form_params.value.server_error_message = "" ;
    }

/* ------------------------------------------------------------------------------- */

  async function addCategory() {

    resetError() ; 
    current_category.value = {} ;
    category_dialog.value = true ;
  }


/* ------------------------------------------------------------------------------- */

  async function editCat(cat: any) {
  
    resetError() ; 
    current_category.value = {
      id : cat.id ,
      name : cat.name,
    } ;
    category_dialog.value = true ;
 
  }

/* ---------------------------------------------------------------------------------- */

  function saveCategory(post_data :any){ 
 
       showLoading() ;

      if(!current_category.value.id){ 

        $api('/admin/categories',{
            method: 'POST',
            body:post_data
        }).then((res :any) =>{
          hideLoading() ;

          category_dialog.value = false ;
          attributeChanged() ;

          resetError() ;
        }).catch(error=>{
          
          hideLoading() ;

          form_params.value.loading = false ;
          form_params.value.server_error = true ;
          form_params.value.server_error_message = error.message ;

          if(error.statusCode==400){
            form_params.value.server_error_message = 'Données incomplètes ou incorrectes.'
          }
          console.log("Error:",error);   
        })
      }else{ // edit

        $api(`/admin/categories/${current_category.value.id}`,{
            method: 'PUT',
            body:post_data
        }).then((res :any) =>{

          hideLoading() ;

          category_dialog.value = false ;
          attributeChanged() ;

          resetError() ;

        }).catch(error=>{
          
          hideLoading() ;

          form_params.value.loading = false ;
          form_params.value.server_error = true ;
          form_params.value.server_error_message = error.message ;

          if(error.statusCode==400){
            form_params.value.server_error_message = 'Données incomplètes ou incorrectes.'
          }
          console.log("Error:",error);   
        })

      }
               
  }

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

       <!-- filter  -->
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
                      
                      <!-- reset -->
                      <v-btn
                          color="secondary"
                          variant="outlined"
                          @click="resetFilters()"
                          append-icon="mdi-refresh-circle">
                          Actualiser
                      </v-btn>

                  </div>
                    
                </v-expansion-panel-text>
              </v-expansion-panel>
        </v-expansion-panels>
        <!-- / filter  -->

    </v-card-text>
  </v-card>
  

  <v-card class="mt-4" rounded="0" elevation="1" >

     <v-card-text class="pa-4">
        <div v-if="loaded && count_categories" class="d-flex justify-space-between align-center ">
            <span class="text-dark" > 
              {{ count_categories }} categorie(s)
            </span>
            <v-btn 
                @click="addCategory()"
                prepend-icon="mdi-plus"
                variant="flat"
                color="secondary">
                Ajouter </v-btn>
        </div>
    </v-card-text>

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
       @update:options="onUpdateOptions"
      :headers="headers"
      :items="categories"
      :items-length="count_categories"

      :loading="loading"

      item-value="id"

     

      items-per-page-text="Éléments par page"
      no-data-text="Aucune donnée"
      loading-text="Chargement..." >


      <!-- header -->
      <template #headers="{ columns }">

        <tr class="custom-header">

          <th class="custom-header-cell"
            v-for="column in columns"  
              :style="{
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                }"
             > {{ column.title }}
          </th>

        </tr>

       </template>
      <!-- /header -->

      <!-- name -->
      <template #item.name="{ item  }">

        <div class="client-section">
           <div class="client-info"> {{ item.name }} </div>
        </div>
 
      </template>
 

      <!-- status -->
      <template #item.enabled="{ item }">
         
         <v-switch 
          style="min-width: 100px;"
          v-model="item.enabled"
          :loading="loading"
          color="secondary"
          inset="square"
          true-icon="mdi-check"
          false-icon="mdi-close"
          size="small"
          hide-details
          @update:model-value="changeStatus(item)"
          >
      </v-switch>


      </template>

    
      <!-- Actions -->
      
      <template #item.actions="{ item }">

       <div class="d-flex align-center ga-1 justify-centerr">

        <v-btn 
          @click="deleteCat(item)"
          size="small"
          variant="text"
          color="error"
          icon="mdi-trash-can-outline"
          class="details-btn" >
        </v-btn>

        <v-btn 
          @click="editCat(item)"
          size="small"
          color="#424242"
          variant="text"
          icon="mdi-square-edit-outline"
          class="details-btn" >
        </v-btn>

        

       </div>

      </template>

    </v-data-table-server>

    </div>
    </v-card-text>
  </v-card>

    
</section>



    <!-- dialog form -->
     <section>
           
        <v-dialog
          v-model="category_dialog"
          max-width="600"
          persistent >
          <v-card rounded="0">

            <v-toolbar color="default">
                
                <v-toolbar-title v-if="current_category.id">Modifier</v-toolbar-title>
                <v-toolbar-title v-else >Ajouter</v-toolbar-title>

                <v-toolbar-items>
                  <v-btn
                    text="Fermer"
                    variant="text"
                    prepend-icon="mdi-close"
                    @click="category_dialog = false"
                  ></v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text class="pa-2">
 
              <CategoryForm 
                :category="current_category"
                v-model="form_params"
                @save="saveCategory"
              />

            </v-card-text>
          </v-card>
        </v-dialog>

     </section>
     <!-- /dialog -->



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