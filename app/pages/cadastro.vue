<script setup lang="ts">
import { ref } from 'vue'

const breadcrumbItems = [
  { label: 'Exemplos', to: '/' },
  { label: 'Cadastro' } // Sem "to", renderiza como texto atual
]

const form = ref({
  nome: '',
  email: '',
  tipoPessoa: 'fisica',
  categoria: null,
  observacoes: '',
  notificacoes: true
})

const categorias = [
  { label: 'Varejo', value: 'varejo' },
  { label: 'Atacado', value: 'atacado' },
  { label: 'Revenda', value: 'revenda' }
]

const onSubmit = () => {
  console.log('Form data:', form.value)
  alert('Formulário enviado com sucesso! Verifique o console.')
}

</script>

<template>
  <div class="max-w-5xl mx-auto">

    <UiBreadcrumb :items="breadcrumbItems" />

    <UiPageHeader title="Gestão de clientes">
      <template #instruction>
        Preencha os dados abaixo para registrar uma nova OS para a Gráfica Soset. Certifique-se de que o orçamento do cliente já foi aprovado antes de gerar o serviço de produção.
      </template>
    </UiPageHeader>

    <UiCardForm>
      <form @submit.prevent="onSubmit" class="space-y-6">

        <!-- Input Text -->
        <div class="form-group">
          <label for="nome" class="form-label">Nome Completo / Razão Social</label>
          <span class="form-description">O nome como aparecerá nos documentos oficiais.</span>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="form-input"
            placeholder="Ex: João da Silva"
            required
          />
        </div>

        <!-- Input Email -->
        <div class="form-group">
          <label for="email" class="form-label">Endereço de E-mail</label>
          <span class="form-description">Nós enviaremos notificações sobre a OS para este e-mail.</span>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="joao@exemplo.com"
            required
          />
        </div>

        <!-- Radio Group -->
        <div class="form-group">
          <label class="form-label">Tipo de Pessoa</label>
          <span class="form-description">Defina o regime tributário deste cliente.</span>

          <div class="form-radio-group">
            <label class="form-radio-label">
              <input
                type="radio"
                v-model="form.tipoPessoa"
                value="fisica"
                class="form-radio"
              />
              <span>Pessoa Física</span>
            </label>

            <label class="form-radio-label">
              <input
                type="radio"
                v-model="form.tipoPessoa"
                value="juridica"
                class="form-radio"
              />
              <span>Pessoa Jurídica</span>
            </label>
          </div>
        </div>

        <!-- Select -->
        <div class="form-group">
          <label for="categoria" class="form-label">Categoria do Cliente</label>
          <span class="form-description">Ajuda a organizar as prioridades e tabelas de preços.</span>
          <select
            id="categoria"
            v-model="form.categoria"
            class="form-select"
            required
          >
            <option value="null" disabled>Selecione uma categoria...</option>
            <option
              v-for="cat in categorias"
              :key="cat.value"
              :value="cat.value"
            >
              {{ cat.label }}
            </option>
          </select>
        </div>

        <!-- Textarea -->
        <div class="form-group">
          <label for="observacoes" class="form-label">Observações Adicionais</label>
          <span class="form-description">Qualquer detalhe importante sobre o serviço ou preferências do cliente.</span>
          <textarea
            id="observacoes"
            v-model="form.observacoes"
            rows="4"
            class="form-textarea"
            placeholder="Digite os detalhes aqui..."
          ></textarea>
        </div>

        <!-- Checkbox -->
        <div class="form-group border-t border-gray-100 pt-5 mt-2">
          <label class="form-checkbox-label">
            <div class="form-checkbox-container">
              <input
                type="checkbox"
                v-model="form.notificacoes"
                class="form-checkbox"
              />
            </div>
            <div class="form-checkbox-content">
              <span class="form-label mb-0">Receber notificações por SMS e WhatsApp</span>
              <span class="form-description">O cliente será alertado sobre mudanças de status da OS.</span>
            </div>
          </label>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            Salvar Cliente
          </button>
        </div>

      </form>
    </UiCardForm>

  </div>
</template>

<style scoped>
/* Estilos extra apenas para este componente podem vir aqui, mas usamos as globais no main.css */
</style>
