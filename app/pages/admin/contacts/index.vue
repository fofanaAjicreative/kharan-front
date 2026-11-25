
<script setup lang="ts">
 
useHead({
  title: 'Messages de contact'
})

const { $api } = useNuxtApp()  ;
const { confirm } = useConfirm() ;
const { getUserTimeZone } = useAuth() ; 

type ContactStatus = 'unread' | 'read' | 'replied' | 'archived'



interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  readAt: string | null
  createdAt: string
  updatedAt: string
}

interface ContactStatistics {
  total: number
  unread: number
  read: number
  replied: number
  archived: number
}

interface ContactMeta {
  total: number
  page: number
  limit: number
  lastPage: number
}

const statusItems = [
  { id: '', name: 'Tous les statuts' },
  { id: 'unread', name: 'Non lu' },
  { id: 'read', name: 'Lu' },
  { id: 'replied', name: 'Répondu' },
  { id: 'archived', name: 'Archivé' }
]

const subjectItems = ref([
  { id: '', name: 'Tous les objects' },
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


const statusOptions = statusItems.filter(item => item.id !== 'all')

const subjectLabels: Record<string, string> = {
  general_question: 'Question générale',
  account_issue: 'Problème avec mon compte',
  reservation_question: 'Question concernant une réservation',
  become_coach: 'Devenir coach',
  partnership: 'Partenariat',
  other: 'Autre demande'
}

const statusLabels: Record<ContactStatus, string> = {
  unread: 'Non lu',
  read: 'Lu',
  replied: 'Répondu',
  archived: 'Archivé'
}

const statusColors: Record<ContactStatus, string> = {
  unread: 'secondary',
  read: 'info',
  replied: 'success',
  archived: 'grey'
}

const headers = [
  { title: 'Expéditeur', key: 'name', sortable: false },
  { title: 'Sujet', key: 'subject', sortable: false,  minWidth: '200px', },
  { title: 'Date de réception', key: 'createdAt', sortable: false },
  { title: 'Statut', key: 'status', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const }
]


const loading = ref(false)

// Liste
const contacts = ref<ContactMessage[]>([])
const count_contacts = ref(0) ; 


const search = ref('')
const selectedStatus = ref('')
const selectedSubject = ref('')

// pagination
let page = ref(1) ;
let per_page = ref(4) ;


// Statistiques
const statistics = ref<ContactStatistics>({
  total: 0,
  unread: 0,
  read: 0,
  replied: 0,
  archived: 0
})

// Consultation
const dialog = ref(false)
const detailLoading = ref(false)
const selectedMessage = ref<ContactMessage | null>(null)

// Notifications
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')


function notify(message: string, color = 'success') {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: getUserTimeZone()
  }).format(new Date(date))
}

function getSubjectLabel(subject: string) {
  return subjectLabels[subject] ?? subject
}


/* --------------------------------------------------------------------------- */

  async function loadContacts() {

    loading.value = true

    try {
      const res = await $api('/admin/contacts', {
        query: {

          search: search.value || undefined,
          status: selectedStatus.value  ,
          subject: selectedSubject.value  ,
          page: page.value,
          per_page: per_page.value,
          
        }
      })

      contacts.value = res.data.contacts ;
      count_contacts.value = res.data.total ;
      
    } catch (error) {
      console.error(error)
      notify('Impossible de charger les messages.', 'error')
    } finally {
      loading.value = false
    }
    
  }


/* --------------------------------------------------------------------------- */

async function loadStatistics() {

  try {
    const res = await $api('/admin/contacts/statistics') ;
    statistics.value = res.data.statistics ;
  } catch (error) {
    console.error(error)
  }

}


/* ----------------------------------------------------------------------------*/

   async function attributeChanged() {

        page.value =  1 ;
        contacts.value = [] ;

        loading.value = true ;
  
        loadContacts() ;

   }


/* --------------------------------------------------------------------------- */

