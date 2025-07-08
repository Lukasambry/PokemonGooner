<!-- src/views/MachinesView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import MachineCard from '@/components/MachineCard.vue'
import { useMachineApi } from '@/composables/useMachineApi'
import { useLanguageStore } from '@/stores/languageStore'

const { machines, loading, error, fetchMachines, nextPageUrl } = useMachineApi()
const languageStore = useLanguageStore()

onMounted(() => {
  fetchMachines()
})

function loadMore() {
  fetchMachines()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8 text-pokemon-gray-dark text-center">
        Machines <span class="text-blue-500">(TM/HM)</span>
      </h1>
      <div v-if="loading && machines.length == 0" class="text-center py-16">
        <div class="loading-pokeball mb-4"></div>
        <p class="text-xl text-pokemon-gray-dark">{{ languageStore.t.loading || 'Chargement...' }}</p>
      </div>
      <div v-else>
        <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <MachineCard v-for="machine in machines" :key="machine.id" :machine="machine" />
        </div>
        <div class="mt-8 flex justify-center">
          <button v-if="nextPageUrl" :disabled="loading" class="btn-primary" @click="loadMore">
            {{ languageStore.t.loadMore || 'Charger plus de Machines' }}
          </button>
        </div>
        <div v-if="error" class="mt-4 text-red-500 text-center">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
