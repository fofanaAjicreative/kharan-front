<script setup lang="ts">

   import CoachFiche from '~/components/coach/CoachFiche.vue';

   const { $api } = useNuxtApp() ;

   const { getCategories, getChallenges,getServicesPrices } = UseDataService() ;


   useSeoMeta({ title: 'Coachs' }) ;
   

/* ---------------------------------------------------------------------------------- */ 

   const { showLoading, hideLoading } = useGlobalLoading() ;
   const { showWarningSnackbar } = useSnackbar() ;


   import { useDisplay } from 'vuetify' ;
   const { mobile } = useDisplay() ;
 
/* ---------------------------------------------------------------------------------- */ 

   let loaded  = ref(false) ;
   let loaded2  = ref(true)

   const mobile_filter_dialog = ref(false) ;


   // loading...
   const pending = ref(true) ; 
   let pending2 = ref(true) ; 
   const loading = ref(false)

    let annonces = ref<any>([]) ; 
    let count_annonces = ref(0) ; 
   
  // pagination
  let page = ref(1) ;
  let per_page = ref(10) ;
  let load_more = ref(true) ; 
  
   const categories = ref<any>([]) ;
   const challenges_init = ref([]) ;
   const challenges = ref<any>([]) ;

   const selected_challenges = ref([]) ; 
   const selected_categories = ref([]) ; 
   const selected_filters = ref<any>([]) ; 
   const filter = ref(false) ;

   let price_range_init = ref([0,0])
   let price_range = ref<any>([0,0])
   let price_filtred_ref = ref(false) ;

 
/* ----------------------- switchs ------------------------------------------------ */

   const is_super = ref(false) ;
   const is_certified = ref(false) ;


