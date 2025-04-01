<template>
  <div class="page">
    <div class="search">
      <!-- Desktop: filters always visible -->
      <template v-if="!isMobile">
        <div class="filter-group">
          <label for="generation-dropdown">Generation:</label>
          <div class="custom-dropdown">
            <button
              id="generation-dropdown"
              class="dropdown-toggle"
              @click="toggleDropdown('generation')"
              @keydown="onDropdownKeyDown($event, 'generation')"
              :aria-expanded="openDropdown === 'generation'"
              aria-haspopup="listbox"
            >
              <span v-if="selectedGeneration">
                {{ getGenerationName(selectedGeneration) }}
              </span>
              <span v-else>All Generations</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <ul
              v-if="openDropdown === 'generation'"
              class="dropdown-menu"
              role="listbox"
              aria-labelledby="generation-dropdown"
              @keydown="handleListKeyDown($event, 'generation')"
            >
              <li
                role="option"
                @click="selectGeneration('')"
                @keydown.enter="selectGeneration('')"
                @keydown.space.prevent="selectGeneration('')"
                :aria-selected="!selectedGeneration"
                tabindex="0"
                ref="generationItems"
              >
                All Generations
              </li>
              <li
                v-for="(gen, index) in generations"
                :key="index"
                role="option"
                @click="selectGeneration(gen.url)"
                @keydown.enter="selectGeneration(gen.url)"
                @keydown.space.prevent="selectGeneration(gen.url)"
                :aria-selected="selectedGeneration === gen.url"
                :class="'gen-' + (index + 1)"
                :style="{
                  color: getGenerationTextColor(index + 1),
                  'background-color': getGenerationColor(index + 1),
                }"
                tabindex="0"
                ref="generationItems"
              >
                <span class="generation-badge">Gen {{ index + 1 }}</span>
                {{ gen.name.replace(/^Gen \w+ /, '') }}
              </li>
            </ul>
          </div>
        </div>

        <div class="filter-group">
          <label for="type1-dropdown">Type 1:</label>
          <div class="custom-dropdown">
            <button
              id="type1-dropdown"
              class="dropdown-toggle"
              @click="toggleDropdown('type1')"
              @keydown="onDropdownKeyDown($event, 'type1')"
              :aria-expanded="openDropdown === 'type1'"
              aria-haspopup="listbox"
            >
              <span
                v-if="selectedType1"
                class="type-badge"
                :style="{
                  backgroundColor: getTypeColor(selectedType1),
                  color: getTypeTextColor(selectedType1),
                }"
              >
                <img :src="getTypeIcon(selectedType1)" :alt="selectedType1" class="type-icon" />
                {{ selectedType1 }}
              </span>
              <span v-else>Select a type</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <ul
              v-if="openDropdown === 'type1'"
              class="dropdown-menu"
              role="listbox"
              aria-labelledby="type1-dropdown"
              @keydown="handleListKeyDown($event, 'type1')"
            >
              <li
                role="option"
                @click="selectType1('')"
                @keydown.enter="selectType1('')"
                @keydown.space.prevent="selectType1('')"
                :aria-selected="!selectedType1"
                tabindex="0"
                ref="type1Items"
              >
                Select a type
              </li>
              <li
                v-for="type in types"
                :key="type.name"
                role="option"
                @click="selectType1(type.name)"
                @keydown.enter="selectType1(type.name)"
                @keydown.space.prevent="selectType1(type.name)"
                :aria-selected="selectedType1 === type.name"
                :style="{
                  color: getTypeTextColor(type.name),
                  backgroundColor: getTypeColor(type.name),
                }"
                tabindex="0"
                ref="type1Items"
              >
                <img :src="getTypeIcon(type.name)" :alt="type.name" class="type-icon" />
                {{ type.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="filter-group">
          <label for="type2-dropdown">Type 2:</label>
          <div class="custom-dropdown">
            <button
              id="type2-dropdown"
              class="dropdown-toggle"
              @click="toggleDropdown('type2')"
              @keydown="onDropdownKeyDown($event, 'type2')"
              :aria-expanded="openDropdown === 'type2'"
              aria-haspopup="listbox"
            >
              <span
                v-if="selectedType2"
                class="type-badge"
                :style="{
                  backgroundColor: getTypeColor(selectedType2),
                  color: getTypeTextColor(selectedType2),
                }"
              >
                <img :src="getTypeIcon(selectedType2)" :alt="selectedType2" class="type-icon" />
                {{ selectedType2 }}
              </span>
              <span v-else>Select a type</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            <ul
              v-if="openDropdown === 'type2'"
              class="dropdown-menu"
              role="listbox"
              aria-labelledby="type2-dropdown"
              @keydown="handleListKeyDown($event, 'type2')"
            >
              <li
                role="option"
                @click="selectType2('')"
                @keydown.enter="selectType2('')"
                @keydown.space.prevent="selectType2('')"
                :aria-selected="!selectedType2"
                tabindex="0"
                ref="type2Items"
              >
                Select a type
              </li>
              <li
                v-for="type in types"
                :key="type.name"
                role="option"
                @click="selectType2(type.name)"
                @keydown.enter="selectType2(type.name)"
                @keydown.space.prevent="selectType2(type.name)"
                :aria-selected="selectedType2 === type.name"
                :style="{
                  color: getTypeTextColor(type.name),
                  backgroundColor: getTypeColor(type.name),
                }"
                tabindex="0"
                ref="type2Items"
              >
                <img :src="getTypeIcon(type.name)" :alt="type.name" class="type-icon" />
                {{ type.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="filter-group">
          <label for="search">Search:</label>
          <input
            id="search"
            type="text"
            v-model="searchQuery"
            placeholder="Search Pokémon..."
            aria-label="Search Pokémon"
            @keydown.enter="emitFilters"
          />
        </div>
      </template>

      <!-- Mobile: filter button + popup -->
      <template v-else>
        <button class="filter-button" @click="showFilters = true" aria-label="Open filters">
          <span>Filters</span>
          <span class="filter-badge" v-if="filterCount > 0">{{ filterCount }}</span>
        </button>
        <div v-if="showFilters" class="mobile-popup-overlay" @click.self="showFilters = false">
          <div class="mobile-popup">
            <div class="popup-header">
              <h2>Filters</h2>
              <button class="close-button" @click="showFilters = false" aria-label="Close filters">
                &times;
              </button>
            </div>

            <div class="filter-group">
              <label for="mobile-generation-dropdown">Generation:</label>
              <div class="custom-dropdown">
                <button
                  id="mobile-generation-dropdown"
                  class="dropdown-toggle"
                  @click="toggleDropdown('mobileGeneration')"
                  @keydown="onDropdownKeyDown($event, 'mobileGeneration')"
                  :aria-expanded="openDropdown === 'mobileGeneration'"
                  aria-haspopup="listbox"
                >
                  <span v-if="selectedGeneration">
                    {{ getGenerationName(selectedGeneration) }}
                  </span>
                  <span v-else>All Generations</span>
                  <span class="dropdown-arrow">▼</span>
                </button>
                <ul
                  v-if="openDropdown === 'mobileGeneration'"
                  class="dropdown-menu"
                  role="listbox"
                  aria-labelledby="mobile-generation-dropdown"
                  @keydown="handleListKeyDown($event, 'mobileGeneration')"
                >
                  <li
                    role="option"
                    @click="selectGeneration('')"
                    @keydown.enter="selectGeneration('')"
                    @keydown.space.prevent="selectGeneration('')"
                    :aria-selected="!selectedGeneration"
                    tabindex="0"
                    ref="mobileGenerationItems"
                  >
                    All Generations
                  </li>
                  <li
                    v-for="(gen, index) in generations"
                    :key="index"
                    role="option"
                    @click="selectGeneration(gen.url)"
                    @keydown.enter="selectGeneration(gen.url)"
                    @keydown.space.prevent="selectGeneration(gen.url)"
                    :aria-selected="selectedGeneration === gen.url"
                    :style="{
                      color: getGenerationTextColor(index + 1),
                      backgroundColor: getGenerationColor(index + 1),
                    }"
                    tabindex="0"
                    ref="mobileGenerationItems"
                  >
                    <span class="generation-badge">Gen {{ index + 1 }}</span>
                    {{ gen.name.replace(/^Gen \w+ /, '') }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="filter-group">
              <label for="mobile-type1-dropdown">Type 1:</label>
              <div class="custom-dropdown">
                <button
                  id="mobile-type1-dropdown"
                  class="dropdown-toggle"
                  @click="toggleDropdown('mobileType1')"
                  @keydown="onDropdownKeyDown($event, 'mobileType1')"
                  :aria-expanded="openDropdown === 'mobileType1'"
                  aria-haspopup="listbox"
                >
                  <span
                    v-if="selectedType1"
                    class="type-badge"
                    :style="{
                      backgroundColor: getTypeColor(selectedType1),
                      color: getTypeTextColor(selectedType1),
                    }"
                  >
                    <img :src="getTypeIcon(selectedType1)" :alt="selectedType1" class="type-icon" />
                    {{ selectedType1 }}
                  </span>
                  <span v-else>Select a type</span>
                  <span class="dropdown-arrow">▼</span>
                </button>
                <ul
                  v-if="openDropdown === 'mobileType1'"
                  class="dropdown-menu"
                  role="listbox"
                  aria-labelledby="mobile-type1-dropdown"
                  @keydown="handleListKeyDown($event, 'mobileType1')"
                >
                  <li
                    role="option"
                    @click="selectType1('')"
                    @keydown.enter="selectType1('')"
                    @keydown.space.prevent="selectType1('')"
                    :aria-selected="!selectedType1"
                    tabindex="0"
                    ref="mobileType1Items"
                  >
                    Select a type
                  </li>
                  <li
                    v-for="type in types"
                    :key="type.name"
                    role="option"
                    @click="selectType1(type.name)"
                    @keydown.enter="selectType1(type.name)"
                    @keydown.space.prevent="selectType1(type.name)"
                    :aria-selected="selectedType1 === type.name"
                    :style="{
                      color: getTypeTextColor(type.name),
                      backgroundColor: getTypeColor(type.name),
                    }"
                    tabindex="0"
                    ref="mobileType1Items"
                  >
                    <img :src="getTypeIcon(type.name)" :alt="type.name" class="type-icon" />
                    {{ type.name }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="filter-group">
              <label for="mobile-type2-dropdown">Type 2:</label>
              <div class="custom-dropdown">
                <button
                  id="mobile-type2-dropdown"
                  class="dropdown-toggle"
                  @click="toggleDropdown('mobileType2')"
                  @keydown="onDropdownKeyDown($event, 'mobileType2')"
                  :aria-expanded="openDropdown === 'mobileType2'"
                  aria-haspopup="listbox"
                >
                  <span
                    v-if="selectedType2"
                    class="type-badge"
                    :style="{
                      backgroundColor: getTypeColor(selectedType2),
                      color: getTypeTextColor(selectedType2),
                    }"
                  >
                    <img :src="getTypeIcon(selectedType2)" :alt="selectedType2" class="type-icon" />
                    {{ selectedType2 }}
                  </span>
                  <span v-else>Select a type</span>
                  <span class="dropdown-arrow">▼</span>
                </button>
                <ul
                  v-if="openDropdown === 'mobileType2'"
                  class="dropdown-menu"
                  role="listbox"
                  aria-labelledby="mobile-type2-dropdown"
                  @keydown="handleListKeyDown($event, 'mobileType2')"
                >
                  <li
                    role="option"
                    @click="selectType2('')"
                    @keydown.enter="selectType2('')"
                    @keydown.space.prevent="selectType2('')"
                    :aria-selected="!selectedType2"
                    tabindex="0"
                    ref="mobileType2Items"
                  >
                    Select a type
                  </li>
                  <li
                    v-for="type in types"
                    :key="type.name"
                    role="option"
                    @click="selectType2(type.name)"
                    @keydown.enter="selectType2(type.name)"
                    @keydown.space.prevent="selectType2(type.name)"
                    :aria-selected="selectedType2 === type.name"
                    :style="{
                      color: getTypeTextColor(type.name),
                      backgroundColor: getTypeColor(type.name),
                    }"
                    tabindex="0"
                    ref="mobileType2Items"
                  >
                    <img :src="getTypeIcon(type.name)" :alt="type.name" class="type-icon" />
                    {{ type.name }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="filter-group">
              <label for="mobile-search">Search:</label>
              <input
                id="mobile-search"
                type="text"
                v-model="searchQuery"
                placeholder="Search Pokémon..."
                aria-label="Search Pokémon"
                @keydown.enter="emitFilters"
              />
            </div>

            <div class="popup-actions">
              <button class="reset-button" @click="resetFilters">Reset Filters</button>
              <button class="apply-button" @click="showFilters = false">Apply Filters</button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick, onUnmounted } from 'vue'

