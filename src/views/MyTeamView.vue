<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import { useLanguageStore } from '@/stores/languageStore'
import type { TeamPokemon } from '@/stores/teamStore'

const { team, teamCount, removePokemon, clearTeam, MAX_TEAM_SIZE } = usePokemonTeam()
const { t } = useLanguageStore()
const router = useRouter()

function viewPokemonDetail(pokemonName: string) {
  router.push({ name: 'pokemon-detail', params: { idOrName: pokemonName } })
}

function confirmAndClearTeam() {
  if (window.confirm("Êtes-vous sûr de vouloir vider toute votre équipe Pokémon ?")) {
    clearTeam();
  }
}

const emptySlots = computed(() => {
  return MAX_TEAM_SIZE - teamCount.value
})
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
            {{ t.myTeam }} ({{ teamCount }} / {{ MAX_TEAM_SIZE }})
          </h1>
          <div class="w-16 h-16 bg-pokemon-yellow rounded-full border-4 border-pokemon-black flex items-center justify-center ml-4">
            <div class="w-8 h-8 bg-pokemon-red rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div v-if="teamCount === 0" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-8 max-w-md mx-auto">
          <div class="w-32 h-32 bg-pokeball bg-center bg-no-repeat bg-contain mx-auto mb-6 opacity-30"></div>
          <h2 class="text-2xl font-bold text-pokemon-black mb-4">{{ t.emptyTeam }}</h2>
          <p class="text-pokemon-gray-dark mb-6">Allez attraper quelques Pokémon !</p>
          <router-link to="/" class="btn-primary inline-block">
            {{ t.explorePokemon }}
          </router-link>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="pokemon in team" :key="pokemon.id" 
               class="pokemon-card group">
            <div class="relative overflow-hidden">
              <div class="absolute top-3 left-3 bg-gradient-to-r from-pokemon-blue to-pokemon-blue-dark text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                Équipe
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
                  {{ t.removeFromTeam }}
                </button>
              </div>
            </div>

            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>

          <div v-for="n in emptySlots" :key="`empty-${n}`" 
               class="bg-white rounded-2xl shadow-xl border-4 border-dashed border-pokemon-gray-medium overflow-hidden">
            <div class="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
              <div class="w-16 h-16 bg-pokeball bg-center bg-no-repeat bg-contain mb-4 opacity-20"></div>
              <p class="text-pokemon-gray-dark font-semibold">Emplacement libre</p>
              <p class="text-sm text-pokemon-gray-dark mt-2">Attrapez un Pokémon !</p>
            </div>
          </div>
        </div>

        <div class="text-center space-y-4">
          <button
            @click="confirmAndClearTeam"
            class="btn-danger text-lg px-8 py-4"
          >
            {{ t.clearTeam }}
          </button>
          
          <div class="flex justify-center space-x-4">
            <router-link to="/" class="btn-secondary">
              {{ t.explorePokemon }}
            </router-link>
            <router-link to="/berries" class="btn-primary">
              {{ t.berries }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="mt-12 bg-white rounded-2xl shadow-xl border-4 border-pokemon-yellow p-6">
        <h2 class="text-xl font-bold text-pokemon-black mb-4 text-center">💡 Conseils pour votre équipe</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pokemon-gray-dark">
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="font-semibold text-pokemon-black mb-2">🔥 Diversifiez les types</h3>
            <p>Une équipe équilibrée avec différents types de Pokémon sera plus efficace au combat.</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="font-semibold text-pokemon-black mb-2">⚡ Équilibrez les stats</h3>
            <p>Mélangez des Pokémon offensifs et défensifs pour couvrir toutes les situations.</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <h3 class="font-semibold text-pokemon-black mb-2">🌟 Capacités spéciales</h3>
            <p>Certaines capacités cachées peuvent donner l'avantage en combat.</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <h3 class="font-semibold text-pokemon-black mb-2">📈 Progression</h3>
            <p>Vous pouvez avoir jusqu'à {{ MAX_TEAM_SIZE }} Pokémon dans votre équipe.</p>
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