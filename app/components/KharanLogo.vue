
<script setup lang="ts">

    withDefaults(
        defineProps<{
            color?: string
            weight?: number
        }>(),
        {
            color: 'currentColor',
            weight: 800,
        },
    )
</script>

<template>
     <div>
      
       <span
            class="logo"
            :style="{
            color : color ,
            fontWeight: weight,
            }"
            aria-label="KHARAN"
        >
          KHARAN
        </span>
     </div>
    
</template>

<style scoped>

    .logo {
        display: inline-block;
        font-family: 'Manrope', sans-serif;
        font-size: 32px ;
        line-height: 1;
        letter-spacing: -0.065em;
        white-space: nowrap;
        user-select: none;
    }

    @media screen and (max-width: 768px) {
        .logo {
            font-size: 24px;
        }
        
    }



    @media screen and (max-width: 480px) {
        .logo {
            font-size: 22px;
        }
        
    }

   

 
</style>
