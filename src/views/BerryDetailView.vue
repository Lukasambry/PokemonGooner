<script setup lang="ts">
import { ref, onMounted, computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBerryApi } from '@/composables/useBerryApi'
import { useLanguageStore } from '@/stores/languageStore'

const languageStore = useLanguageStore()

const route = useRoute()
const router = useRouter()
const {
  berryDetail,
  itemDetail,
  loading: apiLoading,
  error: apiError,
  fetchBerryDetail
} = useBerryApi()

const { getTranslatedName, getTranslatedDescription } = languageStore

const berryIdOrNameFromRoute = computed(() => {
  const param = route.params.idOrName
  return Array.isArray(param) ? param[0] : param
})

const localLoading: Ref<boolean> = ref(true)
const localError: Ref<string | null> = ref(null)

async function loadBerryData(idOrName: string) {
  localLoading.value = true
  localError.value = null
  await fetchBerryDetail(idOrName)
  if (apiError.value) {
    localError.value = apiError.value;
  }
  localLoading.value = false
}

onMounted(() => {
  if (berryIdOrNameFromRoute.value) {
    loadBerryData(berryIdOrNameFromRoute.value)
  }
})

watch(berryIdOrNameFromRoute, (newIdOrName) => {
  if (newIdOrName) {
    berryDetail.value = null
    itemDetail.value = null
    loadBerryData(newIdOrName)
  }
})

