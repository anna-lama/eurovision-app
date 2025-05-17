<template>
    <div v-if="isAvailable" class="classifica-container">
        <div class="container-title">
            <span>Classifica Totale</span>
        </div>
        <classifica-components v-if="classifica.length > 0" :classifica="classifica"></classifica-components>
        <div v-else class="no-data">Nessuna canzone in classifica.</div>
    </div>
    <div v-else class="volevi">
        <img src="../../public/zeb.gif" alt="GIF" />
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import ClassificaComponents from "@/components/classifica-components.vue";

const isAvailable = ref(false)
const classifica = ref([])

onMounted(async ()=> {
    await getClassificaTotale()
})
const getClassificaTotale = async () => {
        const response = await Classifica.getClassificaTotale()
        if (!response.error) {
            if (response.data.votanti == 100){
                isAvailable.value = false
            } else {
                isAvailable.value = true
                classifica.value = response.data.classifica
            }
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
