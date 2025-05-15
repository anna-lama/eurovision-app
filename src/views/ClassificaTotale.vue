<template>
    <div v-if="isAvailable" class="classifica-container">
        <div class="container-title">
            <span>Classifica Totale</span>
        </div>
        <div class="cards-wrapper" v-if="classifica.length > 0">
            <div v-for="(canzone, index) in classifica" :key="index" class="card">
                <div style="position: relative">
                    <div class="number-container" :style="{backgroundColor: canzone.totale != 0 ? getColorClassifica(index) : '#354659'}">
                    </div>
                    <div class="posizione">
                        {{canzone.totale != 0 ? index+1+'°' : '_'}}
                    </div>
                </div>
                <div style="padding: 5px 0;">
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
    <div v-else class="volevi">
        <img src="../../public/zeb.gif" alt="GIF" />
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import CategoryPoints from "@/components/category-points.vue";

const isAvailable = ref(false)
const classifica = ref([])

onMounted(async ()=> {
    await getClassificaTotale()
})
const getClassificaTotale = async () => {
        const response = await Classifica.getClassificaTotale()
        if (!response.error) {
            if (response.data.votanti == 0){
                isAvailable.value = false
            } else {
                isAvailable.value = true
                classifica.value = response.data.classifica
                console.log(isAvailable.value, response.data)
            }
        } else {
            console.log("Errore")

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
</style>
