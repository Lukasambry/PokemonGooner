<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import BerryCard from '@/components/BerryCard.vue'
import PokemonSearch from '@/components/PokemonSearch.vue'
import { useBerryApi, type BerryListItem, type BerryDetail, type ItemDetail } from '@/composables/useBerryApi'
import { useLanguageStore } from '@/stores/languageStore'

interface DisplayBerry {
  id: number;
  name: string;
  sprite?: string;
}

const {
  berries: allBerries,
  loading,
  error,
  fetchBerries,
  nextPageUrl,
  searchBerryByName,
  extractBerryId,
} = useBerryApi()

const { t } = useLanguageStore()

const searchTerm: Ref<string> = ref('')
const displayableBerries: Ref<DisplayBerry[]> = ref([])
const searchResultBerry: Ref<DisplayBerry | null> = ref(null)

function prepareDisplayableBerries(list: BerryListItem[]) {
  const processedBerries: DisplayBerry[] = list.map(b => {
    const id = extractBerryId(b.url);
    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${b.name}-berry.png`;
    return {
      id: id,
      name: b.name,
      sprite: sprite
    };
  });
  displayableBerries.value.push(...processedBerries);
}

onMounted(async () => {
  await fetchBerries();
  if (allBerries.value.length > 0) {
    prepareDisplayableBerries(allBerries.value);
  }
});

async function loadMoreBerries() {
  if (nextPageUrl.value && !loading.value) {
    const currentCount = allBerries.value.length;
    await fetchBerries(nextPageUrl.value);
    const newBerries = allBerries.value.slice(currentCount);
    if (newBerries.length > 0) {
      prepareDisplayableBerries(newBerries);
    }
  }
}

async function handleSearch(query: string) {
  if (!query) {
    searchResultBerry.value = null;
    return;
  }
  searchTerm.value = query;
  const result = await searchBerryByName(query);
  if (result.berry && result.item) {
    searchResultBerry.value = {
      id: result.berry.id,
      name: result.berry.name,
      sprite: result.item.sprites.default
    };
  } else {
    searchResultBerry.value = null;
  }
}

const filteredBerries = computed(() => {
  return displayableBerries.value;
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
    <div class="max-w-7xl mx-auto px-4">

        <div class="pokedex-screen mb-8">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center mr-4">
            <div class="w-8 h-8 bg-pokemon-blue rounded-full animate-pulse"></div>
          </div>
          <h1 class="text-4xl font-bold text-white text-stroke">{{ t.berries }}</h1>
        </div>
        
        <div class="pokedex-inner-screen">
          <PokemonSearch 
            v-model="searchTerm" 
            @search="handleSearch"
            :placeholder="t.searchBerry"
          />
        </div>
      </div>

      <div v-if="loading && !displayableBerries.length && !searchResultBerry" 
           class="text-center py-16">
        <div class="loading-pokeball mb-4"></div>
        <p class="text-xl text-pokemon-gray-dark">{{ t.loading }}</p>
      </div>

      <div v-if="error" 
           class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
        <p class="font-semibold">{{ t.error }}</p>
        <p>{{ error }}</p>
        <button @click="fetchBerries(); searchTerm=''; searchResultBerry=null;" 
                class="btn-danger mt-4">
          {{ t.retry }}
        </button>
      </div>

      <div v-if="searchResultBerry && !error" 
           class="mb-8">
        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-4 text-center">
            {{ t.berrySearchResult }}
          </h2>
          <div class="flex justify-center">
            <BerryCard :berryData="searchResultBerry" />
          </div>
        </div>
        <hr class="border-pokemon-gray-medium my-8" v-if="filteredBerries.length > 0">
      </div>

      <div v-if="searchTerm && !searchResultBerry && !loading && !error" 
           class="text-center py-8">
        <p class="text-xl text-pokemon-gray-dark">
          {{ t.noBerryFound }} "{{ searchTerm }}"
        </p>
      </div>

      <div v-if="!error">
        <div v-if="filteredBerries.length > 0" 
             class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <BerryCard
            v-for="berry in filteredBerries"
            :key="berry.id"
            :berryData="berry"
          />
        </div>

        <div v-else-if="!loading && !searchResultBerry && !searchTerm" 
             class="text-center py-16">
          <p class="text-xl text-pokemon-gray-dark">{{ t.noResults }}</p>
        </div>

        <div v-if="nextPageUrl && !loading && !searchResultBerry && filteredBerries.length > 0" 
             class="text-center">
          <button @click="loadMoreBerries" 
                  class="btn-secondary">
            {{ t.loadMore }}
          </button>
        </div>

        <div v-if="loading && (displayableBerries.length > 0 || searchResultBerry)" 
             class="text-center py-8">
          <div class="loading-pokeball mb-4"></div>
          <p class="text-pokemon-gray-dark">{{ t.loading }}</p>
        </div>
      </div>
    </div>
  </div>
</template>