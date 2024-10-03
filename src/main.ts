import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './components/Dashboard.vue'
import ProjectForm from './components/ProjectForm.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/add-project', component: ProjectForm },
  { path: '/edit-project/:id', component: ProjectForm },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')