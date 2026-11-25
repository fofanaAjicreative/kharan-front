<script setup lang="ts">

   const day :any = defineModel<any>({
      required: true
    })

/* --------------------------------------------------- */ 
 
    function addRange() {

        if(day.value.periods.length<3){

            day.value.periods.push({
                openTime:"09:00",
                closeTime:"17:00"
            }) ;

        }


    }

/* --------------------------------------------------- */ 

    function removeRange(index :any){
        day.value.periods.splice(index,1)
    }

/* --------------------------------------------------- */ 

    function enableRange(){

        if(day.value.opened){ // enable
            if(!day.value.periods.length){
                    addRange() ;
            }  
        }
    }

/* --------------------------------------------------- */ 
 
        const days :any = {
               1 : "Lundi",
               2 : "Mardi",
               3 : "Mercrédi",
               4 : "Jeudi",
               5 : "Vendredi",
               6 : "Samedi",
               7 : "Dimanche",
        }
    

</script>
<template>
 

 <div class="main_content">

    <div class="d-flex flex-justify-end align-center py-1">

        <!-- <v-checkbox 
            @change="enableRange()"
            v-model="day.opened" hide-details /> -->
        <div class="d-flex flex-justify-start align-center day">
            <v-switch 
            v-model="day.opened"
            v-on:change="enableRange()"
            color="secondary"
            inset="material"
            size="x-small"
            hide-details
            >
         </v-switch>

          <div class="font-weight-medium ml-1"> {{ days[day.day]}} </div>
        </div>
        
        <div v-if="day.opened" 
           class="flex-grow-1 ml-2" >
            <AvailabilityTimeRangeRow
                v-for="(period,index) in day.periods" :key="index"
                :range="{ index : index , ranges : period}"
                @remove="removeRange(index)"
                @add="addRange()"
            />
        </div>

    </div>

   
     <v-divider class="mt-0 mb-0" color="#000"> </v-divider>
   

 </div>

</template>

<style lang="scss" scoped>
   .day{
       max-width: 110px;
       min-width: 110px;
    }

    @media (max-width: 400px){
        .day{
            max-width: 90px;
            min-width: 90px;
        }
   }

    @media (max-width: 350px){
        .day{
            max-width: 60px;
            min-width: 60px;
        }
    }
</style>