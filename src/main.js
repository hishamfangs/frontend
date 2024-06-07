import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './FileManager.vue'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
