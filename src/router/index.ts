import { createWebHistory, createRouter } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true
})

router.beforeEach((to, from) => {
  return true;
})

export default router;