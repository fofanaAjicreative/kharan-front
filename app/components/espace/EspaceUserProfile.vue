<script setup lang="ts" >

  import pays from '../../assets/data/countries.json';
  import ProfilePhotoEditor from '~/components/espace/ProfilePhotoEditor.vue'

  const { $api } = useNuxtApp() ;
  const {  showSuccessSnackbar, showErrorSnackbar } = useSnackbar() ;
   const { showLoading, hideLoading } = useGlobalLoading() ;

  const { user,setUser, isCoach } = useAuth() ;

  useSeoMeta({ title: 'Profil' })

  // ------------------- timezone -------------------------------------

      import dayjs from 'dayjs'
      import utc from 'dayjs/plugin/utc'
      import timezone from 'dayjs/plugin/timezone'

      dayjs.extend(utc)
      dayjs.extend(timezone)
 
      const timezones = Intl.supportedValuesOf('timeZone').map(tz => {
         const offset = dayjs().tz(tz).format('Z')
         return {
            title: `(GMT${offset}) ${tz}`,
            value: tz
         }
      }) 

/* ---------------------------------------------------------------------------------- */ 


    function resetError() {
      server_error.value = false ;
      server_error_message.value = '' ;
      pass_error.value = false ;
      pass_error_message.value = '' ;
      loading.value = false ;
    }

/* --------------------------------------- form  -------------------------------------- */

 
    const  loading = ref(false) ;
    const  loaded = ref(false) ;
    const  server_error = ref(false) ;
    const  server_error_message = ref("") ;
      
  
    const form = ref() ;

    const formData = reactive({
        email:"",
        firstName: "",
        lastName: "",
        phone: "",
        timeZone: null,
    }) ;


       // required
       const requiredRules = [
          (v :string) => { 
                              if (v && v.length) return true ;
                              return  "Champ requis"  
                            },
         ]
 

       // form rules 
       const emailRules = [
            (v :any ) => !!v || 'Champ requis',
            (v :any ) => /.+@.+\..+/.test(v) || 'E-mail doit être valide',
        ] ;

        // password 
       const passwordRules = [
          (v :string) => { 
                              if (v && v.length) return true ;
                              return  "Champ requis"  
                            },
          (v :string) => { 
                              if (v.length>3) return true ;
                              return  "Min. 4 caractères ou chiffres."  
                            },
         ]

        // confirm password 
         const confirmPasswordRules = [
          (v :string) => { 
                              if (v && v.length) return true ;
                              return  "Champ requis"  
                            },
          (v :string) => { 
                              if (v==formData2.password) return true ;
                              return  "Les mots de passe ne correspondent pas."  
                            },
        ]  


        // required field
        const requiredField = [
          (v :string) => { 
                              if (v && v.length>1) return true ;
                              return  "Champ requis"  
                            },
         ]

        // required phone
        const requiredPhone = [
          (v :string) => { 
                              if (v && v.length>4) return true ;
                              return  "Champ requis"  
                            },
         ]
      

 /* ---------------------------- password form ---------------------------------------- */


  const pass_error = ref(false) ;
  const pass_error_message = ref("") ;
  const show_password_modal = ref(false)

  const form2 = ref() ;

  let  formData2 = reactive({
        old_password: "" ,
        password: "" ,
        confirmPassword: "" , 
  }) ;

  let password_type = ref<any>("false") ;

  const passwordType = computed(() => {
      return password_type.value?"password":"text";
  });

  const passwordIcon = computed(() => {
      return password_type.value?"mdi-eye-outline":"mdi-eye-off-outline";
  });



    async function onSubmit2 () {
        form2.value.validate() ;
        if(!form2.value.isValid){
            return ;
        }

        let form_data = {
          old_password : formData2.old_password,
          new_password : formData2.password,
         } 
      
      changePassword(form_data)

    } 

   
/* -------------------------- onSubmit ------------------------------------------------ */

    async function onSubmit () {

          form.value.validate() ;
          if(!form.value.isValid){ return ;}

          let fData = {
             
              firstName : formData.firstName,
              lastName : formData.lastName,
              phone : formData.phone,
              dial_code : current_country.value.dial_code,
              country : current_country.value.code,
              timeZone : formData.timeZone,
               
          } 
       
          updateProfile(fData)
      }

  

