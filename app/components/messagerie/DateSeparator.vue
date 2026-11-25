<script setup lang="ts">

    defineProps<{
        label: string
    }>()

</script>

<template>

<div class="separator">

    <v-chip
        color="grey-lighten-3"
        variant="flat"
        rounded="pill"
        size="small"
        class="px-4" >

        {{ label }}

    </v-chip>

</div>

</template>

<style scoped>

        .separator{
            display:flex;
            justify-content:center;
            margin:20px 0;
        }
</style>