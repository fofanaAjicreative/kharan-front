
<script  setup lang="ts"  >

  import Tags from '~/components/espace/Tags.vue' ;
  const TagsRef = ref<InstanceType<typeof Tags> | null>(null);
  const TagsRef2 = ref<InstanceType<typeof Tags> | null>(null);


  const { $api } = useNuxtApp() ;

  const { user,setUser, isCoach } = useAuth() ;

  const { has_annonce, annonce_completed, set_has_annonce, set_annonce_completed, } = useAnnonceDialog() ;

  const { showLoading, hideLoading } = useGlobalLoading() ;

  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
 
  
  const  loaded = ref(false) ;
  const annonce = ref<any>(null) ;


/* ---------------------------------------------------------------------------- */

  function resetError() {

    server_error.value = false ;
    server_error_message.value = '' ;
    loading.value = false ;

  }

/* ---------------------------------------------------------------------------- */

   const step = ref(1) ;
   const maxStep = ref(5) ;

/* ---------------------- form1 -------------------------------------------------------- */


  const  loading = ref(false) ; 

  const  server_error = ref(false) ;
  const  server_error_message = ref("") ;

  const form1 = ref() ;

  const formData1 = reactive({
    title: "" ,
    city: "" ,
    bio: "" ,
    description: "" 
  }) ;

  const  description_error = ref(false) ;
  const  categories_error = ref(false) ;
  const  challenges_error = ref(false) ;
  const  photo_error = ref(false) ;

/* ---------------------- form2 -------------------------------------------------------- */

  const form2 = ref() ;
  const formData2 = reactive({
    format: "" ,
    address: "" ,
    building: "" ,
  }) ;

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


/* ---------------------- form3 -------------------------------------------------------- */

  const form3 = ref() ;
  const formData3 = reactive({
    booking_interval: "" ,
  }) ; 

  const booking_intervals = ref([
     {
      id : 15 ,
      name : "Chaque quart d’heure"
     },
     {
      id : 30 ,
      name : "Chaque demi-heure"
     },
     {
      id : 60 ,
      name : "Chaque heure"
     }
   ]) ;

 
 /* ---------------------- form rules -------------------------------------------------------- */


      const requiredBio= [
          (v :string) => { 
                          if (v && v.length>0 && v.length<=300) return true ;
                          return  "Champ requis , 300 caractères max"  
                          },
      ]

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

      const requiredAddress = [
          (v :string) => { 
                          if(formData2.format=='online'){
                            return true ;
                          }else{
                            if (v && v.length>0) return true ;
                            return  "Champ requis"  
                            
                          }
                              

                          },
      ]


      // description
      function stripHtml(html:string){
        return html.replace(/<[^>]*>/g,'')    
      }

      const descriptionRules = [
          (v:string)=>{
            return stripHtml(v).trim().length>=50
            || "Minimum 50 caractères."
          }
      ]
    
    // photo
    const photo_file = ref<any>(null) ;

    const photo = ref('/images/profile.png') ;
    const refInputEl = ref<HTMLElement>() ;

    const changeAvatar = (file: Event) => {
        const fileReader = new FileReader()
        const { files } = file.target as HTMLInputElement

        if (files && 
             files.length && 
             files[0] && 
             files[0].type.startsWith('image/') ) {
         
              photo_file.value = files[0] ;
              photo.value = URL.createObjectURL(files[0]) ;


        }else{
            photo.value = "/images/profile.png" ;
            photo_file.value = null ;
        }

    }
 
/* ----------------------------- step 4 : availabilities ----------------------------------------------------- */
 
    const availabilities = ref<any>([
            {
              day: 1,
              opened: true,
              periods: [
                {
                  openTime: "09:00",
                  closeTime: "18:00"
                } 
              ]
            },
            {
              day: 2,
              opened: true,
              periods: [
                {
                  openTime: "09:00",
                  closeTime: "18:00"
                }
              ]
            },
            {
              day: 3,
              opened: true,
              periods: [
                {
                  openTime: "09:00",
                  closeTime: "18:00"
                } 
              ]
            },
            {
              day: 4,
              opened: false,
              periods: []
            },
            {
              day: 5,
              opened: false,
              periods: []
            },
            {
              day: 6,
              opened: false,
              periods: []
            },
            {
              day: 7,
              opened: false,
              periods: []
            },
            
    ]) ;

