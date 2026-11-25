<script setup lang="ts">

 
  import { useDisplay } from 'vuetify' ;
    const { name } = useDisplay() ;

    const { badgeCountMessage  , menuOpenedMessage } = useNotifications() ;


    const { closeChatPanels } = useChat() ;


    const { 
      initialized , isAuthenticated , user ,logout ,
      isCoach, isClient,isAdmin  } = useAuth();
     
    /* ------------------------- espace ------------------------------------ */

       const {
              espace_drawer,
              main_drawer,
              openMainDrawer,
              openEspaceDrawer,
              closeMainDrawer,
              closeEspaceDrawer,
              toggleEspaceDrawer,
              toggleMainDrawer,
         } = useUi()
 
/* --------------------------------------------------------------------------------- */ 

    function getUserAccountLink(){
      
      if(isCoach.value){
          return '/espace-coach' ;
      }else if(isClient.value){
          return '/espace-client' ;
      }else if(isAdmin.value){
          return '/admin' ;
      }else{
        return '/' ;
      }
       
 
    }


  /* --------------------------------------- header color  --------------------------------- */

      const route = useRoute()
      const isScrolled = ref(false);


      const headerColor = computed(() => {
        if(route.path !== '/' && route.path !== '/home') {

          isScrolled.value = true  ;
          return 'white'
        }

        return isScrolled.value ? 'white' : 'primary'

      })

    
      const handleScroll = () => {

        if(route.path !== '/' && route.path !== '/home') {
           isScrolled.value = true  ;
        }else{
            isScrolled.value = window.scrollY > 600;
        }
          
      }


  /* -------------------------------------------------------------------------------------- */
    

     function openMessagerie(){

        menuOpenedMessage() ;
        navigateTo('/messagerie')  ;

    }
     

  /* -------------------------------------------------------------------------------------- */

      onMounted(() => {
        window.addEventListener('scroll', handleScroll)
      })

      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
      })


  /* -------------------------------------------------------------------------------------- */

    const isEspace = computed( ()=>{

          if (
            route.path.startsWith('/messagerie') ||
            route.path.startsWith('/espace-client') ||
            route.path.startsWith('/espace-coach') ||
            route.path.startsWith('/admin')
          ) {
              return true ;
          }

          return false ;
    })

/* --------------------------------------------------------------- */ 

    function becomeCoach (){

        if(isCoach.value){
            navigateTo('/espace-coach') ;
            return ;
        }

        navigateTo('/register') ; 
    }

 
   /* --------------------------------------------------------------------------------- */
      
      function deconnexion(){

          closeChatPanels() ;
          toggleMainDrawer()
          logout() ;
            
      }

</script>

