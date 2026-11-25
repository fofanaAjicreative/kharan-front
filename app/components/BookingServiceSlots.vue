
<script setup lang="ts" >

   const { $api } = useNuxtApp() ;
   const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;

   const { getUserTimeZone ,isAuthenticated, showLoginDialog } = useAuth() ; 

   // ------------------- timezone -------------------------------------

      import dayjs from 'dayjs'
      import utc from 'dayjs/plugin/utc'
      import timezone from 'dayjs/plugin/timezone'

      dayjs.extend(utc)
      dayjs.extend(timezone)

      // const selectedTimezone = ref(Intl.DateTimeFormat().resolvedOptions().timeZone ) ;
      const selectedTimezone = ref(getUserTimeZone()) ;
      
 
      const timezones = Intl.supportedValuesOf('timeZone').map(tz => {
         const offset = dayjs().tz(tz).format('Z')
         return {
            title: `(GMT${offset}) ${tz}`,
            value: tz
         }
      }) 

      const userTimeZone = timezones.find( (tz :any)=> tz.value == selectedTimezone.value) ;

   
      const reservation_format = ref()

  //---------------------------- props  -------------------------------------------

      const props = defineProps({

            id: {
               type: String,
               required: true
            },
            format: {
               type: String,
               required: true
            },
            annonce: {
              type: Object,
              required: true,
            },

            booking_loading: {
              type: Boolean,
              required: true,
            },
            commande_id: {
              type: String,
              required: false ,
            }
      })

      
      const id = props.id  ;          
      const emit = defineEmits(['selectSlot']) ;

   //------------------- format  

   if(props.format == ReservationFormat.BOTH){
      reservation_format.value = ReservationFormat.ONLINE
   }else if(props.format == ReservationFormat.ONLINE){
      reservation_format.value = ReservationFormat.ONLINE
   }else if(props.format == ReservationFormat.IN_PERSON){
      reservation_format.value = ReservationFormat.IN_PERSON
   }
 
   // ------------------- data -------------------------------------

         const service = ref<any>(null) ;


         const loading = ref(false) ;
         const saving = ref(false) ;
         const days :any = ref([])

         const number_of_day = ref(4) ;
         const visibleSlots = ref(5) ;
         
         const selected_slot = ref<any>(null) ;
         const selected_date = ref<any>(null) ;

         const booking_date = ref<any>(null) ;


/* ------------------------------------------------------------------------------- */

   function selectSlot(date: string, slot: string) {

      selected_date.value = date ;
      selected_slot.value = slot ;

      console.log(date) ;
      console.log(slot) ;

   }

/* -------------------------------------------------------------------------- */
/*                 NEW                                   */
/* -------------------------------------------------------------------------- */


// Prochaine disponibilité trouvée
const nextAvailableDate = ref<string | null>(null);

// Date actuellement affichée
const currentDate = ref(
  dayjs()
    .tz(selectedTimezone.value)
    .startOf('day')
    .add(3, 'day')
    .format('YYYY-MM-DD')
);


/* -------------------------------------------------------------------------- */
/*                  LIMITES DE RÉSERVATION                                   */
/* -------------------------------------------------------------------------- */

// Première date réservable : aujourd'hui + 3 jours
const minBookingDate = computed(() =>
  dayjs()
    .tz(selectedTimezone.value)
    .startOf('day')
    .add(3, 'day')
    .format('YYYY-MM-DD')
)

// Dernière date réservable : aujourd'hui + 3 mois
const maxBookingDate = computed(() =>
  dayjs()
    .tz(selectedTimezone.value)
    .startOf('day')
    .add(1, 'month')
    .format('YYYY-MM-DD')
)

// Ajouter des jours en respectant le fuseau horaire
function addDays(date: string, days: number): string {
  return dayjs
    .tz(date, selectedTimezone.value)
    .add(days, 'day')
    .format('YYYY-MM-DD')
}

// Fin de la période affichée
function getPeriodEnd(startDate: string): string {
  const endDate = addDays(startDate, number_of_day.value - 1);

  return endDate > maxBookingDate.value
    ? maxBookingDate.value
    : endDate;
}