const selectedType1 = ref<string>('')
const selectedType2 = ref<string>('')
const searchQuery = ref<string>('')
const types = ref<{ name: string }[]>([])
const selectedGeneration = ref<string>('')
const openDropdown = ref<string | null>(null)
const showFilters = ref(false)

// Refs for dropdown items
const generationItems = ref<HTMLElement[]>([])
const type1Items = ref<HTMLElement[]>([])
const type2Items = ref<HTMLElement[]>([])
const mobileGenerationItems = ref<HTMLElement[]>([])
const mobileType1Items = ref<HTMLElement[]>([])
const mobileType2Items = ref<HTMLElement[]>([])

const currentFocusIndex = ref(-1)

const generations = ref<{ name: string; url: string }[]>([
  { name: 'Gen I (1-151)', url: 'https://pokeapi.co/api/v2/generation/1/' },
  { name: 'Gen II (152-251)', url: 'https://pokeapi.co/api/v2/generation/2/' },
  { name: 'Gen III (252-386)', url: 'https://pokeapi.co/api/v2/generation/3/' },
  { name: 'Gen IV (387-493)', url: 'https://pokeapi.co/api/v2/generation/4/' },
  { name: 'Gen V (494-649)', url: 'https://pokeapi.co/api/v2/generation/5/' },
  { name: 'Gen VI (650-721)', url: 'https://pokeapi.co/api/v2/generation/6/' },
  { name: 'Gen VII (722-809)', url: 'https://pokeapi.co/api/v2/generation/7/' },
  { name: 'Gen VIII (810-905)', url: 'https://pokeapi.co/api/v2/generation/8/' },
  { name: 'Gen IX (906-1010)', url: 'https://pokeapi.co/api/v2/generation/9/' },
])

