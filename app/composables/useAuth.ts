export function useAuth() {

  const { $api } = useNuxtApp() ;
  const user = useState<any>( 'auth-user', () => null ) ;
  const initialized = useState<boolean>( 'auth-initialized', () => false ) ;
  const login_dialog = useState<boolean>( 'login-dialog', () => false ) ;


/* ------------------------------------------------------------------- */

  const isAuthenticated = computed(() => {
    return !!user.value
  })

/* ------------------------------------------------------------------------------ */

  const isCoach = computed(() => {
    return user.value?.role == Role.COACH
  })

  const isClient = computed(() => {
    return user.value?.role == Role.USER
  })

  const isAdmin = computed(() => {
    return user.value?.role == Role.ADMIN
  })

/* ------------------------------------------------------------------------------ */


  const initialize = async () => {
 
      if(initialized.value) { return  }

      try {

        const data :any = await $api('/auth/profile') ;
        user.value = data.data.user ;

      }catch(error) {

        user.value = null ;

      }finally {
        initialized.value = true
      }
  }
  
/* ------------------------------------------------------------------- */

  const setUser = (data: any) => {
    user.value = data
  }

/* ------------------------------------------------------------------- */

  const clearUser = () => {
    user.value = null
  }

/* ------------------------------------------------------------------- */

  const logout = async () => {

      try {
        await $api('/auth/logout', { method: 'POST'  })
      }catch {}

      user.value = null ;

      return navigateTo('/')
  }

/* ------------------------------------------------------------------- */
    const getUserTimeZone =  () => {

      if(user.value?.timeZone){
       return  user.value.timeZone
      }

      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone; // Ex: "Europe/Paris", "Africa/Casablanca"
      } catch (e) {
         return 'UTC';
      }
        
   }

/* ------------------------------------------------------------------- */

  const showLoginDialog = () => {
    login_dialog.value = true
  }

/* ------------------------------------------------------------------- */

  return {
    user,
    initialized,
    isAuthenticated,

    setUser,
    clearUser,
    initialize,
    logout,
    getUserTimeZone,
    login_dialog,showLoginDialog ,
    isCoach ,isClient , isAdmin
  }


}