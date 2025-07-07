<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-yellow-50">
    <NavBar />
    
    <main class="pt-16 pb-20">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition name="fade" mode="out-in">
            <KeepAlive>
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </main>

    <footer class="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pokemon-red via-pokemon-red-dark to-red-800 border-t-4 border-pokemon-yellow z-40">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-center space-x-4">
          <div class="w-6 h-6 bg-pokemon-yellow rounded-full border-2 border-pokemon-black flex items-center justify-center">
            <div class="w-2 h-2 bg-pokemon-blue rounded-full animate-pulse"></div>
          </div>
          <p class="text-white font-semibold text-sm">
            &copy; {{ new Date().getFullYear() }} P0k3G00n3r - Pokédex Ultime
          </p>
          <div class="w-6 h-6 bg-pokemon-yellow rounded-full border-2 border-pokemon-black flex items-center justify-center">
            <div class="w-2 h-2 bg-pokemon-red rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>