<script setup lang="ts">
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

definePageMeta({ middleware: ['auth-verification'] })

const route = useRoute()
const id = route.params.id as string
const store = useSessionStore()

const pageBreadcrumbList = [
  { label: 'Dashboard de clientes', to: '/clientes' },
  { label: 'Listagem', to: '/clientes/listagem' },
  { label: 'Detalhar' },
]

// ── Customer ──────────────────────────────────────────────────────────────────
const { data: customerRes, pending: customerLoading } = await useFetch<any>(
  `/api/customer/${id}`,
  { query: { token: store.token } }
)

const customer = computed(() => customerRes.value?.data ?? null)

const initials = computed(() => {
  const name = customer.value?.officialname ?? ''
  return name.split(' ').slice(0, 2).map((w: string) => w[0] ?? '').join('').toUpperCase() || '?'
})

const displayName = computed(() => customer.value?.officialname || customer.value?.name || '—')
const tradeName = computed(() => {
  const n = customer.value?.name
  const o = customer.value?.officialname
  return n && n !== o ? n : null
})

// ── Tabs ──────────────────────────────────────────────────────────────────────
type Tab = 'informacoes' | 'contatos' | 'cores'
const activeTab = ref<Tab>('informacoes')

// ── Contacts ──────────────────────────────────────────────────────────────────
const contacts = ref<any[]>([])
const contactsPage = ref(0)
const contactsTotalPages = ref(0)
const contactsLoaded = ref(false)
const contactsLoading = ref(false)

async function loadContacts(page = 0) {
  contactsLoading.value = true
  try {
    const res = await $fetch<any>(`/api/customer/${id}/contact`, {
      query: { token: store.token, page, size: 20 }
    })
    contacts.value = res.data?.items ?? []
    contactsTotalPages.value = res.data?.totalPages ?? 0
    contactsPage.value = res.data?.currentPage ?? 0
    contactsLoaded.value = true
  } finally {
    contactsLoading.value = false
  }
}

// ── Inks ──────────────────────────────────────────────────────────────────────
const inks = ref<any[]>([])
const inksPage = ref(0)
const inksTotalPages = ref(0)
const inksLoaded = ref(false)
const inksLoading = ref(false)

async function loadInks(page = 0) {
  inksLoading.value = true
  try {
    const res = await $fetch<any>(`/api/customer/${id}/ink`, {
      query: { token: store.token, page, size: 20 }
    })
    inks.value = res.data?.items ?? []
    inksTotalPages.value = res.data?.totalPages ?? 0
    inksPage.value = res.data?.currentPage ?? 0
    inksLoaded.value = true
  } finally {
    inksLoading.value = false
  }
}

function selectTab(tab: Tab) {
  activeTab.value = tab
  if (tab === 'contatos' && !contactsLoaded.value) loadContacts()
  if (tab === 'cores' && !inksLoaded.value) loadInks()
}

// ── Edit modal ────────────────────────────────────────────────────────────────
const showEditModal = ref(false)
const saving = ref(false)
const saveError = ref('')

const form = reactive({
  name: '',
  officialname: '',
  document: '',
  sector: '',
  website: '',
  active: true,
  // address — backend uses different field names on PUT vs GET
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  // fiscal
  inscrest: '',
  inscrmun: '',
  inscrprodrur: '',
  cei: '',
  salespersonid: null as number | null,
  accountantid: null as number | null,
})

function openEditModal() {
  const c = customer.value
  if (!c) return
  form.name = c.name ?? ''
  form.officialname = c.officialname ?? ''
  form.document = c.document ?? ''
  form.sector = c.sector ?? ''
  form.website = c.website ?? ''
  form.active = c.active ?? true
  // GET uses address/district/postalcode, PUT expects street/neighborhood/zipcode
  form.street = c.address ?? ''
  form.number = c.number ?? ''
  form.complement = c.complement ?? ''
  form.neighborhood = c.district ?? ''
  form.city = c.city ?? ''
  form.state = c.state ?? ''
  form.zipcode = c.postalcode ?? ''
  form.country = c.country ?? ''
  form.inscrest = c.inscrest ?? ''
  form.inscrmun = c.inscrmun ?? ''
  form.inscrprodrur = c.inscrprodrur ?? ''
  form.cei = c.cei ?? ''
  form.salespersonid = c.salespersonid ?? null
  form.accountantid = c.accountantid ?? null
  saveError.value = ''
  showEditModal.value = true
}

