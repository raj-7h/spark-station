import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import ChargerList from "../views/ChargerList.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/chargers", component: ChargerList, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem("token");
  if (to.meta.requiresAuth && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