// Vérifier si on peut revenir en arrière
const canGoPrevious = computed(() =>
  currentDate.value > minBookingDate.value
)

// Vérifier si on peut avancer
const canGoNext = computed(() =>
  currentDate.value &&
  addDays(currentDate.value, number_of_day.value) <= maxBookingDate.value
)

/* -------------------------------------------------------------------------- */
/*                           CHARGEMENT                                      */
/* -------------------------------------------------------------------------- */

   async function loadCurrentSlots() {

      if (!selectedTimezone.value) return ;

      loading.value = true;

      selected_slot.value = null;
      selected_date.value = null;

      nextAvailableDate.value = null;
      visibleSlots.value = 5;

      try {

         const startDate = currentDate.value;
         const endDate = getPeriodEnd(startDate); // addDays

         // Charger la période actuelle
         const results = await fetchServiceSlots(startDate, endDate);

         days.value = results;

         // Vérifier si au moins un créneau existe
         const hasSlots = results.some(
            (day: any) => day.slots?.length > 0
         );

         // Si aucun créneau, rechercher la prochaine disponibilité
         if(!hasSlots) {

            const searchStartDate = addDays(endDate, 1);

            if (searchStartDate <= maxBookingDate.value) {

               nextAvailableDate.value = await findNextAvailableDate( searchStartDate );

            }

         }

      } catch (error) {

         console.error('Erreur chargement créneaux:', error);

      } finally {

         loading.value = false;

      }
   }

/* -------------------------------------------------------------------------- */
/*                           NAVIGATION                                      */
/* -------------------------------------------------------------------------- */

function previousWeek() {

  if (!canGoPrevious.value || loading.value) return

  const previousDate = addDays(
    currentDate.value,
    -number_of_day.value
  )

  // Ne jamais descendre sous la date minimale
  currentDate.value = previousDate < minBookingDate.value
    ? minBookingDate.value
    : previousDate

  loadCurrentSlots()
}

/* -------------------------------------------------------------------------- */

function nextWeek() {

  if (!canGoNext.value || loading.value) return

  currentDate.value = addDays(
    currentDate.value,
    number_of_day.value
  )

  loadCurrentSlots()
}

/* -------------------------------------------------------------------------- */

function timezoneChanged() {

  currentDate.value = minBookingDate.value

  loadCurrentSlots()
}
 
/* -------------------------------------------------------------------------- */
/*                           FORMAT DATES                                      */
/* -------------------------------------------------------------------------- */
   
   function formatDate(date: string) {

      return new Intl.DateTimeFormat('fr-FR', {
         day: 'numeric',
         month: 'short',
         timeZone: selectedTimezone.value
      }).format(
         dayjs.tz(date, selectedTimezone.value).toDate()
      )
   }

   function formatWeekday(date: string) {

      return new Intl.DateTimeFormat('fr-FR', {
         weekday: 'long',
         timeZone: selectedTimezone.value
      }).format(
         dayjs.tz(date, selectedTimezone.value).toDate()
      )
   }

/* -------------------------------------------------------------------------- */
/*            NO SLOTS                                                         */
/* -------------------------------------------------------------------------- */
   

const hasAvailableSlots = computed(() => {
  return days.value.some((day :any) => day.slots.length > 0);
});

/* ------------------------------------------------------------------------------- */


   function showMore() {
     visibleSlots.value += 5
   }

/* ------------------------------------------------------------------------------- */

   const hasMore = computed( () =>
      days.value.some(
         (day :any) => day.slots.length > visibleSlots.value
      )
   )

 