// Color definitions
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

const generationColors: Record<number, string> = {
  1: '#FF0000',
  2: '#4EAD00',
  3: '#0058F8',
  4: '#B8B8D0',
  5: '#000000',
  6: '#7038F8',
  7: '#F85888',
  8: '#705848',
  9: '#EE99AC',
}

// Compute filter count for mobile badge
const filterCount = computed(() => {
  let count = 0
  if (selectedGeneration.value) count++
  if (selectedType1.value) count++
  if (selectedType2.value) count++
  if (searchQuery.value) count++
  return count
})

// Color utility functions
function getLuminance(color: string): number {
  const hex = color.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function getTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor)
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

function getTypeColor(typeName: string): string {
  return typeColors[typeName.toLowerCase()] || '#777777'
}

function getTypeTextColor(typeName: string): string {
  return getTextColor(getTypeColor(typeName))
}

function getGenerationColor(genNumber: number): string {
  return generationColors[genNumber] || '#777777'
}

function getGenerationTextColor(genNumber: number): string {
  return getTextColor(getGenerationColor(genNumber))
}

function getGenerationName(url: string): string {
  const gen = generations.value.find((g) => g.url === url)
  return gen ? gen.name : ''
}

function getTypeIcon(typeName: string): string {
  return `https://duiker101.github.io/pokemon-type-svg-icons/icons/${typeName.toLowerCase()}.svg`
}

