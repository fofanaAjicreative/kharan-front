<script setup lang="ts">

   const { $api } = useNuxtApp() ;
    import { useDisplay } from 'vuetify' ;
    const { mobile } = useDisplay() ;

    const { truncate } = useText() ;


    const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;

  
    const annonce = props.annonce ;


    const loaded = ref(false) ;
    const reviews = ref<any>([]) ;
    
    

/* ----------------------------------------------------------------------------------*/

 
  function loadReviews(){ 
            
      $api(`annonces/${annonce.id}/reviews`,{
        method: 'GET',
       }).then((res :any) =>{

        console.log("REVIEWS:",res.data );
        reviews.value =  res.data.reviews ;
         
        loaded.value = true ;
      }).catch(error=>{
        console.log("Error:",error); 
      })
               
  }

/* -------------------------- local pagination ----------------------------------- */

   const visibleReviews = ref(3) ;
   function showMore() {
     visibleReviews.value += 3
   }

   const hasMore = computed( () =>
       reviews.value.length > visibleReviews.value
   )

/* ------------------------------------------------------------------------------- */

 const toggleDescription  =  (review :any) => {
      review.expanded = !review.expanded ;
  }


/* --------------------------------------------------------------------------------- */

    onMounted(() => {
      loadReviews() ;
    });


</script>

<template>
    <div class="main_content">   
        
        <!-- HEADER -->
        <v-card-text class="card_content">
            <div class="d-flex align-center justify-space-between flex-wrap">
                <div>
                    <h2 class="text-h5 font-weight-bold">
                        Avis des clients
                    </h2>

                    <div class="text-medium-emphasis">
                        Découvrez les retours d'expérience des personnes accompagnées.
                    </div>

                </div>

                <div class="text-right mt-4">

                    <div class="text-h1 font-weight-bold text-secondary">
                        {{ annonce.review_avg }}
                    </div>

                    <v-rating
                        :model-value="annonce.review_avg"
                        readonly
                        density="compact"
                        color="amber"
                        half-increments
                    />

                    <div class="text-caption">
                        ({{ annonce.review_count }} avis)
                    </div>

                </div>

            </div>

        </v-card-text>

        <v-divider />
         <!-- LISTE -->

        <template v-for="(review,index) in reviews.slice(0, visibleReviews)" :key="index">

            <v-card-text class="card_content">

                <div class="d-flex">
                    <v-avatar size="54" >
                        <v-img :src="review.user.photo?review.user.photo.media_url:'/images/profile.png'" />
                    </v-avatar>

                    <div class="ml-4 flex-grow-1">
                           <div class="d-flex justify-space-between flex-wrap" >

                             <div>

                                <div  class="font-weight-bold" >

                                    {{ review.user.firstname }}
                                    {{ review.user.lastname }}

                                </div>

                                <div class="text-caption text-medium-emphasis" >

                                    {{ formatMonthYear(review.created) }}

                                </div>

                             </div>
                             <v-rating
                                :model-value="review.rating"
                                readonly
                                size="small"
                                density="compact"
                                color="amber"
                                half-increments
                                 />

                            </div>

                             <div class="mt-4 text-body-1" >
                               {{ review.expanded ? review.comment : truncate(review.comment, 400) }}
                                <v-btn v-if="review.comment.length>400"
                                    variant="text" color="secondary" size="small"
                                    class="toggle_description"
                                    @click="toggleDescription(review)" >
                                    {{ review.expanded ? 'Voir moins' : 'Voir plus' }}
                                </v-btn>
                            </div>
                    </div>
                    
                </div>
            </v-card-text>

        </template>


           <!-- more  -->
                <div class="text-center mt-6">
                    <v-btn v-if="hasMore"
                        color="#424242"
                        variant="outlined"
                        size="small"
                        @click="showMore" > Voir plus d'avis
                    </v-btn>
                    </div>
            <!-- / more  -->
         
   </div>
</template>


<style lang="scss" scoped>

  .main_content{
    padding : 20px
  }

    @media screen and (max-width: 600px) {
          .main_content{
            padding: 0px ;
          }
    }

    .card_content{
        padding: 20px !important;
    }

    
    @media screen and (max-width: 600px) {

        .card_content{
            padding: 8px !important;
        }
        
    }


</style>