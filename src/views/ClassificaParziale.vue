<template>
    <div class="classifica-container">
        <div class="container-title">
            <span>La tua classifica</span>
        </div>
        <classifica-components v-if="classifica.length > 0" :classifica="classifica"></classifica-components>
        <div v-else class="no-data">Nessuna canzone in classifica.</div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import ClassificaComponents from "@/components/classifica-components.vue";

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
