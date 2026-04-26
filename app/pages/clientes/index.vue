<script setup lang="ts">

const session = sessionStore()
const router = useRouter()

const PAGE_SIZE = 5

const loading = ref(false)
const search = ref("")
const allCustomers = ref<Customer[]>([])
const currentPage = ref(0)

const totalPages = computed(() => Math.ceil(allCustomers.value.length / PAGE_SIZE))

const customerList = computed(() => {
  const start = currentPage.value * PAGE_SIZE
  return allCustomers.value.slice(start, start + PAGE_SIZE)
})

const showingFrom = computed(() => allCustomers.value.length === 0 ? 0 : currentPage.value * PAGE_SIZE + 1)
const showingTo = computed(() => Math.min((currentPage.value + 1) * PAGE_SIZE, allCustomers.value.length))

const searchCustomer = async () => {
  if (search.value.length < 3 || loading.value) return

  loading.value = true

  const result = await $fetch('/api/customer/search', {
    method: 'GET',
    query: { search: search.value, token: session.token },
  }).finally(() => { loading.value = false })

  if (result.list != null) {
    allCustomers.value = result.list
    currentPage.value = 0
  }
}

const pendingCustomer = useState<Customer | null>('pendingCustomer', () => null)

const selectCustomer = (item: Customer) => {
  pendingCustomer.value = item
  router.push(`/clientes/${item.id}`)
}

const customerType = (doc: string) => {
  const digits = doc?.replace(/\D/g, '') ?? ''
  return digits.length === 14 ? 'Jurídica' : 'Física'
}

</script>

<template>
  <div class="max-w-5xl mx-auto">

    <UiPageHeader title="Clientes">
      <template #instruction>
        Visualize e gerencie todos os clientes cadastrados no sistema.
      </template>
    </UiPageHeader>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          v-model="search"
          @keyup="searchCustomer"
          placeholder="Buscar cliente..."
          class="form-input pl-9"
        />
      </div>
      <NuxtLink to="/clientes/adicionar" class="btn-primary whitespace-nowrap">
        + Adicionar cliente
      </NuxtLink>
    </div>

    <UiDatatable :items="customerList">

      <template #header>
        <th class="py-3 px-4 font-semibold">Nome / Razão Social</th>
        <th class="py-3 px-4 font-semibold">Documento</th>
        <th class="py-3 px-4 font-semibold">Tipo</th>
        <th class="py-3 px-4 font-semibold">Cidade</th>
        <th class="py-3 px-4 font-semibold">Status</th>
      </template>

      <template #row="{ item }">
        <td class="py-3 px-4 font-medium text-gray-900 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          {{ item.officialName || item.name }}
        </td>
        <td class="py-3 px-4 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          {{ item.cnpj }}
        </td>
        <td class="py-3 px-4 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {{ customerType(item.cnpj) }}
          </span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          {{ item.city }}
        </td>
        <td class="py-3 px-4 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            :class="item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
          >
            {{ item.active ? 'Ativo' : 'Inativo' }}
          </span>
        </td>
      </template>

      <template #footer>
        <div v-if="allCustomers.length > 0" class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ showingFrom }}</span> até <span class="font-medium">{{ showingTo }}</span> de <span class="font-medium">{{ allCustomers.length }}</span> resultados
            </p>
            <nav v-if="totalPages > 1" class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="currentPage--"
                :disabled="currentPage === 0"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &laquo;
              </button>
              <button
                v-for="p in totalPages"
                :key="p"
                @click="currentPage = p - 1"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium',
                  currentPage === p - 1
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ p }}
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage >= totalPages - 1"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &raquo;
              </button>
            </nav>
          </div>
        </div>
      </template>

    </UiDatatable>

  </div>
</template>

<style scoped>
</style>
