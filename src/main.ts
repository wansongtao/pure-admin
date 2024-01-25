import './assets/style/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './router/permission'
import installDirective from '@/directive/install'

const app = createApp(App)

installDirective(app)
app.use(createPinia())
app.use(router)
app.mount('#app')
