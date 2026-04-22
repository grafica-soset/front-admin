<script setup lang="ts">

const session = sessionStore()
const router = useRouter()

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
  router.push(`/clientes/${id}`)
}

const totalCustomerFound = computed(() => customerList.value.length)

</script>

<template>
  <div class="max-w-5xl mx-auto">

    <UiPageHeader title="Clientes" />

    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="relative flex-1 max-w-sm">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          name="query"
          v-model="search"
          @keyup="searchCustomer"
          placeholder="Buscar cliente..."
          class="form-input pl-9"
        />
      </div>
      <NuxtLink to="/clientes/adicionar" class="btn-primary whitespace-nowrap">
        + Adicionar cliente
      </NuxtLink>
    </div>

    <p class="text-sm text-gray-500 mb-3">Total de clientes encontrados: {{ totalCustomerFound }}</p>

    <UiDatatable :items="customerList">
      <template #header>
        <th class="px-4 py-3 font-medium">Razão Social</th>
      </template>
      <template #row="{ item }">
        <td class="px-4 py-3 cursor-pointer hover:text-indigo-600 transition-colors" @click="selectCustomer(item)">
          {{ item.officialName }}
        </td>
      </template>
    </UiDatatable>

  </div>
</template>

<style scoped>
</style>
