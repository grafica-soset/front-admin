<script setup lang="ts">
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

definePageMeta({ middleware: ['auth-verification'] })

const breadcrumb = [
  { label: 'Contadores', to: '/contadores' },
  { label: 'Todos os Contadores', to: '/contadores/listagem' },
  { label: 'Novo Contador' }
]

const session = useSessionStore()
const router = useRouter()

const form = reactive({
  name:       '',
  email:      '',
  website:    '',
  telephone1: '',
  telephone2: '',
  fax:        '',
  postalcode: '',
  address:    '',
  district:   '',
  city:       '',
  state:      '',
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
    const res = await $fetch<any>('/api/accountant/cadastro', {
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
        <button type="button" @click="router.push('/contadores/listagem')"
          class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="button" @click="salvar" :disabled="submitting"
          class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Contador' }}
        </button>
      </div>
    </header>

    <div v-if="erro" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{{ erro }}</div>

    <form @submit.prevent="salvar" class="space-y-6">
      <FormsAccountantForm :form="form" mode="create" />
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" @click="router.push('/contadores/listagem')"
          class="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="submit" :disabled="submitting"
          class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Contador' }}
        </button>
      </div>
    </form>

  </div>
</template>
