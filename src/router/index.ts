import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokedexView from '@/views/PokedexView.vue'
import PokedexPerso from '@/views/PokedexPerso.vue'
import PokemonDetails from '@/views/PokemonDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pokedex',
      name: 'pokedex',
      component: PokedexView,
    },
    {
      path: '/perso',
      name: 'persodex',
      component: PokedexPerso,
    },
    {
      path: '/pokemon/:pokemonName',
      name: 'pokemon-detail',
      component: PokemonDetails,
      props: true,
    },
  ],
})

export default router
