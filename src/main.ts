import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'
import '@/assets/css/reset.css'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

const app = createApp(App)

app.use(pinia).use(router)

app.mount('#app')
