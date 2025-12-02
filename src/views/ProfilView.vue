<template>
    <div class="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div class="w-full max-w-2xl bg-white shadow-md rounded-2xl p-6 md:p-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-xl md:text-2xl font-semibold text-slate-900">
              Mon profil
            </h1>
            <p class="text-sm text-slate-500">
              Mets à jour tes informations pour faciliter les enlèvements.
            </p>
          </div>
          <div
            class="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold uppercase"
          >
            {{ initials }}
          </div>
        </div>
  
        <form class="space-y-4" @submit.prevent="handleSave">
          <div class="grid md:grid-cols-2 gap-4">
            <!-- Nom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Nom
              </label>
              <input
                v-model="nom"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
  
            <!-- Prénom -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Prénom
              </label>
              <input
                v-model="prenom"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
  
          <!-- Téléphone -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              v-model="phone"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Numéro où le livreur peut te joindre"
            />
          </div>
  
          <!-- Adresse -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Adresse
            </label>
            <textarea
              v-model="adresse"
              rows="3"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Quartier, rue, immeuble, étage…"
              required
            ></textarea>
          </div>
  
          <!-- Email (lecture seule) -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Email (identifiant de connexion)
            </label>
            <input
              :value="email"
              disabled
              class="w-full border rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500"
            />
          </div>
  
          <div class="flex items-center justify-between pt-4 border-t mt-4">
            <button
              type="button"
              class="text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
              @click="goBack"
            >
              ← Retour au tableau de bord
            </button>
  
            <button
              type="submit"
              class="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              <span v-if="loading" class="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></span>
              <span>{{ loading ? 'Enregistrement…' : 'Enregistrer les modifications' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/useAuthStore'
  import { db } from '../services/firebase'
  import { doc, updateDoc } from 'firebase/firestore'
  import { toast } from 'vue3-toastify'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const nom = ref('')
  const prenom = ref('')
  const phone = ref('')
  const adresse = ref('')
  const email = ref('')
  const loading = ref(false)
  
  const initials = computed(() => {
    const n = nom.value?.trim()[0] || ''
    const p = prenom.value?.trim()[0] || ''
    const combo = (p + n).toUpperCase()
    return combo || 'C'
  })
  
  onMounted(() => {
    const user = authStore.user
    if (!user) {
      router.push('/login')
      return
    }
    nom.value = user.nom || ''
    prenom.value = user.prenom || ''
    phone.value = user.phone || ''
    adresse.value = user.adresse || ''
    email.value = user.email || ''
  })
  
  const handleSave = async () => {
    try {
      const user = authStore.user
      if (!user?.uid) {
        toast.error('Utilisateur non connecté')
        return
      }
  
      loading.value = true
  
      const ref = doc(db, 'clients', user.uid)
      await updateDoc(ref, {
        nom: nom.value,
        prenom: prenom.value,
        phone: phone.value,
        adresse: adresse.value,
      })
  
      // recharge le profil dans le store pour être synchro partout
      await authStore.loadUserProfile(user.uid, email.value)
  
      toast.success('Profil mis à jour ✅')
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      loading.value = false
    }
  }
  
  const goBack = () => {
    router.push('/dashboard')
  }
  </script>
  