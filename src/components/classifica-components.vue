<template>
    <div class="cards-wrapper" v-if="props.classifica.length > 0">
        <div v-for="(canzone, index) in classifica" :key="index" class="card">
            <div style="position: relative">
                <div class="number-container" :style="{backgroundColor: canzone.totale != 0 ? getColorClassifica(index) : '#354659'}">
                </div>
                <div class="posizione" :style="{ top : !canzone.totale ? '8px' : '-3px'}">
                    {{canzone.totale != 0 ? index+1+'°' : '-'}}
                </div>
            </div>
            <div style="padding: 5px 0;">
                <div class="header-card">
                    <div style="display: flex; align-items: center; gap: 10px; color: white; padding: 10px 15px;">
                        <span class="title">{{ canzone.esibizione.nazione }}</span>
                        <span v-if="index == 0" class="material-symbols-outlined" style="color: #FFD700">crown</span>

                    </div>
                    <div style="padding: 5px 15px; text-align: center">
                        <div
                            v-if="canzone.totale !== 0"
                            class="round" style="height: 45px; width: 45px">{{canzone.totale}}</div>
                    </div>

                </div>
                <category-points
                    v-if="canzone.totale !== 0"
                    style="color: white; padding: 5px 0;"
                    :punteggi="canzone"
                ></category-points>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import CategoryPoints from "@/components/category-points.vue";

const props = defineProps(['classifica'])

const getColorClassifica =( index) => {
    if (index === 0) {
        return "#efc800"
    } else if (index === 1) {
        return "#C0C0C0"
    } else if (index === 2) {
        return "#CD7F32"
    } else {
        return "#223344"
    }
}
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
