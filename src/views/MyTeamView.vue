<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import { useLanguageStore } from '@/stores/languageStore'

const { team, teamCount, removePokemon, clearTeam, MAX_TEAM_SIZE } = usePokemonTeam()
const languageStore = useLanguageStore()
const router = useRouter()
const { t } = useI18n()

function viewPokemonDetail(pokemonName: string) {
  router.push({ name: 'pokemon-detail', params: { idOrName: pokemonName } })
}

function confirmAndClearTeam() {
  if (window.confirm(t('confirmClearTeam'))) {
    clearTeam()
  }
}

const emptySlots = computed(() => MAX_TEAM_SIZE - teamCount.value)

const tips = computed(() => [
  {
    icon: "🔥",
    title: t('diversifyTypes'),
    text: t('diversifyTypesText')
  },
  {
    icon: "⚡",
    title: t('balanceStats'),
    text: t('balanceStatsText')
  },
  {
    icon: "🌟",
    title: t('specialAbilities'),
    text: t('specialAbilitiesText')
  },
  {
    icon: "📈",
    title: t('progression'),
    text: t('progressionText', { max: MAX_TEAM_SIZE })
  }
])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-6xl mx-auto px-4">

      <div class="pokedex-screen mb-8">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center mr-4">
            <div class="w-8 h-8 bg-pokemon-blue rounded-full animate-pulse"></div>
          </div>
          <h1 class="text-4xl font-bold text-white text-stroke">
            {{ t('myTeam') }} ({{ teamCount }} / {{ MAX_TEAM_SIZE }})
          </h1>
          <div class="w-16 h-16 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center ml-4">
            <div class="w-8 h-8 bg-pokemon-red rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div v-if="teamCount === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-8 max-w-md mx-auto">
          <div class="w-32 h-32 bg-pokeball bg-center bg-no-repeat bg-contain mx-auto mb-6 opacity-30"></div>
          <h2 class="text-2xl font-bold text-pokemon-black mb-4">{{ t('emptyTeam') }}</h2>
          <p class="text-pokemon-gray-dark mb-6">{{ t('catchSomePokemon') }}</p>
          <router-link to="/" class="btn-primary inline-block">
            {{ t('explorePokemon') }}
          </router-link>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="pokemon in team" :key="pokemon.id"
               class="pokemon-card group">
            <div class="relative overflow-hidden">
              <div class="absolute top-3 left-3 bg-gradient-to-r from-pokemon-blue to-pokemon-blue-dark text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                {{ t('myTeam') }}
              </div>

              <div class="absolute top-3 right-3 bg-gradient-to-r from-pokemon-red to-pokemon-red-dark text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                #{{ String(pokemon.id).padStart(3, '0') }}
              </div>

              <div class="bg-gradient-to-br from-pokemon-gray-light to-white p-6 flex items-center justify-center min-h-[140px] relative"
                   @click="viewPokemonDetail(pokemon.name)">
                <div class="absolute inset-0 bg-pokeball bg-right-top bg-no-repeat opacity-5 transform scale-150"></div>
                <img
                  :src="pokemon.sprite"
                  :alt="pokemon.name"
                  class="w-24 h-24 object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg relative z-10 cursor-pointer"
                />
              </div>

              <div class="p-4 bg-white">
                <h3 class="text-lg font-bold text-pokemon-black mb-3 text-center capitalize cursor-pointer group-hover:text-pokemon-red transition-colors duration-300"
                    @click="viewPokemonDetail(pokemon.name)">
                  {{ pokemon.name }}
                </h3>

                <button
                  @click="removePokemon(pokemon.id)"
                  class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {{ t('removeFromTeam') }}
                </button>
              </div>
            </div>

            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>

          <div v-for="n in emptySlots" :key="`empty-${n}`"
               class="bg-white rounded-2xl shadow-xl border-4 border-dashed border-pokemon-gray-medium overflow-hidden">
            <div class="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
              <div class="w-16 h-16 bg-pokeball bg-center bg-no-repeat bg-contain mb-4 opacity-20"></div>
              <p class="text-pokemon-gray-dark font-semibold">{{ t('emptySlot') }}</p>
              <p class="text-sm text-pokemon-gray-dark mt-2">{{ t('catchPokemon') }}</p>
            </div>
          </div>
        </div>

        <div class="text-center space-y-4">
          <button
            @click="confirmAndClearTeam"
            class="btn-danger text-lg px-8 py-4"
          >
            {{ t('clearTeam') }}
          </button>

          <div class="flex justify-center space-x-4">
            <router-link to="/" class="btn-secondary">
              {{ t('explorePokemon') }}
            </router-link>
            <router-link to="/berries" class="btn-primary">
              {{ t('berries') }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="mt-12 bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
        <h2 class="text-xl font-bold text-pokemon-black mb-4 text-center">💡 {{ t('tips') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pokemon-gray-dark">
          <div v-for="tip in tips" :key="tip.title" :class="{
            'bg-blue-50': tip.icon === '🔥',
            'bg-green-50': tip.icon === '⚡',
            'bg-yellow-50': tip.icon === '🌟',
            'bg-purple-50': tip.icon === '📈'
          }" class="rounded-lg p-4">
            <h3 class="font-semibold text-pokemon-black mb-2">{{ tip.icon }} {{ tip.title }}</h3>
            <p>{{ tip.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  cursor: pointer;
}
</style>
