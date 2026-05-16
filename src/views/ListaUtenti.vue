<template>
    <div class="users-container">
        <div class="container-title">
            <span>Lista Utenti</span>
        </div>

        <div class="users-actions">
            <button class="btn btn-success users-actions__button" type="button" @click="getUtenti">
                Aggiorna lista
            </button>
        </div>

        <div class="users-list">
            <div class="users-row users-row--header">
                <div>ID</div>
                <div>Nome</div>
                <div>Password</div>
                <div></div>
            </div>

            <form
                v-for="utente of utenti"
                :key="utente.id"
                class="users-row"
                @submit.prevent="salvaPassword(utente)"
            >
                <div>{{ utente.id }}</div>
                <div>{{ utente.nome }}</div>
                <div>
                    <input
                        v-model.trim="utente.nuovaPassword"
                        class="password-input"
                        type="text"
                        minlength="4"
                        placeholder="Nuova password"
                    />
                </div>
                <div class="users-row__action">
                    <button
                        class="btn btn-success users-row__button"
                        type="submit"
                        :disabled="utente.isSaving || !utente.nuovaPassword || utente.nuovaPassword.length < 4"
                    >
                        {{ utente.isSaving ? 'Salvo...' : 'Salva' }}
                    </button>
                </div>
            </form>

            <div v-if="!utenti.length && !isLoading" class="empty-state">
                Nessun utente trovato
            </div>
            <div v-if="isLoading" class="empty-state">
                Caricamento...
            </div>
        </div>
    </div>
    <ion-toast
        :is-open="openToast"
        :message="message"
        :duration="2000"
        @didDismiss="openToast = false"
    ></ion-toast>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {IonToast} from "@ionic/vue";
import Utenti from "@/services/Utenti";

type UtenteLista = {
    id: number,
    nome: string,
    pin: string | null,
    nuovaPassword: string,
    isSaving: boolean
}

const utenti = ref<UtenteLista[]>([])
const isLoading = ref(false)
const openToast = ref(false)
const message = ref('')

onMounted(async () => {
    await getUtenti()
})

const showToast = (text: string) => {
    message.value = text
    openToast.value = true
}

const getUtenti = async () => {
    isLoading.value = true
    const response = await Utenti.listaTuttiUtenti()
    isLoading.value = false

    if (!response.error) {
        utenti.value = response.data.map((utente: any) => ({
            ...utente,
            nuovaPassword: '',
            isSaving: false
        }))
    } else {
        showToast(response.msg)
    }
}

const salvaPassword = async (utente: UtenteLista) => {
    if (!utente.nuovaPassword || utente.nuovaPassword.length < 4 || utente.isSaving) {
        return
    }

    utente.isSaving = true
    const response = await Utenti.modificaPassword(utente.id, utente.nuovaPassword)
    utente.isSaving = false

    if (!response.error) {
        utente.pin = utente.nuovaPassword
        utente.nuovaPassword = ''
        showToast('Password aggiornata')
    } else {
        showToast(response.msg)
    }
}
</script>

<style scoped>
.users-container {
    min-height: 100%;
    background-color: #223344;
    color: #F6F1F4;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    overflow: scroll;
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

.users-actions {
    display: flex;
    justify-content: center;
    padding: 0 20px;
}

.users-actions__button {
    width: 90%;
}

.users-list {
    padding-bottom: 20px;
}

.users-row {
    display: grid;
    grid-template-columns: 70px minmax(0, 1fr) minmax(160px, 1.2fr) 110px;
    align-items: center;
    gap: 8px;
    border-top: 1px solid lightgray;
    padding: 8px 12px;
}

.users-row > div {
    min-width: 0;
}

.users-row--header {
    color: #cbd5df;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
}

.password-input {
    width: 100%;
    min-height: 42px;
    border: 1px solid lightgray;
    border-radius: 5px;
    background: #1f2d3a;
    color: #F6F1F4;
    padding: 0 10px;
    font-size: 16px;
}

.users-row__action {
    display: flex;
    justify-content: flex-end;
}

.users-row__button {
    width: 100%;
}

.empty-state {
    padding: 24px 12px;
    text-align: center;
    color: #cbd5df;
}

@media (max-width: 640px) {
    .users-row {
        grid-template-columns: 52px minmax(0, 1fr);
    }

    .users-row--header {
        display: none;
    }

    .users-row__action {
        grid-column: 1 / -1;
    }

    .users-row__button {
        width: 100%;
    }

    .users-row > div:nth-child(3) {
        grid-column: 1 / -1;
    }
}
</style>
