<script setup lang="ts">
import { ref, onMounted, computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePokeApi } from '@/composables/usePokeApi'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import { useLanguageStore } from '@/stores/languageStore'
import type { TeamPokemon } from '@/stores/teamStore'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
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
        alert(t('teamFullAlert'))
      }
    }
  }
}

const buttonText = computed(() => isCurrentlyInTeam.value ? t('removeFromTeam') : t('addToTeam'))

const buttonAriaLabel = computed(() => {
  if (isCurrentlyInTeam.value) {
    return t('removeFromTeamAriaLabel', { name: displayName.value })
  } else if (isTeamFull.value) {
    return t('teamFullAriaLabel')
  } else {
    return t('addToTeamAriaLabel', { name: displayName.value })
  }
})

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

const getTypeLabel = (type: any) => t(`types.${type}`, type.charAt(0).toUpperCase() + type.slice(1))

const getAbilityLabel = (ability: any) => {
  if (ability.ability.names) {
    return languageStore.getTranslatedName(ability.ability.names, ability.ability.name)
  }
  return ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
}

const statKeyMap: Record<string, string> = {
  hp: 'stats_keys.hp',
  attack: 'stats_keys.attack',
  defense: 'stats_keys.defense',
  'special-attack': 'stats_keys.specialAttack',
  'special-defense': 'stats_keys.specialDefense',
  speed: 'stats_keys.speed',
}

const getStatName = (statName: string) => {
  const key = statKeyMap[statName] || statName
  return t(key, statName)
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
  front_default: t('sprites_keys.frontNormal'),
  back_default: t('sprites_keys.backNormal'),
  front_shiny: t('sprites_keys.frontShiny'),
  back_shiny: t('sprites_keys.backShiny')
}))

const pokemonImageAlt = computed(() => {
  return t('pokemonImage', { name: displayName.value })
})

const backButtonAriaLabel = computed(() => {
  return t('backButtonAriaLabel')
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <button
        @click="goBack"
        class="btn-secondary mb-8"
        :aria-label="backButtonAriaLabel"
      >
        {{ t('back') }}
      </button>

      <div v-if="localLoading" class="text-center py-16">
        <div class="loading-pokeball mb-4"></div>
        <p class="text-xl text-pokemon-gray-dark">{{ t('loading') }}</p>
      </div>

      <div v-if="localError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
        <p class="font-semibold">{{ t('error') }}</p>
        <p>{{ localError }}</p>
        <button
          @click="loadPokemonData(pokemonIdOrNameFromRoute)"
          v-if="pokemonIdOrNameFromRoute"
          class="btn-danger mt-4"
        >
          {{ t('retry') }}
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
                    :alt="pokemonImageAlt"
                    class="w-48 h-48 object-contain mx-auto animate-float"
                  />
                </div>

                <button
                  @click="toggleTeamMembership"
                  :disabled="!isCurrentlyInTeam && isTeamFull"
                  :aria-label="buttonAriaLabel"
                  class="w-full max-w-xs transition-all duration-300 transform hover:scale-105 active:scale-95 font-bold py-3 px-6 rounded-xl shadow-lg text-lg"
                  :class="{
                    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white': isCurrentlyInTeam,
                    'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white': !isCurrentlyInTeam && !isTeamFull,
                    'bg-gray-300 text-gray-500 cursor-not-allowed': !isCurrentlyInTeam && isTeamFull
                  }"
                  :title="(!isCurrentlyInTeam && isTeamFull) ? t('teamFull') : ''"
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
                    <h3 class="font-bold text-pokemon-black mb-2">{{ t('height') }}</h3>
                    <p class="text-pokemon-gray-dark text-lg">{{ pokemonDetail.height / 10 }} m</p>
                  </div>

                  <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                    <h3 class="font-bold text-pokemon-black mb-2">{{ t('weight') }}</h3>
                    <p class="text-pokemon-gray-dark text-lg">{{ pokemonDetail.weight / 10 }} kg</p>
                  </div>
                </div>

                <div class="bg-white rounded-xl p-4 shadow-lg border-2 border-pokemon-gray-medium">
                  <h3 class="font-bold text-pokemon-black mb-3">{{ t('types') }}</h3>
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
                  <h3 class="font-bold text-pokemon-black mb-3">{{ t('abilities') }}</h3>
                  <div class="space-y-2">
                    <div v-for="abilityInfo in pokemonDetail.abilities" :key="abilityInfo.ability.name"
                         class="flex items-center justify-between">
                      <span class="capitalize">{{ getAbilityLabel(abilityInfo) }}</span>
                      <span v-if="abilityInfo.is_hidden" class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {{ t('hiddenAbility') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-6 text-center">{{ t('stats') }}</h2>

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
                  :aria-label="t('statBar', { stat: getStatName(stat.stat.name), value: stat.base_stat })"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
          <h2 class="text-2xl font-bold text-pokemon-black mb-6 text-center">{{ t('sprites') }}</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-if="pokemonDetail.sprites.front_default"
                 class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center">
              <img
                :src="pokemonDetail.sprites.front_default"
                :alt="spriteLabels.front_default"
                class="w-24 h-24 mx-auto object-contain mb-2"
              >
              <p class="text-sm font-semibold text-pokemon-black">{{ t('sprites_keys.frontNormal') }}</p>
            </div>

            <div v-if="pokemonDetail.sprites.back_default"
                 class="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 text-center">
              <img
                :src="pokemonDetail.sprites.back_default"
                :alt="spriteLabels.back_default"
                class="w-24 h-24 mx-auto object-contain mb-2"
              >
              <p class="text-sm font-semibold text-pokemon-black">{{ t('sprites_keys.backNormal') }}</p>
            </div>

            <div v-if="pokemonDetail.sprites.front_shiny"
                 class="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4 text-center">
              <img
                :src="pokemonDetail.sprites.front_shiny"
                :alt="spriteLabels.front_shiny"
                class="w-24 h-24 mx-auto object-contain mb-2"
              >
              <p class="text-sm font-semibold text-pokemon-black">✨ {{ t('sprites_keys.frontShiny') }}</p>
            </div>

            <div v-if="pokemonDetail.sprites.back_shiny"
                 class="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 text-center">
              <img
                :src="pokemonDetail.sprites.back_shiny"
                :alt="spriteLabels.back_shiny"
                class="w-24 h-24 mx-auto object-contain mb-2"
              >
              <p class="text-sm font-semibold text-pokemon-black">✨ {{ t('sprites_keys.backShiny') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