function onOptionsUpdate(options: {
    page: number
    itemsPerPage: number
 }) {

  const pageChanged = page.value !== options.page
  const limitChanged = per_page.value !== options.itemsPerPage

  if (!pageChanged && !limitChanged) return

  page.value = options.page
  per_page.value = options.itemsPerPage

  loadContacts() ;

}


/* --------------------------------------------------------------------------- */

 
let searchTimeout: ReturnType<typeof setTimeout> | undefined

  watch([search], () => {

    if (searchTimeout) clearTimeout(searchTimeout)

      searchTimeout = setTimeout(() => {
        page.value = 1
        loadContacts()
      }, 350)
  })

/* --------------------------------------------------------------------------- */

async function openMessage(item: ContactMessage) {

  dialog.value = true ;
  detailLoading.value = true ;
  selectedMessage.value = null ;

  try {

    const res = await $api( `/admin/contacts/${item.id}`) ;

    selectedMessage.value = res.data.contact ; 

    // Le backend marque automatiquement le message comme lu.
    if (item.status === 'unread') {
      await Promise.all([
        loadContacts(),
        loadStatistics()
      ])
    }
  } catch (error) {
    console.error(error)
    notify('Impossible de récupérer ce message.', 'error')
    dialog.value = false
  } finally {
    detailLoading.value = false
  }

  
}



/* --------------------------------------------------------------------------- */


 async function updateStatus( item: ContactMessage, status: ContactStatus ){

    if (item.status === status) return

    try {
      await $api(`/admin/contacts/${item.id}/status`, {
        method: 'PATCH',
        body: { status }
      })

      if (selectedMessage.value?.id === item.id) {
        selectedMessage.value.status = status
      }

      await Promise.all([
        loadContacts(),
        loadStatistics()
      ])

      notify(`Statut modifié : ${statusLabels[status]}.`) ;

    } catch (error) {
      console.error(error)
      notify('Impossible de modifier le statut.', 'error')
    }


}

/* --------------------------------------------------------------------------- */

  async function archiveMessage(item: ContactMessage) {

    if (item.status === 'archived') return ;


    const accepted = await confirm({
      title: 'Archiver',
      text: 'Voulez-vous vraiment archiver ?'
    })
      
    if (!accepted) { return } 


    await updateStatus(item, 'archived') ;

  }

/* --------------------------------------------------------------------------- */

function refreshPage() {
  page.value = 1 ;

  selectedStatus.value = '' ;
  selectedSubject.value = '' ;
  search.value = '' ;

  loadContacts() ;
  loadStatistics() ;

}

/* --------------------------------------------------------------------------- */

  onMounted(() => {
    refreshPage()
  })

/* --------------------------------------------------------------------------- */

  onBeforeUnmount(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
  })

/* --------------------------------------------------------------------------- */


</script>

