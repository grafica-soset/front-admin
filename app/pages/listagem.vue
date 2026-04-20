<script setup lang="ts">
import { ref } from 'vue'

const breadcrumbItems = [
  { label: 'Exemplos', to: '/' },
  { label: 'Listagem' } // Sem "to", renderiza como texto atual
]


useHead({
  title: 'Tela de exemplo de listagem'
})
</script>

<template>
  <div class="max-w-5xl mx-auto">

    <UiBreadcrumb :items="breadcrumbItems" />

    <UiPageHeader title="Lista de clientes">
    </UiPageHeader>



  </div>
</template>

<style scoped>
/* Estilos extra apenas para este componente podem vir aqui, mas usamos as globais no main.css */
</style>
