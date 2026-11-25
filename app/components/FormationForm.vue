
<script setup lang="ts">

    // input
    const props = defineProps({
        experience:{
            type:Object,
            required:true
        }
    }) ;

    const experience = props.experience ;
    const form_params = defineModel<any>({
       required: true
    }) ;

    // output
    const emit = defineEmits(['saveFormation']) ;
 
/* ----------------------------------------------------------------------- */

    const document_file = ref<any>(null) ;

    const photo = ref('/images/image_placeholder.jpg') ;
    const refInputEl = ref<HTMLElement>() ;

    // years
    const currentYear = new Date().getFullYear()
    const years = computed(() =>
        Array.from({ length: 61 }, (_, i) => `${currentYear - i}`)
    ) ;
        
    // months 

    const months = [
        { title: 'Janvier', value: '01' },
        { title: 'Février', value: '02' },
        { title: 'Mars', value: '03' },
        { title: 'Avril', value: '04' },
        { title: 'Mai', value: '05' },
        { title: 'Juin', value: '06' },
        { title: 'Juillet', value: '07' },
        { title: 'Août', value: '08' },
        { title: 'Septembre', value: '09' },
        { title: 'Octobre', value: '10' },
        { title: 'Novembre', value: '11' },
        { title: 'Décembre', value: '12' }
    ]


/* -------------------------- form ------------------------------------ */

    const form = ref() ; 

    const formData = reactive({
        title: experience.title ,
        etablissement: experience.etablissement ,
        city: experience.city ,
        description: experience.description , 
        in_progress: experience.in_progress ,

        start_month: experience.start_month ,
        end_month: experience.end_month ,

        start_year: experience.start_year ,
        end_year: experience.end_year ,
         
    }) ;

    if(experience.file){
        photo.value = experience.file.filetype.includes('image')?experience.file.media_url :'/images/document_placeholder.jpg' ;
    }


 
/* ---------------------- form rules -------------------------------------------------------- */

     // required field
      const requiredField = [
          (v :string) => { 
                          if (v && v.length>0) return true ;
                          return  "Champ requis"  
                },
      ]

      // required phone
        const requiredNumeric = [
          (v :string) => { 
                              if (v && v.length>3) return true ;
                              return  "Champ requis"  
                            },
         ]

      const endDataField = [
          (v :string) => { 
                          if(formData.in_progress){ return true }
                          if (v && v.length>0) return true ;
                          return  "Champ requis"  
                },
      ]


/* ------------------------------------------------------------------------------ */


    const changeFile = (file: Event) => {

        const { files } = file.target as HTMLInputElement

        if (files && 
             files.length && 
             files[0] && 
             ( 
                files[0].type.startsWith('image/') || 
                files[0].type.includes('application/pdf') ||
                files[0].type.includes('document')
            ) 
          ){
 
            document_file.value = files[0] ;
            
            if(files[0].type.startsWith('image/')){
            photo.value = URL.createObjectURL(files[0]) ;
            }else{
            photo.value = "/images/document_placeholder.jpg" ;
            }
            
        }else{
            photo.value = "/images/image_placeholder.jpg" ;
            document_file.value = null ;
        }

    }
 
/* ------------------------------------------------------------------------------ */

      async function onSubmit () {

         form.value.validate() ;

          if(!form.value.isValid){ return ;}

           const start_date = `${formData.start_year}-${formData.start_month}-01` ;

           let end_date =  null ;
           if(formData.in_progress !=true){
             end_date = `${formData.end_year}-${formData.end_month}-01` ;
           }
           
 
            let form_data = {
              title : formData.title,
              etablissement : formData.etablissement,
              city : formData.city,
              description : formData.description,
              in_progress : formData.in_progress,
              start_date :start_date ,
              end_date :end_date ,
            }  

            console.log("form_data",form_data);
 
            let fData = new FormData()  ;

            fData.append("title", formData.title) ; 
            fData.append("etablissement", formData.etablissement) ; 
            fData.append("city", formData.city) ; 
            fData.append("description", formData.description) ; 
            fData.append("in_progress", formData.in_progress) ; 
            fData.append("start_date",  start_date) ; 

            if(end_date){
               fData.append("end_date",  end_date) ;
            }
            
             
           
            if(document_file.value){
              fData.append("document", document_file.value) ; 
            }

            // for debug purpose ;
            // for (let pair of fData.entries()) { console.log(pair[0] + ': ' + pair[1]); }
            
            emit('saveFormation', fData)
    } 


    onMounted(()=>{

       
    })

</script>


