import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from "../views/HomePage.vue"
import ListPage from "@/views/ListPage.vue";
import ClassificaParziale from "@/views/ClassificaParziale.vue";
import ClassificaTotale from "@/views/ClassificaTotale.vue";
import AdminPage from "@/views/AdminPage.vue";
import Competizioni from "@/views/Competizioni.vue";
import ListaUtenti from "@/views/ListaUtenti.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/parziale',
    name: 'Parziale',
    component: ClassificaParziale
  },
  {
    path: '/totale',
    name: 'Totale',
    component: ClassificaTotale
  },
  {
    path: '/dashboard',
    name: 'AdminPage',
    component: AdminPage,
    meta: { requiresAdmin: true }
  },
  {
    path: '/utenti',
    name: 'ListaUtenti',
    component: ListaUtenti,
    meta: { requiresAdmin: true }
  },
  {
    path: '/',
    name: 'Competizioni',
    component: Competizioni
  },
  {
    path: '/:competizione',
    name: 'Competizione',
    component: ListPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async(to, from, next) => {
  const isLoggedIn = sessionStorage.getItem("user");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  if (!isLoggedIn && to.path !== '/login') {
    await router.push("/login");
  } else if (to.meta.requiresAdmin && !isAdmin) {
    await router.push("/");
  } else {
    next();
  }
});


export default router
