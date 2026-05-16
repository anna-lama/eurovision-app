<template>
    <div class="admin-container">
        <div class="container-title">
            <span>Dashboard</span>
        </div>
        <div class="competition-actions">
            <button
                class="btn btn-success competition-actions__button"
                type="button"
                :aria-expanded="showCompetitionForm"
                @click="showCompetitionForm = !showCompetitionForm"
            >
                {{ showCompetitionForm ? 'Nascondi form' : 'Crea competizione' }}
            </button>
        </div>
        <form
            v-if="showCompetitionForm"
            class="competition-form"
            @submit.prevent="creaCompetizione"
        >
            <div class="competition-form__grid">
                <label>
                    Nome
                    <input
                        v-model.trim="nuovaCompetizione.nome"
                        class="competition-input"
                        type="text"
                        required
                    />
                </label>
                <label>
                    Anno
                    <input
                        v-model.number="nuovaCompetizione.anno"
                        class="competition-input"
                        type="number"
                        min="1900"
                        max="2100"
                        required
                    />
                </label>
                <label>
                    Città
                    <input
                        v-model.trim="nuovaCompetizione.citta"
                        class="competition-input"
                        type="text"
                    />
                </label>
                <label>
                    Paese ospitante
                    <input
                        v-model.trim="nuovaCompetizione.paeseOspitante"
                        class="competition-input"
                        type="text"
                    />
                </label>
            </div>
            <label class="competition-form__toggle">
                <input v-model="nuovaCompetizione.closed" type="checkbox" />
                Chiusa
            </label>
            <button
                class="btn btn-success competition-form__button"
                type="submit"
                :disabled="isCreatingCompetizione"
            >
                {{ isCreatingCompetizione ? 'Creazione...' : 'Conferma creazione' }}
            </button>
        </form>
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
            <div v-for="utente of utenti" :key="utente.id" class="table">
                <div class="flexbox">{{utente.id}}</div>
                <div class="flexbox">{{ utente.nome }}</div>
                <div class="flexbox">{{ utente.pin }}</div>
                <div class="flexbox">
                    <span :class="utente.allInserted ? 'status-ok' : 'status-ko'">
                        {{ utente.allInserted ? 'Completo' : 'Manca' }}
                    </span>
                </div>
                <label class="total-exclusion">
                    <input
                        type="checkbox"
                        :checked="utente.esclusoTotale"
                        :disabled="utente.isSavingEsclusione"
                        @change="toggleEsclusioneTotale(utente, $event)"
                    />
                    Escludi totale
                </label>
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
const isCreatingCompetizione = ref(false)
const showCompetitionForm = ref(false)
const nuovaCompetizione = ref({
    nome: '',
    anno: new Date().getFullYear(),
    citta: '',
    paeseOspitante: '',
    closed: false
})

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

const creaCompetizione = async () => {
    if (isCreatingCompetizione.value) {
        return
    }

    isCreatingCompetizione.value = true
    const response = await Competizioni.creaCompetizione({
        nome: nuovaCompetizione.value.nome,
        anno: Number(nuovaCompetizione.value.anno),
        citta: nuovaCompetizione.value.citta || null,
        paeseOspitante: nuovaCompetizione.value.paeseOspitante || null,
        closed: nuovaCompetizione.value.closed,
        abilitaTotale: false
    })
    isCreatingCompetizione.value = false

    if (!response.error) {
        competizioni.value = [response.data, ...competizioni.value]
        competizioneSelezionata.value = response.data.id
        nuovaCompetizione.value = {
            nome: '',
            anno: new Date().getFullYear(),
            citta: '',
            paeseOspitante: '',
            closed: false
        }
        setTotaleFromCompetizione()
        await refreshDatiCompetizione()
        showCompetitionForm.value = false
        errormsg.value = "Competizione creata"
    } else {
        errormsg.value = response.msg
    }
    openToast.value = true
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
        utenti.value = response.data.map((utente: any) => ({
            ...utente,
            isSavingEsclusione: false
        }))
    } else {
        errormsg.value = response.msg
        openToast.value = true
    }
}

const toggleEsclusioneTotale = async (utente: any, event: Event) => {
    if (!competizioneSelezionata.value || utente.isSavingEsclusione) {
        return
    }

    const input = event.target as HTMLInputElement
    const previousValue = Boolean(utente.esclusoTotale)
    const nextValue = input.checked

    utente.esclusoTotale = nextValue
    utente.isSavingEsclusione = true

    const response = await Utenti.modificaEsclusioneTotale(
        Number(competizioneSelezionata.value),
        Number(utente.id),
        nextValue
    )

    utente.isSavingEsclusione = false

    if (!response.error) {
        errormsg.value = nextValue ? "Utente escluso dal totale" : "Utente incluso nel totale"
    } else {
        utente.esclusoTotale = previousValue
        input.checked = previousValue
        errormsg.value = "Errore" + response.msg
    }

    openToast.value = true
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
    grid-template-columns: 1fr 2fr 2fr 1fr 1.5fr;
    border-top: 1px solid lightgray;

    > div {
        padding: 10px 5px;
    }
}

.total-exclusion {
    color: #F6F1F4;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 5px;
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

.competition-actions {
    display: flex;
    justify-content: center;
    padding: 0 20px;
}

.competition-actions__button {
    width: 90%;
}

.competition-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 20px;
    color: #F6F1F4;
}

.competition-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.competition-form__grid label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
}

.competition-input {
    min-height: 42px;
    border: 1px solid lightgray;
    border-radius: 5px;
    background: #1f2d3a;
    color: #F6F1F4;
    padding: 0 10px;
    font-size: 16px;
}

.competition-form__toggle {
    display: flex;
    align-items: center;
    gap: 8px;
}

.competition-form__button {
    align-self: center;
    width: 90%;
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

@media (max-width: 640px) {
    .competition-form__grid {
        grid-template-columns: 1fr;
    }
}

</style>
