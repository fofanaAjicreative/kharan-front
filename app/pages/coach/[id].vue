<script setup lang="ts">

    const { $api } = useNuxtApp() ;
    
    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;
   
   // -------------------route param -------------------------------

      const route = useRoute()
      let id  = route.params.id as string ;
      
   // ------------------- seo ------------------------------------- 
      const page_title = ref('')
      useSeoMeta({ title: page_title })

   /* ------------- data ------------------------ */

    const loading = ref(true) ;
    const annonce = ref<any>(null) ;

 

 // ----------------------- get Annonce  -------------------------------

   function loadAnnonce(){   

      $api(`/annonces/${id}`).then((res :any )=>{

        console.log("Annonce:", res );
       
        annonce.value  = res.data.annonce ;
        loading.value = false ;
         
        // seo
        page_title.value = annonce.value.user.firstname

      }).catch(error=>{
        
            console.log(error); 
            clearNuxtData(); // Optionnel : nettoie le cache Nuxt
            showError({
                statusCode: 404,
                statusMessage: 'Page introuvable',
                fatal: true // Force la redirection complète vers error.vue
            });
      });

   }
 
 
/* -------------------------------------------------------------- */

    onMounted(async () => {
        loadAnnonce()  
    })


</script>

<template>

  <v-container class="main_content py-8 pt-4"   >
 
       <SkeletonPage v-if="loading"  />
       
        <template v-else>

            <div class="d-flex flex-wrap justify-center ga-4" >
                <!-- CONTENU -->

                <div class="coach-container">

                    <v-btn 
                        to="/coachs"
                        class="mb-1"
                        variant="text"
                        prepend-icon="mdi-chevron-left"
                        color="secondaryy" > Coachs </v-btn>


                    <CoachHero :annonce="annonce" />
                    <CoachServices :annonce="annonce" class="mt-8" />
                   
                    <CoachTabs :annonce="annonce" class="mt-8" /> 

                </div>

                <!-- SIDEBAR -->
                <div class="coach-sidebar-container" v-if="!mobile">
                      
                    <v-btn 
                        to="/coachs"
                        class="mb-1"
                        variant="text"                        
                        color="secondaryd"
                        > </v-btn>

                    <CoachSidebar :annonce="annonce"  />
                    
                </div>

            </div>

        </template>

</v-container>

</template>



<style lang="scss" scoped>

    .main_content{
        max-width: 1600px;
    }
   
  .coach-container{
    width: 900px;
     
  }

  .coach-sidebar-container{
     width: 550px;
  }

</style>