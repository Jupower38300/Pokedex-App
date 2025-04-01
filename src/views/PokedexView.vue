<template>
  <section>
    <h1>Pokédex Global</h1>
    <div class="sticky-header">
      <Search @filter="handleFilter" @generation-change="handleGenerationChange" />
    </div>
    <PokeCard
      :pokemonList="currentPokemonList"
      :monPersoList="monPersoList"
      @add-to-poke="addToPoke"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import PokeCard from '@/components/PokeCard.vue'
import Search from '@/components/Search.vue'

interface Pokemon {
  name: string
  sprites: {
    front_default: string
  }
  types: {
    type: {
      name: string
    }
  }[]
}

interface PokemonResponse {
  results: {
    name: string
    url: string
  }[]
}

const pokemonList = ref<Pokemon[]>([]) // Regular infinite scroll list
const generationPokemonList = ref<Pokemon[]>([]) // Generation-specific list
const offset = ref<number>(0)
const monPersoList = ref<Pokemon[]>([])
const filterType1 = ref<string>('')
const filterType2 = ref<string>('')
const searchQuery = ref<string>('')
const loading = ref(false)
const isGenerationSelected = ref(false)
const filterGeneration = ref<string>('')

// Computed property to decide which list to show and apply filters
const currentPokemonList = computed(() => {
  const list = isGenerationSelected.value ? generationPokemonList.value : pokemonList.value
  return list.filter((pokemon) => {
    const matchesType1 =
      !filterType1.value || pokemon.types.some((type) => type.type.name === filterType1.value)
    const matchesType2 =
      !filterType2.value || pokemon.types.some((type) => type.type.name === filterType2.value)
    const matchesSearch =
      !searchQuery.value || pokemon.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesType1 && matchesType2 && matchesSearch
  })
})

onMounted(() => {
  const savedPokedex = localStorage.getItem('monPersoList')
  if (savedPokedex) {
    monPersoList.value = JSON.parse(savedPokedex)
  }
  window.addEventListener('scroll', handleScroll)
  fetchMons()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function handleScroll() {
  if (isGenerationSelected.value || loading.value) return

  const bottomThreshold = 100
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  if (scrollHeight - (scrollTop + clientHeight) < bottomThreshold) {
    addMons()
  }
}

async function addMons(): Promise<void> {
  offset.value += 20
  await fetchMons()
}

function addToPoke(pokemon: Pokemon): void {
  const isAlreadyAdded = monPersoList.value.some((p) => p.name === pokemon.name)
  if (!isAlreadyAdded) {
    monPersoList.value.push(pokemon)
    localStorage.setItem('monPersoList', JSON.stringify(monPersoList.value))
  }
}

async function fetchMons(reset = false): Promise<void> {
  try {
    loading.value = true
    if (reset) {
      pokemonList.value = []
      offset.value = 0
    }

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset.value}`,
    )
    const data: PokemonResponse = await response.json()

    const newPokemon = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailsResponse = await fetch(pokemon.url)
        return detailsResponse.json()
      }),
    )

    pokemonList.value = reset ? newPokemon : [...pokemonList.value, ...newPokemon]
  } catch (error) {
    console.error('Failed to fetch Pokémon', error)
  } finally {
    loading.value = false
  }
}

async function handleGenerationChange(generationUrl: string): Promise<void> {
  if (!generationUrl) {
    // Réinitialisation à la liste classique avec scroll infini
    isGenerationSelected.value = false
    filterGeneration.value = ''
    if (pokemonList.value.length === 0) {
      await fetchMons(true)
    }
    return
  }

  try {
    loading.value = true
    isGenerationSelected.value = true
    filterGeneration.value = generationUrl

    const response = await fetch(generationUrl)
    const data = await response.json()

    const results = await Promise.allSettled(
      data.pokemon_species.map(async (species: { name: string }) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`)
        if (!res.ok) {
          throw new Error(`Erreur pour ${species.name}`)
        }
        return res.json()
      }),
    )

    generationPokemonList.value = results
      .filter((result) => result.status === 'fulfilled')
      .map((result: PromiseFulfilledResult<any>) => result.value)
  } catch (error) {
    console.error('Failed to fetch generation Pokémon', error)
  } finally {
    loading.value = false
  }
}
function handleFilter(filter: { type1: string; type2: string; query: string }) {
  filterType1.value = filter.type1
  filterType2.value = filter.type2
  searchQuery.value = filter.query
}
</script>

<style scoped>
section {
  width: 100%;
  min-height: 100vh;
  text-align: center;
}

h1 {
  color: white;
  font-weight: bold;
  font-size: 3em;
  margin-bottom: 20px;
  padding-top: 16px;
}

.sticky-header {
  position: sticky;
  top: 7.5em;
  z-index: 100;
}

@media (max-width: 768px) {
  h1 {
    margin-top: 2em;
  }

  .sticky-header {
    top: 12em;
  }
}
</style>
