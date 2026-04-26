<script setup lang="ts">

const session = sessionStore()
const router = useRouter()
const route = useRoute()

const id = route.params.id as string
const loading = ref(false)
const editing = ref(false)
const showConfirmDelete = ref(false)

const customer = ref({
  name: '',
  officialName: '',
  document: '',
  phone: '',
  email: '',
  whatsapp: '',
  sector: '',
  website: '',
  inscrest: '',
  inscrmun: '',
  inscprodrur: '',
  cei: '',
  active: true,
  zipcode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  accountantid: '',
  salespersonid: ''
})

const pendingCustomer = useState<Customer | null>('pendingCustomer', () => null)

const fetchCustomer = async (query: string) => {
  const { success, data } = await $fetch(`/api/customer/${id}`, {
    query: { query, token: session.token }
  })
  if (success && data) {
    customer.value.name = data.name ?? customer.value.name
    customer.value.officialName = data.officialName ?? customer.value.officialName
    customer.value.document = data.cnpj ?? customer.value.document
    customer.value.city = data.city ?? customer.value.city
    customer.value.state = data.state ?? customer.value.state
  }
}

onMounted(async () => {
  const state = pendingCustomer.value
  if (state) {
    customer.value.name = state.name ?? ''
    customer.value.officialName = state.officialName ?? ''
    customer.value.document = state.cnpj ?? ''
    customer.value.city = state.city ?? ''
    customer.value.state = state.state ?? ''
    customer.value.active = state.active ?? true
    pendingCustomer.value = null
  }

  const searchTerm = customer.value.document || customer.value.name
  if (searchTerm) await fetchCustomer(searchTerm)
})

const customerName = computed(() => customer.value.officialName || customer.value.name || `Cliente #${id}`)

const saveError = ref('')

const handleSave = async () => {
  loading.value = true
  saveError.value = ''
  const { success, message } = await $fetch(`/api/customer/${id}`, {
    method: 'PUT',
    body: { ...customer.value, token: session.token }
  }).finally(() => loading.value = false)

  if (success) {
    editing.value = false
  } else {
    saveError.value = message || 'Erro ao salvar'
  }
}

const handleDelete = async () => {
  loading.value = true
  const { success } = await $fetch(`/api/customer/${id}`, {
    method: 'DELETE',
    query: { token: session.token }
  }).finally(() => loading.value = false)

  if (success) router.push('/clientes')
}

</script>

