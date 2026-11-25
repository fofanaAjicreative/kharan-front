
export function useNotificationDialog() {

   
    const dialog = useState( 'show-persion-dialog', () => false ) ;

    const dismissed_dialog_at = useState<string|null>( 'dismissed_notification_dialog_at', () => {

        const dialog_at = useCookie('notification_dialog_at') ;
        return dialog_at?.value ?dialog_at.value :null ;
    }) ;

 

/* ------------------------------------------------------------------------ */

  const accept = () => {
    dialog.value = false ;
  }

/* -------------------------------  plus tard ----------------------------------------- */

  const cancel = () => {

    dialog.value = false ;
    const dialog_at = useCookie('notification_dialog_at') ;
    dialog_at.value =  (new Date().toISOString()) ;

   }

/* ---------------------------------------------------------------------------- */


    const showDialog = () => {
        
        if(shouldShowDialog()){
            dialog.value = true ;
        }
    }


/* ---------------------------------------------------------------------------- */

    function shouldShowDialog() {

        if (!dismissed_dialog_at.value) { return true }

        const dismissedAt = new Date(dismissed_dialog_at.value) ;

        const daysLater = new Date(dismissedAt)
        daysLater.setDate( daysLater.getDate() + 3 )

        return new Date() > daysLater ;
        
    }
 
/* ------------------------------------------------------------------------ */

    return {
        dialog ,  
        dismissed_dialog_at,
        showDialog,
        accept,
        cancel
    }



}