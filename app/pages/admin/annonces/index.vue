<script setup lang="ts">

 
  const { $api } = useNuxtApp() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

  const { getCategories, getChallenges } = UseDataService() ;
 
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

 
  let annonces = ref<any[]>([]) ; 
  let count_annonces = ref(0) ; 

  // pagination
  let page = ref(1) ;
  let per_page = ref(4) ;
 
  const categories = ref<any>([]) ;
  const challenges = ref<any>([]) ;
  const statuses = ref<any>([]) ;
  const formats = ref<any>([]) ;
  const stripe_account_statuses = ref<any>([]) ;

      statuses.value = [
           {
            id : "approved" ,
            name : "Approuvée"
           },
           {
            id : "waiting" ,
            name : "En attente"
           },
           {
            id : "rejected" ,
            name : "Rejetée"
          },
          {
            id : "suspended" ,
            name : "Suspendue"
          }
        ] ;

       formats.value = [
           {
            id : "both" ,
            name : "Tous"
           },
           {
            id : "online" ,
            name : "Visioconférence"
           },
           {
            id : "in_person" ,
            name : "En personne"
           }
        ] ;


      stripe_account_statuses.value = [
           {
            id : "" ,
            name : "Tous"
           },
           {
            id : "ACTIVE" ,
            name : "Actif"
           },
           {
            id : "INACTIVE" ,
            name : "Inactif"
           }
        ] ;


  const search = ref('') ;
  const selected_categories = ref([]) ; 
  const selected_challenges = ref([]) ; 

  const is_super = ref(false) ;
  const is_certified = ref(false) ;
  const format = ref(null) ;
  const status = ref(null) ;
  const stripe_account_status = ref(null) ;


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
      { label: 'Plus anciens', value: 'created-ASC' },
      { label: 'Mieux notés', value: 'rating_coach_avg-DESC' },
      { label: 'Moins notés', value: 'rating_coach_avg-ASC' },
        { label: 'Prix croissant', value: 'price_min-ASC' },
      { label: 'Prix décroissant', value: 'price_min-DESC' },
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
            //format
            format.value = null ;
            
            // categories
            selected_categories.value = [] ;

            // challenges
            selected_challenges.value = [] ;

            //switch
            is_super.value = false ;
            is_certified.value = false ;

            // load annonces
            attributeChanged() ;
 

        }

/* ----------------------------------------------------------------------------*/

   async function attributeChanged() {

        page.value =  1 ;
        annonces.value = [] ;

        loading.value = true ;
    
        getAnnoncesWithPagination()
   }

/* --------------------------- datatable -------------------------------------------------*/

   async function onUpdateOptions(options: any) {

      // console.log('OPTIONS:', options)
      page.value = options.page
      await getAnnoncesWithPagination() ;

    }
  

/* --------------------------------- load data--------------------------------------------- */        
   

   function loadCategories(){

      getCategories().then((res :any )=>{
      categories.value = res.data.categoires ;
     }).catch(error=>{
        console.log(error); 
    });

   }


  async function loadChallenges(){

      getChallenges().then((res :any )=>{
        challenges.value = res.data.challenges ;
      }).catch(error=>{
         console.log(error); 
      });

   }

 
 

