<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

const props = withDefaults(defineProps<{
  endpoint: string
  placeholder?: string
  labelKey?: string
  secondaryLabelKey?: string
  subLabelKey?: string
  statusKey?: string
  activeStatusValue?: string
  resultKey?: string
  cityKey?: string
  stateKey?: string
}>(), {
  placeholder: 'Buscar...',
  labelKey: 'name',
  resultKey: 'list',
  activeStatusValue: 'Ativo',
})

const emit = defineEmits<{
  select: [item: any]
}>()

const sessionStore = useSessionStore()

const query = ref('')
const results = ref<any[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

let timeout: ReturnType<typeof setTimeout>

const fetchResults = async (search: string) => {
  const data = await $fetch<Record<string, any>>(props.endpoint, {
    query: { search, token: sessionStore.token }
  })
  return data[props.resultKey!] ?? []
}

watch(query, (newValue) => {
  if (!newValue) {
    results.value = []
    isOpen.value = false
    return
  }

  isOpen.value = true
  isLoading.value = true
  clearTimeout(timeout)

  timeout = setTimeout(async () => {
    results.value = await fetchResults(newValue)
    isLoading.value = false
  }, 300)
})

const selectItem = (item: any) => {
  query.value = ''
  isOpen.value = false
  emit('select', item)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="dropdownRef" class="relative w-full group">

    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>

      <input
          v-model="query"
          @focus="query.length > 0 && (isOpen = true)"
          type="text"
          :placeholder="placeholder"
          class="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm outline-none"
      >

      <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
    >
      <div
          v-if="isOpen && query.length > 0"
          class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
      >
        <div v-if="isLoading" class="p-4 text-sm text-gray-500 text-center bg-gray-50">
          Buscando na base de dados...
        </div>

        <ul v-else-if="results.length > 0" class="max-h-64 overflow-y-auto divide-y divide-gray-100">
          <li
              v-for="item in results"
              :key="item.id"
              @click="selectItem(item)"
              class="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex flex-col gap-0.5"
          >
            <div class="flex justify-between items-start">
              <div class="flex flex-col gap-0.5">
                <span class="text-sm font-bold text-gray-900">{{ item[labelKey!] }}</span>
                <span v-if="secondaryLabelKey && item[secondaryLabelKey]" class="text-xs text-gray-600">{{ item[secondaryLabelKey] }}</span>
              </div>
              <span
                  v-if="statusKey && item[statusKey]"
                  class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shrink-0 ml-2"
                  :class="item[statusKey] === activeStatusValue ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ item[statusKey] }}
              </span>
            </div>
            <span v-if="subLabelKey" class="text-xs text-gray-500 font-mono">{{ item[subLabelKey] }}</span>
            <span v-if="cityKey && item[cityKey]" class="text-xs text-gray-400">
              {{ item[cityKey] }}{{ stateKey && item[stateKey!] ? ' / ' + item[stateKey!] : '' }}
            </span>
          </li>
        </ul>

        <div v-else class="p-4 text-sm text-gray-500 text-center">
          Nenhum resultado encontrado para "<span class="font-bold">{{ query }}</span>"
        </div>
      </div>
    </Transition>

  </div>
</template>
