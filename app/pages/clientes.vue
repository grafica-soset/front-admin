<template>
  <div class="max-w-5xl mx-auto">

    <UiBreadcrumb :items="breadcrumbItems" />

    <UiPageHeader title="Criar Ordem de Serviço">
      <template #instruction>
        Preencha os dados abaixo para registrar uma nova OS para a Gráfica Soset. Certifique-se de que o orçamento do cliente já foi aprovado antes de gerar o serviço de produção.
      </template>
    </UiPageHeader>

    <form @submit.prevent="submitForm" class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 md:p-8">

      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      </div>

      <div class="mt-8 flex items-center justify-end gap-x-4 border-t border-gray-100 pt-6">
        <button type="button" class="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors">Cancelar</button>
        <button type="submit" class="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">Salvar Ordem de Serviço</button>
      </div>
    </form>

  </div>
</template>

<script setup>
// Definição reativa do caminho do usuário
const breadcrumbItems = [
  { label: 'Ordens de Serviço', to: '/ordens-de-servico' },
  { label: 'Nova Ordem' } // Sem "to", renderiza como texto atual
]

const submitForm = () => {
  console.log('Enviando dados...')
}
</script>
