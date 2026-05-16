<template>
    <div class="list_page">
        <div class="competizioni-shell">

            <div class="competizioni-hero">
                <div class="competizioni-hero__content">
                    <span class="competizioni-hero__title">Le tue competizioni</span>
                    <span class="competizioni-hero__subtitle">Seleziona una competizione per iniziare a votare</span>
                </div>
            </div>

            <div v-if="competizioni.length > 0" class="competizioni-scroll">
                <div class="competizioni-list">
                    <div
                        v-for="competizione of competizioni"
                        :key="competizione.id"
                        class="competizione-card"
                        @click="openCompetizione(competizione)"
                    >
                        <div class="competizione-card__accent"></div>
                        <div class="competizione-card__content">
                            <span class="competizione-card__title">{{ competizione.nome }}</span>
                            <i
                                v-if="competizione.citta || competizione.paeseOspitante"
                                class="competizione-card__meta"
                            >
                                <span v-if="competizione.citta || competizione.paeseOspitante">
                                    {{ competizione.citta }}
                                    <span v-if="competizione.citta && competizione.paeseOspitante"> - </span>
                                    {{ competizione.paeseOspitante }}
                                </span>
                            </i>
                        </div>
                        <div
                            class="competizione-card__status"
                            :class="{ 'competizione-card__status--open': competizione.closed }"
                        >
                            {{ competizione.closed ? "Chiusa" : "Aperta" }}
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="competizioni-empty"
            >
                Non sei ancora registrato a nessuna competizione
            </div>

            <div class="competizioni-actions">
                <button class="btn btn-primary competizioni-actions__button" @click="openModalFunction()">
                    Aggiungi competizione
                </button>
            </div>
        </div>
    </div>
    <modal-competizioni :isOpen="openModal" @close="closeModal"></modal-competizioni>

    <ion-toast
        class="custom-toast"
        position="top"
        :is-open="openToast"
        :message="errormsg"
        :duration="2000"
        @didDismiss="openToast = false"
    ></ion-toast>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { IonToast } from "@ionic/vue";
import Competizioni from "@/services/Competizioni";
import ModalCompetizioni from "@/components/modal-competizioni.vue";

const router = useRouter();

const competizioni = ref<any[]>([]);
const openToast = ref(false);
const errormsg = ref("");
const openModal = ref(false);

onMounted(async () => {
    await getCompetizioniUtente();
});

const getCompetizioniUtente = async () => {
    const user = sessionStorage.getItem("user");

    if (!user) {
        errormsg.value = "Utente non trovato";
        openToast.value = true;
        return;
    }

    const response = await Competizioni.getCompetizioniUtente(Number(user));

    if (!response.error) {
        competizioni.value = response.data;
    } else {
        errormsg.value = response.msg;
        openToast.value = true;
    }
};

const openCompetizione = async (competizione: any) => {
    sessionStorage.setItem("competizione", JSON.stringify(competizione));

    await router.push({
        name: "Competizione",
        params: {
            competizione: competizione.id
        }
    });
};

const closeModal = async () => {
    openModal.value = false
    await getCompetizioniUtente()
}
const openModalFunction = async () => {
    openModal.value = true
}
</script>

<style scoped>
.list_page {
    overflow: hidden;
    height: 100%;
}

.competizioni-shell {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    padding: 10px;
    gap: 12px;
}

.competizioni-hero {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(13, 168, 175, 0.35);
    border-radius: 5px;
    background:
        linear-gradient(135deg, rgba(13, 168, 175, 0.34), rgba(247, 30, 153, 0.2)),
        linear-gradient(145deg, rgba(34, 51, 68, 0.96), rgba(29, 35, 48, 0.96));
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
}

.competizioni-hero::after {
    content: "";
    position: absolute;
    right: -42px;
    top: -54px;
    width: 130px;
    height: 130px;
    border: 1px solid rgba(246, 241, 244, 0.14);
    border-radius: 50%;
    background: rgba(234, 92, 173, 0.14);
}

.competizioni-hero__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px 16px;
}

.competizioni-hero__title {
    color: #ffffff;
    font-size: 30px;
    font-weight: 700;
    line-height: 1.05;
}

.competizioni-hero__subtitle {
    color: rgba(246, 241, 244, 0.78);
    font-size: 16px;
    line-height: 1.35;
}

.competizioni-scroll {
    overflow: auto;
}

.competizioni-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 2px 0 8px;
}

.competizione-card {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 5px minmax(0, 1fr) auto;
    column-gap: 0;
    min-height: 76px;
    border: 1px solid rgba(13, 168, 175, 0.24);
    border-radius: 5px;
    background:
        linear-gradient(135deg, rgba(38, 59, 79, 0.98), rgba(34, 51, 68, 0.98)),
        #223344;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.14);
    transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}

.competizione-card:active {
    border-color: rgba(240, 11, 140, 0.74);
    background:
        linear-gradient(135deg, rgba(31, 45, 58, 1), rgba(38, 59, 79, 1)),
        #1f2d3a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transform: scale(0.985);
}

.competizione-card__accent {
    background: linear-gradient(180deg, #0da8af, #F00B8C);
}

.competizione-card__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 7px;
    min-width: 0;
    padding: 13px 14px;
}

.competizione-card__title {
    color: #F6F1F4;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.15;
    overflow-wrap: anywhere;
}

.competizione-card__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: rgba(246, 241, 244, 0.72);
    font-size: 14px;
    line-height: 1.3;
}

.competizione-card__status {
    align-self: center;
    justify-self: end;
    margin-right: 12px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(13, 168, 175, 0.18);
    border: 1px solid rgba(13, 168, 175, 0.75);
    color: #F6F1F4;
    font-size: 13px;
    font-style: normal;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
}

.competizione-card__status--open {
    background: rgba(240, 11, 140, 0.18);
    border-color: rgba(240, 11, 140, 0.78);
}

.competizioni-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 24px;
    text-align: center;
    color: rgba(246, 241, 244, 0.82);
    border: 1px dashed rgba(13, 168, 175, 0.35);
    border-radius: 5px;
    background: rgba(34, 51, 68, 0.74);
}

.competizioni-actions {
    padding-top: 2px;
}

.competizioni-actions__button {
    width: 100%;
}

@media (min-width: 820px) {
    .competizioni-shell {
        width: min(760px, 100%);
        margin: 0 auto;
        padding: 18px 0;
    }
}
</style>
