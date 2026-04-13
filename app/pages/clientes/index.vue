<script setup lang="ts">

const session = sessionStore()

const loading = ref(false)
const search = ref("")
const customerList = ref<Customer[]>([])

const searchCustomer = async () => {
  if( search.value.length < 3 || loading.value) return

  loading.value = true

  const { success, list } = await $fetch('/api/customer/search', {
    method: 'GET',
    query: {
      search : search.value,
      token : session.token
    },
  }).finally(() => {
    loading.value = false
  })

  if(list !=null ){
    customerList.value = list
  }
}

const selectCustomer = ({id}) => {
  console.log("Cliente selecionado:", id)
  // Aqui você pode implementar a lógica para lidar com a seleção do cliente, como navegar para uma página de detalhes ou preencher um formulário
}

const totalCustomerFound = computed(() => customerList.value.length)

</script>

<template>
  <div class="max-w-5xl mx-auto">

    Buscar cliente <input type="text" name="query" v-model="search" class="border" @keyup="searchCustomer" />

    <p>Total de clientes encontrados {{totalCustomerFound}}</p>

    <div>
      <ul>
        <li @click="selectCustomer(customer)" v-for="customer in customerList"> {{customer.officialName}}</li>
      </ul>
    </div>


  </div>
</template>

<style scoped>

</style>
