<script setup>
const pageBreadcrumbList = [
  { label: 'Contadores', to: '/contadores' },
  { label: 'Todos os contadores' }
]

const route = useRoute()
const router = useRouter()

const form = reactive({ name: String(route.query.name ?? '') })

watch(() => route.query, (q) => { form.name = String(q.name ?? '') })

const { status, items, totalItems, totalPages, currentPage, firstItem, lastItem, paginationItems, irParaPagina } =
  usePaginatedFetch('/api/accountant/listagem', () => ({
    name: route.query.name || undefined
  }))

function buscar() {
  router.replace({ query: { name: form.name || undefined } })
}

function limparFiltros() {
  form.name = ''
  router.replace({ query: {} })
}
</script>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <UiBreadcrumb :items="pageBreadcrumbList" />
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Todos os Contadores</h1>
      </div>
    </header>

    <section class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
      <form @submit.prevent="buscar" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div class="md:col-span-3">
          <label for="search-name" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            v-model="form.name"
            type="text"
            id="search-name"
            placeholder="Ex: Escritório Contábil..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          >
        </div>
        <div class="flex justify-end gap-3 items-end">
          <UiButton type="button" @click="limparFiltros">Limpar</UiButton>
          <UiButton color="black" type="submit">Buscar</UiButton>
        </div>
      </form>
    </section>

    <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 w-full overflow-x-auto">
      <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">E-mail</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="status === 'pending'">
            <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">Carregando...</td>
          </tr>
          <tr v-else-if="items.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">Nenhum contador encontrado.</td>
          </tr>
          <tr
            v-else
            v-for="item in items"
            :key="item.id"
            class="hover:bg-blue-50/50 transition-colors group"
          >
            <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ item.name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.email || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ item.telephone1 || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ item.city || '-' }}</td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <NuxtLink
                :to="`/contadores/${item.id}`"
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