/* ----------------------------  sort ------------------------------------------ */


   const selectedSort = ref('')

   const sortOptions = [
      { label: 'Trier', value: '' },
      { label: 'Mieux notés', value: 'rating_coach_avg-DESC' },
      { label: 'Prix croissant', value: 'price_min-ASC' },
      { label: 'Prix décroissant', value: 'price_min-DESC' },
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


/* -------------------------------------  search---------------------------------------------- */

      const search = ref('') ;

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
 

   
/* ----------------- challenges list --------------------------------------------- */


   const search_challenge = ref('') ;

   const challengeTextChange = (value :any) => {
       console.log("selected_challenges",value.target.value);
       
       if(search_challenge.value.length>1){
        challenges.value = challenges_init.value.filter( (item:any)=>{
           return item.name.toLowerCase().includes(search_challenge.value.toLowerCase())
        })
      }else{
         challenges.value = challenges_init.value ;
      }
   };


   const challengeTextClear = (value :any) => {
        challenges.value = challenges_init.value ;
   };

 
 
/* -------------------------- formats---------------------------------------------------- */

   const selected_format_id = ref(null) ;
   const formats = ref([
     {
      id : "online" ,
      name : "En ligne"
     },
     {
      id : "in_person" ,
      name : "En personne"
     }
   ]) ;

   

 
/* ------------------------------- filters ---------------------------------------------------- */

   

   function formatSelected(){
      attributeChanged() ;
   }

/* ------------------------------------------------------------------------------- */

  function priceChanged(){
      price_filtred_ref.value = true ;
      attributeChanged() ;

       filter.value = !filter.value ;
   }

/* ------------------------------------------------------------------------------- */

     function loadMoreAnnonces(){

          page.value =  page.value+1 ;
         load_more.value = true ;

         getAnnoncesWithPagination()
      }

/* -------------------------------------------------------------------------------- */

    async function attributeChanged(){

         page.value =  1 ;
         annonces.value = [] ;

         pending2.value = true ;
         load_more.value = true ;

         getAnnoncesWithPagination()
   }


/* -------------------------- LOAD ANNONCE  --------------------------------------------------- */
    
      async function getAnnoncesWithPagination(){ 
          
         loading.value = true ;

         if(loaded.value){   // not first load
            showLoading() ;
         }


      // filter label list

        selected_filters.value = [] ;

        // search
        if(search.value.length>=3){

            let item = {
               name : "search" ,
               label : search.value ,
               id: crypto.randomUUID()
            }

           selected_filters.value.push(item) ;

        }

        // super 
        if(is_super.value == true){

            let item = {
               name : "is_super" ,
               label : "Super coach" ,
               id: crypto.randomUUID()
            }

           selected_filters.value.push(item) ;
         }

         // certified
         if(is_certified.value == true){
 
            let item = {
               name : "is_certified" ,
               label : "Coach certifié" ,
               id: crypto.randomUUID()
            }
            
           selected_filters.value.push(item) ;

         }

         // price
 
         if(price_filtred_ref.value){ 

             let item = {
               name : "price" ,
               label : `${price_range.value[0]} € - ${price_range.value[1]} €` ,
               id: crypto.randomUUID()
            }
            
           selected_filters.value.push(item) ;

          }

         // format
        const selected_format :any = formats.value.find((item :any)=>item.id == selected_format_id.value) ;
        if(selected_format){

            let item = {
               name : "format" ,
               label : selected_format.name ,
               id: crypto.randomUUID()
            }
            
           selected_filters.value.push(item) ;

         }

        // categories
        for(let id of selected_categories.value){
          let category :any = categories.value.find( (item :any) =>  item.id==id ) ;
          if(category){
             
            let item = {
               name : "category" ,
               label : category.name ,
               id: category.id
            }
            
            selected_filters.value.push(item) ;

          }
        }

 
        // challenges
        for(let id of selected_challenges.value){
          let challenge :any = challenges.value.find( (item :any) =>  item.id==id ) ;
          if(challenge){

             let item = {
               name : "challenge" ,
               label : challenge.name ,
               id: challenge.id
            }
            
            selected_filters.value.push(item) ;
          }
        }

      //----------------------- / List of selected filters
        
      let base_url = `annonces?`
      let url_sufix = '' ;

      // search
      if(search.value.length>2){
         url_sufix = url_sufix+`&search=${search.value}` ;
      }

      // categories
      url_sufix = url_sufix+`&category_ids=${JSON.stringify(selected_categories.value)}` ;

      // challenges
      url_sufix = url_sufix+`&challenge_ids=${JSON.stringify(selected_challenges.value)}` ;

      // format  
      let formats_string="[]" ;

      if(selected_format_id.value){
      let formats_array = [selected_format_id.value] ;
      formats_string = JSON.stringify(formats_array)
      }
      
      url_sufix = url_sufix+`&formats=${formats_string}` ;

      // super
      if(is_super.value==true){
         url_sufix = url_sufix+`&is_super=true` ;
      } 

      // certified
      if(is_certified.value==true){
         url_sufix = url_sufix+`&is_certified=true` ;
      } 
      
      // price
      if(/* price_range.value[1]>0 */ price_filtred_ref.value){

        let price_string = price_range.value.join("-") ;
        url_sufix = url_sufix+`&price=${price_string}` ;

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
            annonces.value.push(...res.data.annonces); 
         }
         
         count_annonces.value = res.data.annonce_count ;
         
         // load more
         if(count_annonces.value<=per_page.value*page.value){
            load_more.value = false ;
         }
   
      }).catch(error=>{

         console.log("Error:",error); 

         load_more.value = false ;

         showWarningSnackbar({
           title: 'Erreur',
           message:"Une erreur s'est produite."
         }) 

      }).finally(()=>{

         loaded.value = true  ;
         loading.value = false  ;

         pending2.value = false ;
         
         hideLoading() ;
 
      })


   }

  
/* ---------------------  Reinitialiser les filtres ------------------- */

        function resetFilter(){

            // price
            price_range.value[0] = price_range_init.value[0] ;
            price_range.value[1] = price_range_init.value[1] ;
            price_filtred_ref.value = false ;

            
            //selected_category_id.value =  null  ;

            // categories
            selected_categories.value = [] ;

            // challenges
            selected_challenges.value = [] ;

            //formats
            selected_format_id.value = null ;

            // search
            search.value = '' 
               
            //switch
            is_super.value = false ;
            is_certified.value = false ;

            // load annonces
            attributeChanged() ;

            // hide filter selections
            filter.value = false ;

        }


      function resetPrices(){

         price_range.value[0] = price_range_init.value[0] ;
         price_range.value[1] = price_range_init.value[1] ;
         price_filtred_ref.value = false ;

         // load annonces
         attributeChanged() ;

      
      }

