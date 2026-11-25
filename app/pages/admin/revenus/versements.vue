<script setup lang="ts">
  import StatusPayout from '~/components/espace/StatusPayout.vue' ;
  import FormatReservation from '~/components/espace/FormatReservation.vue' ;
  import StatusReservation from '~/components/espace/StatusReservation.vue' ;
 
  const { $api } = useNuxtApp() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;
 
  const { showWarningSnackbar } = useSnackbar() ;
   
  const { formatDateTime ,formatDate } = useDate()
 
  import { useDisplay } from 'vuetify' ;
  const { mobile,name} = useDisplay() ;

  const { openChatPanel } = useChat() ;
  const { isOnline } = usePresence() ;

  

/* ----------------------------  table expands------------------------------------------- */

const expanded = ref<string[]>([]);

const commandesByPayout = ref<Record<string, any[]>>({});
const loadingPayouts = ref<string[]>([]);
const errorsByPayout = ref<Record<string, string>>({});

const isLoading = (payoutId: string) => loadingPayouts.value.includes(payoutId);


async function onExpandedChange(ids: string[]) {
  // Charger uniquement les lignes développées qui ne sont
  // pas encore présentes dans le cache.
  await Promise.all(ids.map((id) => loadCommandes(id)));
}

/* -------------------------------------------------------------------------------------- */

  const loaded = ref(false) ;
  let loading = ref(false) ; 

  let server_error = ref() ; 
 
  let payouts = ref<any[]>([]) ; 
  let count_payouts = ref(0) ; 

  // pagination
  let page = ref(1) ;
  let per_page = ref(4) ;
 
 
  const statuses = ref<any>([]) ;
 
   statuses.value = [
           {
            id : "paid" ,
            name : "Payé"
           },
           {
            id : "processing" ,
            name : "En cours"
           },
           {
            id : "requires_review" ,
            name : "À vérifier"
           } 
        ] ;
  

  const search = ref('') ;
  const status = ref<any>('paid') ;
  const start_date = ref(null) ;
  const end_date = ref(null) ;



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
      { label: 'Montant décroissant', value: 'total_coach-DESC' },
      { label: 'Montant croissant', value: 'total_coach-ASC' },
      { label: 'Plus récents', value: 'payoutDate-DESC' },
      { label: 'Plus anciens', value: 'payoutDate-ASC' },
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

            //start_date
            start_date.value = null ;
            //end_date
            end_date.value = null ;

            
            // load client
            attributeChanged() ;
 
        }
/* ----------------------------------------------------------------------------*/

        async function dateChanged(){
          // if(start_date.value && end_date.value){
          //   attributeChanged() ;
          // }
          attributeChanged() ;
        }
/* ----------------------------------------------------------------------------*/

   async function attributeChanged() {

        page.value =  1 ;
        payouts.value = [] ;

        loading.value = true ;
    
        getPayoutsWithPagination()
   }

/* --------------------------- datatable -------------------------------------------------*/

   async function onUpdateOptions(options: any) {

      // console.log('OPTIONS:', options)
      page.value = options.page
      await getPayoutsWithPagination() ;

    }
  

 

 
