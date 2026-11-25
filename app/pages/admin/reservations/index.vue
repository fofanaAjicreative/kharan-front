<script setup lang="ts">

 import StatusReservation from '~/components/espace/StatusReservation.vue' ;
 import FormatReservation from '~/components/espace/FormatReservation.vue' ;

  const { $api } = useNuxtApp() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;
 
 
  const { formatReservationDuration ,formatDateTime } = useDate()
 
  import { useDisplay } from 'vuetify' ;
  const { mobile,name} = useDisplay() ;

  const { openChatPanel } = useChat() ;
  const { isOnline } = usePresence() ;

  
/* ------------------------------------------------------------------------ */

  const loaded = ref(false) ;
  let loading = ref(false) ; 

  let server_error = ref() ; 

 
  let reservations = ref<any[]>([]) ; 
  let count_reservations = ref(0) ; 

  // pagination
  let page = ref(1) ;
  let per_page = ref(4) ;
 
  const statuses = ref<any>([]) ;
  const formats = ref<any>([]) ;
  const periods = ref<any>([]) ;

   statuses.value = [
        { name: 'Tous', id: '' },
        { name: 'En attente', id: 'waiting' },
        { name: 'Confirmé', id: 'confirmed' },
        { name: 'Annulé', id: 'canceled' },
        { name: 'Rejeté', id: 'rejected' },
        { name: 'Terminé', id: 'completed' },
      ] ;

      formats.value = [
          { id : "both" , name : "Tous" },
          { id : "online" , name : "Visioconférence"  },
          { id : "in_person" , name : "En personne" }
      ] ;

      periods.value = [
          { id : "" , name : "Toutes" },
          { id : "today" ,  name : "Aujourd'hui" },
          { id : "next" , name : "À venir" },
          { id : "past" ,  name : "Passé" }
          
      ] ;

    const search_client = ref('') ;
    const search_coach = ref('') ;
    
    const format = ref(null) ;
    const status = ref(null) ;
    const period = ref(null) ;

    const start_date = ref(null) ;
    const end_date = ref(null) ;

 

