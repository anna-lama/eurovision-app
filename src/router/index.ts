import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from "../views/HomePage.vue"
import ListPage from "@/views/ListPage.vue";
import ClassificaParziale from "@/views/ClassificaParziale.vue";
import ClassificaTotale from "@/views/ClassificaTotale.vue";
import AdminPage from "@/views/AdminPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/',
    name: 'List',
    component: ListPage
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
    path: '/dashboardnascosta',
    name: 'AdminPage',
    component: AdminPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async(to, from, next) => {
  const isLoggedIn = sessionStorage.getItem("user");
  if (!isLoggedIn && to.path !== '/login') {
    await router.push("/login");
  } else {
    next();
  }
});


export default router
