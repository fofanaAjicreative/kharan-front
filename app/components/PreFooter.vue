<script setup lang="ts">

  const {  isCoach } = useAuth();


/* --------------------------------------------------------------- */ 

    function becomeCoach (){

        if(isCoach.value){
            navigateTo('/espace-coach') ;
            return ;
        }

        navigateTo('/register') ; 
    }

/* --------------------------------------------------------------- */ 

</script>

<template>
  <section class="cta-section">
     
    <div class="cta-container d-flex flex-wrap">
        
       <div class="cta-img">  </div>
        <div class="cta-content"> 

          <h2 class="main_title">
            Et si votre prochaine réussite commençait ici ?
          </h2>

          <p class="main_title2">
            Donnez un nouvel élan à votre évolution personnelle. Trouvez le coach qui correspond à vos besoins ou rejoignez notre communauté de coachs pour développer votre activité.
          </p>

          <div class="d-flex flex-wrap flex-column flex-md-row justify-start ga-3">

            <v-btn
              @click="becomeCoach()"
              color="primary" 
              size="large" 
              variant="flat"
              to="/coachs" 
              class="main_btn"
               >
              Devenir coach </v-btn>
         
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

        </div>
       
    </div>
    
  </section>
</template>

<style scoped>

  .cta-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      background: #ffac7d;
      padding: 5%;
      width: 50%; 
      height: 456px;
  }

  .cta-img {
    background-image: url('/assets/images/cta.png');
    background-size: cover;
    background-position: center;
    width: 50%;
    height: 456px;
  }

  @media screen and (max-width:700px) {

    .cta-content {
      width: 100%;
      height: auto;
      padding: 20px;
    }

    .cta-img {
      width: 100%;
    }

  }



  .main_title {
    font-size: 26px;
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .main_title2 {
    font-size: 16px;
    line-height: 1.7;
    max-width: 800px;
    margin: 0 auto;
    margin-bottom: 30px;
    line-height: 1.2;

  }

  .main_btn {
    min-width: 280px;
  }


 
</style>