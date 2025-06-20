import { computed } from 'vue'
import { useTeamStore, type TeamPokemon } from '@/stores/teamStore'
import type { ComputedRef } from 'vue'

export function usePokemonTeam() {
  const teamStore = useTeamStore();

  const team: ComputedRef<readonly TeamPokemon[]> = computed(() => teamStore.team);
  const teamCount: ComputedRef<number> = computed(() => teamStore.teamCount);
  const isTeamFull: ComputedRef<boolean> = computed(() => teamStore.isTeamFull);

  const addPokemon = (pokemon: TeamPokemon): boolean => {
    return teamStore.addPokemon(pokemon);
  }

  const removePokemon = (pokemonId: number): void => {
    teamStore.removePokemon(pokemonId);
  }

  const isPokemonInTeam = (pokemonId: number): boolean => {
    return teamStore.isPokemonInTeam(pokemonId);
  }

  const clearTeam = (): void => {
    teamStore.clearTeam();
  }

  return {
    team,
    teamCount,
    isTeamFull,
    addPokemon,
    removePokemon,
    isPokemonInTeam,
    clearTeam,
    MAX_TEAM_SIZE: teamStore.MAX_TEAM_SIZE
  }
}
