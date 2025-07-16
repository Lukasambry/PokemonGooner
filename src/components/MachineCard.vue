<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

const displayName = computed(() =>
  `${props.machine.item.name.toUpperCase()} - ${props.machine.move.name.replace(/-/g, ' ')}`
)

const moveDetailLink = computed(() =>
  `/move/${props.machine.move.name}`
)

const formattedMoveName = computed(() => {
  return props.machine.move.name.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
})

const formattedItemName = computed(() => {
  return props.machine.item.name.toUpperCase()
})

const formattedVersionGroup = computed(() => {
  return props.machine.version_group.name.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
})

const machineAltText = computed(() => {
  return t('machineAltText', {
    item: formattedItemName.value,
    move: formattedMoveName.value
  })
})
</script>

<template>
  <div class="pokemon-card group hover:shadow-lg transition cursor-pointer"
       :aria-label="machineAltText"
       role="button"
       tabindex="0">
    <div class="relative overflow-hidden">
      <div class="absolute top-2 right-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
        #{{ String(machine.id).padStart(3, '0') }}
      </div>

      <div class="flex flex-col items-center p-4">
        <div class="text-lg font-bold text-center">
          {{ formattedItemName }} - {{ formattedMoveName }}
        </div>

        <div class="text-xs text-gray-500 mt-1 text-center">
          {{ t('generation_text') }}: {{ formattedVersionGroup }}
        </div>
      </div>
    </div>
  </div>
</template>
