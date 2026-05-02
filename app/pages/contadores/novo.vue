<script setup>
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

const breadcrumb = [
  { label: 'Contadores', to: '/contadores' },
  { label: 'Todos os Contadores', to: '/contadores/listagem' },
  { label: 'Novo Contador' }
]

const session = useSessionStore()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  website: '',
  telephone1: '',
  telephone2: '',
  fax: '',
  postalcode: '',
  address: '',
  district: '',
  city: '',
  state: '',
})

const submitting = ref(false)
const erro = ref('')

async function salvar() {
  if (!form.name.trim()) {
    erro.value = 'O nome é obrigatório.'
    return
  }

  submitting.value = true
  erro.value = ''

  try {
    const res = await $fetch('/api/accountant/cadastro', {
      method: 'POST',
      query: { token: session.token },
      body: { ...form }
    })

    if (res.success) {
      router.push('/contadores/listagem')
    } else {
      erro.value = res.message ?? 'Erro ao cadastrar contador.'
    }
  } catch {
    erro.value = 'Erro ao cadastrar contador.'
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
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Cadastrar Contador</h1>
        <p class="text-sm text-gray-500 mt-1">Preencha os dados abaixo para adicionar um novo contador ao sistema.</p>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <button type="button" @click="router.push('/contadores/listagem')" class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="button" @click="salvar" :disabled="submitting" class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Contador' }}
        </button>
      </div>
    </header>

    <div v-if="erro" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
      {{ erro }}
    </div>

    <form @submit.prevent="salvar" class="space-y-6">

      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados Principais</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text" id="name" placeholder="Ex: Escritório Contábil XYZ" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input v-model="form.email" type="email" id="email" placeholder="contato@escritorio.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input v-model="form.website" type="text" id="website" placeholder="www.escritorio.com.br" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="telephone1" class="block text-sm font-medium text-gray-700 mb-1">Telefone 1</label>
            <input v-model="form.telephone1" type="text" id="telephone1" placeholder="(00) 0000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="telephone2" class="block text-sm font-medium text-gray-700 mb-1">Telefone 2</label>
            <input v-model="form.telephone2" type="text" id="telephone2" placeholder="(00) 0000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="fax" class="block text-sm font-medium text-gray-700 mb-1">Fax</label>
            <input v-model="form.fax" type="text" id="fax" placeholder="(00) 0000-0000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </div>
      </section>

      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Endereço</h2>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3 lg:col-span-2">
            <label for="postalcode" class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input v-model="form.postalcode" type="text" id="postalcode" placeholder="00000-000" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-9 lg:col-span-7">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
            <input v-model="form.address" type="text" id="address" placeholder="Rua, Av, etc" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-3 lg:col-span-3">
            <label for="district" class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input v-model="form.district" type="text" id="district" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-7 lg:col-span-8">
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input v-model="form.city" type="text" id="city" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-2 lg:col-span-2">
            <label for="state" class="block text-sm font-medium text-gray-700 mb-1">UF</label>
            <input v-model="form.state" type="text" id="state" maxlength="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center uppercase">
          </div>
        </div>
      </section>

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" @click="router.push('/contadores/listagem')" class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="submitting" class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Contador' }}
        </button>
      </div>

    </form>
  </div>
</template>
