<script setup lang="ts">
import { sessionStore as useSessionStore } from '~/stores/sessionStore'

definePageMeta({ middleware: ['auth-verification'] })

const route = useRoute()
const id = route.params.id as string
const store = useSessionStore()

const breadcrumb = [
  { label: 'Contadores', to: '/contadores' },
  { label: 'Todos os Contadores', to: '/contadores/listagem' },
  { label: 'Detalhar' },
]

const { data: res, pending, refresh } = await useFetch<any>(`/api/accountant/${id}`, {
  query: { token: store.token }
})

const accountant = computed(() => res.value?.data ?? null)

// ── Edit modal ────────────────────────────────────────────────────────────────
const showEditModal = ref(false)
const saving = ref(false)
const saveError = ref('')

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

function openEditModal() {
  const a = accountant.value
  if (!a) return
  form.name       = a.name       ?? ''
  form.email      = a.email      ?? ''
  form.website    = a.website    ?? ''
  form.telephone1 = a.telephone1 ?? ''
  form.telephone2 = a.telephone2 ?? ''
  form.fax        = a.fax        ?? ''
  form.postalcode = a.postalcode ?? ''
  form.address    = a.address    ?? ''
  form.district   = a.district   ?? ''
  form.city       = a.city       ?? ''
  form.state      = a.state      ?? ''
  saveError.value = ''
  showEditModal.value = true
}

async function salvar() {
  if (!form.name.trim()) {
    saveError.value = 'O nome é obrigatório.'
    return
  }
  saving.value = true
  saveError.value = ''
  try {
    const r = await $fetch<any>(`/api/accountant/${id}`, {
      method: 'PUT',
      query: { token: store.token },
      body: { ...form },
    })
    if (r.success) {
      await refresh()
      showEditModal.value = false
    } else {
      saveError.value = r.message || 'Erro ao salvar. Tente novamente.'
    }
  } catch (e: any) {
    saveError.value = e?.data?.message || 'Erro ao salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-6 md:p-8 bg-gray-50 min-h-screen font-sans w-full">

    <UiBreadcrumb :items="breadcrumb" />

    <div v-if="pending" class="animate-pulse space-y-4 mt-4">
      <div class="h-28 bg-white rounded-xl border border-gray-200"></div>
    </div>

    <template v-else-if="accountant">

      <!-- Header -->
      <header class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 mt-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xl font-bold shrink-0">
              {{ (accountant.name ?? '?')[0].toUpperCase() }}
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ accountant.name || '—' }}</h1>
              <p v-if="accountant.email" class="text-sm text-gray-500 mt-0.5">{{ accountant.email }}</p>
              <p v-if="accountant.city || accountant.state" class="text-xs text-gray-400 mt-0.5">
                {{ [accountant.city, accountant.state].filter(Boolean).join(' — ') }}
              </p>
            </div>
          </div>
          <button
            @click="openEditModal"
            class="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Editar Dados
          </button>
        </div>
      </header>

      <!-- Info grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Contato</h3>
          <dl class="space-y-3">
            <div v-if="accountant.email">
              <dt class="text-xs text-gray-400">E-mail</dt>
              <dd class="text-sm text-gray-800">{{ accountant.email }}</dd>
            </div>
            <div v-if="accountant.website">
              <dt class="text-xs text-gray-400">Website</dt>
              <dd class="text-sm text-gray-800">
                <a :href="accountant.website" target="_blank" class="text-blue-600 hover:underline">{{ accountant.website }}</a>
              </dd>
            </div>
            <div v-if="accountant.telephone1">
              <dt class="text-xs text-gray-400">Telefone 1</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ accountant.telephone1 }}</dd>
            </div>
            <div v-if="accountant.telephone2">
              <dt class="text-xs text-gray-400">Telefone 2</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ accountant.telephone2 }}</dd>
            </div>
            <div v-if="accountant.fax">
              <dt class="text-xs text-gray-400">Fax</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ accountant.fax }}</dd>
            </div>
          </dl>
        </section>

        <section class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Endereço</h3>
          <dl class="space-y-3">
            <div v-if="accountant.address">
              <dt class="text-xs text-gray-400">Logradouro</dt>
              <dd class="text-sm text-gray-800">{{ accountant.address }}</dd>
            </div>
            <div v-if="accountant.district">
              <dt class="text-xs text-gray-400">Bairro</dt>
              <dd class="text-sm text-gray-800">{{ accountant.district }}</dd>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="accountant.city">
                <dt class="text-xs text-gray-400">Cidade</dt>
                <dd class="text-sm text-gray-800">{{ accountant.city }}</dd>
              </div>
              <div v-if="accountant.state">
                <dt class="text-xs text-gray-400">Estado</dt>
                <dd class="text-sm text-gray-800">{{ accountant.state }}</dd>
              </div>
            </div>
            <div v-if="accountant.postalcode">
              <dt class="text-xs text-gray-400">CEP</dt>
              <dd class="text-sm text-gray-800 font-mono">{{ accountant.postalcode }}</dd>
            </div>
          </dl>
        </section>

      </div>

    </template>

    <div v-else class="mt-8 text-center text-sm text-gray-500">Contador não encontrado.</div>

    <!-- Modal editar -->
    <UiModal :open="showEditModal" title="Editar Contador" size="lg" @close="showEditModal = false">
      <form @submit.prevent="salvar">
        <FormsAccountantForm :form="form" mode="edit" />
        <p v-if="saveError" class="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ saveError }}
        </p>
      </form>
      <template #footer>
        <button type="button" @click="showEditModal = false"
          class="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
        <button type="button" @click="salvar" :disabled="saving"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2">
          <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
      </template>
    </UiModal>

  </div>
</template>
