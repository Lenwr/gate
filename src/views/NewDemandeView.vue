<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-6">
    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 md:p-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-slate-900">
            Nouvelle demande d’enlèvement
          </h1>
          <p class="text-sm text-slate-500">
            Déclare ton colis avant notre passage, on validera l’enlèvement sur place.
          </p>
        </div>
        <button
          class="text-xs md:text-sm px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
          @click="goBack"
        >
          ← Retour
        </button>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- Infos expéditeur (rappel depuis le profil) -->
        <div class="bg-slate-50 rounded-xl p-4 text-sm text-slate-700">
          <div class="font-semibold mb-1">Tes informations</div>
          <p>{{ fullName }}</p>
          <p v-if="user.adresse">{{ user.adresse }}</p>
          <p v-if="user.phone">📞 {{ user.phone }}</p>
          <p class="text-xs text-slate-500 mt-2">
            Ces infos viennent de ton profil. Tu peux les modifier dans “Mon profil”.
          </p>
        </div>

        <!-- Destinataire -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Nom du destinataire
            </label>
            <input
              v-model="destinataire"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Téléphone du destinataire
            </label>
            <input
              v-model="telephoneDestinataire"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Optionnel mais recommandé"
            />
          </div>
        </div>

        <!-- Type de fret & destination -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Type de fret
            </label>
            <select
              v-model="typeDeFret"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Maritime">Maritime</option>
              <option value="Aérien">Aérien</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">
              Destination
            </label>
            <select
              v-model="destination"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>TOGO</option>
              <option>BENIN</option>
              <option>SENEGAL</option>
              <option>ABIDJAN</option>
              <option>CONGO</option>
            </select>
          </div>
        </div>

        <!-- Description des colis -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-slate-700">
              Colis à enlever
            </label>
            <button
              type="button"
              class="text-xs text-indigo-600 hover:underline"
              @click="ajouterColis"
            >
              + Ajouter un colis
            </button>
          </div>

          <datalist id="articleOptions">
            <option v-for="opt in ARTICLE_OPTIONS" :key="opt" :value="opt" />
          </datalist>

          <div class="space-y-2">
            <div
              v-for="(colis, index) in colisList"
              :key="index"
              class="flex items-center gap-2"
            >
              <input
                type="number"
                min="1"
                v-model.number="colis.quantite"
                class="w-20 border rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                v-model="colis.nom"
                list="articleOptions"
                class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex : Carton, Télévision, Frigidaire…"
              />
              <button
                type="button"
                class="text-xs text-red-500 hover:underline"
                @click="supprimerColis(index)"
              >
                Supprimer
              </button>
            </div>
          </div>

          <!-- Aperçu des quantités par article -->
          <div v-if="countsPreview.length" class="mt-3 text-xs text-slate-600">
            <div class="font-semibold mb-1">Aperçu :</div>
            <ul class="list-disc list-inside">
              <li v-for="item in countsPreview" :key="item.key">
                {{ item.label }} : {{ item.qty }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Photos du colis -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Photos du colis (optionnel)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            @change="handleFileChange"
            class="mt-1 block w-full text-sm
                   file:mr-3 file:py-2 file:px-3
                   file:rounded-md file:border-0
                   file:text-sm file:font-medium
                   file:bg-indigo-50 file:text-indigo-700
                   hover:file:bg-indigo-100
                   border rounded-lg px-2 py-1"
          />
          <p class="mt-1 text-xs text-slate-500">
            Tu peux envoyer plusieurs photos pour que l’équipe voie mieux le colis.
          </p>

          <div v-if="files.length" class="mt-2 flex flex-wrap gap-2">
            <div
              v-for="file in files"
              :key="file.name"
              class="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700"
            >
              {{ file.name }}
            </div>
          </div>
        </div>

        <!-- Bouton submit -->
        <div class="flex items-center justify-end pt-4 border-t mt-4">
          <button
            type="submit"
            class="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"
            ></span>
            <span>{{ loading ? 'Envoi de la demande…' : 'Envoyer la demande' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { db, storage } from '../services/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user || {})

// ======================
// Options / helpers colis (aligné avec ton app interne)
// ======================
const ARTICLE_OPTIONS = [
  'Barigo',
  'Frigidaire',
  'Canapé',
  'Télévision',
  'Matelas',
  'Sièges/fauteuil',
  'Table',
  'Gazinière',
  'Fenêtre',
  'Porte',
  'Armoire',
  'Alimentation',
  'Tapis',
  'Sacs',
  'Carton',
  'Colis',
  'Lave vaisselle',
  'Meuble',
  'Draps',
  'Cantine',
]

const normalize = (s = '') =>
  s
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const toTypeKey = (label = '') =>
  normalize(label)
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

const matchOption = (input = '') => {
  const n = normalize(input)
  return ARTICLE_OPTIONS.find((o) => normalize(o) === n) || input
}

// même logique que ton buildColis interne
const buildColisFromClientForm = (colisList) =>
  colisList
    .filter((c) => c.nom && c.quantite)
    .map((c) => {
      const label = matchOption(c.nom)
      const q = Number(c.quantite) || 1
      const typeKey = toTypeKey(label)
      const details = Array.from({ length: q }, (_, i) => ({
        coli: `${label} ${i + 1}/${q}`,
        statutColis: 'déclaré',
        type: typeKey,
        article: label,
      }))
      return { nom: label, quantite: q, type: typeKey, details }
    })

// Aperçu des quantités par article
const colisList = ref([{ nom: '', quantite: 1 }])
const countsPreview = computed(() => {
  const map = new Map()
  for (const c of colisList.value) {
    if (!c.nom || !c.quantite) continue
    const label = matchOption(c.nom)
    const key = toTypeKey(label)
    const item = map.get(key) || { label, key, qty: 0 }
    item.qty += Number(c.quantite) || 0
    map.set(key, item)
  }
  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label))
})

// ======================
// State formulaire
// ======================
const destinataire = ref('')
const telephoneDestinataire = ref('')
const typeDeFret = ref('Maritime')
const destination = ref('TOGO')
const loading = ref(false)
const files = ref([]) // photos sélectionnées

const fullName = computed(() => {
  const u = user.value
  return `${u.prenom || ''} ${u.nom || ''}`.trim() || u.email || 'Client'
})

// Actions UI
const ajouterColis = () => {
  colisList.value.push({ nom: '', quantite: 1 })
}

const supprimerColis = (index) => {
  if (colisList.value.length === 1) {
    colisList.value[0] = { nom: '', quantite: 1 }
    return
  }
  colisList.value.splice(index, 1)
}

const handleFileChange = (event) => {
  const selected = Array.from(event.target.files || [])
  files.value = selected
}

const goBack = () => {
  router.push('/dashboard')
}

// ======================
// Submit
// ======================
const handleSubmit = async () => {
  try {
    const currentUser = user.value
    if (!currentUser?.uid) {
      toast.error('Tu dois être connecté pour faire une demande')
      router.push('/login')
      return
    }

    if (!destinataire.value) {
      toast.warn('Le nom du destinataire est obligatoire')
      return
    }

    const colisData = buildColisFromClientForm(colisList.value)
    if (!colisData.length) {
      toast.warn('Ajoute au moins un colis avec un nom et une quantité')
      return
    }

    const nombreDeColis = colisData.reduce(
      (acc, c) => acc + (c.quantite || 0),
      0,
    )

    loading.value = true

    // 1️⃣ Upload des photos dans Storage
    const imageUrls = []
    for (const file of files.value) {
      const path = `pickupRequests_images/${currentUser.uid}/${Date.now()}_${file.name}`
      const imgRef = storageRef(storage, path)
      await uploadBytes(imgRef, file)
      const url = await getDownloadURL(imgRef)
      imageUrls.push(url)
    }

    // 2️⃣ Enregistrer la demande dans Firestore
    const colRef = collection(db, 'pickupRequests')

    await addDoc(colRef, {
      // lien client
      clientId: currentUser.uid,
      clientEmail: currentUser.email || '',
      clientNom: currentUser.nom || '',
      clientPrenom: currentUser.prenom || '',
      clientPhone: currentUser.phone || '',
      clientAdresse: currentUser.adresse || '',

      // données demande
      destinataire: destinataire.value,
      telephoneDestinataire: telephoneDestinataire.value,
      typeDeFret: typeDeFret.value,
      destination: destination.value,
      colis: colisData,
      nombreDeColis,

      imageUrls, // photos du client

      status: 'PENDING', // en attente de validation
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    toast.success('Demande envoyée ✅')
    router.push('/demandes') // à créer ensuite
  } catch (e) {
    console.error(e)
    toast.error('Erreur lors de la création de la demande')
  } finally {
    loading.value = false
  }
}
</script>
