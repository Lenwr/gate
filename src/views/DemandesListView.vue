<template>
  <div class="min-h-screen bg-slate-100 flex justify-center px-4 py-6">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 md:p-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-slate-900">
            Mes demandes d’enlèvement
          </h1>
          <p class="text-sm text-slate-500">
            Suis l’état de tes demandes en attente, validées ou annulées.
          </p>
        </div>

        <div class="flex flex-col items-end gap-2">
          <button
            class="inline-flex items-center gap-2 text-xs md:text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
            @click="goNewDemande"
          >
            <span class="text-base">➕</span>
            <span>Nouvelle demande</span>
          </button>
          <button
            class="text-xs text-slate-500 hover:underline"
            @click="goDashboard"
          >
            ← Retour au dashboard
          </button>
        </div>
      </div>

      <!-- Contenu -->
      <div v-if="loading" class="flex justify-center py-10">
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <span
            class="h-4 w-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"
          ></span>
          <span>Chargement des demandes…</span>
        </div>
      </div>

      <div v-else>
        <div v-if="error" class="mb-4 text-sm text-red-500">
          {{ error }}
        </div>

        <div
          v-if="!demandes.length && !error"
          class="py-10 text-center text-sm text-slate-500"
        >
          <p>Tu n’as pas encore de demande d’enlèvement.</p>
          <button
            class="mt-3 inline-flex items-center gap-2 text-xs md:text-sm px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
            @click="goNewDemande"
          >
            <span class="text-base">➕</span>
            <span>Faire une première demande</span>
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="demande in demandes"
            :key="demande.id"
            class="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-slate-900">
                  {{ demande.destination }} • {{ demande.typeDeFret || 'Fret' }}
                </span>
                <span
                  :class="[
                    'text-[11px] px-2 py-0.5 rounded-full font-medium',
                    statusClass(demande.status),
                  ]"
                >
                  {{ statusLabel(demande.status) }}
                </span>
              </div>

              <div class="text-xs text-slate-500">
                Destinataire :
                <span class="font-medium text-slate-700">
                  {{ demande.destinataire || '-' }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>
                  📦 {{ demande.nombreDeColis || demande.colis?.length || 0 }}
                  colis
                </span>
                <span v-if="demande.createdAtFormatted">
                  🕒 {{ demande.createdAtFormatted }}
                </span>
                <span v-if="demande.imageCount && demande.imageCount > 0">
                  📷 {{ demande.imageCount }} photo<span v-if="demande.imageCount > 1">s</span>
                </span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 justify-end">
              <button
                class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
                @click="openDetails(demande)"
              >
                Détails
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal détails -->
      <div
        v-if="selectedDemande"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-20"
      >
        <div class="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
          <button
            class="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            @click="selectedDemande = null"
          >
            ✕
          </button>
          <h2 class="text-lg font-semibold text-slate-900 mb-3">
            Détails de la demande
          </h2>

          <div class="space-y-2 text-sm text-slate-700">
            <p>
              <span class="font-medium">Destination :</span>
              {{ selectedDemande.destination }}
            </p>
            <p>
              <span class="font-medium">Type de fret :</span>
              {{ selectedDemande.typeDeFret || '—' }}
            </p>
            <p>
              <span class="font-medium">Destinataire :</span>
              {{ selectedDemande.destinataire || '—' }}
            </p>
            <p v-if="selectedDemande.telephoneDestinataire">
              <span class="font-medium">Téléphone destinataire :</span>
              {{ selectedDemande.telephoneDestinataire }}
            </p>
            <p>
              <span class="font-medium">Statut :</span>
              {{ statusLabel(selectedDemande.status) }}
            </p>
            <p v-if="selectedDemande.createdAtFormatted">
              <span class="font-medium">Créée le :</span>
              {{ selectedDemande.createdAtFormatted }}
            </p>
          </div>

          <div class="mt-4">
            <h3 class="text-sm font-semibold text-slate-900 mb-1">
              Colis
            </h3>
            <ul
              class="text-xs text-slate-700 list-disc list-inside space-y-1 max-h-40 overflow-auto"
            >
              <li
                v-for="c in selectedDemande.colis || []"
                :key="c.nom + c.type"
              >
                {{ c.quantite }} × {{ c.nom }}
              </li>
            </ul>
          </div>

          <div v-if="selectedDemande.imageUrls?.length" class="mt-4">
            <h3 class="text-sm font-semibold text-slate-900 mb-1">
              Photos
            </h3>
            <div class="grid grid-cols-3 gap-2">
              <a
                v-for="(url, idx) in selectedDemande.imageUrls"
                :key="idx"
                :href="url"
                target="_blank"
                rel="noreferrer"
                class="block"
              >
                <img
                  :src="url"
                  alt="photo colis"
                  class="h-20 w-full object-cover rounded-lg border border-slate-200"
                />
              </a>
            </div>
          </div>

          <!-- QR CODE POUR VALIDATION -->
          <div class="mt-5 text-center">
            <h3 class="text-sm font-semibold text-slate-900 mb-1">
              QR de validation
            </h3>

            <QrcodeVue
              v-if="selectedDemande?.id"
              :value="`PR:${selectedDemande.id}`"
              :size="140"
              level="M"
              class="mx-auto"
            />

            <p class="text-[11px] text-slate-500 mt-2">
              Montre ce QR au livreur lors de l’enlèvement pour qu’il valide ta demande.
            </p>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
              @click="selectedDemande = null"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { db } from '../services/firebase'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore'
import { toast } from 'vue3-toastify'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const authStore = useAuthStore()

const demandes = ref([])
const loading = ref(false)
const error = ref('')
const selectedDemande = ref(null)

const goNewDemande = () => {
  router.push('/demandes/nouvelle')
}

const goDashboard = () => {
  router.push('/dashboard')
}

const statusLabel = (status) => {
  switch (status) {
    case 'PENDING':
      return 'En attente'
    case 'VALIDATED':
      return 'Validée'
    case 'CANCELLED':
      return 'Annulée'
    default:
      return status || 'En attente'
  }
}

const statusClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border border-amber-100'
    case 'VALIDATED':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border border-red-100'
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-100'
  }
}

const formatDate = (ts) => {
  if (!ts) return ''
  let d
  if (ts.toDate) {
    d = ts.toDate()
  } else {
    d = new Date(ts)
  }
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const openDetails = (demande) => {
  selectedDemande.value = demande
}

const loadDemandes = async () => {
  try {
    const user = authStore.user
    if (!user?.uid) {
      toast.error('Tu dois être connecté')
      router.push('/login')
      return
    }

    loading.value = true
    error.value = ''

    const colRef = collection(db, 'pickupRequests')
    const q = query(
      colRef,
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    )

    const snap = await getDocs(q)

    demandes.value = snap.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAtFormatted: data.createdAt ? formatDate(data.createdAt) : '',
        imageCount: Array.isArray(data.imageUrls) ? data.imageUrls.length : 0,
      }
    })
  } catch (e) {
    console.error(e)
    error.value = 'Erreur lors du chargement des demandes'
  } finally {
    loading.value = false
  }
}

onMounted(loadDemandes)
</script>
