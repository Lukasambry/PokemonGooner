<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import { useLanguageStore } from '@/stores/languageStore'
import type { TeamPokemon } from '@/stores/teamStore'
import type { PokemonSpecies } from '@/stores/languageStore'

interface PokemonCardData {
  id: number;
  name: string;
  sprite: string;
  species_data?: PokemonSpecies;
}

interface Props {
  pokemonData: PokemonCardData;
}
const props = defineProps<Props>()

const router = useRouter()
const { addPokemon, removePokemon, isPokemonInTeam, isTeamFull } = usePokemonTeam()
const languageStore = useLanguageStore()

const isCurrentlyInTeam = computed<boolean>(() => isPokemonInTeam(props.pokemonData.id))

const displayName = computed(() => {
  if (props.pokemonData.species_data?.names) {
    return languageStore.getTranslatedName(props.pokemonData.species_data.names, props.pokemonData.name)
  }
  return props.pokemonData.name.charAt(0).toUpperCase() + props.pokemonData.name.slice(1)
})

function navigateToDetail() {
  router.push({ name: 'pokemon-detail', params: { idOrName: props.pokemonData.id } })
}

function toggleTeamMembership() {
  const pokemonForTeam: TeamPokemon = {
    id: props.pokemonData.id,
    name: props.pokemonData.name,
    sprite: props.pokemonData.sprite,
  };

  if (isCurrentlyInTeam.value) {
    removePokemon(pokemonForTeam.id);
  } else {
    if (!isTeamFull.value) {
      addPokemon(pokemonForTeam);
    } else {
      console.warn("L'équipe est pleine, impossible d'ajouter le Pokémon.");
      alert(languageStore.t.teamFull + " !");
    }
  }
}

const buttonText = computed<string>(() => {
  return isCurrentlyInTeam.value ? languageStore.t.removeFromTeam : languageStore.t.addToTeam;
});
</script>

<template>
  <div class="pokemon-card group" @click="navigateToDetail">
    <div class="relative overflow-hidden">

      <div class="absolute top-3 right-3 bg-gradient-to-r from-pokemon-blue to-pokemon-blue-dark text-white px-3 py-1 rounded-full text-xs font-bold z-10">
        #{{ String(pokemonData.id).padStart(3, '0') }}
      </div>

      <div class="bg-gradient-to-br from-pokemon-gray-light to-white p-6 flex items-center justify-center min-h-[140px] relative">
        <div class="absolute inset-0 bg-pokeball bg-right-top bg-no-repeat opacity-5 transform scale-150"></div>
        <img
          :src="pokemonData.sprite"
          :alt="pokemonData.name"
          class="w-24 h-24 object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg relative z-10"
        />
      </div>

      <div class="p-4 bg-white">
        <h3 class="text-lg font-bold text-pokemon-black mb-3 text-center group-hover:text-pokemon-red transition-colors duration-300 capitalize">
          {{ displayName }}
        </h3>

        <button
          @click.stop="toggleTeamMembership"
          :disabled="!isCurrentlyInTeam && isTeamFull"
          class="w-full transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold py-2 px-4 rounded-xl shadow-lg"
          :class="{
            'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white': isCurrentlyInTeam,
            'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-900 text-white': !isCurrentlyInTeam && !isTeamFull,
            'bg-gray-300 text-gray-500 cursor-not-allowed': !isCurrentlyInTeam && isTeamFull
          }"
          :title="(!isCurrentlyInTeam && isTeamFull) ? languageStore.t.teamFull : ''"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>

    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  </div>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  cursor: pointer;
}
</style>
