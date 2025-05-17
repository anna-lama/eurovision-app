<template>
    <transition name="slide-up">
        <div v-if="props.isOpen" class="modal-overlay" @click.self="close">
            <div class="modal-content">
                <div style="height: 100%; overflow: scroll">
                    <div v-for="(item, index) in categories" :key="index" style="padding: 10px 0; border-bottom: 1px solid grey">
                        <div class="category-title">
                            <span>{{ item.label }}</span>
                            <span class="material-symbols-outlined">{{ item.icon }}</span>
                        </div>
                        <div class="numbers">
                            <div
                                v-for="i in 11"
                                :key="i"
                                @click="setRating(item.key, i - 1)"
                                class="rate"
                                :class="{ clicked : rating[item.key] === (i - 1) }">
                                {{ i - 1 }}
                            </div>
                        </div>
                    </div>

                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 5px; width: 100%">
                    <button class="btn btn-error"
                            @click="close">Annulla</button>
                    <button class="btn btn-success"
                            :disabled="!Object.values(rating).every(val => typeof val === 'number')"
                            :class="{ disabled: !Object.values(rating).every(val => typeof val === 'number')}"
                            @click="inserisciPunteggio">Conferma Punteggio</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import {defineProps, defineEmits, reactive, onUnmounted, watch, ref} from 'vue'
import Punteggio from "@/services/Punteggio.ts";
const props = defineProps(["isOpen", "esibizione"])

const emit = defineEmits(['close'])

// Array dinamico con label e chiave
const categories = [
    { label: 'Canzone', key: 'canzone', icon:'music_note' },
    { label: 'Coreografia', key: 'coreografia', icon:'taunt' },
    { label: 'Scenografia', key: 'scenografia', icon: 'theater_comedy' },
    { label: 'Interpretazione', key: 'interpretazione', icon: 'movie' },
    { label: 'Outfit', key: 'outfit', icon: 'checkroom' }
]
let rating = ref({
    canzone: null,
    coreografia: null,
    scenografia: null,
    interpretazione: null,
    outfit: null
})

watch(() => props.esibizione, (newVal) => {
    if (newVal && newVal.punteggi && newVal.punteggi[0]) {
        rating.value.canzone=newVal.punteggi[0].canzone
        rating.value.coreografia= newVal.punteggi[0].coreografia
        rating.value.scenografia= newVal.punteggi[0].scenografia
        rating.value.interpretazione= newVal.punteggi[0].interpretazione
        rating.value.outfit= newVal.punteggi[0].outfit
    }
}, { immediate: true });


// Funzione per aggiornare il voto
function setRating(categoryKey, value) {
    rating.value[categoryKey] = value
}
function close() {
    rating.value = {
        canzone: null,
        coreografia: null,
        scenografia: null,
        interpretazione: null,
        outfit: null
    }
    emit('close')
}

const inserisciPunteggio = async () => {
    if(Object.values(rating.value).every(val => typeof val === 'number')){
        const idUtente = sessionStorage.getItem('user')
        const body = {
            ...rating.value,
            utente: idUtente,
            esibizione: props.esibizione.id
        }
        const response = await Punteggio.aggiungiPunteggio(body)
        if (!response.error){
            close()
        }
    }
}
</script>

<style scoped>
/* Overlay dark background */
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 100;
}

/* Modal content */
.modal-content {
    background-color: #4f4848;
    width: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 20px;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease-out forwards;
    max-height: 80vh;
    overflow: hidden;
    display: grid; grid-template-rows: 1fr auto; row-gap: 15px;
}

/* Close button */
.close-button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #e53935;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
}

/* Animation keyframes */
@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Transition for v-if */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: opacity 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
}


.numbers{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 20px 0 20px;
    justify-content: center;
    column-gap: 15px;
    row-gap: 8px;
    margin: 0;
    width: 100%
}

.rate {
    width: 38px;
    height: 38px;
    line-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    color: #0da8af;
    border: 2px solid #0da8af;
    border-radius: 16px;
    background-color: #595959;

    &.clicked {
        background-color: #0da8af;
        color: #fff;

    }
}

.category-title {
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:20px
}
</style>
