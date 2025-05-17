<template>
    <div class="list_page" v-if="punteggi.length>0">
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
            <div style="overflow:scroll" id="header">
                <div class="card-list">
                    <div v-for="(record,index) of punteggi" class="card-scaletta"
                         :id="record.inCorso ? 'current-card' : 'not-current' "
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
    <div v-else style="height : 100%; display: flex; align-items: center; justify-content: center">
        La classifica non è stata inserita
    </div>
    <modal v-if="esibizioneModal" :is-open="openModal" :esibizione="esibizioneModal" @close="closeModal"></modal>
    <ion-toast class="custom-toast" position="top" position-anchor="header"
               :is-open="openToast" :message="errormsg" :duration="2000"></ion-toast>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import Modal from "@/components/modalPunteggi.vue";
import CategoryPoints from "@/components/category-points.vue";
import {IonToast} from "@ionic/vue";

const openModal = ref(false)
const pressTimer = ref<any>(0)
const punteggi = ref([])
const esibizioneInCorso = ref({})
const esibizioneModal = ref(null)
const openToast = ref(false)
const errormsg = ref()

onMounted( async()=>{
    await getList()
    scrollToAnchor()
})

const scrollToAnchor = () =>{
    const el = document.getElementById(`current-card`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

const getList = async () => {
    const user = await sessionStorage.getItem("user")
    if (user){
        const response = await Classifica.getClassificaHome(Number(user))
        if (!response.error) {
            punteggi.value = response.data
            esibizioneInCorso.value = punteggi.value.find(x => x.inCorso)
        } else {
            errormsg.value = response.msg
            openToast.value = true
        }
    }
}
const closeModal = async () => {
    openModal.value = false
    await getList()
}
const openModalFunction = async (esibizione) => {
    if(await getClassificaTotale()){
        esibizioneModal.value = esibizione
        openModal.value = true
    }
}

function startPress(esibizione) {
    pressTimer.value = setTimeout(() => {
        openModalFunction(esibizione)
    }, 800) // durata in ms
}

function cancelPress() {
    clearTimeout(pressTimer.value)
}

const getClassificaTotale = async () => {
    const response = await Classifica.getClassificaTotale()
    if (!response.error) {
        return response.data.votanti === 100;
    } else {
        console.log("Errore")
    }
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

.card-scaletta{
    background-color: #223344;
    border-radius: 3px;
    padding: 10px;
    display: grid;
    transition: transform ease 0.8s;

    &:active {
        background-color: #1f2d3a;
        transform: scale(0.98);

    }
}

.card-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 8px;
    align-items: center;
    width: 100%;
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
