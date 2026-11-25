<template>
    <div> 
        class="no_data text-center"  >
        
        <!-- <v-btn color="#eee" variant="flat" icon="mdi-server-outline" size="x-large"></v-btn> -->

        <v-avatar
        size="90"
        color="#eee"
        variant="flat" >
        <v-icon
            icon="mdi-server-outline"
            size="40"
            color="#000"
        />
        </v-avatar>
        <h2 class="title"> Aucune annonce </h2>

        <p class="description"> 
        Le lorem ipsum est, en imprimerie, 
        une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page.
        </p>

        <p class="mt-10">
        <v-btn 
            to="/espace-coach/annonce/add" 
            variant="flat" color="secondary" >
            Créer mon annonce </v-btn>
        </p>
    </div>
</template>