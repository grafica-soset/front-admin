<script setup lang="ts">
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

const session = useSessionStore()

const handleClientSelect = (client: any) => {
  navigateTo(`/clientes/${client.id}`)
}

const showCustomerModal = ref(false)
const tipoPessoa = ref<'pj' | 'pf'>('pj')
const submittingCustomer = ref(false)
const customerError = ref('')

function getInitialCustomerForm() {
  return {
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
  }
}

const customerForm = reactive(getInitialCustomerForm())

watch(tipoPessoa, () => {
  customerForm.name = ''
  customerForm.inscrest = ''
  customerForm.inscrmun = ''
  customerForm.inscrprodrur = ''
})

function openCustomerModal() {
  Object.assign(customerForm, getInitialCustomerForm())
  tipoPessoa.value = 'pj'
  customerError.value = ''
  showCustomerModal.value = true
}

function closeCustomerModal() {
  showCustomerModal.value = false
}

async function saveCustomer() {
  if (!customerForm.document.trim()) {
    customerError.value = tipoPessoa.value === 'pj' ? 'CNPJ é obrigatório.' : 'CPF é obrigatório.'
    return
  }
  if (!customerForm.officialname.trim()) {
    customerError.value = tipoPessoa.value === 'pj' ? 'Razão Social é obrigatória.' : 'Nome Completo é obrigatório.'
    return
  }

  submittingCustomer.value = true
  customerError.value = ''

  try {
    const res = await $fetch<any>('/api/customer/cadastro', {
      method: 'POST',
      query: { token: session.token },
      body: {
        document:      customerForm.document,
        officialname:  customerForm.officialname,
        name:          customerForm.name || null,
        sector:        customerForm.sector || null,
        website:       customerForm.website || null,
        inscrest:      customerForm.inscrest || null,
        inscrmun:      customerForm.inscrmun || null,
        inscrprodrur:  customerForm.inscrprodrur || null,
        cei:           customerForm.cei || null,
        salespersonid: customerForm.salespersonid || null,
        accountantid:  customerForm.accountantid || null,
        postalcode:    customerForm.postalcode || null,
        address:       customerForm.address || null,
        number:        customerForm.number || null,
        complement:    customerForm.complement || null,
        district:      customerForm.district || null,
        city:          customerForm.city || null,
        state:         customerForm.state || null,
      }
    })

    if (res.success) {
      closeCustomerModal()
      const createdId = res.data?.id
      if (createdId) {
        await navigateTo(`/clientes/${createdId}`)
      }
    } else {
      customerError.value = res.message ?? 'Erro ao cadastrar cliente.'
    }
  } catch (e: any) {
    customerError.value = e?.data?.message || 'Erro ao cadastrar cliente.'
  } finally {
    submittingCustomer.value = false
  }
}
</script>
<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">Visão Geral</h1>
        <p class="text-sm text-gray-500 mt-1">Acompanhe as métricas e busque clientes rapidamente.</p>
      </div>

      <div class="w-full md:w-96">
        <UiSearchDropdown
            endpoint="/api/customer/search"
            placeholder="Buscar cliente (Nome, CNPJ)..."
            label-key="officialName"
            secondary-label-key="name"
            sub-label-key="document"
            city-key="city"
            state-key="state"
            @select="handleClientSelect"
        />
      </div>
    </header>

    <section class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Clientes Ativos</h3>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-gray-900">1.240</span>
          <span class="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">+12 este mês</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">OS em Aberto</h3>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-gray-900">45</span>
          <span class="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Atenção</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
        <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Orçamentos Pendentes</h3>
        <span class="text-3xl font-extrabold text-gray-900">12</span>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-base font-bold text-gray-800">Top Clientes (Volume)</h3>
          <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">Ver relatório</button>
        </div>
        <div class="h-48 w-full flex items-end justify-between gap-2 px-2">
          <div class="w-1/5 bg-blue-100 hover:bg-blue-200 rounded-t-md h-3/4 transition-colors relative group cursor-pointer"></div>
          <div class="w-1/5 bg-blue-500 hover:bg-blue-600 rounded-t-md h-full transition-colors relative group cursor-pointer"></div>
          <div class="w-1/5 bg-blue-200 hover:bg-blue-300 rounded-t-md h-1/2 transition-colors relative group cursor-pointer"></div>
          <div class="w-1/5 bg-blue-100 hover:bg-blue-200 rounded-t-md h-1/3 transition-colors relative group cursor-pointer"></div>
          <div class="w-1/5 bg-blue-50 hover:bg-blue-100 rounded-t-md h-1/4 transition-colors relative group cursor-pointer"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-2 px-2">
          <span>Cli A</span><span>Cli B</span><span>Cli C</span><span>Cli D</span><span>Cli E</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-base font-bold text-gray-800 mb-6">Status das OS em Aberto</h3>
        <div class="h-48 w-full flex items-center justify-center">
          <div class="w-40 h-40 rounded-full border-[16px] border-blue-500 border-t-amber-400 border-r-gray-200 flex items-center justify-center">
            <span class="text-xl font-bold text-gray-700">45</span>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-4 text-sm text-gray-600">
          <span class="flex items-center gap-1"><div class="w-3 h-3 rounded-full bg-blue-500"></div> Em Arte</span>
          <span class="flex items-center gap-1"><div class="w-3 h-3 rounded-full bg-amber-400"></div> Impressão</span>
          <span class="flex items-center gap-1"><div class="w-3 h-3 rounded-full bg-gray-200"></div> Acabamento</span>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-base font-bold text-gray-800">Últimos Orçamentos Pendentes</h3>
        </div>
        <ul class="divide-y divide-gray-100">
          <li class="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-900">Orç. #992 - Gráfica Exemplo</p>
              <p class="text-xs text-gray-500 mt-0.5">Criado há 2 horas</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">R$ 5.400,00</p>
              <button class="text-xs text-blue-600 hover:underline mt-0.5">Aprovar / Negar</button>
            </div>
          </li>
          <li class="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-900">Orç. #993 - Papelaria Central</p>
              <p class="text-xs text-gray-500 mt-0.5">Criado ontem</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">R$ 1.250,00</p>
              <button class="text-xs text-blue-600 hover:underline mt-0.5">Aprovar / Negar</button>
            </div>
          </li>
        </ul>
        <div class="p-4 bg-gray-50 text-center border-t border-gray-100">
          <button class="text-sm font-medium text-gray-600 hover:text-gray-900">Ver todos os orçamentos</button>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <h3 class="text-base font-bold text-gray-800 mb-4">Ações Rápidas</h3>
        <div class="flex flex-col gap-3 flex-grow justify-center">

          <button
            type="button"
            @click="openCustomerModal"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Novo Cliente
          </button>

          <button class="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Novo Orçamento
          </button>

          <button class="w-full py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Nova OS
          </button>

        </div>
      </div>

    </section>

    <UiModal :open="showCustomerModal" title="Novo Cliente" size="xl" @close="closeCustomerModal">
      <form @submit.prevent="saveCustomer">
        <FormsCustomerForm
          :form="customerForm"
          mode="create"
          v-model:tipoPessoa="tipoPessoa"
        />
        <p v-if="customerError" class="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ customerError }}
        </p>
      </form>

      <template #footer>
        <button
          type="button"
          @click="closeCustomerModal"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="saveCustomer"
          :disabled="submittingCustomer"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          <svg v-if="submittingCustomer" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ submittingCustomer ? 'Salvando...' : 'Salvar Cliente' }}
        </button>
      </template>
    </UiModal>

  </div>
</template>
