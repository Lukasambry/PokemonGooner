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
        machines: 'Ability',
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
        attack : 'Attack',
        defense: 'Defense',
        speed: 'Speed',
        specialAttack: 'Special Attack',
        specialDefense: 'Special Defense',
        hp: 'HP',
        type: 'Type',
        normal: 'Normal',
        fire: 'Fire',
        water: 'Water',
        electric: 'Electric',
        grass: 'Grass',
        ice: 'Ice',
        fighting: 'Fighting',
        poison: 'Poison',
        ground: 'Ground',
        flying: 'Flying',
        psychic: 'Psychic',
        bug: 'Bug',
        rock: 'Rock',
        ghost: 'Ghost',
        dragon: 'Dragon',
        dark: 'Dark',
        steel: 'Steel',
        fairy: 'Fairy',
        ability: 'Ability',
        hiddenAbility: 'Hidden Ability',
        frontNormal: 'Front',
        backNormal: 'Back',
        frontShiny: 'Front Shiny',
        backShiny: 'Back Shiny',
        catchSomePokemon: "Go catch some Pokémon!",
        emptySlot: "Empty slot",
        catchPokemon: "Catch a Pokémon!",
        tips: "Tips for your team",
        diversifyTypes: "Diversify types",
        diversifyTypesText: "A balanced team with different Pokémon types will be more effective in battle.",
        balanceStats: "Balance stats",
        balanceStatsText: "Mix offensive and defensive Pokémon to cover all situations.",
        specialAbilities: "Special abilities",
        specialAbilitiesText: "Some hidden abilities can give you an edge in battle.",
        progression: "Progression",
        progressionText: "You can have up to {max} Pokémon in your team.",
        pokedex: "Pokédex",
        generation1: "Generation 1 (Kanto)",
        generation2: "Generation 2 (Johto)",
        generation3: "Generation 3 (Hoenn)",
        generation4: "Generation 4 (Sinnoh)",
        generation5: "Generation 5 (Unova)",
        generation6: "Generation 6 (Kalos)",
        generation7: "Generation 7 (Alola)",
        generation8: "Generation 8 (Galar)",
        generation9: "Generation 9 (Paldea)",
        berryGrowthInfo: "Growth Information",
        growthTime: "Growth Time",
        maxHarvest: "Max Harvest",
        naturalGiftPower: "Natural Gift Power",
        naturalGift: "Natural Gift",
      },
      fr: {
        search: 'Rechercher un Pokémon...',
        searchButton: 'Rechercher',
        clear: 'Effacer',
        addToTeam: 'Ajouter à l\'équipe',
        removeFromTeam: 'Retirer de l\'équipe',
        teamFull: 'L\'équipe est pleine',
        myTeam: 'Mon Équipe',
        machines: 'Capacités',
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
        attack: 'Attaque',
        defense: 'Défense',
        speed: 'Vitesse',
        specialAttack: 'Attaque Spéciale',
        specialDefense: 'Défense Spéciale',
        hp: 'PV',
        type: 'Type',
        normal: 'Normal',
        fire: 'Feu',
        water: 'Eau',
        electric: 'Électrik',
        grass: 'Plante',
        ice: 'Glace',
        fighting: 'Combat',
        poison: 'Poison',
        ground: 'Sol',
        flying: 'Vol',
        psychic: 'Psy',
        bug: 'Insecte',
        rock: 'Roche',
        ghost: 'Spectre',
        dragon: 'Dragon',
        dark: 'Ténèbres',
        steel: 'Acier',
        fairy: 'Fée',
        ability: 'Capacité',
        hiddenAbility: 'Capacité cachée',
        frontNormal: 'Avant',
        backNormal: 'Arrière',
        frontShiny: 'Avant Shiny',
        backShiny: 'Arrière Shiny',
        catchSomePokemon: "Allez attraper quelques Pokémon !",
        emptySlot: "Emplacement libre",
        catchPokemon: "Attrapez un Pokémon !",
        tips: "Conseils pour votre équipe",
        diversifyTypes: "Diversifiez les types",
        diversifyTypesText: "Une équipe équilibrée avec différents types de Pokémon sera plus efficace au combat.",
        balanceStats: "Équilibrez les stats",
        balanceStatsText: "Mélangez des Pokémon offensifs et défensifs pour couvrir toutes les situations.",
        specialAbilities: "Capacités spéciales",
        specialAbilitiesText: "Certaines capacités cachées peuvent donner l'avantage en combat.",
        progression: "Progression",
        progressionText: "Vous pouvez avoir jusqu'à {max} Pokémon dans votre équipe.",
        pokedex: "Pokédex",
        generation1: "Génération 1 (Kanto)",
        generation2: "Génération 2 (Johto)",
        generation3: "Génération 3 (Hoenn)",
        generation4: "Génération 4 (Sinnoh)",
        generation5: "Génération 5 (Unys)",
        generation6: "Génération 6 (Kalos)",
        generation7: "Génération 7 (Alola)",
        generation8: "Génération 8 (Galar)",
        generation9: "Génération 9 (Paldea)",
        berryGrowthInfo: "Informations de Croissance",
        growthTime: "Temps de Croissance",
        maxHarvest: "Récolte Maximum",
        naturalGiftPower: "Puissance Don Naturel",
        naturalGift: "Don Naturel",
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
