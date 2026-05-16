<template>
    <classifica-ranking :classifica="props.classifica" variant="personal"></classifica-ranking>
</template>

<script setup lang="ts">
import ClassificaRanking from "@/components/classifica-ranking.vue";

const props = defineProps<{
    classifica: any[]
}>()
</script>
