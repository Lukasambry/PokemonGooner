import { ref } from 'vue'
import { defineStore } from 'pinia'
import { i18n } from '@/plugins/i18n'

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
  const currentLanguage = ref<Language>(i18n.global.locale.value as Language)

  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    i18n.global.locale.value = lang
    localStorage.setItem('pokemon-language', lang)
  }

  const getTranslatedName = (names: PokemonName[], fallbackName: string): string => {
    const translated = names.find(n => n.language.name === currentLanguage.value)
    return translated?.name || fallbackName
  }

  const getTranslatedDescription = (entries: Array<{flavor_text: string, language: {name: string}}>, fallback: string = ''): string => {
    const translated = entries.find(e => e.language.name === currentLanguage.value)
    return translated?.flavor_text?.replace(/\f/g, ' ') || fallback
  }

  return {
    currentLanguage,
    setLanguage,
    getTranslatedName,
    getTranslatedDescription
  }
})
