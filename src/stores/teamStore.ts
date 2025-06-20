// src/stores/teamStore.ts
import { ref, computed, readonly, type Ref } from 'vue'
import { defineStore } from 'pinia'

export interface TeamPokemon {
  id: number;
  name: string;
  sprite: string;
}

export const MAX_TEAM_SIZE = 6

export const useTeamStore = defineStore('team', () => {
  const team: Ref<TeamPokemon[]> = ref([])

  const _loadState = () => {
    const savedTeam = localStorage.getItem('pokemonTeam')
    console.log('[TeamStore] Loading state from localStorage:', savedTeam);
    if (savedTeam) {
      try {
        const parsedTeam = JSON.parse(savedTeam) as TeamPokemon[]
        if (Array.isArray(parsedTeam) && parsedTeam.every(p =>
          p &&
          typeof p.id === 'number' &&
          typeof p.name === 'string' &&
          typeof p.sprite === 'string'
        )) {
          team.value = parsedTeam
          console.log('[TeamStore] State loaded:', team.value);
        } else {
          console.warn('[TeamStore] Invalid team data found in localStorage. Resetting team.')
          team.value = []
          localStorage.removeItem('pokemonTeam')
        }
      } catch (e) {
        console.error('[TeamStore] Failed to parse team from localStorage:', e)
        team.value = []
        localStorage.removeItem('pokemonTeam')
      }
    } else {
      console.log('[TeamStore] No saved team found in localStorage.');
    }
  }

  _loadState()

  const _saveState = () => {
    try {
      localStorage.setItem('pokemonTeam', JSON.stringify(team.value))
      console.log('[TeamStore] State saved to localStorage:', team.value);
    } catch (e) {
      console.error('[TeamStore] Failed to save team to localStorage:', e)
    }
  }

  const teamCount = computed(() => team.value.length)

  const addPokemon = (pokemon: TeamPokemon): boolean => {
    if (team.value.length < MAX_TEAM_SIZE && !team.value.find(p => p.id === pokemon.id)) {
      team.value.push(pokemon)
      _saveState()
      console.log('[TeamStore] Pokemon added:', pokemon, 'New team:', team.value);
      return true
    }
    console.log('[TeamStore] Pokemon not added (full or already exists):', pokemon);
    return false
  }

  const removePokemon = (pokemonId: number) => {
    team.value = team.value.filter(p => p.id !== pokemonId)
    _saveState()
    console.log('[TeamStore] Pokemon removed, ID:', pokemonId, 'New team:', team.value);
  }

  const clearTeam = () => {
    team.value = []
    _saveState()
    console.log('[TeamStore] Team cleared.');
  }

  const isPokemonInTeam = (pokemonId: number): boolean => {
    return !!team.value.find(p => p.id === pokemonId)
  }

  const isTeamFull = computed(() => team.value.length >= MAX_TEAM_SIZE)

  return {
    team: readonly(team),
    teamCount,
    addPokemon,
    removePokemon,
    clearTeam,
    isPokemonInTeam,
    MAX_TEAM_SIZE: readonly(ref(MAX_TEAM_SIZE)),
    isTeamFull,
  }
})
