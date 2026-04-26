<script setup lang="ts">
const props = defineProps<{
  submitLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submitForm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <form @submit.prevent="emit('submitForm')" class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 md:p-8">

    <div>
      <slot />
    </div>

    <div class="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
      <div>
        <slot name="footer-left" />
      </div>
      <div class="flex items-center gap-x-4">
        <button type="button" @click="emit('cancel')" class="text-sm font-semibold leading-6 text-gray-700 hover:text-gray-900 transition-colors">Cancelar</button>
        <button type="submit" :disabled="loading" class="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50">
          {{ loading ? 'Salvando...' : (submitLabel ?? 'Salvar') }}
        </button>
      </div>
    </div>

  </form>
</template>