const berrySprite = computed(() => {
  return itemDetail.value?.sprites.default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berryDetail.value?.name}-berry.png`
})

const translatedName = computed(() => {
  if (!itemDetail.value?.names) return berryDetail.value?.name || ''
  return getTranslatedName(itemDetail.value.names, berryDetail.value?.name || '')
})

const translatedDescription = computed(() => {
  if (!itemDetail.value?.flavor_text_entries) return ''
  return getTranslatedDescription(itemDetail.value.flavor_text_entries, '')
})

const displayName = computed(() => {
  const name = translatedName.value || berryDetail.value?.name || ''
  return name.charAt(0).toUpperCase() + name.slice(1)
})

const berryFirmness = computed(() => {
  return berryDetail.value?.firmness.name || ''
})

const naturalGiftType = computed(() => {
  return berryDetail.value?.natural_gift_type?.name || ''
})

const goBack = () => {
  router.back();
}

const typeColors = {
  normal: 'bg-type-normal',
  fire: 'bg-type-fire',
  water: 'bg-type-water',
  electric: 'bg-type-electric',
  grass: 'bg-type-grass',
  ice: 'bg-type-ice',
  fighting: 'bg-type-fighting',
  poison: 'bg-type-poison',
  ground: 'bg-type-ground',
  flying: 'bg-type-flying',
  psychic: 'bg-type-psychic',
  bug: 'bg-type-bug',
  rock: 'bg-type-rock',
  ghost: 'bg-type-ghost',
  dragon: 'bg-type-dragon',
  dark: 'bg-type-dark',
  steel: 'bg-type-steel',
  fairy: 'bg-type-fairy',
}

const getTypeColor = (type: string) => {
  return typeColors[type as keyof typeof typeColors] || 'bg-gray-500'
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Bouton retour -->
      <button @click="goBack" class="btn-secondary mb-8">
        {{ languageStore.t.back }}
      </button>

      <!-- État de chargement -->
      <div v-if="localLoading" class="text-center py-16">
        <div class="loading-pokeball mb-4"></div>
        <p class="text-xl text-pokemon-gray-dark">{{ languageStore.t.loading }}</p>
      </div>

      <!-- Messages d'erreur -->
      <div v-if="localError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
        <p class="font-semibold">{{ languageStore.t.error }}</p>
        <p>{{ localError }}</p>
        <button @click="loadBerryData(berryIdOrNameFromRoute)"
                v-if="berryIdOrNameFromRoute"
                class="btn-danger mt-4">
          {{ languageStore.t.retry }}
        </button>
      </div>

      <div v-if="berryDetail && !localLoading && !localError" class="space-y-8">

        <div class="pokedex-screen">
          <div class="flex items-center justify-center mb-6">
            <div class="w-12 h-12 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center mr-4">
              <div class="w-6 h-6 bg-pokemon-blue rounded-full animate-pulse"></div>
            </div>
            <h1 class="text-4xl font-bold text-white text-stroke text-center">
              {{ displayName }}
            </h1>
          </div>

          <div class="pokedex-inner-screen">
            <div class="flex flex-col lg:flex-row gap-4">

              <div class="lg:w-1/2 flex flex-col items-center">
                <div class="bg-white rounded-2xl p-6 shadow-xl border-4 border-pokemon-yellow mb-6">
                  <img
                    :src="berrySprite"
                    :alt="berryDetail.name"
                    class="w-32 h-32 object-contain mx-auto animate-float"
                    @error="($event.target as HTMLImageElement).src = 'https://via.placeholder.com/128x128/10B981/ffffff?text=🍓'"
                  />
                </div>

                <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                  <p class="text-pokemon-black font-semibold text-center">
                    #{{ String(berryDetail.id).padStart(3, '0') }}
                  </p>
                </div>
              </div>

              <div class="lg:w-1/2 space-y-4">
                <div v-if="translatedDescription" class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                  <p class="text-pokemon-black leading-relaxed">{{ translatedDescription }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                    <h3 class="font-bold text-pokemon-black mb-2">{{ languageStore.t.size }}</h3>
                    <p class="text-pokemon-gray-dark">{{ berryDetail.size }} mm</p>
                  </div>

                  <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                    <h3 class="font-bold text-pokemon-black mb-2">{{ languageStore.t.firmness }}</h3>
                    <p class="text-pokemon-gray-dark capitalize">{{ berryFirmness }}</p>
                  </div>

                  <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                    <h3 class="font-bold text-pokemon-black mb-2">{{ languageStore.t.smoothness }}</h3>
                    <p class="text-pokemon-gray-dark">{{ berryDetail.smoothness }}</p>
                  </div>

                  <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                    <h3 class="font-bold text-pokemon-black mb-2">{{ languageStore.t.soilDryness }}</h3>
                    <p class="text-pokemon-gray-dark">{{ berryDetail.soil_dryness }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-6 text-center">
            {{ languageStore.t.berryGrowthInfo }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-4 text-white">
                <h3 class="font-bold mb-2">{{ languageStore.t.growthTime }}</h3>
                <p class="text-2xl font-bold">{{ berryDetail.growth_time }}h</p>
              </div>
            </div>

            <div class="text-center">
              <div class="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-4 text-white">
                <h3 class="font-bold mb-2">{{ languageStore.t.maxHarvest }}</h3>
                <p class="text-2xl font-bold">{{ berryDetail.max_harvest }}</p>
              </div>
            </div>

            <div class="text-center">
              <div class="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl p-4 text-white">
                <h3 class="font-bold mb-2">{{ languageStore.t.naturalGiftPower }}</h3>
                <p class="text-2xl font-bold">{{ berryDetail.natural_gift_power }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="berryDetail.flavors && berryDetail.flavors.length > 0"
             class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-6 text-center">
            {{ languageStore.t.flavors }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="flavor in berryDetail.flavors.filter(f => f.potency > 0)"
                 :key="flavor.flavor.name"
                 class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 border-2 border-pink-200">
              <h3 class="font-bold text-pokemon-black capitalize mb-2">
                {{ flavor.flavor.name }}
              </h3>
              <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div class="bg-gradient-to-r from-pink-400 to-purple-500 h-full rounded-full transition-all duration-500"
                     :style="{ width: (flavor.potency / 40 * 100) + '%' }">
                </div>
              </div>
              <p class="text-sm text-pokemon-gray-dark mt-1">{{ flavor.potency }}/40</p>
            </div>
          </div>
        </div>

        <div v-if="naturalGiftType" class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-6 text-center">
            {{ languageStore.t.naturalGift }}
          </h2>

          <div class="flex justify-center">
            <span class="pokemon-type-badge text-lg px-6 py-3 capitalize"
                  :class="getTypeColor(naturalGiftType)">
              {{ naturalGiftType }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
