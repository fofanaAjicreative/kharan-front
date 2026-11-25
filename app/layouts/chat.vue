
<script setup lang="ts">

    import Header from '~/components/Header.vue';
    import LeftMenuClient from '~/components/espace/LeftMenuClient.vue';
    import LeftMenuCoach from '~/components/espace/LeftMenuCoach.vue';
    import LeftMenuAdmin from '~/components/espace/LeftMenuAdmin.vue';

    useHead({
      titleTemplate: (title) => title ? `${title} | Kharan` : 'Kharan'
    }) ;
    
    const {user , isCoach , isClient , isAdmin } = useAuth() ;

    /* ------------------------------------------------------------------------ */ 
    
     
  const { espace_drawer, } = useUi() ; 

    /* ------------------------------------------------------------------------ */ 
 
</script>

<template>
  <v-app>

    <!-- main header -->
    <Header />
   
      <v-main>
      <v-layout>

        <!-- drawer -->
        <v-navigation-drawer
            location="left"
            temporary
            v-model="espace_drawer" 
            width="320" >

         <!-- leftMenu -->
         <div class="pa-4 pt-8">

          <LeftMenuCoach v-if="isCoach" />
          <LeftMenuClient v-else-if="isClient"/>
          <LeftMenuAdmin v-else-if="isAdmin"/>
             
         </div>

        </v-navigation-drawer>
        <!-- / drawer -->

        <v-main>
          <div class="main_content">

              <div class="d-flex flex-wrap ga-4" >
                   <div class="left_side">
                      <LeftMenuCoach v-if="isCoach" />
                      <LeftMenuClient v-else-if="isClient"/>
                      <LeftMenuAdmin v-else-if="isAdmin"/>
                  </div>
                
                  <div class="right_side">
                        <slot />
                  </div>
              </div>


          </div>
        </v-main>


      </v-layout>
        
    </v-main>
  
   
  </v-app>

</template>


<style scoped lang="scss">

  .v-app-bar-title{
    font-size: 16px !important ;
    font-weight: 600 ;
    margin-left: 0px ;
  }

  .v-main{
    background-color: #fff !important ;
    padding-top: 38px !important ;
  }
 
  .left_side{
      background-color: #fff  ;
      border-radius: 4px ;
      border : 1px solid #ddd ;
      padding: 20px ;
      min-height: 70dvh;
      height: calc(100vh - 104px) ;
   }

  .right_side{
      background-color: #fff  ;
      border-radius: 4px ;
      min-height: 70dvh;
  }


  .main_content{
    padding: 10px ;
  }


  @media (max-width: 839px){
    
    .right_side{
      padding: 4px;
      border: none ;
      border-radius: 0px ;
    }

    .main_content{
      padding: 2px ;
    }

  }




/* ------------- responsive ------------------------  */

 

   .left_side {
      flex-grow: 1;
      flex-shrink: 0;
      flex-basis: 300px;
      max-width: 390px;
   }

   .right_side {
       flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 350px;
      min-width: 300px;
    }


    @media (max-width: 1250px){
     
      .left_side {
        max-width: 300px !important;
       }

    }

    @media (max-width: 1050px){
     
      .left_side {
        max-width: 250px !important;
       }

    }


    @media (max-width: 1024px){
     
      .left_side {
        max-width: 300px !important;
         display: none ;
      }

    }

  @media (max-width: 839px){

      .left_side {
        display: none ;
      }

  }


</style>