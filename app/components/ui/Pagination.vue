<script setup>
defineProps({
  totalItems: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  currentPage: { type: Number, required: true },
  firstItem: { type: Number, required: true },
  lastItem: { type: Number, required: true },
  paginationItems: { type: Array, required: true },
})
const emit = defineEmits(['go-to-page'])
</script>

<template>
  <div v-if="totalItems > 0" class="flex flex-col md:flex-row items-center justify-between gap-4">
    <p class="text-sm text-gray-500">
      Exibindo <span class="font-medium text-gray-900">{{ firstItem }}</span> a
      <span class="font-medium text-gray-900">{{ lastItem }}</span> de
      <span class="font-medium text-gray-900">{{ totalItems }}</span> resultados
    </p>

    <nav v-if="totalPages > 1" class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
      <button
        @click="emit('go-to-page', currentPage - 1)"
        :disabled="currentPage === 0"
        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span class="sr-only">Anterior</span>
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <template v-for="item in paginationItems" :key="item.key">
        <span
          v-if="item.type === 'ellipsis'"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
        >...</span>
        <button
          v-else
          @click="emit('go-to-page', item.page)"
          :aria-current="item.page === currentPage ? 'page' : undefined"
          :class="[
            item.page === currentPage
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]"
        >{{ item.page + 1 }}</button>
      </template>

      <button
        @click="emit('go-to-page', currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span class="sr-only">Próximo</span>
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  </div>
</template>
