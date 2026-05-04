<script setup lang="ts">
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

const props = defineProps<{
  modelValue: number | null
  endpoint: string
  placeholder?: string
  initialLabel?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const store = useSessionStore()

const displayLabel = ref(props.initialLabel ?? '')

// Atualiza o label quando o pai fornece depois (ex: options carregando assincronamente)
watch(
  () => props.initialLabel,
  (val) => { if (val) displayLabel.value = val },
  { immediate: true }
)

const query = ref('')
const results = ref<any[]>([])
const isLoading = ref(false)
const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

let debounce: ReturnType<typeof setTimeout>

watch(query, (val) => {
  if (!val) { results.value = []; isOpen.value = false; return }
  isOpen.value = true
  isLoading.value = true
  clearTimeout(debounce)
  debounce = setTimeout(async () => {
    try {
      const res = await $fetch<any>(props.endpoint, {
        query: { name: val, token: store.token }
      })
      // Server routes retornam { success, data: [...] }
      // data pode ser array direto ou objeto com list/items
      const raw = res?.data ?? res
      results.value = Array.isArray(raw) ? raw : (raw?.list ?? raw?.items ?? [])
    } catch {
      results.value = []
    } finally {
      isLoading.value = false
    }
  }, 300)
})

function getItemLabel(item: any): string {
  // Formato { key, value } (accountant/list, salespersons/list)
  if (item.value !== undefined) return String(item.value)
  // Formato { id, firstName, lastName, personCode }
  if (item.firstName !== undefined) {
    const full = [item.firstName, item.lastName].filter(Boolean).join(' ')
    return item.personCode ? `${full} (${item.personCode})` : full
  }
  return item.name ?? String(item.id ?? item.key)
}

function getItemId(item: any): number {
  return item.key ?? item.id
}

function select(item: any) {
  displayLabel.value = getItemLabel(item)
  emit('update:modelValue', getItemId(item))
  query.value = ''
  isOpen.value = false
}

function clear() {
  displayLabel.value = ''
  emit('update:modelValue', null)
}

function onClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) isOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div ref="rootRef" class="relative">

    <!-- Selecionado: chip estático -->
    <div
      v-if="modelValue !== null"
      class="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg min-h-[38px]"
    >
      <svg class="h-4 w-4 text-blue-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span class="text-sm font-medium text-blue-800 flex-1 min-w-0 truncate">
        {{ displayLabel || '...' }}
      </span>
      <button
        type="button"
        @click="clear"
        title="Remover"
        class="p-0.5 rounded text-blue-400 hover:text-blue-700 hover:bg-blue-100 transition-colors shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Não selecionado: campo de busca -->
    <template v-else>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          v-model="query"
          @focus="query.length > 0 && (isOpen = true)"
          type="text"
          :placeholder="placeholder ?? 'Buscar...'"
          class="w-full pl-9 pr-8 py-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white shadow-sm transition-shadow"
        />
        <div v-if="isLoading" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
          v-if="isOpen && query.length > 0"
          class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
        >
          <div v-if="isLoading" class="px-4 py-3 text-sm text-gray-500 text-center bg-gray-50">
            Buscando...
          </div>
          <ul v-else-if="results.length > 0" class="max-h-56 overflow-y-auto divide-y divide-gray-100">
            <li
              v-for="item in results"
              :key="item.id"
              @mousedown.prevent="select(item)"
              class="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <span class="text-sm font-medium text-gray-900">{{ getItemLabel(item) }}</span>
            </li>
          </ul>
          <div v-else class="px-4 py-3 text-sm text-gray-500 text-center">
            Nenhum resultado para "<span class="font-semibold">{{ query }}</span>"
          </div>
        </div>
      </Transition>
    </template>

  </div>
</template>
