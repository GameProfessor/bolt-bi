import { createApp } from 'vue'
import { pinia } from './stores'
import { router } from './router'
import './assets/style/style.css'
import App from './App.vue'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')