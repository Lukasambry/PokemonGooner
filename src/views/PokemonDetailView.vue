<script setup lang="ts">
import { ref, onMounted, computed, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokeApi, type PokemonDetail as FullPokemonDetail } from '@/composables/usePokeApi'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import type { TeamPokemon } from '@/stores/teamStore'

const route = useRoute()
const router = useRouter()
const {
  pokemonDetail,
  loading: apiLoading,
  error: apiError,
  fetchPokemonDetail
} = usePokeApi()

const { addPokemon, removePokemon, isPokemonInTeam, isTeamFull } = usePokemonTeam()

const pokemonIdOrNameFromRoute = computed(() => {
  const param = route.params.idOrName
  return Array.isArray(param) ? param[0] : param
})

const localLoading: Ref<boolean> = ref(true)
const localError: Ref<string | null> = ref(null)

async function loadPokemonData(idOrName: string) {
  localLoading.value = true
  localError.value = null
  await fetchPokemonDetail(idOrName) // Le composable met à jour pokemonDetail, apiLoading, apiError
  if (apiError.value) {
    localError.value = apiError.value;
  }
  localLoading.value = false
}

onMounted(() => {
  if (pokemonIdOrNameFromRoute.value) {
    loadPokemonData(pokemonIdOrNameFromRoute.value)
  }
})

// Re-fetch si l'idOrName dans la route change (ex: navigation directe entre pages détail)
watch(pokemonIdOrNameFromRoute, (newIdOrName) => {
  if (newIdOrName) {
    // Réinitialiser l'état local avant de chercher le nouveau Pokémon
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

const isCurrentlyInTeam = computed<boolean>(() => {
  return !!(currentPokemonForTeam.value && isPokemonInTeam(currentPokemonForTeam.value.id))
})

function toggleTeamMembership() {
  if (currentPokemonForTeam.value) {
    if (isCurrentlyInTeam.value) {
      removePokemon(currentPokemonForTeam.value.id)
    } else {
      if (!isTeamFull.value) {
        addPokemon(currentPokemonForTeam.value)
      } else {
        alert("L'équipe Pokémon est pleine (maximum 6) !")
      }
    }
  }
}

const buttonText = computed<string>(() => {
  return isCurrentlyInTeam.value ? 'Retirer de l\'équipe' : 'Ajouter à l\'équipe'
})

const goBack = () => {
  router.back();
}
</script>

<template>
  <div class="pokemon-detail-view">
    <button @click="goBack" class="back-button">&lt; Retour</button>

    <div v-if="localLoading" class="loading-message">Chargement du Pokémon...</div>
    <div v-if="localError" class="error-message">
      <p>{{ localError }}</p>
      <button @click="loadPokemonData(pokemonIdOrNameFromRoute)" v-if="pokemonIdOrNameFromRoute">Réessayer</button>
    </div>

    <div v-if="pokemonDetail && !localLoading && !localError" class="pokemon-content">
      <h1 class="pokemon-name">{{ pokemonDetail.name }}</h1>
      <div class="pokemon-main-info">
        <img :src="pokemonDetail.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail.id}.png`" :alt="pokemonDetail.name" class="pokemon-image" />
        <div class="pokemon-stats">
          <p><strong>ID:</strong> #{{ String(pokemonDetail.id).padStart(3, '0') }}</p>
          <p><strong>Taille:</strong> {{ pokemonDetail.height / 10 }} m</p>
          <p><strong>Poids:</strong> {{ pokemonDetail.weight / 10 }} kg</p>
          <p>
            <strong>Types:</strong>
            <span
              v-for="typeInfo in pokemonDetail.types"
              :key="typeInfo.type.name"
              class="type-badge"
              :class="`type-${typeInfo.type.name}`"
            >
              {{ typeInfo.type.name }}
            </span>
          </p>
          <button
            @click="toggleTeamMembership"
            :disabled="!isCurrentlyInTeam && isTeamFull"
            :class="{ 'in-team': isCurrentlyInTeam }"
            class="team-button"
            :title="(!isCurrentlyInTeam && isTeamFull) ? 'L\'équipe est pleine' : ''"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>

      <div class="pokemon-abilities">
        <h2>Capacités</h2>
        <ul>
          <li v-for="abilityInfo in pokemonDetail.abilities" :key="abilityInfo.ability.name">
            {{ abilityInfo.ability.name }} {{ abilityInfo.is_hidden ? '(Cachée)' : '' }}
          </li>
        </ul>
      </div>

      <div class="pokemon-base-stats">
        <h2>Statistiques de Base</h2>
        <ul>
          <li v-for="stat in pokemonDetail.stats" :key="stat.stat.name">
            <span class="stat-name">{{ stat.stat.name }}:</span>
            <span class="stat-value">{{ stat.base_stat }}</span>
            <div class="stat-bar-container">
              <div class="stat-bar" :style="{ width: (stat.base_stat / 255 * 100) + '%' }"></div>
            </div>
          </li>
        </ul>
      </div>

      <div class="pokemon-sprites-gallery">
        <h2>Galerie de Sprites</h2>
        <div class="sprites-container">
          <img v-if="pokemonDetail.sprites.front_default" :src="pokemonDetail.sprites.front_default" alt="Sprite normal avant" title="Normal Avant">
          <img v-if="pokemonDetail.sprites.back_default" :src="pokemonDetail.sprites.back_default" alt="Sprite normal arrière" title="Normal Arrière">
          <img v-if="pokemonDetail.sprites.front_shiny" :src="pokemonDetail.sprites.front_shiny" alt="Sprite shiny avant" title="Shiny Avant">
          <img v-if="pokemonDetail.sprites.back_shiny" :src="pokemonDetail.sprites.back_shiny" alt="Sprite shiny arrière" title="Shiny Arrière">
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.pokemon-detail-view {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: 'Arial', sans-serif;
}

.back-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1.5rem;
  font-size: 0.9em;
}
.back-button:hover {
  background-color: #545b62;
}

.loading-message, .error-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2em;
  color: #555;
}
.error-message {
  color: red;
}
.error-message button {
  margin-top: 10px;
  padding: 8px 15px;
  cursor: pointer;
}

.pokemon-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.pokemon-name {
  text-align: center;
  text-transform: capitalize;
  font-size: 2.5em;
  color: #333;
  margin-bottom: 1rem;
}

.pokemon-main-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: flex-start;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  background-color: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 10px;
}

