<script setup lang="ts">

    const props = defineProps<{
    error: {
        statusCode?: number
        statusMessage?: string
        message?: string
    }
    }>()

    const handleError = () => {
        clearError({ redirect: '/' })
    }

</script>

<template>

  <v-app>

    <v-main class="error-page">

      <div class="error-container">

        <!-- Illustration -->
        <div class="error-number">
          404
        </div>

        <div class="error-icon">
          <v-icon
            icon="mdi-map-marker-question-outline"
            size="70"
          />
        </div>

        <h1 class="error-title">
          Page introuvable
        </h1>

        <p class="error-description">
          Désolé, la page que vous recherchez
          n'existe pas ou a peut-être été déplacée.
        </p>

        <div class="error-actions">


        <v-btn
            variant="text"
            size="large"
            prepend-icon="mdi-arrow-left"
            @click="$router.back()" >
            Page précédente
          </v-btn>

        <v-btn
            size="large"
            variant="text"
            append-icon="mdi-home-outline"
            @click="handleError" >
            Retour à l'accueil
          </v-btn>

         
        </div>

        <div class="error-brand d-none">
          KHARAN
        </div>

      </div>

    </v-main>

  </v-app>

</template>

<style lang="scss" scoped>

.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at 50% 35%,
       $secondary-color, transparent 35% ),
    rgb(var(--v-theme-background));
}

.error-container {
  width: 100%;
  max-width: 600px;
  padding: 40px 24px;
  text-align: center;
}

/* ---------------------------------- */

.error-number {
  font-size: clamp(100px, 20vw, 180px);
  font-weight: 800;
  line-height: 0.9;

  letter-spacing: -8px;

  color: rgba(var(--v-theme-primary), 0.10);

  user-select: none;
}

/* ---------------------------------- */

.error-icon {
  width: 110px;
  height: 110px;

  margin: -35px auto 25px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 32px;

  color: rgb(var(--v-theme-primary));

  background: rgba(var(--v-theme-primary), 0.10);
}

/* ---------------------------------- */

.error-title {
  margin: 0;

  font-size: clamp(28px, 5vw, 40px);
  font-weight: 700;

  letter-spacing: -1px;
}

.error-description {
  max-width: 460px;

  margin: 14px auto 30px;

  font-size: 16px;
  line-height: 1.7;

  color: rgba(var(--v-theme-on-background), 0.60);
}

/* ---------------------------------- */

.error-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  flex-wrap: wrap;
}

/* ---------------------------------- */

.error-brand {
  margin-top: 70px;

  font-size: 13px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #aaa;
}

</style>
```