<template>
  <div class="max-w-5xl mx-auto">

    <UiBreadcrumb :items="[{ label: 'Clientes', to: '/clientes' }, { label: customerName }]" />

    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ customerName }}</h1>
      <div v-if="!editing" class="flex gap-3">
        <button @click="editing = true" class="btn-primary">Editar</button>
        <button
          @click="showConfirmDelete = true"
          class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
        >
          Desativar
        </button>
      </div>
    </div>

    <div v-if="showConfirmDelete" class="mb-6 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-5 py-4">
      <p class="text-sm text-red-700 font-medium">Tem certeza que deseja desativar este cliente?</p>
      <div class="flex gap-3 ml-4 shrink-0">
        <button @click="showConfirmDelete = false" class="text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
        <button
          @click="handleDelete"
          :disabled="loading"
          class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Desativando...' : 'Confirmar' }}
        </button>
      </div>
    </div>

    <div class="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 md:p-8">

      <!-- Identificação -->
      <div class="form-section">
        <h2 class="form-section-title">Identificação</h2>
        <p class="form-section-desc">Dados principais do cliente</p>
      </div>
      <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="form-group">
          <label class="form-label">Nome Fantasia</label>
          <input v-if="editing" type="text" v-model="customer.name" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.name || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">Razão Social</label>
          <input v-if="editing" type="text" v-model="customer.officialName" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.officialName || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">CPF / CNPJ</label>
          <input v-if="editing" type="text" v-model="customer.document" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.document || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">Segmento</label>
          <input v-if="editing" type="text" v-model="customer.sector" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.sector || '—' }}</p>
        </div>
        <div class="form-group sm:col-span-2">
          <label class="form-label">Website</label>
          <input v-if="editing" type="text" v-model="customer.website" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.website || '—' }}</p>
        </div>
      </div>

      <!-- Contato -->
      <div class="form-section">
        <h2 class="form-section-title">Contato</h2>
      </div>
      <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="form-group">
          <label class="form-label">E-mail</label>
          <input v-if="editing" type="email" v-model="customer.email" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.email || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">Telefone</label>
          <input v-if="editing" type="text" v-model="customer.phone" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.phone || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp</label>
          <input v-if="editing" type="text" v-model="customer.whatsapp" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.whatsapp || '—' }}</p>
        </div>
      </div>

      <!-- Dados Fiscais -->
      <div class="form-section">
        <h2 class="form-section-title">Dados Fiscais</h2>
      </div>
      <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="form-group">
          <label class="form-label">Inscrição Estadual</label>
          <input v-if="editing" type="text" v-model="customer.inscrest" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.inscrest || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">Inscrição Municipal</label>
          <input v-if="editing" type="text" v-model="customer.inscrmun" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.inscrmun || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">Inscrição Produtor Rural</label>
          <input v-if="editing" type="text" v-model="customer.inscprodrur" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.inscprodrur || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">CEI</label>
          <input v-if="editing" type="text" v-model="customer.cei" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.cei || '—' }}</p>
        </div>
      </div>

      <!-- Endereço -->
      <div class="form-section">
        <h2 class="form-section-title">Endereço</h2>
      </div>
      <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-6">
        <div class="form-group sm:col-span-2">
          <label class="form-label">CEP</label>
          <input v-if="editing" type="text" v-model="customer.zipcode" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.zipcode || '—' }}</p>
        </div>
        <div class="form-group sm:col-span-3">
          <label class="form-label">Rua</label>
          <input v-if="editing" type="text" v-model="customer.street" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.street || '—' }}</p>
        </div>
        <div class="form-group sm:col-span-1">
          <label class="form-label">Número</label>
          <input v-if="editing" type="text" v-model="customer.number" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.number || '—' }}</p>
        </div>
        <div class="form-group sm:col-span-3">
          <label class="form-label">Complemento</label>
          <input v-if="editing" type="text" v-model="customer.complement" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.complement || '—' }}</p>
        </div>
        <div class="form-group sm:col-span-3">
          <label class="form-label">Bairro</label>
          <input v-if="editing" type="text" v-model="customer.neighborhood" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.neighborhood || '—' }}</p>
        </div>
        <div class="form-group sm:col-span-4">
          <label class="form-label">Cidade</label>
          <input v-if="editing" type="text" v-model="customer.city" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.city || '—' }}</p>
        </div>
        <div class="form-group sm:col-span-2">
          <label class="form-label">Estado</label>
          <input v-if="editing" type="text" v-model="customer.state" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.state || '—' }}</p>
        </div>
      </div>

      <!-- Interno -->
      <div class="form-section">
        <h2 class="form-section-title">Interno</h2>
        <p class="form-section-desc">Vínculos internos e status do cliente</p>
      </div>
      <div class="form-section-body grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="form-group">
          <label class="form-label">Contador</label>
          <input v-if="editing" type="text" v-model="customer.accountantid" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.accountantid || '—' }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">Vendedor</label>
          <input v-if="editing" type="text" v-model="customer.salespersonid" class="form-input" />
          <p v-else class="text-sm text-gray-900 py-2">{{ customer.salespersonid || '—' }}</p>
        </div>
      </div>

      <div v-if="saveError" class="mt-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        {{ saveError }}
      </div>

      <div v-if="editing" class="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <label class="form-checkbox-label">
          <input type="checkbox" v-model="customer.active" class="form-checkbox" />
          Cliente Ativo
        </label>
        <div class="flex gap-4">
          <button type="button" @click="editing = false; saveError = ''" class="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">Cancelar</button>
          <button
            type="button"
            @click="handleSave"
            :disabled="loading"
            class="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>

      <div v-else class="mt-8 pt-6 border-t border-gray-100">
        <span class="inline-flex items-center gap-2 text-sm text-gray-500">
          <span :class="['w-2 h-2 rounded-full', customer.active ? 'bg-green-500' : 'bg-red-400']"></span>
          {{ customer.active ? 'Cliente ativo' : 'Cliente inativo' }}
        </span>
      </div>

    </div>
  </div>
</template>
