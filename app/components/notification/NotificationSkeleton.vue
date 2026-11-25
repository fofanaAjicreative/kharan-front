<template>

    <v-list-item
      density="compact"
    >

        <template #prepend>
            <v-skeleton-loader
                type="avatar" />
        </template>

        <v-list-item-title>
            <v-skeleton-loader 
                type="text"
                width="45%" />
        </v-list-item-title>

        <v-list-item-subtitle>
            <v-skeleton-loader
                type="text"
                width="90%" />
        </v-list-item-subtitle>

        <template #append>
            <v-skeleton-loader
                type="text"
                width="45"  />
        </template>


    </v-list-item>

</template>