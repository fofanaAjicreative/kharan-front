<!-- components/HowItWorks.vue -->

<template>
  <section class="how-it-works py-10">
    <v-container>

       <div class="d-flex justify-center">
            <div class="header_content text-center">
                <p class="main_title text-center">
                  Comment ça marche ?
                </p>
                <!-- <p class="main_title2 text-center">
                    Vous avez un objectif nous avons le Coach pour accompager votre reusite.Vous avez un objectif nous avons le Coach pour accompager votre reusite
                </p> -->
            </div>
        </div>

      <!-- Switch -->
      <div class="d-flex justify-center mb-12 mt-2">

        <v-btn-toggle
          v-model="mode"
          mandatory
          rounded="small"
          color="#fff3ed"
          class="coach-segment mx-auto d-flex" >

          <v-btn value="client" size="x-large">
            Je cherche un coach
          </v-btn>

          <v-btn value="coach" size="x-large">
            Je suis coach
          </v-btn>

        </v-btn-toggle>

      </div>

      <!-- Etapes -->
      <v-row>
        <v-col
          v-for="(step, index) in currentSteps"
          :key="index"
          cols="12"
          md="4" >
          
          <div class="step-wrapper">
            <v-card
              flat
              rounded="large"
              class="pa-8 text-center step-card"
              :color="step.background"
              min-height="240"
            >
              <v-icon
                :icon="step.icon"
                size="64"
                class="mb-6"
              />

              <h3 class="text-h6 font-weight-bold mb-1">
                {{ step.cardTitle }}
              </h3>

              <p class="text-medium-emphasis">
                {{ step.cardDescription }}
              </p>
            </v-card>

            <!-- Ligne -->
            <div class="timeline">
              <div class="timeline-line" />

              <div class="timeline-number">
                {{ index + 1 }}
              </div>
            </div>

            <div class="text-center mt-6">
              <h3 class="step-title">
                {{ step.title }}
              </h3>

              <p class="step-description mt-0">
                {{ step.description }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">

const mode = ref('client')

const clientSteps = [
  {
    icon: 'mdi-account-search',
    background: '#F3F0FF',
    cardTitle: 'Trouvez votre coach',
    cardDescription:
      'Parcourez les profils selon vos objectifs.',
    title: 'DÉCOUVREZ',
    description:
      'Explorez les profils de nos coachs.'
  },
  {
    icon: 'mdi-calendar-check',
    background: '#FFF3ED',
    cardTitle: 'Réservez votre séance',
    cardDescription:
      'Choisissez la date qui vous convient.',
    title: 'RÉSERVEZ',
    description:
      'Planifiez votre première session en quelques clics.'
  },
  {
    icon: 'mdi-trending-up',
    background: '#FDF1F7',
    cardTitle: 'Commencez votre accompagnement',
    cardDescription:
      'Échangez avec votre coach en toute simplicité.',
    title: 'PROGRESSEZ',
    description:
      'Bénéficiez d’un suivi personnalisé.'
  }
]

const coachSteps = [
  {
    icon: 'mdi-account-plus',
    background: '#F3F0FF',
    cardTitle: 'Créez votre profil',
    cardDescription:
      'Présentez votre expertise et vos services.',
    title: 'PRÉSENTEZ-VOUS',
    description:
      'Complétez votre profil professionnel.'
  },
  {
    icon: 'mdi-calendar-month',
    background: '#FFF3ED',
    cardTitle: 'Définissez vos disponibilités',
    cardDescription:
      'Laissez vos clients réserver facilement.',
    title: 'ORGANISEZ',
    description:
      'Gérez votre agenda en quelques minutes.'
  },
  {
    icon: 'mdi-handshake',
    background: '#FDF1F7',
    cardTitle: 'Accompagnez vos clients',
    cardDescription:
      'Animez vos séances et développez votre activité.',
    title: 'ACCOMPAGNEZ',
    description:
      'Concentrez-vous sur votre coaching.'
  }
]

const currentSteps = computed(() => {
  return mode.value === 'client'
    ? clientSteps
    : coachSteps
})
</script>

<style scoped>



 .main_title{
    font-size: 36px ;
    margin: 0px 0px 20px;
    padding: 0px 100px;
    font-weight: bolder;
  }

  .main_title2{
    font-size: 16px ;
    margin: 0px 0px 20px;
    font-weight: 300;
  }

  .container{
    max-width: 1500px;
    padding: 100px 15px;
  }




.how-it-works {
  background: #fff;
}

.section-label {
  color: #ff6b35;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 0.95rem;
}

.section-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
}

.step-card {
  transition: transform 0.25s ease;
}

.step-card:hover {
  transform: translateY(-6px);
}

.timeline {
  position: relative;
  margin-top: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timeline-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
}

.timeline-number {
  position: relative;
  z-index: 1;

  width: 42px;
  height: 42px;

  border-radius: 4px;

  background: #ff6b35;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 700;
}

.step-title {
  font-size: 22px;
  font-style: normal;
  font-weight: 800;
  margin: 6px 0px;
}

.step-description {
  color: #424242;
  font-size:  16px;
  max-width: 280px;
  margin-inline: auto;
}

  @media (max-width: 960px) {
    .timeline-line {
      display: none;
    }

    .step-wrapper {
      margin-bottom: 48px;
    }

    .step-title {
      font-size: 1.5rem;
    }
  }

   @media screen and (max-width:800px){

        .main_title{
            font-size: 25px ;
            margin: 0px 0px 20px;
            padding: 0px 10px;
        }

        .btn_client{
            width: 100%;
        }

        .container{
          max-width: 1500px;
          padding: 10px 15px;
        }
    }


    .coach-segment {
      background: #eee;
      border-radius: 8px;
      padding: 2px;
      max-width: 100%;
    }

   


</style>