<template>
  <div v-if="pokemon" class="main">
    <div class="pokemon_info">
      <div class="firstPart">
        <img :src="pokemon.sprites.front_default" alt="Pokemon Sprite" />

        <div class="stats">
          <h2>Stats</h2>
          <ul>
            <li v-for="(stat, index) in pokemon.stats" :key="index" class="stats_bar">
              <strong>{{ stat.stat.name }}:</strong> {{ stat.base_stat }}
              <div class="stat-bar">
                <div
                  class="stat-bar-fill"
                  :style="{
                    width: '0%',
                    '--target-width': `${(stat.base_stat / 255) * 100}%`,
                    backgroundColor: getStatColor(stat.stat.name),
                  }"
                ></div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="secondPart">
        <h1>{{ pokemon.name }}</h1>
        <div class="details">
          <div class="general">
            <h2>Details</h2>
            <p><strong>Height:</strong> {{ pokemon.height }} dm</p>
            <p><strong>Weight:</strong> {{ pokemon.weight }} hg</p>
            <p><strong>Base Experience:</strong> {{ pokemon.base_experience }}</p>
          </div>
          <div class="abilities">
            <h2>Abilities</h2>
            <ul>
              <li v-for="(ability, index) in pokemon.abilities" :key="index">
                {{ ability.ability.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="types">
          <h2>Types</h2>
          <span
            v-for="(type, index) in pokemon.types"
            :key="index"
            :style="{
              backgroundColor: typeColors[type.type.name],
              color: getTextColor(typeColors[type.type.name]),
            }"
          >
            {{ type.type.name }}
          </span>
        </div>

        <div class="weaknesses">
          <h2>Weaknesses</h2>
          <div>
            <span
              v-for="[typeName, multiplier] in Object.entries(weaknesses)"
              :key="typeName"
              :style="{
                backgroundColor: typeColors[typeName],
                color: getTextColor(typeColors[typeName]),
              }"
            >
              {{ typeName }} ({{ multiplier }}x)
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="evos">
      <div class="evo-container">
        <h2>Evolution Chain</h2>
        <div class="evo-chain">
          <router-link
            v-for="(evo, index) in evolutionChain"
            :key="index"
            :to="{ name: 'pokemon-detail', params: { pokemonName: evo.name } }"
            class="evo-card"
            :style="{ backgroundImage: `url(${evo.sprite})` }"
          >
            <div class="cover"></div>
            <div class="content">
              <h5>{{ evo.name }}</h5>
              <div class="types">
                <span
                  v-for="(type, index) in evo.types"
                  :key="index"
                  :style="{
                    backgroundColor: typeColors[type.type.name],
                    color: getTextColor(typeColors[type.type.name]),
                  }"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading Pokémon details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Pokemon {
  name: string
  sprites: {
    front_default: string
  }
  height: number
  weight: number
  base_experience: number
  types: {
    type: {
      name: string
      url: string
    }
  }[]
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
  abilities: {
    ability: {
      name: string
    }
  }[]
  species: {
    url: string
  }
}

interface EvolutionChain {
  name: string
  sprite: string
  types: {
    type: {
      name: string
    }
  }[]
}

const route = useRoute()
const router = useRouter()
const pokemon = ref<Pokemon | null>(null)
const weaknesses = ref<Record<string, number>>({})
const evolutionChain = ref<EvolutionChain[]>([])

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
}

const fetchPokemonData = async (pokemonName: string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const data = await response.json()

    // Fetch type details for each Pokemon type
    const typeResponses = await Promise.all(data.types.map((t: any) => fetch(t.type.url)))
    const typeDataArray = await Promise.all(typeResponses.map((res) => res.json()))

    // Calculate weaknesses
    const calculatedWeaknesses: Record<string, number> = {}
    const allTypes = Object.keys(typeColors)

    allTypes.forEach((attackingType) => {
      let multiplier = 1
      typeDataArray.forEach((typeData) => {
        const relations = typeData.damage_relations
        if (relations.double_damage_from.some((t: any) => t.name === attackingType)) {
          multiplier *= 2
        } else if (relations.half_damage_from.some((t: any) => t.name === attackingType)) {
          multiplier *= 0.5
        } else if (relations.no_damage_from.some((t: any) => t.name === attackingType)) {
          multiplier *= 0
        }
      })
      if (multiplier > 1) calculatedWeaknesses[attackingType] = multiplier
    })

    weaknesses.value = calculatedWeaknesses

    // Assign Pokemon data
    pokemon.value = {
      name: data.name,
      sprites: data.sprites,
      height: data.height,
      weight: data.weight,
      base_experience: data.base_experience,
      types: data.types,
      stats: data.stats,
      abilities: data.abilities,
      species: data.species,
    }

    const speciesResponse = await fetch(pokemon.value.species.url)
    const speciesData = await speciesResponse.json()
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url)
    const evolutionChainData = await evolutionChainResponse.json()
    evolutionChain.value = await parseEvolutionChain(evolutionChainData.chain)
  } catch (error) {
    console.error('Failed to fetch Pokémon details:', error)
  }
}

