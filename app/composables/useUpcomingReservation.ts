export function useUpcomingReservation() {

  const { $api } = useNuxtApp() ;
  const { user } = useAuth() ;
  
  const reservation = useState<any>('upcoming-reservation', () => null )
  const dialog = useState('upcoming-reservation-dialog', () => false )
  const initialized = useState<boolean>( 'upcoming-reservation-initialized', () => false ) ;



  /*------------------------------- meeting ------------------------------------------------ */

 const { canJoin,isFinished,isStarted, isUpcoming, timeRemainingText, joinMeeting } = useMeetingStatus(
    () => reservation.value?.reservation.booking_date_start,
    () => reservation.value?.reservation.booking_date_end,
    () => reservation.value?.reservation.meetingUrl,
    () => reservation.value?.reservation.id,
  );

 
/* ------------------------------------------------------------------- */


  const getUpcommingReservation = async () => {
 

    if(initialized.value) { return  }
    

    try {

      let url = '/coach/get_upcomming_reservation'  ;
      if(user.value.role == Role.USER ){
        url = '/get_upcomming_reservation' ;
      }

      const res :any = await $api(url) ;

      reservation.value = res.data.reservation ;
 
    }catch(error) {
      reservation.value = null ;
    }finally {
      // show
      initialized.value = true ;
      showDialog() ;

    }

  }

  const canJoinMeeting = computed(() => {

    if(!reservation.value) return false ; 'approved'
    return (
           (reservation.value.reservation.status == ReservationStatus.APPROVED) && 
           (reservation.value.reservation.format == ReservationFormat.ONLINE) && 
           canJoin.value 
        )

  });

/* ------------------------------------------------------------------- */

  const showDialog = () => {
        
    if(!canJoinMeeting.value) return ;
    dialog.value =  true  ; 

  }

/* ------------------------------------------------------------------ */

  watch(isFinished, (val) => {

        if(val){
          dismissDialog()
        } 
  })

/* ------------------------------------------------------------------- */
 
 const dismissDialog = () => {
     
    dialog.value = false  ; 
    reservation.value = null ;
       
  }

/* ------------------------------------------------------------------- */

  return {

    getUpcommingReservation,
    reservation,
    isStarted,
    dialog,
    showDialog,
    dismissDialog,
    timeRemainingText
   
  }


}