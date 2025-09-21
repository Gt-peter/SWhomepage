// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 먼저 컴포넌트를 임포트
import LobbyCenter from '@/components/pages/LobbyCenter.vue'
import LobbyLeft   from '@/components/pages/LobbyLeft.vue'
import LobbyRight  from '@/components/pages/LobbyRight.vue'
import BoardPage   from '@/components/pages/BoardPage.vue'

// 임포트한 컴포넌트를 라우트에 지정
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/lobby/center' },
  { path: '/lobby/center', name: 'center', component: LobbyCenter },
  { path: '/lobby/left',   name: 'left',   component: LobbyLeft },
  { path: '/lobby/right',  name: 'right',  component: LobbyRight },
  { path: '/board',        name: 'board',  component: BoardPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
