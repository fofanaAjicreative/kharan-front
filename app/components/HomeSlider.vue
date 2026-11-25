<script lang="ts" setup>
 
    const {  isCoach } = useAuth();

   const currentIndex = shallowRef(0) ;

     const items = ref([
         
        {
        authorName: 'Emma Kathleen',
        avatarId: 'women/34',
        subtitle: '521 followers',
        src: '/images/cta.png',
        },
        {
        authorName: 'Anthony McKenzie',
        avatarId: 'men/78',
        subtitle: '6k followers',
        src: '/images/coach.png',
        },
    ])

   /* --------------------------------------------------------------- */ 

    function becomeCoach (){

        if(isCoach.value){
            navigateTo('/espace-coach') ;
            return ;
        }

        navigateTo('/register') ; 
    }

</script>

<template>


  <!-- HERO -->

    <div v-container class="hero">
       <div class="container">

        <v-row>

         <v-col cols="12" md="5">

            <div class="left_side">

                <p class="title">
                  Révélez votre potentiel,allez plus loin.
                </p>

                <p class="sub_title">
                    Le coaching qui vous fait grandir, vous et vos ambitions. Trouvez le coach qui vous accompagne vers vos objectifs.
                </p>

                <!-- bottons -->
                <div class="d-none d-md-flex flex-wrap justify-start ga-2 mt-10">

                    <v-btn 
                        @click="becomeCoach()" 
                        color="#000" 
                        variant="flat" 
                        size="large"
                        class="main_btn"
                        > 
                        Devenir coach
                    </v-btn>

                    <v-btn
                        to="/coachs" 
                        color="secondary" 
                        variant="flat"
                        size="large"
                        spaced="end"
                        class="main_btn"
                        >
                        <span class="text-left" > Trouver un coach </span>
                        <template v-slot:append>
                            <span class="icon_box_secondary icon_box_large">
                                <v-icon  icon="mdi-arrow-right">  </v-icon>
                            </span>
                        </template>
                    </v-btn>
                    
                </div>
                <!-- /bottons -->

            </div>

        </v-col>

        <v-col cols="12" md="7">
            <div class="rigth_side">

                   <v-sheet class="overflow-hidden"  rounded="xl">

                    <v-carousel
                        cycle
                        v-model="currentIndex"
                        direction="vertical"
                        progress="secondary"
                        vertical-arrows="right"
                        vertical-delimiters="left"
                        hide-delimiter-background >


                        <template v-slot:prev="{ props }">
                            <v-btn
                                class="carousel_btn"
                                color="#00000030"
                                icon
                                variant="flat"
                                @click="props.onClick" > 
                                <v-icon icon="mdi-chevron-up" size="30" color="#eee"  > </v-icon> 
                            </v-btn>
                        </template>

                        <template v-slot:next="{ props }">
                            <v-btn
                                class="carousel_btn"
                                color="#00000030"
                                icon
                                cycle
                                variant="flat"
                                @click="props.onClick" > 
                                <v-icon icon="mdi-chevron-down" size="30" color="#eee"  > </v-icon> 
                            </v-btn>
                        </template>

                        <v-overlay
                            :scrim="false"
                            content-class="w-100 h-100 d-flex flex-column align-center justify-space-between pointer-pass-through py-3"
                            contained
                            model-value
                            no-click-animation
                            persistent>
    
                        </v-overlay>

                    <v-carousel-item
                        v-for="(item, i) in items"
                        :key="i"
                        :src="item.src"
                        cover
                        ></v-carousel-item>

                    </v-carousel>

                   </v-sheet>
                   
                
                <!-- mobile slider btns -->
                <div class="d-md-none d-flex flex-column flex-md-row justify-center ga-2 mt-6">

                     <v-btn 
                        @click="becomeCoach()" 
                        color="#000" 
                        variant="flat" 
                        size="large"
                        class="main_btn"
                        > 
                        Devenir coach
                    </v-btn>

                    <v-btn
                        to="/coachs" 
                        color="secondary" 
                        variant="flat"
                        size="large"
                        spaced="end"
                        class="main_btn"
                        >
                        <span class="text-left" > Trouver un coach </span>
                        <template v-slot:append>
                            <span class="icon_box_secondary icon_box_large">
                                <v-icon  icon="mdi-arrow-right">  </v-icon>
                            </span>
                        </template>
                    </v-btn>
                    
                </div>
                <!-- / mobile slider btns -->
                
            </div>
        </v-col>

        </v-row>
      </div>
    </div>
    <!--/ HERO -->
</template>

<style lang="scss" scoped>

    .container{
        max-width: 1600px;
        margin: 0px auto;
        padding: 20px 0px;
    }

    .hero{
        margin: 0px ;
        padding: 0px ;
        background: $primary-color;  
        padding-bottom: 10px;
    }


   .left_side{

        padding: 30px;

        .title {
          font-size: 50px ;
          line-height: normal ;
          margin-bottom: 20px;
        }

        .sub_title {
            font-size: 16px ;
            line-height: 1.3  ;
         }
        
        .main_btn {
            min-width: 250px;
        }

    }

   @media screen and (max-width: 1024px) {
   
      .left_side{

        padding: 10px;

        .title {
          font-size: 40px ;
          margin-top: 0px ;
         }

        .sub_title {
            font-size: 18px ;
        } 

    }

  }
    
 

    @media screen and (max-width: 768px) {
   
      .left_side{

        padding: 10px;

        .title {
          font-size: 35px ;
        }

        .sub_title {
            font-size: 18px ;
        } 

    }

  }


  /* ---------------------------------- carrousel  ------------------------------------------------ */


    .rigth_side{
         padding: 15px 30px;
    }

    .v-carousel{
        height: 500px !important;
    }

    @media screen and (max-width: 768px) {

        .rigth_side{
            padding: 10px;
        }


        .v-carousel{
            height: 350px !important;
        }
    }

  /* ---------------------------------- carrousel  ------------------------------------------------ */


</style>