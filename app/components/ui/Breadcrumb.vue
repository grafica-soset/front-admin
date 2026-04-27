<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
    // Exemplo do formato esperado: [{ label: 'Clientes', to: '/clientes' }, { label: 'Novo Cliente' }]
  }
})

// Função auxiliar para descobrir se é o último item do array
const isLast = (index) => index === props.items.length - 1
</script>

<template>
  <nav class="flex mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-3">
      <li class="inline-flex items-center">
        <NuxtLink to="/" class="hover:text-indigo-600 transition-colors">
          Dashboard
        </NuxtLink>
      </li>

      <li v-for="(item, index) in items" :key="index" :aria-current="isLast(index) ? 'page' : undefined">
        <div class="flex items-center">
          <svg class="w-4 h-4 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>

          <NuxtLink
              v-if="item.to && !isLast(index)"
              :to="item.to"
              class="hover:text-indigo-600 transition-colors"
          >
            {{ item.label }}
          </NuxtLink>

          <span v-else class="text-gray-900 font-medium">
            {{ item.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>
