<script setup lang="ts">



/* ---------------------- propos ---------------------------------- */

    const props = defineProps({

        title:{
            type:String,
            required:true
        },

        subTitle:{
            type:String,
            required:false
        },
        
        value:{
            type:String,
            required:true
        },
        icon:{
            type:String,
            required:true
        },
        color:{
            type:String,
            required:true
        },
        link:{
            type:String,
            default:""
        },


    }) ;

/* ----------------------------------------------------------------- */


</script>



<template>

    <v-card :to="link" elevation="0"
        class="stats_item d-flex ">

        <div class="d-flex align-center">
            <v-avatar
                size="45"
                :color="color"
                variant="tonal"
                rounded
                >

                <v-icon
                    :icon="icon"
                    size="35">
                </v-icon>
            </v-avatar>

        </div>

        <div class="ml-5">
                <p class="title ma-0"> {{ title }} </p>
                <p class="sub_title ma-0"> {{ subTitle }} </p>
                <p class="value mt-1"> {{ value }} </p>
        </div>

        <v-spacer />
        
        <v-icon class="d-none"
            icon="mdi-chevron-right"
            size="x-large">
        </v-icon>

    </v-card>

</template>

<style lang="scss" scoped>

    .stats_item{
        
        padding: 20px ;
        border: 1px #ddd solid ;
 
        height: 100px;
        border-radius: 4px;

    .title{
       font-size: 14px;
       color: #424242;
       margin: 0px;
     }

    .sub_title{
       font-size: 12px;
       color: $success-color;
       font-weight: bold;
       margin: 0px;
     }


    .value{
       font-size: 18px;
       font-weight: bold ;
       color: #424242 ;
     }

  }


  @media screen and (max-width: 600px) {

     .stats_item{

        padding: 10px ;
        height: 80px ;
        border-radius: 8px;


        .title{
            font-size: 14px;
            color: #424242;
            margin: 0px;
        }

        .value{
            font-size: 18px;
            font-weight: bold ;
            color: #424242 ;
            margin-bottom: 0px;
        }

     }
  }



</style>