// Dropdown functions
function toggleDropdown(dropdownName: string) {
  if (openDropdown.value === dropdownName) {
    openDropdown.value = null
  } else {
    openDropdown.value = dropdownName
    currentFocusIndex.value = 0
    nextTick(() => {
      focusFirstItem(dropdownName)
    })
  }
}

function focusFirstItem(dropdownName: string) {
  let items: HTMLElement[] = []
  switch (dropdownName) {
    case 'generation':
      items = generationItems.value
      break
    case 'type1':
      items = type1Items.value
      break
    case 'type2':
      items = type2Items.value
      break
    case 'mobileGeneration':
      items = mobileGenerationItems.value
      break
    case 'mobileType1':
      items = mobileType1Items.value
      break
    case 'mobileType2':
      items = mobileType2Items.value
      break
  }
  if (items.length > 0) {
    items[0].focus()
  }
}

function selectGeneration(url: string) {
  selectedGeneration.value = url
  openDropdown.value = null
  handleGenerationChange()
}

function selectType1(type: string) {
  selectedType1.value = type
  openDropdown.value = null
  emitFilters()
}

function selectType2(type: string) {
  selectedType2.value = type
  openDropdown.value = null
  emitFilters()
}

function resetFilters() {
  selectedGeneration.value = ''
  selectedType1.value = ''
  selectedType2.value = ''
  searchQuery.value = ''
  emit('generationChange', '')
  emitFilters()
}

async function fetchTypes() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type')
    const data = await response.json()
    types.value = data.results.filter(
      (type: { name: string }) => !['unknown', 'shadow'].includes(type.name),
    )
  } catch (error) {
    console.error('Error fetching types:', error)
  }
}

// Keyboard navigation
function onDropdownKeyDown(event: KeyboardEvent, dropdownName: string) {
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault()
    toggleDropdown(dropdownName)
  } else if (event.key === 'Escape') {
    openDropdown.value = null
  }
}

