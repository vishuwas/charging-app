import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ChargerList from "../pages/ChargerList.vue";
import MapView from "../pages/MapView.vue";

const routes = [
  { path: "/", redirect: "/register" },
  {
    path: "/login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/register",
    component: Register,
    meta: { guestOnly: true },
  },
  {
    path: "/chargers",
    component: ChargerList,
    meta: { requiresAuth: true },
  },
  {
    path: "/map",
    component: MapView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/login");
  } else if (to.meta.guestOnly && isLoggedIn) {
    next("/chargers");
  } else {
    next();
  }
});

export default router;
