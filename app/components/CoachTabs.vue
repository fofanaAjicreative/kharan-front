<script setup lang="ts">

   const { $api } = useNuxtApp() ;
    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;


    const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;

    const tab = ref("about")
    const annonce = props.annonce ;


    const loaded = ref(false) ;
    const formations = ref([]) ;
    const experiences = ref([]) ;

/* ----------------------------------------------------------------------------------*/

 
  function loadCoachExperiences(){ 
               
    
      $api(`annonces/${annonce.id}/experiences`,{
        method: 'GET',
       }).then((res :any) =>{
        console.log("EXPERIENCES:",res.data );
        experiences.value =  res.data.experiences ;
        formations.value =  res.data.formations ;
        
        loaded.value = true ;
        
         
    
      }).catch(error=>{

        console.log("Error:",error); 
        
         
      })
               
  }


/* --------------------------------------------------------------------------------- */

    onMounted(() => {
      loadCoachExperiences() ;
    });


</script>




<template>

<div>

     <!-- Section header -->
    <div class="header_content text-center mx-auto">
        <p class="service_label"> PRESENTATION ET EXPERIENCES </p>
     </div>

<!-- DESKTOP -->

<div v-if="!mobile">

    <v-card class="annonce_tabs" >

        <v-tabs
            v-model="tab"
            color="secondary"
            bg-color="#F4F4F4"
            grow >

            <v-tab value="about"> Présentation </v-tab>
            <v-tab value="formations"> Formations </v-tab>
            <v-tab value="experiences"> Expériences </v-tab>
            <v-tab value="reviews" v-if="annonce.review_count>0">  Avis <!-- ({{ annonce.review_count }}) --> </v-tab>

        </v-tabs>

        <v-divider/>

        <v-window v-model="tab" >

            <v-window-item value="about">
                <CoachAbout :description="annonce.description" />
            </v-window-item>

            <v-window-item value="formations">
                <CoachFormation  :formations="formations" v-if="loaded" />
            </v-window-item>

            <v-window-item value="experiences">
                <CoachExperience :experiences="experiences" v-if="loaded" />
            </v-window-item>

            <v-window-item value="reviews"  v-if="annonce.review_count">
                <CoachReviews :annonce="annonce"/>
            </v-window-item>

        </v-window>

    </v-card>

</div>

<!-- MOBILE -->

<div v-else>

    <v-expansion-panels
        variant="accordion" 
        elevation="0"
        class="service_card"
        model-value="1"
        >

        <v-expansion-panel value="1" >

            <v-expansion-panel-title> Présentation </v-expansion-panel-title>
            <v-expansion-panel-text>

                <CoachAbout :description="annonce.description" />

            </v-expansion-panel-text>

        </v-expansion-panel>

        <v-expansion-panel>
            <v-expansion-panel-title> Formations </v-expansion-panel-title>
            <v-expansion-panel-text>

                <CoachFormation  :formations="formations" v-if="loaded" />

            </v-expansion-panel-text>

        </v-expansion-panel>

        <v-expansion-panel>
            <v-expansion-panel-title> Expériences </v-expansion-panel-title>
            <v-expansion-panel-text>

                 <CoachExperience :experiences="experiences" v-if="loaded" />
            </v-expansion-panel-text>

        </v-expansion-panel>

        <v-expansion-panel  v-if="annonce.review_count>0">

            <v-expansion-panel-title>
                Avis
            </v-expansion-panel-title>

            <v-expansion-panel-text>
               <CoachReviews :annonce="annonce"/>
            </v-expansion-panel-text>

        </v-expansion-panel>

    </v-expansion-panels>

</div>

</div>

</template>

<style scoped lang="scss">

    .annonce_tabs{
        box-shadow: 0 12px 35px rgba(0,0,0,.08);
    }

    .service_card{
         box-shadow: 0 12px 35px rgba(0,0,0,.08);
         border: 1px #ddd solid     ;
         border-radius: 0px ;
    }

    .header_content {
        max-width: 900px;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    .service_label {
        color: $secondary-color;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1.5px;
        margin-bottom: 12px;
    }

    .v-expansion-panel-text__wrapper{
        padding: 0px !important;
    }

</style>