<script setup lang="ts">
 

 //---------------------- input 
 
    const props = withDefaults(
        defineProps<{  range?: any }>(), { range: '' }
        )

    const range = props.range.ranges ;
    const index = props.range.index ;

//---------------------- output  

  const emit = defineEmits(['remove','add']) ;

/* ----------------------------------------------------------------------------- */

    const times :any = computed(() => {
            const list=[]
            for(let h=0;h<24;h++){
                list.push(`${String(h).padStart(2,"0")}:00`)
                list.push(`${String(h).padStart(2,"0")}:15`)
                list.push(`${String(h).padStart(2,"0")}:30`)
                list.push(`${String(h).padStart(2,"0")}:45`)
            }

            return list
        })

/* ----------------------------------------------------------------------------- */

    async function removeRange(index :number){
        emit('remove', { index: index })
    }

    async function addRange(){
        emit('add',{})
    }

/* ----------------------------------------------------------------------------- */

 const showMenuStart = ref(false)
 const showMenuEnd = ref(false)

</script>
<template>
  
  <div class="d-flex ga-1 align-center">

        <v-text-field
          class="field"
          :model-value="range.openTime" 
          variant="outlined"
          density="compact"
          hide-details >
          <v-menu
            v-model="showMenuStart"
            :close-on-content-click="false"
            activator="parent"
            min-width="0"
          >
            <v-time-picker 
               v-model="range.openTime" 
               color="secondary" 
               format="24hr"></v-time-picker>
          </v-menu>
        </v-text-field>

        <v-text-field 
           class="field"
          :model-value="range.closeTime" 
          variant="outlined"
          density="compact"
          hide-details >

          <v-menu
            v-model="showMenuEnd"
            :close-on-content-click="false"
            activator="parent"
            min-width="0" >
            <v-time-picker 
              v-model="range.closeTime" 
              color="secondary"
              format="24hr"
              ></v-time-picker>
          </v-menu>
          
        </v-text-field>

     


    <!-- <v-select v-model="range.start"  :items="times" density="compact" hide-details />

    <v-select v-model="range.end" :items="times" density="compact" hide-details /> -->

    <v-btn v-if="index==0"
        icon="mdi-plus-circle"
        variant="text"
        color="#aaa" 
        @click="addRange()"
        />
        
    <v-btn v-else
        icon="mdi-trash-can"
        color="error"
        variant="text"
        @click="removeRange(index)"
        /> 


  </div>

</template>

<style lang="scss" scoped>
  .field{
    min-width:72px ;
  }

   @media (max-width: 350px){
        .field{
          max-width:58px ;
        }
    }
</style>