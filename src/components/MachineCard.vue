<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  machine: {
    id: number;
    item: {
      name: string;
      url: string;
    };
    move: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }
}
const props = defineProps<Props>()

const displayName = computed(() =>
  `${props.machine.item.name.toUpperCase()} - ${props.machine.move.name.replace(/-/g, ' ')}`
)

const moveDetailLink = computed(() =>
  `/move/${props.machine.move.name}`
)
</script>
<template>
  <div class="pokemon-card group hover:shadow-lg transition cursor-pointer">
    <div class="relative overflow-hidden">
      <div class="absolute top-2 right-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        #{{ String(machine.id).padStart(3, '0') }}
      </div>
      <div class="flex flex-col items-center p-4">
        <div class="text-lg font-bold">{{ displayName }}</div>
        <div class="text-xs text-gray-500 mt-1">Génération : {{ machine.version_group.name }}</div>
      </div>
    </div>
  </div>
</template>