/* --------------------------------- load data--------------------------------------------- */        
   

   function loadCategories(){

      getCategories().then((res :any )=>{
      categories.value = res.data.categoires ;
      //console.log("categories:", categories.value);        
    }).catch(error=>{
        console.log(error); 
    });

   }

   function loadServicesPrices(){

       getServicesPrices().then((res :any )=>{

         price_range_init.value = [res.data.prices.min_price,res.data.prices.max_price] ;
         price_range.value = [res.data.prices.min_price,res.data.prices.max_price] ;

       }).catch(error=>{
         console.log(error); 
      });

   }

   async function loadChallenges(){

      getChallenges().then((res :any )=>{
         challenges.value = res.data.challenges ;
         challenges_init.value = res.data.challenges ;
         // console.log("challenges:", challenges.value);   
      }).catch(error=>{
         console.log(error); 
      });

   }

/* ------------------------------------------ MOUNTED ------------------------------------ */

   onMounted(()=>{


      loadCategories() ;
      loadChallenges() ;
      
      loadServicesPrices() ;
     

      attributeChanged() ;

   });

/* ----------------------------------------------------------------------------------------- */

 
      const removeFilter = (item: any) => {
            
         switch(item.name){
            case 'search' :
               clearSearch() ;
               break; 

            case 'price' :
              resetPrices()
              break; 

            case 'is_super' :
              is_super.value = false ;
              attributeChanged() ;
              break; 

            case 'is_certified' :
              is_certified.value = false ;
              attributeChanged() ;
              break; 

            case 'format' :
              selected_format_id.value = null ;
              attributeChanged() ;
              break; 
            
            case 'category' :
             
               selected_categories.value = selected_categories.value.filter(  (cat_id :string) =>
                  { 
                     if(cat_id != item.id ) { return true  }
                     return false ;
                  }
               );

               attributeChanged() ;
               
              break; 

              case 'challenge' :
               selected_challenges.value = selected_challenges.value.filter(  (chal_id :string) => chal_id != item.id );
               attributeChanged() ;
               break; 


              default :
                  attributeChanged() ;
                  break; 
         }
 
          
      };

</script>


<template>

<div class="main"> 

