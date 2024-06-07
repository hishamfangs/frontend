import { createRouter, createWebHashHistory } from 'vue-router'
import FileManagerView from '@/views/FileManagerView.vue'
import LoginView from '@/views/LoginView.vue'
import { useFilesStore } from '../stores/filesStore'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/filemanager',
    name: 'File Manager',
    component: FileManagerView
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  const filesStore = useFilesStore()

  // If User is logged in, redirect to FilesManager
  if (to.name == 'Login' && filesStore.token) {
    return { name: 'File Manager' }
  }
  if (to.name != 'Login' && !filesStore.token) {
    return { name: 'Login' }
  }
})

router.afterEach((to, from) => {
  console.log('Router to =>', to)
})

export default router
