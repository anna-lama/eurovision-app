<template>
    <div class="admin-container">
        <div class="container-title">
            <span>Dashboard</span>
        </div>
        <div class="flexbox">
            <button class="btn btn-success" style="width: 90%">Abilita Totale</button>
        </div>

        <div>
            <div class="container-title" style="font-size: 20px">
                <span>Lista Utenti</span>
            </div>
            <div v-for="utente of utenti" :key="utente.index" class="table">
                <div>{{utente.id}}</div>
                <div>{{ utente.nome }}</div>
                <div>{{ utente.pin }}</div>
                <div class="flexbox">
                    <ion-checkbox v-model="utente.allInserted" @ionChange="modificaUtente(utente)"></ion-checkbox>
                </div>
            </div>

        </div>

    </div>
    <ion-toast :is-open="openToast" :message="errormsg" :duration="2000"></ion-toast>


</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Utenti from "@/services/Utenti";
import {IonToast, IonCheckbox} from "@ionic/vue";
const openToast = ref(false)
const errormsg = ref()

const utenti = ref([])

onMounted(async ()=> {
    await getUtenti()
})
const getUtenti = async () => {
    const response = await Utenti.listaUtenti()
    if (!response.error) {
        utenti.value = response.data
    } else {
        errormsg.value = response.msg
        openToast.value = true
    }
}

const modificaUtente = async (utente)=> {
    const response = await Utenti.modificaUtente(utente.id, utente.allInserted)
    if (!response.error) {
        errormsg.value = response.msg
        openToast.value = true
    }
}
</script>


<style scoped>
/*
$primary       : #0da8af;
$secondary     : #F00B8C;
*/
.admin-container{
    height: 100%;
    background-color: #223344;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
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

.table{
    display: grid;
    grid-template-columns: 1fr 2fr 2fr 1fr;
    border-top: 1px solid lightgray;

    > div {
        padding: 10px 5px;
    }
}

.flexbox {
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>
