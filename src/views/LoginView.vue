<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-100">
      <div class="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h1 class="text-2xl font-semibold mb-4 text-center">
          Connexion
        </h1>
  
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              class="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              class="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
  
          <button
            type="submit"
            class="w-full py-2 rounded-lg bg-black text-white font-medium"
          >
            Se connecter
          </button>
  
          <p class="text-sm text-center mt-2">
            Pas encore de compte ?
            <router-link to="/register" class="text-indigo-600">
              Créer un compte
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/useAuthStore'
  import { toast } from 'vue3-toastify'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const email = ref('')
  const password = ref('')
  
  const handleLogin = async () => {
    try {
      await authStore.login({ email: email.value, password: password.value })
      toast.success('Connexion réussie ✅')
      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      toast.error(e.message || 'Erreur de connexion')
    }
  }
  </script>
  