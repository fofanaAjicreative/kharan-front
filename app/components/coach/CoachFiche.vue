<script setup lang="ts" >

const { truncate } = useText() ;

  const props = withDefaults(
    defineProps<{  annonce?: any }>(), { annonce: '' }
  )
  const annonce = props.annonce ;

 // console.log("Fiche coach:",annonce);
  

  const challenges = computed(() =>
      annonce.challenges.slice(0, 5)
    )

  const remainingChallenges = computed(
    () => annonce.challenges.length - 5
  )

</script>

<template>
    
  <v-card 
      :to="`/coach/${annonce.id}`" 
      class="coach-card d-flex flex-column" 
      elevation="0" >

    <!-- photo -->
    <div class="coach_photo">
        
           <v-img class="profile_avatar"
              :src="annonce.photo? 
                  annonce.photo.media_url: '/images/profile.png'"
              lazy-src="/images/image_placeholder.jpg"
            cover
          > 

          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>

          </v-img> 
      
    </div>
    <!-- /photo -->
 
    <!-- Contenu -->
    <v-card-text class="card_content">

      <div class="coah_name">

        <span class="me-1">{{ annonce.user.firstname }} {{ annonce.user.lastname }} </span>

        <v-chip v-if="annonce.is_certified"
            prepend-icon="mdi-check-circle" 
            color="info" 
            size="small" 
            variant="tonal" 
            class="ml-0"
            > Certifié 
        </v-chip>

      </div>

      <div class="coah_title  d-flex justify-space-between align-center">
        <span class="text-info"> {{ annonce.title }} </span>
      </div> 

      <v-row class="align-center mt-2 mb-4" v-if="annonce.review_count>0">
        <v-rating
          :model-value="annonce.review_avg"
          color="amber"
          density="compact"
          size="18"
          half-increments
          readonly ></v-rating>

        <div class="text-grey ms-2">
          ({{ annonce.review_count }} avis)
        </div>
      </v-row>
      
      <!-- <v-divider class="my-2" /> -->

      <div class="bio mt-3">
        {{   truncate(annonce.bio, 300)  }}
       </div>
       

     <!--  <v-divider class="my-4" /> -->

      <!-- Tags -->
      <div class="mt-4">
        <v-chip v-for="tag in challenges" :key="tag.id"
          size="small" class="me-1 mb-1"
          color="secondary"
          variant="tonal" >
          {{ tag.name }}
        </v-chip>

        <v-chip v-if="remainingChallenges > 0"
          size="x-small"
          color="secondary"
          variant="outlined"
          class="me-2 mb-1" >
          +{{ remainingChallenges }}
        </v-chip>

      </div>

    <!-- Prend tout l'espace restant -->
    <div class="flex-grow-1"></div>

    </v-card-text>

    <!-- Disponibilité -->
     <v-divider class="mb-0 mt-0"></v-divider>
      <div class="d-flex justify-space-between align-center pa-4">
         
        <div class="d-flex align-center">
          <div class="bottom_title">  À partir de </div>
        </div>
     

       <div>
         
          <div class="bottom_description">
            {{annonce.prices.min_price}} &euro; 
          </div>
        </div>

      </div>

      <v-divider class="mb-0 mt-0"></v-divider>

      <v-card-actions>
          <v-btn
            :to="`/coach/${annonce.id}`" 
            color="info"
            text="Reserve"
            variant="tonal"
            rounded="0"
            
            prepend-icon="mdi-calendar-multiselect-outline"
            block
           > Mes services</v-btn>
      </v-card-actions>

    
  </v-card>
  
</template>



<style scoped lang="scss">
 

.coach-card {
    overflow: hidden;
    transition: all .25s ease;
    margin: 10px ; 
    border-radius: 0px;
    box-shadow:  0 12px 32px rgba(0,0,0,.12) !important;
    cursor: pointer;
    width: 340px;
}

.coach-card:hover {
  transform: translateY(-4px);
  box-shadow:  0 22px 32px rgba(0,0,0,.12) !important;
}

 
.hero-overlay {
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(0,0,0,.7),
      rgba(0,0,0,.15),
      transparent
    );
}


.hero-content {
  position: absolute;

  left: 20px;
  right: 20px;
  bottom: 20px;

  z-index: 1;
}


.price-chip {
  font-weight: 600;
  font-size: 14px;
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

 .bottom_title{
      font-size: 14px; 
  }
 .bottom_description{
      font-size: 14px; 
  }

   .coach_photo{
        width: 340px;
        height: auto ;
        height: 350px;
        display: flex;
        justify-content: center;
    }

    .profile_avatar{
        width: 100% ;
        height: 100%;
    }
 
    @media(max-width:700px){

    .coach_photo{
            width: 100%;
            height: auto ;
        }
    }
 

</style>