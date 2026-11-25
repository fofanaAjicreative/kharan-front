<script setup lang="ts" >

  useSeoMeta({ title: 'Inscription' })
  
  import pays from '../../assets/data/countries.json';

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


      const account_types= ref([
        
        {
          id : "coach",
          name : "Coach",
        },
        {
          id : "user",
          name : "Utilisateur",
        },
        
      ]) ;


      let  server_error = ref(false) ;
      let  server_error_message = ref("") ;

      let  loading = ref(false) ;
      let  otp_error = ref(false) ;
       
 
      const form1 = ref() ;
      const form2 = ref() ;
      const form3 = ref() ;

      const email = ref('') ;
      const otp = ref('') ;
   
      const formData3 = reactive({
          email: email.value,
          otp: otp.value,
          account_type: "",
          fname: "",
          lname: "",
          phone: "",
          password: "",
          confirmPassword: "",
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
                              if (v==formData3.password) return true ;
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

   
/* -------------------------- step2 ------------------------------------------------ */

    async function onSubmit3 () {

          form3.value.validate() ;
          if(!form3.value.isValid){ return ;}

          let fData = {
              code :  parseInt(otp.value) ,
              email : email.value ,
              firstName : formData3.fname,
              lastName : formData3.lname,
              phone : formData3.phone,
              dial_code : current_country.value.dial_code,
              country : current_country.value.code,
              password : formData3.password,
              account_type: formData3.account_type ,
              origin: "web" ,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          } 
           
          console.log(fData) ;

          register(fData)
      }


/* ----------------------------step 1------------------------------------------------------ */

  async function sendOptCode(post_data :any ){ 
               
       loading.value = true ;
       server_error.value = false ;

      $api('/auth/send_register_opt',{
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

      $api('/auth/validate_register_opt',{
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


/* -------------------------------  register --------------------------------------------------- */


  function register(post_data :any ){ 
               
      loading.value = true ;

      $api('/auth/register',{
        method: 'POST',
        body:post_data
      }).then((res :any) =>{
         
        console.log("RES:",res.data );

        setUser(res.data.user) ;
  
        showSuccessSnackbar({
          title: 'Succès',
          message: 'Votre compte a été créé avec succès.'
        }) ;


        if(res.data.user.role == Role.COACH){
            navigateTo('/register/confirmation')
        }else if(res.data.user.role == Role.USER){
            navigateTo('/')
        }


      }).catch(error=>{

        loading.value = false ;
        server_error.value = true ;
        server_error_message.value = error.message ;

        if(error.statusCode==400){
          server_error_message.value = 'Données incomplètes ou incorrectes.'
        }
        
        console.log("Error:",error); 
         
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
                        
      });

   
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

            <p class="form_title" > Inscription </p>

            <p class="form_description" > 
              Saisissez votre email pour vous connecter.
            </p>

            <v-alert 
              icon="mdi-information-slab-circle"
              class="mb-8"
              color="info" 
              variant="tonal" 
              density="compact"  >
                Nous allons vous envoyer un code de vérification par email pour confirmer votre adresse email et continuer le processus d'inscription.
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

            <p class="form_title" > Verifiez votre boîte de réception </p>

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

            <p class="form_title" >Inscription </p>

            <p class="form_description" > 
              Nous vous avons envoyé un code à votre <b>adresse email</b>.Saisissez le code pour continuer.
            </p>

          
           <div>
              <v-form class="mt-4" ref="form3"   @submit.prevent="onSubmit3">
                <v-row>
                  
                  <v-col cols="12" md="12" >
                      <v-select
                        :items="account_types"
                        item-title="name"
                         item-value="id"
                          v-model="formData3.account_type"
                        variant="outlined"
                        density="compact"
                        label="Choisir un type d'utilisateur"
                        :rules="requiredRules" >
                      </v-select>
                  </v-col>

                  <v-col cols="12" md="12" >
                      <v-text-field
                        append-inner-icon="mdi-square-edit-outline"
                        @click:appendInner="changeEmail()"
                        readonlyy
                        variant="outlined"
                        density="compact"
                       
                        v-model="email"
                        :rules="emailRules"
                        class="mb-0"
                        hide-details="auto"
                        label="Votre email" >
                      </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                      <v-text-field
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                         
                          v-model="formData3.fname"
                          :rules="requiredField"
                          label="Prénom" />  
                  </v-col>
                  <v-col cols="12" md="6">
                      <v-text-field
                        variant="outlined"
                          density="compact"
                          hide-details="auto"
                         
                          v-model="formData3.lname"
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
                            v-model="formData3.phone"
                            :rules="requiredPhone"
                            rounded="0"
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
                                    rounded="6"
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


                      <v-col cols="12" md="6">
                          <v-text-field
                              variant="outlined"
                             
                                density="compact"
                                hide-details="auto"
                              v-model="formData3.password"
                              :rules="passwordRules"
                              type="password"
                               label="Mot de passe" />  
                      </v-col>
                      <v-col cols="12" md="6">
                          <v-text-field
                              variant="outlined"
                             
                                density="compact"
                                hide-details="auto"
                              v-model="formData3.confirmPassword"
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
                      color="secondary"  class="w-100"> S'inscrire
                       
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
