<script setup lang="ts">

const route = useRoute()

const id = ref("")

onMounted(() => {
  id.value = route.params.id as number
})

</script>

<template>
  <div class="max-w-5xl mx-auto">
    <h1>Detalhes do Cliente {{id}}</h1>
    <!-- Aqui você pode adicionar os detalhes do cliente usando o ID da rota -->


    Listar os contatos
    Listar as OS

  </div>
</template>

<style scoped>

</style>
