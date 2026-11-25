
<script  setup lang="ts"  >
 
  const { $api } = useNuxtApp() ;
  const { showLoading, hideLoading } = useGlobalLoading() ;

  const route = useRoute()
  const router = useRouter();
  let id  = route.params.id ;

  const { showDialog, set_has_annonce, set_annonce_completed,set_has_service } = useAnnonceDialog() ;

 
  
  import { useDisplay } from 'vuetify'
  const { mobile, name, width } = useDisplay()
  
/* ---------------------------------------------------------------------------- */

  function resetError() {
    server_error.value = false ;
    server_error_message.value = '' ;
    loading.value = false ;
  }

/* ------------------------------------------------------------------------------ */

  const  loading = ref(false) ; 

  const  server_error = ref(false) ;
  const  server_error_message = ref("") ;

/* ------------------------- form --------------------------------------------- */


  // format
    const formats = ref([
     {
      id : "online" ,
      name : "En ligne (visioconférence)"
     },
     {
      id : "in_person" ,
      name : "En personne (dans nos locaux)"
     },
     {
      id : "both" ,
      name : "Les deux"
     }
   ]) ;

   // seances
    interface SceanceItem {
      id?: string;
      title: string;
      description: string;
      duration: number | null;
    }


    // form
    const form = ref() ;

    const formData = reactive({
      title: "" ,
      description: "",
      price:"",
      order:"",
      sceance_number: 0,
      format:"",
      sceance_duration:"",
      seances: [] as SceanceItem[] // <-- Tableau dynamique
    }) ;

    
/* ----------------------------------------------------------- */

    const totalDuration = computed(() => {

      return formData.seances.reduce(
        (total, seance) => total + (Number(seance.duration) || 0), 0
      );

  });

/* ----------------------------------------------------------- */

 watch(() => formData.sceance_number, (newVal) => {
    const count = Number(newVal) || 0;
    
    if(count <= 0) {
      formData.seances = [];
      return;
    }

    // Ajustement de la longueur du tableau sans perdre les données déjà saisies
    if (count > formData.seances.length) {
      const diff = count - formData.seances.length;
      for (let i = 0; i < diff; i++) {
        const index = formData.seances.length + 1;

        formData.seances.push({
          title: `Séance ${index}`,
          description: "",
          duration: null
        });

      }
    } else if (count < formData.seances.length) {
      formData.seances = formData.seances.slice(0, count);
    }
});

/* -------------------------------------------------------------------- */

  function deleteSeance(index :number){
      
      if(formData.seances.length<2) {
        return  ;
      }

      formData.seances.splice(index, 1); 
      formData.sceance_number = formData.seances.length ; 
  }

/* ------------------------------------ rules ---------------------------------------- */
 
 
     // required field
      const requiredField = [
          (v :string) => { 
                          if (v && v.length>0) return true ;
                          return  "Champ requis"  
                          },
      ]

      const requiredNumber = [
          (v :number) => { 
                          if (v && v>0) return true ;
                           return  "Champ requis"  
                          },
      ]


      const requiredBio= [
          (v :string) => { 
                          if (v && v.length>0 && v.length<=500) return true ;
                          return  "Champ requis , 500 caractères max"  
                          },
      ]
    
 

/* ---------------------------------------  SUBMIT ---------------------------------------- */

    async function onSubmit () {

         form.value.validate() ;

          if(!form.value.isValid){ return ;}
 
            let form_data = {

              format : formData.format,
              title : formData.title,
              description : formData.description,
              
              price : formData.price,
              sceance_number : formData.sceance_number,
              sceance_duration : totalDuration.value ,

              order : formData.order,
              seances : formData.seances
            } 

            console.log(form_data);


          editService(form_data) ;

    } 
 