/* ---------------------------------------------------------------------------------- */

  function updateProfile(post_data :any ){ 
               
      showLoading() ;
      loading.value = true ;

      $api('/auth/profile',{
        method: 'PUT',
        body:post_data
      }).then((res :any) =>{
      
        console.log("Login:",res.data);
 
        // set auth store
        setUser(res.data.user) ;

        // set photo
        user_photo.value = res.data.user.photo ?res.data.user.photo:null


            
        loading.value = false ;
        loading.value = false ;
        server_error.value = false ;
        server_error_message.value = '' ;

      
        resetError() ;
        
        showSuccessSnackbar({
          title: 'Profil mis à jour',
          message: 'Votre profil a été mis à jour avec succès.'
        }) ;
      
      }).catch(error=>{

       
        server_error.value = true ;
        server_error_message.value = error.message ;

        if(error.statusCode==400){
          server_error_message.value = 'Données incomplètes ou incorrectes.'
        }
        
        console.log("Error:",error); 
 
      }).finally(()=>{

        loading.value = false ;
        hideLoading() ;

        
      })
               
  }

/* ------------------------------------------------------------------------------------------------- */

  function changePassword(post_data :any ){ 
               
      showLoading() ;
      loading.value = true ;

      $api('/auth/change_password',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
      
 
        pass_error.value  = false ;
        show_password_modal.value = false ;


        hideLoading() ;
        resetError() ;

        showSuccessSnackbar({
          title: 'Profil mis à jour',
          message: 'Votre profil a été mis à jour avec succès.'
        }) ;

      }).catch(error=>{


        pass_error.value  = true ;

        server_error.value = true ;
        pass_error_message.value = error.message ;

        if(error.statusCode==400){
          pass_error_message.value = 'Données incomplètes ou incorrectes.'
        }
        
        console.log("Error:",error); 
          
      }).finally(()=>{

        loading.value = false ;
        hideLoading() ;

        
      })
               
  }


  
/* ---------------------------------------------------------------------------------- */


  function loadProfile(){ 
               
      showLoading() ;

      $api('/auth/profile',{
        method: 'GET',
       }).then((res :any) =>{

        console.log("PROFILE:",res.data.user);
        
        user_photo.value = res.data.user.photo ?res.data.user.photo:null

        // fill form 
        formData.email = res.data.user.email ;
        formData.firstName = res.data.user.firstName ;
        formData.lastName = res.data.user.lastName ;
        formData.phone = res.data.user.phone ;
        formData.timeZone = res.data.user.timeZone ;

        let country = all_countries.find((item)=>item.code == res.data.user.country) ;
        if(country){
          current_country.value = country ;
        }

        hideLoading() ;
        resetError() ;
    
      }).catch(error=>{

         
        server_error.value = true ;
        server_error_message.value = error.message ;

        if(error.statusCode==400){
          server_error_message.value = 'Données incomplètes ou incorrectes.'
        }
        
        console.log("Error:",error); 
          
      }).finally(()=>{

        loaded.value = true ;
        hideLoading() ;

      })
               
  }




/* -------------- Coutries ------------------------------- */
 
   // country
   let all_countries :any[]  = [] ;
    let countries :any[]  = [] ;

    let  current_country =  ref({
        "name": "Morocco", 
        "flag": "🇲🇦",
        "code": "MA",
        "dial_code": "+212"
    });

    let open_countries_list = ref(false) ;

   let search_country = ref("") ;
   
    function changeSearch(){
          let value = search_country.value ;
          if(!value){
             countries = all_countries ;
             return ;
          }

          console.log("SEARCH:",value);
          countries = all_countries.filter((item)=>{
            return item.name.toLocaleUpperCase().includes(value.toLocaleUpperCase()) ;
          })
    }

    function toggleCoutriesList(){

        if(open_countries_list.value){
          open_countries_list.value = false ;
        }else if(!open_countries_list.value){
          open_countries_list.value = true ;
        }
    }

    function selectCountry(code :string) {
          current_country.value = all_countries.find( (item)=>item.code == code)
          open_countries_list.value = false ;
    }


  /* --------------------------------------------------------------------------------- */

    onMounted(() => {
 
      all_countries  = pays ;
      countries  = pays ;

      loadProfile() ;
                        
    });

