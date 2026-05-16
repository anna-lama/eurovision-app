<template>
    <transition name="slide-up">
        <div v-if="props.isOpen" class="modal-overlay" @click.self="close">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-title">Competizioni aperte</span>
                    <span class="modal-subtitle">Scegli una competizione a cui aggiungerti</span>
                </div>

                <div class="competizioni-list">
                    <div
                        v-for="competizione in competizioni"
                        :key="competizione.id"
                        class="competizione-row"
                        @click="openConfirm(competizione)"
                    >
                        <div class="competizione-row__accent"></div>
                        <div class="competizione-row__content">
                            <span class="competizione-row__title">{{ competizione.nome }}</span>
                            <span
                                v-if="competizione.citta || competizione.paeseOspitante"
                                class="competizione-row__meta"
                            >
                                {{ competizione.citta }}
                                <span v-if="competizione.citta && competizione.paeseOspitante"> - </span>
                                {{ competizione.paeseOspitante }}
                            </span>
                        </div>
                        <span class="competizione-row__status">Aperta</span>
                    </div>
                    <div v-if="competizioni.length === 0" class="empty-state">
                        Nessuna competizione aperta disponibile
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-error" @click="close">Chiudi</button>
                </div>

                <div v-if="selectedCompetizione" class="confirm-overlay" @click.self="closeConfirm">
                    <div class="confirm-modal">
                        <span class="confirm-title">
                            Vuoi registrarti a {{ selectedCompetizione.nome }}?
                        </span>
                        <span v-if="errorMessage" class="confirm-error">{{ errorMessage }}</span>

                        <div class="confirm-actions">
                            <button
                                class="btn btn-error"
                                :disabled="isRegistering"
                                @click="closeConfirm"
                            >
                                No
                            </button>
                            <button
                                class="btn btn-success"
                                :disabled="isRegistering"
                                @click="registerCompetizione"
                            >
                                {{ isRegistering ? "Registrazione..." : "Si" }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Competizioni from "@/services/Competizioni";

const props = defineProps(["isOpen", "userId"])
const competizioni = ref<any[]>([])
const selectedCompetizione = ref<any>(null)
const isRegistering = ref(false)
const errorMessage = ref("")
const emit = defineEmits(['close'])
const router = useRouter()

watch(() => props.isOpen, async (newVal) => {
    if (newVal) {
        const response = await Competizioni.getListaCompetizioniAperte()
        competizioni.value = response.error ? [] : response.data
    } else {
        closeConfirm()
    }
})

function close() {
    emit('close')
}

function openConfirm(competizione: any) {
    selectedCompetizione.value = competizione
    errorMessage.value = ""
}

function closeConfirm() {
    if (!isRegistering.value) {
        selectedCompetizione.value = null
        errorMessage.value = ""
    }
}

const registerCompetizione = async () => {
    const user = sessionStorage.getItem("user")

    if (!user || !selectedCompetizione.value) {
        errorMessage.value = "Utente o competizione non validi"
        return
    }

    isRegistering.value = true
    errorMessage.value = ""

    const response = await Competizioni.aggiungiCompetizione(
        Number(selectedCompetizione.value.id),
        Number(user)
    )

    isRegistering.value = false

    if (response.error) {
        errorMessage.value = response.msg || "Impossibile completare la registrazione"
        return
    }

    const competizioneId = selectedCompetizione.value.id

    sessionStorage.setItem("competizione", JSON.stringify(selectedCompetizione.value))
    emit('close')

    await router.push({
        name: "Competizione",
        params: {
            competizione: competizioneId
        }
    })
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
    background:
        linear-gradient(180deg, rgba(38, 59, 79, 0.98), rgba(31, 38, 52, 0.98)),
        #223344;
    width: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 20px;
    box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.28);
    animation: slideUp 0.3s ease-out forwards;
    max-height: 80vh;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    row-gap: 15px;
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


.modal-header {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.modal-title {
    color: #ffffff;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.15;
}

.modal-subtitle {
    color: rgba(246, 241, 244, 0.72);
    font-size: 14px;
    line-height: 1.35;
}

.competizioni-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow: auto;
    padding: 2px 2px 4px;
}

.competizione-row {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 5px minmax(0, 1fr) auto;
    min-height: 70px;
    border: 1px solid rgba(13, 168, 175, 0.24);
    border-radius: 8px;
    background:
        linear-gradient(135deg, rgba(34, 51, 68, 0.98), rgba(45, 54, 72, 0.98)),
        #223344;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}

.competizione-row:active {
    border-color: rgba(240, 11, 140, 0.74);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.22);
    transform: scale(0.985);
}

.competizione-row__accent {
    background: linear-gradient(180deg, #0da8af, #f00b8c);
}

.competizione-row__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    min-width: 0;
    padding: 12px 13px;
}

.competizione-row__title {
    color: #f6f1f4;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
    overflow-wrap: anywhere;
}

.competizione-row__meta {
    color: rgba(246, 241, 244, 0.68);
    font-size: 13px;
    line-height: 1.3;
    overflow-wrap: anywhere;
}

.competizione-row__status {
    align-self: center;
    justify-self: end;
    margin-right: 10px;
    padding: 5px 9px;
    border: 1px solid rgba(13, 168, 175, 0.75);
    border-radius: 999px;
    background: rgba(13, 168, 175, 0.18);
    color: #8df7fb;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 96px;
    border: 1px dashed rgba(246, 241, 244, 0.24);
    border-radius: 8px;
    color: rgba(246, 241, 244, 0.76);
    font-size: 14px;
    text-align: center;
}

.modal-actions {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
}

.confirm-overlay {
    position: fixed;
    inset: 0;
    z-index: 110;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.5);
}

.confirm-modal {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: min(100%, 340px);
    padding: 18px;
    border: 1px solid rgba(13, 168, 175, 0.34);
    border-radius: 8px;
    background:
        linear-gradient(135deg, rgba(38, 59, 79, 0.98), rgba(31, 38, 52, 0.98)),
        #223344;
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.38);
}

.confirm-title {
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
}

.confirm-text {
    color: rgba(246, 241, 244, 0.78);
    font-size: 14px;
    line-height: 1.4;
}

.confirm-error {
    color: #ffb3b3;
    font-size: 13px;
    line-height: 1.35;
}

.confirm-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}
</style>
