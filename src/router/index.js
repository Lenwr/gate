import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfilView from '../views/ProfilView.vue'
import NewDemandeView from '../views/NewDemandeView.vue'
import DemandesListView from '../views/DemandesListView.vue'
import AuthLayout from '../layout/AuthLayout.vue' // 👈 le layout avec la navbar
import { useAuthStore } from '../stores/useAuthStore'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // 🔓 Routes publiques
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { authNeeded: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { authNeeded: false },
    },

    // 🔒 Toutes les routes protégées passent par le layout avec navbar
    {
      path: '/',
      component: AuthLayout,
      meta: { authNeeded: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'profil',
          name: 'profil',
          component: ProfilView,
        },
        {
          path: 'demandes',
          name: 'demandes',
          component: DemandesListView,
        },
        {
          path: 'demandes/nouvelle',
          name: 'new-demande',
          component: NewDemandeView,
        },
      ],
    },
  ],
})

// Guard d'auth
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = !!authStore.user

  // 👉 une route a besoin d'auth si AU MOINS une des routes matchées le demande
  const needsAuth = to.matched.some((record) => record.meta.authNeeded !== false)
  const isAuthPage = to.path === '/login' || to.path === '/register'

  // 🔒 Route protégée + pas connecté => go login
  if (needsAuth && !isLoggedIn) {
    return next('/login')
  }

  // 🙅‍♂️ Déjà connecté mais essaie d'aller sur login/register => go dashboard
  if (isLoggedIn && isAuthPage) {
    return next('/dashboard')
  }

  return next()
})

export default router