/* ---------------------------------------------------------------------------------- */

  function createStep1(post_data :FormData ){ 

    set_has_annonce(true) ;
               
      loading.value = true ;
      showLoading() ;

      $api('/annonces/create_step1',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
          annonce.value = res.data.annonce ;
          if (step.value < maxStep.value) { step.value++ }

          hideLoading() ;
          resetError() ;
          set_has_annonce(true) ;

          // set photo
          user.value.photo = annonce.value.photo.media_url ;
          setUser(user.value) ;

          setTimeout(()=>{ scrollToTop() ; },300)

    }).catch(error=>{

      loading.value = false ;
      server_error.value = true ;
      server_error_message.value = error.message ;

      if(error.statusCode==400){
        server_error_message.value = 'Données incomplètes ou incorrectes.'
      }
      
      console.log("Error:",error); 
      hideLoading() ;

      showErrorSnackbar({
        title: 'Erreur',
        message: server_error_message.value
      }) ;
        
    })
               
  }



/* ------------------------------- step1 --------------------------------------------------- */

  function updateStep1(post_data :FormData ){ 
               
      loading.value = true ;
      showLoading() ;

      $api('/annonces/update_step1',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
      annonce.value = res.data.annonce ;
 

      // set photo
      user.value.photo = annonce.value.photo.media_url ;
      setUser(user.value) ;


      

      if (step.value < maxStep.value) { step.value++ }

      
      hideLoading() ;
      resetError() ;
      
      setTimeout(()=>{ scrollToTop() ; },300)

      }).catch(error=>{

        loading.value = false ;
        server_error.value = true ;
        server_error_message.value = error.message ;

        if(error.statusCode==400){
          server_error_message.value = 'Données incomplètes ou incorrectes.'
        }

        showErrorSnackbar({
          title: 'Erreur',
          message: server_error_message.value
        }) ;
        
        console.log("Error:",error); 
        hideLoading() ;
         
      })
               
  }


