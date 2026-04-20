<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submitForm'): void
}>()

const submitForm = () => {
  console.log('Enviando dados...')
  emit('submitForm')
}
</script>

<template>
  <form @submit.prevent="submitForm" class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 md:p-8">

    <div>
      <slot />
    </div>

    <div class="mt-8 flex items-center justify-end gap-x-4 border-t border-gray-100 pt-6">
      <button type="button" class="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors">Cancelar</button>
      <button type="submit" class="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">Salvar Ordem de Serviço</button>
    </div>
  </form>
</template>