<div class="main_content">

   
   <SkeletonCoachs v-if="!loaded" />

   <div v-if="loaded" class="d-flex w-100 justify-center mt-4"> 
      

      <!-- left side  -->
        <div class="left_side">

            <div  v-if="loaded2" class="left_side_content pt-0" > 


               <div class="mb-0">
                  <div  class="header d-flex justify-space-between align-center mb-1">
                     <!-- <h1 class="filter_title"> FILTRES </h1> -->
                     <!-- <v-btn  variant="text" color="#151B54"  rounded="0" class="slider_btn" @click="show_sidebar=false">
                        Masquer <v-icon icon="mdi-arrow-expand-left" class="ml-2" />
                     </v-btn> -->
                     <!-- <v-btn v-if="selected_filters.length" variant="flat" size="small" color="secondary"  rounded="0" class="slider_btn" @click="resetFilter()">
                        RÉINITIALISER <v-icon icon="mdi-filter-off" class="ml-2" />
                     </v-btn> -->
                   </div>
               </div>

               <!-- search -->
               <div class="mb-3 w-100"> 

                  <v-text-field
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
                      
               </div>

               <!-- certified  -->
               <v-expansion-panels model-value="1"  class="mb-4">
                     <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side-title" 
                        collapse-icon="mdi-minus" expand-icon="mdi-plus" > Coachs </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                              
                           <div class="pa-1">
                              <v-switch 
                                 v-model="is_super"
                                 label="Super coachs"
                                 @update:model-value="attributeChanged()"
                                 color="secondary"
                                 inset="square"
                                 true-icon="mdi-medal"
                                 false-icon="mdi-medal" 
                                 size="small"
                                 hide-details
                                 >
                              </v-switch>
                              <p class="attribute_description mb-0 mt-0"> Les coachs distingués pour la qualité de leur accompagnement. </p>

                           </div>

                           <v-divider class="mb-2 mt-2"></v-divider>

                            <div class="pa-1">

                              <v-switch 
                                 v-model="is_certified"
                                 label="Coachs certifiés"
                                 @update:model-value="attributeChanged()"
                                 color="secondary"
                                 inset="square"
                                 true-icon="mdi-certificate"
                                 false-icon="mdi-certificate"
                                 size="small"
                                 hide-details
                                 >
                              </v-switch>
                                <p class="attribute_description   mb-0 mt-0">
                                 Les coachs dont les justificatifs de compétences ont été vérifiés et validés.
                              </p>

                           </div>
                               
                        </v-expansion-panel-text>
                     </v-expansion-panel>
               </v-expansion-panels>
               <!-- / certified  -->

               <!-- categories -->
                <v-expansion-panels v-if="categories.length>0 " model-value="1"  class="mb-4 mt-6" >
                      <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title" 
                         collapse-icon="mdi-minus" expand-icon="mdi-plus" > Catégories </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                          <div> 
                              <v-checkbox class="shrink mr-0 mt-0"   
                                 color="secondary"
                                 density="compact"
                                 hide-details
                                 v-for="category in categories" :key="category.id"
                                 v-model="selected_categories"
                                 :label="category.name"
                                 :value="category.id" 
                                 @update:modelValue="attributeChanged()" >
                              </v-checkbox>

                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                  </v-expansion-panels>
               <!-- / categories -->


               <!-- challenges -->
                <v-expansion-panels v-if="categories.length>0 " model-value="1"  class="mb-4" >
                      <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title" 
                         collapse-icon="mdi-minus" expand-icon="mdi-plus" > OBjectifs </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                           
                          <div class="mt-4"> 

                              <v-text-field
                                 clearable
                                 :loading="false"
                                 size="x-small"
                                 prepend-inner-icon="mdi-magnify"
                                 density="compact"
                                 label="Filtrer"
                                 variant="outlined"
                                 hide-details
                                 single-line 
                                 v-model="search_challenge"
                                 @input="challengeTextChange"
                                 @click:clear="challengeTextClear">
                              </v-text-field>

                          </div>
                          <div class="mt-3"> 
                              <v-checkbox class="shrink mr-0 mt-0"   
                                 color="secondary"
                                 density="compact"
                                 hide-details
                                 v-for="challenge in challenges" :key="challenge.id"
                                 v-model="selected_challenges"
                                 :label="challenge.name"
                                 :value="challenge.id" 
                                 @update:modelValue="attributeChanged()" >
                              </v-checkbox>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                  </v-expansion-panels>
               <!-- / challenges -->

               <!-- formats -->
                <v-expansion-panels model-value="1"  class="mb-4" >
                      <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title"  collapse-icon="mdi-minus" expand-icon="mdi-plus" > Formats </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                           <div> 
                              <v-radio-group v-model="selected_format_id" column @update:modelValue="formatSelected()" >
                                    <div v-for="(format) in formats"  class="address">
                                          <v-radio 
                                                :label="`${format.name}  `"
                                                color="secondary"
                                                :value="format.id" > </v-radio>
                                    </div>
                              </v-radio-group>
                           </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                  </v-expansion-panels>
               <!-- / formats -->

                <!-- prix  -->
                  <v-expansion-panels model-value="1" class="mb-4">
                     <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title" 
                        collapse-icon="mdi-minus" expand-icon="mdi-plus" > Prix / Séance </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                     
                        <div class="pl-0 pt-2"> 
                           <v-range-slider
                              v-model="price_range"
                              :min="price_range_init[0]"
                              :max="price_range_init[1]"
                              :step="5"
                              hide-details
                              color="#424242"
                              @update:modelValue="null"
                              class="align-center">

                              <template v-slot:prepend>
                                 <span class="price_filter"> {{ price_range[0] }} &euro; </span>
                              </template>

                              <template v-slot:append>
                                    <span class="price_filter"> {{ price_range[1] }} &euro; </span>
                              </template>
                           </v-range-slider>
                        </div>

                        <div class="d-flex ga-2">

                           <v-btn 
                              @click="priceChanged()"
                              class="flex-grow-1 mt-4"
                              color="#ddd" 
                              prepend-icon="mdi-filter-outline"
                              variant="flat"
                              size="default"
                              >
                              Filtrer
                           </v-btn>

                           <v-btn 
                              v-if="price_filtred_ref"
                              @click="resetPrices()"
                              class="mt-4"
                              color="secondary"
                              prepend-icon="mdi-filter-remove-outline"
                              variant="flat"
                              size="default"
                              >
                              Effacer
                           </v-btn>

                        </div>
                        
                  </v-expansion-panel-text>
                  </v-expansion-panel>
               </v-expansion-panels>
            <!-- /prix  -->


                 
            </div>
            <!-- skeleton -->
            <div v-else >
               <div class="left_side_skeleton" > </div>
            </div>
             <!-- /skeleton -->
          
        </div>
      <!-- /left side  -->

      <!-- right right  -->
        <div  class="right_side" >
 
              <!-- mobile toolbar -->
               <div v-if="mobile"
                  class="mobile_toolbar d-flex justify-space-between align-center pa-2" > 

                     <v-btn 
                        v-if="selected_filters.length" 
                        @click="resetFilter()" 
                        variant="flat"
                        color="secondary"
                        size="small" 
                        rounded="0" > Effacer <v-icon icon="mdi-filter-remove-outline" class="ml-2" /> 
                     </v-btn>

                     <!-- btn -->
                        <v-btn
                           v-if="selected_filters.length>0"
                           @click="mobile_filter_dialog=true" 
                           variant="flat"  
                           color="#FFF"  
                           rounded="0"  
                           prepend-icon="mdi-filter-outline" 
                            >
                           FILTRE 
                            <v-badge  
                             :content="selected_filters.length" color="secondary" class="mr" >
                              &nbsp; &nbsp;
                            </v-badge> 
                        </v-btn>
                        <v-btn 
                           v-else @click="mobile_filter_dialog=true"  
                           append-icon="mdi-filter-outline" 
                           variant="flat"   >
                           Filtrer
                        </v-btn>
                      <!-- btn -->

                     <v-menu 
                        v-if="loaded && annonces.length"
                         >
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
 
               </div>


               <div v-if="mobile" class="filters_bar filters_bar_mobile ">

                  <v-slide-group show-arrows style="width: 100%;">
                     <v-slide-group-item
                        v-for="filter in selected_filters" :key="filter.id">
                         <v-chip
                           class="ma-2"
                           closable
                           size="small"
                           @click:close="removeFilter(filter)" >
                           {{ filter.label }}
                        </v-chip>

                     </v-slide-group-item>
                  </v-slide-group>

               </div>
            <!-- / mobile toolbar -->
          
            <!-- selected filter  -->

            <div v-if="!mobile" class="filters_bar">
               
             <v-row no-gutters class="align-center">

               <v-col cols="2">
                  <v-btn 
                     v-if="selected_filters.length" 
                     variant="flat" 
                     size="small" 
                     color="secondary" 
                     append-icon="mdi-filter-remove-outline"
                     @click="resetFilter()"> Effacer 
                  </v-btn>
               </v-col>

               <v-col cols="8">

                  <v-slide-group show-arrows style="width: 100%;">
                     <v-slide-group-item
                        v-for="filter in selected_filters" :key="filter.id">
                         <v-chip
                           class="ma-2"
                           closable
                           size="default"
                           @click:close="removeFilter(filter)" >
                           {{ filter.label }}
                        </v-chip>

                     </v-slide-group-item>
                  </v-slide-group>

               </v-col>

               <v-col cols="2">

                  <v-menu v-if="loaded && annonces.length">
                     <template #activator="{ props }">
                        <v-btn
                          v-bind="props"  
                          prepend-icon="mdi-sort" 
                           color="dark"
                           variant="text" 
                          size="default"
                          >
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
                  
               </v-col>
              </v-row>
            </div>
             
            <!-- /sort -->

            <!-- list annonce -->
            <div v-if="loaded && annonces.length"  class="list_main_row d-flex flex-wrap justify-center pa-3"  >
                <template v-for="(annonce,i) in annonces" :key="i" >
                      <CoachFiche :annonce="annonce" />
                </template>
                 
            </div>
            <!-- /list annonce -->

            <!-- no data -->
             <div class="no_data mt-16" v-if="!annonces.length && !loading">

                <div class="d-flex flex-column align-center justify-center"> 

                  <v-avatar
                     size="70"
                     color="info"
                     variant="tonal" >

                     <v-icon
                        icon="mdi-information-slab-box-outline"
                        size="34" >
                     </v-icon>

                  </v-avatar>

                 
                 <h4 class="text-center" > Aucune annonce trouvée </h4>
                </div>
            </div>
            <!-- no data -->

            <!-- load_more -->
              <div class="d-flex justify-center mt-4 mb-4" v-if="load_more && !loading">

                <v-btn  class="hidden-md-and-down"
                     @click="loadMoreAnnonces()" 
                     size="large"  
                     variant="outlined" 
                     color="secondary"   > 
                    Afficher plus  
                </v-btn>

                <v-btn  class="text-none hidden-md-and-up" 
                  @click="loadMoreAnnonces()" variant="outlined"  append-icon="mdi-chevron-downn" size="small"  
                  color="#424242" :rounded="0" > 
                    Afficher plus  
                </v-btn>
                
              </div>
            <!-- load_more -->

            <!-- skeleton -->
            <div v-else  class="w-100 pa-3">

               <div v-for="(product,i) in [1]" :key="i" >

               <div class="d-flex justify-center"> 
                  <div  class="image_horizontal_skeleton" > </div>        
               </div>
                  
                  <div class="d-flex justify-center">
                     <div class="image_vertical_skeleton"> </div>
                     <div class="image_vertical_skeleton"> </div>
                     <div class="image_vertical_skeleton"> </div>
                  </div>
               </div>
                  
            </div>
            <!-- skeleton -->

        </div>
      <!-- /right right  -->
    
   </div>

