<template>
    <div class="test">
        <div>
            <span class="material-symbols-outlined">music_note</span>
            <span>{{ props.punteggi.canzone }}</span>
        </div>
        <div>
            <span class="material-symbols-outlined">taunt</span>
            <span>{{ props.punteggi.coreografia }}</span>
        </div>
        <div>
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 3">theater_comedy</span>
            <span>{{ props.punteggi.scenografia }}</span>
        </div>
        <div>
            <span class="material-symbols-outlined">movie</span>
            <span>{{ props.punteggi.interpretazione }}</span>
        </div>
        <div>
            <span class="material-symbols-outlined">checkroom</span>
            <span>{{ props.punteggi.outfit }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['punteggi'])
</script>

<style lang="scss">
.test {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    justify-content: center;

    > div {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }
}
</style>
