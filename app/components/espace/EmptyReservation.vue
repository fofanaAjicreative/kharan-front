
<script  setup lang="ts"  >

const {  isClient } = useAuth() ;

</script>


<template>
    <div  class="no_item text-center pa-8 ">
        <v-avatar
            size="70"
            color="secondary"
            variant="tonal"
            class="mb-0" >

            <v-icon
                icon="mdi-calendar-multiple"
                size="34" >
            </v-icon>
        </v-avatar>
       <p class="title text-medium-emphasis"> Vous n'avez pas de séances. </p>



       <v-btn v-if="isClient"
            to="/coachs" 
            color="secondary" 
            variant="flat"
            size="large"
            spaced="end"
            class="mt-4"
            >
            <span class="text-left" > Trouver un coach </span>
            <template v-slot:append>
                <span class="icon_box_secondary icon_box_large">
                <v-icon  icon="mdi-arrow-right">  </v-icon>
                </span>
            </template>
        </v-btn>


       <!-- <v-btn
        to="/coachs"
        color="secondary"
        size="default"
        variant="flat"
        class="mb-4"
        append-icon="mdi-arrow-right"
      >
        Accéder à la réservation
      </v-btn> -->

    </div>
</template>

<style lang="scss" scoped>


  .no_item{
        
      box-shadow: 0 2px 25px rgba(0,0,0,.08);
      border-radius: 4px;
      margin-bottom: 20px;

      .title{
        font-size: 16px;
        font-weight: 500 ;
      }


    }

</style>