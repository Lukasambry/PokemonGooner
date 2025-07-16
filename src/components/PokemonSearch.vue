<script setup lang="ts">
import { ref, watch, computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/stores/languageStore'

interface Props {
  modelValue: string;
  placeholder?: string;
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: ''
})

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'search', searchTerm: string): void;
  (e: 'search-live', searchTerm: string): void;
}
const emit = defineEmits<Emits>()

const { t } = useI18n()
const languageStore = useLanguageStore()

const internalSearchTerm: Ref<string> = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  internalSearchTerm.value = newValue
})

watch(internalSearchTerm, (newValue) => {
  emit('update:modelValue', newValue)
  emit('search-live', newValue)
})

function performSearch() {
  if (internalSearchTerm.value.trim()) {
    emit('search', internalSearchTerm.value.trim())
  }
}

function clearSearch() {
  internalSearchTerm.value = ''
}

const searchPlaceholder = computed(() => {
  return props.placeholder || t('search')
})
</script>

<template>
  <div class="search-container">
    <div class="relative flex-1">
      <input
        type="text"
        v-model="internalSearchTerm"
        :placeholder="searchPlaceholder"
        @keyup.enter="performSearch"
        class="input-pokemon pr-12"
        :aria-label="t('searchInput')"
      />

      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-pokemon-gray-dark">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" :aria-label="t('searchIcon')">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <button
      @click="performSearch"
      class="btn-primary whitespace-nowrap"
      :aria-label="t('searchButton')"
    >
      {{ t('searchButton') }}
    </button>

    <button
      v-if="internalSearchTerm"
      @click="clearSearch"
      class="btn-secondary whitespace-nowrap"
      :aria-label="t('clearSearch')"
    >
      {{ t('clear') }}
    </button>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .search-container {
    flex-direction: row;
  }
}

@media (max-width: 640px) {
  .search-container {
    gap: 0.75rem;
  }

  .search-container input,
  .search-container button {
    width: 100%;
  }
}
</style>
