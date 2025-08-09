import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import './styles/global.css'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';
import { clerkPlugin } from '@clerk/vue'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createApp(App)
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
    .use(ToastService)
    .mount('#app')
