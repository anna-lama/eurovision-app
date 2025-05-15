<template>
    <div class="list_page">
        <div style="display: grid; grid-template-rows: auto 1fr; height: 100%">
            <div v-if="esibizioneInCorso" class="main-card inCorso">
                <div class="header">
                    <span class="title">{{ esibizioneInCorso.nazione }} </span>
                    <span>{{esibizioneInCorso.cantante}}</span>
                    <i>{{esibizioneInCorso.titolo}}</i>
                </div>
                <div>
                    <button class="btn btn-primary" @click="openModalFunction(esibizioneInCorso)">Inserisci Voti</button>
                </div>
            </div>
            <div style="overflow:scroll">
                <div class="card-list">
                    <div v-for="(record,index) of punteggi" class="card"
                         :style="{ gridTemplateRows : record.punteggi[0].totale && !record.inCorso ? '1fr auto' : '1fr'}"
                         @touchstart="startPress(record)"
                         @touchend="cancelPress"
                         :key="index">
                        <div class="card-header">
                            <div style="height: 100%; display: flex; align-items: start; font-size: 25px">
                                <span class="title" style="font-size: 29px">{{index+1}}.</span>
                            </div>
                            <div class="header">
                                <span class="title">{{ record.nazione }} </span>
                                <span>{{record.cantante}}</span>
                                <i>{{record.titolo}}</i>

                            </div>
                            <div v-if="record.inCorso">
                                <span >In corso</span>
                            </div>
                            <div v-else-if="record.punteggi[0].totale">
                                <div class="round">{{ record.punteggi[0].totale }}</div>
                            </div>
                        </div>
                        <category-points
                            v-if="record.punteggi[0].totale && !record.inCorso"
                            :punteggi="record.punteggi[0]"
                            style="padding: 15px 0 5px 0;"
                        ></category-points>
                </div>
            </div>
        </div>
    </div>
    </div>
    <modal v-if="esibizioneModal" :is-open="openModal" :esibizione="esibizioneModal" @close="closeModal"></modal>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import Modal from "@/components/modalPunteggi.vue";
import CategoryPoints from "@/components/category-points.vue";

const openModal = ref(false)
const pressTimer = ref<any>(0)
const punteggi = ref([])
const esibizioneInCorso = ref(null)
const esibizioneModal = ref(null)
// const mainStore = useMainStore()

onMounted( async()=>{
    await getList()
})
const getList = async () => {
    const user = await sessionStorage.getItem("user")
    if (user){
        const response = await Classifica.getClassificaHome(Number(user))
        if (!response.error) {
            punteggi.value = response.data
            esibizioneInCorso.value = punteggi.value.find(x => x.inCorso)
        }
    }
}
const closeModal = async () => {
    openModal.value = false
    await getList()
}
const openModalFunction = async (esibizione) => {
    esibizioneModal.value = esibizione
    openModal.value = true
}

function startPress(esibizione) {
    pressTimer.value = setTimeout(() => {
        openModalFunction(esibizione)
    }, 800) // durata in ms
}

function cancelPress() {
    clearTimeout(pressTimer.value)
}
</script>

<style scoped >
.main-card{
    background-color: #223344;
    border-radius: 3px;
    padding: 20px 15px ;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
}

.card{
    background-color: #223344;
    border-radius: 3px;
    padding: 10px;
    display: grid;
}

.card-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 8px;
    align-items: center;
}

.header {
    display: flex;
    flex-direction: column;
    column-gap: 10px;
}

.list_page{
    overflow: hidden;
    height: 100%;
}

.card-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
}


</style>
