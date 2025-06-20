<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue'
import PokemonCard from '@/components/PokemonCard.vue'
import PokemonSearch from '@/components/PokemonSearch.vue'
import { usePokeApi, type PokemonListItem, type PokemonDetail as FullPokemonDetail } from '@/composables/usePokeApi'

interface DisplayPokemon {
  id: number;
  name: string;
  sprite: string;
}

const {
  pokemons: allPokemons,
  loading,
  error,
  fetchPokemons,
  nextPageUrl,
  searchPokemonByName,
  pokemonDetail: searchedPokemonDetail,
  fetchPokemonsByGeneration,
} = usePokeApi()

const searchTerm: Ref<string> = ref('')
const displayablePokemons: Ref<DisplayPokemon[]> = ref([])
const searchResultPokemon: Ref<DisplayPokemon | null> = ref(null)

function extractPokemonId(url: string): number {
  const parts = url.split('/').filter(part => part);
  return parseInt(parts[parts.length - 1]);
}

async function prepareDisplayablePokemons(list: PokemonListItem[]) {
  const processedPokemons: DisplayPokemon[] = list.map(p => {
    const id = extractPokemonId(p.url);
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return {
      id: id,
      name: p.name,
      sprite: spriteUrl
    };
  });
  displayablePokemons.value.push(...processedPokemons);
}

onMounted(async () => {
  await fetchPokemons();
  if (allPokemons.value.length > 0) {
    await prepareDisplayablePokemons(allPokemons.value);
  }
});

async function loadMorePokemons() {
  if (nextPageUrl.value && !loading.value) {
    const currentCount = allPokemons.value.length;
    await fetchPokemons(nextPageUrl.value);
    const newPokemons = allPokemons.value.slice(currentCount);
    if (newPokemons.length > 0) {
      await prepareDisplayablePokemons(newPokemons);
    }
  }
}

async function handleSearch(query: string) {
  if (!query) {
    searchResultPokemon.value = null;
    return;
  }
  searchTerm.value = query;
  const result: FullPokemonDetail | null = await searchPokemonByName(query);
  if (result) {
    searchResultPokemon.value = {
      id: result.id,
      name: result.name,
      sprite: result.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${result.id}.png`
    };
  } else {
    searchResultPokemon.value = null;
    if (!error.value) {
    }
  }
}

async function handleGenerationChange(event) {
  const gen = parseInt(event.target.value);
  displayablePokemons.value = [];
  if (gen === 0) {
    await fetchPokemons();
    if (allPokemons.value.length > 0) {
      await prepareDisplayablePokemons(allPokemons.value);
    }
  } else {
    const list = await fetchPokemonsByGeneration(gen);
    if (list.length > 0) {
      await prepareDisplayablePokemons(list);
    }
  }
}

const filteredPokemons = computed(() => {
  return displayablePokemons.value;
});

</script>

<template>
  <div class="home-view">
    <h1>Pokédex</h1>
    <PokemonSearch v-model="searchTerm" @search="handleSearch" />

    <div class="filters">
      <label for="generation">Filtrer par génération :</label>
      <select id="generation" @change="handleGenerationChange">
        <option value="0">Toutes</option>
        <option value="1">Génération 1</option>
        <option value="2">Génération 2</option>
        <option value="3">Génération 3</option>
        <option value="4">Génération 4</option>
        <option value="5">Génération 5</option>
        <option value="6">Génération 6</option>
        <option value="7">Génération 7</option>
        <option value="8">Génération 8</option>
        <option value="9">Génération 9</option>
      </select>
    </div>

    <div v-if="loading && !displayablePokemons.length && !searchResultPokemon" class="loading-message">
      Chargement des Pokémon...
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchPokemons(); searchTerm=''; searchResultPokemon=null;">Réessayer</button>
    </div>

    <div v-if="searchResultPokemon && !error" class="search-result-section">
      <h2>Résultat de la recherche :</h2>
      <PokemonCard :pokemonData="searchResultPokemon" />
      <hr class="separator" v-if="filteredPokemons.length > 0">
    </div>
    <div v-if="searchTerm && !searchResultPokemon && !loading && !error" class="no-result-message">
      Aucun Pokémon trouvé pour "{{ searchTerm }}".
    </div>

    <div v-if="!error">
      <div v-if="filteredPokemons.length > 0" class="pokemon-grid">
        <PokemonCard
          v-for="pokemon in filteredPokemons"
          :key="pokemon.id"
          :pokemonData="pokemon"
        />
      </div>
      <div v-else-if="!loading && !searchResultPokemon && !searchTerm" class="no-pokemon-message">
        Aucun Pokémon à afficher.
      </div>

      <button v-if="nextPageUrl && !loading && !searchResultPokemon && filteredPokemons.length > 0" @click="loadMorePokemons" class="load-more-button">
        Charger plus
      </button>
      <div v-if="loading && (displayablePokemons.length > 0 || searchResultPokemon)" class="loading-more-message">
        Chargement de plus de Pokémon...
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 1rem 2rem 1rem;
  font-family: 'Arial', sans-serif;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  margin-top: 20px;
  color: #222;
}

h1, h2, h3, label, p, .filters, .pokemon-id, .no-pokemon-message, .loading-message, .error-message, .no-result-message {
  color: #222 !important;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filters {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Recherche responsive */
.pokemon-search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.pokemon-search-form input[type="text"] {
  flex: 1 1 180px;
  min-width: 0;
}
.pokemon-search-form button {
  flex: 0 0 auto;
}

@media (max-width: 600px) {
  .pokemon-search-form {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  .pokemon-search-form input[type="text"],
  .pokemon-search-form button {
    width: 100%;
    min-width: 0;
  }
}

@media (min-width: 600px) {
  .home-view {
    padding: 2.5rem 2rem 2rem 2rem;
  }
  .pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .home-view {
    padding: 3rem 4rem 2.5rem 4rem;
  }
  .pokemon-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.loading-message, .error-message, .no-pokemon-message, .loading-more-message, .no-result-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2em;
  color: #555;
}

.error-message {
  color: red;
  border: 1px solid red;
  background-color: #ffe0e0;
  border-radius: 4px;
}
.error-message button {
  margin-top: 10px;
  padding: 8px 15px;
  cursor: pointer;
}

.search-result-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.search-result-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}
.search-result-section .pokemon-card {
  max-width: 250px;
  margin-left: auto;
  margin-right: auto;
}

.separator {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid #eee;
}

.load-more-button {
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more-button:hover {
  background-color: #0056b3;
}
.load-more-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.filters {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filters select {
  background-color: #f9f9f9;
  color: #222;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

</style>