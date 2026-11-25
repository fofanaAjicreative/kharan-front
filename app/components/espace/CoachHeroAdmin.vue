<script setup lang="ts">

    import CoachSidebarContentAdmin from '~/components/espace/CoachSidebarContentAdmin.vue' ;
 
    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;
   import { cleanHtml,cleanAndTruncate, stripHtml } from '~/utils/html'

/* ----------------------------- propos ----------------------------------------------------- */

    const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;
   
 
/* ---------------------------------------------------------------------------------- */

 
  const toggleDescription  =  (seance :any) => {
      props.annonce.expanded = !seance.expanded ;
  }
  
/* ---------------------------------------------------------------------------------- */


</script>

<template>


<v-card class="coach_hero" elevation="0" >

    <v-card-item class="coach_hero">
        <v-card-text class="pa-2">
         <div class="card_shadow pa-4">
            <div class="header d-flex ga-10">
                <div class="coach_photo">
                    <v-avatar size="250" rounded="0" class="profile-avatar" >
                        <v-img 
                            :src="annonce.photo? 
                                annonce.photo.media_url: '/images/profile.png'" /> 
                    </v-avatar>
                    <div>
                        
                    </div>
                </div>

                <div class="coach_info">

                    <div class="coah_name">
                        <span class="me-1">{{ annonce.user?.firstname }} {{ annonce.user?.lastname }} </span>

                        <v-chip v-if="annonce.user.annonce_completed" 
                             prepend-icon="mdi-check-circle" color="info" size="small" variant="tonal" >
                             Complète
                        </v-chip>
                        <v-chip v-else
                             prepend-icon="mdi-alert" color="warning" size="small" variant="tonal" >
                            Incomplète
                        </v-chip>
                        
                    </div>
                    
                    <div class="coah_title  d-flex justify-space-between align-center">
                        <span> {{ annonce.title }} </span>
                    </div> 

                    <v-row class="align-center mt-2 mb-4 justify-space-between">
                        <div class="d-flex align-center ga-2" >
                            <v-icon color="#000" icon="mdi-map-marker">  </v-icon>
                            {{ annonce.city }} 
                        </div>

                        <div  v-if="annonce.review_count>0"  class="d-flex ga-0">
                            <v-rating
                                :model-value="annonce.review_avg"
                                color="amber"
                                density="compact"
                                size="18"
                                half-increments
                                readonly ></v-rating>
                            <div class="text-grey ms-4">( {{ annonce.review_count }} avis) </div>
                        </div>
                    </v-row>
                    
                    <v-divider class="my-2"> </v-divider>

                    <div class="bio mt-6">
                        {{   annonce.bio  }}
                    </div>

                    <div v-if="!mobile" class="mt-8">
                        <CoachSidebarContentAdmin :annonce="annonce" /> 
                    </div>

                </div>

            </div>
            
            <div v-if="mobile" class="pa-0 mt-4">
                <CoachSidebarContentAdmin :annonce="annonce" /> 
            </div>
 
          </div>
        </v-card-text>
        <v-card-text class="pa-2">
              <!-- description -->
            <div class="card_shadow pa-4" >

                <template v-if="annonce.expanded">
                    <div v-html="cleanHtml(annonce.description)"></div>
                </template>

                <template v-else>
                    <div v-html="cleanAndTruncate(annonce.description,500)"></div>
                </template>

                <v-btn v-if="annonce.description.length>500"
                    @click="toggleDescription(annonce)"
                    variant="text" 
                    color="secondary" size="default"
                    class="toggle_description"
                    >
                    {{ annonce.expanded ? 'Voir moins' : 'Voir plus' }}
                  </v-btn>

            </div>
            <!-- /description -->
        </v-card-text>
    </v-card-item>

 
 
</v-card>

</template>

<style scoped lang="scss">
 
    .coah_name{
        font-size: 20px;
        font-weight: bold ;
        line-height: normal;
    }

    .coah_title{
        font-size: 13px;
        color:  $info-color ;
        margin-top: 8px;
    }

    .bio {
        font-size: 13px;
    }

  .coach_hero{
    padding: 10px;
  }
 

@media(max-width:839px){

 .header{
    flex-direction: column;
    align-items: center;
     
 }

 .coach_hero{
    padding: 4px;
  }

}

</style>