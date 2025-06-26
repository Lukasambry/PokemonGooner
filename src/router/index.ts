import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetailView from '../views/PokemonDetailView.vue'
import MyTeamView from '../views/MyTeamView.vue'
import BerriesView from '../views/BerriesView.vue'
import BerryDetailView from '../views/BerryDetailView.vue'

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
  },
  {
    path: '/berries',
    name: 'berries',
    component: BerriesView
  },
  {
    path: '/berry/:idOrName',
    name: 'berry-detail',
    component: BerryDetailView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router