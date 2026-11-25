export const useUi = () => {

  const main_drawer = useState( 'main_drawer', () => false )  ;
  const espace_drawer = useState( 'espace_drawer', () => false )  ;
  
/* ------------------------------------------------------------------ */

  const openEspaceDrawer = () => {
     espace_drawer.value = true
  }


  const closeEspaceDrawer = () => {
     espace_drawer.value = false
  }


  const toggleEspaceDrawer = () => {
     espace_drawer.value = !espace_drawer.value ;
     closeMainDrawer() ;
  }

/* ------------------------------------------------------------------ */

   const openMainDrawer = () => {
     main_drawer.value = true
   }

  const closeMainDrawer = () => {
     main_drawer.value = false
  }

  const toggleMainDrawer = () => {
     main_drawer.value = !main_drawer.value ;
     closeEspaceDrawer()
  }

 
/* ------------------------------------------------------------------ */

 


  return {
    main_drawer,
    espace_drawer,
    openMainDrawer,
    openEspaceDrawer,
    closeMainDrawer,
    closeEspaceDrawer,
    toggleMainDrawer,
    toggleEspaceDrawer,
  }



}


