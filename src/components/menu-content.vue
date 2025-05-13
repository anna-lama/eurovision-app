<template>
    <div class="menu-container">
        <div style="display: flex; flex-direction: column">
            <div class="tile" @click="router.push('/')">
                <span>Home</span>
            </div>
            <div class="tile" @click="router.push('/parziale')">
                <span>Classifica parziale</span>
            </div>
            <div class="tile" @click="router.push('/totale')">
                <span>Classifica totale</span>
            </div>
        </div>
        <button class="btn btn-error" @click="logOut">LOGOUT</button>
    </div>
</template>

<script setup lang="ts">

import router from "@/router";

const logOut = () => {
    sessionStorage.clear()
    router.push('/login')
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
