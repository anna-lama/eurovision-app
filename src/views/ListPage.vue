<template>
    <div class="list_page" v-if="punteggi.length > 0">
        <div class="classifica-shell">
            <div v-if="esibizioneInCorso" class="main-card inCorso">
                <div class="main-card__header">
                    <div class="main-card__content">
                        <span class="main-card__title">{{ esibizioneInCorso.nazione }}</span>
                        <span class="main-card__artist">{{ esibizioneInCorso.cantante }}</span>
                        <i class="main-card__song">{{ esibizioneInCorso.titolo }}</i>
                    </div>
                    <div class="main-card__status">
                        <span class="main-card__eyebrow">In corso</span>
                    </div>
                </div>

                <div class="main-card__action">
                    <button class="btn btn-primary main-card__button" @click="openModalFunction(esibizioneInCorso)">Inserisci Voti</button>
                </div>
            </div>

            <div class="classifica-scroll" id="header">
                <div class="card-list">
                    <div v-for="(record,index) of punteggi" class="card-scaletta"
                         :class="{ 'card-scaletta--current': record.inCorso, 'card-scaletta--scored': record.punteggi[0].totale && !record.inCorso }"
                         :id="`scroll-card-${index}`"
                         @touchstart="startPress(record)"
                         @touchend="cancelPress"
                         :key="index">
                        <div class="card-header">
                            <div class="rank-badge">{{ index + 1 }}</div>
                            <div class="song-info">
                                <span class="song-info__country">{{ record.nazione }}</span>
                                <span class="song-info__artist">{{ record.cantante }}</span>
                                <i class="song-info__title">{{ record.titolo }}</i>
                            </div>
                            <div v-if="record.inCorso" class="status-pill">
                                In corso
                            </div>
                            <div v-else-if="record.punteggi[0].totale">
                                <div class="score-pill">{{ record.punteggi[0].totale }}</div>
                            </div>
                        </div>
                        <category-points
                            v-if="record.punteggi[0].totale && !record.inCorso"
                            :punteggi="record.punteggi[0]"
                            class="score-breakdown"
                        ></category-points>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="list_page">
        <div class="classifica-empty">
            La classifica non è stata inserita
        </div>
    </div>
    <modal v-if="esibizioneModal" :is-open="openModal" :esibizione="esibizioneModal" @close="closeModal"></modal>
    <ion-toast class="custom-toast" position="top" position-anchor="header"
               :is-open="openToast" :message="errormsg" :duration="20000000"></ion-toast>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import Classifica from "@/services/Classifica";
import Modal from "@/components/modalPunteggi.vue";
import CategoryPoints from "@/components/category-points.vue";
import {IonToast} from "@ionic/vue";

const openModal = ref(false)
const pressTimer = ref<any>(0)
const punteggi = ref<any[]>([])
const esibizioneInCorso = ref<any>(null)
const esibizioneModal = ref<any>(null)
const openToast = ref(false)
const errormsg = ref()
const competizione = ref()

onMounted( async()=>{
    await getList()
    scrollToAnchor()
})

