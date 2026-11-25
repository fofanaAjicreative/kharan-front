
<script setup lang="ts">
const coachingNeeds = [
  {
    icon: 'mdi-account-group-outline',
    title: 'Développer son leadership',
    description:
      'Affirmez votre leadership, fédérez vos équipes et prenez des décisions avec confiance.',
  },
  {
    icon: 'mdi-lightbulb-outline',
    title: 'Réussir son projet entrepreneurial',
    description:
      'Explorez un nouveau marché, affinez votre stratégie et identifiez les opportunités de croissance.',
  },
  {
    icon: 'mdi-briefcase-outline',
    title: 'Faire évoluer sa carrière',
    description:
      'Préparez une reconversion, décrochez un nouveau poste ou donnez un nouvel élan à votre parcours.',
  },
  {
    icon: 'mdi-account-star-outline',
    title: 'Gagner en confiance et en impact',
    description:
      'Améliorez votre communication, dépassez vos blocages et exprimez pleinement votre potentiel.',
  },
]
</script>

<template>
  <section class="main_content">
    <div class="container">

      <!-- Section header -->
      <div class="header_content text-center mx-auto">
        <p class="section_label">
          POUR LES CLIENTS
        </p>

        <h2 class="main_title">
          Vous avez un objectif.
          <span>Trouvez le coach qui vous fera avancer.</span>
        </h2>

        <p class="main_title2">
          Développez vos compétences, relevez de nouveaux défis et
          concrétisez vos ambitions. Découvrez des coachs qui vous
          accompagnent avec une approche adaptée à vos besoins.
        </p>
      </div>

      <!-- Main content -->
      <v-row class="content_row" >

        <!-- Image -->
        <v-col cols="12" md="5">
          <div class="image_wrapper">
            <img
              src="/assets/images/coach.avif"
              alt="Un professionnel accompagné dans son développement"
              class="side_image"
              loading="lazy"
            />
          </div>
        </v-col>

        <!-- Coaching needs -->
        <v-col cols="12" md="7">
          <v-row class="cards_row">
            <v-col
              v-for="(need, index) in coachingNeeds"
              :key="need.title"
              cols="12"
              sm="6"
              class="card_col" >
              
              <NuxtLink
                to="/coachs"
                class="need_link" >

                <div class="bloc">

                  <div class="icon_wrappe">
                      <v-icon
                        :icon="need.icon"
                        color="secondary"
                        size="26"
                      />
                  </div>

                  <div class="bloc_content">

                    <h3 class="bloc_title"> {{ need.title }} </h3>
                     <p class="bloc_content"> {{ need.description }} </p>

                    <!-- <div class="bloc_footer">
                      <span>Découvrir les coachs</span>

                      <v-icon
                        icon="mdi-arrow-right"
                        color="secondary"
                        size="small"
                      />
                    </div> -->

                  </div>

                </div>
                
              </NuxtLink>
            </v-col>
          </v-row>

          <!-- Main CTA -->


          <div class="cta_wrapper">
            <v-btn
              to="/coachs"
              color="black"
              variant="flat"
              size="large"
              class="main_btn"
              spaced="end"
            >
              Trouver un coach

              <template #append>
                <span class="icon_box_dark2 icon_box_large">
                  <v-icon icon="mdi-arrow-right" />
                </span>
              </template>

            </v-btn>
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
  font-weight: 700;
  line-height: normal ;
  margin-bottom: 20px;

  span {
    display: block;
  }
}

.main_title2 {
  font-size: 16px;
  line-height: 1.3;
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
