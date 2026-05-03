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
const { data: customerRes, pending: customerLoading, refresh: refreshCustomer } = await useFetch<any>(
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

// ── Vendedores / Contadores ────────────────────────────────────────────────────
const { data: vendedoresRes } = useFetch<any>('/api/salespersons/listagem', {
  server: false,
  query: computed(() => ({ token: store.token, size: 200 }))
})

const { data: contadoresRes } = useFetch<any>('/api/accountant/listagem', {
  server: false,
  query: computed(() => ({ token: store.token, size: 200 }))
})

const vendedoresOptions = computed(() =>
  (vendedoresRes.value?.data?.items ?? []).map((v: any) => ({ id: v.id, label: `${v.firstName} ${v.lastName} (${v.personCode})` }))
)

const contadoresOptions = computed(() =>
  (contadoresRes.value?.data?.items ?? []).map((c: any) => ({ id: c.id, label: c.name }))
)

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

// ── Edit customer modal ───────────────────────────────────────────────────────
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
  address: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  postalcode: '',
  country: '',
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
  form.address = c.address ?? ''
  form.number = c.number ?? ''
  form.complement = c.complement ?? ''
  form.district = c.district ?? ''
  form.city = c.city ?? ''
  form.state = c.state ?? ''
  form.postalcode = c.postalcode ?? ''
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
      body: {
        name:          form.name,
        officialname:  form.officialname,
        document:      form.document,
        sector:        form.sector,
        website:       form.website,
        inscrest:      form.inscrest,
        inscrmun:      form.inscrmun,
        inscrprodrur:  form.inscrprodrur,
        cei:           form.cei,
        salespersonid: form.salespersonid,
        accountantid:  form.accountantid,
        active:        form.active,
        address:       form.address,
        number:        form.number,
        complement:    form.complement,
        district:      form.district,
        city:          form.city,
        state:         form.state,
        postalcode:    form.postalcode,
        country:       form.country,
      },
    })
    if (res.success) {
      await refreshCustomer()
      showEditModal.value = false
    } else {
      saveError.value = res.message || 'Erro ao salvar. Tente novamente.'
    }
  } catch (e: any) {
    saveError.value = e?.data?.message || 'Erro ao salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}

// ── Contact modal (create + edit) ─────────────────────────────────────────────
const showContactModal = ref(false)
const editingContactId = ref<number | null>(null)
const loadingContact = ref(false)
const savingContact = ref(false)
const contactError = ref('')

const contactForm = reactive({
  firstName:  '',
  lastName:   '',
  jobTitle:   '',
  department: '',
  email:      '',
  telephone1: '',
  telephone2: '',
  cellular:   '',
  fax:        '',
  extension1: '',
  extension2: '',
  address:    '',
  district:   '',
  city:       '',
  zipcode:    '',
  comments:   '',
})

function fillContactForm(c: any) {
  contactForm.firstName   = c?.firstName  ?? ''
  contactForm.lastName    = c?.lastName   ?? ''
  contactForm.jobTitle    = c?.jobTitle   ?? ''
  contactForm.department  = c?.department ?? ''
  contactForm.email       = c?.email      ?? ''
  contactForm.telephone1  = c?.telephone1 ?? ''
  contactForm.telephone2  = c?.telephone2 ?? ''
  contactForm.cellular    = c?.cellular   ?? ''
  contactForm.fax         = c?.fax        ?? ''
  contactForm.extension1  = c?.extension1 != null ? String(c.extension1) : ''
  contactForm.extension2  = c?.extension2 != null ? String(c.extension2) : ''
  contactForm.address     = c?.address    ?? ''
  contactForm.district    = c?.district   ?? ''
  contactForm.city        = c?.city       ?? ''
  contactForm.zipcode     = c?.zipcode    ?? ''
  contactForm.comments    = c?.comments   ?? ''
}

async function openContactModal(contact?: any) {
  editingContactId.value = contact?.id ?? null
  contactError.value = ''

  if (contact?.id) {
    loadingContact.value = true
    showContactModal.value = true
    try {
      const res = await $fetch<any>(`/api/customer/${id}/contact/${contact.id}`, {
        query: { token: store.token }
      })
      fillContactForm(res.data ?? res)
    } catch {
      contactError.value = 'Erro ao carregar dados do contato.'
    } finally {
      loadingContact.value = false
    }
  } else {
    fillContactForm(null)
    showContactModal.value = true
  }
}

async function saveContact() {
  if (!contactForm.firstName.trim()) {
    contactError.value = 'Nome é obrigatório.'
    return
  }
  savingContact.value = true
  contactError.value = ''
  try {
    const isEdit = editingContactId.value !== null
    const url = isEdit
      ? `/api/customer/${id}/contact/${editingContactId.value}`
      : `/api/customer/${id}/contact`
    const res = await $fetch<any>(url, {
      method: isEdit ? 'PUT' : 'POST',
      query: { token: store.token },
      body: contactForm,
    })
    if (res.success) {
      showContactModal.value = false
      await loadContacts(contactsPage.value)
    } else {
      contactError.value = res.message || 'Erro ao salvar contato.'
    }
  } catch (e: any) {
    contactError.value = e?.data?.message || 'Erro ao salvar contato.'
  } finally {
    savingContact.value = false
  }
}

// ── Ink modal (create + edit) ─────────────────────────────────────────────────
const showInkModal = ref(false)
const editingInkId = ref<number | null>(null)
const savingInk = ref(false)
const inkError = ref('')

const inkForm = reactive({
  colorName: '',
  pantoneCode: '',
})

function openInkModal(ink?: any) {
  editingInkId.value  = ink?.id ?? null
  inkForm.colorName   = ink?.colorName   ?? ''
  inkForm.pantoneCode = ink?.pantoneCode ?? ''
  inkError.value = ''
  showInkModal.value = true
}

async function saveInk() {
  if (!inkForm.colorName.trim()) {
    inkError.value = 'Nome da cor é obrigatório.'
    return
  }
  savingInk.value = true
  inkError.value = ''
  try {
    const isEdit = editingInkId.value !== null
    const url = isEdit
      ? `/api/customer/${id}/ink/${editingInkId.value}`
      : `/api/customer/${id}/ink`
    const res = await $fetch<any>(url, {
      method: isEdit ? 'PUT' : 'POST',
      query: { token: store.token },
      body: inkForm,
    })
    if (res.success) {
      showInkModal.value = false
      await loadInks(inksPage.value)
    } else {
      inkError.value = res.message || 'Erro ao salvar cor.'
    }
  } catch (e: any) {
    inkError.value = e?.data?.message || 'Erro ao salvar cor.'
  } finally {
    savingInk.value = false
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
              <dt class="text-xs text-gray-400">Endereço</dt>
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
        <div class="flex justify-end mb-4">
          <button
            @click="openContactModal"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Contato
          </button>
        </div>

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
                  <th class="px-6 py-3"></th>
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
                  <td class="px-6 py-4 text-right">
                    <button
                      @click="openContactModal(contact)"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Editar
                    </button>
                  </td>
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
        <div class="flex justify-end mb-4">
          <button
            @click="openInkModal"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Cor
          </button>
        </div>

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
                  <th class="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="ink in inks" :key="ink.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">{{ ink.colorName || '—' }}</td>
                  <td class="px-6 py-4 text-gray-600 font-mono">{{ ink.pantoneCode || '—' }}</td>
                  <td class="px-6 py-4 text-right">
                    <button
                      @click="openInkModal(ink)"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Editar
                    </button>
                  </td>
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

    <!-- ── Modal editar cliente ──────────────────────────────────────────────── -->
    <UiModal :open="showEditModal" title="Editar Cliente" size="xl" @close="showEditModal = false">
      <form @submit.prevent="saveCustomer" id="form-edit-customer">
        <FormsCustomerForm
          :form="form"
          mode="edit"
          :vendedores-options="vendedoresOptions"
          :contadores-options="contadoresOptions"
        />
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
          type="button"
          @click="saveCustomer"
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

    <!-- ── Modal adicionar contato ───────────────────────────────────────────── -->
    <UiModal :open="showContactModal" :title="editingContactId ? 'Editar Contato' : 'Adicionar Contato'" size="lg" @close="showContactModal = false">
      <div v-if="loadingContact" class="flex justify-center items-center py-12">
        <svg class="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <form v-else @submit.prevent="saveContact">
        <FormsContactForm :form="contactForm" :mode="editingContactId ? 'edit' : 'create'" />
        <p v-if="contactError" class="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ contactError }}
        </p>
      </form>

      <template #footer>
        <button
          type="button"
          @click="showContactModal = false"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="saveContact"
          :disabled="savingContact"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          <svg v-if="savingContact" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ savingContact ? 'Salvando...' : 'Salvar' }}
        </button>
      </template>
    </UiModal>

    <!-- ── Modal adicionar cor ───────────────────────────────────────────────── -->
    <UiModal :open="showInkModal" :title="editingInkId ? 'Editar Cor' : 'Adicionar Cor'" size="sm" @close="showInkModal = false">
      <form @submit.prevent="saveInk">
        <FormsInkForm :form="inkForm" mode="create" />
        <p v-if="inkError" class="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ inkError }}
        </p>
      </form>

      <template #footer>
        <button
          type="button"
          @click="showInkModal = false"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="saveInk"
          :disabled="savingInk"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          <svg v-if="savingInk" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ savingInk ? 'Salvando...' : 'Salvar' }}
        </button>
      </template>
    </UiModal>

  </div>
</template>