async function saveCustomer() {
  saving.value = true
  saveError.value = ''
  try {
    const res = await $fetch<any>(`/api/customer/${id}`, {
      method: 'PUT',
      query: { token: store.token },
      body: { ...form },
    })
    if (res.success) {
      // Refresh the displayed customer data
      customerRes.value = res
      showEditModal.value = false
    } else {
      saveError.value = res.message || 'Erro ao salvar. Tente novamente.'
    }
  } catch {
    saveError.value = 'Erro ao salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <UiBreadcrumb :items="pageBreadcrumbList" />

    <!-- Loading skeleton -->
    <div v-if="customerLoading" class="animate-pulse space-y-4 mt-4">
      <div class="h-32 bg-white rounded-xl border border-gray-200"></div>
      <div class="h-10 bg-white rounded-xl border border-gray-200 w-72"></div>
    </div>

    <template v-else-if="customer">

      <!-- Header -->
      <header class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 mt-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl font-bold shrink-0">
              {{ initials }}
            </div>
            <div>
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="text-2xl font-bold text-gray-900">{{ displayName }}</h1>
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="customer.active
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'"
                >
                  {{ customer.active ? 'Ativo' : 'Inativo' }}
                </span>
              </div>
              <p v-if="tradeName" class="text-sm text-gray-500 mt-0.5">{{ tradeName }}</p>
              <p v-if="customer.document" class="text-sm text-gray-500 mt-0.5 font-mono">{{ customer.document }}</p>
              <p v-if="customer.city || customer.state" class="text-xs text-gray-400 mt-0.5">
                {{ [customer.city, customer.state].filter(Boolean).join(' — ') }}
              </p>
            </div>
          </div>

          <div class="flex gap-3 w-full md:w-auto">
            <button
              @click="openEditModal"
              class="flex-1 md:flex-none px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Editar Dados
            </button>
          </div>
        </div>
      </header>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="selectTab('informacoes')"
            class="px-1 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === 'informacoes'
              ? 'border-blue-500 text-blue-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Informações
          </button>
          <button
            @click="selectTab('contatos')"
            class="px-1 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === 'contatos'
              ? 'border-blue-500 text-blue-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Contatos
          </button>
          <button
            @click="selectTab('cores')"
            class="px-1 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
            :class="activeTab === 'cores'
              ? 'border-blue-500 text-blue-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            Cores
          </button>
        </nav>
      </div>

      <!-- Tab: Informações -->
      <div v-if="activeTab === 'informacoes'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Endereço</h3>
          <dl class="space-y-3">
            <div v-if="customer.address">
              <dt class="text-xs text-gray-400">Logradouro</dt>
              <dd class="text-sm text-gray-800">{{ customer.address }}<span v-if="customer.number">, {{ customer.number }}</span></dd>
            </div>
            <div v-if="customer.complement">
              <dt class="text-xs text-gray-400">Complemento</dt>
              <dd class="text-sm text-gray-800">{{ customer.complement }}</dd>
            </div>
            <div v-if="customer.district">
              <dt class="text-xs text-gray-400">Bairro</dt>
              <dd class="text-sm text-gray-800">{{ customer.district }}</dd>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="customer.city">
                <dt class="text-xs text-gray-400">Cidade</dt>
                <dd class="text-sm text-gray-800">{{ customer.city }}</dd>
              </div>
              <div v-if="customer.state">
                <dt class="text-xs text-gray-400">Estado</dt>
                <dd class="text-sm text-gray-800">{{ customer.state }}</dd>
              </div>
            </div>
            <div v-if="customer.postalcode">
              <dt class="text-xs text-gray-400">CEP</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ customer.postalcode }}</dd>
            </div>
          </dl>
        </section>

        <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Dados Fiscais</h3>
          <dl class="space-y-3">
            <div v-if="customer.sector">
              <dt class="text-xs text-gray-400">Setor</dt>
              <dd class="text-sm text-gray-800">{{ customer.sector }}</dd>
            </div>
            <div v-if="customer.website">
              <dt class="text-xs text-gray-400">Website</dt>
              <dd class="text-sm text-gray-800">
                <a :href="customer.website" target="_blank" class="text-blue-600 hover:underline">{{ customer.website }}</a>
              </dd>
            </div>
            <div v-if="customer.inscrest">
              <dt class="text-xs text-gray-400">Inscrição Estadual</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ customer.inscrest }}</dd>
            </div>
            <div v-if="customer.inscrmun">
              <dt class="text-xs text-gray-400">Inscrição Municipal</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ customer.inscrmun }}</dd>
            </div>
            <div v-if="customer.inscrprodrur">
              <dt class="text-xs text-gray-400">Inscrição Prod. Rural</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ customer.inscrprodrur }}</dd>
            </div>
            <div v-if="customer.cei">
              <dt class="text-xs text-gray-400">CEI</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ customer.cei }}</dd>
            </div>
          </dl>
        </section>

      </div>

      <!-- Tab: Contatos -->
      <div v-if="activeTab === 'contatos'">
        <div v-if="contactsLoading" class="flex justify-center items-center py-16">
          <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <template v-else>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div v-if="contacts.length === 0" class="p-12 text-center text-sm text-gray-500">
              Nenhum contato cadastrado.
            </div>
            <table v-else class="w-full text-sm text-left">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th class="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th class="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">E-mail</th>
                  <th class="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Telefone</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="contact in contacts" :key="contact.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">
                    {{ [contact.firstName, contact.lastName].filter(Boolean).join(' ') || '—' }}
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ contact.jobTitle || '—' }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ contact.email || '—' }}</td>
                  <td class="px-6 py-4 text-gray-600 font-mono">{{ contact.telephone1 || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="contactsTotalPages > 1" class="flex justify-center items-center gap-2 mt-6">
            <button @click="loadContacts(contactsPage - 1)" :disabled="contactsPage === 0" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors">Anterior</button>
            <span class="text-sm text-gray-600">{{ contactsPage + 1 }} / {{ contactsTotalPages }}</span>
            <button @click="loadContacts(contactsPage + 1)" :disabled="contactsPage + 1 >= contactsTotalPages" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors">Próximo</button>
          </div>
        </template>
      </div>

      <!-- Tab: Cores -->
      <div v-if="activeTab === 'cores'">
        <div v-if="inksLoading" class="flex justify-center items-center py-16">
          <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <template v-else>
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div v-if="inks.length === 0" class="p-12 text-center text-sm text-gray-500">
              Nenhuma cor cadastrada.
            </div>
            <table v-else class="w-full text-sm text-left">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome da Cor</th>
                  <th class="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Código Pantone</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="ink in inks" :key="ink.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">{{ ink.colorName || '—' }}</td>
                  <td class="px-6 py-4 text-gray-600 font-mono">{{ ink.pantoneCode || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="inksTotalPages > 1" class="flex justify-center items-center gap-2 mt-6">
            <button @click="loadInks(inksPage - 1)" :disabled="inksPage === 0" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors">Anterior</button>
            <span class="text-sm text-gray-600">{{ inksPage + 1 }} / {{ inksTotalPages }}</span>
            <button @click="loadInks(inksPage + 1)" :disabled="inksPage + 1 >= inksTotalPages" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors">Próximo</button>
          </div>
        </template>
      </div>

    </template>

    <div v-else-if="!customerLoading" class="mt-8 text-center text-sm text-gray-500">
      Cliente não encontrado.
    </div>

    <!-- ── Modal de edição ───────────────────────────────────────────────────── -->
    <UiModal :open="showEditModal" title="Editar Cliente" size="xl" @close="showEditModal = false">

      <form @submit.prevent="saveCustomer" id="form-edit-customer">

        <!-- Dados Gerais -->
        <fieldset class="mb-6">
          <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Dados Gerais</legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group sm:col-span-2">
              <label class="form-label">Razão Social</label>
              <input v-model="form.officialname" type="text" class="form-input" />
            </div>
            <div class="form-group sm:col-span-2">
              <label class="form-label">Nome Fantasia</label>
              <input v-model="form.name" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">CNPJ / CPF</label>
              <input v-model="form.document" type="text" class="form-input font-mono" />
            </div>
            <div class="form-group">
              <label class="form-label">Setor</label>
              <input v-model="form.sector" type="text" class="form-input" />
            </div>
            <div class="form-group sm:col-span-2">
              <label class="form-label">Website</label>
              <input v-model="form.website" type="url" class="form-input" placeholder="https://" />
            </div>
            <div class="form-group sm:col-span-2">
              <label class="form-checkbox-label cursor-pointer">
                <div class="form-checkbox-container">
                  <input v-model="form.active" type="checkbox" class="form-checkbox" />
                </div>
                <div class="form-checkbox-content">
                  <span class="form-label">Cliente Ativo</span>
                </div>
              </label>
            </div>
          </div>
        </fieldset>

        <!-- Endereço -->
        <fieldset class="mb-6">
          <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Endereço</legend>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div class="form-group sm:col-span-3">
              <label class="form-label">Logradouro</label>
              <input v-model="form.street" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Número</label>
              <input v-model="form.number" type="text" class="form-input" />
            </div>
            <div class="form-group sm:col-span-2">
              <label class="form-label">Complemento</label>
              <input v-model="form.complement" type="text" class="form-input" />
            </div>
            <div class="form-group sm:col-span-2">
              <label class="form-label">Bairro</label>
              <input v-model="form.neighborhood" type="text" class="form-input" />
            </div>
            <div class="form-group sm:col-span-2">
              <label class="form-label">Cidade</label>
              <input v-model="form.city" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Estado</label>
              <input v-model="form.state" type="text" class="form-input" maxlength="2" />
            </div>
            <div class="form-group">
              <label class="form-label">CEP</label>
              <input v-model="form.zipcode" type="text" class="form-input font-mono" />
            </div>
            <div class="form-group sm:col-span-2">
              <label class="form-label">País</label>
              <input v-model="form.country" type="text" class="form-input" />
            </div>
          </div>
        </fieldset>

        <!-- Dados Fiscais -->
        <fieldset>
          <legend class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 w-full">Dados Fiscais</legend>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Inscrição Estadual</label>
              <input v-model="form.inscrest" type="text" class="form-input font-mono" />
            </div>
            <div class="form-group">
              <label class="form-label">Inscrição Municipal</label>
              <input v-model="form.inscrmun" type="text" class="form-input font-mono" />
            </div>
            <div class="form-group">
              <label class="form-label">Inscrição Prod. Rural</label>
              <input v-model="form.inscrprodrur" type="text" class="form-input font-mono" />
            </div>
            <div class="form-group">
              <label class="form-label">CEI</label>
              <input v-model="form.cei" type="text" class="form-input font-mono" />
            </div>
          </div>
        </fieldset>

        <!-- Erro -->
        <p v-if="saveError" class="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ saveError }}
        </p>

      </form>

      <template #footer>
        <button
          type="button"
          @click="showEditModal = false"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="form-edit-customer"
          :disabled="saving"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
      </template>

    </UiModal>

  </div>
</template>