/* --------------------------- profile photo --------------------------------------------- */


    const user_photo = ref(null) ;
    const uploading = ref(false) ;
    const photoEditorRef = ref<InstanceType<typeof ProfilePhotoEditor> | null>(null);
    

  /* ---------------------------------------------------------------------------------- */

    async function uploadProfilePhoto(file: File) {

            uploading.value = true ;

            const fData = new FormData()
            fData.append('image', file)

            $api('/auth/add_photo',{
              method: 'POST',
              body:fData
            }).then((res :any) =>{
            
            
            // set auth store
            user.value.photo = res.data.photo  ;
            user_photo.value = res.data.photo ;
            
            setUser(user.value) ;

            if(photoEditorRef.value){
                photoEditorRef.value.cancelPhoto() ;
            }
            
            showSuccessSnackbar({
              title: 'Profil mis à jour',
              message: 'Votre profil a été mis à jour avec succès.'
            }) ; 

            
            }).catch(error=>{

            
              let error_message = error.message ;

              if(error.statusCode==400){
                error_message = 'Données incomplètes ou incorrectes.'
              }
              

                showErrorSnackbar({
                  title: 'Erreur',
                  message: error_message
                }) ;

      
            }).finally(()=>{
               uploading.value = false ;
            })
 

    }

  /* ---------------------------------------------------------------------------------- */

    async function deleteProfilePhoto() {

         $api('/auth/delete_photo',{
              method: 'DELETE',
            }).then((res :any) =>{
            
                  
            user_photo.value = null ;

            // set store 
            user.value.photo = null ;
            setUser(user.value) ;
               
            
            }).catch(error=>{

            
              let error_message = error.message ;

              if(error.statusCode==400){
                error_message = 'Données incomplètes ou incorrectes.'
              }
              
              showErrorSnackbar({
                title: 'Erreur',
                message: error_message
              }) ;

      
            }).finally(()=>{
              uploading.value = false ;
            })
    }
   
