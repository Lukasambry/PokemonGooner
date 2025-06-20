import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetailView from '../views/PokemonDetailView.vue'
import MyTeamView from '../views/MyTeamView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/pokemon/:idOrName',
    name: 'pokemon-detail',
    component: PokemonDetailView,
    props: true
  },
  {
    path: '/my-team',
    name: 'my-team',
    component: MyTeamView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