/* ---------------------------------------------------------------------------------- */

  function editService(post_data :any ){ 
               
      loading.value = true ;
      showLoading() ;

      $api(`/annonces/edit_service/${id}`,{
        method: 'PUT',
        body:post_data
      }).then((res :any) =>{
      
      console.log("Service:",res.data);


       set_has_service(true) ;
       navigateTo('/espace-coach/annonce?tab=services')

      
      hideLoading() ;
      resetError() ;

      }).catch(error=>{

        loading.value = false ;
        server_error.value = true ;
        server_error_message.value = error.message ;

        if(error.statusCode==400){
          server_error_message.value = 'Données incomplètes ou incorrectes.'
        }
        
        console.log("Error:",error); 
        hideLoading() ;
         
      })
               
  }

 
/* ---------------------------------------------------------------------------------------- */


  async function getService(id : any) {
 
    showLoading() ;

    $api(`/annonces/get_service/${id}`,{
      method: 'GET',
    }).then((res :any) =>{

     

      const service = res.data.service ;
      console.log("SERVICE:", service);


      formData.format = service.format ;
      formData.title = service.title ; 
      formData.description = service.description ;
      formData.price =  service.price; ; 

      formData.sceance_number = service.sceance_number ;

      // seances

      formData.seances = service.seances.map( (seance :any)=> {
          return {
            id : seance.is ,
            title : seance.title ,
            description : seance.description ,
            duration : seance.duration ,
          }
      })



      formData.order = service.order ;
     
     
        

      hideLoading() ;
      form.value.validate() ;



        
         
    }).catch(error=>{
      hideLoading() ;
      console.log(error);
    })

  }

/* ---------------------------------------------------------------------------------------- */

  onMounted(() => {
    getService(id)
  });


/* ---------------------------------------------------------------------------------------- */

</script> 

