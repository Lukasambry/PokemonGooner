<script setup lang="ts">
import { ref, onMounted, watch, computed, type Ref } from 'vue'
import PokemonCard from '@/components/PokemonCard.vue'
import PokemonSearch from '@/components/PokemonSearch.vue'
import { usePokeApi, getTranslatedPokemonName, type PokemonListItem, type EnhancedPokemonDetail } from '@/composables/usePokeApi'
import { useLanguageStore } from '@/stores/languageStore'

interface DisplayPokemon {
  id: number;
  name: string;
  sprite: string;
  species_data?: any;
}

const {
  pokemons: allPokemons,
  loading,
  error,
  fetchPokemons,
  nextPageUrl,
  searchPokemonByName,
  fetchPokemonsByGeneration,
} = usePokeApi()

const languageStore = useLanguageStore()

watch(
  () => languageStore.currentLanguage,
  async () => {
    displayablePokemons.value = []
    await prepareDisplayablePokemons(allPokemons.value)
  }
)


const searchTerm: Ref<string> = ref('')
const displayablePokemons: Ref<DisplayPokemon[]> = ref([])
const searchResultPokemon: Ref<DisplayPokemon | null> = ref(null)

function extractPokemonId(url: string): number {
  const parts = url.split('/').filter(part => part);
  return parseInt(parts[parts.length - 1]);
}

async function prepareDisplayablePokemons(list: PokemonListItem[]) {
  const processedPokemons: DisplayPokemon[] = []
  for (const p of list) {
    const id = extractPokemonId(p.url)
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    const name = await getTranslatedPokemonName(id)
    processedPokemons.push({
      id: id,
      name: name,
      sprite: spriteUrl
    })
  }
  displayablePokemons.value.push(...processedPokemons)
}

onMounted(async () => {
  await fetchPokemons();
  if (allPokemons.value.length > 0) {
    await prepareDisplayablePokemons(allPokemons.value);
  }
});

async function loadMorePokemons() {
  if (nextPageUrl.value && !loading.value) {
    const currentCount = allPokemons.value.length;
    await fetchPokemons(nextPageUrl.value);
    const newPokemons = allPokemons.value.slice(currentCount);
    if (newPokemons.length > 0) {
      await prepareDisplayablePokemons(newPokemons);
    }
  }
}

async function handleSearch(query: string) {
  if (!query) {
    searchResultPokemon.value = null;
    return;
  }
  searchTerm.value = query;
  const result: EnhancedPokemonDetail | null = await searchPokemonByName(query);
  if (result) {
    searchResultPokemon.value = {
      id: result.id,
      name: result.name,
      sprite: result.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`,
      species_data: result.species_data
    };
  } else {
    searchResultPokemon.value = null;
  }
}

async function handleGenerationChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const gen = parseInt(target.value);
  displayablePokemons.value = [];
  if (gen === 0) {
    await fetchPokemons();
    if (allPokemons.value.length > 0) {
      await prepareDisplayablePokemons(allPokemons.value);
    }
  } else {
    const list = await fetchPokemonsByGeneration(gen);
    if (list.length > 0) {
      await prepareDisplayablePokemons(list);
    }
  }
}

const filteredPokemons = computed(() => {
  return displayablePokemons.value;
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-7xl mx-auto px-4">

      <div class="pokedex-screen mb-8">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center mr-4">
            <div class="w-8 h-8 bg-pokemon-blue rounded-full animate-pulse"></div>
          </div>
          <h1 class="text-4xl font-bold text-white text-stroke">{{ languageStore.t.pokedex }}</h1>
          <div class="w-16 h-16 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center ml-4">
            <div class="w-8 h-8 bg-pokemon-red rounded-full animate-pulse"></div>
          </div>
        </div>

        <div class="pokedex-inner-screen space-y-4">
          <PokemonSearch v-model="searchTerm" @search="handleSearch" />

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label for="generation" class="text-white font-semibold text-sm">
              {{ languageStore.t.generation }} :
            </label>
            <select
              id="generation"
              @change="handleGenerationChange"
              class="bg-white text-pokemon-black border-2 border-pokemon-black rounded-lg px-4 py-2 font-semibold cursor-pointer hover:bg-pokemon-gray-light transition-colors duration-300"
            >
              <option value="0">{{ languageStore.t.all }}</option>
              <option value="1">{{ languageStore.t.generation1 }}</option>
              <option value="2">{{ languageStore.t.generation2 }}</option>
              <option value="3">{{ languageStore.t.generation3 }}</option>
              <option value="4">{{ languageStore.t.generation4 }}</option>
              <option value="5">{{ languageStore.t.generation5 }}</option>
              <option value="6">{{ languageStore.t.generation6 }}</option>
              <option value="7">{{ languageStore.t.generation7 }}</option>
              <option value="8">{{ languageStore.t.generation8 }}</option>
              <option value="9">{{ languageStore.t.generation9 }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="loading && !displayablePokemons.length && !searchResultPokemon"
           class="text-center py-16">
        <div class="loading-pokeball mb-4"></div>
        <p class="text-xl text-pokemon-gray-dark">{{ languageStore.t.loading }}</p>
      </div>

      <div v-if="error"
           class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
        <p class="font-semibold">{{ languageStore.t.error }}</p>
        <p>{{ error }}</p>
        <button @click="fetchPokemons(); searchTerm=''; searchResultPokemon=null;"
                class="btn-danger mt-4">
          {{ languageStore.t.retry }}
        </button>
      </div>

      <div v-if="searchResultPokemon && !error"
           class="mb-8">
        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-4 text-center">
            {{ languageStore.t.search }}
          </h2>
          <div class="flex justify-center">
            <PokemonCard :pokemonData="searchResultPokemon" />
          </div>
        </div>
        <hr class="border-pokemon-gray-medium my-8" v-if="filteredPokemons.length > 0">
      </div>

      <div v-if="searchTerm && !searchResultPokemon && !loading && !error"
           class="text-center py-8">
        <div class="bg-white rounded-2xl shadow-xl border-4 border-red-400 p-6">
          <p class="text-xl text-pokemon-gray-dark">
            {{ languageStore.t.noResults }} "{{ searchTerm }}"
          </p>
        </div>
      </div>

      <div v-if="!error">
        <div v-if="filteredPokemons.length > 0"
             class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <PokemonCard
            v-for="pokemon in filteredPokemons"
            :key="pokemon.id"
            :pokemonData="pokemon"
          />
        </div>

        <div v-else-if="!loading && !searchResultPokemon && !searchTerm"
             class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-8">
            <p class="text-xl text-pokemon-gray-dark">{{ languageStore.t.noResults }}</p>
          </div>
        </div>

        <div v-if="nextPageUrl && !loading && !searchResultPokemon && filteredPokemons.length > 0"
             class="text-center">
          <button @click="loadMorePokemons"
                  class="btn-secondary text-lg px-8 py-4">
            {{ languageStore.t.loadMore }}
          </button>
        </div>

        <div v-if="loading && (displayablePokemons.length > 0 || searchResultPokemon)"
             class="text-center py-8">
          <div class="loading-pokeball mb-4"></div>
          <p class="text-pokemon-gray-dark">{{ languageStore.t.loading }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
