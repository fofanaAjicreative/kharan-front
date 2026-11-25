<script setup>


    const menuItems = [
        {
            title: 'Accueil',
            to: '/',
            icon: 'mdi-home',
        },
        {
            title: 'À propos',
            to: '/about',
            icon: 'mdi-information',
        },
        {
            title: 'Contact',
            to: '/contact',
            icon: 'mdi-email',
        }
    ]

</script>

<template>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      class="d-md-none" >

      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
          @click="drawer = false"
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>

          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>