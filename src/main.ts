import './assets/styles/main.css'

import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'
import './router/permission'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
