<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonTeam } from '@/composables/usePokemonTeam'
import type { TeamPokemon } from '@/stores/teamStore'

interface PokemonCardData {
  id: number;
  name: string;
  sprite: string;
}

interface Props {
  pokemonData: PokemonCardData;
}
const props = defineProps<Props>()

const router = useRouter()
const { addPokemon, removePokemon, isPokemonInTeam, isTeamFull } = usePokemonTeam()

const isCurrentlyInTeam = computed<boolean>(() => isPokemonInTeam(props.pokemonData.id))

function navigateToDetail() {
  router.push({ name: 'pokemon-detail', params: { idOrName: props.pokemonData.name } })
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
      alert("L'équipe Pokémon est pleine (maximum 6) !");
    }
  }
}

const buttonText = computed<string>(() => {
  return isCurrentlyInTeam.value ? 'Retirer de l\'équipe' : 'Ajouter à l\'équipe';
});

</script>

<template>
  <div class="pokemon-card" @click="navigateToDetail">
    <img :src="pokemonData.sprite" :alt="pokemonData.name" class="pokemon-sprite"/>
    <h3 class="pokemon-name">{{ pokemonData.name }}</h3>
    <p class="pokemon-id">#{{ String(pokemonData.id).padStart(3, '0') }}</p>
    <button
      @click.stop="toggleTeamMembership"
      :disabled="!isCurrentlyInTeam && isTeamFull"
      :class="{ 'in-team': isCurrentlyInTeam }"
      :title="(!isCurrentlyInTeam && isTeamFull) ? 'L\'équipe est pleine' : ''"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
.pokemon-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pokemon-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.pokemon-sprite {
  width: 96px;
  height: 96px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  align-self: center;
}
.pokemon-name {
  text-transform: capitalize;
  margin: 0.5rem 0;
  font-size: 1.1em;
  color: #333;
}
.pokemon-id {
  font-size: 0.9em;
  color: #777;
  margin-bottom: 0.75rem;
}
.pokemon-card button {
  padding: 0.4em 0.8em;
  font-size: 0.85em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  transition: background-color 0.2s;
  margin-top: auto;
}
.pokemon-card button.in-team {
  background-color: #f44336;
}
.pokemon-card button:hover:not(:disabled) {
  filter: brightness(110%);
}
.pokemon-card button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
