import { defineStore } from 'pinia'
import { auth, db } from '../services/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('client_user')) || null,
    isAuthReady: false,
  }),

  actions: {
    async loadUserProfile(uid, emailFallback = '') {
      const ref = doc(db, 'clients', uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        const data = snap.data()
        const userData = {
          uid,
          email: data.email || emailFallback,
          nom: data.nom || '',
          prenom: data.prenom || '',
          phone: data.phone || '',
          adresse: data.adresse || '',
        }
        this.user = userData
        localStorage.setItem('client_user', JSON.stringify(userData))
      } else {
        this.user = { uid, email: emailFallback }
        localStorage.setItem('client_user', JSON.stringify(this.user))
      }
    },

    initAuthListener() {
      if (this.isAuthReady) return

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          await this.loadUserProfile(firebaseUser.uid, firebaseUser.email)
        } else {
          this.user = null
          localStorage.removeItem('client_user')
        }
        this.isAuthReady = true
      })
    },

    async register({ email, password, nom, prenom, phone, adresse }) {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = cred.user

      await setDoc(doc(db, 'clients', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email,
        nom,
        prenom,
        phone,
        adresse,
        createdAt: new Date().toISOString(),
      })

      this.user = {
        uid: firebaseUser.uid,
        email,
        nom,
        prenom,
        phone,
        adresse,
      }
      localStorage.setItem('client_user', JSON.stringify(this.user))
    },

    async login({ email, password }) {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = cred.user

      await this.loadUserProfile(firebaseUser.uid, firebaseUser.email)
    },

    async logout() {
      await signOut(auth)
      this.user = null
      localStorage.removeItem('client_user')
    },
  },
})
