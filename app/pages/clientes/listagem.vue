<script setup>
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

const pageBreadcrumbList = [
  { label: 'Dashboard de Clientes', to: '/clientes' },
  { label: 'Todos os clientes' }
]

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

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

const { data, status } = useFetch('/api/customer/listagem', {
  server: false,
  query: computed(() => ({
    token: session.token,
    name: route.query.name || undefined,
    document: route.query.document || undefined,
    active: route.query.active || undefined,
    page: Number(route.query.page ?? 0),
    size: 20
  }))
})

const pageData = computed(() => data.value?.data ?? null)
const items = computed(() => pageData.value?.items ?? [])
const totalPages = computed(() => pageData.value?.totalPages ?? 0)
const currentPage = computed(() => pageData.value?.currentPage ?? 0)
const totalItems = computed(() => pageData.value?.totalItems ?? 0)
const pageSize = computed(() => pageData.value?.pageSize ?? 20)

const firstItem = computed(() => totalItems.value === 0 ? 0 : currentPage.value * pageSize.value + 1)
const lastItem = computed(() => Math.min((currentPage.value + 1) * pageSize.value, totalItems.value))

const paginationItems = computed(() => {
  const total = totalPages.value
  if (total === 0) return []

  let pages
  if (total <= 7) {
    pages = Array.from({ length: total }, (_, i) => i)
  } else {
    const current = currentPage.value
    const set = new Set([0, total - 1])
    for (let p = Math.max(0, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      set.add(p)
    }
    pages = [...set].sort((a, b) => a - b)
  }

  const result = []
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) {
      result.push({ type: 'ellipsis', key: `ellipsis-${i}` })
    }
    result.push({ type: 'page', page: pages[i], key: `page-${pages[i]}` })
  }
  return result
})

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

function irParaPagina(page) {
  router.replace({
    query: {
      ...route.query,
      page: page > 0 ? page : undefined
    }
  })
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

    <div v-if="totalItems > 0" class="flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-500">
        Exibindo <span class="font-medium text-gray-900">{{ firstItem }}</span> a
        <span class="font-medium text-gray-900">{{ lastItem }}</span> de
        <span class="font-medium text-gray-900">{{ totalItems }}</span> resultados
      </p>

      <nav v-if="totalPages > 1" class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          @click="irParaPagina(currentPage - 1)"
          :disabled="currentPage === 0"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Anterior</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <template v-for="item in paginationItems" :key="item.key">
          <span
            v-if="item.type === 'ellipsis'"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >...</span>
          <button
            v-else
            @click="irParaPagina(item.page)"
            :aria-current="item.page === currentPage ? 'page' : undefined"
            :class="[
              item.page === currentPage
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
            ]"
          >{{ item.page + 1 }}</button>
        </template>

        <button
          @click="irParaPagina(currentPage + 1)"
          :disabled="currentPage >= totalPages - 1"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span class="sr-only">Próximo</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>

  </div>
</template>