/* -------------  search client/coach ---------------------------------------------- */

      const clearSearchClient = () => {
          search_client.value= "" ;
          attributeChanged() ;
      };

      const clearSearchCoach = () => {
          search_coach.value= "" ;
          attributeChanged() ;
      };


      watchDebounced(search_client, (value, oldValue) => {

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

      watchDebounced(search_coach, (value, oldValue) => {

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
      { label: 'Par defaut', value: '' },
      { label: 'Plus récents', value: 'booking_date_start-DESC' },
      { label: 'Plus anciens', value: 'booking_date_start-ASC' }
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


    async function ContactUser(user :any){
 
      const conversation = {
            conversation : null ,
            user : user ,
            minimized : false ,
            unreadCount : 0 ,
        }

        openChatPanel(conversation,name.value) ;
        
        await nextTick() ;
         

    }

 
/* ---------------------  Reinitialiser les filtres ------------------- */

        function resetFilters(){

           // search
            search_client.value = '' ;
            search_coach.value = '' ;

            //status
            status.value = null ;
            //format
            format.value = null ;
            //period
            period.value = null ;

            //start_date
            start_date.value = null ;
            //end_date
            end_date.value = null ;

            // load reservations
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
        reservations.value = [] ;

        loading.value = true ;
    
        getReservationsWithPagination()
   }

/* --------------------------- datatable -------------------------------------------------*/

   async function onUpdateOptions(options: any) {

      // console.log('OPTIONS:', options)
      page.value = options.page
      await getReservationsWithPagination() ;

    }
  

 

/* -------------------------- LOAD RESERVATIONS  --------------------------------------------------- */
    

  async function getReservationsWithPagination(){ 
          
      loading.value = true ;

      if(loaded.value){   // not first load
        showLoading() ;
      }

      let base_url = `admin/reservations?`
      let url_sufix = '' ;

      // search client:coach
      if(search_client.value.length>2){
        url_sufix = url_sufix+`&search_client=${search_client.value}` ;
      }

      if(search_coach.value.length>2){
        url_sufix = url_sufix+`&search_coach=${search_coach.value}` ;
      }

       // dates
       if(start_date.value && end_date.value){
           url_sufix = url_sufix+`&start_date=${start_date.value}&end_date=${end_date.value}` ;
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

      // period
      if(period.value){
         url_sufix = url_sufix+`&period=${period.value}` ;
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
 
            // R E Q U E S T 
      $api(url,{ method: 'GET', }).then((res :any) =>{

        console.clear() ;

        console.log("RESERVATIONS:",res.data);

        
         if(res.data.reservations && Array.isArray(res.data.reservations) && res.data.reservations.length>0){
           const resers = res.data.reservations ;  
           reservations.value = resers.map((reservation: any) => {
             // Transform the reservation object if needed
             return {
                coach: {
                  fullname: reservation.annonce.user.fullname,
                  email: reservation.annonce.user.email,
                  phone: reservation.annonce.user.phone_number,
                  photo : reservation.annonce.photo,
                  id : reservation.annonce.user.id,
                  annonce_id : reservation.annonce.id,
                },

                client: {
                  fullname: reservation.user.fullname,
                  email: reservation.user.email,
                  phone: reservation.user.phone_number,
                  photo : reservation.user.photo,
                  id : reservation.user.id,
                },
                
                status: reservation.status,
                booking_date_start: reservation.booking_date_start,
                booking_date_end: reservation.booking_date_end,
                format: reservation.format,
                sceance_duration: reservation.sceance_duration,
                
                service: {
                  id : reservation.service.id ,
                  title : reservation.service.title ,
                },

                commande: {
                  sceance_used : reservation.commande.sceance_used ,
                  sceance_number : reservation.commande.sceance_number ,
                  total_ttc : reservation.commande.total_ttc ,
                  payment_status : reservation.commande.payment_status ,

                 },

                created: reservation.created,
                id: reservation.id,
                // Add other properties as needed
             };
           });
         }

        console.log("RESERVATIONS:",reservations.value);
         
        count_reservations.value = res.data.total ;
          
      }).catch(error=>{

        console.log("Error:",error); 
        server_error.value = "Une erreur s'est produite lors du chargement des réservations." ;
  
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
          title: 'Client',
          key: 'client',
          sortable: false,
          maxWidth: '350px',
          minWidth: '200px',
        },
        {
          title: 'Reservation',
          key: 'service',
          sortable: false,
          minWidth: '400px',
          maxWidth: '500px',
        },
        /* {
          title: 'Statut',
          key: 'status',
          sortable: false,
          maxWidth: '150px',
        }, */
        {
          title: 'Commande',
          key: 'commande',
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
        
        /* {
          title: 'Actions',
          key: 'actions',
          sortable: false,
          maxWidth: '150px',
        }, */
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
                          label="Client"
                          variant="outlined"
                          hide-details
                          single-line 
                          v-model="search_client"
                          @click:clear="clearSearchClient()" >
                        </v-text-field>

                        <v-text-field
                          style="min-width: 300px;"
                          clearable
                          :loading="false"
                          prepend-inner-icon="mdi-magnify"
                          density="compact"
                          label="Coach"
                          variant="outlined"
                          hide-details
                          single-line 
                          v-model="search_coach"
                          @click:clear="clearSearchCoach()" >
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


                      <!-- period -->
                      <v-select
                            style="min-width: 150px;"
                            v-model="period"
                            :items="periods"
                            item-title="name"
                            item-value="id"
                            label="Période"
                            variant="outlined"
                            density="compact"
                            hide-details
                            clearable
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
                            hide-details
                            clearable
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
      :items="reservations"
      :items-length="count_reservations"

      :loading="loading"

      item-value="id"

      @update:options="onUpdateOptions"

      items-per-page-text="Éléments par page"
      no-data-text="Aucune reservation"
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
    <!-- /headers -->

    


       <!-- coach -->
      <template #item.coach="{ item  }">

        <div class="client-section">

            <div class="client-info">

                <div class="avatar-wrapper">
                    <v-avatar size="72" rounded="4" >
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
                        @click="ContactUser(item.coach)"
                        variant="tonal"
                        color="info"
                        size="small"
                        prepend-icon="mdi-message-outline"
                         >
                        Contacter
                      </v-btn>
                      <v-btn
                        :to="'/admin/annonces/' + item.coach.annonce_id"
                        color="info" size="small" variant="text" icon="mdi-arrow-right-circle-outline" >
                      </v-btn>
                    </div>
                    
                    
                </div>

            </div>
        </div>
 
      </template>

      <!-- client -->
      <template #item.client="{ item  }">

        <div class="client-section">

            <div class="client-info">

                <div class="avatar-wrapper">
                    <v-avatar size="72" rounded="4" >
                        <v-img
                          :src=" item.client.photo ? item.client.photo.media_url : '/images/profile.png' "
                        />
                    </v-avatar>
                    <span v-if="isOnline(item.client.id)" class="online-indicator" > </span>
                </div>

                <div class="client-details">
                    <div class="client-name">
                        {{ item.client.fullname }}
                     </div>
                    <div class="client-email">
                        {{ item.client.email }}
                    </div>


                    <div class="d-flex align-center ga-1 mt-0">
                      <v-btn class="flex-grow-1"
                        @click="ContactUser(item.client)"
                        variant="tonal"
                        color="info"
                        size="small"
                        prepend-icon="mdi-message-outline"
                         >
                        Contacter
                      </v-btn>
                      <v-btn
                        :to="'/admin/clients/' + item.client.id"
                        color="info" size="small" variant="text" icon="mdi-arrow-right-circle-outline" >
                      </v-btn>
                    </div>

                    
                </div>
                
            </div>
        </div>
 
      </template>

      <!-- service -->
      <template #item.service="{ item }">
        <div class="text-left"> 
           <span class="service_title"> 
            {{ item.service.title }} 
             <v-btn
              :to="'/service/' + item.service.id"
              color="info" size="small" variant="text" icon="mdi-search-web" >
            </v-btn>
           </span>
           
        </div>

           <!-- Date -->
            <div class="reservation-meta">

                <div class="reservation-date">
                    <v-icon size="16" 
                        icon="mdi-calendar-outline"
                        color="info">
                    </v-icon>

                    {{ formatReservationDuration( item.booking_date_start, item.booking_date_end ) }}
                </div>
            </div>



                <!-- Session -->
            <div class="reservation-meta">
                <FormatReservation :reservation="item" />

                <v-chip
                    size="small"
                    variant="tonal"
                    color="info" >

                    <template #prepend>
                        <v-icon icon=" mdi-layers-outline" size="13"> </v-icon>
                    </template>

                    <span v-if="item.commande.sceance_number === 1"> Séance unique </span>
                    <span v-else> Séance {{ item.commande.sceance_used }}/{{ item.commande.sceance_number }} </span>
                </v-chip>
            </div>

      </template>

      <!-- status -->
      <template #item.status="{ item }">
        <div class="text-left"> 
          <StatusReservation :status="item.status" />
        </div>
      </template>


      <!-- commande -->
      <template #item.commande="{ item }">
        <div class="text-center">

          <div class="text-left mb-2"> 
            <StatusReservation :status="item.status" />
          </div>
          <!-- Payment -->
          <div v-if="item.commande.payment_status === 'paid'"
              class="payment-badge" :class="item.commande.payment_status == 'paid'?'paid':'unpaid' " >
              <v-icon  icon=" mdi-credit-card-check" size="14"> </v-icon>
              {{ item.commande.total_ttc }} &euro;
          </div>

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


.service_title {
  margin: 2px 0px ;
  font-weight: 500 ;
  line-height: normal ;
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

    margin-bottom: 0px;
}


/* =========================================================
   DATE
   ========================================================= */

    .reservation-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 0px;
        margin-bottom: 6px;
    }


    .reservation-date {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        font-weight: 600;
        color: #3f3f46;
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
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 0px;
  }


   .paid{
     background: $success-color
    }

   .unpaid{
     background: $warning-color
    }

</style>