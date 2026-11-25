
<script setup lang="ts">
        defineProps<{
        eyebrow: string
        title: string
        description: string
        icon?: string
        }>()
</script>

<template>

  <div class="content-page">


    <!-- head -->
    <section class="content-hero">
      <v-container>
        <div class="hero-inner">
          <v-icon
            v-if="icon"
            :icon="icon"
            size="46"
            color="secondary"
            class="mb-5"
          />

          <div class="text-secondary font-weight-bold text-uppercase text-caption mb-3"> {{ eyebrow }} </div>
          <h1 class="text-h3 text-md-h2 font-weight-bold mb-5 hero-title">  {{ title }} </h1>
          <p class="text-body-1 text-medium-emphasis hero-description">  {{ description }} </p>

        </div>
      </v-container>
    </section>
    <!-- /head -->

    <!-- content -->
    <v-container class="content-container">
      <v-card
        rounded="0"
        elevation="0"
        
        class="content-card"
         >
        <div class="content-body">
          <slot />
        </div>
      </v-card>
    </v-container>
    <!-- /content -->

  </div>

</template>

<style scoped>

    .content-page {
        background: #fcfdff;
        min-height: 70vh;
        padding-bottom: 80px;
    }

    .content-hero {
      /* background: linear-gradient(135deg, #f0f5ff 0%, #ffffff 75%); */
      background: linear-gradient(
        180deg,
        #f0f5ff 0%,
        #f3f7ff 25%,
        #f6f9ff 50%,
        #f9fbff 75%,
        #fcfdff 100%
      );
      padding: 45px 0 35px;
      border-bottom: 0px solid #edf0f5;
    }

    .hero-inner {
      max-width: 780px;
      margin: auto;
      text-align: center;
    }

    .hero-title {
      line-height: 1.3;
      
    }

    .hero-description {
      max-width: 650px;
      margin: auto;
      line-height: 1.5;
    }

    .content-container {
      max-width: 1000px;
      margin-top: 0px;
      position: relative;
      padding: 0px;
    }

    .content-card {
      background: white;
    }

    .content-body {
      padding: 45px 55px;
      color: #414957;
      line-height: 1.9;
    }

    .content-body :deep(h2) {
      color: #202938;
      font-size: 21px;
      font-weight: 700;
      margin: 35px 0 15px;
    }

    .content-body :deep(h3) {
      color: #202938;
      font-size: 17px;
      font-weight: 700;
      margin: 25px 0 10px;
    }

    .content-body :deep(p) {
      margin-bottom: 15px;
    }

    .content-body :deep(ul) {
      padding-left: 24px;
      margin-bottom: 20px;
    }

    @media(max-width: 600px) {
    

      .content-hero {
          padding: 35px 0 40px;
      }

      .content-container {
          padding: 0 12px;
      }

      .content-body {
        padding: 25px 20px;
      }


    }
        
</style>
