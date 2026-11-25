export const useAnnonceDialog = () => {

  const { $api } = useNuxtApp() ;
  const { user , setUser } = useAuth() ;

  const dialog = useState( 'annonce-dialog', () => false )

  const has_annonce = useState( 'has_annonce', () => false )
  const annonce_completed = useState( 'annonce_completed', () => false )
  const has_service = useState( 'has_service', () => false )
  const dismissed_annonce_dialog_at = useState( 'dismissed_annonce_dialog_at', () => null ) ;



  /* ---------------------------- load annonce --------------------------------------- */


   const initialized = useState<boolean>( 'annonce-initialized', () => false ) ;
   const annonce_small = useState<any>( 'annonce-small', () => null ) ;


    const loadAnnonceSmall = async () => {
  
       
        if(initialized.value) { return  }

        try {

          const data :any = await $api('/annonces/my_annonce_small') ;
          annonce_small.value = data.data.annonce ;

        }catch(error) {

          annonce_small.value = null ;

        }finally {
          initialized.value = true
        }

    }

 /* ------------------------------------------------------------------------ */
   
  const setAnnonce = (data: any) => {
       annonce_small.value = data
  }

 /* ------------------------------------------------------------------------ */

  const showDialog = (
                        options: { 
                          has_annonce: boolean ,
                          annonce_completed: boolean ,
                          has_service: boolean ,
                          dismissed_annonce_dialog_at: any ,
                        }
                    ) => {
 
                          has_annonce.value = options.has_annonce ;
                          annonce_completed.value = options.annonce_completed  ;
                          has_service.value = options.has_service  ;
                          dismissed_annonce_dialog_at.value = options.dismissed_annonce_dialog_at  ;

                          if( !has_annonce.value || !annonce_completed.value || !has_service.value ){
                                                        
                            if(shouldShowDialog(dismissed_annonce_dialog_at.value)){
                               dialog.value = true ;
                            }

                          }

                          
                        }

  /* ---------------------------------------------------------------------------- */

    function shouldShowDialog(date_string :any) {


      if (!date_string) { return true }

      const dismissedAt = new Date(date_string) ;

      // 3 * 24 * 60 * 60 * 1000 // 10 * 1000
      const today = new Date();
      const horizon = new Date( dismissedAt.getTime() + 3 * 1000);

      if (today.getTime() >= horizon.getTime()){
        return true  ;
      }

      
        
      return false ;

    }

/* ------------------------------------------------------------------------ */

  const accept = () => {
    dialog.value = false ;

    $api('/auth/set_dismissed_annonce_dialog_at',{
        method: 'POST',
       }).then((res :any) =>{

        user.value.dismissed_annonce_dialog_at = new Date() ;
        setUser(user.value)
      
      }).catch(error=>{
           console.log(error);
      })

  }

/* ------------------------------------------------------------------------ */

  const cancel = () => {
    dialog.value = false ;

     $api('/auth/set_dismissed_annonce_dialog_at',{
        method: 'POST',
       }).then((res :any) =>{

        user.value.dismissed_annonce_dialog_at = new Date() ;
        setUser(user.value)
      
      }).catch(error=>{
           console.log(error);
      })
  }

/* ------------------------------------------------------------------------ */

  const set_has_annonce = (val :boolean) => {
    
    has_annonce.value = val ;
  }

  const set_annonce_completed = (val :boolean) => {
    annonce_completed.value = val ;
  }

  const set_has_service = (val :boolean) => {
    has_service.value = val ;
  } 

/* ------------------------------------------------------------------------ */

  return {
    dialog,
    has_annonce,
    annonce_completed,
    has_service,
    showDialog,
    accept,
    cancel,
    set_has_annonce,
    set_annonce_completed,
    set_has_service ,
    setAnnonce,
    loadAnnonceSmall, annonce_small
  }




}