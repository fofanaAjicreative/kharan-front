<script setup  >

  import ReservationCardCoach from '~/components/espace/ReservationCardCoach.vue';
 
  const { $api } = useNuxtApp() ;

  import { useDisplay } from 'vuetify' ;
  const { mobile } = useDisplay() ;

  const calendar = ref()
  const focus = ref('')
  const events = ref([])

  
  const type = ref('month') ;

  const typeToLabel = {
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    '4day': '4 jours'
  }

  if(mobile.value){ 
    type.value="4day" 
  }


  const colors = {
    waiting: "orange",
    approved: "#3B82F6",
    rejected: "#F87171" ,
    canceled: "#EF4444" ,
    completed: "#22C55E" 
  };


  const selectedOpen = ref(false)
  const selectedEvent = ref({})
  const selectedElement = ref(null)
  

 
   /* ----------------------------  change status ------------------------------------------ */

    const statusOptions = [
      { label: 'Confirmer', value: 'approved' },
      { label: 'Terminer', value: 'completed' },
      { label: 'Rejeter', value: 'rejected' },
      { label: 'En attente', value: 'waiting' }
    ] ;

/* ----------------------------------------------------------------------------------------------- */ 

  function prev () {
    calendar.value.prev()
  }

  function next () {
    calendar.value.next()
  }


  function setToday () {
    focus.value = ''
  }

  function viewDay (nativeEvent, { date }) {
    focus.value = date
    type.value = 'day'
  }

  function getEventColor (event) {
    return event.color
  }

/* ------------------------------------- open dialog -------------------------------------------- */

    function showEvent (nativeEvent, { event }) {

      const open = () => {
        selectedEvent.value = event
        selectedElement.value = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
      } 

      if(selectedOpen.value) {
        selectedOpen.value = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation() ;

    }

/* --------------------------- load reservations  ---------------------------------------------- */ 


  function updateRange({ start, end }) {

    console.log("start : ",start.date) ;
    console.log("end : ",end.date) ;

    const params = {
      start_date : start.date ,
      end_date : end.date ,
    }

    const queryString = new URLSearchParams(params).toString();
    
    $api(`/coach/reservations?${queryString}`,{
      method: 'GET',
    }).then((res) =>{

          const reservations = res.data.reservations
          events.value =  [] ;

          for(let reservation of reservations){
            const item = {
                name  : `${reservation.user.fullname} - ${reservation.service.title}`,
                start: new Date(reservation.booking_date_start),
                end: new Date(reservation.booking_date_end),
                color: colors[reservation.status],
                data : reservation,
                timed: true 
            }
            events.value.push(item) ;
          }

      }).catch(error=>{
        console.log("Error:",error); 
        hideLoading() ;
      })
 

  }

/* -------------------------------------------------------------------------------------- */


  function statusChanged(data){
 
    let found = events.value.find(item=>item.data.id == data.reservation.id) ;
    if(found){
      found.color = colors[data.reservation.status] ;
      found.data = data.reservation ;
    } 

  }
 
 
/* ----------------------------------------------------------------------------------------- */ 

  onMounted(() => {

    calendar.value.checkChange() ; 
    
  })

/* --------------------------------------------------------------------------------------------- */ 


</script>

<template>
  

  <div class="page_main_content">
      
   
    <!-- calendar toolbar -->
     <v-sheet height="64">
        <v-toolbar flat>

          <v-btn @click="setToday" class="me-4" color="grey-darken-2" variant="outlined"  > 
            Ajourd'hui </v-btn>

          <v-spacer></v-spacer>

          <!-- nav -->
            <v-btn @click="prev"
              color="grey-darken-2"
              size="small"
              variant="text" icon > <v-icon size="small">  mdi-chevron-left </v-icon>
            </v-btn>
        
            <v-btn @click="next"
              color="grey-darken-2"
              size="small" variant="text" icon > <v-icon size="small"> mdi-chevron-right </v-icon>
            </v-btn>
          <!-- /nav -->

          <!-- title -->
            <v-toolbar-title v-if="calendar" class="hidden-sm-and-down" >
              {{ calendar.title }}
            </v-toolbar-title>
          <!-- /title -->

          <v-spacer></v-spacer>

          <!-- Type  -->
          <v-menu location="bottom end">
            <template v-slot:activator="{ props }">
              <v-btn
                color="grey-darken-2"
                variant="outlined"
                v-bind="props" >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon end>
                  mdi-menu-down
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Jour</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semaine</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mois</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 jours</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- /Type  -->

        </v-toolbar>
      </v-sheet>
     <!-- / calendar toolbar -->

    <!-- calendar -->
    <v-sheet height="600">

      <v-calendar
          ref="calendar"
          locale="fr"
          v-model="focus"
          :event-color="getEventColor"
          :events="events"
          :type="type"
          color="secondary"
          @change="updateRange"
          @click:date="viewDay"
          @click:event="showEvent"
          @click:more="viewDay">
      </v-calendar>


      <!-- Event modal -->
      <v-menu
          v-model="selectedOpen"
          :activator="selectedElement"
          :close-on-content-click="false"
          persistent
          location="top" >

           <v-card min-width="300px" max-width="1000px" flat >

              <v-toolbar :color="selectedEvent.color" >
                  <v-spacer />
                  <v-btn 
                    @click="selectedOpen = false"
                    prepend-icon="mdi-close"
                    color="#FFF"   >  Fermer </v-btn>
              </v-toolbar>

             <v-card-text>

              <ReservationCardCoach 
                          :reservation="selectedEvent.data" 
                          :statusOptions="[]"
                           @statusChanged="statusChanged"
                            
                          />
              
            </v-card-text>
          </v-card>
        </v-menu>
        <!-- /Event modal -->

    </v-sheet>
    <!-- / calendar -->

         
  </div>



</template>

<style scoped lang="scss">
 
 
   
</style>