/* -------------------------- LOAD ANNONCE  --------------------------------------------------- */
    

  async function getAnnoncesWithPagination(){ 
          
      loading.value = true ;

      if(loaded.value){   // not first load
        showLoading() ;
      }

      let base_url = `admin/annonces?`
      let url_sufix = '' ;

      // search
      if(search.value.length>2){
         url_sufix = url_sufix+`&search=${search.value}` ;
      }

       // format  
      let formats_string="[]" ;

      if(format.value){
      let formats_array = [format.value] ;
        formats_string = JSON.stringify(formats_array)
      }
      
      url_sufix = url_sufix+`&formats=${formats_string}` ;

      // status
      if(status.value){
         url_sufix = url_sufix+`&status=${status.value}` ;
      }

      // stripe_account_status
      if(stripe_account_status.value){
         url_sufix = url_sufix+`&stripe_account_status=${stripe_account_status.value}` ;
      } 

      // categories
      url_sufix = url_sufix+`&category_ids=${JSON.stringify(selected_categories.value)}` ;

      // challenges
      url_sufix = url_sufix+`&challenge_ids=${JSON.stringify(selected_challenges.value)}` ;

     
      // super
      if(is_super.value==true){
         url_sufix = url_sufix+`&is_super=true` ;
      } 

      // certified
      if(is_certified.value==true){
         url_sufix = url_sufix+`&is_certified=true` ;
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

         // console.log("ANNONCES:",res);

         // annonces.value = res.data.annonces ;

         if(res.data.annonces && Array.isArray(res.data.annonces) && res.data.annonces.length>0){
           const anns = res.data.annonces ;
           annonces.value = anns.map((annonce: any) => {
             // Transform the annonce object if needed
             return {
                coach: {
                  fullname: annonce.coach.fullname,
                  email: annonce.coach.email,
                  phone: annonce.coach.phone_number,
                  photo : annonce.photo,
                  id : annonce.coach.id,
                },
                title: annonce.title,
                status: annonce.status,
                annonce_completed: annonce.coach.annonce_completed,
                is_certified: annonce.is_certified,
                stripeAccountStatus: annonce.stripeAccountStatus,
                created: annonce.created,
                id: annonce.id,
                // Add other properties as needed
             };
           });
         }

        console.log("ANNONCES:",annonces.value);
         
        count_annonces.value = res.data.annonce_count ;
          
      }).catch(error=>{

        console.log("Error:",error); 
        server_error.value = "Une erreur s'est produite lors du chargement des annonces." ;
  
      }).finally(()=>{

        loaded.value = true  ;
        loading.value = false  ;

        hideLoading() ;
 
      })

   }

      const headers = [
        {
          title: 'Coach',
          key: 'coach',
          sortable: false,
          maxWidth: '350px',
          minWidth: '200px',
        },
        {
          title: 'Titre',
          key: 'title',
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
          title: 'Complet',
          key: 'annonce_completed',
          sortable: false,
          maxWidth: '150px',
        },
        {
          title: 'Certifié',
          key: 'is_certified',
          sortable: false,
          maxWidth: '150px',
        },
        {
          title: 'Compte Stripe',
          key: 'stripeAccountStatus',
          sortable: false,
          minWidth: '200px',
          maxWidth: '350px',
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
]
  /* ------------------------------ Mounted--------------------------------------- */

    onMounted(() => {

      loadCategories()  ;
      loadChallenges()  ;

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

                      <!-- format -->
                        <v-select
                              style="min-width: 150px;"
                              v-model="format"
                              :items="formats"
                              item-title="name"
                              item-value="id"
                              label="Format"
                              variant="outlined"
                              density="compact"
                              clearable
                              hide-details
                              @update:modelValue="attributeChanged()"
                          />
                    
                      <!-- categories -->
                      
                          <v-autocomplete
                              style="min-width: 200px;"
                              v-model="selected_categories"
                              :items="categories"
                              label="Catégories"
                              item-title="name"
                              item-value="id"
                              variant="outlined"
                              density="compact"
                              multiple
                              clearable
                              hide-details
                              @update:modelValue="attributeChanged()"
                          />
                      
                      <!-- challenges -->
                      
                          <v-autocomplete
                              style="min-width: 200px;"
                              v-model="selected_challenges"
                              :items="challenges"
                              label="Challenges"
                              item-title="name"
                              item-value="id"
                              variant="outlined"
                              density="compact"
                              multiple
                              clearable
                              hide-details
                              @update:modelValue="attributeChanged()"
                          />
                    

                      <!-- super coachs -->
                      
                        <v-switch 
                            style="min-width: 100px;"
                            v-model="is_super"
                            label="Super coachs"
                            color="secondary"
                            inset="square"
                            true-icon="mdi-medal"
                            false-icon="mdi-medal" 
                            size="small"
                            hide-details
                            @update:model-value="attributeChanged()"
                            >
                        </v-switch>
                    

                      <!-- certified -->
                        
                        <v-switch 
                            style="min-width: 150px;"
                            v-model="is_certified"
                            label="Certifiés"
                            color="secondary"
                            inset="square"
                            true-icon="mdi-certificate"
                            false-icon="mdi-certificate"
                            size="small"
                            hide-details
                            @update:model-value="attributeChanged()" 
                            >
                        </v-switch>

                      <!-- stripe -->
                        <v-select
                              style="min-width: 150px;"
                              v-model="stripe_account_status"
                              :items="stripe_account_statuses"
                              item-title="name"
                              item-value="id"
                              label="Stripe"
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
      :items="annonces"
      :items-length="count_annonces"

      :loading="loading"

      item-value="id"

      @update:options="onUpdateOptions"

      items-per-page-text="Éléments par page"
      no-data-text="Aucune annonce"
      loading-text="Chargement..." >


      <template #headers="{ columns }">

        <tr class="custom-header">

          <th
            v-for="column in columns"  
             :style="{
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
              }"
            class="custom-header-cell" >
            {{ column.title }}
          </th>

        </tr>

    </template>


      <!-- coach -->
      <template #item.coach="{ item  }">

        <div class="client-section">

            <div class="client-info">

                <div class="avatar-wrapper">
                    <v-avatar
                        size="72"
                        rounded="4" >
                        <v-img
                            :src=" item.coach.photo ? item.coach.photo.media_url : '/images/profile.png' "
                        />
                    </v-avatar>

                    <span v-if="isOnline(item.coach.id)"
                        class="online-indicator" > </span>

                </div>

                <div class="client-details">

                    <div class="client-name">
                        {{ item.coach.fullname }}
                     </div>

                    <div class="client-email">
                        {{ item.coach.email }}
                    </div>

                    <v-btn
                        @click="ContactClient(item.coach)"
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

      <!-- status -->
      <template #item.status="{ item }">

        <v-chip
          v-if="item.status == 'approved'"
          size="small"
          color="info" 
        > Approuvée </v-chip>
        <v-chip
          v-else-if="item.status == 'waiting'"
          size="small"
          color="warning"
        > En attente </v-chip>
        <v-chip
          v-else-if="item.status == 'rejected'"
          size="small"
          color="error"
        > Rejetée </v-chip>
        <v-chip
          v-else-if="item.status == 'suspended'"
          size="small"
          color="error"
        > Suspendue </v-chip>

      </template>

      <!-- completed -->
      <template #item.annonce_completed="{ item }">
        <div class="text-center">
          <v-icon
            v-if="item.annonce_completed"
            icon="mdi-check-circle"
            color="success"
          />
          <v-icon
            v-else
            icon="mdi-close-circle"
            color="error"
          />
        </div>
      </template>

      <!-- certified -->
      <template #item.is_certified="{ item }">
        <div class="text-center">
            <v-icon
            v-if="item.is_certified"
            icon="mdi-certificate"
            color="success" />
        </div>
      </template>

      <!-- stripe account status -->
      <template #item.stripeAccountStatus="{ item }">
        <div class="text-center">

          
          <v-chip
            v-if="item.stripeAccountStatus == 'ACTIVE'"
            size="small"
            color="success"
          > Actif </v-chip>

          <v-chip
            v-else-if="item.stripeAccountStatus == 'NOT_CONNECTED'"
            size="small"
            color="error"
          > Non connecté </v-chip>

          <v-chip
            v-else-if="item.stripeAccountStatus == 'ONBOARDING_INCOMPLETE'"
            size="small"
            color="warning"
          > Onboarding incomplet </v-chip>

          <v-chip
            v-else-if="item.stripeAccountStatus == 'PENDING_VERIFICATION'"
            size="small"
            color="warning"
          > En attente </v-chip>
          <v-chip
            v-else-if="item.stripeAccountStatus == 'RESTRICTED'"      
          > Restreint </v-chip> 

          
          <v-chip
            v-else-if="item.stripeAccountStatus == 'ACTION_REQUIRED'"
            size="small"
            color="error"
          > Action requise </v-chip>

           <v-chip
            v-else 
            size="small"
            color="error"
          >  {{ item.stripeAccountStatus }} </v-chip>

        </div>
      </template>

      <!-- created at -->
      <template #item.created="{ item }">
        {{ formatDateTime(item.created) }}
      </template>


      <!-- Actions -->
      
      <template #item.actions="{ item }">

       <div class="d-flex align-center ga-1 justify-center">

        <v-btn
            :to="'/coach/' + item.id"
            color="info"
            size="small"
            variant="text"
            icon="mdi-web"
            class="details-btn" >
            
        </v-btn>

        <v-btn
            :to="'/admin/annonces/' + item.id"
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

    font-size: 12px;

    color: #71717a;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    margin-top: 2px;

    margin-bottom: 6px;
}

   
</style>