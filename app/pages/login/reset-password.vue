<script setup lang="ts" >

  useSeoMeta({ title: 'Réinitialiser le mot de passe' })
  const { $api } = useNuxtApp() ;

  const { user,setUser } = useAuth() ;
  const {  showSuccessSnackbar } = useSnackbar() ;
 
 /* ---------------------------------------------------------------------------------- */ 

  const step = ref(1) ; // 1: email, 2: otp, 3: form
 
/* ---------------------------------------------------------------------------------- */ 

    function changeEmail() {
        
       otp.value = '' ;
       step.value = 1 ;
       resetError() ;
    }

    function resetError() {
      server_error.value = false ;
      server_error_message.value = '' ;
      loading.value = false ;
      otp_error.value = false ;
    }

/* --------------------------------------- form  -------------------------------------- */

      let  server_error = ref(false) ;

      let  loading = ref(false) ;
      let  server_error_message = ref("") ;
      let  otp_error = ref(false) ;
       
 
      const form1 = ref() ;
      const form2 = ref() ;
      const form3 = ref() ;

      const email = ref('') ;
      const otp = ref('') ;
      const password = ref('') ;
      const confirmPassword = ref('') ; 
   
      

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

      const confirmPasswordRules = [
          (v :string) => { 
                              if (v && v.length) return true ;
                              return  "Champ requis"  
                            },
          (v :string) => { 
                              if (v==password.value) return true ;
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
      

/* ------------------------- step1 ------------------------------------------------- */

      async function onSubmit1 () {
          form1.value.validate() ;
          if(!form1.value.isValid){ return ;}

          let fData = {
              email : email.value,
          } 
 
          sendOptCode(fData) ;
          
      }

/* --------------------------- step2----------------------------------------------- */

    async function onSubmit2 () {
          form2.value.validate() ;
          if(!form2.value.isValid){ return ;}

          let fData = {
              email : email.value,
              code : parseInt(otp.value),
          }

          validateCode(fData) ;
          
    }

   
/* -------------------------- step3 ------------------------------------------------ */

    async function onSubmit3 () {

          form3.value.validate() ;
          if(!form3.value.isValid){ return ;}

          let fData = {
              code :  parseInt(otp.value) ,
              email : email.value ,
              password : password.value,
              origin : 'web',
           } 
           
         
          login(fData) ;
      }


/* ----------------------------step 1------------------------------------------------------ */

  async function sendOptCode(post_data :any ){ 
               
       loading.value = true ;
       server_error.value = false ;

      $api('/auth/reset_password_step1',{
        method: 'POST',
        body:post_data 
      }).then((res :any) =>{
      
          loading.value = false ;
          server_error.value = false ;
          server_error_message.value = '' ;

          step.value = 2

      }).catch(error=>{

        loading.value = false ;
        server_error.value = true ;
        server_error_message.value = error.message ;

        
        console.log("Error:",error); 
        console.log("Message:",error.message); 
         
      })
               
  }

 /* ----------------------------step 2 ------------------------------------------------------ */

    function validateCode(post_data :any ){ 
                  
          loading.value = true ;
          server_error.value = false ;

          $api('/auth/validate_password_otp',{
            method: 'POST',
            body:post_data
          }).then((res :any) =>{
          
              loading.value = false ;
              server_error.value = false ;
              server_error_message.value = '' ;

              step.value = 3

          }).catch(error=>{

            loading.value = false ;
            server_error.value = true ;
            server_error_message.value = error.message ;

            console.log("Error:",error); 
            
          })
                  
      } 

  
/* ----------------------------------- step3 -------------------------------------------- */

   function login(post_data :any ){ 
               
      loading.value = true ;

      $api('/auth/reset_password_step2',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
         

        console.log("RES:",res.data );

        setUser(res.data.user) ;
        

        showSuccessSnackbar({
          title: 'Succès',
          message: 'Votre mot de passe a été mis à jour avec succès.'
        }) ;

 
        if(res.data.user.role == Role.COACH){
            navigateTo('/espace-coach')
        }else if(res.data.user.role == Role.USER){
            navigateTo('/espace-client')
        }else{
          navigateTo('/')
        }


      }).catch(error=>{

        loading.value = false ;
        server_error.value = true ;
        server_error_message.value = error.message ;
        
        console.log("Error:",error); 
         
      })
               
  }

/* --------------------------------------------------------------------------------- */

    onMounted(() => {

                
      });

/* --------------------------------------------------------------------------------- */
 
</script>

 <template>
  
   <div class="main_content">


        <!-- step 1 -->
        <section v-if="step==1" >
          <div class="text-cente">


            <v-btn  
              to="/"
              variant="text" 
              spaced="start"
              
              class="mb-4" >
              <v-icon icon="mdi-arrow-left" size="20" class="mr-2 ml-0"  ></v-icon>
              Retour à l'accueil
            </v-btn>

            <p class="form_title" > Réinitialisation du mot de passe </p>

            <!-- <p class="form_description" > 
              Saisissez votre email pour recevoir un code de vérification et réinitialiser votre mot de passe.
            </p> -->

            <v-alert 
              icon="mdi-information-slab-circle"
              class="mb-8 mt-4" 
              color="info" 
              variant="tonal" 
              density="compact"  >
              Saisissez votre email pour recevoir un code de vérification 
              et réinitialiser votre mot de passe.
            </v-alert>

           <div>
              <v-form class="mt-4" ref="form1"   @submit.prevent="onSubmit1">
                <v-row>
                  <v-col cols="12" md="12" >
                      <v-text-field
                          variant="outlined"
                          density="compact"
                          
                          v-model="email"
                          :rules="emailRules"
                          class="mb-0"
                          hide-details="auto"
                          label="Votre email" >
                      </v-text-field>
                  </v-col>

                
                  <v-col cols="12" v-if="server_error">
                      <v-alert class="mt" color="error" density="compact" variant="tonal" closable
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
                      append-icon="mdi-chevron-rightt"
                      color="secondary"  class="text-none mt-5 w-100">
                          Continuer  
                    </v-btn> 
                  </v-col>

                </v-row>

                <v-divider> </v-divider>
                         
                <div class="d-flex mt-6"> 
                    <div class="w-100 text-center">
                      <label>Vous avez déjà un compte ? </label>
                        <NuxtLink to="/login"> 
                            <span class="ml-1 text-link" > Connexion </span> 
                        </NuxtLink>
                    </div>
                </div>

              </v-form>
           </div>

          </div>
        </section>

        <!-- step2 -->
        <section v-if="step==2" >
          <div class="text-center">

            <p class="form_title" > Réinitialisation du mot de passe </p>

            <p class="form_description" > 
              Nous vous avons envoyé un code à votre <b>adresse email</b>.Saisissez le code pour continuer.
            </p>

          
           <div>
              <v-form class="mt-4" ref="form2"   @submit.prevent="onSubmit2">
                <v-row>
                  <v-col cols="12" md="12" >
                      <v-text-field
                        append-inner-icon="mdi-square-edit-outline"
                        @click:appendInner="changeEmail()"
                        variant="outlined"
                        density="default"
                        
                        
                        v-model="email"
                        :rules="emailRules"
                        class="mb-0"
                        hide-details="auto"
                        label="Votre email" >
                      </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                      <v-otp-input
                        v-model="otp" 
                        length="6"
                         :disabled="loading"
                        color="#FFFFFF"
                        variant="outlined"
                         hide-details="auto"
                         :error="otp_error"
                      ></v-otp-input>
                  </v-col>

                  <v-col cols="12" v-if="server_error">
                       <v-alert class="mt" color="error" density="compact" variant="tonal"
                        icon="mdi-alert-circle-outline" >
                        <template #prepend>
                          <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                        </template>
                         <b>{{ server_error_message}} </b><br>
                         Si vous avez saisi le code reçu par email, vérifiez que vous avez entré le bon code. <br>
                         Si le problème persiste, essayez de renvoyer un nouveau code.
                      </v-alert>
                  </v-col>

                  <v-col cols="12"> 
                    <v-btn type="submit"
                      :loading="loading"
                      :disabled="otp.length!=6"
                      variant="flat" size="large"
                      color="#424242"  class="w-100"> Valider  le code 
                    </v-btn> 
                </v-col>

                </v-row>

                <v-divider class="mt-6 mb-6"> </v-divider>
                         
                <div class="d-flex mb-6">
                    <div class="w-100 text-left">
                      <div class="text-body-note">
                        Vous n'avez pas reçu le code ?
                        <v-btn
                            color="secondary"
                            size="small"
                            text="Nouveau code"
                            variant="flat"
                            @click="changeEmail()"
                          ></v-btn>
                        
                         <!-- <a href="#" class="ml-4" @click.prevent="otp = ''">renvoyer un nouveau code</a> -->
                      </div>

                     </div>
                </div>

                <v-divider> </v-divider>

                <v-alert class="mt-4"
                    color="#f8f8f8"
                    density="compact"
                    icon="mdi-lightbulb-outline" >
                    <template #prepend>
                      <v-icon size="25" color="#424242" name="mdi-lightbulb-outline"></v-icon>
                    </template>
                     Pensez à vérifier votre dossier de <b>spam</b> ou <b>courrier 
                     indésirable </b> si vous ne voyez pas notre email dans votre boîte de réception.
                  </v-alert>

              </v-form>
           </div>

          </div>
        </section>


        <!-- step 3 -->
        <section v-if="step==3" >
          <div class="text-center">

            <p class="form_title" > Réinitialisation du mot de passe </p>

            <p class="form_description" > 
              Saisissez votre nouveau mot de passe .
             </p>

          
           <div>
              <v-form class="mt-4" ref="form3"   @submit.prevent="onSubmit3">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field
                            variant="outlined"
                            
                              density="compact"
                              hide-details="auto"
                            v-model="password"
                            :rules="passwordRules"
                            type="password"
                              label="Mot de passe" />  
                  </v-col>
                  <v-col cols="12" md="12">
                      <v-text-field
                          variant="outlined"
                          
                            density="compact"
                            hide-details="auto"
                          v-model="confirmPassword"
                          :rules="confirmPasswordRules"
                            type="password"
                          label="Confirmer le mot de passe" />  
                  </v-col>
        

                  <v-col cols="12" v-if="server_error">
                    <v-alert class="mt" color="error" density="compact" variant="tonal"
                      icon="mdi-alert-circle-outline" >
                      <template #prepend>
                        <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                      </template>  {{ server_error_message }}
                    </v-alert>

                    <div class="d-flex mb-4 mt-6">
                        <div class="w-100 text-left">
                          <div class="text-medium-emphasi">
                            Code invalide ou expiré ?
                            <v-btn
                                color="secondary"
                                size="small"
                                text="Nouveau code"
                                variant="flat"
                                @click="changeEmail()"
                              ></v-btn>
                            
                           </div>

                        </div>
                   </div>

                  </v-col>

                  <v-col cols="12"> 
                    <v-btn type="submit"
                      :loading="loading"
                      variant="flat" size="large"
                      color="secondary"  class="w-100"> Réinitialiser
                    </v-btn> 
                 </v-col>

                </v-row>

                <v-divider class="mt-6 mb-6"> </v-divider>
 
              </v-form>
           </div>

          </div>
        </section>

   </div>
 
</template>

<style scoped lang="scss">
   
       

</style>
