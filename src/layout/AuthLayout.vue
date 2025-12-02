<template>
    <div class="min-h-screen bg-slate-100">
      <!-- Top bar -->
      <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div class="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-2">
            <div class="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              CL
            </div>
            <div class="leading-tight">
              <div class="font-semibold text-slate-900">Client Portal</div>
              <div class="text-xs text-slate-500">Espace d’enlèvement colis</div>
            </div>
          </div>
  
          <div class="flex items-center gap-4">
            <button
              class="hidden sm:inline-flex items-center text-sm px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              @click="goToProfil"
            >
              Mon profil
            </button>
            <div class="flex items-center gap-3">
              <div class="hidden sm:flex flex-col text-right">
                <span class="text-xs text-slate-500">Connecté en tant que</span>
                <span class="text-sm font-medium text-slate-900 truncate max-w-[160px]">
                  {{ userName || 'Client' }}
                </span>
              </div>
              <div
                class="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold uppercase"
              >
                {{ userInitials }}
              </div>
            </div>
            <button
              class="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition"
              @click="logout"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
  
      <!-- Contenu des pages protégées -->
      <main class="max-w-6xl mx-auto px-4 pb-10 pt-6">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/useAuthStore'
  import { toast } from 'vue3-toastify'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const userName = computed(() => {
    if (!authStore.user) return ''
    const { nom, prenom } = authStore.user
    return `${prenom || ''} ${nom || ''}`.trim()
  })
  
  const userInitials = computed(() => {
    const { nom, prenom } = authStore.user || {}
    if (!nom && !prenom) return 'C'
    const n = nom?.[0] || ''
    const p = prenom?.[0] || ''
    return (p + n).toUpperCase()
  })
  
  const goToProfil = () => {
    router.push('/profil')
  }
  
  const logout = async () => {
    await authStore.logout()
    toast.info('Déconnexion')
    router.push('/login')
  }
  </script>
  