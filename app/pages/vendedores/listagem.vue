<script setup>
const pageBreadcrumbList = [
  { label: 'Vendedores', to: '/vendedores' },
  { label: 'Todos os vendedores' }
]

const route = useRoute()

const { status, items, totalItems, totalPages, currentPage, firstItem, lastItem, paginationItems, irParaPagina } =
  usePaginatedFetch('/api/salespersons/listagem', () => ({}))
</script>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <header class="mb-6">
      <UiBreadcrumb :items="pageBreadcrumbList" />
      <h1 class="text-2xl font-bold tracking-tight text-gray-900">Todos os Vendedores</h1>
    </header>

    <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 w-full overflow-x-auto">
      <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
            <th scope="col" class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="status === 'pending'">
            <td colspan="3" class="px-6 py-8 text-center text-sm text-gray-500">Carregando...</td>
          </tr>
          <tr v-else-if="items.length === 0">
            <td colspan="3" class="px-6 py-8 text-center text-sm text-gray-500">Nenhum vendedor encontrado.</td>
          </tr>
          <tr
            v-else
            v-for="item in items"
            :key="item.id"
            class="hover:bg-blue-50/50 transition-colors group"
          >
            <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ item.firstName }} {{ item.lastName }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ item.personCode }}</td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <NuxtLink
                :to="`/vendedores/${item.id}`"
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
