import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/writer'
  },
  {
    path: '/writer',
    name: 'Writer',
    component: () => import('@/pages/Writer.vue')
  },
  {
    path: '/summarizer',
    name: 'Summarizer',
    component: () => import('@/pages/Summarizer.vue')
  },
  {
    path: '/prompt',
    name: 'Prompt',
    component: () => import('@/pages/Prompt.vue')
  },
  {
    path: '/translator',
    name: 'Translator',
    component: () => import('@/pages/Translator.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router