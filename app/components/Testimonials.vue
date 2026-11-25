
<script setup lang="ts">
const testimonials = [
  {
    initials: 'AM',
    name: 'Patrick Casseday',
    role: 'Manager',
    coaching: 'Leadership & management',
    quote:
      'J’avais du mal à prendre du recul face aux difficultés de mon équipe. Le coaching m’a aidé à mieux communiquer, à déléguer et à aborder mon rôle de manager avec davantage de sérénité.',
    result: 'Une posture managériale plus affirmée',
    avatar:"/images/ous.jpg"
  },
  {
    initials: 'SD',
    name: 'Patrick Casseday',
    role: 'Entrepreneur',
    coaching: 'Stratégie & entrepreneuriat',
    quote:
      'Je voulais développer mon activité sur un nouveau marché, mais je ne savais pas par où commencer. Les échanges avec mon coach m’ont permis de clarifier ma stratégie et de structurer mes prochaines étapes.',
    result: 'Une stratégie plus claire',
    avatar:"/images/coach.png",
  },
  {
    initials: 'FK',
    name: 'Patrick Casseday',
    role: 'Professionnelle en reconversion',
    coaching: 'Évolution professionnelle',
    quote:
      'J’avais envie de changer de voie, mais je doutais de mes compétences. Cet accompagnement m’a permis de mieux identifier mes forces et de construire un projet professionnel qui me correspond.',
    result: 'Un projet professionnel mieux défini',
  },
]
</script>

<template>
  <section class="testimonials_section">
    <div class="container">

      <!-- Header -->
      <div class="header_content text-center mx-auto">

        <p class="section_label">  TEMOIGNAGES </p>

        <h2 class="main_title">
          Leurs objectifs.
          <span>Leurs progrès.</span>
        </h2>

        <p class="main_title2">
          Derrière chaque objectif, il y a une personne qui souhaite
          avancer. Découvrez comment le coaching peut aider à franchir
          un cap, prendre confiance et concrétiser ses ambitions.
        </p>

      </div>

      <!-- Testimonials -->
      <v-row class="testimonials_row">

        <v-col
          v-for="testimonial in testimonials"
          :key="testimonial.initials"
          cols="12"
          md="4"
          class="testimonial_col" >

          <v-card
            class="testimonial_card"
            elevation="0" >

            <!-- Quote -->

            <div class="d-flex ga-2">

              <div>

                <div class="quote_icon ">
                  <v-icon
                    icon="mdi-format-quote-open"
                    color="secondary"
                    size="32"
                  />
                </div>

              </div>
              

                <div>
                    <p class="testimonial_quote">
                      {{ testimonial.quote }}
                    </p>
                </div>

            </div>
            

            <!-- Result -->
            <div class="result_wrapper">

              <v-icon
                icon="mdi-check-circle-outline"
                color="success"
                size="18"
              />

              <span class="result_text">
                {{ testimonial.result }}
              </span>

            </div>

            <v-divider class="divider mb-4"></v-divider>

            <!-- Author -->
            <div class="author_wrapper">

              <v-avatar v-if="testimonial.avatar"
                size="46"
                color="primary"
                class="author_avatar" >
                <v-img :src="testimonial.avatar" />
              </v-avatar>

              <div class="author_info">
                <p class="author_name"> {{ testimonial.name }} </p>
                <p class="author_role"> {{ testimonial.role }} </p>
              </div>

            </div>

          </v-card>

        </v-col>

      </v-row>

      <!-- CTA -->
      <!-- <div class="cta_wrapper">

        <p class="cta_text">
          Et si votre prochaine réussite commençait ici ?
        </p>

        <v-btn
          to="/coachs"
          color="black"
          variant="flat"
          size="large"
          class="main_btn"
        >
          Trouver mon coach

          <template #append>
            <span class="icon_box_dark2 icon_box_large">
              <v-icon icon="mdi-arrow-right" />
            </span>
          </template>

        </v-btn>

      </div> -->

    </div>
  </section>
</template>

<style lang="scss" scoped>
.testimonials_section {
  background: #fff;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 1500px;
  padding: 80px 24px;
}

.header_content {
  max-width: 850px;
  margin-bottom: 48px;
}

.section_label {
  color: $secondary-color;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 14px;
}

.main_title {
  font-size: 36px;
  line-height: 1.2;
  font-weight: 700;
  margin-bottom: 20px;

  span {
   /*  display: block; */
  }
}

.main_title2 {
  font-size: 16px;
  line-height: 1.7;
  color: #666;
  max-width: 780px;
  margin: 0 auto;
}

.testimonials_row {
  align-items: stretch;
}

.testimonial_col {
  display: flex;
}

.testimonial_card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  padding: 28px;

  background: #fff3f0;
  border: 0px solid #f8e8e4;
  border-radius: 10px;
  
}

.card_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.quote_icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  background: #fff;
  border-radius: 12px;
}

.coaching_label {
  font-size: 12px;
  font-weight: 600;
  color: #777;
  text-align: right;
}

.testimonial_quote {
  font-size: 15px;
  line-height: 1.8;
  color: #292929;

  margin-bottom: 24px;
}

.result_wrapper {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  margin-top: auto;
  margin-bottom: 24px;
}

.result_text {
  font-size: 13px;
  line-height: 1.5;
  font-weight: 600;
  color: #333;
}

.card_divider {
  margin-bottom: 20px;
  border-color: #eadbd7;
}

.author_wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author_avatar {
  flex-shrink: 0;

  span {
    font-size: 14px;
    font-weight: 700;
    color: #333;
  }
}

.author_info {
  min-width: 0;
}

.author_name {
  font-size: 15px;
  font-weight: 700;
  color: #222;
  margin-bottom: 3px;
  margin-top: 0px;
}

.author_role {
  font-size: 13px;
  color: #777;
  margin-bottom: 0;
  margin-top: 0;
}

.cta_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  margin-top: 48px;
}

.cta_text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.main_btn {
  min-width: 220px;
}

@media screen and (max-width: 960px) {
  .container {
    padding: 60px 20px;
  }

  .header_content {
    margin-bottom: 32px;
  }

  .testimonial_card {
    padding: 24px;
  }
}

@media screen and (max-width: 600px) {
  .container {
    padding: 45px 16px;
  }

  .main_title {
    font-size: 27px;
  }

  .main_title2 {
    font-size: 15px;
  }

  .testimonial_card {
    padding: 22px;
  }

  .testimonial_quote {
    font-size: 14px;
  }

  .cta_wrapper {
    margin-top: 32px;
  }

  .cta_text {
    font-size: 16px;
  }

  .main_btn {
    width: 100%;
  }
}
</style>
