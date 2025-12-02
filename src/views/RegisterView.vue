<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-100">
      <div class="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h1 class="text-2xl font-semibold mb-4 text-center">
          Créer mon compte
        </h1>
  
        <form @submit.prevent="handleRegister" class="space-y-4">
  
          <!-- Nom -->
          <div>
            <label class="block text-sm font-medium mb-1">Nom</label>
            <input
              v-model="nom"
              class="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
  
          <!-- Prénom -->
          <div>
            <label class="block text-sm font-medium mb-1">Prénom</label>
            <input
              v-model="prenom"
              class="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium mb-1">Téléphone</label>
            <input
              v-model="phone"
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
  <label class="block text-sm font-medium mb-1">Adresse</label>
  <input
    v-model="adresse"
    class="w-full border rounded-lg px-3 py-2"
    placeholder="Quartier, rue, numéro..."
    required
  />
</div>

  
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
            Créer mon compte
          </button>
  
          <p class="text-sm text-center mt-2">
            Déjà un compte ?
            <router-link to="/login" class="text-indigo-600">
              Se connecter
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
  
  const nom = ref('')
  const prenom = ref('')
  const phone = ref('')
  const email = ref('')
  const password = ref('')
  const adresse = ref('')

  
  const handleRegister = async () => {
    try {
      await authStore.register({
        email: email.value,
        password: password.value,
        nom: nom.value,
        prenom: prenom.value,
        phone: phone.value,
        adresse: adresse.value,
      })
      toast.success('Compte créé 🎉')
      router.push('/dashboard')
    } catch (e) {
      console.error(e)
      toast.error(e.message || "Erreur lors de l'inscription")
    }
  }
  </script>
  