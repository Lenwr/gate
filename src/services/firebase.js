// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// ⚠️ Mets ici les mêmes valeurs que dans ton app interne
const firebaseConfig = {
    apiKey: "AIzaSyAD3_lBREn2mj9hdNVG_oXmWAXpylFzI3o",
    authDomain: "aarontravelgestion.firebaseapp.com",
    projectId: "aarontravelgestion",
    storageBucket: "aarontravelgestion.appspot.com",
    messagingSenderId: "251921548029",
    appId: "1:251921548029:web:936a9dc35f715ae401f494",
    measurementId: "G-99L11P6DYT"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)