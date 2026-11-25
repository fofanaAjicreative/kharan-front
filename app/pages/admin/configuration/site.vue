
<script setup lang="ts">

import type { SiteSettings } from '~/types/site-settings'
import { defaultSiteSettings } from '~/types/site-settings'
 
definePageMeta({
  // middleware: ['admin']
})

useHead({
  title: 'Configuration du site - KHARAN'
})


const { settings ,setSettings } = useSiteSettings() ; 
const { $api } = useNuxtApp()

const tab = ref('legal')
const loading = ref(false)
const snackbar = ref(false)
const errorMessage = ref('')

const formRef = ref()

const form_data = reactive<any>( structuredClone(defaultSiteSettings) )

// Initialiser le formulaire depuis les paramètres publics
watch( settings, (value) => {
    Object.assign(form_data.legal, value.legal)
    Object.assign(form_data.hosting, value.hosting)
    Object.assign(form_data.contact, value.contact)
  },
  { immediate: true, deep: true }
)

/* ---------------------------------------------------------------------- */

async function saveSettings() {

  const validation = await formRef.value?.validate()
  if (!validation?.valid) return  ;

  loading.value = true ;
  errorMessage.value = '' ;

 
  try {

    const res:any =  await $api('/admin/site_settings', {

      method: 'PATCH',
      body: {
        legal: form_data.legal,
        hosting: form_data.hosting,
        contact: form_data.contact
      }

    })

    // Actualiser les données partagées
    setSettings(res.data.settings) ;
    snackbar.value = true ;

  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Une erreur est survenue lors de l’enregistrement.'
    if(error.statusCode==400){
          errorMessage.value = 'Données incomplètes ou incorrectes.'
    }

  } finally {
    loading.value = false
  }

}

/* ---------------------------------------------------------------------- */

</script>

<template>
  <div class="pa-4 pa-md-6">

    <!-- HEADER -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">

      <div>
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon icon="mdi-cog-outline" color="secondary" />
          <span class="text-caption text-medium-emphasis">
            PARAMÈTRES DU SITE
          </span>
        </div>

        <h2 class="text-h6 font-weight-bold mt-0 mb-0">
          Informations publiques
        </h2>
 
      </div>

      <v-btn
        color="secondary"
        variant="flat"
        prepend-icon="mdi-content-save-outline"
        :loading="loading"
        @click="saveSettings"  >
         Enregistrer
      </v-btn>

    </div>

    <!-- MESSAGE ERREUR -->
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      closable
      class="mb-5"
    >
      {{ errorMessage }}
    </v-alert>


    <v-form ref="formRef" @submit.prevent="saveSettings" >

      <v-card  elevation="0" border>

        <!-- TABS -->
        <v-tabs
          v-model="tab"
          color="secondary"
          class="px-3"
          grow show-arrows
        >
          <v-tab value="legal">
            <v-icon icon="mdi-scale-balance" start />
             Mentions légales
          </v-tab>

          <v-tab value="hosting">
            <v-icon icon="mdi-server" start />
            Hébergement
          </v-tab>

          <v-tab value="contact">
            <v-icon icon="mdi-email-outline" start />
            Contact
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-window v-model="tab">

          <!-- INFORMATIONS LEGALES -->
          <v-window-item value="legal">
            <div class="pa-4 pa-md-6">

              <div class="mb-6">
                <h2 class="text-h6 font-weight-bold">
                  Informations sur l'éditeur
                </h2>

                <p class="text-body-2 text-medium-emphasis">
                  Identité juridique de l'entreprise éditrice.
                </p>
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.legal.commercialName"
                    label="Nom commercial"
                    variant="outlined"
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.legal.companyName"
                    label="Raison sociale"
                    variant="outlined"
                    hint="Nom juridique de l'entreprise"
                    persistent-hint
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.legal.legalForm"
                    label="Forme juridique"
                    variant="outlined"
                    placeholder="Exemple : SARL, SAS..."
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.legal.registrationNumber"
                    label="Numéro d'immatriculation"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.legal.taxNumber"
                    label="Identifiant fiscal"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.legal.publicationDirector"
                    label="Responsable de publication"
                    variant="outlined"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="form_data.legal.registeredAddress"
                    label="Adresse du siège social"
                    variant="outlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>
              </v-row>

            </div>
          </v-window-item>

          <!-- HEBERGEMENT -->
          <v-window-item value="hosting">
            <div class="pa-4 pa-md-6">

              <div class="mb-6">
                <h2 class="text-h6 font-weight-bold">
                  Informations sur l'hébergement
                </h2>

                <p class="text-body-2 text-medium-emphasis">
                  Coordonnées du prestataire qui héberge la plateforme.
                </p>
              </div>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form_data.hosting.provider"
                    label="Nom de l'hébergeur"
                    variant="outlined"
                    placeholder="Nom de la société"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="form_data.hosting.address"
                    label="Adresse de l'hébergeur"
                    variant="outlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form_data.hosting.website"
                    label="Site internet"
                    variant="outlined"
                    placeholder="https://..."
                  />
                </v-col>
              </v-row>

            </div>
          </v-window-item>

          <!-- CONTACT -->
          <v-window-item value="contact">
            <div class="pa-4 pa-md-6">

              <div class="mb-6">
                <h2 class="text-h6 font-weight-bold">
                  Coordonnées et assistance
                </h2>

                <p class="text-body-2 text-medium-emphasis">
                  Ces informations seront utilisées sur les pages publiques
                  et dans les différents espaces.
                </p>
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.contact.email"
                    label="Adresse e-mail"
                    type="email"
                    variant="outlined"
                    prepend-inner-icon="mdi-email-outline"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.contact.phone"
                    label="Téléphone"
                    variant="outlined"
                    prepend-inner-icon="mdi-phone-outline"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="form_data.contact.address"
                    label="Adresse postale"
                    variant="outlined"
                    rows="2"
                    auto-grow
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.contact.supportHours"
                    label="Horaires de disponibilité"
                    variant="outlined"
                    placeholder="Exemple : Lun - Ven, 09h - 18h"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form_data.contact.responseTime"
                    label="Délai indicatif de réponse"
                    variant="outlined"
                    placeholder="Exemple : Sous 48 heures ouvrées"
                  />
                </v-col>
              </v-row>

            </div>
          </v-window-item>

        </v-window>

        <v-divider />

        <!-- FOOTER -->
        <div class="pa-4 d-flex justify-end">
          <v-btn
            color="secondary"
            variant="flat"
            prepend-icon="mdi-content-save-outline"
            :loading="loading"
            @click="saveSettings"
          >
            Enregistrer les modifications
          </v-btn>
        </div>

      </v-card>
    </v-form>

    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="3000" >
       Les informations ont été enregistrées.
    </v-snackbar>

  </div>
</template>