/* ------------------------------------------------------------------------------- */


   window.addEventListener("resize", () => {

         const card = document.querySelector('.slots_card');
         if (card) {

            const width = card.getBoundingClientRect().width;
            
            if(width<400){
               number_of_day.value = 3  ;
               console.log(`Precise width: ${width}`);
            }else{
               number_of_day.value = 4  ;
            }
           
         }
  
    });  

 
 
   //-----------------------------------------------------------------------------------------------

      function getServiceSlots(start_date :string, end_date :string){
        
         selected_slot.value = null ;
         selected_date.value = null ;

         if(!selectedTimezone.value){
            
            showErrorSnackbar({
               title: 'Données manquantes',
               message: 'Selectionner votre fuseau horaire'
            }) ;

            return;
         }

         loading.value  = true ;
         visibleSlots.value = 5


         const post_data = {
          booking_date_start : start_date ,
          booking_date_end : end_date ,
          timezone : selectedTimezone.value 
        }


        $api(`/services/${id}/availables_slots`,{
          method: 'POST',
          body:post_data
        }) .then((res :any )=>{

            days.value  = res.data ;
            loading.value  = false ;

            console.log("SLOTS:", days.value );


         }).catch(error=>{
            console.log(error); 
            loading.value  = false ;
         });
         
      }

   //-----------------------------------------------------------------------------------------------

         async function fetchServiceSlots( startDate: string, endDate: string ): Promise<any[]> {

            const res: any = await $api(`/services/${id}/availables_slots`, {
               method: 'POST',
               body: {
                  booking_date_start: startDate,
                  booking_date_end: endDate,
                  timezone: selectedTimezone.value ,
                  commande_id: props.commande_id
               }
            });

            return res.data ?? [];
         }


//----------------------------------------------------------------------------------------------------------

   async function findNextAvailableDate( startDate: string ): Promise<string | null> {

      let cursor = startDate;

      // Recherche par périodes de 7 jours
      while (cursor <= maxBookingDate.value) {

         // Fin de la période de recherche
         const requestedEnd = addDays(cursor, 6);

         const endDate = requestedEnd > maxBookingDate.value
            ? maxBookingDate.value
            : requestedEnd;

         // Appel API
         const results = await fetchServiceSlots(cursor, endDate);

         // Chercher la première date contenant des créneaux
         const availableDay = results.find(
            (day: any) => day.slots?.length > 0
         );

         if (availableDay) {
            return availableDay.date;
         }

         // Passer à la période suivante
         cursor = addDays(endDate, 1);
      }

      // Aucune disponibilité jusqu'à la limite des 3 mois
      return null;

   }

//----------------------------------------------------------------------------------------------------------

   function goToNextAvailableDate() {

   if (!nextAvailableDate.value) return;

      currentDate.value = nextAvailableDate.value;

      // Recharger les créneaux à partir de cette date
      loadCurrentSlots();

   }


//----------------------------------------------------------------------------------------------------------


      function confirmReservation(){

         if(!isAuthenticated.value){
            showLoginDialog() ;
            return ;
         }
       
          
         if(
            !selected_date.value || 
            !selected_slot.value || 
            !selectedTimezone.value ||
            !reservation_format.value
         ){
            
            showErrorSnackbar({
               title: 'Selectionner un créneau',
               message: 'Veuillez selectionner un créneau pour continuer'
            }) ;
             
            return;
         }

         booking_date.value  = dayjs.tz(`${selected_date.value} ${selected_slot.value}`, selectedTimezone.value).format() ;
        
         console.log("formatted date:", selected_date.value);
         console.log("selected slot:", selected_slot.value);
         console.log("booking_date:", booking_date.value );
  
         // saving.value = true ;

         emit('selectSlot', { 
                              booking_date: booking_date.value , // '2027-10-28T09:00:00Z', // booking_date.value  , 
                              format: reservation_format.value ,
                            }) ;
          
         // saving.value = false ;
      }
 
   //------------------------------------------------------------------------------------------

      const isSelected = (date :any , slot: any) => {
         return ( selected_date.value === date ) && ( selected_slot.value === slot ) 
      }

   // ----------------------- get service details  -------------------------------

      function getServiceDetails(){

         $api(`/annonces/services/${id}`).then((res :any )=>{
            service.value  = res.data.service ;
         }).catch(error=>{
               console.log(error); 
         });

      }

   //----------------------- mounted -------------------------------

      onMounted( async () => {  

         // service infos
         getServiceDetails() ;

         // screen size
         const card = document.querySelector('.slots_card');
         if (card) {
            const width = card.getBoundingClientRect().width;
            number_of_day.value = width < 400 ? 3 : 4;
            
         }
         
         // Première période : aujourd'hui + 3 jours
         currentDate.value = minBookingDate.value;
         loadCurrentSlots();



      }); 

