<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  mode: 'create' | 'edit'
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="form-group">
      <label class="form-label">Nome</label>
      <input v-model="form.firstName" type="text" class="form-input" placeholder="Nome" />
    </div>
    <div class="form-group">
      <label class="form-label">Sobrenome</label>
      <input v-model="form.lastName" type="text" class="form-input" placeholder="Sobrenome" />
    </div>
    <div class="form-group">
      <label class="form-label">Cargo</label>
      <input v-model="form.jobTitle" type="text" class="form-input" placeholder="Ex: Gerente de Compras" />
    </div>
    <div class="form-group">
      <label class="form-label">Departamento</label>
      <input v-model="form.department" type="text" class="form-input" placeholder="Ex: Compras" />
    </div>
    <div class="form-group">
      <label class="form-label">E-mail</label>
      <input v-model="form.email" type="email" class="form-input" placeholder="contato@empresa.com" />
    </div>
    <div class="form-group">
      <label class="form-label">Telefone</label>
      <input v-model="form.telephone1" type="text" class="form-input font-mono" placeholder="(00) 0000-0000" />
    </div>
    <div class="form-group">
      <label class="form-label">Celular</label>
      <input v-model="form.cellular" type="text" class="form-input font-mono" placeholder="(00) 90000-0000" />
    </div>
    <div class="form-group sm:col-span-2">
      <label class="form-label">Observações</label>
      <textarea v-model="form.comments" class="form-textarea" rows="2" placeholder="Observações sobre o contato..."></textarea>
    </div>
  </div>
</template>
