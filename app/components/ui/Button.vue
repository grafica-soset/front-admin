<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

const props = defineProps({
  to: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: 'button'
  },
  color: {
    type: String,
    default: 'white',
    validator: (value: string) => [
      'black', 'blue', 'red', 'green', 'yellow', 'white'
    ].includes(value)
  }
})

const emit = defineEmits(['click'])

const isLink = computed(() => !!props.to)
const resolveTag = computed(() => isLink.value ? NuxtLink : 'button')

// Mapeamento de classes por cor
const colorClasses = computed(() => {
  const map: Record<string, string> = {
    black: 'bg-black hover:bg-gray-900 text-white border-transparent',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    red: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
    green: 'bg-green-600 hover:bg-green-700 text-white border-transparent',
    yellow: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-transparent',
    white: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
  }
  return map[props.color] || map.white
})

const handleClick = (event: MouseEvent) => {
  if (!isLink.value) {
    emit('click', event)
  }
}
</script>

<template>
  <component
      :is="resolveTag"
      :to="isLink ? to : undefined"
      :type="!isLink ? type : undefined"
      @click="handleClick"
      class="py-2.5 px-4 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border"
      :class="colorClasses"
  >
    <slot name="icon"></slot>
    <span>
      <slot></slot>
    </span>
  </component>
</template>