/* ------------------------- step2 : format --------------------------------------------------------- */

  function updateStep2(post_data :any ){ 
               
      loading.value = true ;
      showLoading() ;

      $api('/annonces/create_step2',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
      annonce.value = res.data.annonce ;
      if (step.value < maxStep.value) { step.value++ }

      
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

/* ------------------------------ step3:  interval ---------------------------------------------------- */

  function updateStep3(post_data :any ){ 
               
      loading.value = true ;
      showLoading() ;

      $api('/annonces/create_step4',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
      annonce.value = res.data.annonce ;
      if (step.value < maxStep.value) { step.value++ }

      
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

/* ---------------------------- step4 --------------------------------------------------- */

  function setAvailabilities(post_data :any ){ 

      console.log(post_data);

         
      loading.value = true ;
      showLoading() ;

      $api('/annonces/create_step5_set_opening_times',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
      annonce.value = res.data.annonce ;
      if (step.value < maxStep.value) { step.value++ }

      hideLoading() ;
      resetError() ;
      set_annonce_completed(true) ;

       setTimeout(()=>{ scrollToTop() ; },300)

      }).catch(error=>{

        loading.value = false ;
        server_error.value = true ;
        server_error_message.value = error.message ;

        if(error.statusCode==400){
          server_error_message.value = `Données incomplètes ou incorrectes.\n
           Vérifiez que les heures de debuts sont inferieures aux heures de fin.`
        }

         /* showErrorSnackbar({
            title: 'Erreur',
            message: server_error_message.value
          }) ; */
        
        console.log("Error:",error); 
        hideLoading() ;
         
      })
               
  }

 
/* --------------------------------------------------------------------------------- */

  function saveCategory(name :any ){ 
               
      loading.value = true ;
      showLoading() ;

      const post_data = {
        name : name ,
        enabled : "false" ,
      }

      $api('/coach/categories',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
 
      selectedCategories.value.push(res.data.category) ;
      categories.value.push(res.data.category) ;

      // emit to child
      TagsRef2.value?.dataSaved();
       
      
      resetError() ;

      }).catch(error=>{

       console.log("Error:",error); 

      let server_error_message = error.message ;
      if(error.statusCode==400){
        server_error_message = 'Données incomplètes ou incorrectes.'
      }

      // emit to child
      TagsRef2.value?.serverError(server_error_message);
        
      
      }).finally(()=>{

        loading.value = false ;
        hideLoading() ;
         
      })
               
  }

/* --------------------------------------------------------------------------------- */

  function saveChallenge(name :any ){ 
               
      loading.value = true ;
      showLoading() ;

      const post_data = {
        name : name ,
        enabled : "false" ,
      }

      $api('/coach/challenges',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      

      console.log("challenges:", res.data.challenge);
        
      selectedChallenges.value.push(res.data.challenge) ;
      challenges.value.push(res.data.challenge) ;

      // emit to child
      TagsRef.value?.dataSaved();
       
      
      resetError() ;

      }).catch(error=>{

       console.log("Error:",error); 

      let server_error_message = error.message ;
      if(error.statusCode==400){
        server_error_message = 'Données incomplètes ou incorrectes.'
      }

      // emit to child
      TagsRef.value?.serverError(server_error_message);
        
      
      }).finally(()=>{

        loading.value = false ;
        hideLoading() ;
         
      })
               
  }

/* ---------------------------------------------------------------------------------------- */

  onMounted(() => {

    getCategories() ;
    getChallenges() ;

    if(has_annonce.value){
        loadAnnonce() ;
      }  
    });
     
/* ---------------------------------------------------------------------------------------- */

 
   async function nextStep() { 
     
      if(step.value==1){
 
        console.log("TAGS:", selectedChallenges.value);
        console.log("Categories:", selectedCategories.value);

        resetErrorStep1() ;

        const valid = await form1.value?.validate() ;
        if (!valid.valid) return

        const description =  stripHtml(formData1.description).trim() ;

       
        // categories
        if(!selectedCategories.value.length){
          categories_error.value = true ;
         }

        // challenges
        if(!selectedChallenges.value.length){
          challenges_error.value = true ;
         }

        // description
        if(description.length<5){
          description_error.value = true ;
         }

        // photo
        if(!has_annonce.value && !photo_file.value){
          photo_error.value = true ;
          
        }


        if(categories_error.value || challenges_error.value || description_error.value || photo_error.value ){
          return ;
        }
 

        let fData = new FormData()  ;

        fData.append("title", formData1.title) ; 
        fData.append("city", formData1.city) ; 
        fData.append("bio", formData1.bio) ; 
        fData.append("description", formData1.description) ; 
        fData.append("category_ids",JSON.stringify(selectedCategories.value)) ; 
        fData.append("challenge_ids",JSON.stringify(selectedChallenges.value)) ; 

        if(photo_file.value){
          fData.append("photo", photo_file.value) ; 
        }

        // for debug purpose ;
        for (let pair of fData.entries()) { console.log(pair[0] + ': ' + pair[1]); }
        
        // send data
        if(!has_annonce.value){
            createStep1(fData) ;
        }else{
           updateStep1(fData) ;
        }
        
 

      }else if(step.value==2){

        const valid = await form2.value?.validate()
        if (!valid.valid) return

        const form_data = {
          format : formData2.format , 
          address : formData2.address , 
          building : formData2.building , 
        }
 
        updateStep2(form_data) ;
        
      }else if(step.value==3){
           
        const valid = await form3.value?.validate()
        if (!valid.valid) return

        const form_data = {
          booking_interval : formData3.booking_interval , 
        }

        updateStep3(form_data) ;


      }else if(step.value==4){

          const form_data = {
            days : availabilities.value
          }
          setAvailabilities(form_data) ;

      }
 
    }


  /* -------------------------------------------------------------------------------- */

  function resetErrorStep1() {
    description_error.value = false ;
    categories_error.value = false ;
    challenges_error.value = false ;
    photo_error.value = false ;
    
  }

/* -------------------------------------------------------------------------------- */

  function previousStep() {
    description_error.value = false ;
    categories_error.value = false ;
    challenges_error.value = false ;
    photo_error.value = false ;
    if (step.value > 1) step.value--
  }


/* -------------------------------------------------------------------------------- */

    const categories = ref<any>([]) ;
    const challenges = ref<any>([]) ;
    const selectedChallenges = ref<any>([]) ;
    const selectedCategories = ref<any>([]) ;

   

   function getCategories(){

        $api(`/coach/categories`,{
            method: 'GET',
          }).then((res :any )=>{

          categories.value = res.data.categoires ;
          console.log("categories:", categories.value);  

        }).catch(error=>{
            console.log(error); 
        });

   }

/* ------------------------------------------------------------------------------------- */

   async function getChallenges(){

      $api(`/coach/challenges`,{
            method: 'GET',
          }).then((res :any )=>{

        challenges.value = res.data.challenges ;
        console.log("challenges:", challenges.value);   

      }).catch(error=>{
         console.log(error); 
      });

   }

/* ---------------------------------------------------------------------------------- */


  function loadAnnonce(){ 
               
      showLoading() ;
      $api('/annonces/my_annonce',{
        method: 'GET',
       }).then((res :any) =>{


        annonce.value = res.data.annonce ;

        //step 
        // step.value = annonce.value.currentStep ;

        // form1 
        formData1.title = annonce.value.title ;
        formData1.city = annonce.value.city ;
        formData1.bio = annonce.value.bio ;
        formData1.description = annonce.value.description ;

        selectedChallenges.value = annonce.value.challenges ;
        selectedCategories.value = annonce.value.categories ;

        if(annonce.value.photo){
          photo.value =  annonce.value.photo.media_url ;
        }
      
        
        // form 2
        formData2.format = annonce.value.format ;
        formData2.address = annonce.value.address ;
        formData2.building = annonce.value.building ;

         // form 2
        formData3.booking_interval = annonce.value.booking_interval ;
        
        // availabilities
        if(annonce.value.opening_times && annonce.value.opening_times.length){
          availabilities.value =  annonce.value.opening_times ;
        }


        loaded.value = true ;

        hideLoading() ;
         
    
      }).catch(error=>{

        console.log("Error:",error); 
        hideLoading() ;
         
      })
               
  }

/* ------------------------------------------------------------------------------------- */

   function scrollToTop(){

       window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });

   }

