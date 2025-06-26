import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type Language = 'en' | 'fr'

export interface PokemonName {
  language: {
    name: string
    url: string
  }
  name: string
}

export interface PokemonSpecies {
  id: number
  names: PokemonName[]
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
      url: string
    }
  }>
}

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref<Language>('fr')
  
  const loadLanguage = () => {
    const saved = localStorage.getItem('pokemon-language')
    if (saved && (saved === 'en' || saved === 'fr')) {
      currentLanguage.value = saved as Language
    }
  }
  
  const saveLanguage = () => {
    localStorage.setItem('pokemon-language', currentLanguage.value)
  }
  
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    saveLanguage()
  }
  
  const getTranslatedName = (names: PokemonName[], fallbackName: string): string => {
    const translated = names.find(n => n.language.name === currentLanguage.value)
    return translated?.name || fallbackName
  }
  
  const getTranslatedDescription = (entries: Array<{flavor_text: string, language: {name: string}}>, fallback: string = ''): string => {
    const translated = entries.find(e => e.language.name === currentLanguage.value)
    return translated?.flavor_text?.replace(/\f/g, ' ') || fallback
  }
  
  const translations = computed(() => {
    const texts = {
      en: {
        search: 'Search for a Pokémon...',
        searchButton: 'Search',
        clear: 'Clear',
        addToTeam: 'Add to team',
        removeFromTeam: 'Remove from team',
        teamFull: 'Team is full',
        myTeam: 'My Team',
        home: 'Home',
        berries: 'Berries',
        loadMore: 'Load more',
        loading: 'Loading...',
        noResults: 'No results found',
        error: 'An error occurred',
        retry: 'Retry',
        back: 'Back',
        height: 'Height',
        weight: 'Weight',
        types: 'Types',
        abilities: 'Abilities',
        stats: 'Base Stats',
        sprites: 'Sprites Gallery',
        clearTeam: 'Clear team',
        emptyTeam: 'Your team is empty',
        explorePokemon: 'Explore Pokémon',
        generation: 'Filter by generation',
        all: 'All',
        firmness: 'Firmness',
        flavors: 'Flavors',
        size: 'Size',
        smoothness: 'Smoothness',
        soilDryness: 'Soil Dryness',
        berryDetails: 'Berry Details',
        searchBerry: 'Search for a berry...',
        noBerryFound: 'No berry found for',
        berrySearchResult: 'Berry search result',
      },
      fr: {
        search: 'Rechercher un Pokémon...',
        searchButton: 'Rechercher',
        clear: 'Effacer',
        addToTeam: 'Ajouter à l\'équipe',
        removeFromTeam: 'Retirer de l\'équipe',
        teamFull: 'L\'équipe est pleine',
        myTeam: 'Mon Équipe',
        home: 'Accueil',
        berries: 'Baies',
        loadMore: 'Charger plus',
        loading: 'Chargement...',
        noResults: 'Aucun résultat trouvé',
        error: 'Une erreur s\'est produite',
        retry: 'Réessayer',
        back: 'Retour',
        height: 'Taille',
        weight: 'Poids',
        types: 'Types',
        abilities: 'Capacités',
        stats: 'Statistiques de Base',
        sprites: 'Galerie de Sprites',
        clearTeam: 'Vider l\'équipe',
        emptyTeam: 'Votre équipe est vide',
        explorePokemon: 'Explorer les Pokémon',
        generation: 'Filtrer par génération',
        all: 'Toutes',
        firmness: 'Fermeté',
        flavors: 'Saveurs',
        size: 'Taille',
        smoothness: 'Douceur',
        soilDryness: 'Sécheresse du Sol',
        berryDetails: 'Détails de la Baie',
        searchBerry: 'Rechercher une baie...',
        noBerryFound: 'Aucune baie trouvée pour',
        berrySearchResult: 'Résultat de la recherche de baie',
      }
    }
    return texts[currentLanguage.value]
  })
  
  loadLanguage()
  
  return {
    currentLanguage,
    setLanguage,
    getTranslatedName,
    getTranslatedDescription,
    t: translations
  }
})