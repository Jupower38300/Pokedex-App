<template>
  <div class="content" id="main">
    <h1>My Pokedex</h1>
    <div class="grid-container">
      <div v-for="pokemon in personalPokedex" :key="pokemon.name" class="card-link">
        <router-link
          :to="{ name: 'pokemon-detail', params: { pokemonName: pokemon.name } }"
          class="card"
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
          </div>
        </router-link>
        <button @click.stop="removeFromPokedex(pokemon)" class="remove-button">
          Remove from Pokédex
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const personalPokedex = ref<Pokemon[]>([])

onMounted(() => {
  const savedPokedex = localStorage.getItem('monPersoList')
  if (savedPokedex) {
    personalPokedex.value = JSON.parse(savedPokedex)
  }
})

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

function getTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor)
  return luminance > 0.5 ? 'black' : 'white'
}

function getLuminance(color: string): number {
  const hex = color.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function removeFromPokedex(pokemon: Pokemon) {
  personalPokedex.value = personalPokedex.value.filter((p) => p.name !== pokemon.name)
  localStorage.setItem('monPersoList', JSON.stringify(personalPokedex.value))
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  padding: 16px;
}

.card-link {
  position: relative;
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
  cursor: pointer;
  text-decoration: none;
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
  font-size: 1.2em;
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

.remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  background-color: #8b0000;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #ff0000;
}

h1 {
  color: white;
  font-weight: bold;
  font-size: 3em;
}

#main {
  text-align: center;
}
</style>
