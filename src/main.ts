import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'leaflet/dist/leaflet.css';
import App from './App.vue'

const app = createApp(App)


app.use(createBootstrap())


app.mount('#app')