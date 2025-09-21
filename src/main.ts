// 213703/frontend/src/main.ts
import { createApp } from "vue"
import App from "./App.vue"
import "./assets/tailwind.css"
import router from './router'
import './style.css'

import Tres from '@tresjs/core'

createApp(App)
.use(router)
.use(Tres)
.mount('#app')