</div>

<!-- /main content -->

    <!-- mobile filter dialog   -->
    <v-dialog v-model="mobile_filter_dialog" fullscreen scrollable >

      <v-card class="filter-dialog pa-4" color="#F8F8F8">

          <!-- HEADER -->
         <div class="filter-header d-flex justify-space-between align-center mb-2">
               
               <v-badge v-if="selected_filters.length"
                  location="top right" 
                  color="error" 
                  :content="selected_filters.length"
                  class="ml-4"
                  >
                  <span class="filter_title"> FILTRE </span>
               </v-badge>

               <span v-else class="filter_title">FILTRE</span>

              <v-btn  
                  @click="mobile_filter_dialog=false"
                  variant="text" 
                  color="#000"  
                  >
                  Fermer <v-icon icon="mdi-window-close" class="ml-2" />
              </v-btn>
         </div>

         <!-- HEADER 2 -->
         <div class="filter-header pb-2" v-if="selected_filters.length">
               
            <v-slide-group show-arrows>
                     <v-slide-group-item
                        v-for="filter in selected_filters" :key="filter.id">
                         <v-chip
                           class="ma-2"
                           size="small"
                           color="secondary"
                           variant="flat"
                           closable
                           
                           @click:close="removeFilter(filter)" >
                           {{ filter.label }}
                        </v-chip>

                     </v-slide-group-item>
                  </v-slide-group>
               
         </div>

         
         <!-- CONTENU SCROLLABLE -->
         <v-card-text class="pa-2">
          <div class="mt-0">

             <!-- search -->
               <div class="mb-3 w-100 bg-white pa"> 

                  <v-text-field
                     clearable
                     :loading="false"
                     prepend-inner-icon="mdi-magnify"
                     density="compact"
                     label="Chercher"
                     variant="outlined"
                     hide-details
                     single-line 
                     v-model="search"
                     @click:clear="clearSearch()" 
                      >
                  </v-text-field>
                      
               </div>

               <!-- certified  -->
               <v-expansion-panels model-value="1"  class="mb-4">
                     <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side-title" 
                        collapse-icon="mdi-minus" expand-icon="mdi-plus" > Coachs </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                              
                           <div class="pa-1">
                              <v-switch 
                                 v-model="is_super"
                                 label="Super coachs"
                                 @update:model-value="attributeChanged()"
                                 color="secondary"
                                 inset="square"
                                 true-icon="mdi-medal"
                                 false-icon="mdi-medal" 
                                 size="small"
                                 hide-details
                                 >
                              </v-switch>
                              <p class="attribute_description mb-0 mt-0"> N'affiche que les professeurs les mieux notés et les plus fiables </p>

                           </div>

                           <v-divider class="mb-2 mt-2"></v-divider>

                            <div class="pa-1">

                              <v-switch 
                                 v-model="is_certified"
                                 label="Coachs certifiés"
                                 @update:model-value="attributeChanged()"
                                 color="secondary"
                                 inset="square"
                                 true-icon="mdi-certificate"
                                 false-icon="mdi-certificate"
                                 size="small"
                                 hide-details
                                 >
                              </v-switch>
                                <p class="attribute_description   mb-0 mt-0">
                                 Les professeurs détiennent une certification en enseignement qui atteste de leurs compétences
                              </p>

                           </div>
                               
                        </v-expansion-panel-text>
                     </v-expansion-panel>
               </v-expansion-panels>
               <!-- / certified  -->

               <!-- categories -->
                <v-expansion-panels v-if="categories.length>0 " model-value="1"  class="mb-4 mt-6" >
                      <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title" 
                         collapse-icon="mdi-minus" expand-icon="mdi-plus" > Catégories </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                          <div> 
                              <v-checkbox class="shrink mr-0 mt-0"   
                                 color="secondary"
                                 density="compact"
                                 hide-details
                                 v-for="category in categories" :key="category.id"
                                 v-model="selected_categories"
                                 :label="category.name"
                                 :value="category.id" 
                                 @update:modelValue="attributeChanged()" >
                              </v-checkbox>

                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                  </v-expansion-panels>
               <!-- / categories -->


               <!-- challenges -->
                <v-expansion-panels v-if="categories.length>0 " model-value="1"  class="mb-4" >
                      <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title" 
                         collapse-icon="mdi-minus" expand-icon="mdi-plus" > OBjectifs </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                           
                          <div class="mt-4"> 

                              <v-text-field
                                 clearable
                                 :loading="false"
                                 size="x-small"
                                 prepend-inner-icon="mdi-magnify"
                                 density="compact"
                                 label="Filtrer"
                                 variant="outlined"
                                 hide-details
                                 single-line 
                                 v-model="search_challenge"
                                 @input="challengeTextChange"
                                 @click:clear="challengeTextClear">
                              </v-text-field>

                          </div>
                          <div class="mt-3"> 
                              <v-checkbox class="shrink mr-0 mt-0"   
                                 color="secondary"
                                 density="compact"
                                 hide-details
                                 v-for="challenge in challenges" :key="challenge.id"
                                 v-model="selected_challenges"
                                 :label="challenge.name"
                                 :value="challenge.id" 
                                 @update:modelValue="attributeChanged()" >
                              </v-checkbox>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                  </v-expansion-panels>
               <!-- / challenges -->

               <!-- formats -->
                <v-expansion-panels model-value="1"  class="mb-4" >
                      <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title"  collapse-icon="mdi-minus" expand-icon="mdi-plus" > Formats </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                           <div> 
                              <v-radio-group v-model="selected_format_id" column @update:modelValue="formatSelected()" >
                                    <div v-for="(format) in formats"  class="address">
                                          <v-radio 
                                                :label="`${format.name}  `"
                                                color="secondary"
                                                :value="format.id" > </v-radio>
                                    </div>
                              </v-radio-group>
                           </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                  </v-expansion-panels>
               <!-- / formats -->

                <!-- prix  -->
                  <v-expansion-panels model-value="1" class="mb-4">
                     <v-expansion-panel value="1" elevation="0" >
                        <v-expansion-panel-title class="side_title" 
                        collapse-icon="mdi-minus" expand-icon="mdi-plus" > Prix / Séance </v-expansion-panel-title>
                        <v-expansion-panel-text class="expansion-content">
                     
                        <div class="pl-0 pt-2"> 
                           <v-range-slider
                              v-model="price_range"
                              :min="price_range_init[0]"
                              :max="price_range_init[1]"
                              :step="5"
                              hide-details
                              color="#424242"
                              @update:modelValue="null"
                              class="align-center">

                              <template v-slot:prepend>
                                 <span class="price_filter"> {{ price_range[0] }} &euro; </span>
                              </template>

                              <template v-slot:append>
                                    <span class="price_filter"> {{ price_range[1] }} &euro; </span>
                              </template>
                           </v-range-slider>
                        </div>

                        <div class="d-flex ga-2">

                           <v-btn 
                              @click="priceChanged()"
                              class="flex-grow-1 mt-4"
                              color="#ddd" 
                              prepend-icon="mdi-filter-outline"
                              variant="flat"
                              size="default"
                              >
                              Filtrer
                           </v-btn>

                           <v-btn 
                              v-if="price_filtred_ref"
                              @click="resetPrices()"
                              class="mt-4"
                              color="secondary"
                              prepend-icon="mdi-filter-remove-outline"
                              variant="flat"
                              size="default"
                              >
                              Effacer
                           </v-btn>

                        </div>
                        
                  </v-expansion-panel-text>
                  </v-expansion-panel>
               </v-expansion-panels>
            <!-- /prix  -->

 
                
          </div>
          </v-card-text>
        <!-- /CONTENU SCROLLABLE -->


         <!-- FOOTER -->
        <v-card-actions class="filter-footer">
               <v-btn 
                  v-if="selected_filters.length"
                  @click="resetFilter()"
                  color="error"
                  prepend-icon="mdi-filter-remove-outline"
                  variant="flat"
                  size="default"
                  rounded="0"
                  >
                  Effacer
               </v-btn>


               <v-btn 
                  @click="mobile_filter_dialog=false"
                  class="flex-grow-1"
                  color="#000" 
                  variant="flat"
                  size="default"
                  rounded="0"
                  > Afficher 
                  <span 
                     v-if="selected_filters.length" 
                     class="ml-1">({{ count_annonces }})</span>
                     
               </v-btn>
 

        </v-card-actions>

            

      </v-card>
      

   </v-dialog>
    <!-- / mobile filter dialog   -->
