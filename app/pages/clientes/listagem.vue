<script setup>
const pageBreadcrumbList = [
  { label: 'Dashboard de Clientes', to: '/clientes' },
  { label: 'Todos os clientes' }
]

const route = useRoute()
const router = useRouter()

const form = reactive({
  name: String(route.query.name ?? ''),
  document: String(route.query.document ?? ''),
  active: String(route.query.active ?? '')
})

watch(
  () => route.query,
  (q) => {
    form.name = String(q.name ?? '')
    form.document = String(q.document ?? '')
    form.active = String(q.active ?? '')
  }
)

const { status, items, totalItems, totalPages, currentPage, firstItem, lastItem, paginationItems, irParaPagina } =
  usePaginatedFetch('/api/customer/listagem', () => ({
    name: route.query.name || undefined,
    document: route.query.document || undefined,
    active: route.query.active || undefined,
  }))

function buscar() {
  router.replace({
    query: {
      name: form.name || undefined,
      document: form.document || undefined,
      active: form.active || undefined,
    }
  })
}

function limparFiltros() {
  form.name = ''
  form.document = ''
  form.active = ''
  router.replace({ query: {} })
}
</script>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <UiBreadcrumb :items="pageBreadcrumbList" />
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Todos os Clientes</h1>
      </div>
      <UiButton color="blue" to="/clientes/novo">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </template>
        Novo Cliente
      </UiButton>
    </header>

    <section class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
      <form @submit.prevent="buscar" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

        <div class="md:col-span-2">
          <label for="search-name" class="block text-sm font-medium text-gray-700 mb-1">Nome ou Razão Social</label>
          <input
            v-model="form.name"
            type="text"
            id="search-name"
            placeholder="Ex: Gráfica Exemplo"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>

        <div>
          <label for="search-doc" class="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
          <input
            v-model="form.document"
            type="text"
            id="search-doc"
            placeholder="Apenas números..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>

        <div>
          <label for="search-status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="form.active"
            id="search-status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
          >
            <option value="">Todos</option>
            <option value="true">Apenas Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>

        <div class="md:col-span-4 flex justify-end gap-3 mt-2">
          <UiButton type="button" @click="limparFiltros">Limpar filtros</UiButton>
          <UiButton color="black" type="submit">Buscar</UiButton>
        </div>
      </form>
    </section>

    <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 w-full overflow-x-auto">
      <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <tr v-if="status === 'pending'">
            <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">Carregando...</td>
          </tr>

          <tr v-else-if="items.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-sm text-gray-500">Nenhum cliente encontrado.</td>
          </tr>

          <tr
            v-else
            v-for="item in items"
            :key="item.id"
            class="hover:bg-blue-50/50 transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-gray-900">{{ item.officialName || item.name || '-' }}</span>
                <span v-if="item.officialName && item.name" class="text-xs text-gray-500">{{ item.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ item.document || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.city || '-' }}</td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <NuxtLink
                :to="`/clientes/${item.id}`"
                class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              >
                Detalhes
              </NuxtLink>
            </td>
          </tr>

        </tbody>
      </table>
    </section>

    <UiPagination
      :total-items="totalItems"
      :total-pages="totalPages"
      :current-page="currentPage"
      :first-item="firstItem"
      :last-item="lastItem"
      :pagination-items="paginationItems"
      @go-to-page="irParaPagina"
    />

  </div>
</template>
