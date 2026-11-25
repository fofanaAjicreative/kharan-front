<script setup lang="ts">
  
  const { 
        success,
         error, 
         warning, 
         title,
          message,
          resetSnackbar,
        } = useSnackbar()

  
</script>


<template>
   
    <v-snackbar
          v-model="success" 
          color="success"
          location="bottom end"
          prepend-icon="$success"
          :text="message"
          :title="title"
          timeout="3000"
          timer="top"
          containedd
          timer-color="#FFF"
            >
              <template v-slot:actions>
                <v-btn
                  class="px-3"
                  density="comfortable"
                  rounded="lg"
                  text="OK"
                  variant="tonal"
                  @click="resetSnackbar"
                ></v-btn>
              </template>
    </v-snackbar>

    <v-snackbar
          v-model="warning" 
          color="orange"
          location="bottom end"
          prepend-icon="mdi-alert"
          :text="message"
          :title="title"
          timeout="8000"
          timer="top"
          timer-color="#FFF"
          containedd >
              <template v-slot:actions>
                <v-btn
                  class="px-3"
                  density="comfortable"
                  rounded="lg"
                  text="OK"
                  variant="tonal"
                  @click="resetSnackbar"
                ></v-btn>
              </template>
    </v-snackbar>

    <v-snackbar
          v-model="error" 
          color="warning"
          location="bottom end"
          prepend-icon="$error"
          :text="message"
          :title="title"
          timeout="8000"
          timer="top"
          timer-color="#FFF"
          containedd >
              <template v-slot:actions>
                <v-btn
                  class="px-3"
                  density="comfortable"
                  rounded="lg"
                  text="OK"
                  variant="tonal"
                  @click="resetSnackbar"
                ></v-btn>
              </template>
    </v-snackbar>

 

</template>