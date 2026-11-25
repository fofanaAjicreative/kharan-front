
<script setup lang="ts">
import ContentPage from '~/components/content/ContentPage.vue'

const { $api } = useNuxtApp() ;

useHead({
    title: 'Nous contacter'
})

const { settings } = useSiteSettings() ; 


 const formRef = ref()

  const form_data = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

const loading = ref(false)
const sent = ref(false)

const server_error = ref(false)
const server_error_message = ref("")



 
const subjects = ref([
  {
    id: 'general_question',
    name: 'Question générale'
  },
  {
    id: 'account_issue',
    name: 'Problème avec mon compte'
  },
  {
    id: 'reservation_question',
    name: 'Question concernant une réservation'
  },
  {
    id: 'become_coach',
    name: 'Devenir coach'
  },
  {
    id: 'partnership',
    name: 'Partenariat'
  },
  {
    id: 'other',
    name: 'Autre demande'
  }
])
/* ------------------------------------------------------------------------- */

async function resetError() {

 sent.value = false ;
 server_error.value = false ;
 server_error_message.value = "" ;

 
}

/* -------------------------------------------------------------------------- */

async function submitForm() {
   
  const validation = await formRef.value?.validate()
  if (!validation?.valid) return  ;

  loading.value = true  ;
  resetError() ;

  try {
    
    await $api('/contact', {
      method: 'POST',
      body: form_data
    })

    sent.value = true

    Object.assign(form_data, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    formRef.value?.resetValidation() ;
    formRef.value?.reset() ;

  } catch (error :any) {
    
    server_error.value = true ;
    server_error_message.value = error.message ;

    if(error.statusCode==400){
      server_error_message.value = 'Données incomplètes ou incorrectes.'
    }
        
    console.log("Error:",error); 


  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="contact-page">
    <section class="contact-hero">
      <v-container>
        <div class="text-center">
          <div class="text-secondary font-weight-bold text-caption mb-3">
            NOUS SOMMES À VOTRE ÉCOUTE
          </div>

          <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
            Parlons de votre projet.
          </h1>

          <p class="text-body-1 text-medium-emphasis">
            Une question, une suggestion ou besoin d'assistance ?
            Notre équipe est là pour vous accompagner.
          </p>
          
        </div>
      </v-container>
    </section>

    <v-container class="contact-container">
      <v-row>
        <!-- left -->
        <v-col cols="12" md="4">
          <div class="contact-info pa-5 pa-md-7">
            <h2 class="text-h5 font-weight-bold mb-3">
              Restons en contact.
            </h2>

            <p class="text-body-2 text-medium-emphasis mb-8">
              Nous sommes disponibles pour répondre à vos questions.
            </p>

            <div class="d-flex ga-4 mb-7">
              <v-avatar color="white" rounded="lg">
                <v-icon 
                   icon="mdi-email-outline" 
                   color="secondary" />
              </v-avatar>

              <div>
                <div class="font-weight-bold mb-1">E-mail</div>
                <div class="text-body-2 text-medium-emphasis">
                   {{ settings.contact.email }}
                </div>
              </div>
            </div>

            <div class="d-flex ga-4 mb-7">
              <v-avatar color="white" rounded="lg">
                <v-icon 
                 icon="mdi-clock-outline"
                 color="secondary" />
              </v-avatar>

              <div>
                <div class="font-weight-bold mb-1">Disponibilité</div>
                <div class="text-body-2 text-medium-emphasis">
                  Nous vous répondrons dans les meilleurs délais.
                </div>
              </div>
            </div>

            <v-divider class="my-6" />

            <div class="text-body-2 text-medium-emphasis">
              Nous accordons une importance particulière
              à chaque demande.
            </div>
          </div>
        </v-col>
        <!-- /left -->
        <!-- right -->
        <v-col cols="12" md="8">
          <v-card elevation="0" class="pa-5 pa-md-8 contact-form">
            <h2 class="text-h5 font-weight-bold mb-2 mt-0">
              Envoyez-nous un message
            </h2>

            <p class="text-body-2 text-medium-emphasis mb-6">
              Remplissez le formulaire ci-dessous.
            </p>

            <v-alert
              v-if="sent"
              type="success"
              variant="tonal"
              class="mb-5" >
              Votre message a bien été envoyé. Merci de nous avoir contacté.

            </v-alert>

            <v-alert
              v-if="server_error"
              color="error"
              icon="mdi-alert"
              variant="tonal"
              class="mb-5" >
              {{ server_error_message }}
            </v-alert>

            <v-form ref="formRef" @submit.prevent="submitForm">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form_data.name"
                    label="Nom complet"
                    variant="outlined"
                    :rules="[v => !!v || 'Votre nom est obligatoire']"
                    required
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form_data.email"
                    label="Adresse e-mail"
                    type="email"
                    variant="outlined"
                    :rules="[
                      v => !!v || 'Votre e-mail est obligatoire',
                      v => /.+@.+\..+/.test(v) || 'E-mail invalide'
                    ]"
                    required
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="form_data.subject"
                    :items="subjects"
                    item-title="name"
                    item-value="id"
                    label="Sujet de votre demande"
                    variant="outlined"
                    required
                    :rules="[v => !!v || 'Choisissez un sujet']"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="form_data.message"
                    label="Votre message"
                    placeholder="Comment pouvons-nous vous aider ?"
                    variant="outlined"
                    rows="5"
                    auto-grow
                    :rules="[v => !!v || 'Votre message est obligatoire']"
                    required
                  />
                </v-col>

               <!--  <v-col cols="12">
                  <v-checkbox
                    density="compact"
                    color="secondary"
                    :rules="[v => !!v || 'Veuillez accepter cette condition']"
                    required
                  >
                    <template #label>
                      <span class="text-caption ml-4">
                        J'accepte que mes informations soient utilisées
                        pour traiter ma demande, conformément à la
                        <NuxtLink to="/confidentialite">  politique de confidentialité </NuxtLink>.
                      </span>
                    </template>

                  </v-checkbox>
                </v-col> -->

                <v-col cols="12">
                  <v-btn
                    type="submit"
                    color="secondary"
                    size="large"
                    variant="flat"
                    block
                    :loading="loading"
                  >
                    Envoyer mon message
                    <v-icon icon="mdi-arrow-right" end />
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>

.contact-page {
  background: #fafbfc;
  padding-bottom: 80px;
}

.contact-hero {

  padding: 55px 0 80px;
  background: linear-gradient(
        180deg,
        #f0f5ff 0%,
        #f3f7ff 25%,
        #f6f9ff 50%,
        #f9fbff 75%,
        #fcfdff 100%
      );
}

.contact-container {
  max-width: 1100px;
  margin-top: -45px;
  position: relative;
}

.contact-info {
  background: #f3f7ff;
  height: 100%;
  border-radius: 4px;
}

.contact-form{
  border-radius: 4px;
}

@media(max-width: 600px) {
  .contact-hero {
    padding: 35px 15px 50px;
  }

  .contact-container {
    margin-top: -35px;
  }
}
</style>