</script> 

<template>

  <div class="page_main_content">

    <section class="mb-" >

      <div>
        <p class="page_title text-center"> Mon annonce  </p>
       <!--  <v-divider  class="mt-0 mb-10"></v-divider> -->


      <v-stepper
          color="secondary"
          v-model="step"
          elevation="0"
          :editable="annonce_completed"
          class="coach_hero"
           >

              <!-- header -->
              <v-stepper-header >

                  <v-stepper-item color="secondary"
                      :value="1"
                      title="Annonce"
                  />

                  <v-divider />

                  <v-stepper-item color="secondary"
                      :value="2"
                      title="Format"
                  />

                  <v-divider />

                  <v-stepper-item color="secondary"
                      :value="3"
                      title="Reservation"
                  />

                  <v-divider />

                  <v-stepper-item color="secondary"
                      :value="4"
                      title="Disponibilités"
                  />

                  <v-divider />

                  <v-stepper-item color="secondary"
                      :value="5"
                      title="Fin"
                  />

                  
              </v-stepper-header>
              <!-- header -->

              <!-- content -->
              <v-stepper-window class="ma-4">

                  <v-stepper-window-item :value="1">
                    <div class="step_content"> 
                        <div class="form_content">

                          <v-form ref="form1">
                            <v-row class="ga-4 mt-6">

                                <!-- title -->
                                <v-col cols="12" md="12">
                                    <v-text-field
                                      variant="outlined"
                                      density="compact"
                                      v-model="formData1.title"
                                      :rules="requiredField"
                                      label="Votre titre ou profession" 
                                      hint="Ex: Expert compatible"
                                      />  
                                </v-col>

                                <!-- city -->
                                <v-col cols="12" md="12">
                                    <v-text-field
                                      variant="outlined"
                                      density="compact"
                                      v-model="formData1.city"
                                      :rules="requiredField"
                                      label="Votre ville de résidence" 
                                      hint="Ex: Paris,France"
                                      />  
                                </v-col>

                              <!--  bio  -->

                              <v-col cols="12">
                                  <v-textarea 
                                    v-model="formData1.bio"
                                    :rules="requiredBio"
                                    :maxlength="300"
                                    variant="outlined"
                                    rows="4"
                                    density="compact"
                                    counter
                                    placeholder="Présentez-vous en quelques mots..."
                                    label="Petite bio">
                                  </v-textarea>
                              </v-col>
 
                              <!-- categories -->
                              <v-col cols="12" md="12">
                                  <Tags ref="TagsRef2" 
                                      v-model="selectedCategories" 
                                      :tags="categories" 
                                      :title="'Catégories'"
                                      :placeholder="'Selectionner ou ajouter'"
                                      hint="Selectionner ou ajouter"
                                      persistent-hint
                                      :loading="loading"
                                      @saveTag="saveCategory"
                                      />

                                <p v-if="categories_error" class="mt-0 form_error">  Ce champ est requis</p>

                              </v-col>

                              <!-- Challenges -->
                              <v-col cols="12" md="12">
                                  <Tags ref="TagsRef" 
                                      v-model="selectedChallenges" 
                                      :tags="challenges" 
                                      :title="'Domaines de competences'"
                                      :placeholder="'Selectionner ou ajouter'"
                                      hint="Selectionner ou ajouter"
                                      persistent-hint
                                      :loading="loading"
                                      @saveTag="saveChallenge"
                                      />
                                  <p v-if="challenges_error" class="mt-0 form_error"> Ce champ est requis </p>
                              </v-col>
 
                                <!-- description wysiwyg-->

                                <v-col cols="12">
                                  <p style="color:#00000087"> Description complete de votre profil </p>
                                  <AppEditor 
                                    v-model="formData1.description"
                                    :rules="descriptionRules" />

                                  <p v-if="description_error"
                                    class="ma-a form_error"> 
                                    Ce champ est requis. Min: 50 caractères </p>

                                </v-col>


                              <v-col cols="12" md="6">
                                <div class="d-flex justify-center align-centerr flex-column "
                                  style="width:100%;height: 100%;">
                                    
                                  <v-avatar rounded="" size="250" container   
                                    :image="photo"
                                    @click="refInputEl?.click()" />

                                    <v-btn v-if="!has_annonce"
                                        variant="flat" color="#aaa"
                                        prepend-icon="mdi-image-plus"
                                        size="default"
                                        @click="refInputEl?.click()"
                                        width="250"
                                        class="mt-2"  >
                                          Photo professionnelle
                                    </v-btn>
                                    <v-btn v-else
                                        variant="flat" color="#aaa"
                                        prepend-icon="mdi-image-edit"
                                        size="default"
                                        @click="refInputEl?.click()"
                                        width="250"
                                        class="mt-2">
                                          Photo professionnelle
                                    </v-btn>

                                    <input ref="refInputEl" type="file" name="file"
                                              accept=".jpeg,.png,.jpg,GIF" hidden @input="changeAvatar">
                                  
                                    <p v-if="photo_error"
                                    class="mt-2 form_error"> 
                                     Veuillez ajouter une photo </p>

                                  </div>
                               </v-col>
                               

                            </v-row>
                          </v-form>

                          <!-- server_error -->
                          <div v-if="server_error"  style="max-width: 500px;" class="mt-4" >
                              <v-alert color="warning" variant="tonal" icon="mdi-alert-circle-outline" >
                                    {{ server_error_message }}
                              </v-alert>
                          </div>
                        <!-- /server_error -->

                        </div>
                    </div>
                  </v-stepper-window-item>
                  
                  <v-stepper-window-item :value="2">
                    <div class="step_content"> 
                      <div class="form_content">

                          <p class="form_title"> Où et comment proposez-vous vos séances ?</p>
                          <v-form ref="form2">

                            <v-row>
                                <v-col cols="12" md="12">
                                  <p> Format proposé </p>
                                  <v-radio-group 
                                     v-model="formData2.format" column  
                                      :rules="requiredField">
                                    <div v-for="(format) in formats"  class="address">
                                          <v-radio 
                                                :label="`${format.name}  `"
                                                color="secondary"
                                                :value="format.id" 
                                                > </v-radio>
                                    </div>
                                  </v-radio-group>
                                </v-col>


                              <v-row v-if="formData2.format=='in_person' || formData2.format=='both' ">
                                <v-col cols="12" md="12">
                                   <v-text-field
                                      variant="outlined"
                                      density="compact"
                                      v-model="formData2.address"
                                      :rules="requiredAddress"
                                      label="Adresse complète du lieu de formation" 
                                      hint="Ex : 123 rue Victor Hugo, 80000 Amiens"
                                    /> 
                                </v-col>
                                <v-col cols="12" md="12">
                                   <v-text-field
                                      variant="outlined"
                                      density="compact"
                                      v-model="formData2.building"
                                      label="Bâtiment (facultatif)" 
                                      hint="Bâtiment, lieu-dit, étage, digicode... "
                                    /> 
                                </v-col>
                              </v-row>

                                 
                            </v-row>

                          </v-form>


                          <!-- server_error -->
                          <div v-if="server_error"  style="max-width: 500px;" class="mt-4" >
                              <v-alert color="warning" variant="tonal" icon="mdi-alert-circle-outline" >
                                    {{ server_error_message }}
                              </v-alert>
                          </div>
                        <!-- /server_error -->

 
                        </div>
                    </div>
                  </v-stepper-window-item>

                  <v-stepper-window-item :value="3">
                    <div class="step_content"> 

                        <div class="form_content">
                          <p class="form_title">  Quand la réservation doit-elle commencer ? </p>
                          <p class="form_description">  
                            Par exemple, pour une séance de 60 minutes, un intervalle "chaque demi-heure" proposera des rendez-vous à 9h00, 9h30, 10h00, etc.
                          </p>

                          <v-form ref="form3">

                            <v-row>
                                <v-col cols="12" md="12">
                                  <p>   </p>
                                  <v-radio-group 
                                     v-model="formData3.booking_interval" column  
                                      :rules="requiredNumber">
                                    <div v-for="(booking_interval) in booking_intervals"  class="address">
                                          <v-radio 
                                              :label="`${booking_interval.name}  `"
                                              color="secondary"
                                              :value="booking_interval.id" >
                                            </v-radio>
                                    </div>
                                  </v-radio-group>
                                </v-col>
                              </v-row>
                            </v-form>




                        <!-- server_error -->
                          <div v-if="server_error"  style="max-width: 500px;" class="mt-4" >
                              <v-alert color="warning" variant="tonal" icon="mdi-alert-circle-outline" >
                                    {{ server_error_message }}
                              </v-alert>
                          </div>
                        <!-- /server_error -->

                        </div>

                    </div>
                  </v-stepper-window-item>

                  <v-stepper-window-item :value="4">
                    <div class="step_content"> 
                      <div class="form_content">


                        <v-alert 
                          class="mb-4 pa-4"
                          variant="tonal"
                          color="info"
                          style="max-width: 500px;"
                           
                           icon="mdi-information-slab-circle"  >
                            <div>
                                <div class="text-h6 font-weight-bold mb-1">
                                      Définissez vos disponibilités
                                  </div>

                                  <div class="text-body-2 text-medium-emphasis mb-4">
                                      Pour permettre à vos clients de réserver facilement une séance avec vous, 
                                      renseignez vos jours et horaires de disponibilité. 
                                      Vous gardez ainsi le contrôle sur les créneaux proposés 
                                      et évitez les réservations sur des horaires où vous n'êtes pas disponible.
                                </div>
                              </div>

                        </v-alert>

                         <Availabilities v-model="availabilities"  />

                         <!-- server_error -->
                          <div v-if="server_error"  style="max-width: 500px;" class="mt-4" >
                              <v-alert color="warning" variant="tonal" icon="mdi-alert-circle-outline" >
                                    {{ server_error_message }}
                              </v-alert>
                          </div>
                          <!-- /server_error -->

                      </div>
                    </div>
                  </v-stepper-window-item>

                  <!-- confirmation -->
                  <v-stepper-window-item :value="5">
                    <div class="step_content"> 

                      <div class="services_content">
                        
                        <v-card class="services_card">
                            <v-card-text class="text-center services_card_content">
                              
                              <h2 class="services_card_title">
                                 Votre annonce est enrégistrée  
                                <!-- <v-icon icon="mdi-check-circle-outline" color="success" /> -->
                              </h2>
                               
                              <div v-if="annonce.status==='approved'" >
                                <v-alert 
                                    color="info"
                                    variant="tonal"
                                    rounded="md"
                                    class="text-start mb-6"
                                    icon="mdi-information-slab-circle"
                                    >
                                      <p>
                                        Pour commencer à recevoir des demandes de rendez-vous,vos prestations pour présenter votre expertise aux clients.
                                        Définissez vos services, tarifs et modalités de réservation,
                                        puis commencez à recevoir des demandes.
                                       
                                      </p>
                                </v-alert>
                        
                                
                                <v-btn class="mt-10"
                                  to="/espace-coach/annonce?tab=services"
                                  append-icon="mdi-arrow-right"
                                  color="black" 
                                  variant="flat"
                                  size="large"
                                   
                                  block
                                  >
                                  <span class="text-left" > Mes services </span>
                                  <!-- <template v-slot:append>
                                      <span class="icon_box_secondary icon_box_large">
                                          <v-icon  icon="mdi-arrow-right">  </v-icon>
                                      </span>
                                  </template> -->
                                </v-btn>
                              </div>
                              <div v-if="annonce.status==='pending_validation'" >
                                <v-alert 
                                    color="info"
                                    variant="tonal"
                                    rounded="md"
                                    class="text-start mb-6"
                                    icon="mdi-information-slab-circle"
                                    >
                                      <p>
                                        Votre annonce est en 
                                        <b>attente de validation.</b> 
                                        <v-icon color="success"  icon="mdi-timer-sand">  </v-icon> <br/>
                                        Nous vous informerons par email  <v-icon color="success"  icon="mdi-email-outline">  </v-icon>
                                        dès qu'elle sera approuvée. <v-icon color="success"  icon="mdi-check-circle-outline"></v-icon>.
                                        Pensez à mettre à jour vos services et 
                                        disponibilités pour recevoir des demandes de rendez-vous.
                                      </p>
                                </v-alert>
                        
                                <v-btn class="mt-10"
                                  to="/espace-coach/annonce?tab=services"
                                  append-icon="mdi-arrow-right"
                                  color="black" 
                                  variant="flat"
                                  size="large"
                                  spaced="both"
                                  block
                                  >
                                  <span class="text-left" > Mes services </span>
                                  <!-- <template v-slot:append>
                                      <span class="icon_box_secondary icon_box_large">
                                          <v-icon  icon="mdi-arrow-right">  </v-icon>
                                      </span>
                                  </template> -->
                                </v-btn>
                              </div>
                        
                            </v-card-text>

                          </v-card>

                        </div>


                    </div>
                  </v-stepper-window-item>

                  
              </v-stepper-window>
              <!-- /content -->

              <!-- footer -->

              <v-stepper-actions>

                <template #prev>
                  <v-btn
                    @click="previousStep"
                    color="#eee"
                    variant="flat"
                    prepend-icon="mdi-chevron-left" >
                    Précédent
                  </v-btn>
                </template>

                <template #next>

                  <v-btn
                      v-if="step < maxStep"
                      @click="nextStep"
                      color="secondary"
                      variant="flat"
                      append-icon="mdi-chevron-right"
                      :loading="loading" >
                      {{ step === maxStep ? 'Enrégistrer' : 'Suivant' }}
                  </v-btn>

                  <!-- <v-btn v-else
                      @click="nextStep"
                      color="secondary"
                      variant="flat"
                      append-icon="mdi-check-circle-outline"
                      :loading="loading" > Enrégistrer
                  </v-btn>
                       -->

                </template>

              </v-stepper-actions>

              <!-- /footer -->

          </v-stepper>

         
 
      </div>

 
     </section>
  </div>

