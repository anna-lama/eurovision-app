<template>
    <div class="menu-container">
        <div style="display: flex; flex-direction: column">
            <div class="tile" @click="navigate('/')">
                <span>Home</span>
            </div>
            <div class="tile" @click="navigate('/parziale')">
                <span>Classifica parziale</span>
            </div>
            <div class="tile" @click="navigate('/totale')">
                <span>Classifica totale</span>
            </div>
        </div>
        <button class="btn btn-error" @click="logOut">LOGOUT</button>
    </div>
</template>

<script setup lang="ts">

import { menuController } from "@ionic/vue";
import router from "@/router";

const navigate = async (path: string) => {
    await router.push(path)
    await menuController.close("main-menu")
}

const logOut = async () => {
    sessionStorage.clear()
    await router.push('/login')
    await menuController.close("main-menu")
}
</script>

<style lang="scss">
.menu-container {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
    padding: 15px;
}

.tile {
    padding: 15px;
    display: flex;
    justify-content: start;
    align-items: center;
    border-bottom: 1px solid grey;
    font-size: 20px;
}
</style>
