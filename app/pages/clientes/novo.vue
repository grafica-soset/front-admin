<script setup>
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

const breadcrumb = [
  { label: 'Dashboard de Clientes', to: '/clientes' },
  { label: 'Todos os Clientes', to: '/clientes/listagem' },
  { label: 'Novo Cliente' }
]

const session = useSessionStore()
const router = useRouter()

const tipoPessoa = ref('pj')

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
  salespersonid: null,
  accountantid: null,
  postalcode: '',
  address: '',
  district: '',
  city: '',
  state: '',
})

const submitting = ref(false)
const buscandoCep = ref(false)
const erro = ref('')

const { data: vendedoresRes } = useFetch('/api/salespersons/listagem', {
  server: false,
  query: computed(() => ({ token: session.token, size: 200 }))
})

const { data: contadoresRes } = useFetch('/api/accountant/listagem', {
  server: false,
  query: computed(() => ({ token: session.token, size: 200 }))
})

const vendedoresOptions = computed(() =>
  (vendedoresRes.value?.data?.items ?? []).map(v => ({ id: v.id, label: `${v.firstName} ${v.lastName} (${v.personCode})` }))
)

const contadoresOptions = computed(() =>
  (contadoresRes.value?.data?.items ?? []).map(c => ({ id: c.id, label: c.name }))
)

watch(tipoPessoa, () => {
  form.name = ''
  form.inscrest = ''
  form.inscrmun = ''
  form.inscrprodrur = ''
})

