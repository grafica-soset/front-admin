<script setup lang="ts">
const props = defineProps<{
  modelValue: number | string | null
  options: Record<string, any>[]
  displayKey?: string
  valueKey?: string
  placeholder?: string
  minChars?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string | null): void
}>()

const vKey = computed(() => props.valueKey ?? 'id')
const dKey = computed(() => props.displayKey ?? 'label')
const minC = computed(() => props.minChars ?? 0)

const inputValue = ref('')
const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

function getLabel(option: Record<string, any>): string {
  return String(option[dKey.value] ?? '')
}

watch(() => props.modelValue, (val) => {
  if (val === null || val === undefined) { inputValue.value = ''; return }
  const found = props.options.find(o => o[vKey.value] === val)
  inputValue.value = found ? getLabel(found) : ''
}, { immediate: true })

const filtered = computed(() => {
  const q = inputValue.value.toLowerCase()
  if (props.modelValue !== null && props.modelValue !== undefined) return props.options
  if (minC.value === 0) {
    return q ? props.options.filter(o => getLabel(o).toLowerCase().includes(q)) : props.options
  }
  if (q.length < minC.value) return []
  return props.options.filter(o => getLabel(o).toLowerCase().includes(q))
})

const showHint = computed(() =>
  minC.value > 0 && inputValue.value.length > 0 && inputValue.value.length < minC.value && props.modelValue === null
)

function onInput(e: Event) {
  inputValue.value = (e.target as HTMLInputElement).value
  isOpen.value = true
  if (props.modelValue !== null && props.modelValue !== undefined) {
    emit('update:modelValue', null)
  }
}

function onFocus() {
  isOpen.value = true
}

function select(option: Record<string, any>) {
  emit('update:modelValue', option[vKey.value])
  inputValue.value = getLabel(option)
  isOpen.value = false
}

function clear() {
  emit('update:modelValue', null)
  inputValue.value = ''
  isOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    isOpen.value = false
    if (props.modelValue !== null && props.modelValue !== undefined) {
      const found = props.options.find(o => o[vKey.value] === props.modelValue)
      inputValue.value = found ? getLabel(found) : ''
    }
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="rootRef" class="relative">
    <div class="relative">
      <input
        :value="inputValue"
        @input="onInput"
        @focus="onFocus"
        type="text"
        :placeholder="placeholder ?? 'Selecione ou digite...'"
        class="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
      <button
        v-if="modelValue !== null && modelValue !== undefined"
        type="button"
        @click.stop="clear"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div v-else class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
      >
        <div v-if="showHint" class="px-4 py-3 text-sm text-gray-400 text-center">
          Digite ao menos {{ minC }} caracteres...
        </div>
        <ul v-else-if="filtered.length > 0" class="max-h-56 overflow-y-auto divide-y divide-gray-100">
          <li
            v-for="option in filtered"
            :key="option[vKey]"
            @mousedown.prevent="select(option)"
            class="px-4 py-2.5 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50 font-semibold text-blue-700': option[vKey] === modelValue }"
          >
            {{ getLabel(option) }}
          </li>
        </ul>
        <div v-else-if="inputValue.length >= minC" class="px-4 py-3 text-sm text-gray-400 text-center">
          Nenhum resultado encontrado.
        </div>
      </div>
    </Transition>
  </div>
</template>
