<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  mode: 'create' | 'edit'
}>()
</script>

<template>
  <div class="space-y-6">

    <!-- Identificação -->
    <fieldset>
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Identificação</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input v-model="form.firstName" type="text" class="form-input" placeholder="John" />
        </div>
        <div class="form-group">
          <label class="form-label">Sobrenome</label>
          <input v-model="form.lastName" type="text" class="form-input" placeholder="Doe" />
        </div>
        <div class="form-group">
          <label class="form-label">Cargo</label>
          <input v-model="form.jobTitle" type="text" class="form-input" placeholder="Ex: Gerente" />
        </div>
        <div class="form-group">
          <label class="form-label">Departamento</label>
          <input v-model="form.department" type="text" class="form-input" placeholder="Ex: TI" />
        </div>
      </div>
    </fieldset>

    <!-- Contato -->
    <fieldset>
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Contato</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group sm:col-span-2">
          <label class="form-label">E-mail</label>
          <input v-model="form.email" type="email" class="form-input" placeholder="john.doe@example.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Telefone 1</label>
          <input v-model="form.telephone1" type="text" class="form-input font-mono" placeholder="11 1234-5678" />
        </div>
        <div class="form-group">
          <label class="form-label">Ramal 1</label>
          <input v-model="form.extension1" type="text" class="form-input font-mono" placeholder="101" />
        </div>
        <div class="form-group">
          <label class="form-label">Telefone 2</label>
          <input v-model="form.telephone2" type="text" class="form-input font-mono" placeholder="11 8765-4321" />
        </div>
        <div class="form-group">
          <label class="form-label">Ramal 2</label>
          <input v-model="form.extension2" type="text" class="form-input font-mono" placeholder="202" />
        </div>
        <div class="form-group">
          <label class="form-label">Celular</label>
          <input v-model="form.cellular" type="text" class="form-input font-mono" placeholder="11 91234-5678" />
        </div>
        <div class="form-group">
          <label class="form-label">Fax</label>
          <input v-model="form.fax" type="text" class="form-input font-mono" placeholder="11 1111-2222" />
        </div>
      </div>
    </fieldset>

    <!-- Endereço -->
    <fieldset>
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Endereço</legend>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-group sm:col-span-2">
          <label class="form-label">Logradouro</label>
          <input v-model="form.address" type="text" class="form-input" placeholder="Rua das Flores, 100" />
        </div>
        <div class="form-group">
          <label class="form-label">Bairro</label>
          <input v-model="form.district" type="text" class="form-input" placeholder="Centro" />
        </div>
        <div class="form-group">
          <label class="form-label">Cidade</label>
          <input v-model="form.city" type="text" class="form-input" placeholder="São Paulo" />
        </div>
        <div class="form-group">
          <label class="form-label">CEP</label>
          <input v-model="form.zipcode" type="text" class="form-input font-mono" placeholder="01310-100" />
        </div>
      </div>
    </fieldset>

    <!-- Observações -->
    <fieldset>
      <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Observações</legend>
      <div class="form-group">
        <textarea v-model="form.comments" class="form-textarea" rows="3" placeholder="Observações sobre o contato..."></textarea>
      </div>
    </fieldset>

  </div>
</template>
