
<script setup lang="ts">

  const props = defineProps({
    text: {
      type: String,
      default: "Button"
    },
    color: {
      type: String,
      default: "primaire" // primaire | secondaire 
    },
    size: {
      type: String,
      default: "default" // small | default | large
    }
  })

/* mapping tailles */
const sizes :any= {
  small: {
    padding: "4px 6px 4px 12px",
    icon: 24,
    font: "12px"
  },
  default: {
    padding: "10px 8px 10px 16px",
    icon: 32,
    font: "15px"
  },
  large: {
    padding: "22px 8px 22px 16px",
    icon: 40,
    font: "17px"
  }
}

const currentSize = sizes[props.size] || sizes.default

</script>

<template>
  <v-btn 
       class="cta-btn"  
       :class="`btn-${color}`"
        :style="{
          padding: currentSize.padding,
          fontSize: currentSize.font
        }"
        :size="props.size"
       elevation="0">

    <span class="cta-btn-text" > {{ text }}</span>

    <span 
      :style="{
        width: currentSize.icon + 'px',
        height: currentSize.icon - 4 + 'px'
      }"
      class="icon-box">
      <v-icon :size="currentSize.icon / 2" > mdi-arrow-right </v-icon>
    </span>

  </v-btn>
</template>

<style lang="scss" scoped>

.cta-btn {
  text-transform: none;
  // border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
 }

  .cta-btn-text{
    margin-right: 10px ;
  }

/* carré orange */
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

}


/* couleurs */
.btn-primaire{
  background-color: $secondary-color;
  color: #fff;
  .icon-box {
    background-color: #FFF;
    color: #1a1a1a;
  }

} 

.btn-secondaire{
  background-color: #1a1a1a;
  color: #fff;
  .icon-box {
    background-color: $secondary-color;
    color: #1a1a1a;
  }
}

/* hover clean */
/* .cta-btn:hover {
  background-color: #1a1a1a;
  
}

.cta-btn:hover .icon-box {
  background-color: #fff
} */
</style>