<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

// Estado do componente
const query = ref('')
const results = ref<any[]>([])
const isOpen = ref(false)
const isLoading = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// ------------------------------------------------------------------------
// SIMULAÇÃO DE BANCO DE DADOS E API (Substitua pela sua chamada real depois)
// ------------------------------------------------------------------------
const mockDatabase = [
  { id: 1, nome: 'Gráfica Exemplo Ltda', documento: '00.000.000/0001-00', status: 'Ativo' },
  { id: 2, nome: 'Papelaria Central', documento: '11.111.111/0001-11', status: 'Ativo' },
  { id: 3, nome: 'João da Silva ME', documento: '222.222.222-22', status: 'Inativo' },
  { id: 4, nome: 'Editora Saber', documento: '33.333.333/0001-33', status: 'Ativo' },
]

const fetchClients = async (search: string) => {
  // Simulando o tempo de resposta de uma API (500ms)
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      const filtered = mockDatabase.filter(c =>
          c.nome.toLowerCase().includes(search.toLowerCase()) ||
          c.documento.includes(search)
      )
      resolve(filtered)
    }, 500)
  })
}
// ------------------------------------------------------------------------

// Lógica de Debounce (Evita chamar a API a cada letra digitada)
let timeout: ReturnType<typeof setTimeout>

watch(query, (newValue) => {
  if (!newValue) {
    results.value = []
    isOpen.value = false
    return
  }

  isOpen.value = true
  isLoading.value = true
  clearTimeout(timeout)

  // Aguarda 300ms após o usuário parar de digitar para buscar
  timeout = setTimeout(async () => {
    results.value = await fetchClients(newValue)
    isLoading.value = false
  }, 300)
})

// Lógica para selecionar o cliente e navegar
const selectClient = (client: any) => {
  query.value = '' // Limpa o input
  isOpen.value = false

  // No Nuxt, você usaria o navigateTo para ir para a tela de detalhes:
  // navigateTo(`/clientes/${client.id}`)

  // Apenas para logar no console por enquanto:
  console.log('Navegando para o cliente:', client.nome)
  alert(`Redirecionando para detalhes de: ${client.nome}`)
}

// Lógica para fechar o dropdown ao clicar fora dele
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
          placeholder="Buscar cliente (Nome, CNPJ)..."
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
              v-for="client in results"
              :key="client.id"
              @click="selectClient(client)"
              class="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex flex-col gap-0.5"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm font-bold text-gray-900">{{ client.nome }}</span>
              <span
                  class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                  :class="client.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ client.status }}
              </span>
            </div>
            <span class="text-xs text-gray-500 font-mono">{{ client.documento }}</span>
          </li>
        </ul>

        <div v-else class="p-4 text-sm text-gray-500 text-center">
          Nenhum cliente encontrado com "<span class="font-bold">{{ query }}</span>"
        </div>
      </div>
    </Transition>

  </div>
</template>
