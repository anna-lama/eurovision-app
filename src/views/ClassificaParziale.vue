<template>
    <div class="classifica-container">
        <div class="container-title">
            <span>La tua classifica</span>
        </div>
        <div class="cards-wrapper" v-if="classifica.length > 0">
            <div v-for="(canzone, index) in classifica" :key="index" class="card">
                <div style="position: relative">
                    <div class="number-container" :style="{backgroundColor: canzone.totale != 0 ? getColorClassifica(index) : '#354659'}">
                    </div>
                    <div class="posizione">
                        {{canzone.totale != 0 ? index+1 : '-'}}
                    </div>
                </div>
                <div class="body-card">
                    <div class="header-card">
                        <div style="display: flex; align-items: center; gap: 10px; color: white; padding: 10px 15px;">
                            <span class="title">{{ canzone.esibizione.nazione }} </span>
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
        <div v-else class="no-data">Nessuna canzone in classifica.</div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import CategoryPoints from "@/components/category-points.vue";

const classifica = ref([])

onMounted(async ()=> {
    await getClassificaParziale()
})
const getClassificaParziale = async () => {
    const idUtente = await sessionStorage.getItem('user')
    if (idUtente) {
        const response = await Classifica.getClassificaParziale(Number(idUtente))
        if (!response.error) {
            classifica.value = response.data
        } else {
            console.log("Errore")
        }
    }
}

const getColorClassifica =( index) => {
    if (index === 0) {
        return "#FFD700"
    } else if (index === 1) {
        return "#C0C0C0"
    } else if (index === 2) {
        return "#CD7F32"
    } else {
        return "#223344"
    }
}

</script>


<style scoped>
/*
$primary       : #0da8af;
$secondary     : #F00B8C;
*/

.classifica-container {
    /*background: linear-gradient(135deg, #0da8af, #F00B8C);*/
    /*opacity: 0.6;*/
    background-color: #354659;
    font-family: 'Inter', sans-serif;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
}

.container-title {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    > span {
        color: #F6F1F4;
        text-align: center;
        font-size: 32px;
        font-weight: 600;
    }
}

.cards-wrapper {
    z-index: 1;
    display: flex;
    flex-direction: column;
    overflow: scroll;
}

.card {
    background: #223344;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 20px;
    border-top: 1px solid #354659;
}

.number-container{
    font-size: 70px;
    font-weight: bolder;
    color: #F6F1F4;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    margin-left: -18px;
    transform: skew(-12deg);
    height: 100%;
}
.posizione{
    font-size: 70px;
    font-weight: bolder;
    font-family: 'Oswald', sans-serif;
    color: #F6F1F4;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    position: absolute;
    z-index: 3;
    top: 0;
    width: 100%;
    height: 100%;
}

.header-card {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
}

.no-data {
    text-align: center;
    color: #6b7280;
    font-style: italic;
    margin-top: 2rem;
}
</style>
