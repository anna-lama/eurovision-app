<template>
    <div class="admin-container">
        <div class="container-title">
            <span>Dashboard</span>
        </div>
        <div class="competition-filter">
            <label for="competizione-admin">Competizione</label>
            <select
                id="competizione-admin"
                v-model="competizioneSelezionata"
                class="competition-select"
                @change="onCompetizioneChange"
            >
                <option
                    v-for="competizione of competizioni"
                    :key="competizione.id"
                    :value="competizione.id"
                >
                    {{ competizione.nome }}
                </option>
            </select>
        </div>
        <div class="flexbox">
            <button class="btn btn-success"
                    style="width: 90%"
                    :disabled="!competizioneSelezionata"
                    @click="abilitaTotale"
            >{{ isAvailable ? 'Disabilita': 'Abilita' }} Totale </button>
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
                    <span :class="utente.allInserted ? 'status-ok' : 'status-ko'">
                        {{ utente.allInserted ? 'Completo' : 'Manca' }}
                    </span>
                </div>
            </div>

        </div>

    </div>
    <ion-toast :is-open="openToast" :message="errormsg" :duration="2000"></ion-toast>


</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Utenti from "@/services/Utenti";
import {IonToast} from "@ionic/vue";
import Classifica from "@/services/Classifica";
import Competizioni from "@/services/Competizioni";
const openToast = ref(false)
const errormsg = ref()
const isAvailable = ref(false)

const utenti = ref<any[]>([])
const competizioni = ref<any[]>([])
const competizioneSelezionata = ref<number | null>(null)

onMounted(async ()=> {
    await getCompetizioni()
})
const getCompetizioni = async () => {
    const response = await Competizioni.getCompetizioniAdmin()
    if (!response.error) {
        competizioni.value = response.data
        const competizioneSessione = JSON.parse(sessionStorage.getItem('competizione') || 'null')?.id
        const competizioneInSessione = competizioni.value.find((competizione) => competizione.id === competizioneSessione)
        const competizioneDefault = competizioneInSessione ?? competizioni.value[0]

        if (competizioneDefault) {
            competizioneSelezionata.value = competizioneDefault.id
            setTotaleFromCompetizione()
            await refreshDatiCompetizione()
        }
    } else {
        errormsg.value = response.msg
        openToast.value = true
    }
}

const onCompetizioneChange = async () => {
    setTotaleFromCompetizione()
    await refreshDatiCompetizione()
}

const refreshDatiCompetizione = async () => {
    await getUtenti()
}

const setTotaleFromCompetizione = () => {
    const competizione = competizioni.value.find((item) => item.id === Number(competizioneSelezionata.value))
    isAvailable.value = Boolean(competizione?.abilitaTotale)
}

const getUtenti = async () => {
    if (!competizioneSelezionata.value) {
        utenti.value = []
        return
    }
    const response = await Utenti.listaUtenti(Number(competizioneSelezionata.value))
    if (!response.error) {
        utenti.value = response.data
    } else {
        errormsg.value = response.msg
        openToast.value = true
    }
}

const abilitaTotale = async () => {
    if (!competizioneSelezionata.value) {
        return
    }
    const value = !isAvailable.value
    const response = await Classifica.abilitaTotale(Number(competizioneSelezionata.value), value)
    if (!response.error) {
        const competizione = competizioni.value.find((item) => item.id === Number(competizioneSelezionata.value))
        if (competizione) {
            competizione.abilitaTotale = value
        }
        isAvailable.value = value
        await refreshDatiCompetizione()
        errormsg.value = "Chiamata riuscita"
    } else {
        errormsg.value = "Errore"+response.msg
    }
    openToast.value = true
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

.competition-filter {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 20px;
}

.competition-select {
    min-height: 42px;
    border: 1px solid lightgray;
    border-radius: 5px;
    background: #1f2d3a;
    color: #F6F1F4;
    padding: 0 10px;
    font-size: 16px;
}

.status-ok {
    color: #32d74b;
    font-weight: 700;
}

.status-ko {
    color: #ff9f0a;
    font-weight: 700;
}

</style>
