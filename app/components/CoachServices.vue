<script setup lang="ts">

 const props = defineProps({
        annonce:{
            type:Object,
            required:true
        }
    }) ;

console.log("SERVICES:",props.annonce.services);

</script>

<template>

<section>

      
    <!-- Section header -->
    <div class="header_content text-center mx-auto">
        <p class="service_label"> SERVICES PROPOSÉS </p>

        <!-- <h2 class="service_title">
           Sélectionnez l'accompagnement qui correspond à votre besoin.  
        </h2> -->
  
    </div>
 

    <!-- service liste -->
    <CoachServiceCard  
        v-for="service in annonce.services" :key="service.id" 
        :service="service" />

</section>

</template>
<style scoped lang="scss">



.header_content {
  max-width: 900px;
  margin-top: 50px;
  margin-bottom: 50px;
}

.service_label {
  color: $secondary-color;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

.service_title {
  font-size: 22px;
  font-weight: 700;
  line-height: normal ;
  margin: 10px;
  margin-bottom: 20px;

  span {
    display: block;
  }
}

.main_title2 {
  font-size: 16px;
  line-height: 1.3;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}



</style>