<template>
  <v-container fluid class="pa-4 pa-md-6">

    <!-- En-tête -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <!-- <h1 class="text-h5 font-weight-bold">  </h1> -->

        <!-- <p class="text-body-2 text-medium-emphasis mt-1">
        </p> -->

      </div>

      <v-btn
        prepend-icon="mdi-refresh"
        variant="outlined"
        color="secondary"
        :loading="loading"
        @click="refreshPage"
      >
        Actualiser
      </v-btn>
    </div>

    <v-card class="card_shadow">
         <v-card-text>

          <!-- Statistiques -->
          <v-row class="mb-4">
            <v-col cols="6" sm="4" md="3">
              <v-card class="statistics_card"   >
                <v-card-text>
                  <div class="text-caption text-medium-emphasis">
                    Total
                  </div>
                  <div class="text-h5 font-weight-bold mt-1 statistics_value">
                    {{ statistics.total }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" md="3">
              <v-card class="statistics_card" >
                <v-card-text>
                  <div class="text-caption text-medium-emphasis">
                    Non lus
                  </div>
                  <div class="text-h5 font-weight-bold text-secondary mt-1 statistics_value">
                    {{ statistics.unread }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" md="3">
              <v-card class="statistics_card" >
                <v-card-text>
                  <div class="text-caption text-medium-emphasis">
                    Lus
                  </div>
                  <div class="text-h5 font-weight-bold mt-1 statistics_value">
                    {{ statistics.read }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="6" sm="4" md="3">
              <v-card class="statistics_card" >
                <v-card-text>
                  <div class="text-caption text-medium-emphasis">
                    Archivés
                  </div>
                  <div class="text-h5 font-weight-bold mt-1 statistics_value">
                    {{ statistics.archived }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

          </v-row>

        </v-card-text>
    </v-card>

     <v-card class="card_shadow mt-6">
        <v-card-text>
       <!-- certified  -->
        <v-expansion-panels model-value="1"  class="mb">
              <v-expansion-panel value="1" elevation="0">
                <v-expansion-panel-title class="expansion_panel_title" 
                collapse-icon="mdi-minus" expand-icon="mdi-plus" > Filtres </v-expansion-panel-title>
                <v-expansion-panel-text class="expansion-content">
                      
                  <div class="pt-5">
                      
                    <v-row align="center">
                      <v-col cols="12" lg="5">
                        <v-text-field
                          v-model="search"
                          label="Rechercher un message"
                          placeholder="Nom, e-mail, sujet ou contenu..."
                          prepend-inner-icon="mdi-magnify"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                          clearable
                        />
                      </v-col>
                      
                      <v-col cols="12" lg="4">
                        <v-select
                          v-model="selectedSubject"
                          :items="subjectItems"
                          item-title="name"
                          item-value="id"
                          label="Object"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                          @update:modelValue="attributeChanged()"
                        />
                      </v-col>

                      <v-col cols="12" lg="3">
                        <v-select
                          v-model="selectedStatus"
                          :items="statusItems"
                          item-title="name"
                          item-value="id"
                          label="Statut"
                          variant="outlined"
                          density="comfortable"
                          hide-details
                          @update:modelValue="attributeChanged()"
                        />
                      </v-col>
                    </v-row>

                  </div>
                    
                </v-expansion-panel-text>
              </v-expansion-panel>
        </v-expansion-panels>
        <!-- / certified  -->

    </v-card-text>
  </v-card>

    
    <!-- Tableau -->
    <v-card  class="card_shadow " >
 
      <v-divide class="mt-4 mb-4" />

      <v-data-table-server
        :headers="headers"
        :items="contacts"
        :items-length="count_contacts"
        :loading="loading"
        :page="page"
        :items-per-page="per_page"
        :items-per-page-options="[10, 20, 50]"
        item-value="id"
        hover
        @update:options="onOptionsUpdate"
        
      >


      <template #headers="{ columns }">

        <tr class="custom-header">

          <th
            v-for="column in columns"  
             :style="{
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
              }"
            class="custom-header-cell" >
            {{ column.title }}
          </th>

        </tr>

      </template>

        <!-- Expéditeur -->
        <template #item.name="{ item }">
          <div class="py-2">
            <div class="font-weight-medium">
              {{ item.name }}
            </div>

            <div class="text-caption text-medium-emphasis">
              {{ item.email }}
            </div>
          </div>
        </template>

        <!-- Sujet -->
        <template #item.subject="{ item }">
          <span class="text-body-2">
            {{ getSubjectLabel(item.subject) }}
          </span>
        </template>

        <!-- Date -->
        <template #item.createdAt="{ item }">
          <span class="text-body-2 text-no-wrap">
            {{ formatDate(item.createdAt) }}
          </span>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <v-chip
            :color="statusColors[item.status]"
            size="small"
            variant="tonal" >
            {{ statusLabels[item.status] }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">

          <div class="d-flex justify-end ga-1" @click.stop>

            <v-tooltip text="Consulter">

              <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-eye-outline"
                    size="small"
                    variant="flat"
                     
                    @click="openMessage(item)"
                  />
              </template>

            </v-tooltip>

            <v-tooltip
              :text="item.status === 'archived' ? 'Déjà archivé' : 'Archiver'" >

              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-archive-outline"
                  size="small"
                  variant="text"
                  
                  rounded="2"
                  :disabled="item.status === 'archived'"
                  @click="archiveMessage(item)"
                />
              </template>
            </v-tooltip>

          </div>
        </template>

        <!-- Aucun résultat -->
        <template #no-data>
          <div class="text-center pa-8">
            <v-icon
              icon="mdi-email-search-outline"
              size="42"
              color="medium-emphasis"
              class="mb-3"
            />

            <div class="text-body-1 font-weight-medium">
              Aucun message trouvé
            </div>

            <div class="text-caption text-medium-emphasis mt-1">
              Modifiez vos critères de recherche.
            </div>
          </div>
        </template>


      </v-data-table-server>
    </v-card>

    <!-- Détail du message -->
    <v-dialog
      v-model="dialog"
      max-width="750"
      scrollable >
      <v-card rounded="4">

        <v-toolbar color="surface" density="comfortable">
          <v-toolbar-title class="text-subtitle-1 font-weight-bold">
            Détail du message
          </v-toolbar-title>

          <v-spacer />

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="dialog = false"
          />
        </v-toolbar>

        <v-divider />

        <v-card-text class="pa-5">

          <div
            v-if="detailLoading"
            class="d-flex justify-center pa-10"
          >
            <v-progress-circular indeterminate color="secondary" />
          </div>

          <template v-else-if="selectedMessage">

            <!-- Informations expéditeur -->
            <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-5">
              <div>
                <div class="text-h6 font-weight-bold">
                  {{ selectedMessage.name }}
                </div>

                <a
                  :href="`mailto:${selectedMessage.email}`"
                  class="text-body-2 text-info text-decoration-none"
                >
                  {{ selectedMessage.email }}
                </a>
              </div>

              <v-chip
                :color="statusColors[selectedMessage.status]"
                variant="tonal"
              >
                {{ statusLabels[selectedMessage.status] }}
              </v-chip>
            </div>

            <v-divider class="mb-5" />

            <!-- Métadonnées -->
            <v-row dense class="mb-4">
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">
                  Sujet
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ getSubjectLabel(selectedMessage.subject) }}
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis">
                  Reçu le
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ formatDate(selectedMessage.createdAt) }}
                </div>
              </v-col>
            </v-row>

            <!-- Contenu -->
            <div class="text-subtitle-2 font-weight-bold mb-2">
              Message
            </div>

            <v-card
              rounded="0"
              variant="tonal"
              class="pa-4"
            >
              <div class="text-body-2 message-content">
                {{ selectedMessage.message }}
              </div>
            </v-card>

            <!-- Changement de statut -->
            <div class="mt-6">
              <div class="text-subtitle-2 font-weight-bold mb-2">
                Gestion du message
              </div>

              <v-select
                :model-value="selectedMessage.status"
                :items="statusOptions"
                item-title="name"
                item-value="id"
                label="Statut du message"
                variant="outlined"
                density="comfortable"
                hide-details
                @update:model-value="updateStatus(selectedMessage, $event)"
              />
            </div>

          </template>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 flex-wrap ga-2">
          <v-btn
            v-if="selectedMessage"
            prepend-icon="mdi-email-outline"
            color="primary"
            variant="tonal"
            :href="`mailto:${selectedMessage.email}`"
          >
            Répondre par e-mail
          </v-btn>

          <v-spacer />

          <v-btn
            variant="text"
            @click="dialog = false"
          >
            Fermer
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <!-- Notification -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      location="bottom end"
      timeout="3000" >
      {{ snackbarMessage }}

      <template #actions>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="snackbar = false"
        />
      </template>
    </v-snackbar>
    <!-- Notification -->

  </v-container>
</template>

<style scoped>


 .expansion_panel_title{
    font-size: 16px;
    font-weight: 500;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.5rem 1rem;
    background-color: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  .statistics_card{
    border: 1px #aaa solid ;
    box-shadow: none ;
  }

.custom-header {
  background: #f8f8f8;
}

.custom-header-cell {
  height: 56px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #333 !important;
  text-transform: uppercase;
}

.statistics_value{
  font-size: 18px;
}


  .message-content {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.8;
  }

</style>
