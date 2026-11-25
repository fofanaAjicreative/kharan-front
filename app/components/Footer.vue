
<script lang="ts" setup>
 
  const { settings } = useSiteSettings() ; 

    const {  isCoach } = useAuth();
  

    function becomeCoach (){

        if(isCoach.value){
            navigateTo('/espace-coach') ;
            return ;
        }

        navigateTo('/register') ; 
    }

</script>


<template>
  <div class="footer"  >
    
    <div class="main_content">
      
      
      <v-row>
        
        
        <v-col cols="12" md="4">
          <NuxtLink to="/">
          <!-- logo -->
           <KharanLogo
                :color="'#FFF'"
                :weight="900"
              />
          </NuxtLink>
          <!-- logo -->
          
          <p  style="margin-top: 20px; color: #fff; font-size: 14px; max-width: 400px;">
              Trouvez le coach idéal ou développez votre
            activité grâce à notre plateforme.
          </p>  

        </v-col>

        <!-- Plateforme -->
        <v-col cols="6" md="3">
          <div class="footer-title">Liens</div>
          <ul class="footer-list">
            <li><NuxtLink to="/coachs">Je veux être coaché.e</NuxtLink></li>
            <li><NuxtLink   @click="becomeCoach()">Je suis Coach</NuxtLink></li>
            <!-- <li><NuxtLink to="/blog">Blog</NuxtLink></li> -->
            <li><NuxtLink to="/nous-contacter">Nous contacter</NuxtLink></li>
             
          </ul>
        </v-col>
 

        <!-- Légal -->
        <v-col cols="6" md="3">
          <div class="footer-title">  Ressources </div>
          <ul class="footer-list">
            <li><NuxtLink to="/a-propos">À propos</NuxtLink></li>
            <li><NuxtLink to="/confidentialite">Politique de confidentialité</NuxtLink></li>
            <li><NuxtLink to="/cgu">Conditions d'utilisation</NuxtLink></li>
            <li><NuxtLink to="/cgv">Conditions générales de vente</NuxtLink></li>
            <li><NuxtLink to="/mentions-legales">Mentions légales</NuxtLink></li>
            
          </ul>
        </v-col>

        <!-- social -->
        <v-col cols="6" md="2">
          <div class="footer-title"> Suivez-nous </div>
          <ul class="footer-list">
            <li>  <NuxtLink to="/"> <v-icon color="secondary">mdi-facebook</v-icon> Facebook </NuxtLink></li>
            <li><NuxtLink to="/"> <v-icon color="secondary">mdi-instagram</v-icon> Instagram </NuxtLink></li>
            <li><NuxtLink to="/"> <v-icon color="secondary">mdi-linkedin</v-icon>LinkedIn</NuxtLink></li>
            <li><NuxtLink to="/"> <v-icon color="secondary">mdi-pinterest</v-icon>TikTok</NuxtLink></li>
          </ul>
        </v-col>

      </v-row>

    
      <!-- BOTTOM -->
      <v-divider class="my-4" color="#FFF"></v-divider>
      <v-row class="pb-4" align="center">
          <v-col cols="12" md="6" class="text-caption">
            © 2026 Kharan. Tous droits réservés.
          </v-col>
          <v-col cols="12" md="6" class="text-md-right text-caption">
            <span>Concu pour accompagner votre réussite.</span>
          </v-col>
      </v-row>

    </div>
  </div>

</template>

<style scoped>

  .main_content{
    margin: auto;
    padding: 60px 20px ;
  }

  @media (min-width: 1600px) {
      .main_content  {
          max-width: 1600px !important;
      }
  }

   @media (max-width: 1024px) {
      .main_content  {
        padding: 40px 20px ;
      }
  }
  
.footer {
  background-color: #000; /* fff4f2 */
  color: #FFF;
  position: relative;
  overflow: hidden;
}

/* TITRES */
.footer-title {
  font-weight: 700;
  font-size: 16px;
  
}

/* TEXT */
.footer-text {
  font-size: 13px;
  color: #FFF;
}



/* LIST */
.footer-list {
  list-style: none;
  padding: 0;
  margin-top: 15px;
}

.footer-list li a {
  margin-bottom: 10px;
  color: #FFF;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 8px;
}

.footer-list li a:hover {
  text-decoration: none ;
}
 
 
</style>