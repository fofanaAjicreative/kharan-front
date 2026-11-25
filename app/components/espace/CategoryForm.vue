
<script setup lang="ts">

/* -------------------------- props ------------------------------------ */

    const props = defineProps({
        category:{
            type:Object,
            required:true
        }
    }) ;

    const category = props.category ;

    const form_params = defineModel<any>({ required: true }) ;

    // output
    const emit = defineEmits(['save']) ;
 

/* -------------------------- form ------------------------------------ */

    const form = ref() ; 

    const formData = reactive({
        name: category.name , 
    }) ;
 
 
/* ---------------------- form rules --------------------------------------------- */

    const requiredField = [
        (v :string) => { 
                if (v && v.length>0) return true ;
                return  "Champ requis"  
            },
    ]
  
 
/* ------------------------------------------------------------------------------ */

    async function onSubmit () {

        form.value.validate() ;

        if(!form.value.isValid){ return ;}
 
        let form_data = {
            name : formData.name,
            enabled : "true"
        }  

        emit('save', form_data)
    } 

/* ------------------------------------------------------------------------------ */

    onMounted(()=>{

       
    })

</script>


<template>


 <div class="main_content">

        <v-form   class="mt-1" ref="form"  @submit.prevent="onSubmit">
            <v-row>

                <!-- name -->
                <v-col cols="12" md="12">
                    <v-text-field
                        variant="outlined"
                        density="compact"
                        v-model="formData.name"
                        :rules="requiredField"
                        label="Nom" />  
                </v-col>

            </v-row>

            
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