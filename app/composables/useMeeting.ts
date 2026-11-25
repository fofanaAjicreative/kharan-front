 
export const useMeeting = () => {

    const { $api } = useNuxtApp() ;

    const { isCoach, isClient } = useAuth() ;
 
/* -------------------------------------------------------------------------------------- */

    async function joinReservationMeeting(id :string){
        let url  ;

        if(isCoach.value){
            url = `/coach/reservations/${id}/join_meeting`
        }else{
            url = `/reservations/${id}/join_meeting`
        }

 
        $api(url,
              { 
                method: 'POST', 
                body: {} 
              }).then((res :any) =>{
      
        }).catch(error=>{
            console.log(error);
        }) 
        

    }
 /* -------------------------------------------------------------------------------------- */

    async function leftReservationMeeting(id :string){
        let url  ;

        if(isCoach.value){
            url = `/coach/reservations/${id}/left_meeting`
        }else{
            url = `/reservations/${id}/left_meeting`
        }

 
        $api(url,
              { 
                method: 'POST', 
                body: {} 
              }).then((res :any) =>{
      
        }).catch(error=>{
            console.log(error);
        }) 
        

    }
/* ------------------------------------------------------------------------------------ */

    return {
        joinReservationMeeting ,
        leftReservationMeeting,
     }

}


 