const scrollToAnchor = () =>{
    const currentIndex = punteggi.value.findIndex((record) => record.inCorso)
    const targetIndex = currentIndex >= 0 && currentIndex < punteggi.value.length - 1 ? currentIndex + 1 : currentIndex
    const el = document.getElementById(`scroll-card-${targetIndex}`);

    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

const getList = async () => {
    const user = await sessionStorage.getItem("user")
    competizione.value = JSON.parse(sessionStorage.getItem("competizione") || "null")

    if (user && competizione.value){
        const response = await Classifica.getClassificaHome(Number(user), Number(competizione.value.id))
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
    scrollToAnchor()

}

const openModalFunction = async (esibizione: any) => {
    if(!competizione.value?.closed) {
        if(!esibizione.competizione?.abilitaTotale ) {
            esibizioneModal.value = esibizione
            openModal.value = true
        }
    } else {
        errormsg.value = "La modifica non è abilitata"
        openToast.value = true
    }
}

function startPress(esibizione: any) {
    pressTimer.value = setTimeout(() => {
        openModalFunction(esibizione)
    }, 800) // durata in ms
}

function cancelPress() {
    clearTimeout(pressTimer.value)
}

</script>

<style scoped>
.list_page {
    overflow: hidden;
    height: 100%;
}

.classifica-shell {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    height: 100%;
    gap: 14px;
    padding: 7px 0;
}

.main-card {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    min-height: 124px;
    border-top: 2px solid rgba(13, 168, 175, 0.62);
    border-bottom: 2px solid rgba(13, 168, 175, 0.62);
    background:
        linear-gradient(135deg, rgba(13, 168, 175, 0.18), rgba(240, 11, 140, 0.12)),
        linear-gradient(145deg, rgba(38, 59, 79, 0.98), rgba(29, 35, 48, 0.98));
    box-shadow:
        0 0 0 1px rgba(240, 11, 140, 0.24),
        0 0 18px rgba(13, 168, 175, 0.16),
        0 12px 28px rgba(0, 0, 0, 0.2);
}

.main-card__header {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 18px 16px;
}

.main-card__content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

.main-card__status {
    display: flex;
    align-items: center;
}

.main-card__eyebrow {
    width: fit-content;
    padding: 5px 9px;
    border: 1px solid rgba(13, 168, 175, 0.76);
    border-radius: 999px;
    background: rgba(13, 168, 175, 0.16);
    color: #8df7fb;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
}

.main-card__title {
    color: #ffffff;
    font-size: 29px;
    font-weight: 700;
    line-height: 1.08;
    overflow-wrap: anywhere;
}

.main-card__artist,
.main-card__song {
    color: rgba(246, 241, 244, 0.78);
    font-size: 17px;
    line-height: 1.25;
    overflow-wrap: anywhere;
}

.main-card__song {
    color: rgba(246, 241, 244, 0.68);
}

.main-card__action {
    padding-right: 16px;
}

.main-card__button {
    min-width: 148px;
    padding-inline: 12px;
}

.classifica-scroll {
    padding: 0 10px;
    min-height: 0;
    overflow: auto;
}

.card-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 2px 0 8px;
}

.card-scaletta {

    display: grid;
    grid-template-rows: 1fr;
    border: 1px solid rgba(13, 168, 175, 0.22);
    border-radius: 5px;
    background:
        linear-gradient(135deg, rgba(38, 59, 79, 0.98), rgba(34, 51, 68, 0.98)),
        #223344;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
    transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;

    &:active {
        border-color: rgba(240, 11, 140, 0.66);
        background:
            linear-gradient(135deg, rgba(31, 45, 58, 1), rgba(38, 59, 79, 1)),
            #1f2d3a;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
        transform: scale(0.985);
    }
}

.card-scaletta--current {
    border-color: rgba(240, 11, 140, 0.46);
}

.card-scaletta--scored {
    grid-template-rows: 1fr auto;
}

.card-header {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    column-gap: 10px;
    align-items: center;
    width: 100%;
    min-height: 92px;
    padding: 14px;
}

.rank-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(246, 241, 244, 0.16);
    border-radius: 999px;
    background: rgba(246, 241, 244, 0.08);
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    line-height: 1;
}

.song-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
}

.song-info__country {
    color: #F6F1F4;
    font-size: 23px;
    font-weight: 700;
    line-height: 1.15;
    overflow-wrap: anywhere;
}

.song-info__artist,
.song-info__title {
    color: rgba(246, 241, 244, 0.72);
    font-size: 16px;
    line-height: 1.25;
    overflow-wrap: anywhere;
}

.song-info__title {
    color: rgba(246, 241, 244, 0.62);
}

.status-pill,
.score-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    justify-self: end;
    white-space: nowrap;
}

.status-pill {
    padding: 6px 10px;
    border: 1px solid rgba(240, 11, 140, 0.76);
    border-radius: 999px;
    background: rgba(240, 11, 140, 0.14);
    color: #ffd7ed;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
}

.score-pill {
    min-width: 52px;
    height: 52px;
    padding: 0 11px;
    border: 1px solid rgba(13, 168, 175, 0.75);
    border-radius: 999px;
    background: rgba(13, 168, 175, 0.15);
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
    line-height: 1;
}

.score-breakdown {
    padding: 12px 8px;
    border-top: 1px solid rgba(246, 241, 244, 0.1);
    color: rgba(246, 241, 244, 0.78);
}

.score-breakdown :deep(.material-symbols-outlined) {
    color: #8df7fb;
    font-size: 22px;
}

.classifica-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    margin: 10px;
    padding: 24px;
    text-align: center;
    color: rgba(246, 241, 244, 0.82);
    border: 1px dashed rgba(13, 168, 175, 0.35);
    border-radius: 5px;
    background: rgba(34, 51, 68, 0.74);
}

@media (max-width: 560px) {
    .main-card {
        grid-template-columns: minmax(0, 1fr);
    }

    .main-card__action {
        padding: 0 16px 16px;
    }

    .main-card__button {
        width: 100%;
    }

    .card-header {
        grid-template-columns: 44px minmax(0, 1fr) auto;
        column-gap: 8px;
        padding: 12px;
    }

    .rank-badge {
        width: 40px;
        height: 40px;
        font-size: 18px;
    }

    .song-info__country {
        font-size: 20px;
    }

    .status-pill {
        padding: 5px 8px;
        font-size: 12px;
    }

    .score-pill {
        min-width: 46px;
        height: 46px;
        font-size: 19px;
    }

    .score-breakdown {
        margin-inline: 10px;
        overflow-x: auto;
    }
}

@media (min-width: 820px) {
    .classifica-shell {
        width: min(760px, 100%);
        margin: 0 auto;
        padding: 18px 0;
    }
}
</style>
