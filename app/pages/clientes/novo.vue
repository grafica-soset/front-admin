<script setup lang="ts">
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

definePageMeta({ middleware: ['auth-verification'] })

const breadcrumb = [
  { label: 'Dashboard de Clientes', to: '/clientes' },
  { label: 'Todos os Clientes', to: '/clientes/listagem' },
  { label: 'Novo Cliente' }
]

const session = useSessionStore()
const router = useRouter()

const tipoPessoa = ref<'pj' | 'pf'>('pj')

const form = reactive({
  document: '',
  officialname: '',
  name: '',
  sector: '',
  website: '',
  inscrest: '',
  inscrmun: '',
  inscrprodrur: '',
  cei: '',
  salespersonid: null as number | null,
  accountantid: null as number | null,
  postalcode: '',
  address: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
})

watch(tipoPessoa, () => {
  form.name = ''
  form.inscrest = ''
  form.inscrmun = ''
  form.inscrprodrur = ''
})

const submitting = ref(false)
const erro = ref('')

async function salvar() {
  if (!form.document.trim()) {
    erro.value = tipoPessoa.value === 'pj' ? 'CNPJ é obrigatório.' : 'CPF é obrigatório.'
    return
  }
  if (!form.officialname.trim()) {
    erro.value = tipoPessoa.value === 'pj' ? 'Razão Social é obrigatória.' : 'Nome Completo é obrigatório.'
    return
  }

  submitting.value = true
  erro.value = ''

  try {
    const res = await $fetch<any>('/api/customer/cadastro', {
      method: 'POST',
      query: { token: session.token },
      body: {
        document:      form.document,
        officialname:  form.officialname,
        name:          form.name || null,
        sector:        form.sector || null,
        website:       form.website || null,
        inscrest:      form.inscrest || null,
        inscrmun:      form.inscrmun || null,
        inscrprodrur:  form.inscrprodrur || null,
        cei:           form.cei || null,
        salespersonid: form.salespersonid || null,
        accountantid:  form.accountantid || null,
        postalcode:    form.postalcode || null,
        address:       form.address || null,
        number:        form.number || null,
        complement:    form.complement || null,
        district:      form.district || null,
        city:          form.city || null,
        state:         form.state || null,
      }
    })

    if (res.success) {
      router.push('/clientes/listagem')
    } else {
      erro.value = res.message ?? 'Erro ao cadastrar cliente.'
    }
  } catch {
    erro.value = 'Erro ao cadastrar cliente.'
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
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Cadastrar Cliente</h1>
        <p class="text-sm text-gray-500 mt-1">Preencha os dados abaixo para adicionar um novo cliente ao sistema.</p>
      </div>

      <div class="flex gap-3 w-full md:w-auto">
        <UiButton @click="router.push('/clientes/listagem')" class="flex-1 md:flex-none">Cancelar</UiButton>
        <button type="button" @click="salvar" :disabled="submitting"
          class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Cliente' }}
        </button>
      </div>
    </header>

    <div v-if="erro" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
      {{ erro }}
    </div>

    <form @submit.prevent="salvar" class="space-y-6">
      <FormsCustomerForm
        :form="form"
        mode="create"
        v-model:tipoPessoa="tipoPessoa"
      />

      <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <UiButton @click="router.push('/clientes/listagem')">Cancelar</UiButton>
        <button type="submit" :disabled="submitting"
          class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Cliente' }}
        </button>
      </div>
    </form>

  </div>
</template>
