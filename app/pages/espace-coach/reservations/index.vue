<script setup lang="ts">

import ReservationCardCoach from '~/components/espace/ReservationCardCoach.vue';
import FilterReservations from '~/components/espace/FilterReservations.vue';
import EmptyReservation from '~/components/espace/EmptyReservation.vue'
 
  const { $api } = useNuxtApp() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

/* ------------------------------------------------------------------------ */

  const loaded = ref(false) ;
  let loading = ref(false) ; 
 
  // pagination
  let per_page = ref(8) ;

  const tab = ref('next') ;

  let page_next = ref(1) ;
  let count_reservations_next = ref(0) ; 


  let page_past = ref(1) ;
  let count_reservations_past = ref(0) ; 

  let page_rejected = ref(1) ;
  let count_reservations_rejected = ref(0) ; 
 
 

  const next_reservations = ref<any>([]) ;
  const past_reservations = ref<any>([]) ;
  const rejected_reservations = ref<any>([]) ;


/* ----------------------------  NEXT --------------------------------------------*/

    const search_next = ref('') ;
    const status_next = ref('') ;
    const sort_next = ref('') ;
   
 
    async function loadNextReservations(){ 

      loading.value = true ;
      showLoading()

      let base_url = `coach/next_reservations?`
      let url_sufix = '' ;

        // search
        if(search_next.value.length>2){
            url_sufix = url_sufix+`&search=${search_next.value}` ;
        }

        // status
        if(status_next.value){
           url_sufix = url_sufix+`&status=${status_next.value}` ;
        }

        //sort
        if(sort_next.value){
           url_sufix = url_sufix+`&sort=${sort_next.value}` ;
        }
       
        // page & per_page
         url_sufix = url_sufix+`&page=${page_next.value}&per_page=${per_page.value}` ;

        // complete url
        let url = base_url+url_sufix ;


      $api(url,{ method: 'GET' }).then((res :any) =>{

        //console.log("NEXT:",res.data );

        if(res.data.reservations && Array.isArray(res.data.reservations) ){
          next_reservations.value.push(...res.data.reservations); 
        }

        count_reservations_next.value = res.data.total ;
        loaded.value = true ;

      }).catch(error=>{
        console.log("Error:",error); 
       
      }).finally( ()=>{

        loading.value = false ;
         hideLoading() ;

      })
               
  }
 
    const has_more_next  = computed(() => {
         return (count_reservations_next.value >= per_page.value*page_next.value)     
    })


    function loadMoreNext(){

        if(loading.value || !has_more_next.value){
              return
        }
      
        // page & per_page
        page_next.value++ ;
        loadNextReservations() ;
    }


/* --------------------------------  PAST --------------------------------------------------*/

    const search_past = ref('') ;
    const status_past = ref('') ;
    const sort_past = ref('') ;
   
 
  async function loadPastReservations(){ 

      loading.value = true ;
      showLoading()

      let base_url = `coach/past_reservations?`
      let url_sufix = '' ;

        // search
        if(search_past.value.length>2){
          url_sufix = url_sufix+`&search=${search_past.value}` ;
        }

        // status
        if(status_past.value){
          url_sufix = url_sufix+`&status=${status_past.value}` ;
        }

        //sort
        if(sort_past.value){
          url_sufix = url_sufix+`&sort=${sort_past.value}` ;
        }
       
        // page & per_page
         url_sufix = url_sufix+`&page=${page_past.value}&per_page=${per_page.value}` ;

        // complete url
        let url = base_url+url_sufix ;


      $api(url,{ method: 'GET' }).then((res :any) =>{

        //console.log("PAST:",res.data );

        if(res.data.reservations && Array.isArray(res.data.reservations) ){
          past_reservations.value.push(...res.data.reservations); 
        }

        count_reservations_past.value = res.data.total ;
        loaded.value = true ;

      }).catch(error=>{
        console.log("Error:",error); 
      }).finally( ()=>{

        loading.value = false ;
        hideLoading() ;

      })
               
  }
 
    const has_more_past  = computed(() => {
         return (count_reservations_past.value >= per_page.value*page_past.value)     
    })


    function loadMorePast(){

        if(loading.value || !has_more_past.value){
              return
        }
      
        // page & per_page
        page_past.value++ ;
        loadPastReservations() ;
    }


