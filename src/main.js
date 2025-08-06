import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import './styles/global.css'
import 'primeicons/primeicons.css'

createApp(App)
    .use(router)
    .use(PrimeVue)
    .mount('#app')