</script>


<template>

   <div class="main_content">


      <div class="d-flex flex-column ga-4" style="max-width: 500px; margin: auto;" >
               
               <p class="service_label"> SELECTIONNEZ UN CRÉNEAU </p>

               <!-- format -->
                  <div class="d-flex justify-center w-100">

                        <v-btn-toggle
                           v-model="reservation_format"
                           rounded="4"
                           color="info"
                           mandatory
                           variant="outlined"
                           class="w-100" >

                           <v-btn 
                             v-if="format == ReservationFormat.ONLINE || format == ReservationFormat.BOTH"
                             :value="ReservationFormat.ONLINE" 
                             prepend-icon="mdi-video-outline"
                             class="flex-grow-1"
                              >
                              Visio
                           </v-btn>

                           <v-btn 
                              v-if="format == ReservationFormat.IN_PERSON || format == ReservationFormat.BOTH"
                              :value="ReservationFormat.IN_PERSON" 
                              append-icon="mdi-home-variant-outline"
                              class="flex-grow-1"
                              >
                              Présentiel
                           </v-btn>

                        </v-btn-toggle>
                  </div>

                  <div v-if="reservation_format == ReservationFormat.IN_PERSON && annonce"
                       class="d-flex justify-cente align-center" >
                        <v-icon 
                        color="info" 
                        size="x-large"
                        icon="mdi-map-marker-outline"> 
                      </v-icon>
                      <span class="ml-2 text-left"> {{ annonce?.city }} - 
                              {{ annonce?.address }} - 
                              {{ annonce?.building }} </span>
                  </div>

               <!-- timezone -->

               <div class="fuseau d-flex align-center justify-space-between mt-4">
                    
                     <span> {{ userTimeZone?.title }}</span>

                     <v-btn
                           to="/espace-client/profile"
                           variant="flat" 
                           prepend-icon="mdi-square-edit-outline"
                           color="#FFF">
                           Modifier
                     </v-btn>
               </div>

               <!-- slots -->
               <v-card class="slots_card" elevation="0">

                  <v-card-text>

                     <!-- navigation -->
                     <div class="d-flex align-center justify-space-between mb-6">

                        <!-- Précédent -->
                        <v-btn
                           size="small"
                           variant="tonal"
                           color="secondary"
                           icon="mdi-chevron-left"
                           @click="previousWeek"
                           :disabled="loading || !canGoPrevious"
                        />

                        <div class="text-subtitle-1 font-weight-bold">
                           Créneaux disponibles
                        </div>

                         <!-- Suivant -->
                        <v-btn
                           size="small"
                           variant="tonal"
                           color="secondary"
                           icon="mdi-chevron-right"
                           @click="nextWeek"
                           :disabled="loading || !canGoNext"
                        />

                     </div>
                     <!-- /navigation -->

                     
                     <!-- body -->
                     <div v-if="!loading"> 

                        <!-- Créneaux disponibles -->
                        <template v-if="hasAvailableSlots">
                           <div class="slots-grid">

                                 <div v-for="day in days" :key="day.date" class="day-column" >


                                    <!-- header -->
                                    <div class="text-center mb-4">

                                       <div class="font-weight-bold">
                                       {{ formatWeekday(day.date) }}
                                       </div>

                                       <div class="text-medium-emphasis">
                                       {{ formatDate(day.date) }}
                                       </div>

                                    </div>
                                     <!-- /header -->

                                    <div v-if="day.slots.length" class=" d-flex flex-column text-center">
                                       <v-btn
                                          v-for="slot in day.slots.slice(0, visibleSlots)"
                                          :key="slot"
                                          rounded="lg"
                                          :variant="isSelected(day.date,slot) ? 'flat' : 'tonal'"
                                          :color="isSelected(day.date,slot) ? 'secondary' : '#000'"
                                          class="mb-3"
                                          :class="isSelected(day.date,slot) ? 'v-btn--active btn_selected' : ''"
                                          @click="selectSlot(day.date, slot)"
                                       > {{ slot }}  </v-btn>
                                    </div>

                                    <div v-else class="text-center text-medium-emphasis" >
                                       —
                                    </div>

                                 </div>
                              </div>
                              <!-- more  -->
                              <div class="text-center mt-6">
                                 <v-btn v-if="hasMore"
                                    variant="text"
                                    color="secondary"
                                    @click="showMore" > Voir plus de créneaux
                                 </v-btn>
                              </div>
                           <!-- / more  -->

                        </template>

                         <!-- Aucun créneau disponible -->
                        <template  v-else >

                              <!-- header -->
                              <div class="slots-grid">
                                 <div v-for="day in days" :key="day.date" class="day-column" >

                                    <div class="text-center mb-4">

                                       <div class="font-weight-bold">
                                       {{ formatWeekday(day.date) }}
                                       </div>

                                       <div class="text-medium-emphasis">
                                       {{ formatDate(day.date) }}
                                       </div>

                                    </div>
                                       
                                 </div>
                              </div>
                              <!-- /header -->


                              <!-- body -->
                              <div class="text-center py-10" >
                                 <v-icon
                                    icon="mdi-calendar-remove-outline"
                                    size="42"
                                    color="#aaa"
                                    class="mb-3"
                                 />

                                 <div class="font-weight-medium text-warningg">
                                    Aucun créneau disponible pour cette période
                                 </div>

                                 <div class="text-medium-emphasis text-body-2 mt-0 text-warningg">
                                    Essayez une autre période.
                                 </div>

                                 <!-- Prochaine disponibilité trouvée -->
                                 <v-btn
                                    v-if="nextAvailableDate"
                                    class="mt-4"
                                    color="success"
                                    variant="tonal"
                                    
                                    prepend-icon="mdi-calendar-check-outline"
                                    append-icon="mdi-chevron-right"
                                    @click="goToNextAvailableDate" >

                                    Prochain RDV disponible :
                                    {{ dayjs.tz(nextAvailableDate, selectedTimezone).format('DD MMM YYYY') }}
                                    
                                 </v-btn>

                                 <!-- Aucune disponibilité sur les 3 mois -->
                                 <div v-else class="text-medium-emphasis text-body-2 mt-4"  >
                                    Aucune disponibilité dans les 3 prochains mois.
                                 </div>

                              </div>
                              <!-- /body -->

                        </template>
                     
                     </div>
                     <!-- /body -->

                  </v-card-text>

                  <v-card-text v-if="loading">

                     <div class="text-center">
                        <v-progress-circular
                              :width="3"
                              color="red"
                              indeterminate >
                           </v-progress-circular>
                    </div>

                  </v-card-text>

                  <div v-if="!loading" class="text-center mt-4 mb-4 mr-4 ml-4 w-80 ">
                     <v-btn  
                        variant="flat"
                        color="secondary" 
                        block
                        size="large"
                        :loading="booking_loading"
                        :disabled="booking_loading"
                        @click="confirmReservation()" > 
                        Confirmer et réserver  
                     </v-btn>
                  </div>

                 </v-card>
                 <!-- /slots -->

            </div>  
   </div>

</template>

<style lang="scss" scoped>

     .title{
         font-size: 18px ;
         font-weight: bold ;
         color: #424242;
     }

     .fuseau{
         border-radius: 4px ;
         border: 1px solid #ddd ;
         padding: 8px 10px ;
         font-size: 16px;
     }

      .slots_card{
         border-radius: 4px ;
         border: 1px solid #ddd ;
         /* box-shadow:  0 22px 32px rgba(0,0,0,.12) !important; */
      }
 
     .slots-grid {
         display: flex;
         gap: 16px;
         justify-content: center;

      }

      .day-column {
        min-width: 0;
      }

      @media (max-width: 400px) {

         .slots-grid {
            gap: 10px;

         }
 
      }


      .header_content {
         max-width: 900px;
         margin-top: 40px;
         margin-bottom: 40px;
      }

      .service_label {
         color: $secondary-color;
         font-size: 13px;
         font-weight: 700;
         letter-spacing: 1.5px;
         margin-bottom: 12px;
         text-align: center;
         margin-top: 10px ;
      }
       
       
</style>