/* --------------------------------  REJECTED --------------------------------------------------*/

  const search_rejected = ref('') ;
  const status_rejected = ref('rejected') ;
  const sort_rejected = ref('') ;
   
 
  async function loadRejectedReservations(){ 

      loading.value = true ;
      showLoading()

      let base_url = `coach/reservations?`
      let url_sufix = '' ;

        // search
        if(search_rejected.value.length>2){
          url_sufix = url_sufix+`&search=${search_rejected.value}` ;
        }

        // status
        if(status_rejected.value){
          url_sufix = url_sufix+`&status=${status_rejected.value}` ;
        }
       

        //sort
        if(sort_rejected.value){
          url_sufix = url_sufix+`&sort=${sort_rejected.value}` ;
        }
       
        // page & per_page
         url_sufix = url_sufix+`&page=${page_rejected.value}&per_page=${per_page.value}` ;

        // complete url
        let url = base_url+url_sufix ;


      $api(url,{ method: 'GET' }).then((res :any) =>{

        // console.log("REJECTED:",res.data );

        if(res.data.reservations && Array.isArray(res.data.reservations) ){
          rejected_reservations.value.push(...res.data.reservations); 
        }

        count_reservations_rejected.value = res.data.total ;
        loaded.value = true ;

      }).catch(error=>{
        console.log("Error:",error); 
      }).finally( ()=>{

        loading.value = false ;
        hideLoading() ;

      })
               
  }
 
    const has_more_rejected  = computed(() => {
         return (count_reservations_rejected.value >= per_page.value*page_rejected.value)     
    })


    function loadMoreRejected(){

        if(loading.value || !has_more_rejected.value){
              return
        }
      
        // page & per_page
        page_rejected.value++ ;
        loadRejectedReservations() ;
    }
 
  /* ----------------------------------------------------------------------------------------- */

      const onFilter = ({ tab, filter} :any) => {


          switch (tab) {

              case 'next':
                console.log('Filtre pour À venir', filter);

                page_next.value =  1 ;
                next_reservations.value = [] ;


                search_next.value = filter.search ;
                status_next.value = filter.status ;
                sort_next.value = filter.sort ;
                
                loadNextReservations() ;

                break;

              case 'past':
                console.log('Filtre pour Passées', filter);

                page_past.value =  1 ;
                past_reservations.value = [] ;


                search_past.value = filter.search ;
                status_past.value = filter.status ;
                sort_past.value = filter.sort ;
                
                loadPastReservations() ;

                break;
 
              case 'rejected':
                console.log('Filtre pour Rejetés', filter);

                page_rejected.value =  1 ;
                rejected_reservations.value = [] ;


                search_rejected.value = filter.search ;
                //status_rejected.value = filter.status ;
                sort_rejected.value = filter.sort ;
                
                loadRejectedReservations()

                  break;
          }

     };

  /* ------------------------------------------------------------------------------------------- */

    onMounted(() => {

      loadNextReservations()   ; 
      loadPastReservations()   ;                   
      loadRejectedReservations()   ;     
      
    });
 
</script>