/* -------------------------- LOAD ANNONCE  --------------------------------------------------- */
    

  async function getPayoutsWithPagination(){ 
          
      loading.value = true ;

      if(loaded.value){   // not first load
        showLoading() ;
      }

      let base_url = `admin/payouts?`
      let url_sufix = '' ;

      // search
      if(search.value.length>2){
         url_sufix = url_sufix+`&search=${search.value}` ;
      }
 
      // status
      if(status.value){
         url_sufix = url_sufix+`&status=${status.value}` ;
      }

      // dates
      if(start_date.value && end_date.value){
          url_sufix = url_sufix+`&start_date=${start_date.value}&end_date=${end_date.value}` ;
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
 
            // R E Q U E S T // 
      $api(url,{ method: 'GET', }).then((res :any) =>{

    
           const payts = res.data.payouts ;

           console.log("RES.DATA :",payts);
           payouts.value = payts.map((payout: any) => {
             
             return {
                coach: {
                  id : payout.coach.id,
                  fullname: payout.coach.fullname,
                  email:  payout.coach.email,
                  phone_number:  payout.coach.phone_number,
                  photo : payout.coach.photo,
                  
                },
                total_coach: payout.total_coach,
                status: payout.status,
                payoutDate: payout.payoutDate,
                id: payout.id,
                commandes: payout.commandes,
              };
           });
        

        console.log("PAYOUTS:",payouts.value);
         
        count_payouts.value = res.data.total ;
          
      }).catch(error=>{

        console.log("Error:",error); 
        server_error.value = "Une erreur s'est produite lors du chargement." ;
  
      }).finally(()=>{

        loaded.value = true  ;
        loading.value = false  ;

        hideLoading() ;
 
      })

   }

/* ------------------------------ aaa ---------------------------------------------------- */


  async function loadCommandes(payoutId: string) {

        // Déjà chargées : utiliser le cache.
        if (commandesByPayout.value[payoutId] !== undefined) return;

        // Éviter deux requêtes simultanées pour la même ligne.
        if (isLoading(payoutId)) return;

        loadingPayouts.value.push(payoutId);
        delete errorsByPayout.value[payoutId];

        $api(`/admin/payouts/${payoutId}/commandes`).then((res :any) =>{
          commandesByPayout.value[payoutId] = res.data.commandes ;
        }).catch(error=>{
          errorsByPayout.value[payoutId] = 'Impossible de charger les commandes.';
        }).finally(()=>{
          loadingPayouts.value = loadingPayouts.value.filter( (id) => id !== payoutId );

        })

 
  }

/* ----------------------------------------------------------------------------------- */

      const headers = [
        {
          title: 'Coach',
          key: 'coach',
          sortable: false,
          maxWidth: '350px',
          minWidth: '200px',
        },
        {
          title: 'Montant',
          key: 'total_coach',
          sortable: false,
          minWidth: '200px',
          maxWidth: '250px',
        },
        {
          title: 'Statut',
          key: 'status',
          sortable: false,
          minWidth: '100px',
          maxWidth: '150px',
        },
        {
          title: 'Date',
          key: 'payoutDate',
          sortable: false,
          minWidth: '200px',
          maxWidth: '200px',
         
        },
        {
          title: 'Actions',
          key: 'actions',
          sortable: false,
          minWidth: '100px',
          maxWidth: '150px',
        },
        {
          title: '',
          key: 'data-table-expand',
          sortable: false,
          width: '48px',
        },
     ]

 
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


                        <!-- dates -->
                      
                        <v-date-input
                            style="min-width: 100px;"
                            v-model="start_date"
                            @update:modelValue="dateChanged()"
                            label="Début"
                            prepend-icon=""
                            variant="outlined"
                            density="compact"
                            hide-details
                            clearable
                            >
                          </v-date-input>

                      <v-date-input
                            style="min-width: 100px;"
                            v-model="end_date"
                            @update:modelValue="dateChanged()"
                            label="Fin"
                            prepend-icon=""
                            variant="outlined"
                            density="compact"
                            hide-details 
                            clearable
                            >
                          </v-date-input>

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
      :items="payouts"
      :items-length="count_payouts"

      :loading="loading"

      item-value="id"

      @update:options="onUpdateOptions"

      items-per-page-text="Éléments par page"
      no-data-text="Aucune donnée"
      loading-text="Chargement..." 
      
      v-model:expanded="expanded"
      show-expand
      expand-strategy="single"
      @update:expanded="onExpandedChange"

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
          :text="isExpanded(internalItem) ? 'Détails' : 'Détails'"
          color="medium-emphasis"
          size="small"
          variant="outlined"
          @click="toggleExpand(internalItem)"
      ></v-btn>

      </template>

    <!-- expand button -->

    <!-- expands content -->

      <template #expanded-row="{ columns, item }">
        <td   :colspan="columns.length" class="pa-2">

          <!-- loading -->
          <div v-if="isLoading(item.id)" class="py-4 d-flex flex-column justify-center align-center">
            <v-progress-circular indeterminate size="24" />
            <span class="ml-2">Chargement des commandes...</span>
          </div>

          <!-- error -->
          <div v-else-if="errorsByPayout[item.id]" class="py-4 d-flex flex-column justify-center align-center">
              <span> {{ errorsByPayout[item.id] }} </span>
              <v-btn @click="loadCommandes(item.id)"
                variant="outlined" size="small" color="dark" 
                prepend-icon="mdi-refresh" > Réessayer
              </v-btn>
          </div>

          <!-- data -->
          <div v-else>

              <!-- no_data -->
              <div v-if="commandesByPayout[item.id]?.length === 0"
                class="text-medium-emphasis text-center text-warning" >
                 Aucune commande associée à ce versement.
              </div>

               <!-- table -->
              <div v-else class="d-flex justify-end pa-4">
                <div class="expanded-table-wrapper">
                    <v-table density="compact" class="expanded-table">
                      <tbody class="bg-surface-light">
                        <tr>
                          <th class="col-client" >client</th>
                          <th class="col-service" >Service</th>
                          <th class="col-statut">Statut</th>
                          <th class="col-dates">Dates</th>
                        </tr>
                      </tbody>

                      <tbody>
                        <tr v-for="commande in commandesByPayout[item.id] ?? []">

                          <!-- client -->
                          <td class="py-2">
                              <div class="client-info">
                                <div class="client-details">
                                    <div class="client-name"> {{ commande.client.fullname }} </div>
                                    <div class="client-email"> {{ commande.client.email }} </div>
                                </div>
                              </div>
                          </td>

                          <!-- service -->
                          <td class="py-2">

                            <span class="service_title"> 
                                {{ commande.service.title }} 
                                <v-btn
                                  :to="'/service/' + commande.service.id"
                                  color="info" size="small" variant="text" icon="mdi-search-web" >
                                </v-btn>
                            </span>


                              <!--  -->
                                <div class="reservation-meta">
                                  <FormatReservation :reservation="{format :commande.format , sceance_duration:commande.sceance_duration }" />

                                  <v-chip
                                      size="small"
                                      variant="tonal"
                                      color="info" 
                                      prepend-icon="mdi-layers-outline"
                                      class="ml-1"
                                    >
                                      <span v-if="commande.sceance_number === 1"> Séance unique </span>
                                      <span v-else> Séance {{ commande.sceance_used }}/{{ commande.sceance_number }} </span>
                                  </v-chip>
                                </div>
                          </td>

                          <td class="py-2">
                            <div class="text-left mb-2"> 
                                <StatusReservation :status="commande.status" />
                              </div>
                              <!-- Payment -->
                              <div class="payment-badge ml-1 mt-1" :class="commande.payment_status == 'paid'?'paid':'unpaid' " >
                                <v-icon  icon=" mdi-credit-card-check" size="14"> </v-icon>
                                {{ commande.total_coach }} &euro;
                              </div>

                              <div class="payment-badge ml-1 mt-1 total"  >
                                <v-icon  icon=" mdi-credit-card-check" size="14"> </v-icon>
                                {{ commande.total_ttc }} &euro;
                              </div>

                          </td>
                          <td class="py-2">
                            <span class="commande_date"> {{ formatDate(commande.created) }} </span> <br>
                            <!-- <span class="commande_date"> {{ formatDate(commande.status_date) }} </span> -->
                          </td>
                          

                        </tr>

                      </tbody>
                    </v-table>
                  </div>
              </div>
              <!-- /table -->

           </div>
           <!-- /data -->

       </td>
      </template>

    <!-- /expands content -->

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
                    <span v-if="isOnline(item.coach.id)" class="online-indicator" > </span>
                </div>

                <div class="client-details">

                    <div class="client-name"> {{ item.coach.fullname }} </div>
                    <div class="client-email"> {{ item.coach.email }} </div>
                    <div class="d-flex align-center ga-1 mt-0">
                      <v-btn class="flex-grow-1"
                        @click="ContactClient(item.coach)"
                        variant="tonal"
                        color="info"
                        size="small"
                        prepend-icon="mdi-message-outline"
                         >
                        Contacter
                      </v-btn>
                      
                    </div>

                </div>

            </div>
           
        </div>
 
      </template>

       <!-- amount -->
      <template #item.total_coach="{ item  }">
      
          <div  class="payment-badge" :class="item.status === 'paid'?'paid':'unpaid' " >
              <v-icon size="14"> mdi-credit-card-check </v-icon>
              {{ item.total_coach }} &euro;
          </div>

      </template>

      <!-- status -->
      <template #item.status="{ item }">

         <div class="text-left mb-2"> 
            <StatusPayout :status="item.status" />
          </div>
        
      </template>

      <!-- date-->
      <template #item.payoutDate="{ item }">
        {{ formatDate(item.payoutDate) }}
      </template>

       <!-- Actions -->
      
      <template #item.actions="{ item }">

        <div>

          <v-btn
              size="default"
              color="info"
              variant="flat"
              rounded="4"
              append-icon="mdi-credit-card-refresh"
            > Renvoyer </v-btn>

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

    color: #424242;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;

    margin-top: 1px;

    margin-bottom: 4px;
}

   /* =========================================================
   PAYMENT
   ========================================================= */

.payment-badge {

    display: inline-flex;
    align-items: center;
    gap: 5px;
    width: fit-content;
    padding: 4px 8px;
    border-radius: 8px;
    background: #3b82f6;
    color: white;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 0px;
  }


   .paid{
     background: $success-color
    }

   .unpaid{
     background: $warning-color
    }

    .total{
     background: #aaa
    }

    .commande_date{
      font-size: 12px;
    }

    .service_title {
      margin: 2px 0px ;
      font-weight: 500 ;
      line-height: normal ;
    }

  /* =========================================================
   TABLE RESPONSIVE  
   ========================================================= */

    .expanded-table-wrapper {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .expanded-table {
      min-width: 650px;
    }

    /* Largeur minimale des colonnes */
    .expanded-table .col-client {
      min-width: 150px;
    }

    .expanded-table .col-service {
      min-width: 350px;
    }

    .expanded-table .col-statut {
      min-width: 180px;
    }

    .expanded-table .col-dates {
      min-width: 180px;
    }

    /* Empêcher les cellules de se compresser */
    .expanded-table th,
    .expanded-table td {
      white-space: wrap ;
    }

</style>