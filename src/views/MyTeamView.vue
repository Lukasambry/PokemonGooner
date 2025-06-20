<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import type { TeamPokemon } from '@/stores/teamStore'

const { team, teamCount, removePokemon, clearTeam, MAX_TEAM_SIZE } = usePokemonTeam()
const router = useRouter()

function viewPokemonDetail(pokemonName: string) {
  router.push({ name: 'pokemon-detail', params: { idOrName: pokemonName } })
}

function confirmAndClearTeam() {
  if (window.confirm("Êtes-vous sûr de vouloir vider toute votre équipe Pokémon ?")) {
    clearTeam();
  }
}
</script>

<template>
  <div class="my-team-view">
    <h1>Mon Équipe Pokémon ({{ teamCount }} / {{ MAX_TEAM_SIZE }})</h1>

    <div v-if="teamCount === 0" class="empty-team-message">
      <p>Votre équipe est vide. Allez attraper quelques Pokémon !</p>
      <router-link to="/" class="explore-button">Explorer les Pokémon</router-link>
    </div>

    <div v-else class="team-grid">
      <div v-for="pokemon in team" :key="pokemon.id" class="team-member-card">
        <img :src="pokemon.sprite" :alt="pokemon.name" class="pokemon-sprite" @click="viewPokemonDetail(pokemon.name)" />
        <h3 class="pokemon-name" @click="viewPokemonDetail(pokemon.name)">{{ pokemon.name }}</h3>
        <p class="pokemon-id">#{{ String(pokemon.id).padStart(3, '0') }}</p>
        <button @click="removePokemon(pokemon.id)" class="remove-button">
          Retirer
        </button>
      </div>
    </div>

    <button
      v-if="teamCount > 0"
      @click="confirmAndClearTeam"
      class="clear-team-button"
    >
      Vider l'équipe
    </button>
  </div>
</template>

<style scoped>
.my-team-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem 1rem 1.5rem 1rem;
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #eee;
  margin-bottom: 2rem;
}

.empty-team-message {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #ddd;
}
.empty-team-message p {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 1rem;
}
.explore-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1em;
  transition: background-color 0.2s;
}
.explore-button:hover {
  background-color: #0056b3;
}

.team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 600px) {
  .my-team-view {
    padding: 2rem 2rem 1.5rem 2rem;
  }
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .my-team-view {
    padding: 2.5rem 3rem 2rem 3rem;
    max-width: 1400px;
  }
  .team-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.team-member-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.team-member-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.pokemon-sprite {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  align-self: center;
  cursor: pointer;
}

.pokemon-name {
  text-transform: capitalize;
  margin: 0.5rem 0;
  font-size: 1.1em;
  color: #333;
  cursor: pointer;
}
.pokemon-name:hover {
  color: #007bff;
}

.pokemon-id {
  font-size: 0.85em;
  color: #777;
  margin-bottom: 0.75rem;
}

.remove-button {
  padding: 0.4em 0.8em;
  font-size: 0.85em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f44336;
  color: white;
  transition: background-color 0.2s;
  margin-top: auto;
}
.remove-button:hover {
  background-color: #d32f2f;
}

.clear-team-button {
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.clear-team-button:hover {
  background-color: #c82333;
}
</style>
