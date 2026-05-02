<script setup>
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

const breadcrumb = [
  { label: 'Vendedores', to: '/vendedores' },
  { label: 'Todos os Vendedores', to: '/vendedores/listagem' },
  { label: 'Novo Vendedor' }
]

const session = useSessionStore()
const router = useRouter()

const form = reactive({
  firstName: '',
  lastName: '',
  personCode: '',
  telephone: '',
  cellular: '',
})

const submitting = ref(false)
const erro = ref('')

async function salvar() {
  if (!form.firstName.trim() || !form.lastName.trim()) {
    erro.value = 'Nome e sobrenome são obrigatórios.'
    return
  }
  if (!form.personCode.trim()) {
    erro.value = 'O código é obrigatório.'
    return
  }

  submitting.value = true
  erro.value = ''

  try {
    const res = await $fetch('/api/salespersons/cadastro', {
      method: 'POST',
      query: { token: session.token },
      body: { ...form }
    })

    if (res.success) {
      router.push('/vendedores/listagem')
    } else {
      erro.value = res.message ?? 'Erro ao cadastrar vendedor.'
    }
  } catch {
    erro.value = 'Erro ao cadastrar vendedor.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <UiBreadcrumb :items="breadcrumb" />
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Cadastrar Vendedor</h1>
        <p class="text-sm text-gray-500 mt-1">Preencha os dados abaixo para adicionar um novo vendedor ao sistema.</p>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <button type="button" @click="router.push('/vendedores/listagem')" class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="button" @click="salvar" :disabled="submitting" class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Vendedor' }}
        </button>
      </div>
    </header>

    <div v-if="erro" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
      {{ erro }}
    </div>

    <form @submit.prevent="salvar" class="space-y-6">

      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados do Vendedor</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-2">
            <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
            <input v-model="form.firstName" type="text" id="first_name" placeholder="Ex: João" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-2">
            <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">Sobrenome <span class="text-red-500">*</span></label>
            <input v-model="form.lastName" type="text" id="last_name" placeholder="Ex: Silva" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-1">
            <label for="person_code" class="block text-sm font-medium text-gray-700 mb-1">Código <span class="text-red-500">*</span></label>
            <input v-model="form.personCode" type="text" id="person_code" placeholder="Ex: JS" maxlength="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono uppercase">
          </div>

          <div class="lg:col-span-2">
            <label for="telephone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input v-model="form.telephone" type="text" id="telephone" placeholder="(00) 0000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-2">
            <label for="cellular" class="block text-sm font-medium text-gray-700 mb-1">Celular</label>
            <input v-model="form.cellular" type="text" id="cellular" placeholder="(00) 90000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </div>
      </section>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" @click="router.push('/vendedores/listagem')" class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="submitting" class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Vendedor' }}
        </button>
      </div>

    </form>
  </div>
</template>
