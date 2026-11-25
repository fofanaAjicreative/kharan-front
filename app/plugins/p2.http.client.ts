export default defineNuxtPlugin(() => {

    // 🛡️ TRÈS IMPORTANT : On ne l'initialise que dans le navigateur
  if (import.meta.server) return

  const config = useRuntimeConfig()
  const { logout,clearUser } = useAuth() ;
  const { connectSocket ,socket} = useSocket() ;
  const { closeChatPanels } = useChat() ;
 

  let refreshPromise: Promise<any> | null = null


  /*
   * --------------------------------------------------
   * REFRESH TOKEN
   * --------------------------------------------------
   */

  const refreshToken = async () => {

    // Un refresh est déjà en cours
    if (refreshPromise) { return refreshPromise }

    refreshPromise = $fetch('/auth/refresh_token', {
      baseURL: config.public.apiBaseUrl,
      method: 'POST',
      credentials: 'include',

    }).finally(() => {
     
      refreshPromise = null
    })

    return refreshPromise
  }


  /*
   * --------------------------------------------------
   * API
   * --------------------------------------------------
   */

  const api = async ( request: any,  options: any = {}  ): Promise<any> => {

    try {

      /*
       * Première requête
       */
      return await $fetch(request, {

        baseURL: config.public.apiBaseUrl,
        credentials: 'include',
        ...options,

      })

    } catch (error: any) {

      /*
       * Si ce n'est pas un 401,
       * on remonte simplement l'erreur.
       */
      if (error?.response?.status !== 401) {
        throwApiError(error)
      }

      /*
       * Ne pas refresh sur ces endpoints
      */
      const url = String(request)
 
      if(
        url.includes('/auth/refresh_token') ||
        url.includes('/auth/login')
      ){

      
        clearUser() ;
        closeChatPanels() ;
        await navigateTo('/login')
        throwApiError(error) ;
        
        
      }


      /*
       * Cette requête a déjà été retryée.
      */
      if (options._authRetry === true) {

        logout() ;
        closeChatPanels() ;
        throwApiError(error)

      }


      try {

        /*
         * ------------------------------------------
         * REFRESH
         * ------------------------------------------
         */

       try {

          await refreshToken() ;
          connectSocket() ;
          console.log("🛡️TOKEN REFRESHED🛡️");
          console.log("🛡️SOCKET STATUS:",socket.connected);

        } catch (refreshError: any) {

          console.log('❌ REFRESH ERROR')
          console.log('ERROR:', refreshError)

          clearUser() ;
          closeChatPanels() ;
          navigateTo('/login') ;
          throw refreshError
        }


        /*
         * ------------------------------------------
         * RETRY
         * ------------------------------------------
         */

              const retryOptions = {
                ...options,
                _authRetry: true,
              }


              return await $fetch(request, {
                baseURL: config.public.apiBaseUrl,
                credentials: 'include',
                ...retryOptions,
              })

            } catch (retryError) {

              throwApiError(retryError)

            }

    }

  }


  /*
   * --------------------------------------------------
   * ERROR HANDDLER
   * --------------------------------------------------
   */

    const throwApiError = (error: any) => {

      if (error?.data) {
        throw error.data
      }

      if (error?.response?._data) {
        throw error.response._data
      }
      throw error
    }

  //--------------------------------------------------


  return {

    provide: {
      api,
      refreshToken
    }

  }

})