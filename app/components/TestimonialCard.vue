<script setup>
    defineProps({
      company: {
        type: String,
        default: "Schneider Electric"
      },
      quote: {
        type: String,
        default:
          "Nous avons constaté une grande implication dans le coaching, dont la qualité est excellente, mais également une grande flexibilité offerte par CoachHub."
      },
      name: {
        type: String,
        default: "Patrick Casseday"
      },
      role: {
        type: String,
        default: "Director, Talent Development North America Operations"
      },
      avatar: {
        type: String,
        default: ""
      },
      color: {
          type: String,
          default: "primary" // primary | secondary | tertiary 
      },
    })
</script>

<template>
  <v-card 
     :class="`card-${color}`"
     class="testimonial-card" 
     elevation="0">
    <v-card-text>

      <!-- LOGO -->
      <!-- <div class="company mb-6">
        {{ company }}
      </div> -->

      <!-- QUOTE -->
      <div class="quote mb-8">
        « {{ quote }} »
      </div>

      <v-divider class="divider mb-6"></v-divider>

      <!-- FOOTER -->
      <div class="d-flex align-center justify-space-between">
        
        <!-- USER -->
        <div class="d-flex align-center">
          <v-avatar size="48" v-if="avatar">
            <v-img :src="avatar" />
          </v-avatar>

          <div class="ml-4">
            <div class="name">{{ name }}</div>
            <div class="role">{{ role }}</div>
          </div>
        </div>

        <!-- QUOTE ICON -->
        <div class="quote-icon">
          <v-icon size="40">mdi-format-quote-close</v-icon>
        </div>

      </div>

    </v-card-text>
  </v-card>
</template>

<style scoped>
    .testimonial-card {
        border-radius: 24px;
        padding: 32px;
        max-width: 400px;
        
    }


    /* colors */

    .card-primary{
        background-color: #eee; /* violet profond */
       color: #202068;
    }

    .card-secondary{
        background-color: #cfdbff; /* violet profond */
       color: #202068;
    }

    .card-tertiary{
        background-color: #f4f6fd; /* violet profond */
       color: #202068;
    }



/* LOGO */
.company {
  font-weight: 600;
  font-size: 18px;
  opacity: 0.9;
}

/* QUOTE */
.quote {
  font-size: 22px;
  line-height: 1.6;
  font-weight: 400;
}

/* DIVIDER */
.divider {
  opacity: 0.2;
}

/* USER */
.name {
  font-weight: 700;
  font-size: 16px;
}

.role {
  font-size: 14px;
  opacity: 0.8;
}

/* ICON */
.quote-icon {
  opacity: 0.3;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .quote {
    font-size: 18px;
  }

  .testimonial-card{
    padding: 10px;
  }
}
</style>