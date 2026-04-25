<script setup lang="ts">

const session = sessionStore()
const router = useRouter()

const loading = ref(false)
const search = ref("")
const customerList = ref<Customer[]>([])

const searchCustomer = async () => {
  if (search.value.length < 3 || loading.value) return

  loading.value = true

  const { list } = await $fetch('/api/customer/search', {
    method: 'GET',
    query: {
      search: search.value,
      token: session.token
    },
  }).finally(() => {
    loading.value = false
  })

  if (list != null) {
    customerList.value = list
  }
}

const selectCustomer = ({ id }) => {
  router.push(`/clientes/${id}`)
}

const customerType = (doc: string) => {
  const digits = doc?.replace(/\D/g, '') ?? ''
  return digits.length === 14 ? 'Jurídica' : 'Física'
}


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

    <p class="text-sm text-gray-500 mb-3">Total de clientes encontrados: {{ customerList.length }}</p>

    <UiDatatable :items="customerList">

      <template #header>
        <th class="py-3 px-4 font-semibold">Nome</th>
        <th class="py-3 px-4 font-semibold">Documento</th>
        <th class="py-3 px-4 font-semibold">Tipo</th>
        <th class="py-3 px-4 font-semibold">Cidade</th>
      </template>

      <template #row="{ item }">
        <td class="py-3 px-4 font-medium text-gray-900 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          {{ item.officialName || item.name }}
        </td>
        <td class="py-3 px-4 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          {{ item.cnpj }}
        </td>
        <td class="py-3 px-4 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {{ customerType(item.cnpj) }}
          </span>
        </td>
        <td class="py-3 px-4 whitespace-nowrap cursor-pointer" @click="selectCustomer(item)">
          {{ item.city }}
        </td>
      </template>

    </UiDatatable>

  </div>
</template>

<style scoped>
</style>