<template>
  
 <SkeletonDashboard v-if="!loaded"  />
 <section v-else class="mb-2 profil_form" >

    <v-sheet elevation="0">

        <v-tabs 
          v-model="tab" 
          color="secondary" 
          bg-color="#F4F4F4"
          grow show-arrows >
          <v-tab value="next" > À vénir </v-tab>
          <v-tab value="past" > Passés </v-tab>
          <v-tab value="rejected" > Rejetés  </v-tab>
        </v-tabs>

        <v-divider></v-divider>

      <v-tabs-window v-model="tab">
            
    <!-- ---------------------------------  next  ------------------------------------------ -->

          <v-tabs-window-item value="next">
              <v-sheet class="pa-5"  >
                 <div class="tab_content" >
                  
                    <FilterReservations :tab="tab" @filter="onFilter" />
                       
                    <div v-if="next_reservations.length">

                      <template v-for="reservation in next_reservations" :key="reservation.id">
                          <ReservationCardCoach :reservation="reservation"/>
                      </template>
          
                      <!-- more  -->
                          <div class="text-center mt-6">
                              <v-btn v-if="has_more_next"
                                  color="secondary"
                                  
                                  variant="outlined"
                                  size="small"
                                  rounded="4"
                                  @click="loadMoreNext()" > Afficher plus
                              </v-btn>
                          </div>
                      <!-- / more  -->

                    </div>
                    <EmptyReservation v-if="!loading && !next_reservations.length" />
                 
                 </div>
              </v-sheet>
            </v-tabs-window-item>

    <!-- --------------------------------- past ------------------------------------------ -->

            <v-tabs-window-item value="past">
              <v-sheet class="pa-5"  >
                 <div class="tab_content" >
                    
                      <FilterReservations  :tab="tab" @filter="onFilter" />
                      <div v-if="past_reservations.length">

                       <template v-for="reservation in past_reservations" :key="reservation.id">
                            <ReservationCardCoach :reservation="reservation"  />
                        </template>
            
                        <!-- more  -->
                            <div class="text-center mt-6">
                                <v-btn v-if="has_more_past"
                                    color="secondary"
                                    variant="outlined"
                                    size="small"
                                    rounded="4"
                                    @click="loadMorePast()" > Afficher plus
                                </v-btn>
                                </div>
                        <!-- / more  -->

                      </div>
                      <EmptyReservation v-if="!loading && !past_reservations.length" />

                 </div>
              </v-sheet>
            </v-tabs-window-item>

        <!-- --------------------------------- rejected ------------------------------------------ -->
            
            <v-tabs-window-item value="rejected">
              <v-sheet class="pa-5"  >
                 <div class="tab_content" >
                    
                   <FilterReservations  :tab="tab" @filter="onFilter" />

                    <div v-if="rejected_reservations.length">

                      <template v-for="reservation in rejected_reservations" :key="reservation.id">
                          <ReservationCardCoach :reservation="reservation"  />
                      </template>
          
                      
                      <!-- more  -->
                        <div class="text-center mt-6">
                            <v-btn v-if="has_more_rejected"
                                color="secondary"
                                
                                variant="outlined"
                                size="small"
                                rounded="4"
                                @click="loadMoreRejected()" > Afficher plus
                            </v-btn>
                        </div>
                      <!-- / more  -->
                      

                    </div>
                    <EmptyReservation v-if="!loading && !rejected_reservations.length" />

                 </div>
              </v-sheet>
            </v-tabs-window-item>

            


          </v-tabs-window>


      </v-sheet>
  </section>



</template>

<style scoped lang="scss">

  .page_content{
    max-width: 900px ;
  }

  .stats_item{
    display: flex;
    flex-direction: column;
    align-items: center ;
    justify-content: center;
    padding: 10px ;
   /*  border: 1px #ddd solid ; */
    width: 250px ;
    height: 100px;
    box-shadow: 0 2px 5px rgba(0,0,0,.08);
     border-radius: 6px;
     .value{
       font-size: 24px;
       font-weight: bold ;
       color: #000 ;
       margin: 0px;
     }
     .title{
       font-size: 14px;
       color: #424242;
       margin: 0px;
       
     }
  }
 
   .rdv_item{
      border: 1px #eee solid ;
       box-shadow: 0 12px 25px rgba(0,0,0,.08);
      padding:10px ;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .coach_name{
        margin: 0px ;
        font-size: 15px ;
        font-weight: bold ;
        color: #000;
    }


    .annonce_title{
        margin: 0px ;
        font-size: 12px ;
        color: #424242;
        margin-bottom: 10px;
    }

    .service_title{
         margin: 0px ;
        font-size: 14px ;
        color: #424242;
        a{
          text-decoration: none ;
        }
    }
    .service_date{
        margin: 0px ;
        margin-bottom: 10px;
        margin-top: 4px;
        font-size: 14px ;
        color: #424242;
        font-weight: bold ;
    }


   
</style>