async function parseEvolutionChain(chain: any): Promise<EvolutionChain[]> {
  const evolutions: EvolutionChain[] = []

  const parseChain = async (node: any) => {
    const pokemonName = node.species.name
    try {
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      const pokemonData = await pokemonResponse.json()
      evolutions.push({
        name: pokemonName,
        sprite: pokemonData.sprites.front_default,
        types: pokemonData.types,
      })
    } catch (error) {
      console.error(`Failed to fetch details for ${pokemonName}:`, error)
    }

    if (node.evolves_to.length > 0) {
      for (const evolution of node.evolves_to) {
        await parseChain(evolution)
      }
    }
  }

  await parseChain(chain)
  return evolutions
}

function getTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor)
  return luminance > 0.5 ? 'black' : 'white'
}

function goToPokemon(pokemonName: string) {
  router.push(`/pokemon/${pokemonName}`)
}

function getLuminance(color: string): number {
  const hex = color.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getStatColor(statName: string): string {
  const statColors: Record<string, string> = {
    hp: '#FF5959',
    attack: '#F08030',
    defense: '#6890F0',
    'special-attack': '#F85888',
    'special-defense': '#78C850',
    speed: '#FA92B2',
  }
  return statColors[statName] || '#A8A878'
}

// Watch for changes in the route parameter
watch(
  () => route.params.pokemonName,
  (newPokemonName) => {
    if (newPokemonName) {
      fetchPokemonData(newPokemonName as string)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.details,
.types,
.stats,
.abilities,
.weaknesses {
  margin-bottom: 20px;
}

h1 {
  text-transform: capitalize;
}

img {
  max-width: 100%;
  height: auto;
}

.types span,
.weaknesses span {
  display: inline-block;
  padding: 4px 30px;
  border-radius: 4px;
  font-size: 0.9em;
  text-transform: capitalize;
  font-weight: bold;
  margin-right: 4px;
  margin-bottom: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 4px 0;
  color: white;
  text-transform: capitalize;
}

.stats_bar {
  margin-bottom: 10px;
  font-size: 1.1em;
  text-transform: uppercase;
  font-weight: bold;
}

.pokemon_info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  margin-top: 4em;
  margin-bottom: 8em;
}

.firstPart {
  width: 50%;
  margin-top: 4em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.firstPart img {
  width: 25em;
}

.secondPart {
  width: 50%;
  margin-top: 10em;
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100%;
}

.secondPart h1 {
  font-size: 3em;
  color: white;
  font-weight: bold;
  margin-right: 4em;
  margin-bottom: 0.5em;
}

.details {
  background-color: rgb(59, 59, 162);
  margin-right: 4em;
  height: 10em;
  padding: 1em;
  border-radius: 20px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

h2 {
  color: white;
  font-weight: bold;
  margin-right: 7em;
  margin-bottom: 0.5em;
}

.stats {
  width: 70%;
  background-color: rgb(41, 41, 44);
  padding: 1em;
  border-radius: 20px;
}

.stat-bar {
  width: 100%;
  height: 15px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 4px;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 5px;
  width: var(--target-width, 0);
  animation: fillAnimation 1.5s ease-in-out forwards;
}

@keyframes fillAnimation {
  from {
    width: 0;
  }
  to {
    width: var(--target-width, 0);
  }
}

/* Increased desktop spacing for evolutions */
.evos {
  margin-top: 12em;
  padding: 20px;
  background-color: rgb(41, 41, 44);
  border-radius: 20px 20px 0px 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.evo-container {
  text-align: center;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.evo-container h2 {
  margin: 0 0 1em 0;
}

.evo-chain {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.evo-card {
  cursor: pointer;
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: transform 0.2s;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 200px;
  background-size: cover;
  background-position: center;
}

.evo-card:hover {
  transform: scale(1.05);
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  padding: 10px;
}

.content h5 {
  margin: 0;
  font-size: 1.2em;
  text-transform: capitalize;
  font-weight: bold;
}

.content .types {
  margin: 10px 0;
}

.content .types span {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  text-transform: capitalize;
  font-weight: bold;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .types,
  .weaknesses {
    text-align: center;
    margin-right: 0;
  }

  .types h2,
  .weaknesses h2 {
    margin-right: 0;
  }

  .pokemon_info {
    flex-direction: column;
    height: auto;
    margin-top: 4em;
  }
  .firstPart,
  .secondPart {
    width: 100%;
    margin-top: 1em;
    align-items: center;
  }
  .firstPart img {
    width: 80%;
    max-width: 300px;
  }
  .secondPart h1 {
    font-size: 2em;
    margin-right: 0;
    text-align: center;
  }
  .details {
    flex-direction: column;
    align-items: center;
    margin-right: 0;
    height: auto;
  }
  .stats {
    width: 100%;
  }
  .evos {
    flex-direction: column;
    align-items: center;
    margin-top: 4em;
  }
  .evo-chain {
    flex-direction: column;
    gap: 20px;
  }
  .evo-card {
    width: 80%;
    height: auto;
    padding: 10px;
  }
  /* Center types and weaknesses on mobile */
  .types,
  .weaknesses {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .types,
  .weaknesses {
    text-align: center;
    margin-right: 0;
  }

  .types h2,
  .weaknesses h2 {
    margin-right: 0;
  }
  h1 {
    font-size: 1.8em;
  }
  h2 {
    font-size: 1.2em;
  }
  .stats_bar {
    font-size: 1em;
  }
  .evo-card {
    width: 90%;
  }
}
</style>