</template>

 

<style scoped lang="scss">


  .coach_hero{
       box-shadow: 0 12px 35px rgba(0,0,0,.08);
        border: 1px #eee solid ;
        border-radius: 0px;
        margin: 6px;
  }

  .page_title{
      font-size: 22px ;
      font-weight: bold ;
      margin: 10px 0px 20px 0px ;
  }

  @media (max-width: 839px){
    .page_title{
      font-size: 18px ;
      margin: 10px 0px 10px 0px ;
   }

   .coach_hero{
     border: none ;
   }

  }


  .form_content{
    max-width: 900px ;
    margin: auto ;
    /* border: 1px #eee solid; border-radius: 8px ; */
  }



  .form_title{ 
      font-size: 16px ;
      font-weight: bold ;
      margin-bottom: 4px ;
      margin-top: 10px ;
       line-height: normal ;
  }

  .form_description{
    font-size: 14px ;
    margin-top: 4px ;
    color: #424242;
  }

  .form_error{
     font-size: 14px;
     color: red ;
  }

  .step_content{
    padding-top: 10px ;
    padding-bottom: 20px ;
  }
 

 /* confirmation */

   .services_content{
    max-width: 600px;
    margin: auto;
  }

  .services_card{
      box-shadow: 0 12px 35px rgba(0,0,0,.08);
      border: 0px #eee solid ;
  }

  .services_card_content{
      padding: 10px 20px  
  }

  .services_card_title{
    line-height: normal;
    font-weight: bold ;
    font-size: 18px ;
    margin-bottom: 20px;
  }

  @media (max-width: 839px) {
    .services_card_content{
      padding: 20px 10px !important;
    }
  }

  
</style>

