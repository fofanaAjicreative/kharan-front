<script setup lang="ts">

    const { truncate } = useText() ;

    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;

    const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;
   

</script>

<template>

<v-card   class="coach_hero"  v-if="annonce" >
 
    <v-card-text>
        <div class="header d-flex ga-10">

            <div class="coach_photo">
               
                <v-img class="profile_avatar"
                    :src="annonce.photo? 
                        annonce.photo.media_url: '/images/profile.png'"
                /> 
                 
            </div>

            <div class="coach_info">

                <div class="coah_name">
                    <span class="me-1">{{ annonce.user?.firstname }} {{ annonce.user?.lastname }} </span>
                    <v-chip v-if="annonce.is_certified"
                        prepend-icon="mdi-check-circle" 
                        color="info" 
                        size="small" 
                        variant="tonal" > Certifié 
                    </v-chip>
                </div>
                
                <div class="coah_title  d-flex justify-space-between align-center">
                    <span class="text-info"> {{ annonce.title }} </span>
                </div> 

                <v-row class="align-center mt-2 mb-4 justify-space-between">
                    <div class="d-flex align-center ga-2" >
                        <v-icon color="#000" icon="mdi-map-marker">  </v-icon>
                        {{ annonce.city }} 
                    </div>

                    <div  v-if="mobile && annonce.review_count>0"  class="d-flex ga-0">
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

                <div class="bio mt-4">
                    {{   truncate(annonce.bio, 300)  }}
                </div>

            </div>

        </div>
        
        <div v-if="mobile" class="mt-4">
            <CoachSidebarContent :annonce="annonce" /> 
        </div>

        
    </v-card-text>
    
</v-card>

</template>

<style scoped lang="scss">

    .coach_hero{
        box-shadow: 0 12px 35px rgba(0,0,0,.08);
        border: 0px #eee solid ;
        border-radius: 0px;
        padding: 4px;
    }

    .coah_name{
        font-size: 20px;
        font-weight: bold ;
        line-height: normal;
    }

    .coah_title{
        font-size: 13px;
        color:  #424244; //$secondary-color ;
        margin-top: 8px;
    }

    .bio {
        font-size: 13px;
    }

    .coach_photo{
        width: 250px;
        height: auto ;
        display: flex;
        justify-content: center;
    }

    .profile_avatar{
        width: 250px ;
        height: 100%;
    }
 
    @media(max-width:700px){

    .coach_photo{
            width: 100%;
            height: auto ;
        }
    }

    

@media(max-width:700px){
    .header{
        flex-direction: column;
        align-items: center;
        
    }
}

</style>