</div>

</template>

<style lang="scss" scoped>

   .main_content{
      padding: 10px 100px ;
   }

   @media (max-width: 1024px) {
      .main_content{
         padding: 0px 0px ;
      }
   }

   .left_side{
      width: 340px;
      background: #f8f8f9 ;
      display: flex;
      justify-content: center;
   }

     .left_side_content{
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      padding: 10px;
      width: 320px ;

      .title{
         font-size: 18px ;
         font-weight: bold ;
      }
   }


    @media (max-width: 1024px) {
      .left_side{
        display: none;
      }
    }


   .right_side{
      width: calc(100% - 320px);
      position: relative;
      background: #fff;
      overflow: visible !important;
      padding: 0px 20px;
   }

   @media (max-width: 1024px) {
      .right_side{
         width: 100%;
      }
   }

   @media (max-width: 400px) {
      .right_side{
         padding: 0px 0px;
      }
   }



  /* ----------------------- filter -------------------------------------- */


      .filters_bar {
         position: sticky;
         top: 70px ;
         z-index: 100;
         background: white;
         padding: 0px 0px;
      }

      .filters_bar_mobile {
         top: 118px ;
      }

      .mobile_toolbar{
         width: 100%;
         position: fixed;
         top: 69px;
         left: 0px;
         z-index: 1000;
         background: #fff;
         height: 50px;
      }
      
      .filter_title{
         font-size: 17px ;
         font-weight: 800;
         letter-spacing: 0px;
         border-bottom: 1px #000 solid ;
      }


      @media (max-width: 768px) {
          .filter_title{
            font-size: 17px ;
          }

      }

 
    


    
  
    /* --------------------------------------------------------- */

         .v-expansion-panel-title{
            font-size: 16px ;
            min-height: 40px;
            padding-left: 8px;
            
         }

       
      .side_title{

         text-transform: uppercase ;
         padding: 8px ;
         padding-left: 12px ;
         background: #FFF ;
         font-size: 14px ;
         min-height: 50px ;
      }

      .v-expansion-panel--active > .v-expansion-panel-title:not(.v-expansion-panel-title--static){
          min-height: 50px  
      }

      .expansion-content{

         background: #FFF !important;
         padding: 0px !important ;
         max-height: 400px;
         overflow-y: auto;

         scrollbar-color:  $secondary-color #f8f8f9;
         scrollbar-width: thin;

            .v-checkbox .v-selection-control {
               min-height: 35px !important ;
            }


            
      }

      .attribute_description{
         color: #707070;
         font-size: 13px ;
      }

      .v-checkbox .v-selection-control{
          min-height:35px !important ;
      }

   /* -------------------------------------------------------------------------------- */

      .sort_select .v-input__control .v-field{
         box-shadow: none !important  ;
         border: 1px #eee solid;
      }

      .v-field--variant-solo, .v-field--variant-solo-filled {
         box-shadow: none !important ;
      }

      .fixed_toolbar {
         position: fixed;
         top: 200;
         left: 0;
         right: 0;
         z-index: 1000;
      }

/* ------------------------------------------------------------ */
      .no_data{
         height: 300px;
         display: flex ;
         flex-direction: column ;
         align-items: center ;
         justify-content: center ;
      }

/* ------------------------------ filter ------------------------------------- */


 .filter-dialog {
    height: 100%;
    display: flex;
    flex-direction: column;
 }

.filter-header {
    flex: 0 0 auto;
}

.filter-content {
    flex: 1 1 auto;
    overflow-y: auto;
}

   .filter-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      padding: 10px 10px;
      margin-bottom: 0px;
   }

       
</style>