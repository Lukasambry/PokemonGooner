import { ref, type Ref } from 'vue'
import axios, { type AxiosError } from 'axios'
import type { PokemonSpecies } from '@/stores/languageStore'
import { useLanguageStore } from '@/stores/languageStore'

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

interface PokemonSprite {
  front_default: string;
  back_default?: string;
  front_shiny?: string;
  back_shiny?: string;
}

interface PokemonTypeInfo {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonAbilityInfo {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface PokemonStatInfo {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprite;
  types: PokemonTypeInfo[];
  abilities: PokemonAbilityInfo[];
  stats: PokemonStatInfo[];
  species: {
    name: string;
    url: string;
  };
}

export interface EnhancedPokemonDetail extends PokemonDetail {
  species_data?: PokemonSpecies;
}

export function usePokeApi() {
  const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/';

  const pokemons: Ref<PokemonListItem[]> = ref([]);
  const pokemonDetail: Ref<EnhancedPokemonDetail | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  const nextPageUrl: Ref<string | null> = ref(null);

  async function fetchPokemons(url?: string): Promise<void> {
    loading.value = true;
    error.value = null;
    const fetchUrl = url || `${POKEAPI_BASE_URL}pokemon?limit=20&offset=0`;

    try {
      const response = await axios.get<PokemonListResponse>(fetchUrl);
      if (url) {
        pokemons.value.push(...response.data.results);
      } else {
        pokemons.value = response.data.results;
      }
      nextPageUrl.value = response.data.next;
    } catch (e) {
      const axiosError = e as AxiosError;
      console.error("Erreur lors de la récupération des Pokémon:", axiosError);
      error.value = `Impossible de charger la liste des Pokémon. (${axiosError.message})`;
      pokemons.value = [];
      nextPageUrl.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPokemonDetail(idOrName: string | number): Promise<void> {
    loading.value = true;
    error.value = null;
    pokemonDetail.value = null;

    try {
      const response = await axios.get<PokemonDetail>(`${POKEAPI_BASE_URL}pokemon/${String(idOrName).toLowerCase()}`);
      const pokemon = response.data;

      let speciesData: PokemonSpecies | undefined;
      try {
        const speciesResponse = await axios.get<PokemonSpecies>(pokemon.species.url);
        speciesData = speciesResponse.data;
      } catch (speciesError) {
        console.warn("Impossible de récupérer les données d'espèce:", speciesError);
      }

      pokemonDetail.value = {
        ...pokemon,
        species_data: speciesData
      };
    } catch (e) {
      const axiosError = e as AxiosError;
      console.error(`Erreur lors de la récupération du Pokémon ${idOrName}:`, axiosError);
      if (axiosError.response && axiosError.response.status === 404) {
        error.value = `Pokémon "${idOrName}" non trouvé.`;
      } else {
        error.value = `Impossible de charger les détails du Pokémon. (${axiosError.message})`;
      }
      pokemonDetail.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function searchPokemonByName(name: string): Promise<EnhancedPokemonDetail | null> {
    if (!name.trim()) return null;
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get<PokemonDetail>(`${POKEAPI_BASE_URL}pokemon/${name.toLowerCase()}`);
      const pokemon = response.data;

      let speciesData: PokemonSpecies | undefined;
      try {
        const speciesResponse = await axios.get<PokemonSpecies>(pokemon.species.url);
        speciesData = speciesResponse.data;
      } catch (speciesError) {
        console.warn("Impossible de récupérer les données d'espèce:", speciesError);
      }

      return {
        ...pokemon,
        species_data: speciesData
      };
    } catch (e) {
      const axiosError = e as AxiosError;
      console.error(`Erreur de recherche pour ${name}:`, axiosError);
      if (axiosError.response && axiosError.response.status === 404) {
        error.value = `Pokémon "${name}" non trouvé.`;
      } else {
        error.value = `Erreur lors de la recherche. (${axiosError.message})`;
      }
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPokemonsByGeneration(gen: number): Promise<PokemonListItem[]> {
    try {
      const response = await axios.get(`${POKEAPI_BASE_URL}generation/${gen}/`);
      const species = response.data.pokemon_species as { name: string, url: string }[];
      const sorted = species
        .map(s => {
          const parts = s.url.split('/').filter(Boolean);
          const id = parts[parts.length - 1];
          return {
            name: s.name,
            url: `${POKEAPI_BASE_URL}pokemon/${id}/`
          };
        })
        .sort((a, b) => {
          const idA = parseInt(a.url.split('/').filter(Boolean).pop()!);
          const idB = parseInt(b.url.split('/').filter(Boolean).pop()!);
          return idA - idB;
        });
      pokemons.value = sorted;
      nextPageUrl.value = null;
      return sorted;
    } catch (e) {
      const axiosError = e as AxiosError;
      error.value = `Erreur lors du chargement de la génération. (${axiosError.message})`;
      pokemons.value = [];
      nextPageUrl.value = null;
      return [];
    }
  }

  return {
    pokemons,
    pokemonDetail,
    loading,
    error,
    nextPageUrl,
    fetchPokemons,
    fetchPokemonDetail,
    fetchPokemonsByGeneration,
    searchPokemonByName
  }
}

export async function getTranslatedPokemonName(id: number): Promise<string> {
  const languageStore = useLanguageStore();
  const lang = languageStore.currentLanguage
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
  const names = response.data.names as { name: string, language: { name: string } }[]
  const translated = names.find(n => n.language.name === lang)
  return translated ? translated.name : response.data.name
}
