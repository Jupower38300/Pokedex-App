<template>
  <div class="page">
    <div class="search">
      <!-- Desktop: filters always visible -->
      <template v-if="!isMobile">
        <div>
          <label for="generation">Generation:</label>
          <select id="generation" v-model="selectedGeneration" @change="handleGenerationChange">
            <option value="">All Generations</option>
            <option v-for="(gen, index) in generations" :key="index" :value="gen.url">
              {{ gen.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="type1">Type 1:</label>
          <select id="type1" v-model="selectedType1">
            <option value="">Select a type</option>
            <option v-for="type in types" :key="type.name" :value="type.name">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="type2">Type 2:</label>
          <select id="type2" v-model="selectedType2">
            <option value="">Select a type</option>
            <option v-for="type in types" :key="type.name" :value="type.name">
              {{ type.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="search">Search:</label>
          <input id="search" type="text" v-model="searchQuery" placeholder="Search Pokémon..." />
        </div>
      </template>
      <!-- Mobile: filter button + popup -->
      <template v-else>
        <button class="filter-button" @click="showFilters = true">Filtrer</button>
        <div class="mobile-popup" v-if="showFilters">
          <div>
            <label for="generation">Generation:</label>
            <select id="generation" v-model="selectedGeneration" @change="handleGenerationChange">
              <option value="">All Generations</option>
              <option v-for="(gen, index) in generations" :key="index" :value="gen.url">
                {{ gen.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="type1">Type 1:</label>
            <select id="type1" v-model="selectedType1">
              <option value="">Select a type</option>
              <option v-for="type in types" :key="type.name" :value="type.name">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="type2">Type 2:</label>
            <select id="type2" v-model="selectedType2">
              <option value="">Select a type</option>
              <option v-for="type in types" :key="type.name" :value="type.name">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="search">Search:</label>
            <input id="search" type="text" v-model="searchQuery" placeholder="Search Pokémon..." />
          </div>
          <button class="close-button" @click="showFilters = false">Fermer</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const selectedType1 = ref<string>('')
const selectedType2 = ref<string>('')
const searchQuery = ref<string>('')
const types = ref<{ name: string }[]>([])
const selectedGeneration = ref<string>('')

const generations = ref<{ name: string; url: string }[]>([
  { name: 'Gen I (1-151)', url: 'https://pokeapi.co/api/v2/generation/1/' },
  { name: 'Gen II (152-251)', url: 'https://pokeapi.co/api/v2/generation/2/' },
  { name: 'Gen III (252-386)', url: 'https://pokeapi.co/api/v2/generation/3/' },
  { name: 'Gen IV (387-493)', url: 'https://pokeapi.co/api/v2/generation/4/' },
  { name: 'Gen V (494-649)', url: 'https://pokeapi.co/api/v2/generation/5/' },
  { name: 'Gen VI (650-721)', url: 'https://pokeapi.co/api/v2/generation/6/' },
  { name: 'Gen VII (722-809)', url: 'https://pokeapi.co/api/v2/generation/7/' },
  { name: 'Gen VIII (810-905)', url: 'https://pokeapi.co/api/v2/generation/8/' },
])

async function fetchTypes() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type')
    const data = await response.json()
    types.value = data.results
  } catch (error) {
    console.error('Error fetching types:', error)
  }
}

async function fetchGenerations() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/generation')
    const data = await response.json()
    generations.value = data.results.map((g: { url: any }, index: number) => ({
      name: `Gen ${index + 1}`,
      url: g.url,
    }))
  } catch (error) {
    console.error('Error fetching generations:', error)
  }
}

const emit = defineEmits(['filter', 'generationChange'])

function handleGenerationChange() {
  emit('generationChange', selectedGeneration.value)
  // Clear other filters when generation changes
  selectedType1.value = ''
  selectedType2.value = ''
  searchQuery.value = ''
  emit('filter', {
    type1: '',
    type2: '',
    query: '',
  })
}

watch([selectedType1, selectedType2, searchQuery, selectedGeneration], () => {
  emit('filter', {
    type1: selectedType1.value,
    type2: selectedType2.value,
    query: searchQuery.value,
    generation: selectedGeneration.value,
  })
})

// Responsive flag and popup toggle for mobile
const showFilters = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
  fetchTypes()
  fetchGenerations()
})
</script>

<style scoped>
.search {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin: 20px;
  padding: 20px;
  background-color: #2c2c2c;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Maintain original desktop styles */
.search > div {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  color: white;
  font-weight: bold;
  font-size: 1.2em;
}

select {
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 10px;
  font-size: 1em;
  background-color: #f5f5f5;
  color: #333;
  cursor: pointer;
}

input {
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 10px;
  font-size: 1em;
  background-color: #f5f5f5;
  color: #333;
}

/* Mobile specific styles */
@media (max-width: 768px) {
  /* Increase margin-top for the search container to push the filter button lower */
  .search {
    margin-top: 140px; /* Increase as needed */
    position: sticky;
    top: 100px; /* Adjust to your header height */
  }
  .filter-button {
    background-color: #ffcc00;
    color: black;
    border: none;
    padding: 10px 20px;
    font-size: 1em;
    border-radius: 5px;
    cursor: pointer;
  }
  .mobile-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2c2c2c;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    width: 80%;
    z-index: 1000;
  }
  .mobile-popup > div {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-bottom: 10px;
  }
  .close-button {
    background-color: #ffcc00;
    color: black;
    border: none;
    padding: 10px 20px;
    font-size: 1em;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
}
</style>
``
