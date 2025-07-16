<!-- src/views/MachinesView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import MachineCard from '@/components/MachineCard.vue'
import { useMachineApi } from '@/composables/useMachineApi'

const { t } = useI18n()
const { machines, loading, error, fetchMachines, nextPageUrl } = useMachineApi()

onMounted(() => {
  fetchMachines()
})

function loadMore() {
  fetchMachines()
}

function handleRetry() {
  fetchMachines()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8 text-pokemon-gray-dark text-center">
        {{ t('machines') }} <span class="text-blue-500">({{ t('tmHm') }})</span>
      </h1>

      <div v-if="loading && machines.length === 0" class="text-center py-16">
        <div class="loading-pokeball mb-4"></div>
        <p class="text-xl text-pokemon-gray-dark">{{ t('loading') }}</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
        <p class="font-semibold">{{ t('error') }}</p>
        <p>{{ error }}</p>
        <button @click="handleRetry" class="btn-danger mt-4">
          {{ t('retry') }}
        </button>
      </div>

      <div v-else>
        <div v-if="machines.length > 0" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <MachineCard v-for="machine in machines" :key="machine.id" :machine="machine" />
        </div>

        <div v-else class="text-center py-16">
          <p class="text-xl text-pokemon-gray-dark">{{ t('noResults') }}</p>
        </div>

        <div v-if="nextPageUrl && machines.length > 0" class="mt-8 flex justify-center">
          <button
            :disabled="loading"
            class="btn-primary"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
            @click="loadMore"
          >
            {{ loading ? t('loading') : t('loadMore') }}
          </button>
        </div>

        <div v-if="loading && machines.length > 0" class="text-center py-8">
          <div class="loading-pokeball mb-4"></div>
          <p class="text-pokemon-gray-dark">{{ t('loadingMore') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
