
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



const coachBenefits = [
  {
    icon: 'mdi-account-search-outline',
    title: 'Rencontrer de nouveaux clients',
    description:
      'Gagnez en visibilité auprès de personnes qui recherchent un accompagnement correspondant à votre expertise.',
  },
  {
    icon: 'mdi-star-outline',
    title: 'Valoriser son expertise',
    description:
      'Présentez votre parcours, vos certifications et vos domaines d’intervention pour inspirer confiance.',
  },
  {
    icon: 'mdi-calendar-check-outline',
    title: 'Proposer ses accompagnements',
    description:
      'Présentez vos services, vos formats de coaching et vos tarifs pour permettre aux clients de choisir.',
  },
  {
    icon: 'mdi-trending-up',
    title: 'Développer son activité',
    description:
      'Faites grandir votre clientèle et donnez une nouvelle dimension à votre activité de coach.',
  },
]



</script>

<template>
  <section class="main_content">
    <div class="container">

      <!-- Section header -->
      <div class="header_content text-center mx-auto">
        <p class="section_label"> POUR LES COACHS </p>

        <h2 class="main_title">
          Votre expertise mérite
          <span>d'aller plus loin.</span>
        </h2>

        <p class="main_title2">
          Faites rayonner votre savoir-faire, développez votre clientèle
          et accompagnez davantage de personnes dans leur réussite.
          Nous vous aidons à donner de la visibilité à votre activité.
        </p>
      </div>

      <!-- Main content -->
      <v-row class="content_row">

        <!-- Coach benefits -->
        <v-col cols="12" md="7">
          <v-row class="cards_row">
            <v-col
              v-for="(benefit, index) in coachBenefits"
              :key="benefit.title"
              cols="12"
              sm="6"
              class="card_col" >

              <div class="bloc">

                  <div class="icon_wrappe">
                      <v-icon
                        :icon="benefit.icon"
                        color="secondary"
                        size="26"
                      />
                  </div>

                  <div class="bloc_content">

                    <h3 class="bloc_title"> {{ benefit.title }} </h3>
                    <p class="bloc_content"> {{ benefit.description }} </p>
 
                  </div>

              </div>


            </v-col>
          </v-row>

          <!-- Main CTA -->
          <div class="cta_wrapper">
            <v-btn
              @click="becomeCoach()"
              color="black"
              variant="flat"
              size="large"
              class="main_btn"
              spaced="end"
            >
              Devenir coach

              <template #append>
                <span class="icon_box_dark2 icon_box_large">
                  <v-icon icon="mdi-arrow-right" />
                </span>
              </template>

            </v-btn>
          </div>

        </v-col>
        <!-- col left -->

        <!-- Image -->
        <v-col cols="12" md="5">
          <div class="image_wrapper">
            <img
              src="/assets/images/coach.png"
              alt="Un coach professionnel qui partage son expertise"
              class="side_image"
              loading="lazy"
            />
          </div>
        </v-col>

      </v-row>

    </div>
  </section>
</template>


<style lang="scss" scoped>


.main_content {
  background: #fff;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 1500px;
  padding: 70px 24px;
}

.header_content {
  max-width: 900px;
}

.section_label {
  color: $secondary-color;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

.main_title {
  font-size: 36px;
  line-height: 1.2;
  font-weight: 700;
  margin-bottom: 20px;

  span {
    display: block;
  }
}

.main_title2 {
  font-size: 16px;
  line-height: 1.7;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

.content_row {
  margin-top: 40px;
}

.image_wrapper {
  overflow: hidden;
  border-radius: 24px;
}

.side_image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 480px;
  max-height: 580px;
  object-fit: cover;
}

.cards_row {
  margin: -8px;
}

.card_col {
  display: flex;
}

.need_link {
  display: block;
  width: 100%;
  color: inherit;
  text-decoration: none;
}

.bloc {

    display: flex;
    gap: 16px;
    width: 100%;
    /* min-height: 120px; */
    height: 100%;
    padding: 20px;
    border-radius: 10px;
    background: $primary-color;

    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 14px rgba(0, 0, 0, 0.06);
    }
}
 
 

.bloc_title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 8px;
  margin-top: 0px;
}

.bloc_content {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin-top: 4px;
  margin-bottom: 0px;
  
}

.bloc_footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-size: 13px;
  font-weight: 600;

  margin-top: auto;
}

.cta_wrapper {
  display: flex;
  align-items: center;
  justify-content: start;
  margin-top: 30px;
}

.main_btn {
  min-width: 300px;
}

@media screen and (max-width: 960px) {
  .container {
    padding: 50px 20px;
  }

  .side_image {
    min-height: 350px;
    max-height: 450px;
  }
}

@media screen and (max-width: 600px) {
  .container {
    padding: 40px 16px;
  }

  .main_title {
    font-size: 27px;
  }

  .main_title2 {
    font-size: 15px;
  }

  .content_row {
    margin-top: 24px;
  }

  .side_image {
    min-height: 300px;
    max-height: 360px;
  }

  .bloc {
    min-height: auto;
    padding: 18px;
  }

  .cta_wrapper {
    margin-top: 20px;
  }

  .main_btn {
    width: 100%;
  }

  .main_title , .main_title2 {
    text-align: left;
  }


}
</style>