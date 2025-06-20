<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'

interface Props {
  modelValue: string;
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'search', searchTerm: string): void;
}
const emit = defineEmits<Emits>()

const internalSearchTerm: Ref<string> = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  internalSearchTerm.value = newValue
})

watch(internalSearchTerm, (newValue) => {
  emit('update:modelValue', newValue)
})

function performSearch() {
  if (internalSearchTerm.value.trim()) {
    emit('search', internalSearchTerm.value.trim())
  }
}

function clearSearch() {
  internalSearchTerm.value = ''
}
</script>

<template>
  <div class="search-container pokemon-search-form">
    <input
      type="text"
      v-model="internalSearchTerm"
      placeholder="Rechercher un Pokémon (nom exact)..."
      @keyup.enter="performSearch"
      class="search-input"
    />
    <button @click="performSearch" class="search-button">Rechercher</button>
    <button v-if="internalSearchTerm" @click="clearSearch" class="clear-button">
      Effacer
    </button>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.search-input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.search-button, .clear-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #0056b3;
}

.clear-button {
  background-color: #6c757d;
}

.clear-button:hover {
  background-color: #545b62;
}
</style>
