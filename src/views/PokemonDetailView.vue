<script setup lang="ts">
import { ref, onMounted, computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokeApi } from '@/composables/usePokeApi'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import { useLanguageStore } from '@/stores/languageStore'
import type { TeamPokemon } from '@/stores/teamStore'

const route = useRoute()
const router = useRouter()
const { pokemonDetail, loading: apiLoading, error: apiError, fetchPokemonDetail } = usePokeApi()
const { addPokemon, removePokemon, isPokemonInTeam, isTeamFull } = usePokemonTeam()
const languageStore = useLanguageStore()

const pokemonIdOrNameFromRoute = computed(() => {
  const param = route.params.idOrName
  return Array.isArray(param) ? param[0] : param
})

const localLoading: Ref<boolean> = ref(true)
const localError: Ref<string | null> = ref(null)

async function loadPokemonData(idOrName: string) {
  localLoading.value = true
  localError.value = null
  await fetchPokemonDetail(idOrName)
  if (apiError.value) {
    localError.value = apiError.value
  }
  localLoading.value = false
}

onMounted(() => {
  if (pokemonIdOrNameFromRoute.value) {
    loadPokemonData(pokemonIdOrNameFromRoute.value)
  }
})

watch(pokemonIdOrNameFromRoute, (newIdOrName) => {
  if (newIdOrName) {
    pokemonDetail.value = null
    loadPokemonData(newIdOrName)
  }
})