</script>

 <template>
  
   <div class="main_content">



        <SkeletonDashboard v-if="!loaded"  />
        <section v-if="loaded && user" class="mb-2 form_content" >
          <div class="text-cente">

            <p class="page_title" :class="{'text-center':!isCoach}" > Editer mon profil </p>
            

          
           <div>
              <v-form class="mt-4" ref="form"   @submit.prevent="onSubmit">

                <v-row>

                   <!-- left side -->
                   <v-col v-if="!isCoach" cols="12" lg="4" style="min-width: 280px !important;" >

                          <ProfilePhotoEditor 
                              ref="photoEditorRef"
                              v-model="user_photo"
                              :loading="uploading"
                              @change="uploadProfilePhoto"
                              @delete="deleteProfilePhoto"
                          />
                   </v-col>


                   <!-- right side -->
                   <v-col cols="12" lg="8">
                        <v-row>
                          
                          <v-col cols="12" md="6">
                              <v-text-field
                                  variant="outlined"
                                  density="compact"
                                  hide-details="auto"
                                
                                  v-model="formData.firstName"
                                  :rules="requiredField"
                                  label="Prénom" />  
                          </v-col>
                          <v-col cols="12" md="6">
                              <v-text-field
                                variant="outlined"
                                  density="compact"
                                  hide-details="auto"
                                
                                  v-model="formData.lastName"
                                  :rules="requiredField"
                                    label="Nom" />  
                          </v-col>


                          <!-- Téléphone -->

                          <v-col cols="12" md="12">
                              <div class="d-flex">
                                <div @click="toggleCoutriesList()" class="flag d-flex align-center justify-content "> 
                                  <span style=""> {{ current_country.flag}} </span>
                                  <!-- <span style="font-size: 14px; margin-left: 2px;"> {{ current_country.dial_code}} </span> -->
                                  <v-icon :icon="open_countries_list?'mdi-chevron-up':'mdi-chevron-down'" class="mr-4" />
                                </div>

                                <v-text-field
                                  :prefix="current_country.dial_code"
                                    variant="outlined"
                                    density="compact"
                                    type="number"
                                    v-model="formData.phone"
                                    :rules="requiredPhone"
                                     hide-details
                                    label="Téléphone" /> 
                              </div> 
                          </v-col>

                          <!-- /Téléphone -->
                            <!-- countries component -->
                                <div class="country_card_parent"> 
                                <v-card v-show="open_countries_list"  class="country_card mt-0" elevation="2"  >
                                    <v-card-text>
                                        <div class="country_component">
                                          <v-text-field
                                            autofocus
                                            class="mt-2 mb-2"
                                            variant="solo"
                                            hide-details
                                            single-line
                                            density="compact"
                                            append-inner-icon="mdi-magnify"
                                            placeholder="Chercher un pays"
                                            v-model="search_country"
                                            @update:modelValue="changeSearch()"
                                            clearable
                                            label="Chercher" >
                                          </v-text-field>

                                          <v-list lines="one" class="text-left" >
                                              <div v-for="(country,index) in countries" :key="index">
                                                <v-list-item
                                                  @click="selectCountry(country.code)"
                                                    :key="index"
                                                    subtitle=""
                                                    :title="country.name">

                                                    <template v-slot:prepend>
                                                        <v-avatar>
                                                            {{country.flag }}
                                                        </v-avatar>
                                                    </template>
                                                </v-list-item>
                                                <v-divider> </v-divider>
                                              </div>
                                          </v-list>
                                          
                                        </div>
                                    </v-card-text>
                                </v-card>
                              </div>
                              <!-- / countries component -->

                              <!-- email -->
                              <v-col cols="12" md="12" >
                                  <v-text-field
                                    readonly
                                    variant="outlined"
                                    density="compact"
                                    :disabled="true"
                                    v-model="formData.email"
                                    :rules="emailRules"
                                    class="mb-0"
                                    hide-details="auto"
                                    label="Votre email" >
                                  </v-text-field>
                              </v-col>

                              <!-- timezone -->
                             <v-col cols="12" md="12" >
                              
                                    <v-autocomplete style="min-width: 300px"
                                        v-model="formData.timeZone"
                                        :items="timezones"
                                        label="Votre fuseau horaire"
                                        item-title="title"
                                        item-value="value"
                                        variant="outlined"
                                        density="compact"
                                        clearable 
                                    />
                              
                              </v-col>

                                <v-alert
                                  color="info"
                                  variant="tonal"
                                  rounded="md"
                                  class="text-start mb-6" >
                                    <p>
                                      <h3 class="mb-2 mt-1">
                                        <v-icon icon="mdi-information-slab-circle"> </v-icon> 
                                        Confirmez votre fuseau horaire 
                                      </h3> 

                                      Pour garantir l'exactitude de vos rappels et vous afficher vos créneaux de coaching à l'heure exacte de votre région,
                                       assurez-vous que votre fuseau horaire est bien renseigné.<br>
                                       S'il n'est pas configuré, l'heure de votre navigateur sera utilisée par défaut.
                                       
                                    </p>
                              </v-alert>
                

                          <v-col cols="12" v-if="server_error">
                              <v-alert class="mt" color="warning" density="compact" variant="tonal"
                              icon="mdi-alert-circle-outline" >
                              <template #prepend>
                                <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                              </template>  {{ server_error_message }}
                            </v-alert>
                          </v-col>

                          <v-col cols="12"> 
                            <v-btn type="submit"
                              :loading="loading"
                              variant="flat" size="large"
                              color="secondary"  class="w-100"> Enrégistrer
                              
                            </v-btn> 
                        </v-col>

                        <!-- change password -->
                        <v-col cols="12">
                          <v-divider class="mt-6 mb-6"> </v-divider>
                          
                            <v-list>
                              <v-list-item color="primary"   lines="one" @click="show_password_modal=true" >
                                  <template v-slot:prepend>
                                      <v-icon variant="flat" color="secondary" icon="mdi-lock" size="small"></v-icon>
                                    </template>
                                  <v-list-item-title>
                                    <p> Changer votre mot de passe </p>
                                  </v-list-item-title>
                                  <template v-slot:append>
                                      <v-btn variant="flat" icon="mdi-square-edit-outline" size="small"></v-btn>
                                  </template>
                              </v-list-item>
                                
                              <v-divider></v-divider>
                                  
                            </v-list>

                        </v-col>
                        

                        </v-row>
                   </v-col>

      
                </v-row>
                

                

              </v-form>
           </div>

          </div>
        </section>

        <!-- PASSWORD MODAL  -->
            <v-row justify="center">
                <v-dialog
                    v-model="show_password_modal"
                    persistent
                    width="600" >
                    <v-card >
                      <v-divider></v-divider>
                      <v-card-title> Changer votre mot de passe </v-card-title>
                      <v-card-text>
                        <v-form ref="form2"  @submit.prevent="onSubmit2">
                            <v-row>
                                <v-col cols="12" class="pa-0">
                                    <v-row>
                                      <v-col cols="12" md="12">
                                          <v-text-field
                                            @click:appendInner="password_type=!password_type"
                                              variant="outlined"
                                              v-model="formData2.old_password"
                                              :rules="passwordRules"
                                              :type="passwordType"
                                              :append-inner-icon="passwordIcon"
                                              label="Votre mot de passe actuel" />  
                                      </v-col>
                                         
                                      <v-col cols="12" md="6">
                                          <v-text-field
                                            @click:appendInner="password_type=!password_type"
                                              variant="outlined"
                                              v-model="formData2.password"
                                              :rules="passwordRules"
                                              :type="passwordType"
                                              :append-inner-icon="passwordIcon"
                                              label="Nouveau mot de passe" />  
                                      </v-col>
                                      <v-col cols="12" md="6">
                                          <v-text-field
                                             @click:appendInner="password_type=!password_type"
                                             variant="outlined"
                                              v-model="formData2.confirmPassword"
                                              :rules="confirmPasswordRules"
                                              :append-inner-icon="passwordIcon"
                                              :type="passwordType"
                                              label="Confirmer le mot de passe" />  
                                      </v-col>

                                      <v-col cols="12" md="12" v-if="pass_error_message" >

                                          <v-alert class="mt" color="warning" density="compact" variant="tonal"
                                            icon="mdi-alert-circle-outline" >
                                            <template #prepend>
                                              <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                                            </template>  {{ pass_error_message }}
                                          </v-alert>
                                             
                                      </v-col>

                                      <v-col cols="12" md="12">

                                        <v-divider> </v-divider>

                                          <div class="d-flex mt-4"> 
                                            <div>
                                               
                                            </div>
                                            <div>
                                                <label>Avez-vous oublié votre mot de passe actuel ? </label>
                                                <RouterLink to="/login/reset-password" class="link"> 
                                                    <span class="ml-1" > Réinitialiser </span> 
                                                </RouterLink>
                                            </div>
                                          </div>

                                        </v-col>

                                    </v-row>
                                </v-col>
                            </v-row>
                          </v-form>
                      </v-card-text>
                      <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn 
                          variant="flat"
                          color="#eee"
                          class="text-none"
                          @click="show_password_modal = false" >
                          Annuler </v-btn>

                        <v-btn
                          color="secondary"
                          class="text-none"
                          variant="flat"
                          :loading="loading"
                          rounded="0"
                          @click="onSubmit2()" >
                           Enrégistrer
                          <template v-slot:loader >
                            <v-progress-linear indeterminate></v-progress-linear>
                          </template>
                        </v-btn>

                    </v-card-actions>

                  </v-card>
                </v-dialog>

            </v-row >  
          <!-- END PASSWORD MODAL -->

   </div>
 
</template>

<style scoped lang="scss">


   .page_title{
      font-size: 22px ;
      font-weight: bold ;
      margin-bottom: 40px ;
    }

    .form_content{
      max-width: 1024px ;
      margin: auto ;
      padding: 10px ;
    }


    .form_title{
      font-size: 16px ;
      font-weight: bold ;
    }


  /* ---------------- pays ----------------------------- */

      .country_card_parent{
         position: relative;
         width: 100%;
      }

      .country_card {
        position: absolute;
        z-index: 10 ;
        width: 100%;
        .v-card-text{
            padding: 0px 10px ;
          }
      }

      .country_component{

          padding: 10px;
          height:300px;overflow: scroll; overflow-x: hidden;
          .v-list-item{
              cursor: pointer;
              cursor: hand;
          }

          scrollbar-color:  var(--primary-color) #eee;
		      scrollbar-width: thin;

          
      }

 
      .flag{
          cursor: pointer;
          cursor: hand;
          span{
            font-size:20px
          }

          /* border: 1px #aaa solid;
          border-right: none;
          margin-right: 0px;
          padding-left: 6px;
          background: #f8f8f8; */
      } 
 /* ---------------- / pays ----------------------------- */
       

</style>