<template>

  <div class="main_content">

    <section class="mb-2 form_content" >

      <div>
       
        <p class="page_title text-center" > Modifier un service </p>
        <v-divider class="mb-6 mt-2"></v-divider>
 
        <!-- FORM PACKAGE -->
        <v-form
          @submit.prevent="onSubmit"
          ref="form"  
          class="mt-6 pa-4 " >

          <v-row>

              
              <!-- format -->
              <v-col cols="12" md="12"> 

                <div class="pa-4" style="border:1px #ddd solid ; border-radius: 4px;" >

                    <h4 class="ma-0 mb-4"> Où et comment proposez-vous vos séances ? </h4>
                    <div class="text-cente"> 

                      <v-radio-group 
                          v-model="formData.format" column  
                          :rules="requiredField">
                        <div v-for="(format) in formats"  class="address">
                              <v-radio 
                                    :label="`${format.name}  `"
                                    color="secondary"
                                    :value="format.id" 
                                    > </v-radio>
                        </div>
                      </v-radio-group>
                        
                    </div>

                </div>

              </v-col>

              <!-- title -->
             <v-col cols="12" md="12">
                  <v-text-field
                      variant="outlined"
                      density="compact"
                      v-model="formData.title"
                      :rules="requiredField"
                      label="Titre du service" />  
              </v-col>


              <!-- description -->
              <v-col cols="12">
                    <v-textarea 
                        v-model="formData.description"
                        :rules="requiredBio"
                        :maxlength="500"
                        variant="outlined"
                        rows="4"
                        
                        density="compact"
                        counter
                        placeholder="Bref résumé du service"
                        label="Bref résumé" >
                    </v-textarea>
              </v-col>
 
              <!-- price -->
              <v-col cols="12" md="12">
                  <v-text-field
                      variant="outlined"
                      density="compact"
                      type="number"
                      v-model="formData.price"
                      :rules="requiredNumber"
                      label="Prix total du service HT(en &euro;)" />  
                </v-col>

               <!-- sceance_number -->

                <v-col cols="12" md="12">
                  <v-text-field
                      variant="outlined"
                      density="compact"
                      type="number"
                      min="0" max="10"
                      v-model="formData.sceance_number"
                      :rules="requiredNumber"
                      label="Nombre de séances" />  
                </v-col>

                <!-- ---------------------------------------------------------------- -->
                 
                  <!-- SOUS-FORMULAIRES DYNAMIQUES POUR CHAQUE SÉANCE -->
                  <v-col cols="12" md="12" v-if="formData.seances.length > 0">
                    <v-card 
                      v-for="(seance, index) in formData.seances"  :key="index" 
                      variant="outlined" 
                      class="mb-4 pa-4 w-100" >

                      <div class="d-flex justify-space-between mb-4">

                        <div class="d-flex align-center">
                          <v-avatar color="secondary" size="28" class="mr-2 text-caption font-weight-bold">
                            {{ index + 1 }}
                          </v-avatar>
                          
                          <span class="font-weight-bold">Détails de la séance 
                            <span v-if="formData.seances.length > 1">{{ index + 1 }} </span>
                          </span>
                        </div>

                        <v-btn v-if="1"
                            @click="deleteSeance(index)"
                            icon="mdi-delete"
                            color="error"
                            variant="text"
                           />

                      </div>

                      <v-row density="compact">
                        <!-- Titre de la séance -->
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="seance.title"
                            :rules="requiredField"
                            variant="outlined"
                            density="compact"
                            label="Titre de la séance"
                            placeholder="Ex: Bilan initial & Analyse des besoins"
                          />
                        </v-col>

                        <!-- Durée de la séance -->
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model.number="seance.duration"
                            :rules="requiredNumber"
                            type="number"
                            variant="outlined"
                            density="compact"
                            label="Durée (min)"
                            placeholder="Ex: 45"
                          />
                        </v-col>

                        <!-- Description de la séance -->
                        <v-col cols="12">
                          <p style="color:#00000090" class="ma-2 ml-0"> Objectif ou contenu de cette séance </p>
                          <AppEditor   v-model="seance.description" />
                        </v-col>



                      </v-row>
                    </v-card>
                  </v-col>
                
                <!-- --------------------------- SEANCE----------------------------------- -->


                <!-- order -->
                <v-col cols="12" md="12">
                  <v-text-field
                      variant="outlined"
                      density="compact"
                      type="number"
                      min="0" max="20"
                      v-model="formData.order"
                      :rules="requiredNumber"
                      hint=" Comment le service s'affiche dans votre liste de services chez les clients."
                      label="Ordre d'affichage du service" />  

                  <v-alert  
                      icon="mdi-information"
                      color="info"
                      variant="tonal"
                      > 
                      L'ordre dans lequel les services s'affichent dans votre liste de services chez les clients.
                  </v-alert>

                </v-col>

                <v-col cols="12" v-if="server_error">
                      <v-alert class="mt" color="warning" density="compact" variant="tonal"
                      icon="mdi-alert-circle-outline" >
                      <template #prepend>
                        <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                      </template>  {{ server_error_message }}
                    </v-alert>
                </v-col>

                <v-col cols="12">
                  <div>
                      <v-btn 
                        :loading="loading" 
                        type="submit" 
                        variant="flat"
                        color="secondary"
                        block > Enrégistrer 
                      </v-btn>
                  </div>
                </v-col>

              </v-row>
        </v-form>

      </div>

     </section>
  </div>

</template>

<style scoped lang="scss">



    .form_content{
        max-width: 800px ;
        margin: auto ;
    }

    .form_title{
      font-size: 22px ;
      font-weight: bold ;
    }


  .page_title{
      font-size: 22px ;
      font-weight: bold ;
      margin: 10px 0px 10px 0px ;
  }

  @media (max-width: 839px){
    
    .main_content{
      padding: 10px;
    }

    .page_title{
      font-size: 18px ;
      margin: 10px 0px 8px 0px ;
    }

  }

  .sub_title{
    font-size: 15px ;
    margin-bottom: 0px;
  }


 

  .service_type:hover{
     border : 2px #aaa solid ;
  }

  .selected_type{
    border : 2px $secondary-color solid ;
  }



  .gender_div{
     
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-content: flex-start;
      justify-content: start ;
      flex-wrap: wrap;
   }

   

</style>

