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
  <form @submit.prevent="emit('submitForm')" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <slot />
    <div class="px-6 py-4 flex items-center justify-end gap-3 bg-gray-50/60 border-t border-gray-100">
      <slot name="footer-left" />
      <button type="button" class="btn-secondary" @click="emit('cancel')">Cancelar</button>
      <button type="submit" class="btn-primary" :disabled="props.loading">
        <span v-if="props.loading" class="flex items-center gap-2">
          <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Salvando...
        </span>
        <span v-else>{{ props.submitLabel ?? 'Salvar' }}</span>
      </button>
    </div>
  </form>
</template>
