<script setup lang="ts" generic="T extends Record<string, any>">
defineProps<{
  items: T[]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">

    <!-- Container com overflow-x-auto para responsividade -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">

        <!-- Cabeçalho da Tabela -->
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200 text-sm text-gray-600 uppercase tracking-wider">
            <slot name="header"></slot>
          </tr>
        </thead>

        <!-- Corpo da Tabela -->
        <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
          <tr
            v-for="(item, index) in items"
            :key="item.id || index"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Slot para cada linha, passando o item atual da lista -->
            <slot name="row" :item="item"></slot>
          </tr>

          <!-- Estado vazio -->
          <tr v-if="items.length === 0">
            <td colspan="100%" class="py-8 text-center text-gray-500">
              <slot name="empty">Nenhum registro encontrado.</slot>
            </td>
          </tr>
        </tbody>

      </table>
    </div>

    <!-- Slot para o Footer (Opcional, ex: Paginação) -->
    <slot name="footer"></slot>

  </div>
</template>
