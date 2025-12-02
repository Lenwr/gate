import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'vue3-toastify/dist/index.css'
import { useAuthStore } from './stores/useAuthStore'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const authStore = useAuthStore()
authStore.initAuthListener()