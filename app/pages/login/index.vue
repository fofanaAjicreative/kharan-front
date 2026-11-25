<script setup lang="ts"  >
 
  useSeoMeta({ title: 'Connexion' })
  const { showDialog } = useAnnonceDialog() ;
  const { getUpcommingReservation } = useUpcomingReservation() ;

  const { $api } = useNuxtApp() ;
  const { initialize } = useAppInitializer() ;
  const {setUser ,user , isCoach } = useAuth() ;

 
  let  server_error = ref(false) ;
  let  loading = ref(false) ;
  let  server_error_message = ref("") ;
        

/* --------------------------------------- form  -------------------------------------- */

  const form = ref() ;
  const email = ref('') ;
  const password = ref('') ;
 
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

    
/* ------------------------- submit ------------------------------------------------- */

  async function onSubmit () {

    form.value.validate() ;
    if(!form.value.isValid){ return ;}

    let fData = {
        email : email.value,
        password : password.value
    } 

    login(fData) ;
 
          
  }


/* ------------------------------------------------------------------------------- */

  function login(post_data :any ){ 
               
      loading.value = true ;

      $api('/auth/login',{
        method: 'POST',
        body:post_data
      }).then(async (res :any) =>{
         

        console.log("Login:",res.data);
 
        // set auth store
        let user = res.data.user ;
        setUser(user) ; 

        if(isCoach.value){
          showAnnonceDialog() ;
        }

        if(user.value){
          getUpcommingReservation()
        }
        
        await initialize()
  
        if(res.data.user.role == Role.COACH ){
            navigateTo('/espace-coach')
        }else if(res.data.user.role == Role.USER){
            navigateTo('/espace-client')
        }else if(res.data.user.role == Role.ADMIN){
            navigateTo('/admin')
        }else{
          navigateTo('/')
        }
      

      }).catch(error=>{

        server_error.value = true ;
        server_error_message.value = error.message ;
        
        console.log("Error:",error); 
         
      }).finally(()=>{

        loading.value = false ;
      })
               
  }

/* -------------------------------------------------------------------------------- */ 

  function showAnnonceDialog(){ 

      showDialog({
        has_annonce: user.value.has_annonce ,
        annonce_completed: user.value.annonce_completed ,
        has_service: user.value.has_service ,
        dismissed_annonce_dialog_at: user.value.dismissed_annonce_dialog_at ,
      })
       
  }


</script>

 <template>
  
  <div class="main_content">
        <section >
          <div class="text-cente">


            <v-btn  
              to="/"
              variant="text" 
              spaced="start"
              
              class="mb-4" >
              <v-icon icon="mdi-arrow-left" size="20" class="mr-2 ml-0"  ></v-icon>
              Retour à l'accueil
            </v-btn>

            <p class="form_title" > Connexion </p>

            <p class="form_description" > 
             <!--  Saisissez votre email pour vous connecter ou créer votre compte. -->
            </p>

            
           <div>
              <v-form class="mt-4" ref="form"   @submit.prevent="onSubmit()">
                <v-row>
                  <v-col cols="12" md="12" >
                      <v-text-field
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
                      <v-text-field
                          variant="outlined"
                           
                          density="compact"
                          hide-details="auto"
                          v-model="password"
                          :rules="passwordRules"
                          type="password"
                            label="Mot de passe" />  
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
                    <v-btn type="submit" 
                      :loading="loading"
                      variant="flat" size="large"
                      append-icon="mdi-chevron-rightt"
                      color="secondary"  class="text-none mt-5 w-100">
                          Se connecter  
                    </v-btn> 
                  </v-col>

                </v-row>

                <v-divider> </v-divider>
                         
                <div class="d-flex flex-wrapp ga-6 mt-6"> 

                  <div class="w-100 text-center">
                      <label> Vous avez oublié votre mot de passe ? </label>
                        <NuxtLink to="/login/reset-password"> 
                            <span class="ml-1 text-link" > Réinitialiser le mot de passe </span> 
                        </NuxtLink>
                    </div>

                    <div class="w-100 text-center">
                      <label>Vous n'avez pas encore de compte ? </label>
                        <NuxtLink to="/register"> 
                            <span class="ml-1 text-link" > Inscription </span> 
                        </NuxtLink>
                    </div>

                    
                </div>

              </v-form>
           </div>

          </div>
      </section>
     
  </div>
 
</template>


<style scoped lang="scss">
      
      .main_content{
        display: flex ;
        flex-direction: column;
        height: 100% ;
        justify-content: center;
        align-items: center ;
      }

</style>
