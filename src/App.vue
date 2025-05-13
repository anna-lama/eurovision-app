<template>
    <ion-app>
        <ion-menu v-if="route.name !== 'Home'" content-id="main-content" side="start" menu-id="main-menu">
            <ion-header>
                <ion-toolbar>
                    <ion-title>Menu</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content>
                <menu-content></menu-content>
            </ion-content>
        </ion-menu>
        <ion-page>
            <div class="page">
                <!-- Header globale -->
                <ion-header style="height: 70px;">
                    <ion-toolbar style="height: 100%; width: 100%; ">
                        <ion-buttons slot="start" v-if="route.name !== 'Home'">
                            <ion-menu-button color="dark" />
                        </ion-buttons>
                        <div style="height: 100%; width: 100%; display: flex; justify-content: end; align-items: center;">
                            <img
                                src="/logo_no_bg.png" alt="logo" style="max-height: 70px; height: auto; max-width: 100%;" />
                        </div>
                    </ion-toolbar>
                </ion-header>

                <!-- Contenuto dinamico -->
                <ion-content id="main-content">
                    <div class="container">
                        <router-view />
                    </div>
                </ion-content>
            </div>
            <!--            <div class="page">-->
            <!--                <div style="z-index: 3; width: 100%; top: 0; display: flex; justify-content: right; background-color: #000">-->
            <!--                    <img style="height: 70px" src="../public/logo_ridotto.jpg" alt="">-->
            <!--                </div>-->
            <!--                <div class="container">-->
            <!--                    <ion-router-outlet />-->
            <!--                </div>-->
            <!--            </div>-->
        </ion-page>
    </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonPage, IonMenu, IonHeader, IonToolbar, IonMenuButton, IonContent, IonTitle, IonButtons} from '@ionic/vue';
import {useRoute} from "vue-router";
import MenuContent from "@/components/menu-content.vue";
const route = useRoute()
</script>
