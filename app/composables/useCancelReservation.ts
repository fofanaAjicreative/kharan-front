export const useCancelReservation = () => {

  const dialog = useState( 'cancel-reservation-dialog', () => false )
  const reason = useState<string>( 'cancel-reservation-reason', () => '' )

  const title = useState( 'cancel-reservation-title', () => '' )
  const description = useState( 'cancel-reservation-description', () => '' )

  const resolver = useState<any>( 'cancel-reservation-resolver', () => null )

  /* ----------------------------------------------------------------------------------- */

    const confirm = (options: {
                        title: string
                        description: string  
                        } 
                    ) => {

      title.value = options.title
      description.value = options.description

      dialog.value = true ;
      reason.value = '' ;
      return new Promise<boolean>((resolve) => { resolver.value = resolve })
  }

  /* ----------------------------------------------------------------------------------- */

    const accept = () => {
        dialog.value = false
        resolver.value?.(true)
    }

  /* ----------------------------------------------------------------------------------- */

    const cancel = () => {
      dialog.value = false ;
      reason.value = '' ;
      resolver.value?.(false)
    }

  /* ----------------------------------------------------------------------------------- */

  return {
    dialog,
    reason,
    title, description,
    confirm,
    accept,
    cancel
  }


}