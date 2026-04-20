<script setup lang="ts">
import { ref } from 'vue'

const breadcrumbItems = [
  { label: 'Exemplos', to: '/' },
  { label: 'Listagem' } // Sem "to", renderiza como texto atual
]

// Dados de exemplo para a tabela
const clientes = ref([
  { id: 1, nome: 'João da Silva', email: 'joao@email.com', documento: '111.222.333-44', tipo: 'Física', status: 'Ativo' },
  { id: 2, nome: 'Empresa XYZ Ltda', email: 'contato@xyz.com', documento: '12.345.678/0001-90', tipo: 'Jurídica', status: 'Inativo' },
  { id: 3, nome: 'Maria Oliveira', email: 'maria@email.com', documento: '555.666.777-88', tipo: 'Física', status: 'Ativo' },
  { id: 4, nome: 'Comércio ABC', email: 'vendas@abc.com', documento: '98.765.432/0001-10', tipo: 'Jurídica', status: 'Ativo' },
  { id: 5, nome: 'Carlos Souza', email: 'carlos@email.com', documento: '999.888.777-66', tipo: 'Física', status: 'Bloqueado' },
])

useHead({
  title: 'Tela de exemplo de listagem'
})
</script>

<template>
  <div class="max-w-5xl mx-auto">

    <UiBreadcrumb :items="breadcrumbItems" />

    <UiPageHeader title="Lista de clientes">
      <template #instruction>
        Visualize e gerencie todos os clientes cadastrados no sistema.
      </template>
    </UiPageHeader>

    <!-- Usando o novo componente UiTable -->
    <UiDatatable :items="clientes">

      <!-- Definição das colunas de cabeçalho -->
      <template #header>
        <th class="py-3 px-4 font-semibold">Nome / Razão Social</th>
        <th class="py-3 px-4 font-semibold">Documento</th>
        <th class="py-3 px-4 font-semibold">E-mail</th>
        <th class="py-3 px-4 font-semibold">Tipo</th>
        <th class="py-3 px-4 font-semibold">Status</th>
        <th class="py-3 px-4 font-semibold text-right">Ações</th>
      </template>

      <!-- Definição da renderização de cada linha -->
      <template #row="{ item }">
        <td class="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
          {{ item.nome }}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          {{ item.documento }}
        </td>
        <td class="py-3 px-4">
          {{ item.email }}
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {{ item.tipo }}
          </span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            :class="{
              'bg-green-100 text-green-800': item.status === 'Ativo',
              'bg-gray-100 text-gray-800': item.status === 'Inativo',
              'bg-red-100 text-red-800': item.status === 'Bloqueado',
            }"
          >
            {{ item.status }}
          </span>
        </td>
        <td class="py-3 px-4 text-right whitespace-nowrap">
          <button class="text-blue-600 hover:text-blue-900 font-medium mr-3">Editar</button>
          <button class="text-red-600 hover:text-red-900 font-medium">Excluir</button>
        </td>
      </template>

      <!-- Opcional: Footer (Paginação) -->
      <template #footer>
        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">1</span> até <span class="font-medium">5</span> de <span class="font-medium">5</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Anterior</span>
                  &laquo;
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                  1
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span class="sr-only">Próximo</span>
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </template>

    </UiDatatable>

  </div>
</template>

<style scoped>
/* Estilos extra apenas para este componente podem vir aqui, mas usamos as globais no main.css */
</style>
