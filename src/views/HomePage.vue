<template>
    <div class="login">
        <div class="form-container">
            <div style="display: flex; justify-content: center">
                <span style="font-size: large">Inserisci un nome e un pin di 4 cifre</span>
            </div>
            <div style="position: relative">
                <input id="username"
                       style="left: 0; position: relative; border: 2px solid rgb(11,227,240)"
                       placeholder="Username" v-model="user.username" type="text" class="input" />
                <label for="username" class="labelInput" >Username</label>
            </div>
            <div style="position: relative;">
                <input id="password" placeholder="PIN"  style="border: 2px solid rgb(240,11,140)"
                       v-model="user.pin" :type="!showPassword? 'password' : 'text'" class="input"/>
                <label for="password" class="labelInput" >PIN</label>
            </div>
            <div class="actions">
                <button class="btn btn-primary" @click="registrati">REGISTRATI</button>
                <button class="btn btn-secondary" @click="login">LOGIN</button>

            </div>
        </div>
    </div>

    <ion-toast :is-open="openToast" :message="errormsg" :duration="2000"></ion-toast>

</template>

<script setup lang="ts">
import { IonToast } from '@ionic/vue';

import {reactive, ref} from "vue";
import Utenti from "@/services/Utenti";
import router from "@/router";
import {useMainStore} from "@/store/mainStore";
const openToast = ref(false)
const errormsg = ref()
const user = reactive<any>({
    username: null,
    pin: null
})
const showPassword = ref()
const mainStore = useMainStore()
const registrati = async () => {
    const isValid = checkCampi()
    if (isValid){
        let response
        try {
            response = await Utenti.aggiungiUtente(user.username,user.pin)
            if (!response.error) {
                await sessionStorage.setItem("user", response.data.id)
                await mainStore.setUserLogged(response.data)
                await router.push('/')
            } else {
                errormsg.value = response.msg
                openToast.value = true
            }
        } catch (error) {
            errormsg.value = response.msg
            openToast.value = true
        }
    }


}

const login = async () => {
    const isValid = checkCampi()
    if (isValid){
        let response
        try {
            response = await Utenti.login(user.username, user.pin)
            if (!response.error) {
                await sessionStorage.setItem("user", response.data.id)
                await mainStore.setUserLogged(response.data)
                await router.push('/')
            } else {
                errormsg.value = response.msg
                openToast.value = true
            }
        } catch (error) {
            errormsg.value = response.msg
            openToast.value = true
        }
    }
}

const checkCampi = () => {
    openToast.value = false
    errormsg.value = ""

    if (!user.username || !user.pin){
        errormsg.value = "Compila tutti i campi, grazie"
        openToast.value = true
        return false
    }
    if (user.pin.length < 4){
        errormsg.value = "La password è troppo corta"
        openToast.value = true
        return false
    }
    return true
}
</script>

<style scoped>

.input {
    background-color: transparent;
    border: 1px solid gray;
    border-radius: 5px;
    font-size: x-large;
    color: white;
    padding: 0;
    padding-top: 8px;
    margin: 0;
    width: 100%;
    height: 50px;
}

.input:focus-visible{
    border-bottom: 1px solid gray;
    outline: none;
}
.input::placeholder{
    color: transparent;
}
.labelInput {
    position: absolute;
    font-weight: normal;
    left: 5px;
    color: gray;
    margin-bottom: 3px;
    margin-left: 0;
    transition-duration: 0.3s;
    transition-property: all;
    transform: translateY(-20px);
}
.input:placeholder-shown ~ .labelInput{
    transform: translateY(8px);
    font-size: x-large;
    cursor: text;
}
.input:focus ~ .labelInput{
    font-size: large;
    transform: translateY(-23px);
}
.actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;

}
.login{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 25px;
    overflow: hidden;
}
</style>
