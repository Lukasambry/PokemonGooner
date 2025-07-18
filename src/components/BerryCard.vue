<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface BerryCardData {
  id: number;
  name: string;
  originalName?: string;
  sprite?: string;
}

interface Props {
  berryData: BerryCardData;
}
const props = defineProps<Props>()

const router = useRouter()
const { t } = useI18n()

const berrySprite = computed(() => {
  return props.berryData.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${props.berryData.name}-berry.png`
})

function navigateToDetail() {
  router.push({ name: 'berry-detail', params: { idOrName: props.berryData.id } })
}

const displayName = computed(() => {
  return props.berryData.name.charAt(0).toUpperCase() + props.berryData.name.slice(1)
})

const berryAltText = computed(() => {
  return t('berryImage', { name: displayName.value })
})

const berryPlaceholder = computed(() => {
  return `https://via.placeholder.com/80x80/10B981/ffffff?text=${encodeURIComponent(t('berryFallback'))}`
})
</script>

<template>
  <div class="pokemon-card group" @click="navigateToDetail">
    <div class="relative overflow-hidden">
      <div class="absolute top-2 right-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        #{{ String(berryData.id).padStart(3, '0') }}
      </div>

      <div class="bg-gradient-to-br from-green-100 to-green-200 p-6 flex items-center justify-center min-h-[120px]">
        <img
          :src="berrySprite"
          :alt="berryAltText"
          class="w-20 h-20 object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
          @error="($event.target as HTMLImageElement).src = berryPlaceholder"
        />
      </div>

      <div class="p-4 bg-white">
        <h3 class="text-lg font-bold text-pokemon-black mb-2 text-center group-hover:text-pokemon-red transition-colors duration-300">
          {{ displayName }}
        </h3>

        <div class="flex justify-center">
          <span class="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {{ t('berryDetails') }}
          </span>
        </div>
      </div>
    </div>

    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  </div>
</template>

<style scoped>
.pokemon-card {
  position: relative;
  cursor: pointer;
}
</style>