function handleListKeyDown(event: KeyboardEvent, dropdownName: string) {
  const key = event.key
  let items: HTMLElement[] = []
  let selectedValue = ''

  switch (dropdownName) {
    case 'generation':
      items = generationItems.value
      selectedValue = selectedGeneration.value
      break
    case 'type1':
      items = type1Items.value
      selectedValue = selectedType1.value
      break
    case 'type2':
      items = type2Items.value
      selectedValue = selectedType2.value
      break
    case 'mobileGeneration':
      items = mobileGenerationItems.value
      selectedValue = selectedGeneration.value
      break
    case 'mobileType1':
      items = mobileType1Items.value
      selectedValue = selectedType1.value
      break
    case 'mobileType2':
      items = mobileType2Items.value
      selectedValue = selectedType2.value
      break
  }

  if (key === 'Escape') {
    openDropdown.value = null
    return
  }

  if (key === 'ArrowDown') {
    event.preventDefault()
    currentFocusIndex.value = (currentFocusIndex.value + 1) % items.length
    items[currentFocusIndex.value]?.focus()
  } else if (key === 'ArrowUp') {
    event.preventDefault()
    currentFocusIndex.value = (currentFocusIndex.value - 1 + items.length) % items.length
    items[currentFocusIndex.value]?.focus()
  } else if (key === 'Enter' || key === ' ') {
    event.preventDefault()
    if (currentFocusIndex.value >= 0) {
      items[currentFocusIndex.value].click()
    }
  } else if (key === 'Home') {
    event.preventDefault()
    currentFocusIndex.value = 0
    items[0]?.focus()
  } else if (key === 'End') {
    event.preventDefault()
    currentFocusIndex.value = items.length - 1
    items[items.length - 1]?.focus()
  } else if (key === 'Tab') {
    openDropdown.value = null
  }
}

// Emit filters to parent
const emit = defineEmits(['filter', 'generationChange'])

function handleGenerationChange() {
  emit('generationChange', selectedGeneration.value)
  emitFilters()
}

function emitFilters() {
  emit('filter', {
    type1: selectedType1.value,
    type2: selectedType2.value,
    query: searchQuery.value,
    generation: selectedGeneration.value,
  })
}

watch([selectedType1, selectedType2, searchQuery, selectedGeneration], () => {
  emitFilters()
})

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.custom-dropdown')) {
    openDropdown.value = null
  }
}

// Responsive flag
const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', updateIsMobile)
  document.addEventListener('click', handleClickOutside)
  fetchTypes()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
/* Base styles */
.page {
  font-family: 'Roboto', sans-serif;
}

.search {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  padding: 1rem;
  background-color: #2c2c2c;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 180px;
}

label {
  color: white;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

input {
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background-color: #f5f5f5;
  width: 100%;
}

/* Custom dropdown styles */
.custom-dropdown {
  position: relative;
  width: 100%;
}

.dropdown-toggle {
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: white;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dropdown-toggle:hover {
  border-color: #aaa;
}

.dropdown-toggle:focus {
  outline: 2px solid #ffcc00;
  outline-offset: 2px;
}

.dropdown-arrow {
  font-size: 0.7rem;
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
}

.custom-dropdown[aria-expanded='true'] .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  margin-top: 0.25rem;
  padding: 0.25rem;
  list-style: none;
}

.dropdown-menu li {
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.dropdown-menu li:hover {
  filter: brightness(1.1);
  transform: translateX(2px);
}

.dropdown-menu li:focus {
  outline: 2px solid #ffcc00;
  outline-offset: 2px;
}

/* Type badges */
.type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-weight: bold;
  font-size: 0.8rem;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}

.type-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.3rem;
}

/* Generation badges */
.generation-badge {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
}

/* Mobile styles */
@media (max-width: 768px) {
  .search {
    margin-top: 80px;
    position: sticky;
    top: 60px;
    z-index: 90;
    background-color: transparent;
    box-shadow: none;
    padding: 0.5rem;
  }

  .filter-button {
    background-color: #ffcc00;
    color: #2c2c2c;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .filter-badge {
    background-color: #ff3333;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
  }

  .mobile-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mobile-popup {
    background-color: white;
    border-radius: 1rem;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .popup-header h2 {
    margin: 0;
    color: #2c2c2c;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0.5rem;
  }

  .popup-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .reset-button {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ccc;
    background-color: white;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: bold;
  }

  .apply-button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background-color: #ffcc00;
    color: #2c2c2c;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