<template>


 <div class="main_content">

        <v-form   class="mt-1" ref="form"  @submit.prevent="onSubmit">
            <v-row>

            <!-- title -->
              <v-col cols="12" md="12">
                  <v-text-field
                      variant="outlined"
                      density="compact"
                      v-model="formData.title"
                      :rules="requiredField"
                      label="Titre de la formation" />  
              </v-col>

            <!-- title -->
              <v-col cols="12" md="12">
                  <v-text-field
                      variant="outlined"
                      density="compact"
                      v-model="formData.etablissement"
                      :rules="requiredField"
                      label="Etablissement ou organisation" />  
              </v-col>

            <!-- city -->
            <v-col cols="12" md="12">
                <v-text-field
                    variant="outlined"
                    density="compact"
                    v-model="formData.city"
                    :rules="requiredField"
                    hint="Ex: Paris,France"
                    label="Ville" />  
            </v-col>

            <v-col cols="12" md="12">
                <v-checkbox 
                     v-model="formData.in_progress" 
                     size="large"
                     label="Je suis cette formation actuellement"
                     hide-details />
            </v-col>

            <!-- dates -->
             <v-col cols="6" md="3"  >  

                <v-select
                    :items="months"
                    item-title="title"
                    item-value="value"
                    v-model="formData.start_month"
                    variant="outlined"
                    density="compact"
                    label="Début mois"
                    :rules="requiredField" >
                </v-select>
                     
            </v-col>

            <v-col cols="6" md="3"  >  
                <v-select
                    :items="years"
                   
                    v-model="formData.start_year"
                    variant="outlined"
                    density="compact"
                    label="Début année"
                    :rules="requiredField" >
                </v-select>
            </v-col>

            <v-col cols="6" md="3" v-if="!formData.in_progress" >  

                <v-select
                    :items="months"
                    item-title="title"
                    item-value="value"
                    v-model="formData.end_month"
                    variant="outlined"
                    density="compact"
                    label="Fin mois"
                    :rules="endDataField" >
                </v-select>
                     
            </v-col>

            <v-col cols="6" md="3" v-if="!formData.in_progress" >  
                <v-select
                    :items="years"
                    item-title="title"
                    item-value="value"
                    v-model="formData.end_year"
                    variant="outlined"
                    density="compact"
                    label="Fin année"
                    :rules="endDataField" >
                </v-select>
            </v-col>
             
            <!-- /dates -->
             
            <!-- description -->
            <v-col cols="12" md="12"> 

                <v-textarea 
                    v-model="formData.description"
                    :rules="requiredField"
                    variant="outlined"
                    rows="4"
                    density="compact"
                    label="Description et compétences acquises">
                  </v-textarea>
                 
            </v-col>

            <v-col cols="12"  >
                <h4 class="mt-0 mb-0"> Ajouter un document </h4>
            </v-col>


             <v-col cols="12" md="6">

                <v-alert
                    variant="tonal"
                    color="info"
                    rounded="0"
                    icon="mdi-information-slab-circle"  >

                    <div class="d-flex align-start justify-space-between flex-wrap ga-4">
                        <div>
                            <div class="text-h6 font-weight-bold mb-1">
                                Document (optionnel)
                            </div>
                            <div class="text-body-2 text-medium-emphasis mb-4">
                                Ajouter un diplome, une attestation ou un justificatif quelconque.
                            </div>
                        </div>

                    </div>

                  
                </v-alert>

             </v-col>

             <v-col cols="12" md="4">
               
                <div class="d-flex justify-center align-center flex-column"  >
                                    
                    <v-avatar rounded="0" size="200" container   
                        :image="photo"
                        @click="refInputEl?.click()" />


                    <p v-if="document_file" class="text-info text-left"> {{ document_file.name }} </p>


                    <v-btn v-if="experience.file || document_file"
                        variant="outlined" 
                        color="secondary"
                        prepend-icon="mdi-pencil"
                        @click="refInputEl?.click()"
                        class="mt-2"  >
                        Changer le document
                    </v-btn>
                    <v-btn v-else
                        variant="outlined" 
                        color="info"
                        prepend-icon="mdi-plus"
                        @click="refInputEl?.click()"
                        class="mt-2"  >
                            Charger un document
                    </v-btn>
                    
                    <input ref="refInputEl" type="file" name="file"
                                accept=".jpeg,.png,.jpg,webp,.pdf,.doc,.docx"
                                hidden @input="changeFile">

                </div>

            </v-col>
            
        
        </v-row>

        <v-divider class="mb-4 mt-4"></v-divider>

        <v-col cols="12" v-if="form_params.server_error">
            <v-alert class="mt" color="warning" density="compact" variant="tonal"
                icon="mdi-alert-circle-outline" >
                <template #prepend>
                <v-icon size="25"   name="mdi-alert-circle-outline"></v-icon>
                </template>  {{ form_params.server_error_message }}
            </v-alert>
        </v-col>
        

            
            <v-card-actions>
                
                <v-spacer></v-spacer>

                <v-btn  
                    :loading="form_params.loading"
                    type="submit" 
                    variant="flat" 
                    color="secondary" 
                    block
                >
                    Enrégistrer
                </v-btn>
            </v-card-actions>

        </v-form>
 
    </div>


</template>
<style lang="scss" scoped>

.main_content{
    border: 1px #bbb solid ;
    padding: 15px;
    padding-top: 25px;
    border-radius: 4px;
}
     

</style>