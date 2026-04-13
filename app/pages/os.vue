<script setup>
// Definição reativa do caminho do usuário
import CardForm from "~/components/ui/CardForm.vue";

const breadcrumbItems = [
  { label: 'Ordens de Serviço', to: '/ordens-de-servico' },
  { label: 'Nova Ordem' } // Sem "to", renderiza como texto atual
]

definePageMeta({
  middleware: ['auth-verification'],
})

</script>

<template>
  <div class="max-w-5xl mx-auto">

    <UiBreadcrumb :items="breadcrumbItems" />

    <UiPageHeader title="Criar Ordem de Serviço">
      <template #instruction>
        Preencha os dados abaixo para registrar uma nova OS para a Gráfica Soset. Certifique-se de que o orçamento do cliente já foi aprovado antes de gerar o serviço de produção.
      </template>
    </UiPageHeader>

    <UiCardForm>
      Olá
    </UiCardForm>

  </div>
</template>