<template>

    <!-- APP BAR -->
    <v-app-bar 
      :color="headerColor"
      flat
      :class="{ 'app-bar-scrolled': isScrolled }"
      height="70"
      scroll-behavior="elevate"  >
      
      <!-- mobile -->
      <v-app-bar-nav-icon
        
        class="d-md-none"
         :icon="main_drawer?'mdi-window-close':'mdi-menu'"
        @click="toggleMainDrawer()"
       />
      <!--/ mobile -->
       
      <div class="logo ml-0">
        <NuxtLink to="/">
            <!-- logo -->
             <KharanLogo
                :weight="900"
              />
            <!-- logo -->
        </NuxtLink>
      </div>

      

      <v-spacer />

      <!-- ----------------------MOBILE---------------------- -->

      <div class="d-flex justify-center  d-md-none">

          <div v-if="!isAuthenticated" >
              <NuxtLink 
                to="/login">
                  <v-icon 
                    color="secondary"    
                    icon="mdi-account-circle" 
                    variant="flat" 
                    size="large"
                    class="mr-2" >
                  </v-icon>
              </NuxtLink>
          </div>

          <div v-else  >

        
            <!-- notifications -->
              <NotificationBell />

              
              <!-- messagerie -->
              <v-btn 
                  @click="openMessagerie()" 
                  color="#FFF"   
                  variant="text" 
                  icon 
                  size="default"
                  class="menu_btn"
                  > 
                
                    <v-badge
                        :content="badgeCountMessage"
                        :model-value="badgeCountMessage > 0"
                        color="secondary" >
                        <v-icon 
                              icon="mdi-forum-outline"
                              color="secondary"
                              size="large"
                              class="mr-0"> </v-icon>
                    </v-badge>
  
              </v-btn>
               
              

               <!-- account -->
              
              <v-btn v-if="!isEspace"
                :to="getUserAccountLink()" 
                color="#FFF"   
                variant="text" 
                icon 
                size="default"
                class="menu_btn" > 

                <v-icon
                    icon="mdi-account-circle"
                    color="secondary"
                    size="x-large"> 
                </v-icon>
                
              </v-btn>



              <!-- espace drawer -->
              <v-btn  v-if="isEspace"
                 @click="toggleEspaceDrawer()"
                  color="#FFF"   
                  variant="text" 
                  icon 
                  size="default"
                  class="menu_btn"
                  > 
                 <v-icon  
                      :icon="espace_drawer?'mdi-menu-open':'mdi-microsoft-xbox-controller-menu'"
                      color="secondary"
                      size="large"
                      class="mr-0"> </v-icon>                   
              </v-btn>

          </div>
            
      </div>
     <!-- ----------------------/ MOBILE---------------------- -->

      
    <!-- ------------------ DESKTOP -------------------------------------- -->

      <div class="d-none d-md-flex">
         
        <!-- <ul class="menu">
          <li>
            <NuxtLink to="/coachs">Je veux un coach</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/devenir-coach">Je suis un coach</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/fonctionnement">Fonctionnement</NuxtLink>
          </li>
        </ul> -->

      </div>

      <v-spacer class="d-none d-md-flex" />

      <div v-if="initialized && !isAuthenticated" class="d-none d-md-flex">
        <v-btn to="/login" 
           prepend-icon="mdi-login-variant" 
          color="secondary"   
          variant="flat" 
          rounded="30" 
          width="160"> Se connecter </v-btn>
      </div>

      <div v-if="isAuthenticated" class="d-none d-md-flex align-center">

           <!-- messagerie -->
            <v-btn  
              @click="openMessagerie()" 
              color="secondary"   
              variant="flat" 
              rounded="30"  > 
              
                  <v-badge
                      :content="badgeCountMessage"
                      :model-value="badgeCountMessage > 0"
                      color="secondary" >
                      <v-icon icon="mdi-message-outline" class="mr-2"> </v-icon>
                  </v-badge>

                  <span class="ml-2">
                        Messagerie
                  </span>
                  
             </v-btn>

            <!-- account -->
            <v-btn 
              :to="getUserAccountLink()"
              prepend-icon="mdi-account-outline"
              color="secondary"   
              variant="flat" 
              rounded="pill" 
              width="160"
              class="ml-1" > Mon compte 
             </v-btn>

            <!-- notifications -->
            <NotificationBell />


              
      </div>

  <!-- ------------------/ DESKTOP -------------------------------------- -->

      
  </v-app-bar>


    <!-- MOBILE DRAWER -->

    <v-navigation-drawer app
      width="400"
      v-model="main_drawer"
      temporary
      color="primary"
      class="d-md-none" > 

      <div >

          <v-list 
            density="comfortable">

            <v-list-item 
                  prepend-icon="mdi-home-variant-outline" 
                  value="Accueil"
                  to="/"
                  title="Accueil">
            </v-list-item>

            <v-list-item 
                to="/coachs"
                prepend-icon="mdi-magnify" 
                value="coachs"
                title="Trouver un coach">
            </v-list-item>

            <v-list-item  
                @click="becomeCoach()"
                prepend-icon="mdi-human-male-board-poll" 
                value="Devenir"
                 title="Devenir coach">
            </v-list-item>

            <v-list-item  
              v-if="isAuthenticated"
              :to="getUserAccountLink()" 
              elevation="10"
              color="secondary"
              prepend-icon="mdi-account-circle" 
              value="Mon compte"
              title="Mon compte">
 
            </v-list-item>

        </v-list>

      </div>

      <template v-slot:append>
          <div class="pa-1">

            <v-btn v-if="isAuthenticated"
                @click="deconnexion()"
                prepend-icon="mdi-login-variant"
                color="secondary"
                variant="flat"
                spaced="both"
                rounded="0"
                block>
                Déconnexion
            </v-btn>

            <v-btn v-if="!isAuthenticated"
                to="/login"
                prepend-icon="mdi-login-variant"
                color="secondary"
                variant="flat"
                spaced="both"
                rounded="0"
                block>
                Connexion
            </v-btn>

          </div>
        </template>

     </v-navigation-drawer>

    
</template>

<style lang="scss" scoped>

   .v-app-bar {
       transition: background-color 0.3s ease;
    }

  .app-bar-scrolled {
    background-color: white !important;
  }


  .text-white{
    color: #fff !important ;
  }

  .v-toolbar{
      padding :  0px 150px ;
  }


  .app-bar-scrolled   {
      --tw-shadow: 0 10px 15px -8px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);
      --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
      
      box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),  var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
     
  @media screen and (max-width: 1100px) {
      .v-toolbar{
          padding :  0px 50px ;
      }
  }
   

  @media screen and (max-width: 768px) {
    .v-toolbar{
      padding :  0px 0px ;
      padding-right :  10px;
      //background: #FFFFFF ;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }


  }


 

    /* ------------- Desktop Menu  -------------------- */


    .menu {
      display: flex;
      gap: 30px;
      list-style: none;
      padding: 0;
    }

    .menu a {
      position: relative;
      text-decoration: none;
      color: #333;
      font-size: 15px;
      padding-bottom: 7px;
    }

    .menu a::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0%;
      height: 2px;
      background-color: $secondary-color;
      transition: width 0.3s ease;
    }

    .menu a:hover::after {
      width: 100%;
    }
    
  /* -------------- / Menu------------------ */

  .menu_btn{
    //box-shadow: 0 0px 0px rgba(0, 0, 0, 0.12); 
   // margin: 2px ;
  }

</style>