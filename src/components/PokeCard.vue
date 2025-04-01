<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue'

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

defineProps<{
  pokemonList: Pokemon[]
}>()

const emit = defineEmits(['add-to-poke', 'remove-from-poke'])

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

// Reactive list of Pokémon in local storage
const monPersoList = ref<Pokemon[]>([])

// Load Pokémon from local storage on mount
onMounted(() => {
  const storedPokemon = localStorage.getItem('monPersoList')
  if (storedPokemon) {
    monPersoList.value = JSON.parse(storedPokemon)
  }
})

// Watch for changes in local storage
watch(
  monPersoList,
  (newList) => {
    localStorage.setItem('monPersoList', JSON.stringify(newList))
  },
  { deep: true },
)

// Check if a Pokémon is in the personal list
function isInPersonalList(pokemon: Pokemon): boolean {
  return monPersoList.value.some((p) => p.name === pokemon.name)
}

// Add Pokémon to personal list
function addToPoke(pokemon: Pokemon) {
  if (!isInPersonalList(pokemon)) {
    monPersoList.value.push(pokemon)
    emit('add-to-poke', pokemon)
  }
}

// Remove Pokémon from personal list
function removeFromPoke(pokemon: Pokemon) {
  monPersoList.value = monPersoList.value.filter((p) => p.name !== pokemon.name)
  emit('remove-from-poke', pokemon)
}

function getLuminance(color: string): number {
  const hex = color.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor)
  return luminance > 0.5 ? 'black' : 'white'
}
</script>

<template>
  <div class="grid-container">
    <div
      class="card"
      v-for="pokemon in pokemonList"
      :key="pokemon.name"
      :style="{ backgroundImage: `url(${pokemon.sprites.front_default})` }"
    >
      <div class="cover"></div>
      <div class="content">
        <h5>{{ pokemon.name }}</h5>
        <div class="types">
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
        <button v-if="!isInPersonalList(pokemon)" @click="addToPoke(pokemon)">
          Add to Pokédex
        </button>
        <button v-else @click="removeFromPoke(pokemon)" class="remove-button">
          Remove from Pokédex
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  padding: 16px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 20em;
  color: white;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(339deg, rgba(0, 0, 0, 0.8) 22%, rgba(0, 212, 255, 0) 100%);
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  padding: 16px;
  text-align: right;
}

.card h5 {
  font-size: 1.5em;
  font-weight: bold;
  color: white;
  text-transform: capitalize;
  margin: 0;
}

.types {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  margin-top: 8px;
}

.types span {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  text-transform: capitalize;
  font-weight: bold;
}

button {
  margin-top: 1em;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  border: none;
  background-color: rgb(8, 98, 8);
  color: white;
  cursor: pointer;
  transition: background-color;
  transition-duration: 0.5s;
  &:hover {
    background-color: green;
  }
}

.remove-button {
  background-color: rgb(139, 0, 0);
  &:hover {
    background-color: red;
  }
}
</style>
