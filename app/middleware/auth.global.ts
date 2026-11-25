export default defineNuxtRouteMiddleware(async (to) => {

  const {initialize , isAuthenticated , user} = useAuth() ;


  // -----------------------------
  // IMPORTANT: client-side only
  // -----------------------------
  if (import.meta.server) return
 

  await  initialize() ;

  // -------------------------
  // Routes protégées
  // -------------------------

  if (
    to.path.startsWith('/messagerie') ||
    to.path.startsWith('/espace-client') ||
    to.path.startsWith('/espace-coach') ||
    to.path.startsWith('/admin')
  ) {

    if (!isAuthenticated.value) {
      return navigateTo('/login')
    }
  }


  // -------------------------
  // Client
  // -------------------------

  if (to.path.startsWith('/espace-client')) {

    if (user.value.role !== Role.USER ) {
      return navigateTo('/')
    }

  }


  // -------------------------
  // Coach
  // -------------------------

  if (to.path.startsWith('/espace-coach')) {

    if (user.value.role !== Role.COACH ) {
      return navigateTo('/')
    }
  }


  // -------------------------
  // Admin
  // -------------------------

  if (to.path.startsWith('/admin')) {

    if (user.value.role !== Role.ADMIN ) {
      return navigateTo('/')
    }
  }





})