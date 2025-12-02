<template>
  <section class="space-y-6">
    <!-- Welcome / hero -->
    <section
      class="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm"
    >
      <div>
        <p class="text-sm text-indigo-100 mb-1">Tableau de bord client</p>
        <h1 class="text-2xl md:text-3xl font-semibold mb-2">
          Bienvenue, {{ userName || 'client' }} 👋
        </h1>
        <p class="text-sm md:text-base text-indigo-100/90 max-w-xl">
          Déclare tes colis à faire enlever, suis le statut de tes demandes
          et garde ton QR toujours prêt pour les enlèvements.
        </p>
      </div>

      <div class="flex flex-col items-start md:items-end gap-2">
        <button
          class="inline-flex items-center gap-2 text-sm bg-white text-indigo-600 px-4 py-2 rounded-full font-medium shadow-sm hover:bg-slate-50 transition"
          @click="goToNewDemande"
        >
          <span class="text-lg">➕</span>
          <span>Nouvelle demande</span>
        </button>
        <p class="text-xs text-indigo-100/80">
          2 clics pour déclarer un enlèvement. Le livreur n’a plus qu’à valider.
        </p>
      </div>
    </section>

    <!-- Cards -->
    <section class="grid gap-4 md:grid-cols-3">
      <!-- Carte: Mes demandes -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold mb-1 text-slate-900">
              Mes demandes d’enlèvement
            </h3>
            <p class="text-sm text-slate-600">
              Voir les demandes en attente, validées ou annulées.
            </p>
          </div>
          <div
            class="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"
          >
            📦
          </div>
        </div>
        <button
          class="mt-4 text-sm w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
          @click="goToDemandes"
        >
          Voir mes demandes
        </button>
      </div>

      <!-- Carte: Nouvelle demande -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold mb-1 text-slate-900">
              Déclarer un nouveau colis
            </h3>
            <p class="text-sm text-slate-600">
              Prépare ta demande avant notre passage pour gagner du temps.
            </p>
          </div>
          <div
            class="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"
          >
            ✏️
          </div>
        </div>
        <button
          class="mt-4 text-sm w-full py-2 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition"
          @click="goToNewDemande"
        >
          Faire une demande
        </button>
      </div>

      <!-- Carte: QR + profil -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col justify-between"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <h3 class="font-semibold mb-1 text-slate-900">
              QR client & profil
            </h3>
            <p class="text-sm text-slate-600">
              Ton QR client à montrer au livreur + infos de contact.
            </p>
          </div>
          <div
            class="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg"
          >
            🔗
          </div>
        </div>
        <button
          class="mt-4 text-sm w-full py-2 rounded-xl border border-sky-200 hover:bg-sky-50 transition"
          @click="goToProfil"
        >
          Voir mon profil
        </button>
      </div>
    </section>

    <!-- Stats + historique -->
    <section class="grid gap-4 md:grid-cols-2">
      <!-- Récapitulatif rapide -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <h3 class="font-semibold text-slate-900 mb-2">
          Récapitulatif rapide
        </h3>

        <div v-if="loadingStats" class="text-sm text-slate-500 py-4">
          Calcul en cours…
        </div>
        <div v-else class="space-y-2">
          <p
            v-if="statsError"
            class="text-xs text-red-500"
          >
            {{ statsError }}
          </p>

          <div class="grid grid-cols-3 gap-3 text-center text-sm">
            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs text-slate-500 mb-1">En attente</div>
              <div class="text-xl font-semibold text-slate-900">
                {{ demandesStats.pending }}
              </div>
            </div>
            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs text-slate-500 mb-1">Validées</div>
              <div class="text-xl font-semibold text-slate-900">
                {{ demandesStats.validated }}
              </div>
            </div>
            <div class="rounded-xl bg-slate-50 p-3">
              <div class="text-xs text-slate-500 mb-1">Envois créés</div>
              <div class="text-xl font-semibold text-slate-900">
                {{ shipmentsTotal }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mes derniers envois -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <h3 class="font-semibold text-slate-900 mb-2">
          Mes derniers envois
        </h3>

        <div v-if="loadingShipments" class="text-sm text-slate-500 py-4">
          Chargement de ton historique…
        </div>

        <p
          v-else-if="!shipments.length"
          class="text-sm text-slate-500"
        >
          Tu n’as pas encore de colis expédié via nos enlèvements.
        </p>

        <div v-else class="space-y-2">
          <p
            v-if="shipmentsError"
            class="text-xs text-red-500"
          >
            {{ shipmentsError }}
          </p>

          <ul class="divide-y divide-slate-100">
            <li
              v-for="s in shipments"
              :key="s.id"
              class="py-2 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <div class="font-medium text-slate-900">
                  {{ s.destination || 'Destination inconnue' }}
                </div>
                <div class="text-[11px] text-slate-500">
                  N° {{ s.numero || s.id }}
                  <span v-if="s.createdAtFormatted"> • {{ s.createdAtFormatted }}</span>
                </div>
              </div>
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-[11px] font-medium',
                  shipmentStatusClass(s.deliveryStatus),
                ]"
              >
                {{ shipmentStatusLabel(s.deliveryStatus) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { db } from '../services/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore'

const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => {
  if (!authStore.user) return ''
  const { nom, prenom } = authStore.user
  return `${prenom || ''} ${nom || ''}`.trim()
})

const goToDemandes = () => {
  router.push('/demandes')
}

const goToNewDemande = () => {
  router.push('/demandes/nouvelle')
}

const goToProfil = () => {
  router.push('/profil')
}

// --- State pour stats & historique ---
const demandesStats = ref({
  pending: 0,
  validated: 0,
  cancelled: 0,
})

const loadingStats = ref(false)
const statsError = ref('')

const shipments = ref([]) // derniers enlevements
const shipmentsTotal = ref(0)
const loadingShipments = ref(false)
const shipmentsError = ref('')

// --- Helpers ---
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

const shipmentStatusLabel = (status) => {
  if (!status) return 'En attente'
  switch (status) {
    case 'En attente':
      return 'En attente'
    case 'En cours':
      return 'En cours'
    case 'Livré':
      return 'Livré'
    case 'Annulé':
      return 'Annulé'
    default:
      return status
  }
}

const shipmentStatusClass = (status) => {
  switch (status) {
    case 'En attente':
      return 'bg-amber-50 text-amber-700 border border-amber-100'
    case 'En cours':
      return 'bg-sky-50 text-sky-700 border border-sky-100'
    case 'Livré':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    case 'Annulé':
      return 'bg-red-50 text-red-700 border border-red-100'
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-100'
  }
}

// --- Chargement des stats & de l'historique ---
const loadDashboardData = async () => {
  const user = authStore.user
  if (!user?.uid) return

  const uid = user.uid

  // 1️⃣ Stats demandes (pickupRequests)
  try {
    loadingStats.value = true
    statsError.value = ''

    const prRef = collection(db, 'pickupRequests')
    const prQuery = query(prRef, where('clientId', '==', uid))
    const prSnap = await getDocs(prQuery)

    const stats = { pending: 0, validated: 0, cancelled: 0 }

    prSnap.forEach((docSnap) => {
      const data = docSnap.data()
      const status = (data.status || 'PENDING').toUpperCase()
      if (status === 'PENDING') stats.pending++
      else if (status === 'VALIDATED') stats.validated++
      else if (status === 'CANCELLED') stats.cancelled++
    })

    demandesStats.value = stats
  } catch (e) {
    console.error(e)
    statsError.value = 'Erreur lors du chargement des demandes'
  } finally {
    loadingStats.value = false
  }

  // 2️⃣ Historique envois (enlevements)
  try {
    loadingShipments.value = true
    shipmentsError.value = ''

    const colRef = collection(db, 'enlevements')
    const shipQuery = query(
      colRef,
      where('customerId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(5),
    )

    const snap = await getDocs(shipQuery)

    const all = []
    snap.forEach((docSnap) => {
      const data = docSnap.data()
      all.push({
        id: docSnap.id,
        ...data,
        createdAtFormatted: data.createdAt ? formatDate(data.createdAt) : '',
      })
    })

    shipments.value = all
    shipmentsTotal.value = all.length // ⚠️ ici = nb des derniers; 
    // si tu veux le total global, il faudra un 2e getDocs sans limit()
  } catch (e) {
    console.error(e)
    shipmentsError.value = 'Erreur lors du chargement des envois'
  } finally {
    loadingShipments.value = false
  }
}

onMounted(loadDashboardData)
</script>