const currentPokemonForTeam = computed<TeamPokemon | null>(() => {
  if (pokemonDetail.value) {
    return {
      id: pokemonDetail.value.id,
      name: pokemonDetail.value.name,
      sprite: pokemonDetail.value.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail.value.id}.png`
    }
  }
  return null
})

const isCurrentlyInTeam = computed(() => !!(currentPokemonForTeam.value && isPokemonInTeam(currentPokemonForTeam.value.id)))

const translatedName = computed(() => {
  if (!pokemonDetail.value?.species_data?.names) return pokemonDetail.value?.name || ''
  return languageStore.getTranslatedName(pokemonDetail.value.species_data.names, pokemonDetail.value.name)
})

const translatedDescription = computed(() => {
  if (!pokemonDetail.value?.species_data?.flavor_text_entries) return ''
  return languageStore.getTranslatedDescription(pokemonDetail.value.species_data.flavor_text_entries, '')
})

const displayName = computed(() => {
  const name = translatedName.value || pokemonDetail.value?.name || ''
  return name.charAt(0).toUpperCase() + name.slice(1)
})

function toggleTeamMembership() {
  if (currentPokemonForTeam.value) {
    if (isCurrentlyInTeam.value) {
      removePokemon(currentPokemonForTeam.value.id)
    } else {
      if (!isTeamFull.value) {
        addPokemon(currentPokemonForTeam.value)
      } else {
        alert(languageStore.t.teamFull + " !")
      }
    }
  }
}

const buttonText = computed(() => isCurrentlyInTeam.value ? languageStore.t.removeFromTeam : languageStore.t.addToTeam)

const goBack = () => router.back()

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

const getTypeColor = (type: string) => typeColors[type as keyof typeof typeColors] || 'bg-gray-500'

const getTypeLabel = (type: any) => languageStore.t[type] || (type.charAt(0).toUpperCase() + type.slice(1))

const getAbilityLabel = (ability: any) => {
  if (ability.ability.names) {
    return languageStore.getTranslatedName(ability.ability.names, ability.ability.name)
  }
  return ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
}

const statKeyMap: Record<string, keyof typeof languageStore.t> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'specialAttack',
  'special-defense': 'specialDefense',
  speed: 'speed',
}

const getStatName = (statName: string) => {
  const key = statKeyMap[statName] || statName
  return languageStore.t[key] || statName
}

const statColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-pink-500'
]

const spriteLabels = computed(() => ({
  front_default: languageStore.t.frontNormal,
  back_default: languageStore.t.backNormal,
  front_shiny: languageStore.t.frontShiny,
  back_shiny: languageStore.t.backShiny,
}))
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <button @click="goBack" class="btn-secondary mb-8">
        {{ languageStore.t.back }}
      </button>

      <div v-if="localLoading" class="text-center py-16">
        <div class="loading-pokeball mb-4"></div>
        <p class="text-xl text-pokemon-gray-dark">{{ languageStore.t.loading }}</p>
      </div>

      <div v-if="localError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
        <p class="font-semibold">{{ languageStore.t.error }}</p>
        <p>{{ localError }}</p>
        <button @click="loadPokemonData(pokemonIdOrNameFromRoute)"
                v-if="pokemonIdOrNameFromRoute"
                class="btn-danger mt-4">
          {{ languageStore.t.retry }}
        </button>
      </div>

      <div v-if="pokemonDetail && !localLoading && !localError" class="space-y-8">
        <div class="pokedex-screen">
          <div class="flex items-center justify-center mb-6">
            <div class="w-12 h-12 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center mr-4">
              <div class="w-6 h-6 bg-pokemon-blue rounded-full animate-pulse"></div>
            </div>
            <h1 class="text-4xl font-bold text-white text-stroke text-center">
              {{ displayName }}
            </h1>
            <div class="w-12 h-12 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center ml-4">
              <div class="w-6 h-6 bg-pokemon-red rounded-full animate-pulse"></div>
            </div>
          </div>

          <div class="pokedex-inner-screen">
            <div class="flex flex-col lg:flex-row gap-8">
              <div class="lg:w-1/2 flex flex-col items-center">
                <div class="bg-white rounded-2xl p-6 shadow-xl border-4 border-pokemon-yellow mb-6 relative">
                  <div class="absolute top-2 right-2 bg-gradient-to-r from-pokemon-blue to-pokemon-blue-dark text-white px-3 py-1 rounded-full text-sm font-bold">
                    #{{ String(pokemonDetail.id).padStart(3, '0') }}
                  </div>
                  <img
                    :src="pokemonDetail.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail.id}.png`"
                    :alt="pokemonDetail.name"
                    class="w-48 h-48 object-contain mx-auto animate-float"
                  />
                </div>

                <button
                  @click="toggleTeamMembership"
                  :disabled="!isCurrentlyInTeam && isTeamFull"
                  class="w-full max-w-xs transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold py-3 px-6 rounded-xl shadow-lg text-lg"
                  :class="{
                    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white': isCurrentlyInTeam,
                    'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white': !isCurrentlyInTeam && !isTeamFull,
                    'bg-gray-300 text-gray-500 cursor-not-allowed': !isCurrentlyInTeam && isTeamFull
                  }"
                  :title="(!isCurrentlyInTeam && isTeamFull) ? languageStore.t.teamFull : ''"
                >
                  {{ buttonText }}
                </button>
              </div>

              <div class="lg:w-1/2 space-y-4">
                <div v-if="translatedDescription" class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                  <p class="text-pokemon-black leading-relaxed">{{ translatedDescription }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                    <h3 class="font-bold text-pokemon-black mb-2">{{ languageStore.t.height }}</h3>
                    <p class="text-pokemon-gray-dark text-lg">{{ pokemonDetail.height / 10 }} m</p>
                  </div>

                  <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                    <h3 class="font-bold text-pokemon-black mb-2">{{ languageStore.t.weight }}</h3>
                    <p class="text-pokemon-gray-dark text-lg">{{ pokemonDetail.weight / 10 }} kg</p>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                  <h3 class="font-bold text-pokemon-black mb-3">{{ languageStore.t.types }}</h3>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="typeInfo in pokemonDetail.types"
                      :key="typeInfo.type.name"
                      class="pokemon-type-badge capitalize"
                      :class="getTypeColor(typeInfo.type.name)"
                    >
                      {{ getTypeLabel(typeInfo.type.name) }}
                    </span>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                  <h3 class="font-bold text-pokemon-black mb-3">{{ languageStore.t.abilities }}</h3>
                  <div class="space-y-2">
                    <div v-for="abilityInfo in pokemonDetail.abilities" :key="abilityInfo.ability.name"
                         class="flex items-center justify-between">
                      <span class="capitalize">{{ getAbilityLabel(abilityInfo) }}</span>
                      <span v-if="abilityInfo.is_hidden" class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {{ languageStore.t.hiddenAbility }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-6 text-center">{{ languageStore.t.stats }}</h2>

          <div class="space-y-4">
            <div v-for="(stat, index) in pokemonDetail.stats" :key="stat.stat.name"
                 class="flex items-center gap-4">
              <div class="w-20 text-right font-semibold text-pokemon-black text-sm">
                {{ getStatName(stat.stat.name) }}
              </div>
              <div class="w-12 text-center font-bold text-pokemon-black">
                {{ stat.base_stat }}
              </div>
              <div class="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-1000 ease-out"
                  :class="statColors[index]"
                  :style="{ width: (Math.min(stat.base_stat / 255 * 100, 100)) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-6 text-center">{{ languageStore.t.sprites }}</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-if="pokemonDetail.sprites.front_default"
                 class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center">
              <img :src="pokemonDetail.sprites.front_default" :alt="spriteLabels.front_default"
                   class="w-24 h-24 mx-auto object-contain mb-2">
              <p class="text-sm font-semibold text-pokemon-black">{{ spriteLabels.front_default }}</p>
            </div>

            <div v-if="pokemonDetail.sprites.back_default"
                 class="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 text-center">
              <img :src="pokemonDetail.sprites.back_default" :alt="spriteLabels.back_default"
                   class="w-24 h-24 mx-auto object-contain mb-2">
              <p class="text-sm font-semibold text-pokemon-black">{{ spriteLabels.back_default }}</p>
            </div>

            <div v-if="pokemonDetail.sprites.front_shiny"
                 class="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4 text-center">
              <img :src="pokemonDetail.sprites.front_shiny" :alt="spriteLabels.front_shiny"
                   class="w-24 h-24 mx-auto object-contain mb-2">
              <p class="text-sm font-semibold text-pokemon-black">✨ {{ spriteLabels.front_shiny }}</p>
            </div>

            <div v-if="pokemonDetail.sprites.back_shiny"
                 class="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 text-center">
              <img :src="pokemonDetail.sprites.back_shiny" :alt="spriteLabels.back_shiny"
                   class="w-24 h-24 mx-auto object-contain mb-2">
              <p class="text-sm font-semibold text-pokemon-black">✨ {{ spriteLabels.back_shiny }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