.pokemon-stats {
  flex-grow: 1;
}
.pokemon-stats p {
  margin: 0.5rem 0;
  font-size: 1.1em;
  color: #333;
}
.pokemon-stats strong {
  color: #555;
}

.team-button {
  padding: 0.6em 1.2em;
  font-size: 0.9em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #28a745;
  color: white;
  transition: background-color 0.2s;
  margin-top: 1rem;
  display: inline-block;
}
.team-button.in-team {
  background-color: #dc3545;
}
.team-button:hover:not(:disabled) {
  filter: brightness(110%);
}
.team-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.type-badge {
  display: inline-block;
  padding: 0.3em 0.7em;
  margin-right: 0.5em;
  border-radius: 12px;
  color: white;
  font-size: 0.9em;
  text-transform: capitalize;
  background-color: #A8A878;
}
.type-fire { background-color: #F08030; }
.type-water { background-color: #6890F0; }
.type-grass { background-color: #78C850; }
.type-electric { background-color: #F8D030; }
.type-ice { background-color: #98D8D8; }
.type-fighting { background-color: #C03028; }
.type-poison { background-color: #A040A0; }
.type-ground { background-color: #E0C068; }
.type-flying { background-color: #A890F0; }
.type-psychic { background-color: #F85888; }
.type-bug { background-color: #A8B820; }
.type-rock { background-color: #B8A038; }
.type-ghost { background-color: #705898; }
.type-dragon { background-color: #7038F8; }
.type-dark { background-color: #705848; }
.type-steel { background-color: #B8B8D0; }
.type-fairy { background-color: #EE99AC; }


.pokemon-abilities, .pokemon-base-stats, .pokemon-sprites-gallery {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}
.pokemon-abilities h2, .pokemon-base-stats h2, .pokemon-sprites-gallery h2 {
  margin-bottom: 1rem;
  color: #444;
}
.pokemon-abilities ul, .pokemon-base-stats ul {
  list-style: none;
  padding: 0;
}
.pokemon-abilities li, .pokemon-base-stats li {
  padding: 0.4rem 0;
  font-size: 1.05em;
  text-transform: capitalize;
  color: #444;
}

.stat-name {
  display: inline-block;
  width: 150px;
  font-weight: bold;
  color: #555;
}
.stat-value {
  display: inline-block;
  width: 40px;
  text-align: right;
  margin-right: 10px;
  font-weight: bold;
}
.stat-bar-container {
  display: inline-block;
  width: calc(100% - 200px);
  background-color: #e0e0e0;
  border-radius: 4px;
  height: 12px;
  overflow: hidden;
}
.stat-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}
.pokemon-base-stats li:nth-child(1) .stat-bar { background-color: #FF5959; } /* HP */
.pokemon-base-stats li:nth-child(2) .stat-bar { background-color: #F5AC78; } /* Attack */
.pokemon-base-stats li:nth-child(3) .stat-bar { background-color: #FAE078; } /* Defense */
.pokemon-base-stats li:nth-child(4) .stat-bar { background-color: #9DB7F5; } /* Special Attack */
.pokemon-base-stats li:nth-child(5) .stat-bar { background-color: #A7DB8D; } /* Special Defense */
.pokemon-base-stats li:nth-child(6) .stat-bar { background-color: #FA92B2; } /* Speed */

.sprites-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.sprites-container img {
  background-color: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;
  width: 96px;
  height: 96px;
  object-fit: contain;
}
</style>
