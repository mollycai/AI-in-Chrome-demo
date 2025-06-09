import { createApp } from 'vue'
import App from './App.vue'
import '@/style/reset.css'
import '@/style/code.scss'
import '@/style/juejin.scss'
import 'element-plus/dist/index.css'
import router from '@/router/index.js'

createApp(App).use(router).mount('#app')