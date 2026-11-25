export const useSnackbar = () => {
 
  const success = useState( 'success-snackbar', () => false )  ;
  const warning = useState( 'warning-snackbar', () => false )  ;
  const error = useState( 'error-snackbar', () => false )  ;

  const title = useState( 'snackbar-title', () => "" )
  const message = useState( 'snackbar-message', () => "" )
   
/* ------------------------------------------------------------------------------ */

    const showSuccessSnackbar = (
        options: {
          title?: string ,
          message?: string ,
           
        }
    ) => {
          title.value = options.title || "Success" ;
          message.value = options.message || "Enregistrement effectué avec succès." ;
          success.value = true ;
          error.value = false ;
          warning.value = false ;
        }
/* ------------------------------------------------------------------------------ */

    const showWarningSnackbar = (
        options: {
          title?: string ,
          message?: string ,
           
        }
    ) => {
          title.value = options.title || "Error" ;
          message.value = options.message || "Une erreur est survenue." ;
          warning.value = true ;
          error.value = false ;
          success.value = false ;
        }
/* ------------------------------------------------------------------------------ */

    const showErrorSnackbar = (
        options: {
          title?: string ,
          message?: string ,
           
        }
    ) => {
          title.value = options.title || "Error" ;
          message.value = options.message || "Une erreur est survenue." ;
          error.value = true ;
          success.value = false ;
          warning.value = false ;
        }

/* ------------------------------------------------------------------------------ */

   const resetSnackbar = () => {
        title.value = "" ;
        message.value = "" ;
        error.value = false ;
        success.value = false ;
   }

/* ------------------------------------------------------------------------------ */

    return {
        success,
        error,warning,
        title,
        message,
        showSuccessSnackbar,
        showErrorSnackbar,
        showWarningSnackbar ,
        resetSnackbar
    }

}