async function buscarCep() {
  const cep = form.postalcode.replace(/\D/g, '')
  if (cep.length !== 8) return

  buscandoCep.value = true
  try {
    const data = await $fetch(`https://viacep.com.br/ws/${cep}/json/`)
    if (data.erro) return
    form.address = data.logradouro ?? ''
    form.district = data.bairro ?? ''
    form.city = data.localidade ?? ''
    form.state = data.uf ?? ''
  } catch {
    // silencioso — usuário preenche manualmente
  } finally {
    buscandoCep.value = false
  }
}

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
    const payload = {
      document: form.document,
      officialname: form.officialname,
      name: form.name || null,
      sector: form.sector || null,
      website: form.website || null,
      inscrest: form.inscrest || null,
      inscrmun: form.inscrmun || null,
      inscrprodrur: form.inscrprodrur || null,
      cei: form.cei || null,
      salespersonid: form.salespersonid || null,
      accountantid: form.accountantid || null,
      postalcode: form.postalcode || null,
      address: form.address || null,
      district: form.district || null,
      city: form.city || null,
      state: form.state || null,
    }

    const res = await $fetch('/api/customer/cadastro', {
      method: 'POST',
      query: { token: session.token },
      body: payload
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
        <button type="button" @click="salvar" :disabled="submitting" class="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
          {{ submitting ? 'Salvando...' : 'Salvar Cliente' }}
        </button>
      </div>
    </header>

    <div v-if="erro" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
      {{ erro }}
    </div>

    <form @submit.prevent="salvar" class="space-y-6">

      <!-- Dados Principais -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados Principais</h2>

        <div class="mb-5 flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="tipoPessoa" type="radio" name="tipo_pessoa" value="pj" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Pessoa Jurídica</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="tipoPessoa" type="radio" name="tipo_pessoa" value="pf" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500">
            <span class="text-sm font-medium text-gray-700">Pessoa Física</span>
          </label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-1">
            <label for="document" class="block text-sm font-medium text-gray-700 mb-1">
              {{ tipoPessoa === 'pj' ? 'CNPJ' : 'CPF' }} <span class="text-red-500">*</span>
            </label>
            <input v-model="form.document" type="text" id="document"
              :placeholder="tipoPessoa === 'pj' ? '00.000.000/0001-00' : '000.000.000-00'"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono">
          </div>

          <div class="lg:col-span-2">
            <label for="officialname" class="block text-sm font-medium text-gray-700 mb-1">
              {{ tipoPessoa === 'pj' ? 'Razão Social' : 'Nome Completo' }} <span class="text-red-500">*</span>
            </label>
            <input v-model="form.officialname" type="text" id="officialname"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div v-if="tipoPessoa === 'pj'" class="lg:col-span-1">
            <label for="ie" class="block text-sm font-medium text-gray-700 mb-1">Inscrição Estadual</label>
            <input v-model="form.inscrest" type="text" id="ie" placeholder="Isento ou Número"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div v-if="tipoPessoa === 'pj'" class="lg:col-span-2">
            <label for="nome_fantasia" class="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
            <input v-model="form.name" type="text" id="nome_fantasia"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-1">
            <label for="sector" class="block text-sm font-medium text-gray-700 mb-1">Setor / Ramo</label>
            <input v-model="form.sector" type="text" id="sector" placeholder="Ex: Gráfica, Indústria..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-2">
            <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Site</label>
            <input v-model="form.website" type="text" id="website" placeholder="https://www.empresa.com.br"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </div>
      </section>

      <!-- Dados Fiscais -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Dados Fiscais</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-if="tipoPessoa === 'pj'" class="lg:col-span-1">
            <label for="inscrmun" class="block text-sm font-medium text-gray-700 mb-1">Inscrição Municipal</label>
            <input v-model="form.inscrmun" type="text" id="inscrmun"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div v-if="tipoPessoa === 'pj'" class="lg:col-span-1">
            <label for="inscrprodrur" class="block text-sm font-medium text-gray-700 mb-1">Inscrição Produtor Rural</label>
            <input v-model="form.inscrprodrur" type="text" id="inscrprodrur"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="lg:col-span-1">
            <label for="cei" class="block text-sm font-medium text-gray-700 mb-1">CEI</label>
            <input v-model="form.cei" type="text" id="cei"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </div>
      </section>

      <!-- Informações de Contato -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Informações de Contato</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail Principal</label>
            <input type="email" id="email" placeholder="contato@empresa.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="celular" class="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
            <input type="text" id="celular" placeholder="(00) 90000-0000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="telefone" class="block text-sm font-medium text-gray-700 mb-1">Telefone Fixo</label>
            <input type="text" id="telefone" placeholder="(00) 0000-0000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div>
            <label for="responsavel" class="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
            <input type="text" id="responsavel" placeholder="Ex: João Silva (Compras)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>
        </div>
      </section>

      <!-- Responsáveis -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Responsáveis</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
            <UiCombobox
              v-model="form.salespersonid"
              :options="vendedoresOptions"
              placeholder="Buscar vendedor..."
              :min-chars="0"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contador</label>
            <UiCombobox
              v-model="form.accountantid"
              :options="contadoresOptions"
              placeholder="Digite ao menos 3 caracteres..."
              :min-chars="3"
            />
          </div>
        </div>
      </section>

      <!-- Endereço Principal -->
      <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 class="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Endereço Principal</h2>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-3 lg:col-span-2">
            <label for="cep" class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <div class="flex">
              <input v-model="form.postalcode" type="text" id="cep" placeholder="00000-000"
                class="w-full px-4 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <button type="button" @click="buscarCep" :disabled="buscandoCep"
                class="bg-gray-100 border-y border-r border-gray-300 px-3 rounded-r-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-600 disabled:opacity-50"
                title="Buscar CEP">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="md:col-span-9 lg:col-span-6">
            <label for="logradouro" class="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
            <input v-model="form.address" type="text" id="logradouro"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-4 lg:col-span-2">
            <label for="numero" class="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input type="text" id="numero"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-8 lg:col-span-2">
            <label for="complemento" class="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
            <input type="text" id="complemento" placeholder="Sala, Galpão..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-5 lg:col-span-4">
            <label for="bairro" class="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input v-model="form.district" type="text" id="bairro"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-5 lg:col-span-6">
            <label for="cidade" class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input v-model="form.city" type="text" id="cidade"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          </div>

          <div class="md:col-span-2 lg:col-span-2">
            <label for="uf" class="block text-sm font-medium text-gray-700 mb-1">UF</label>
            <input v-model="form.state" type="text" id="uf" maxlength="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center uppercase">
          </div>
        </div>
      </section>

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
