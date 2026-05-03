<script setup lang="ts">
defineProps<{
  form: Record<string, any>
  mode: 'create' | 'edit'
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4">
    <div class="form-group">
      <label class="form-label">Nome da Cor <span class="text-red-500">*</span></label>
      <input v-model="form.colorName" type="text" class="form-input" placeholder="Ex: Azul Marinho" />
    </div>
    <div class="form-group">
      <label class="form-label">Código Pantone</label>
      <input v-model="form.pantoneCode" type="text" class="form-input font-mono" placeholder="Ex: Pantone 2955 C" />
    </div>
  </div>
</template>
