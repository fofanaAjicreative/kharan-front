<script setup lang="ts">

 /* -----------------------------propos ------------------------------------------------ */

    const props = defineProps({
        status:{
            type: String,
            required:true
        }
    }) ;
   

</script>

<template>

           <v-chip
                size="small"
                :color="
                     status === 'waiting' ? 'orange'
                    : status === 'approved'  ? 'info'
                    : status === 'rejected' ? 'error'
                    : status === 'canceled' ? 'warning'
                    : status === 'completed' ? 'success'
                    : 'primary'
                "
                variant="tonal"
                class="status-chip"
            >

                <template #prepend>

                    <v-icon
                        v-if="status === 'waiting'"
                        size="15"
                    >
                        mdi-clock-outline
                    </v-icon>

                    <v-icon
                        v-else-if="status === 'approved'"
                        size="15"
                    >
                        mdi-check-circle-outline
                    </v-icon>

                    <v-icon
                        v-else-if="status === 'rejected'"
                        size="15"
                    >
                        mdi-close-circle-outline
                    </v-icon>

                    <v-icon
                        v-else-if="status === 'canceled'"
                        size="15"
                    >
                        mdi-cancel
                    </v-icon>

                    <v-icon
                        v-else-if="status === 'completed'"
                        size="15"
                    >
                        mdi-check-all
                    </v-icon>

                </template>


                <span v-if="status === 'waiting'">
                    En attente 
                </span>

                <span v-else-if="status === 'approved'">
                    Approuvée
                </span>

                <span v-else-if="status === 'rejected'">
                    Rejetée
                </span>

                <span v-else-if="status === 'canceled'">
                    Annulée
                </span>

                <span v-else-if="status === 'completed'">
                    Terminée
                </span>

            </v-chip>

</template>

<style scoped lang="scss">


  
</style>