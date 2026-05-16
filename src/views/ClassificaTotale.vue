<template>
    <div v-if="isAvailable" class="classifica-container">
        <div class="container-title">
            <span>Classifica Totale</span>
        </div>
        <classifica-component-total v-if="classifica.length > 0" :classifica="classifica"></classifica-component-total>
        <div v-else class="no-data">Nessuna canzone in classifica.</div>
    </div>
    <div v-else class="volevi">
        <img src="../../public/zeb.gif" alt="GIF" />
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import ClassificaComponentTotal from "@/components/classifica-component-total.vue";

const isAvailable = ref(false)
const classifica = ref([])

onMounted(async ()=> {
    await getClassificaTotale()
})
const getClassificaTotale = async () => {
        const competizione = JSON.parse(await sessionStorage.getItem('competizione') || "null")
        if (!competizione) {
            isAvailable.value = false
            return
        }
        const response = await Classifica.getClassificaTotale(Number(competizione.id))
        if (!response.error) {
            classifica.value = response.data.classifica
            isAvailable.value = response.data.classifica.length > 0
        } else {
            console.log("Errore")

    }
}

</script>


<style scoped>
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
