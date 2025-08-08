import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import './styles/global.css'
import 'primeicons/primeicons.css'
import { clerkPlugin } from '@clerk/vue'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createApp(App)
    .use(router)
    .use(PrimeVue)
    .use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
    .mount('#app')
