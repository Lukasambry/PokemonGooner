<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/languageStore'
const { currentLanguage, setLanguage, t } = useLanguageStore()
const route = useRoute()
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function handleLanguageChange(event: Event) {
  const target = event.target as HTMLSelectElement
  setLanguage(target.value as 'en' | 'fr')
}
</script>

<template>
  <nav class="nav-pokemon fixed top-0 left-0 right-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <router-link to="/" class="flex items-center space-x-3" @click="closeMenu">
          <div class="w-10 h-10 bg-pokemon-yellow rounded-full border-3 border-pokemon-black flex items-center justify-center">
            <div class="w-5 h-5 bg-pokemon-blue rounded-full animate-pulse"></div>
          </div>
          <span class="text-white font-bold text-xl tracking-wide">P0k3G00n3r</span>
        </router-link>

        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/"
            :class="{ 'bg-pokemon-yellow text-pokemon-black': route.name === 'home' }"
            class="text-white hover:text-pokemon-yellow transition-colors duration-300 font-semibold px-3 py-2 rounded-md text-sm"
            @click="closeMenu"
          >
            {{ t.home }}
          </router-link>
          
          <router-link 
            to="/berries"
            :class="{ 'bg-pokemon-yellow text-pokemon-black': route.name === 'berries' }"
            class="text-white hover:text-pokemon-yellow transition-colors duration-300 font-semibold px-3 py-2 rounded-md text-sm"
            @click="closeMenu"
          >
            {{ t.berries }}
          </router-link>
          
          <router-link 
            to="/my-team"
            :class="{ 'bg-pokemon-yellow text-pokemon-black': route.name === 'my-team' }"
            class="text-white hover:text-pokemon-yellow transition-colors duration-300 font-semibold px-3 py-2 rounded-md text-sm"
            @click="closeMenu"
          >
            {{ t.myTeam }}
          </router-link>

          <div class="relative">
            <select 
              :value="currentLanguage"
              @change="handleLanguageChange"
              class="bg-pokemon-yellow text-pokemon-black border-2 border-pokemon-black rounded-lg px-3 py-1 text-sm font-semibold cursor-pointer hover:bg-pokemon-yellow-dark transition-colors duration-300"
            >
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇬🇧 EN</option>
            </select>
          </div>
        </div>

        <button 
          @click="toggleMenu" 
          class="md:hidden text-white hover:text-pokemon-yellow transition-colors duration-300 p-2"
          :aria-expanded="menuOpen"
          aria-label="Menu principal"
        >
          <svg class="w-6 h-6 transform transition-transform duration-300" :class="{ 'rotate-90': menuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div 
        class="md:hidden transform transition-all duration-300 ease-in-out origin-top"
        :class="menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'"
      >
        <div class="bg-pokemon-red-dark rounded-lg mt-2 border-4 border-pokemon-yellow overflow-hidden">
          <router-link 
            to="/" 
            class="block px-4 py-3 text-white hover:bg-pokemon-yellow hover:text-pokemon-black transition-colors duration-300 font-semibold border-b border-pokemon-yellow"
            :class="{ 'bg-pokemon-yellow text-pokemon-black': route.name === 'home' }"
            @click="closeMenu"
          >
            {{ t.home }}
          </router-link>
          
          <router-link 
            to="/berries" 
            class="block px-4 py-3 text-white hover:bg-pokemon-yellow hover:text-pokemon-black transition-colors duration-300 font-semibold border-b border-pokemon-yellow"
            :class="{ 'bg-pokemon-yellow text-pokemon-black': route.name === 'berries' }"
            @click="closeMenu"
          >
            {{ t.berries }}
          </router-link>
          
          <router-link 
            to="/my-team" 
            class="block px-4 py-3 text-white hover:bg-pokemon-yellow hover:text-pokemon-black transition-colors duration-300 font-semibold border-b border-pokemon-yellow"
            :class="{ 'bg-pokemon-yellow text-pokemon-black': route.name === 'my-team' }"
            @click="closeMenu"
          >
            {{ t.myTeam }}
          </router-link>

          <div class="px-4 py-3">
            <label class="block text-white text-sm font-semibold mb-2">Langue / Language</label>
            <select 
              :value="currentLanguage"
              @change="handleLanguageChange"
              class="w-full bg-pokemon-yellow text-pokemon-black border-2 border-pokemon-black rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-if="menuOpen" 
      @click="closeMenu" 
      class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[-1]"
    ></div>
  </nav>
</template>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>